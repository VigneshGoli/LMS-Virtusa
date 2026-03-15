package com.example.library.config;

import com.example.library.enums.IssueStatus;
import com.example.library.model.IssuedBook;
import com.example.library.repository.IssuedBookRepository;
import com.example.library.util.FileAuditLogger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class OverdueCheckScheduler {

    private final IssuedBookRepository issuedBookRepository;
    private final FileAuditLogger fileAuditLogger;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public OverdueCheckScheduler(IssuedBookRepository issuedBookRepository,
                                 FileAuditLogger fileAuditLogger) {
        this.issuedBookRepository = issuedBookRepository;
        this.fileAuditLogger = fileAuditLogger;
    }

    @Scheduled(fixedDelay = 60000)
    public void checkOverdueBooks() {
        executorService.submit(() -> {
            List<IssuedBook> overdue = issuedBookRepository
                    .findByStatusAndDueDateBefore(IssueStatus.ACTIVE, LocalDate.now());
            if (!overdue.isEmpty()) {
                fileAuditLogger.log("OVERDUE_CHECK", "Found " + overdue.size() + " overdue books");
            }
        });
    }
}

