package com.financetracker.backend.controller;

import com.financetracker.backend.model.Notification;
import com.financetracker.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Notifications", description = "Endpoints for user notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/unread")
    @io.swagger.v3.oas.annotations.Operation(summary = "Get unread notifications", description = "Retrieve only unread notifications.")
    public List<Notification> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }

    @PostMapping("/{id}/read")
    @io.swagger.v3.oas.annotations.Operation(summary = "Mark as read", description = "Mark a specific notification as read.")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Create notification", description = "Manually create a notification (for testing).")
    public Notification createNotification(@RequestBody String message) {
        return notificationService.createNotification(message);
    }
}
