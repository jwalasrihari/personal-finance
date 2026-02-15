package com.financetracker.backend.controller;

import com.financetracker.backend.model.Goal;
import com.financetracker.backend.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Goals", description = "Endpoints for managing savings goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Get all goals", description = "Retrieve a list of all savings goals.")
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Create a goal", description = "Create a new savings goal.")
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.createGoal(goal);
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Delete a goal", description = "Delete a savings goal by its ID.")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
}
