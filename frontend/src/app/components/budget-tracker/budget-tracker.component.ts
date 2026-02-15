import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-budget-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-tracker.component.html',
  styleUrls: ['./budget-tracker.component.css']
})
export class BudgetTrackerComponent implements OnInit {
  budgets: any[] = [];
  categories: any[] = [];
  budgetForm: FormGroup;
  showForm = false;
  transactions: any[] = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.budgetForm = this.fb.group({
      category: [null, Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      startDate: [new Date().toISOString().substring(0, 10), Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.apiService.getCategories().subscribe(cats => this.categories = cats);
    this.apiService.getTransactions().subscribe(txs => this.transactions = txs);
    this.apiService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
      // We need to calculate spent amount for each budget
      // This is a naive client-side calculation. Ideally backend handles this.
    });
  }

  getSpentAmount(budget: any): number {
    if (!budget.category) return 0;
    return this.transactions
      .filter(t => t.category?.id === budget.category.id && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getProgress(budget: any): number {
    const spent = this.getSpentAmount(budget);
    if (budget.amount === 0) return 0;
    return Math.min((spent / budget.amount) * 100, 100);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  deleteBudget(id: number) {
    if (confirm('Delete this budget?')) {
        this.apiService.deleteBudget(id).subscribe(() => {
            this.budgets = this.budgets.filter(b => b.id !== id);
        });
    }
  }

  onSubmit() {
    if (this.budgetForm.invalid) return;
    
    this.apiService.createBudget(this.budgetForm.value).subscribe({
      next: (newBudget) => {
        this.budgets.push(newBudget);
        this.budgetForm.reset();
        this.showForm = false;
      },
      error: (err) => console.error('Error creating budget', err)
    });
  }
}
