package com.example.library.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-time compatibility migration:
 * - Converts users.role to VARCHAR so new roles work (ADMIN/STUDENT/USER).
 * - Maps legacy USER -> STUDENT.
 */
@Component
@Order(0)
public class DbRoleMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DbRoleMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY role VARCHAR(50) NOT NULL");
        } catch (Exception ignored) {
            // Table might not exist yet, or column already VARCHAR; ignore safely.
        }

        try {
            jdbcTemplate.update("UPDATE users SET role='STUDENT' WHERE role='USER'");
        } catch (Exception ignored) {
            // Ignore if column/table not available yet.
        }
    }
}

