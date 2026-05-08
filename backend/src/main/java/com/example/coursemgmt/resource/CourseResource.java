package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.dto.CreateCourseRequest;
import com.example.coursemgmt.security.SecurityService;
import com.example.coursemgmt.service.CourseService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/courses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseResource {

    @Inject
    CourseService courseService;

    @Inject
    SecurityService securityService;

    @GET
    @Path("/available")
    @PermitAll
    public Response getAvailableCourses() {
        List<CourseDto> courses = courseService.getAvailableCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path("/all")
    @PermitAll
    public Response getAllCourses() {
        List<CourseDto> courses = courseService.getAllCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path("/mine")
    @RolesAllowed({"TEACHER", "ADMIN"})
    public Response getTeacherCourses() {
        Long teacherId = securityService.getUserIdOrThrow();
        List<CourseDto> courses = courseService.getTeacherCourses(teacherId);
        return Response.ok(courses).build();
    }

    @GET
    @Path("/{id}")
    @PermitAll
    public Response getCourse(@PathParam("id") Long courseId) {
        CourseDto course = courseService.getCourseDto(courseId);
        return Response.ok(course).build();
    }

    @POST
    @RolesAllowed({"TEACHER", "ADMIN"})
    public Response createCourse(CreateCourseRequest request) {
        CourseDto course = courseService.createCourse(request);
        return Response.status(Response.Status.CREATED).entity(course).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("TEACHER")
    public Response updateCourse(@PathParam("id") Long courseId, CreateCourseRequest request) {
        CourseDto course = courseService.updateCourse(courseId, request);
        return Response.ok(course).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("TEACHER")
    public Response deleteCourse(@PathParam("id") Long courseId) {
        courseService.deleteCourse(courseId);
        return Response.noContent().build();
    }
}
