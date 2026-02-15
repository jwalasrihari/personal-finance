package com.financetracker.backend.service;

import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvService {

    public List<Transaction> parse(MultipartFile file) throws IOException {
        List<Transaction> transactions = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

            // Assume header row exists and skip it
            List<String[]> rows = csvReader.readAll();
            if (!rows.isEmpty()) {
                rows.remove(0);
            }

            for (String[] row : rows) {
                // Expected format: Date, Description, Amount, Type
                // Adjust based on common bank formats or provide template
                if (row.length < 3)
                    continue;

                Transaction t = new Transaction();
                // Simple parsing logic - robust error handling needed in prod
                try {
                    t.setDate(LocalDate.parse(row[0], DateTimeFormatter.ISO_LOCAL_DATE)); // YYYY-MM-DD
                } catch (Exception e) {
                    t.setDate(LocalDate.now()); // Fallback
                }

                t.setDescription(row[1]);

                try {
                    t.setAmount(new BigDecimal(row[2]));
                } catch (Exception e) {
                    t.setAmount(BigDecimal.ZERO);
                }

                // Auto-categorize or set null
                // Infer type from amount sign
                if (t.getAmount().compareTo(BigDecimal.ZERO) < 0) {
                    t.setType(TransactionType.EXPENSE);
                    t.setAmount(t.getAmount().abs());
                } else {
                    t.setType(TransactionType.INCOME);
                }

                transactions.add(t);
            }
        } catch (CsvException e) {
            throw new IOException("Error parsing CSV", e);
        }

        return transactions;
    }
}
