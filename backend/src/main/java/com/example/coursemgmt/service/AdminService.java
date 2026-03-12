package com.example.coursemgmt.service;

import com.example.coursemgmt.dto.UserDto;
import com.example.coursemgmt.entity.User;
import com.example.coursemgmt.exception.BadRequestException;
import com.example.coursemgmt.exception.NotFoundException;
import com.example.coursemgmt.security.PasswordEncoder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class AdminService {

    @Inject
    private PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        List<User> users = User.listAll();
        return users.stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long userId) {
        User user = (User) User.findByIdOptional(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto createUser(String email, String password, String fullName, String role) {
        if (email == null || email.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (password == null || password.isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        if (fullName == null || fullName.isEmpty()) {
            throw new BadRequestException("Full name is required");
        }
        if (role == null || role.isEmpty()) {
            throw new BadRequestException("Role is required");
        }

        // Validate role
        User.UserRole userRole;
        try {
            userRole = User.UserRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + role);
        }

        // Check if user already exists
        User existingUser = (User) User.find("email", email).firstResultOptional().orElse(null);
        if (existingUser != null) {
            throw new BadRequestException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(userRole);
        user.setActive(true);

        user.persist();
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateUser(Long userId, String email, String fullName, Boolean active) {
        User user = (User) User.findByIdOptional(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (email != null && !email.isEmpty()) {
            // Check if new email already exists for another user
            User existing = (User) User.find("email", email).firstResultOptional().orElse(null);
            if (existing != null && !existing.id.equals(userId)) {
                throw new BadRequestException("Email already in use");
            }
            user.setEmail(email);
        }

        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }

        if (active != null) {
            user.setActive(active);
        }

        user.persist();
        return UserDto.from(user);
    }
}
