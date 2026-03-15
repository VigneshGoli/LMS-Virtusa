package com.example.library.util;

import java.util.concurrent.atomic.AtomicLong;

public final class IdGeneratorUtil {

    private static final AtomicLong AUDIT_SEQUENCE = new AtomicLong(1);

    private IdGeneratorUtil() {
    }

    public static String nextAuditId() {
        long value = AUDIT_SEQUENCE.getAndIncrement();
        return "AUD-" + value;
    }

    public static String[] splitKeywords(String input) {
        if (input == null || input.isBlank()) {
            return new String[0];
        }
        return input.trim().toLowerCase().split("\\s+");
    }
}

