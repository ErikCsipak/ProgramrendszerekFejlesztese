package com.example.coursemgmt.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "course_enrollment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseEnrollment extends PanacheEntity {

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "grade")
    private String grade;

    @PrePersist
    public void prePersist() {
        this.enrolledAt = LocalDateTime.now();
    }
}
