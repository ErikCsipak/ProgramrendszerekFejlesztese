package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.service.EnrollmentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;

@Path("/api/enrollments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnrollmentResource {

    @Inject
    private EnrollmentService enrollmentService;

    @Inject
    private JsonWebToken jwtPrincipal;

    @GET
    @Path("/my-courses")
    @RolesAllowed("STUDENT")
    public Response getStudentCourses() {
        Long studentId = jwtPrincipal.getClaim("id");
        List<CourseDto> courses = enrollmentService.getStudentCourses(studentId);
        return Response.ok(courses).build();
    }

    @POST
    @Path("/courses/{courseId}/join")
    @RolesAllowed("STUDENT")
    public Response joinCourse(@PathParam("courseId") Long courseId) {
        Long studentId = jwtPrincipal.getClaim("id");
        enrollmentService.enrollStudent(courseId, studentId);
        return Response.ok().entity("Successfully joined course").build();
    }

    @DELETE
    @Path("/courses/{courseId}/leave")
    @RolesAllowed("STUDENT")
    public Response leaveCourse(@PathParam("courseId") Long courseId) {
        Long studentId = jwtPrincipal.getClaim("id");
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
