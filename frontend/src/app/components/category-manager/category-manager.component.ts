import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  categories: any[] = [];
  showForm = false;
  newCategory = { name: '', type: 'EXPENSE', color: '#6366F1' };

  // Preset color palette
  colorPalette = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  selectColor(color: string) {
    this.newCategory.color = color;
  }

  saveCategory() {
    if (!this.newCategory.name.trim()) return;

    this.apiService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.resetForm();
        this.showForm = false;
      },
      error: (err) => {
        console.error('Error creating category', err);
        alert('Failed to create category');
      }
    });
  }

  deleteCategory(id: number, name: string) {
    if (confirm(`Delete category "${name}"? Transactions using it will become uncategorized.`)) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Error deleting category', err)
      });
    }
  }

  private resetForm() {
    this.newCategory = { name: '', type: 'EXPENSE', color: '#6366F1' };
  }
}
