package com.example.library.service;

import com.example.library.enums.UserRole;
import com.example.library.model.User;
import com.example.library.repository.UserRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class StudentDirectoryService {

    private final UserRepository userRepository;

    public StudentDirectoryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Ensures a User exists for the given roll number.
     * - First tries the database.
     * - If not found, looks up in students.csv and creates the user on the fly.
     */
    public User ensureStudentByRoll(String rollInput) {
        String roll = rollInput.trim().toUpperCase(Locale.ROOT);
        return userRepository.findByRollNumberIgnoreCase(roll)
                .orElseGet(() -> createFromCsvOrThrow(roll));
    }

    private User createFromCsvOrThrow(String roll) {
        var resource = new ClassPathResource("students.csv");
        if (!resource.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        try (var reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                if (first) {
                    first = false;
                    continue; // skip header
                }
                var parts = line.split(",", 3);
                if (parts.length < 3) continue;
                String csvRoll = parts[0].trim().toUpperCase(Locale.ROOT);
                if (!csvRoll.equals(roll)) continue;

                String name = parts[1].trim();
                String branch = parts[2].trim().toUpperCase(Locale.ROOT);

                User user = new User();
                user.setRollNumber(csvRoll);
                user.setName(name);
                user.setBranch(branch);
                user.setEmail(csvRoll.toLowerCase(Locale.ROOT) + "@mlrit.ac.in");
                user.setRole(UserRole.STUDENT);
                return userRepository.save(user);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read student directory");
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
}

