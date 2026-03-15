package com.example.library.util;

import com.example.library.model.Book;

import java.util.Optional;
import java.util.function.Predicate;

public final class BookSearchUtil {

    private BookSearchUtil() {
    }

    public static Predicate<Book> buildPredicate(String title,
                                                 String author,
                                                 String category,
                                                 String isbn) {
        return buildPredicate(title, author, category, isbn, null);
    }

    public static Predicate<Book> buildPredicate(String title,
                                                 String author,
                                                 String category,
                                                 String isbn,
                                                 String generalQuery) {
        SearchFilter filter = new SearchFilter(title, author, category, isbn, generalQuery);
        return filter.toPredicate();
    }

    /**
     * Inner class demonstrating encapsulation of search filter logic.
     */
    public static class SearchFilter {
        private final String title;
        private final String author;
        private final String category;
        private final String isbn;
        private final String generalQuery;

        public SearchFilter(String title, String author, String category, String isbn) {
            this(title, author, category, isbn, null);
        }

        public SearchFilter(String title, String author, String category, String isbn, String generalQuery) {
            this.title = title;
            this.author = author;
            this.category = category;
            this.isbn = isbn;
            this.generalQuery = generalQuery;
        }

        public Predicate<Book> toPredicate() {
            if (generalQuery != null && !generalQuery.isBlank()) {
                String q = generalQuery.trim().toLowerCase();
                return book ->
                        containsIgnoreCase(book.getTitle(), q)
                                || containsIgnoreCase(book.getAuthor(), q)
                                || containsIgnoreCase(book.getCategory(), q)
                                || containsIgnoreCase(book.getIsbn(), q);
            }
            Predicate<Book> predicate = book -> true;
            predicate = predicate
                    .and(optionalContainsIgnoreCase(title, Book::getTitle))
                    .and(optionalContainsIgnoreCase(author, Book::getAuthor))
                    .and(optionalContainsIgnoreCase(category, Book::getCategory))
                    .and(optionalEqualsIgnoreCase(isbn, Book::getIsbn));
            return predicate;
        }

        private boolean containsIgnoreCase(String field, String value) {
            return field != null && field.toLowerCase().contains(value);
        }

        private Predicate<Book> optionalContainsIgnoreCase(String value,
                                                           java.util.function.Function<Book, String> extractor) {
            return Optional.ofNullable(value)
                    .filter(v -> !v.isBlank())
                    .<Predicate<Book>>map(v -> book -> {
                        String field = extractor.apply(book);
                        return field != null && field.toLowerCase().contains(v.toLowerCase());
                    })
                    .orElse(book -> true);
        }

        private Predicate<Book> optionalEqualsIgnoreCase(String value,
                                                         java.util.function.Function<Book, String> extractor) {
            return Optional.ofNullable(value)
                    .filter(v -> !v.isBlank())
                    .<Predicate<Book>>map(v -> book -> {
                        String field = extractor.apply(book);
                        return field != null && field.equalsIgnoreCase(v);
                    })
                    .orElse(book -> true);
        }
    }
}

