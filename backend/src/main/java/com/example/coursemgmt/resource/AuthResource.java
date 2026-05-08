package com.example.coursemgmt.resource;

import com.example.coursemgmt.dto.LoginRequest;
import com.example.coursemgmt.dto.LoginResponse;
import com.example.coursemgmt.dto.RegisterRequest;
import com.example.coursemgmt.dto.UserDto;
import com.example.coursemgmt.security.SecurityService;
import com.example.coursemgmt.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    SecurityService securityService;

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
    @RolesAllowed({"ADMIN", "TEACHER", "STUDENT"})
    public Response validate() {
        return Response.ok(new java.util.HashMap<String, Object>() {{
            put("userId", securityService.getUserId().orElse(null));
            put("email", securityService.getEmail());
            put("role", securityService.getUserRole().orElse(null));
            put("authenticated", true);
        }}).build();
    }

    @POST
    @Path("/logout")
    public Response logout() {
        return Response.noContent().build();
    }
}
