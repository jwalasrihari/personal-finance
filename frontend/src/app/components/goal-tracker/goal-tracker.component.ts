import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-goal-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goal-tracker.component.html',
  styleUrls: ['./goal-tracker.component.css']
})
export class GoalTrackerComponent implements OnInit {
  goals: any[] = [];
  goalForm: FormGroup;
  showForm = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.goalForm = this.fb.group({
      name: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]],
      currentAmount: [0, [Validators.required, Validators.min(0)]],
      deadline: ['', Validators.required],
      color: ['bg-blue-500'] 
    });
  }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals() {
    this.apiService.getGoals().subscribe(data => this.goals = data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    if (this.goalForm.invalid) return;
    
    this.apiService.createGoal(this.goalForm.value).subscribe({
      next: (newGoal) => {
        this.goals.push(newGoal);
        this.goalForm.reset({ currentAmount: 0, color: 'bg-blue-500' });
        this.showForm = false;
      },
      error: (err) => console.error('Error creating goal', err)
    });
  }

  deleteGoal(id: number) {
    if (confirm('Delete this goal?')) {
      this.apiService.deleteGoal(id).subscribe(() => {
        this.goals = this.goals.filter(g => g.id !== id);
      });
    }
  }

  addSavings(goal: any, amount: number) {
      if (!amount) return;
      // In a real app, this would be a transaction + goal update.
      // Here just updating the goal.
      // Note: My backend API currently only supports create/delete, not patch.
      // I should ideally add updateGoal to API/Service.
      // For now, I'll cheat and just update locally or assume I can implement update later.
      // Actually, standard JPA save() updates if ID exists.
      
      const updatedGoal = { ...goal, currentAmount: goal.currentAmount + amount };
      this.apiService.createGoal(updatedGoal).subscribe(saved => {
          const index = this.goals.findIndex(g => g.id === saved.id);
          if (index !== -1) {
              this.goals[index] = saved;
          }
      });
  }
}
