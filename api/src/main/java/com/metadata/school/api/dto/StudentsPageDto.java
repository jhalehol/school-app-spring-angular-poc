package com.metadata.school.api.dto;

import com.metadata.school.api.entity.Student;
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
public class StudentsPageDto {

    private Integer totalPages;
    private Long totalElements;
    private List<StudentDto> students;

    public static StudentsPageDto convertToDto(Page<Student> studentsPage) {
        final List<StudentDto> studentsFromPage = studentsPage.toList().stream()
                .map(StudentDto::convertToDto)
                .collect(Collectors.toList());

        return StudentsPageDto.builder()
                .totalElements(studentsPage.getTotalElements())
                .totalPages(studentsPage.getTotalPages())
                .students(studentsFromPage)
                .build();
    }
}
