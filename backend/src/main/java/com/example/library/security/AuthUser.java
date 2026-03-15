package com.example.library.security;

import com.example.library.enums.UserRole;

public record AuthUser(
        Long id,
        String email,
        String name,
        String pictureUrl,
        String rollNumber,
        String branch,
        UserRole role
) {}

