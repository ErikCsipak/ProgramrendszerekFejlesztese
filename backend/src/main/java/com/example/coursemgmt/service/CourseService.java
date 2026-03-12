package com.example.coursemgmt.service;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.dto.CreateCourseRequest;
import com.example.coursemgmt.entity.Course;
import com.example.coursemgmt.entity.CourseSchedule;
import com.example.coursemgmt.exception.BadRequestException;
import com.example.coursemgmt.exception.ForbiddenException;
import com.example.coursemgmt.exception.NotFoundException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CourseService {

    @Transactional
    public CourseDto createCourse(Long teacherId, CreateCourseRequest request) {
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new BadRequestException("Course name is required");
        }
        if (request.getMaxStudents() == null || request.getMaxStudents() <= 0) {
            throw new BadRequestException("Max students must be greater than 0");
        }

        Course course = new Course();
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setTeacherId(teacherId);
        course.setStatus(Course.CourseStatus.IN_PLAN);
        course.setMaxStudents(request.getMaxStudents());
        course.setCurrentEnrollment(0);

        course.persist();

        // Add schedules if provided
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            for (var scheduleDto : request.getSchedules()) {
                CourseSchedule schedule = new CourseSchedule();
                schedule.setCourseId(course.id);
                schedule.setDayOfWeek(scheduleDto.getDayOfWeek());
                schedule.setStartTime(scheduleDto.getStartTime());
                schedule.setEndTime(scheduleDto.getEndTime());
                schedule.setLocation(scheduleDto.getLocation());
                schedule.persist();
                course.getSchedules().add(schedule);
            }
        }

        return CourseDto.from(course);
    }

    @Transactional
    public CourseDto updateCourse(Long courseId, Long teacherId, CreateCourseRequest request) {
        Course course = getCourseById(courseId);

        // Only teacher who owns the course can edit
        if (!course.getTeacherId().equals(teacherId)) {
            throw new ForbiddenException("You can only edit your own courses");
        }

        // Can only edit if in IN_PLAN status
        if (course.getStatus() != Course.CourseStatus.IN_PLAN) {
            throw new BadRequestException("Can only edit courses that are in IN_PLAN status");
        }

        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setMaxStudents(request.getMaxStudents());

        // Update schedules
        course.getSchedules().clear();
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            for (var scheduleDto : request.getSchedules()) {
                CourseSchedule schedule = new CourseSchedule();
                schedule.setCourseId(course.id);
                schedule.setDayOfWeek(scheduleDto.getDayOfWeek());
                schedule.setStartTime(scheduleDto.getStartTime());
                schedule.setEndTime(scheduleDto.getEndTime());
                schedule.setLocation(scheduleDto.getLocation());
                schedule.persist();
                course.getSchedules().add(schedule);
            }
        }

        course.persist();
        return CourseDto.from(course);
    }

    public CourseDto getCourseDto(Long courseId) {
        Course course = getCourseById(courseId);
        return CourseDto.from(course);
    }

    public Course getCourseById(Long courseId) {
        return (Course) Course.findByIdOptional(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));
    }

    public List<CourseDto> getAvailableCourses() {
        List<Course> courses = Course.find("status", Course.CourseStatus.APPROVED).list();
        return courses.stream()
                .filter(c -> !c.isFull())
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getAllCourses() {
        List<Course> courses = Course.listAll();
        return courses.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getTeacherCourses(Long teacherId) {
        List<Course> courses = Course.find("teacherId", teacherId).list();
        return courses.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getPendingCourses() {
        List<Course> courses = Course.find("status", Course.CourseStatus.IN_PLAN).list();
        return courses.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCourse(Long courseId, Long userId, String userRole) {
        Course course = getCourseById(courseId);

        // Only teacher who owns it or admin can delete
        if (!"ADMIN".equals(userRole) && !course.getTeacherId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own courses");
        }

        // Cannot delete if there are enrollments
        if (course.getCurrentEnrollment() > 0) {
            throw new BadRequestException("Cannot delete course with enrolled students");
        }

        course.delete();
    }

    @Transactional
    public CourseDto approveCourse(Long courseId, Long adminId) {
        Course course = getCourseById(courseId);

        if (course.getStatus() != Course.CourseStatus.IN_PLAN) {
            throw new BadRequestException("Can only approve courses in IN_PLAN status");
        }

        course.setStatus(Course.CourseStatus.APPROVED);
        course.setApprovedBy(adminId);
        course.setApprovedAt(java.time.LocalDateTime.now());
        course.persist();

        return CourseDto.from(course);
    }

    @Transactional
    public void rejectCourse(Long courseId) {
        Course course = getCourseById(courseId);

        if (course.getStatus() != Course.CourseStatus.IN_PLAN) {
            throw new BadRequestException("Can only reject courses in IN_PLAN status");
        }

        course.setStatus(Course.CourseStatus.ARCHIVED);
        course.persist();
    }
}
