package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.service.EnrollmentService;
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
    private EnrollmentService enrollmentService;

    @GET
    @Path("/my-courses")
    public Response getStudentCourses(@QueryParam("studentId") Long studentId) {
        List<CourseDto> courses = enrollmentService.getStudentCourses(studentId);
        return Response.ok(courses).build();
    }

    @POST
    @Path("/courses/{courseId}/join")
    public Response joinCourse(@PathParam("courseId") Long courseId, @QueryParam("studentId") Long studentId) {
        enrollmentService.enrollStudent(courseId, studentId);
        return Response.ok().entity("Successfully joined course").build();
    }

    @DELETE
    @Path("/courses/{courseId}/leave")
    public Response leaveCourse(@PathParam("courseId") Long courseId, @QueryParam("studentId") Long studentId) {
        enrollmentService.unenrollStudent(courseId, studentId);
        return Response.noContent().build();
    }

    @GET
    @Path("/courses/{courseId}/students")
    public Response getEnrolledStudents(@PathParam("courseId") Long courseId) {
        List<Long> studentIds = enrollmentService.getEnrolledStudents(courseId);
        return Response.ok(studentIds).build();
    }
}
