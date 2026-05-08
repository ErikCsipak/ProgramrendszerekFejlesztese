package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.security.SecurityService;
import com.example.coursemgmt.service.EnrollmentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/enrollments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnrollmentResource {

    @Inject
    EnrollmentService enrollmentService;

    @Inject
    SecurityService securityService;

    @GET
    @Path("/my-courses")
    @RolesAllowed("STUDENT")
    public Response getStudentCourses() {
        Long studentId = securityService.getUserIdOrThrow();
        List<CourseDto> courses = enrollmentService.getStudentCourses(studentId);
        return Response.ok(courses).build();
    }

    @POST
    @Path("/courses/{courseId}/join")
    @RolesAllowed("STUDENT")
    public Response joinCourse(@PathParam("courseId") Long courseId) {
        Long studentId = securityService.getUserIdOrThrow();
        enrollmentService.enrollStudent(courseId, studentId);
        return Response.ok().build();
    }

    @DELETE
    @Path("/courses/{courseId}/leave")
    @RolesAllowed("STUDENT")
    public Response leaveCourse(@PathParam("courseId") Long courseId) {
        Long studentId = securityService.getUserIdOrThrow();
        enrollmentService.unenrollStudent(courseId, studentId);
        return Response.noContent().build();
    }

    @GET
    @Path("/courses/{courseId}/students")
    @RolesAllowed({"TEACHER", "ADMIN"})
    public Response getEnrolledStudents(@PathParam("courseId") Long courseId) {
        List<Long> studentIds = enrollmentService.getEnrolledStudents(courseId);
        return Response.ok(studentIds).build();
    }
}
