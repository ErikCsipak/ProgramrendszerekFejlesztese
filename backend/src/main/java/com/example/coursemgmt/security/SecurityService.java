package com.example.coursemgmt.security;

import io.quarkus.logging.Log;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.security.Principal;
import java.util.Optional;

@RequestScoped
public class SecurityService {

    @Inject
    SecurityIdentity identity;

    public Optional<Long> getUserId() {
        Principal principal = identity.getPrincipal();
        if (principal instanceof JsonWebToken jwt) {
            Object userIdObj = jwt.getClaim("userId");
            Log.debug("Extracted userId claim: " + userIdObj.toString());
            if (userIdObj != null) {
                try {
                    if (userIdObj instanceof Number) {
                        return Optional.of(((Number) userIdObj).longValue());
                    } else if (userIdObj instanceof Long) {
                        return Optional.of((Long) userIdObj);
                    } else {
                        // Try to convert string to long
                        return Optional.of(Long.parseLong(userIdObj.toString()));
                    }
                } catch (Exception e) {
                    return Optional.empty();
                }
            }
        }
        return Optional.empty();
    }

    public Long getUserIdOrThrow() {
        return getUserId().orElseThrow(() -> new IllegalStateException("User not authenticated"));
    }

    public String getEmail() {
        Principal principal = identity.getPrincipal();
        if (principal instanceof JsonWebToken jwt) {
            return jwt.getClaim("email");
        }
        return null;
    }

    public Optional<String> getUserRole() {
        // Quarkus maps the 'groups' claim to roles
        return identity.getRoles().stream().findFirst();
    }

    public boolean hasRole(String role) {
        return identity.getRoles().contains(role);
    }

    public boolean isAuthenticated() {
        try {
            return !identity.isAnonymous();
        } catch (Exception e) {
            return identity.getPrincipal() != null;
        }
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }

    public boolean isTeacher() {
        return hasRole("TEACHER");
    }

    public boolean isStudent() {
        return hasRole("STUDENT");
    }
}

