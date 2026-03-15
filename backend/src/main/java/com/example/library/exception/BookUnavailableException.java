package com.example.library.exception;

public class BookUnavailableException extends LibraryException {

    public BookUnavailableException(String reason) {
        super(reason);
    }
}

