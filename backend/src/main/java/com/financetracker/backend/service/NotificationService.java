package com.financetracker.backend.service;

import com.financetracker.backend.model.Notification;
import com.financetracker.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByDateDesc();
    }

    public Notification createNotification(String message) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setDate(LocalDateTime.now());
        n.setRead(false);
        return notificationRepository.save(n);
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
