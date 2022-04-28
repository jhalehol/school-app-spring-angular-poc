package com.metadata.school.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursesPageDto {

    private Integer totalPages;
    private Long totalElements;
    private List<CourseDto> courses;
}
