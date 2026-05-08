package com.example.coursemgmt.security;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class JwtTokenProvider {

    private static final long TOKEN_EXPIRY_HOURS = 24;
    private static final String ISSUER = "coursemgmt";

    public String generateToken(Long userId, String email, String role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(Duration.ofHours(TOKEN_EXPIRY_HOURS));

        // Build the groups claim from the role (Quarkus SmallRye JWT uses 'groups' claim for roles)
        Set<String> groups = new HashSet<>();
        groups.add(role);

        return Jwt.issuer(ISSUER)
            .subject(email)
            .claim("sub", email)
            .claim("email", email)
            .claim("userId", userId)
            .claim("groups", groups)
            .expiresAt(expiresAt)
            .issuedAt(now)
            .sign();
    }
}


