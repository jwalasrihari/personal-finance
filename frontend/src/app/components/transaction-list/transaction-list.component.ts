import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.apiService.getTransactions().subscribe({
      next: (data) => {
        console.log('Transaction List Data:', data);
        this.transactions = data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.filteredTransactions = [...this.transactions];
      },
      error: (err) => console.error('Error fetching transactions', err)
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.apiService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(t => t.id !== id);
          this.filterTransactions();
        },
        error: (err) => console.error('Error deleting transaction', err)
      });
    }
  }

  filterTransactions() {
    if (!this.searchTerm) {
      this.filteredTransactions = this.transactions;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTransactions = this.transactions.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category?.name.toLowerCase().includes(term)
      );
    }
  }
    
  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.filterTransactions();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.apiService.uploadTransactions(file).subscribe({
            next: (newTransactions) => {
                this.transactions.push(...newTransactions);
                this.loadTransactions();
            },
            error: (err) => alert('Failed to upload file')
        });
    }
  }
}
