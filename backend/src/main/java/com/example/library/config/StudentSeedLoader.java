package com.example.library.config;

import com.example.library.enums.UserRole;
import com.example.library.model.User;
import com.example.library.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Component
@Order(10)
public class StudentSeedLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    public StudentSeedLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // data.sql truncates users for repeatable runs; re-seed from CSV.
        var resource = new ClassPathResource("students.csv");
        if (!resource.exists()) return;

        try (var reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                if (first) { // header
                    first = false;
                    if (line.toLowerCase(Locale.ROOT).startsWith("roll_number")) continue;
                }

                // roll_number,name,branch
                var parts = line.split(",", 3);
                if (parts.length < 3) continue;

                var roll = parts[0].trim().toUpperCase(Locale.ROOT);
                var name = parts[1].trim();
                var branch = parts[2].trim().toUpperCase(Locale.ROOT);

                var user = userRepository.findByRollNumberIgnoreCase(roll).orElseGet(User::new);
                user.setRollNumber(roll);
                user.setName(name);
                user.setBranch(branch);
                // Create deterministic institutional email for uniqueness.
                user.setEmail(roll.toLowerCase(Locale.ROOT) + "@mlrit.ac.in");
                user.setRole(UserRole.STUDENT);
                userRepository.save(user);
            }
        }
    }
}

