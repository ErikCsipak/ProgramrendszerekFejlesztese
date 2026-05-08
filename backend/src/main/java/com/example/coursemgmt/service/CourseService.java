package com.example.coursemgmt.service;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.dto.CreateCourseRequest;
import com.example.coursemgmt.entity.Course;
import com.example.coursemgmt.entity.CourseSchedule;
import com.example.coursemgmt.exception.BadRequestException;
import com.example.coursemgmt.exception.ForbiddenException;
import com.example.coursemgmt.exception.NotFoundException;
import com.example.coursemgmt.security.SecurityService;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CourseService {

    @Inject
    SecurityService securityService;

    @Transactional
    public CourseDto createCourse(CreateCourseRequest request) {
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new BadRequestException("Course name is required");
        }
        if (request.getMaxStudents() == null || request.getMaxStudents() <= 0) {
            throw new BadRequestException("Max students must be greater than 0");
        }

        // Teachers create courses; courses start in IN_PLAN status until admin approves
        Long teacherId = securityService.getUserIdOrThrow();

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
                schedule.setCourse(course);
                schedule.setDayOfWeek(scheduleDto.getDayOfWeek());
                schedule.setStartTime(scheduleDto.getStartTime());
                schedule.setEndTime(scheduleDto.getEndTime());
                schedule.setLocation(scheduleDto.getLocation());
                schedule.persist();
            }
        }

        return CourseDto.from(course);
    }

    @Transactional
    public CourseDto updateCourse(Long courseId, CreateCourseRequest request) {
        Course course = getCourseById(courseId);

        // Teachers can only modify courses that are in IN_PLAN status and that they created
        Long currentTeacherId = securityService.getUserIdOrThrow();
        if (!course.getTeacherId().equals(currentTeacherId)) {
            throw new ForbiddenException("You can only modify courses that you created");
        }

        // Can only edit if in IN_PLAN status
        if (course.getStatus() != Course.CourseStatus.IN_PLAN) {
            throw new BadRequestException("Can only edit courses that are in IN_PLAN status");
        }

        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setMaxStudents(request.getMaxStudents());

        // Delete old schedules and add new ones
        for (CourseSchedule schedule : course.getSchedules().stream().collect(Collectors.toList())) {
            schedule.delete();
        }

        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            for (var scheduleDto : request.getSchedules()) {
                CourseSchedule schedule = new CourseSchedule();
                schedule.setCourse(course);
                schedule.setDayOfWeek(scheduleDto.getDayOfWeek());
                schedule.setStartTime(scheduleDto.getStartTime());
                schedule.setEndTime(scheduleDto.getEndTime());
                schedule.setLocation(scheduleDto.getLocation());
                schedule.persist();
            }
        }

        course.persist();
        return CourseDto.from(course);
    }

    @Transactional
    public CourseDto getCourseDto(Long courseId) {
        Course course = getCourseById(courseId);
        return CourseDto.from(course);
    }

    public Course getCourseById(Long courseId) {
        return (Course) Course.findByIdOptional(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));
    }

    @Transactional
    public List<CourseDto> getAvailableCourses() {
        List<Course> courseList = Course.list("status", Course.CourseStatus.APPROVED);
        Log.debug("Found " + courseList.size() + " approved courses");
        return courseList.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CourseDto> getAllCourses() {
        List<Course> courses = Course.listAll();
        return courses.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CourseDto> getTeacherCourses(Long teacherId) {
        List<Course> courses = Course.find("teacherId", teacherId).list();
        return courses.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CourseDto> getPendingCourses() {
        List<Course> courses = Course.find("status", Course.CourseStatus.IN_PLAN).list();
        return courses.stream()
                .map(CourseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = getCourseById(courseId);

        // Teachers can only delete courses they created
        Long currentTeacherId = securityService.getUserIdOrThrow();
        if (!course.getTeacherId().equals(currentTeacherId)) {
            throw new ForbiddenException("You can only delete courses that you created");
        }

        // Cannot delete if there are enrollments
        if (course.getCurrentEnrollment() > 0) {
            throw new BadRequestException("Cannot delete course with enrolled students");
        }

        course.delete();
    }

    @Transactional
    public CourseDto approveCourse(Long courseId) {
        Course course = getCourseById(courseId);

        if (course.getStatus() != Course.CourseStatus.IN_PLAN) {
            throw new BadRequestException("Can only approve courses in IN_PLAN status");
        }

        Long adminId = securityService.getUserIdOrThrow();
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


