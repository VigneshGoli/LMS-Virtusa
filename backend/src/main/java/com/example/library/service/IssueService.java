package com.example.library.service;

import com.example.library.dto.IssueBookRequestDto;
import com.example.library.dto.ReturnBookRequestDto;
import com.example.library.model.IssuedBook;

import java.util.List;
import java.util.Optional;

public interface IssueService {

    IssuedBook issueBook(IssueBookRequestDto requestDto);

    IssuedBook returnBook(ReturnBookRequestDto requestDto);

    List<IssuedBook> getActiveIssuedBooks();

    List<IssuedBook> getAllIssuedBooks();

    Optional<IssuedBook> getIssuedBookById(Long id);

    List<IssuedBook> getIssuedBooksByUserId(Long userId);
}

