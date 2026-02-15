package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String billingCycle; // e.g., MONTHLY, YEARLY, WEEKLY

    @Column(nullable = false)
    private LocalDate nextPaymentDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String description;

    private boolean active = true;
}
