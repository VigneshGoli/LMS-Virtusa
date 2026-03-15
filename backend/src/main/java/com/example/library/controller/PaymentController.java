package com.example.library.controller;

import com.example.library.security.AuthController;
import com.example.library.security.AuthUser;
import com.example.library.service.DuesService;
import com.example.library.model.User;
import com.example.library.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final DuesService duesService;
    private final UserRepository userRepository;

    public PaymentController(DuesService duesService, UserRepository userRepository) {
        this.duesService = duesService;
        this.userRepository = userRepository;
    }

    private User requireUser(AuthUser authUser) {
        return userRepository.findById(authUser.id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    @GetMapping("/dues/me")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN','USER')")
    public Map<String, Object> getMyDues(HttpServletRequest request) {
        AuthUser authUser = AuthController.getSessionUser(request);
        if (authUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        User user = requireUser(authUser);
        var summary = duesService.calculateDues(user);
        boolean paid = summary.outstandingPaise() <= 0;
        return Map.of(
                "totalFine", summary.totalFinePaise() / 100.0,
                "totalPaid", summary.totalPaidPaise() / 100.0,
                "outstanding", summary.outstandingPaise() / 100.0,
                "status", paid ? "PAID" : "PENDING"
        );
    }

    @PostMapping("/record")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN','USER')")
    public Map<String, Object> recordPayment(@RequestBody RecordPaymentRequest body,
                                             HttpServletRequest request) {
        AuthUser authUser = AuthController.getSessionUser(request);
        if (authUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        User user = requireUser(authUser);

        long amountPaise = Math.round(body.amount() * 100.0);
        var payment = duesService.recordPayment(user, amountPaise, body.referenceId());
        var summary = duesService.calculateDues(user);
        boolean paid = summary.outstandingPaise() <= 0;

        return Map.of(
                "paymentId", payment.getId(),
                "referenceId", payment.getReferenceId(),
                "timestamp", LocalDateTime.now(),
                "totalFine", summary.totalFinePaise() / 100.0,
                "totalPaid", summary.totalPaidPaise() / 100.0,
                "outstanding", summary.outstandingPaise() / 100.0,
                "status", paid ? "PAID" : "PENDING"
        );
    }

    public record RecordPaymentRequest(double amount, String referenceId) {}
}

