package com.example.coursemgmt.dto;

import com.example.coursemgmt.entity.CourseSchedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseScheduleDto {
    private Long id;
    private Long courseId;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;

    public static CourseScheduleDto from(CourseSchedule schedule) {
        return new CourseScheduleDto(
            schedule.id,
            schedule.getCourseId(),
            schedule.getDayOfWeek(),
            schedule.getStartTime(),
            schedule.getEndTime(),
            schedule.getLocation()
        );
    }
}
