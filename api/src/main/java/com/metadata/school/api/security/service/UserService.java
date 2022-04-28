package com.metadata.school.api.security.service;

import com.metadata.school.api.dto.UserDto;
import com.metadata.school.api.entity.User;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.UserNotFoundException;
import com.metadata.school.api.repository.UserRepository;
import com.metadata.school.api.security.UserDetailsImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    public UserService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Load a user given the username
     * @param username Username of the user
     * @return User
     */
    @Override
    public UserDetails loadUserByUsername(final String username) throws UserNotFoundException {
        final User user = userRepository.getFirstByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(String.format("User %s not found", username)));

        return new UserDetailsImpl(user);
    }

    /**
     * Loads a user by Identifier
     * @param userId User identifier
     * @return User
     * @throws UserNotFoundException
     */
    public User loadUserByUserId(final Long userId) throws UserNotFoundException {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(String.format("User %d not found", userId)));
    }

    /**
     * Creates a user in the table of users
     * @param userDto User data
     * @throws InvalidParametersException
     */
    @Transactional
    public void createUser(final UserDto userDto)
            throws InvalidParametersException {
        if (userDto == null) {
            throw new InvalidParametersException("User data cannot be null or empty");
        }

        final boolean usernameUsed = userRepository.existsByUsernameEquals(userDto.getUsername());
        if (usernameUsed) {
            throw new InvalidParametersException(String.format("Username %s is already used by another user",
                    userDto.getUsername()));
        }

        final User user = userDto.toUser();
        user.setPassword(userDto.getPassword());
        userRepository.save(user);
    }
}
