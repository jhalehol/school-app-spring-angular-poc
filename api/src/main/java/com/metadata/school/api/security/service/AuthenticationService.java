package com.metadata.school.api.security.service;

import com.metadata.school.api.dto.AuthenticationDto;
import com.metadata.school.api.dto.TokenDto;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(JwtService jwtService, AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public TokenDto authenticateUser(final AuthenticationDto authenticationData) throws InvalidParametersException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationData.getUsername(),
                        authenticationData.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        final UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        final String jwt = jwtService.buildJwt(userDetails.getUserId());

        return TokenDto.builder()
                .token(jwt)
                .userName(userDetails.getName())
                .generatedAt(Instant.now().toEpochMilli())
                .build();
    }

    public UserDetailsImpl getAuthenticatedUser() {
        return(UserDetailsImpl) SecurityContextHolder.
                getContext().
                getAuthentication().
                getPrincipal();
    }
}
