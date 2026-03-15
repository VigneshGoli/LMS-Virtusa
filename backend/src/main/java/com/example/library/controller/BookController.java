package com.example.library.controller;

import com.example.library.dto.BookRequestDto;
import com.example.library.dto.BookResponseDto;
import com.example.library.service.BookService;
import com.example.library.util.BookSearchUtil;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public BookResponseDto addBook(@Valid @RequestBody BookRequestDto requestDto) {
        return bookService.addBook(requestDto);
    }

    @GetMapping
    public List<BookResponseDto> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/available")
    public List<BookResponseDto> getAvailableBooks() {
        return bookService.getAvailableBooks();
    }

    @GetMapping("/search")
    public List<BookResponseDto> searchBooks(@RequestParam(required = false) String title,
                                             @RequestParam(required = false) String author,
                                             @RequestParam(required = false) String category,
                                             @RequestParam(required = false) String isbn,
                                             @RequestParam(required = false) String q) {
        return bookService.searchBooks(BookSearchUtil.buildPredicate(title, author, category, isbn, q));
    }
}

