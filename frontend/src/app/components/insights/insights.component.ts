import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { InsightsService } from '../../services/insights.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  healthScore = 0;
  insights: string[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private insightsService: InsightsService
  ) { }

  ngOnInit(): void {
    this.apiService.getTransactions().subscribe({
        next: (transactions) => {
            this.healthScore = this.insightsService.calculateHealthScore(transactions);
            this.insights = this.insightsService.generateInsights(transactions);
            this.loading = false;
        },
        error: (err) => console.error('Error loading insights', err)
    });
  }
}
