package com.example.library.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String SESSION_AUTH_USER = "AUTH_USER";

    private final InstitutionalAuthService institutionalAuthService;

    public AuthController(InstitutionalAuthService institutionalAuthService) {
        this.institutionalAuthService = institutionalAuthService;
    }

    public static AuthUser getSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object u = session.getAttribute(SESSION_AUTH_USER);
        return (u instanceof AuthUser au) ? au : null;
    }

    @PostMapping("/login")
    public AuthUser login(@RequestBody LoginRequest req, HttpServletRequest request) {
        AuthUser authUser = institutionalAuthService.loginWithEmailPassword(req.email(), req.password());

        // Ensure Spring Security considers the user authenticated for protected routes.
        Authentication authentication = institutionalAuthService.asAuthentication(authUser);
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        request.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        request.getSession(true).setAttribute(SESSION_AUTH_USER, authUser);

        return authUser;
    }

    @GetMapping("/me")
    public AuthUser me(HttpServletRequest request) {
        AuthUser u = getSessionUser(request);
        if (u != null) return u;

        // Fallback for OAuth2 sessions: derive from current authentication if session attribute isn't set.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        AuthUser fromAuth = institutionalAuthService.fromAuthentication(auth);
        if (fromAuth != null) {
            request.getSession(true).setAttribute(SESSION_AUTH_USER, fromAuth);
            return fromAuth;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/logout")
    public Map<String, String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        SecurityContextHolder.clearContext();
        return Map.of("status", "ok");
    }

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
}

