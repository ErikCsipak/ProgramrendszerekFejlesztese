package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.CourseDto;
import com.example.coursemgmt.dto.UserDto;
import com.example.coursemgmt.service.AdminService;
import com.example.coursemgmt.service.CourseService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/api/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {

    @Inject
    private AdminService adminService;

    @Inject
    private CourseService courseService;

    @GET
    @Path("/pending-courses")
    public Response getPendingCourses() {
        List<CourseDto> courses = courseService.getPendingCourses();
        return Response.ok(courses).build();
    }

    @POST
    @Path("/courses/{courseId}/approve")
    public Response approveCourse(@PathParam("courseId") Long courseId) {
        CourseDto course = courseService.approveCourse(courseId);
        return Response.ok(course).build();
    }

    @POST
    @Path("/courses/{courseId}/reject")
    public Response rejectCourse(@PathParam("courseId") Long courseId) {
        courseService.rejectCourse(courseId);
        return Response.noContent().build();
    }

    @GET
    @Path("/users")
    public Response getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return Response.ok(users).build();
    }

    @GET
    @Path("/users/{userId}")
    public Response getUser(@PathParam("userId") Long userId) {
        UserDto user = adminService.getUserById(userId);
        return Response.ok(user).build();
    }

    @POST
    @Path("/users")
    public Response createUser(Map<String, String> request) {
        UserDto user = adminService.createUser(
            request.get("email"),
            request.get("password"),
            request.get("fullName"),
            request.get("role")
        );
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    @PUT
    @Path("/users/{userId}")
    public Response updateUser(@PathParam("userId") Long userId, Map<String, Object> request) {
        UserDto user = adminService.updateUser(
            userId,
            (String) request.get("email"),
            (String) request.get("fullName"),
            (Boolean) request.get("active")
        );
        return Response.ok(user).build();
    }
}
