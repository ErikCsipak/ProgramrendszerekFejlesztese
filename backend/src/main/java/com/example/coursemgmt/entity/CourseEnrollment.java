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

    @ManyToOne(optional = false)
    @jakarta.persistence.JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(optional = false)
    @jakarta.persistence.JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "course_id", insertable = false, updatable = false)
    private Long courseIdValue;

    @Column(name = "student_id", insertable = false, updatable = false)
    private Long studentIdValue;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "grade")
    private String grade;

    public Long getCourseId() {
        return courseIdValue != null ? courseIdValue : (course != null ? course.id : null);
    }

    public Long getStudentId() {
        return studentIdValue != null ? studentIdValue : (student != null ? student.id : null);
    }

    @PrePersist
    public void prePersist() {
        this.enrolledAt = LocalDateTime.now();
    }
}
