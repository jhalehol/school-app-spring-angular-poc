package com.metadata.school.api.repository;

import com.metadata.school.api.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> getFirstByUsername(String username);

    boolean existsByUsernameEquals(String username);
}
