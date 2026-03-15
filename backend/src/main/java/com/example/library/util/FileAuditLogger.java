package com.example.library.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class FileAuditLogger {

    private final String auditLogPath;

    public FileAuditLogger(@Value("${library.audit-log-path:logs/audit.log}") String auditLogPath) {
        this.auditLogPath = auditLogPath;
    }

    public synchronized void log(String action, String details) {
        String id = IdGeneratorUtil.nextAuditId();
        String message = String.format("%s | %s | %s | %s | %s",
                id,
                LocalDateTime.now(),
                Thread.currentThread().getName(),
                action,
                details);
        writeToFile(message);
    }

    private void writeToFile(String message) {
        try {
            File file = new File(auditLogPath);
            File parent = file.getParentFile();
            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
                writer.write(message);
                writer.newLine();
            }
        } catch (IOException e) {
            // Intentionally swallow to avoid breaking business flow
            e.printStackTrace();
        }
    }
}

