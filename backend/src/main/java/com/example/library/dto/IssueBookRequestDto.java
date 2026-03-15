package com.example.library.dto;

import jakarta.validation.constraints.NotNull;

public class IssueBookRequestDto {

    @NotNull
    private Long bookId;

    @NotNull
    private Long userId;

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

