import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService, Subscription } from '../../services/subscription.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-subscription-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-manager.html',
  styles: []
})
export class SubscriptionManagerComponent implements OnInit {
  subscriptions: Subscription[] = [];
  categories: any[] = [];
  loading = true;
  showForm = false;

  newSubscription: Subscription = {
    name: '',
    amount: 0,
    billingCycle: 'MONTHLY',
    nextPaymentDate: new Date().toISOString().split('T')[0],
    active: true,
    description: ''
  };

  billingCycles = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'];

  constructor(
    private subscriptionService: SubscriptionService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
  }

  loadData(): void {
    this.loading = true;
    this.subscriptionService.getSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load subscriptions', err);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  saveSubscription(): void {
    if (!this.newSubscription.name || this.newSubscription.amount <= 0) return;

    this.subscriptionService.createSubscription(this.newSubscription).subscribe({
      next: () => {
        this.loadData();
        this.toggleForm();
        this.resetNewSubscription();
      },
      error: (err) => console.error('Failed to save subscription', err)
    });
  }

  toggleStatus(sub: Subscription): void {
    if (sub.id) {
      sub.active = !sub.active;
      this.subscriptionService.updateSubscription(sub.id, sub).subscribe({
        error: (err) => {
          console.error('Failed to toggle status', err);
          sub.active = !sub.active; // revert on error
        }
      });
    }
  }

  deleteSubscription(id?: number): void {
    if (id && confirm('Are you sure you want to delete this subscription?')) {
      this.subscriptionService.deleteSubscription(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Failed to delete subscription', err)
      });
    }
  }

  getTotalMonthly(): number {
    return this.subscriptions
      .filter(s => s.active)
      .reduce((sum, s) => {
        let monthlyAmount = s.amount;
        if (s.billingCycle === 'YEARLY') monthlyAmount = s.amount / 12;
        if (s.billingCycle === 'WEEKLY') monthlyAmount = s.amount * 4.33;
        if (s.billingCycle === 'QUARTERLY') monthlyAmount = s.amount / 3;
        return sum + monthlyAmount;
      }, 0);
  }

  private resetNewSubscription(): void {
    this.newSubscription = {
      name: '',
      amount: 0,
      billingCycle: 'MONTHLY',
      nextPaymentDate: new Date().toISOString().split('T')[0],
      active: true,
      description: ''
    };
  }
}
