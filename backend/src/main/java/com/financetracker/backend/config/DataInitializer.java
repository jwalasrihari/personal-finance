package com.financetracker.backend.config;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(CategoryRepository categoryRepository, TransactionRepository transactionRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category salary = new Category();
                salary.setName("Salary");
                salary.setType(TransactionType.INCOME);
                salary.setColor("#10B981"); // Green

                Category freelance = new Category();
                freelance.setName("Freelance");
                freelance.setType(TransactionType.INCOME);
                freelance.setColor("#14B8A6"); // Teal

                Category groceries = new Category();
                groceries.setName("Groceries");
                groceries.setType(TransactionType.EXPENSE);
                groceries.setColor("#F59E0B"); // Yellow

                Category rent = new Category();
                rent.setName("Rent");
                rent.setType(TransactionType.EXPENSE);
                rent.setColor("#EF4444"); // Red

                Category utilities = new Category();
                utilities.setName("Utilities");
                utilities.setType(TransactionType.EXPENSE);
                utilities.setColor("#EAB308"); // Yellow-500

                Category entertainment = new Category();
                entertainment.setName("Entertainment");
                entertainment.setType(TransactionType.EXPENSE);
                entertainment.setColor("#A855F7"); // Purple

                Category diningOut = new Category();
                diningOut.setName("Dining Out");
                diningOut.setType(TransactionType.EXPENSE);
                diningOut.setColor("#EC4899"); // Pink

                Category transportation = new Category();
                transportation.setName("Transportation");
                transportation.setType(TransactionType.EXPENSE);
                transportation.setColor("#3B82F6"); // Blue

                categoryRepository.saveAll(Arrays.asList(salary, freelance, groceries, rent, utilities, entertainment,
                        diningOut, transportation));

                Transaction t1 = new Transaction();
                t1.setDescription("Monthly Salary");
                t1.setAmount(new BigDecimal("5000"));
                t1.setDate(LocalDate.now());
                t1.setType(TransactionType.INCOME);
                t1.setCategory(salary);

                Transaction t2 = new Transaction();
                t2.setDescription("Weekly Groceries");
                t2.setAmount(new BigDecimal("150.50"));
                t2.setDate(LocalDate.now().minusDays(2));
                t2.setType(TransactionType.EXPENSE);
                t2.setCategory(groceries);

                Transaction t3 = new Transaction();
                t3.setDescription("Rent Payment");
                t3.setAmount(new BigDecimal("1200"));
                t3.setDate(LocalDate.now().minusDays(5));
                t3.setType(TransactionType.EXPENSE);
                t3.setCategory(rent);

                transactionRepository.saveAll(Arrays.asList(t1, t2, t3));

                System.out.println("Data Initialized: 3 Transactions added.");
            }
        };
    }
}
