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
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    private AuthService authService;

    @Inject
    private JsonWebToken jwtPrincipal;

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
        try {
            Long userId = jwtPrincipal.getClaim("id");
            UserDto user = UserDto.from(authService.getUserById(userId));
            return Response.ok(user).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid token").build();
        }
    }
}
