package com.example.coursemgmt.security;

import com.example.coursemgmt.entity.User;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class JwtTokenProvider {

    private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds

    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiration = now.plus(Duration.ofMillis(EXPIRATION_TIME));

        Set<String> roles = new HashSet<>();
        roles.add(user.getRole().name());

        return Jwt.issuer("https://example.com")
                .subject(user.getEmail())
                .issuedAt(now)
                .expiresAt(expiration)
                .claim("id", user.id)
                .claim("email", user.getEmail())
                .claim("fullName", user.getFullName())
                .claim("role", user.getRole().name())
                .sign();
    }

    public String generateRefreshToken(User user) {
        Instant now = Instant.now();
        Instant expiration = now.plus(Duration.ofDays(7));

        return Jwt.issuer("https://example.com")
                .subject(user.getEmail())
                .issuedAt(now)
                .expiresAt(expiration)
                .claim("id", user.id)
                .claim("type", "refresh")
                .sign();
    }
}
