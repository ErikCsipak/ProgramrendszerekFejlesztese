package com.example.coursemgmt.service;

import com.example.coursemgmt.dto.LoginRequest;
import com.example.coursemgmt.dto.LoginResponse;
import com.example.coursemgmt.dto.RegisterRequest;
import com.example.coursemgmt.dto.UserDto;
import com.example.coursemgmt.entity.User;
import com.example.coursemgmt.exception.BadRequestException;
import com.example.coursemgmt.exception.NotFoundException;
import com.example.coursemgmt.exception.UnauthorizedException;
import com.example.coursemgmt.security.JwtTokenProvider;
import com.example.coursemgmt.security.PasswordEncoder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService {

    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Password is required");
        }

        try {
            User user = User.find("email", request.getEmail()).firstResult();
            if (user == null) {
                throw new UnauthorizedException("Invalid credentials");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new UnauthorizedException("Invalid credentials");
            }

            if (!user.getActive()) {
                throw new UnauthorizedException("User account is inactive");
            }

            String token = jwtTokenProvider.generateToken(user);
            return LoginResponse.from(token, user);
        } catch (NoResultException e) {
            throw new UnauthorizedException("Invalid credentials");
        }
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        if (request.getFullName() == null || request.getFullName().isEmpty()) {
            throw new BadRequestException("Full name is required");
        }

        // Check if user already exists
        User existingUser = (User) User.find("email", request.getEmail()).firstResultOptional().orElse(null);
        if (existingUser != null) {
            throw new BadRequestException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(User.UserRole.STUDENT);
        user.setActive(true);

        user.persist();
        return UserDto.from(user);
    }

    public User getUserByEmail(String email) {
        return (User) User.find("email", email).firstResultOptional()
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User getUserById(Long id) {
        return (User) User.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
