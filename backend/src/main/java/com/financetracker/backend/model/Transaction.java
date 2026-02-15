package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
