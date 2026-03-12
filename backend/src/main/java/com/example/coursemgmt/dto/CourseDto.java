package com.example.coursemgmt.dto;

import com.example.coursemgmt.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String name;
    private String description;
    private Long teacherId;
    private String status;
    private Integer maxStudents;
    private Integer currentEnrollment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private Long approvedBy;
    private List<CourseScheduleDto> schedules;

    public static CourseDto from(Course course) {
        return new CourseDto(
            course.id,
            course.getName(),
            course.getDescription(),
            course.getTeacherId(),
            course.getStatus().name(),
            course.getMaxStudents(),
            course.getCurrentEnrollment(),
            course.getCreatedAt(),
            course.getUpdatedAt(),
            course.getApprovedAt(),
            course.getApprovedBy(),
            course.getSchedules().stream()
                .map(CourseScheduleDto::from)
                .collect(Collectors.toList())
        );
    }
}
