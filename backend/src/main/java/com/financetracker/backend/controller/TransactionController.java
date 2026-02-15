package com.financetracker.backend.controller;

import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Transactions", description = "Endpoints for managing financial transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Get all transactions", description = "Retrieve a list of all transactions.")
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Create a transaction", description = "Create a new income or expense transaction.")
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.createTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Delete a transaction", description = "Delete a transaction by its ID.")
    public void deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
    }

    @PostMapping("/upload")
    @io.swagger.v3.oas.annotations.Operation(summary = "Upload transactions CSV", description = "Upload a CSV file to bulk create transactions.")
    public List<Transaction> uploadTransactions(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        // Simple manual wiring of CsvService here or autowire it.
        // Need to autowire CsvService.
        return transactionService.saveAll(csvService.parse(file));
    }

    @Autowired
    private com.financetracker.backend.service.CsvService csvService;
}
