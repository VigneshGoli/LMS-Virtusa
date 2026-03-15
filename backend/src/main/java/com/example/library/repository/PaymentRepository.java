package com.example.library.repository;

import com.example.library.enums.PaymentStatus;
import com.example.library.model.Payment;
import com.example.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserAndStatus(User user, PaymentStatus status);
}

