package com.financetracker.backend.service;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;
import com.financetracker.backend.repository.CategoryRepository;
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

    private final CategoryRepository categoryRepository;

    public CsvService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Transaction> parse(MultipartFile file) throws IOException {
        List<Transaction> transactions = new ArrayList<>();
        List<Category> allCategories = categoryRepository.findAll();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

            // Assume header row exists and skip it
            List<String[]> rows = csvReader.readAll();
            if (!rows.isEmpty()) {
                rows.remove(0);
            }

            for (String[] row : rows) {
                // Expected format: Date, Description, Amount, Category (optional)
                if (row.length < 3)
                    continue;

                Transaction t = new Transaction();

                // Parse date
                try {
                    t.setDate(LocalDate.parse(row[0].trim(), DateTimeFormatter.ISO_LOCAL_DATE));
                } catch (Exception e) {
                    t.setDate(LocalDate.now());
                }

                t.setDescription(row[1].trim());

                // Parse amount
                try {
                    t.setAmount(new BigDecimal(row[2].trim()));
                } catch (Exception e) {
                    t.setAmount(BigDecimal.ZERO);
                }

                // Infer type from amount sign
                if (t.getAmount().compareTo(BigDecimal.ZERO) < 0) {
                    t.setType(TransactionType.EXPENSE);
                    t.setAmount(t.getAmount().abs());
                } else {
                    t.setType(TransactionType.INCOME);
                }

                // Parse category from 4th column if present
                if (row.length >= 4 && row[3] != null && !row[3].trim().isEmpty()) {
                    String categoryName = row[3].trim();
                    Category match = allCategories.stream()
                            .filter(c -> c.getName().equalsIgnoreCase(categoryName))
                            .findFirst()
                            .orElse(null);

                    if (match != null) {
                        t.setCategory(match);
                    } else {
                        // Create new category if it doesn't exist
                        Category newCat = new Category();
                        newCat.setName(categoryName);
                        newCat.setType(t.getType());
                        newCat.setColor("#6366F1");
                        newCat = categoryRepository.save(newCat);
                        allCategories.add(newCat);
                        t.setCategory(newCat);
                    }
                }

                transactions.add(t);
            }
        } catch (CsvException e) {
            throw new IOException("Error parsing CSV", e);
        }

        return transactions;
    }
}
