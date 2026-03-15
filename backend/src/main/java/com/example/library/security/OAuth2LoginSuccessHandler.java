package com.example.library.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final InstitutionalAuthService institutionalAuthService;
    private final String frontendUrl;

    public OAuth2LoginSuccessHandler(InstitutionalAuthService institutionalAuthService,
                                     @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.institutionalAuthService = institutionalAuthService;
        this.frontendUrl = frontendUrl.replaceAll("/$", "");
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        try {
            // Ensure the user is validated + persisted (role assignment) and cache in session for /api/auth/me.
            AuthUser u = institutionalAuthService.fromAuthentication(authentication);
            if (u != null) {
                request.getSession(true).setAttribute("AUTH_USER", u);

                // Replace Spring Security Authentication with our role-aware one.
                Authentication authWithRoles = institutionalAuthService.asAuthentication(u);
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authWithRoles);
                SecurityContextHolder.setContext(context);
                request
                    .getSession(true)
                    .setAttribute(
                        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                        context
                    );
            }

            // Redirect back to frontend after Google login.
            response.sendRedirect(frontendUrl + "/");
        } catch (ResponseStatusException ex) {
            // Domain not allowed or other auth restriction. Send user back to login with a flag.
            response.sendRedirect(frontendUrl + "/login?restricted=1");
        }
    }
}

