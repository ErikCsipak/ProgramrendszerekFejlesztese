package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.LoginRequest;
import com.example.coursemgmt.dto.LoginResponse;
import com.example.coursemgmt.dto.RegisterRequest;
import com.example.coursemgmt.dto.UserDto;
import com.example.coursemgmt.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    private AuthService authService;

    @POST
    @Path("/login")
    @PermitAll
    public Response login(LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Response.ok(response).build();
    }

    @POST
    @Path("/register")
    @PermitAll
    public Response register(RegisterRequest request) {
        UserDto userDto = authService.register(request);
        return Response.status(Response.Status.CREATED).entity(userDto).build();
    }

    @GET
    @Path("/validate")
    public Response validate() {
        return Response.status(Response.Status.NOT_IMPLEMENTED)
                .entity("Authentication disabled").build();
    }

    @POST
    @Path("/logout")
    public Response logout() {
        return Response.noContent().build();
    }
}
