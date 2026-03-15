package com.example.library.security;

import com.example.library.enums.UserRole;
import com.example.library.model.User;
import com.example.library.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class InstitutionalAuthService {

    public static final String ADMIN_EMAIL = "golivignesh@gmail.com";
    public static final String INSTITUTION_DOMAIN = "@mlrit.ac.in";

    private final UserRepository userRepository;

    public InstitutionalAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthUser loginWithEmailPassword(String emailRaw, String passwordRaw) {
        String email = normalizeEmail(emailRaw);
        if (!isInstitutionEmail(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access is restricted to official MLRIT accounts");
        }

        String roll = email.substring(0, email.indexOf('@'));
        String password = passwordRaw == null ? "" : passwordRaw.trim().toLowerCase(Locale.ROOT);
        if (!password.equals(roll)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        User user = userRepository.findByRollNumberIgnoreCase(roll.toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Roll number not found in institutional dataset"));

        if (user.getRole() == null) user.setRole(UserRole.STUDENT);
        userRepository.save(user);

        return toAuthUser(user, null);
    }

    public AuthUser handleGoogleLogin(OAuth2User oauth2User) {
        String email = normalizeEmail((String) oauth2User.getAttributes().get("email"));
        String googleName = Optional.ofNullable((String) oauth2User.getAttributes().get("name")).orElse(email);
        String picture = (String) oauth2User.getAttributes().get("picture");

        if (ADMIN_EMAIL.equalsIgnoreCase(email)) {
            User admin = upsertUser(email, googleName, "ADMIN", "ADMIN", UserRole.ADMIN);
            return toAuthUser(admin, picture);
        }

        if (!isInstitutionEmail(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access is restricted to official MLRIT accounts");
        }

        // Allow any *@mlrit.ac.in even if not in CSV. Treat as STUDENT.
        String roll = email.substring(0, email.indexOf('@')).toUpperCase(Locale.ROOT);

        // Prefer existing CSV-backed student (keeps official name) if present.
        User user = userRepository.findByRollNumberIgnoreCase(roll)
                .orElseGet(() -> userRepository.findByEmail(email).orElseGet(User::new));

        if (user.getId() == null) {
            user.setEmail(email);
            user.setRollNumber(roll);
        }

        // Only overwrite name if it was never set (no CSV entry).
        if (user.getName() == null || user.getName().isBlank()) {
            user.setName(googleName);
        }
        if (user.getBranch() == null || user.getBranch().isBlank()) {
            user.setBranch("NA");
        }
        user.setRole(UserRole.STUDENT);
        userRepository.save(user);

        return toAuthUser(user, picture);
    }

    private User upsertUser(String email, String name, String rollNumber, String branch, UserRole role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        if (user.getId() == null) user.setEmail(email);
        user.setName(name);
        user.setRollNumber(rollNumber);
        user.setBranch(branch);
        user.setRole(role);
        return userRepository.save(user);
    }

    public Authentication asAuthentication(AuthUser user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.role().name()));
        return new UsernamePasswordAuthenticationToken(user.email(), "N/A", authorities);
    }

    public AuthUser fromAuthentication(Authentication auth) {
        if (auth == null) return null;

        // OAuth2 login
        Object principal = auth.getPrincipal();
        if (principal instanceof OAuth2User o) {
            // For OAuth2 sessions, ensure user exists in DB and map it.
            AuthUser u = handleGoogleLogin(o);
            return u;
        }

        // Email/password login stores AuthUser in session; if missing, best-effort lookup by email
        Object name = auth.getName();
        if (name instanceof String email) {
            return userRepository.findByEmail(normalizeEmail(email))
                    .map(u -> toAuthUser(u, null))
                    .orElse(null);
        }
        return null;
    }

    private static AuthUser toAuthUser(User u, String pictureUrl) {
        UserRole role = u.getRole() == UserRole.USER ? UserRole.STUDENT : u.getRole();
        return new AuthUser(
                u.getId(),
                u.getEmail(),
                u.getName(),
                pictureUrl,
                u.getRollNumber(),
                u.getBranch(),
                role
        );
    }

    private static String normalizeEmail(String email) {
        if (email == null) return "";
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static boolean isInstitutionEmail(String email) {
        return email.endsWith(INSTITUTION_DOMAIN);
    }
}

