package com.example.library.repository;

import com.example.library.enums.UserRole;
import com.example.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    Optional<User> findByRollNumberIgnoreCase(String rollNumber);
}

