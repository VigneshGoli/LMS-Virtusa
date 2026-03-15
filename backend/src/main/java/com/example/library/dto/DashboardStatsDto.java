package com.example.library.dto;

public class DashboardStatsDto {

    private long totalBooks;
    private long issuedBooks;
    private long availableBooks;
    private long overdueBooks;
    private long totalUsers;

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getIssuedBooks() {
        return issuedBooks;
    }

    public void setIssuedBooks(long issuedBooks) {
        this.issuedBooks = issuedBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getOverdueBooks() {
        return overdueBooks;
    }

    public void setOverdueBooks(long overdueBooks) {
        this.overdueBooks = overdueBooks;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }
}

