package com.example.coursemgmt.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.security.jpa.Password;
import io.quarkus.security.jpa.Roles;
import io.quarkus.security.jpa.UserDefinition;
import io.quarkus.security.jpa.Username;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "\"user\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "passwordHash")
@UserDefinition
public class User extends PanacheEntity {

    @Column(unique = true, nullable = false)
    @Username
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name="password_hash", nullable = false)
    @Password
    private String passwordHash;

    @Column(name="full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    @Roles
    private String role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum UserRole {
        ADMIN,
        TEACHER,
        STUDENT
    }
}
