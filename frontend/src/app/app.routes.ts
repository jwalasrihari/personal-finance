import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { BudgetTrackerComponent } from './components/budget-tracker/budget-tracker.component';
import { GoalTrackerComponent } from './components/goal-tracker/goal-tracker.component';
import { InsightsComponent } from './components/insights/insights.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },
  { path: 'budgets', component: BudgetTrackerComponent },
  { path: 'goals', component: GoalTrackerComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'notifications', component: NotificationsComponent },
];
