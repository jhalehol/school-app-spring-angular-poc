package com.metadata.school.api.dto;

import com.metadata.school.api.entity.Course;
import com.metadata.school.api.exception.InvalidParametersException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto {

    private Long id;
    private String name;
    private String teacherName;
    private Integer credits;

    public void validateData() throws InvalidParametersException {
        if (StringUtils.isEmpty(name)) {
            throw new InvalidParametersException("Course cannot be null/empty");
        }
    }

    public static CourseDto convertToDto(final Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .name(course.getCourseName())
                .teacherName(course.getTeacherName())
                .credits(course.getCredits())
                .build();
    }
}
