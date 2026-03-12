package com.example.coursemgmt.dto;

import com.example.coursemgmt.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private Boolean active;

    public static UserDto from(User user) {
        return new UserDto(
            user.id,
            user.getEmail(),
            user.getFullName(),
            user.getRole().name(),
            user.getActive()
        );
    }
}
