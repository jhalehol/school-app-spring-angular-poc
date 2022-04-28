package com.metadata.school.api.controller;

import com.metadata.school.api.dto.AuthenticationDto;
import com.metadata.school.api.dto.TokenDto;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.security.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    private final AuthenticationService authService;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }

    @CrossOrigin
    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestBody AuthenticationDto authentication) {
        try {
            final TokenDto jwt = authService.authenticateUser(authentication);

            return ResponseEntity.ok(jwt);
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
