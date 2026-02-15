package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String color; // Hex code or Tailwind class
    
    @Enumerated(EnumType.STRING)
    private TransactionType type; // INCOME, EXPENSE, or null for both
}
