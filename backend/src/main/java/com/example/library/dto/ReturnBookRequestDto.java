package com.example.library.dto;

import jakarta.validation.constraints.NotNull;

public class ReturnBookRequestDto {

    @NotNull
    private Long issuedBookId;

    public Long getIssuedBookId() {
        return issuedBookId;
    }

    public void setIssuedBookId(Long issuedBookId) {
        this.issuedBookId = issuedBookId;
    }
}

