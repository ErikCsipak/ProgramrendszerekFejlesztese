package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.dto.CreateCourseRequest;
import com.example.coursemgmt.service.CourseService;
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
    private CourseService courseService;

    @GET
    @Path("/available")
    public Response getAvailableCourses() {
        List<CourseDto> courses = courseService.getAvailableCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path("/all")
    public Response getAllCourses() {
        List<CourseDto> courses = courseService.getAllCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path("/mine")
    public Response getTeacherCourses(@QueryParam("teacherId") Long teacherId) {
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
    public Response createCourse(CreateCourseRequest request) {
        CourseDto course = courseService.createCourse(request);
        return Response.status(Response.Status.CREATED).entity(course).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateCourse(@PathParam("id") Long courseId, CreateCourseRequest request) {
        CourseDto course = courseService.updateCourse(courseId, request);
        return Response.ok(course).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteCourse(@PathParam("id") Long courseId) {
        courseService.deleteCourse(courseId);
        return Response.noContent().build();
    }
}
