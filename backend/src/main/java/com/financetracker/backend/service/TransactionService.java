package com.financetracker.backend.service;

import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public java.util.List<Transaction> saveAll(java.util.List<Transaction> transactions) {
        return transactionRepository.saveAll(transactions);
    }
}
