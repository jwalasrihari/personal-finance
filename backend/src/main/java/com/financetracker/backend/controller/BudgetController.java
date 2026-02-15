package com.financetracker.backend.controller;

import com.financetracker.backend.model.Budget;
import com.financetracker.backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Budgets", description = "Endpoints for managing monthly budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Get all budgets", description = "Retrieve a list of all budgets.")
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Create a budget", description = "Set a new budget for a category.")
    public Budget createBudget(@RequestBody Budget budget) {
        return budgetService.createBudget(budget);
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Delete a budget", description = "Remove a budget by its ID.")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }
}
