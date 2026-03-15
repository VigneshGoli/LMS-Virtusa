package com.example.library.service.impl;

import com.example.library.dto.ActivityLogDto;
import com.example.library.dto.DashboardStatsDto;
import com.example.library.enums.BookStatus;
import com.example.library.enums.IssueStatus;
import com.example.library.model.IssuedBook;
import com.example.library.repository.BookRepository;
import com.example.library.repository.IssuedBookRepository;
import com.example.library.repository.UserRepository;
import com.example.library.service.DashboardService;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final IssuedBookRepository issuedBookRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(BookRepository bookRepository, IssuedBookRepository issuedBookRepository,
                                UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.issuedBookRepository = issuedBookRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardStatsDto getStats() {
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalBooks(bookRepository.count());
        dto.setTotalUsers(userRepository.count());
        dto.setAvailableBooks(bookRepository.findByStatus(BookStatus.AVAILABLE).size());
        dto.setIssuedBooks(issuedBookRepository.findByStatus(IssueStatus.ACTIVE).size());
        dto.setOverdueBooks(issuedBookRepository.findByStatusAndDueDateBefore(IssueStatus.ACTIVE, java.time.LocalDate.now()).size());
        return dto;
    }

    @Override
    public List<ActivityLogDto> getRecentActivities() {
        List<ActivityLogDto> logs = new ArrayList<>();
        File file = new File("logs/audit.log");
        if (!file.exists()) {
            return logs;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // basic parsing: id | timestamp | thread | action | details
                String[] parts = line.split("\\|");
                if (parts.length >= 5) {
                    ActivityLogDto dto = new ActivityLogDto();
                    dto.setTimestamp(LocalDateTime.parse(parts[1].trim()));
                    dto.setAction(parts[3].trim());
                    dto.setDetails(parts[4].trim());
                    logs.add(dto);
                }
            }
        } catch (IOException e) {
            // ignore, return what we have
        }
        return logs;
    }
}

