package com.metadata.school.api.dto;

import com.metadata.school.api.entity.Student;
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
public class StudentDto {

    private Long id;
    private String idNumber;
    private String name;
    private String surname;
    private String email;
    private String address;

    public static StudentDto convertToDto(final Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .idNumber(student.getIdNumber())
                .name(student.getName())
                .surname(student.getSurname())
                .address(student.getAddress())
                .email(student.getEmail())
                .build();
    }

    public void validateData() throws InvalidParametersException {
        if (StringUtils.isEmpty(name)) {
            throw new InvalidParametersException("Student name cannot be null/empty");
        }

        if (StringUtils.isEmpty(idNumber)) {
            throw new InvalidParametersException("Student identification cannot be null/empty");
        }
    }
}
