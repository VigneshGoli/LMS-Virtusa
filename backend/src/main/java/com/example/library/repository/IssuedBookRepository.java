package com.example.library.repository;

import com.example.library.enums.IssueStatus;
import com.example.library.model.IssuedBook;
import com.example.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IssuedBookRepository extends JpaRepository<IssuedBook, Long> {

    List<IssuedBook> findByStatus(IssueStatus status);

    List<IssuedBook> findByUserAndStatus(User user, IssueStatus status);

    List<IssuedBook> findByStatusAndDueDateBefore(IssueStatus status, LocalDate date);

    List<IssuedBook> findByUser(User user);
}

