package com.example.library.controller;

import com.example.library.model.User;
import com.example.library.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.example.library.service.StudentDirectoryService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final StudentDirectoryService studentDirectoryService;

    public UserController(UserRepository userRepository, StudentDirectoryService studentDirectoryService) {
        this.userRepository = userRepository;
        this.studentDirectoryService = studentDirectoryService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/roll/{rollNumber}")
    public User getUserByRollNumber(@PathVariable String rollNumber) {
        return studentDirectoryService.ensureStudentByRoll(rollNumber);
    }
}
