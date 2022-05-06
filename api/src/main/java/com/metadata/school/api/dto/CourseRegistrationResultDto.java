package com.metadata.school.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRegistrationResultDto {

    private long courseId;
    private long studentId;
    private String courseName;
    private boolean success;
    private String details;
}
