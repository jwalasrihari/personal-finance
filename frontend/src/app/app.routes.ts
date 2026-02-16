import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { BudgetTrackerComponent } from './components/budget-tracker/budget-tracker.component';
import { GoalTrackerComponent } from './components/goal-tracker/goal-tracker.component';
import { InsightsComponent } from './components/insights/insights.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { SubscriptionManagerComponent } from './components/subscription-manager/subscription-manager';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },
  { path: 'budgets', component: BudgetTrackerComponent },
  { path: 'goals', component: GoalTrackerComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'categories', component: CategoryManagerComponent },
  { path: 'subscriptions', component: SubscriptionManagerComponent },
  { path: 'notifications', component: NotificationsComponent }
];
