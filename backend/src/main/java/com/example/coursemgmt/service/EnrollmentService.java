package com.example.coursemgmt.service;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.entity.Course;
import com.example.coursemgmt.entity.CourseEnrollment;
import com.example.coursemgmt.entity.User;
import com.example.coursemgmt.exception.BadRequestException;
import com.example.coursemgmt.exception.NotFoundException;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class EnrollmentService {

    private final CourseService courseService;

    public EnrollmentService(CourseService courseService) {
        this.courseService = courseService;
    }

    public List<CourseDto> getStudentCourses(Long studentId) {
        List<CourseEnrollment> enrollments = CourseEnrollment.find("student.id", studentId).list();
        return enrollments.stream()
                .map(e -> courseService.getCourseById(e.getCourseId()))
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        // Check if course exists and can be enrolled
        Course course = courseService.getCourseById(courseId);

        if (!course.canEnroll()) {
            throw new BadRequestException("Course is not available for enrollment");
        }

        // Check if already enrolled
        CourseEnrollment existing = (CourseEnrollment) CourseEnrollment.find("course.id = ?1 AND student.id = ?2", courseId, studentId)
                .firstResultOptional()
                .orElse(null);

        if (existing != null) {
            throw new BadRequestException("Student is already enrolled in this course");
        }

        Log.debug(studentId);

        // Create enrollment
        User student = (User) User.findByIdOptional(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found"));

        CourseEnrollment enrollment = new CourseEnrollment();
        enrollment.setCourse(course);
        enrollment.setStudent(student);
        enrollment.persist();

        // Update current enrollment count
        course.setCurrentEnrollment(course.getCurrentEnrollment() + 1);
        course.persist();
    }

    @Transactional
    public void unenrollStudent(Long courseId, Long studentId) {
        CourseEnrollment enrollment = (CourseEnrollment) CourseEnrollment.find("course.id = ?1 AND student.id = ?2", courseId, studentId)
                .firstResultOptional()
                .orElseThrow(() -> new NotFoundException("Enrollment not found"));

        Course course = courseService.getCourseById(courseId);
        course.setCurrentEnrollment(course.getCurrentEnrollment() - 1);
        course.persist();

        enrollment.delete();
    }

    public List<Long> getEnrolledStudents(Long courseId) {
        return CourseEnrollment.find("course.id", courseId).list().stream()
                .map(id -> {
                    CourseEnrollment ce = (CourseEnrollment) id;
                    return ce.getStudentId();
                })
                .collect(Collectors.toList());
    }

    public boolean isEnrolled(Long courseId, Long studentId) {
        return CourseEnrollment.find("course.id = ?1 AND student.id = ?2", courseId, studentId)
                .firstResultOptional()
                .isPresent();
    }
}
