package com.metadata.school.api.dto;

import com.metadata.school.api.entity.Role;
import com.metadata.school.api.entity.User;
import com.metadata.school.api.exception.InvalidParametersException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String username;
    private String password;
    private String name;
    private String surname;
    private List<String> accounts;

    public User toUser() throws InvalidParametersException {
        validateBasicFields();

        return User.builder()
                .username(username)
                .name(name)
                .surname(surname)
                .role(Role.USER_ROLE)
                .build();
    }

    private void validateBasicFields() throws InvalidParametersException {
        if (StringUtils.isEmpty(username)) {
            throw new InvalidParametersException("Username is required field");
        }

        if (StringUtils.isEmpty(password)) {
            throw new InvalidParametersException("Password is required field");
        }

        if (StringUtils.isEmpty(name)) {
            throw new InvalidParametersException("Name is required field");
        }
    }
}
