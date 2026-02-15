import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { InsightsService } from '../../services/insights.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit, AfterViewInit {
  healthScore = 0;
  insights: string[] = [];
  loading = true;
  transactions: any[] = [];

  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;

  private categoryChart: Chart | null = null;
  private monthlyChart: Chart | null = null;
  private trendChart: Chart | null = null;

  constructor(
    private apiService: ApiService,
    private insightsService: InsightsService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.apiService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.healthScore = this.insightsService.calculateHealthScore(transactions);
        this.insights = this.insightsService.generateInsights(transactions);
        this.loading = false;
        
        // Small delay to ensure canvas elements are rendered
        setTimeout(() => {
          this.createCategoryChart();
          this.createMonthlyChart();
          this.createTrendChart();
        }, 100);
      },
      error: (err) => {
        console.error('Error loading insights', err);
        this.loading = false;
      }
    });
  }

  private createCategoryChart() {
    const expenses = this.transactions.filter(t => t.type === 'EXPENSE');
    const categoryMap = new Map<string, number>();

    expenses.forEach(t => {
      const cat = t.category?.name || 'Uncategorized';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(t.amount));
    });

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
    const colors = [
      '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
      '#8B5CF6', '#EF4444', '#14B8A6', '#F97316', '#06B6D4'
    ];

    if (this.categoryChartRef?.nativeElement) {
      this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyleWidth: 12,
                font: { size: 13 }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              titleFont: { size: 14 },
              bodyFont: { size: 13 },
              callbacks: {
                label: (ctx) => {
                  const total = data.reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed / total) * 100).toFixed(1);
                  return ` ${ctx.label}: $${ctx.parsed.toFixed(2)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }
  }

  private createMonthlyChart() {
    const monthlyData = new Map<string, { income: number; expense: number }>();

    this.transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData.has(key)) {
        monthlyData.set(key, { income: 0, expense: 0 });
      }
      const entry = monthlyData.get(key)!;
      if (t.type === 'INCOME') {
        entry.income += Number(t.amount);
      } else {
        entry.expense += Number(t.amount);
      }
    });

    // Sort by month
    const sorted = Array.from(monthlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const labels = sorted.map(([key]) => {
      const [y, m] = key.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(m) - 1]} ${y}`;
    });
    const incomeData = sorted.map(([, v]) => v.income);
    const expenseData = sorted.map(([, v]) => v.expense);

    if (this.monthlyChartRef?.nativeElement) {
      this.monthlyChart = new Chart(this.monthlyChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderColor: '#10B981',
              borderWidth: 1,
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            },
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              borderColor: '#EF4444',
              borderWidth: 1,
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                pointStyleWidth: 12,
                font: { size: 13 },
                padding: 16
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toFixed(2)}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (value) => `$${value}`,
                font: { size: 12 }
              }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12 } }
            }
          }
        }
      });
    }
  }

  private createTrendChart() {
    // Sort transactions by date ascending
    const sorted = [...this.transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let balance = 0;
    const labels: string[] = [];
    const balanceData: number[] = [];

    sorted.forEach(t => {
      if (t.type === 'INCOME') {
        balance += Number(t.amount);
      } else {
        balance -= Number(t.amount);
      }
      const d = new Date(t.date);
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
      balanceData.push(balance);
    });

    if (this.trendChartRef?.nativeElement) {
      const ctx = this.trendChartRef.nativeElement.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

      this.trendChart = new Chart(this.trendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Balance',
            data: balanceData,
            borderColor: '#6366F1',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366F1',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              callbacks: {
                label: (ctx) => ` Balance: $${(ctx.parsed.y ?? 0).toFixed(2)}`
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (value) => `$${value}`,
                font: { size: 12 }
              }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12 } }
            }
          }
        }
      });
    }
  }
}
