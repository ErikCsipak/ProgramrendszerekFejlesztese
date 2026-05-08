package com.example.coursemgmt.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PasswordEncoder {

    public String encode(String rawPassword) {
        Argon2 argon2 = Argon2Factory.create();
        try {
            // Argon2 with sensible defaults: iterations=2, memory=65536KB, parallelism=1
            return argon2.hash(2, 65536, 1, rawPassword.toCharArray());
        } finally {
            argon2.wipeArray(rawPassword.toCharArray());
        }
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        Argon2 argon2 = Argon2Factory.create();
        try {
            return argon2.verify(encodedPassword, rawPassword.toCharArray());
        } finally {
            argon2.wipeArray(rawPassword.toCharArray());
        }
    }
}

