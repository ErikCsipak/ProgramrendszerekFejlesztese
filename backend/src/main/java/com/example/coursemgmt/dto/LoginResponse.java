package com.example.coursemgmt.dto;

import com.example.coursemgmt.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserDto user;

    public static LoginResponse from(String token, User user) {
        return new LoginResponse(
            token,
            UserDto.from(user)
        );
    }
}
