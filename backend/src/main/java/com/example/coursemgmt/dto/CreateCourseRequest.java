package com.example.coursemgmt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseRequest {
    private String name;
    private String description;
    private Integer maxStudents;
    private List<CourseScheduleDto> schedules;
}
