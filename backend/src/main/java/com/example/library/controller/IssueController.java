package com.example.library.controller;

import com.example.library.dto.IssueBookRequestDto;
import com.example.library.dto.ReturnBookRequestDto;
import com.example.library.exception.LibraryException;
import com.example.library.model.IssuedBook;
import com.example.library.security.AuthController;
import com.example.library.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping("/books/issue")
    @PreAuthorize("hasRole('ADMIN')")
    public IssuedBook issueBook(@Valid @RequestBody IssueBookRequestDto requestDto) {
        return issueService.issueBook(requestDto);
    }

    @PostMapping("/books/return")
    @PreAuthorize("hasRole('ADMIN')")
    public IssuedBook returnBook(@Valid @RequestBody ReturnBookRequestDto requestDto) {
        return issueService.returnBook(requestDto);
    }

    @GetMapping("/books/issued")
    @PreAuthorize("hasRole('ADMIN')")
    public List<IssuedBook> getActiveIssued() {
        return issueService.getActiveIssuedBooks();
    }

    @GetMapping("/issued")
    @PreAuthorize("hasRole('ADMIN')")
    public List<IssuedBook> getAllIssued() {
        return issueService.getAllIssuedBooks();
    }

    @GetMapping("/issued/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public IssuedBook getIssuedById(@PathVariable Long id) {
        return issueService.getIssuedBookById(id)
                .orElseThrow(() -> new LibraryException("Issue record not found: " + id));
    }

    @GetMapping("/issued/by-user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<IssuedBook> getIssuedByUser(@PathVariable Long userId) {
        return issueService.getIssuedBooksByUserId(userId);
    }

    @GetMapping("/issued/me")
    @PreAuthorize("hasAnyRole('STUDENT','USER','ADMIN')")
    public List<IssuedBook> getMyIssued(HttpServletRequest request) {
        var u = AuthController.getSessionUser(request);
        if (u == null || u.id() == null) {
            throw new LibraryException("Not authenticated");
        }
        return issueService.getIssuedBooksByUserId(u.id());
    }
}

