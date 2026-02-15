package com.financetracker.backend.service;

import com.financetracker.backend.model.Subscription;
import com.financetracker.backend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public Optional<Subscription> getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id);
    }

    public Subscription createSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    public Subscription updateSubscription(Long id, Subscription subscriptionDetails) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));

        subscription.setName(subscriptionDetails.getName());
        subscription.setAmount(subscriptionDetails.getAmount());
        subscription.setBillingCycle(subscriptionDetails.getBillingCycle());
        subscription.setNextPaymentDate(subscriptionDetails.getNextPaymentDate());
        subscription.setCategory(subscriptionDetails.getCategory());
        subscription.setDescription(subscriptionDetails.getDescription());
        subscription.setActive(subscriptionDetails.isActive());

        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }
}
