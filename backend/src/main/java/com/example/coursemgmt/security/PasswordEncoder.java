package com.example.coursemgmt.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PasswordEncoder {

    private static final Argon2 argon2 = Argon2Factory.create();

    public String encode(String rawPassword) {
        return argon2.hash(2, 65536, 1, rawPassword);
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return argon2.verify(encodedPassword, rawPassword);
    }
}
