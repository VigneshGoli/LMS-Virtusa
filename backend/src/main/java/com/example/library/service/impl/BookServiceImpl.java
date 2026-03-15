package com.example.library.service.impl;

import com.example.library.annotations.AuditAction;
import com.example.library.dto.BookRequestDto;
import com.example.library.dto.BookResponseDto;
import com.example.library.enums.BookStatus;
import com.example.library.exception.BookNotFoundException;
import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import com.example.library.service.BookService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    @AuditAction("BOOK_ADDED")
    public BookResponseDto addBook(BookRequestDto requestDto) {
        Book book = new Book();
        book.setTitle(requestDto.getTitle());
        book.setAuthor(requestDto.getAuthor());
        book.setCategory(requestDto.getCategory());
        book.setIsbn(requestDto.getIsbn());
        book.setPublisher(requestDto.getPublisher());
        book.setQuantity(requestDto.getQuantity());
        book.setYear(requestDto.getYear());
        book.setDescription(requestDto.getDescription());
        book.setStatus(BookStatus.AVAILABLE);

        Book saved = bookRepository.save(book);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> getAvailableBooks() {
        return bookRepository.findByStatus(BookStatus.AVAILABLE)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> searchBooks(Predicate<Book> predicate) {
        return bookRepository.findAll()
                .stream()
                .filter(predicate)
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    private BookResponseDto toResponseDto(Book book) {
        if (book == null) {
            throw new BookNotFoundException("Unknown");
        }
        BookResponseDto dto = new BookResponseDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setCategory(book.getCategory());
        dto.setIsbn(book.getIsbn());
        dto.setPublisher(book.getPublisher());
        dto.setQuantity(book.getQuantity());
        dto.setYear(book.getYear());
        dto.setDescription(book.getDescription());
        dto.setStatus(book.getStatus());
        return dto;
    }
}

