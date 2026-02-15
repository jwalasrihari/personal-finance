import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  categories: any[] = [];
  transactionTypes = ['INCOME', 'EXPENSE'];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      type: ['EXPENSE', Validators.required],
      category: [null, Validators.required] // Expected to be the category object or ID
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories', err)
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form Valid:', this.transactionForm.valid);
    console.log('Form Value:', this.transactionForm.value);

    if (this.transactionForm.invalid) {
      console.log('Form Errors:', this.transactionForm.errors);
      return;
    }

    const formValue = this.transactionForm.value;
    
    this.apiService.createTransaction(formValue).subscribe({
      next: (res) => {
        console.log('Transaction created:', res);
        alert('Transaction saved successfully!');
        this.router.navigate(['/transactions']);
      },
      error: (err) => {
        console.error('Error creating transaction', err);
        alert('Failed to save transaction: ' + (err.error?.message || err.statusText));
      }
    });
  }
}
