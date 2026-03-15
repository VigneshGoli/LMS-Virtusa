package com.example.library.model;

import com.example.library.enums.PaymentStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "roll_number", nullable = false, length = 20)
    private String rollNumber;

    @Column(nullable = false)
    private long amountPaise;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public long getAmountPaise() {
        return amountPaise;
    }

    public void setAmountPaise(long amountPaise) {
        this.amountPaise = amountPaise;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }
}

