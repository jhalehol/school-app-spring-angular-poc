package com.metadata.school.api.dto;

import com.metadata.school.api.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursesPageDto {

    private Integer totalPages;
    private Long totalElements;
    private List<CourseDto> courses;

    public static CoursesPageDto convertToDto(Page<Course> page) {
        final List<CourseDto> coursesFromPage = page.toList().stream()
                .map(CourseDto::convertToDto)
                .collect(Collectors.toList());

        return CoursesPageDto.builder()
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .courses(coursesFromPage)
                .build();
    }
}
