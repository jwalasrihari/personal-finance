package com.financetracker.backend.controller;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Categories", description = "Endpoints for managing transaction categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Get all categories", description = "Retrieve a list of all categories.")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Create a category", description = "Add a new category.")
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Delete a category", description = "Remove a category by its ID.")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
