package com.example.coursemgmt.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import lombok.extern.java.Log;

import java.util.HashMap;
import java.util.Map;

@Provider
@Log
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        int status = Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
        String message = "Internal server error";

        if (exception instanceof UnauthorizedException) {
            status = Response.Status.UNAUTHORIZED.getStatusCode();
            message = exception.getMessage();
        } else if (exception instanceof ForbiddenException) {
            status = Response.Status.FORBIDDEN.getStatusCode();
            message = exception.getMessage();
        } else if (exception instanceof BadRequestException) {
            status = Response.Status.BAD_REQUEST.getStatusCode();
            message = exception.getMessage();
        } else if (exception instanceof NotFoundException) {
            status = Response.Status.NOT_FOUND.getStatusCode();
            message = exception.getMessage();
        } else {
            log.warning("Unhandled exception: " + exception.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());

        return Response.status(status).entity(response).build();
    }
}
