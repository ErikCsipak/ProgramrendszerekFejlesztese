package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.dto.CreateCourseRequest;
import com.example.coursemgmt.service.CourseService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;

@Path("/api/courses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseResource {

    @Inject
    private CourseService courseService;

    @Inject
    private JsonWebToken jwtPrincipal;

    @GET
    @Path("/available")
    @RolesAllowed("STUDENT")
    public Response getAvailableCourses() {
        List<CourseDto> courses = courseService.getAvailableCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path("/all")
    @RolesAllowed("ADMIN")
    public Response getAllCourses() {
        List<CourseDto> courses = courseService.getAllCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path("/mine")
    @RolesAllowed("TEACHER")
    public Response getTeacherCourses() {
        Long teacherId = jwtPrincipal.getClaim("id");
        List<CourseDto> courses = courseService.getTeacherCourses(teacherId);
        return Response.ok(courses).build();
    }

    @GET
    @Path("/{id}")
    public Response getCourse(@PathParam("id") Long courseId) {
        CourseDto course = courseService.getCourseDto(courseId);
        return Response.ok(course).build();
    }

    @POST
    @RolesAllowed({"TEACHER", "ADMIN"})
    public Response createCourse(CreateCourseRequest request) {
        Long userId = jwtPrincipal.getClaim("id");
        CourseDto course = courseService.createCourse(userId, request);
        return Response.status(Response.Status.CREATED).entity(course).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("TEACHER")
    public Response updateCourse(@PathParam("id") Long courseId, CreateCourseRequest request) {
        Long userId = jwtPrincipal.getClaim("id");
        CourseDto course = courseService.updateCourse(courseId, userId, request);
        return Response.ok(course).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"TEACHER", "ADMIN"})
    public Response deleteCourse(@PathParam("id") Long courseId) {
        Long userId = jwtPrincipal.getClaim("id");
        String userRole = jwtPrincipal.getClaim("role");
        courseService.deleteCourse(courseId, userId, userRole);
        return Response.noContent().build();
    }
}
