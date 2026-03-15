package com.example.library.enums;

public enum UserRole {
    ADMIN,
    STUDENT,
    /**
     * Backward-compatible value for existing rows.
     * Treated as STUDENT by the auth layer.
     */
    USER
}

