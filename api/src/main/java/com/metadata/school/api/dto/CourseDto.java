package com.metadata.school.api.dto;

import com.metadata.school.api.entity.Course;
import com.metadata.school.api.exception.InvalidParametersException;
import lombok.Builder;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

@Data
@Builder
public class CourseDto {

    private Long id;
    private String courseName;
    private String teacherName;
    private Integer credits;

    public void validateData() throws InvalidParametersException {
        if (StringUtils.isEmpty(courseName)) {
            throw new InvalidParametersException("Course cannot be null/empty");
        }
    }

    public static CourseDto convertToDto(final Course course) {
        return CourseDto.builder()
                .courseName(course.getCourseName())
                .teacherName(course.getTeacherName())
                .credits(course.getCredits())
                .build();
    }
}
