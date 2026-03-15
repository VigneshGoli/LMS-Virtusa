package com.example.library.repository;

import com.example.library.enums.BookStatus;
import com.example.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByStatus(BookStatus status);

    Optional<Book> findByIsbn(String isbn);
}

