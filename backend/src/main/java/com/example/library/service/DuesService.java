package com.example.library.service;

import com.example.library.enums.IssueStatus;
import com.example.library.enums.PaymentStatus;
import com.example.library.model.IssuedBook;
import com.example.library.model.Payment;
import com.example.library.model.User;
import com.example.library.repository.IssuedBookRepository;
import com.example.library.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DuesService {

    private final IssuedBookRepository issuedBookRepository;
    private final PaymentRepository paymentRepository;

    public DuesService(IssuedBookRepository issuedBookRepository,
                       PaymentRepository paymentRepository) {
        this.issuedBookRepository = issuedBookRepository;
        this.paymentRepository = paymentRepository;
    }

    public DuesSummary calculateDues(User user) {
        List<IssuedBook> allIssues = issuedBookRepository.findByUser(user);
        long totalFine = 0L;
        LocalDate today = LocalDate.now();

        for (IssuedBook ib : allIssues) {
            LocalDate due = ib.getDueDate();
            if (due == null) continue;

            long overdueDays = 0;
            if (ib.getStatus() == IssueStatus.RETURNED && ib.getReturnDate() != null) {
                if (ib.getReturnDate().isAfter(due)) {
                    overdueDays = ChronoUnit.DAYS.between(due, ib.getReturnDate());
                }
            } else {
                if (today.isAfter(due)) {
                    overdueDays = ChronoUnit.DAYS.between(due, today);
                }
            }

            if (overdueDays > 0) {
                totalFine += overdueDays; // ₹1 per day
            }
        }

        long totalPaidPaise = paymentRepository.findByUserAndStatus(user, PaymentStatus.SUCCESS)
                .stream()
                .mapToLong(Payment::getAmountPaise)
                .sum();

        long totalFinePaise = totalFine * 100L;
        long outstandingPaise = Math.max(0L, totalFinePaise - totalPaidPaise);

        return new DuesSummary(totalFinePaise, totalPaidPaise, outstandingPaise);
    }

    public Payment recordPayment(User user, long amountPaise, String referenceId) {
        Payment p = new Payment();
        p.setUser(user);
        p.setRollNumber(user.getRollNumber());
        p.setAmountPaise(amountPaise);
        p.setStatus(PaymentStatus.SUCCESS);
        p.setReferenceId(referenceId);
        return paymentRepository.save(p);
    }

    public record DuesSummary(long totalFinePaise, long totalPaidPaise, long outstandingPaise) {}
}

