package com.example.library.service;

import com.example.library.dto.BookRequestDto;
import com.example.library.dto.BookResponseDto;
import com.example.library.model.Book;

import java.util.List;
import java.util.function.Predicate;

public interface BookService {

    BookResponseDto addBook(BookRequestDto requestDto);

    List<BookResponseDto> getAllBooks();

    List<BookResponseDto> getAvailableBooks();

    List<BookResponseDto> searchBooks(Predicate<Book> predicate);
}

