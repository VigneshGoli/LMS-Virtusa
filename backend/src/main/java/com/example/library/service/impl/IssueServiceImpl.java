package com.example.library.service.impl;

import com.example.library.annotations.AuditAction;
import com.example.library.dto.IssueBookRequestDto;
import com.example.library.dto.ReturnBookRequestDto;
import com.example.library.enums.BookStatus;
import com.example.library.enums.IssueStatus;
import com.example.library.exception.BookNotFoundException;
import com.example.library.exception.BookUnavailableException;
import com.example.library.model.Book;
import com.example.library.model.IssuedBook;
import com.example.library.model.User;
import com.example.library.repository.BookRepository;
import com.example.library.repository.IssuedBookRepository;
import com.example.library.repository.UserRepository;
import com.example.library.service.IssueService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final IssuedBookRepository issuedBookRepository;

    public IssueServiceImpl(BookRepository bookRepository,
                            UserRepository userRepository,
                            IssuedBookRepository issuedBookRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.issuedBookRepository = issuedBookRepository;
    }

    @Override
    @Transactional
    @AuditAction("BOOK_ISSUED")
    public IssuedBook issueBook(IssueBookRequestDto requestDto) {
        Book book = bookRepository.findById(requestDto.getBookId())
                .orElseThrow(() -> new BookNotFoundException(requestDto.getBookId()));

        if (book.getQuantity() <= 0) {
            throw new BookUnavailableException("Book is not available for issuing");
        }

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new com.example.library.exception.LibraryException("User not found with id: " + requestDto.getUserId()));

        book.setQuantity(book.getQuantity() - 1);
        if (book.getQuantity() == 0) {
            book.setStatus(BookStatus.ISSUED);
        }

        IssuedBook issuedBook = new IssuedBook();
        issuedBook.setBook(book);
        issuedBook.setUser(user);
        issuedBook.setIssueDate(LocalDate.now());
        issuedBook.setDueDate(LocalDate.now().plusWeeks(2));
        issuedBook.setStatus(IssueStatus.ACTIVE);

        bookRepository.save(book);
        return issuedBookRepository.save(issuedBook);
    }

    @Override
    @Transactional
    @AuditAction("BOOK_RETURNED")
    public IssuedBook returnBook(ReturnBookRequestDto requestDto) {
        IssuedBook issuedBook = issuedBookRepository.findById(requestDto.getIssuedBookId())
                .orElseThrow(() -> new com.example.library.exception.LibraryException("Issued book not found with id: " + requestDto.getIssuedBookId()));

        if (issuedBook.getStatus() == IssueStatus.RETURNED) {
            throw new com.example.library.exception.LibraryException("Book is already returned");
        }

        Book book = issuedBook.getBook();
        book.setQuantity(book.getQuantity() + 1);
        book.setStatus(BookStatus.AVAILABLE);

        issuedBook.setReturnDate(LocalDate.now());
        if (issuedBook.getDueDate() != null && issuedBook.getReturnDate().isAfter(issuedBook.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(issuedBook.getDueDate(), issuedBook.getReturnDate());
            BigDecimal dailyFee = new BigDecimal("10.00");
            issuedBook.setFee(dailyFee.multiply(BigDecimal.valueOf(daysOverdue)));
        }
        issuedBook.setStatus(IssueStatus.RETURNED);

        bookRepository.save(book);
        return issuedBookRepository.save(issuedBook);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssuedBook> getActiveIssuedBooks() {
        return issuedBookRepository.findByStatus(IssueStatus.ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssuedBook> getAllIssuedBooks() {
        return issuedBookRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IssuedBook> getIssuedBookById(Long id) {
        return issuedBookRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssuedBook> getIssuedBooksByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.example.library.exception.LibraryException("User not found: " + userId));
        return issuedBookRepository.findByUserAndStatus(user, IssueStatus.ACTIVE);
    }
}

