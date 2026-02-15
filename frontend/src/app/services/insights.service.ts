import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {

  calculateHealthScore(transactions: any[]): number {
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
      
    if (totalIncome === 0) return 0;
    
    const savingsRate = (totalIncome - totalExpense) / totalIncome;
    
    // Simple logic:
    // Base 50
    // + score for savings rate
    let score = 50;
    if (savingsRate > 0) {
        score += savingsRate * 100; // e.g. 0.2 * 100 = +20 -> 70
    } else {
        score -= Math.abs(savingsRate) * 100; // e.g. -0.1 * 100 = -10 -> 40
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  generateInsights(transactions: any[]): string[] {
    const insights = [];
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    if (totalExpense > totalIncome) {
        insights.push('Warning: You are spending more than you earn.');
    } else if (totalExpense > totalIncome * 0.8) {
        insights.push('Caution: You are spending over 80% of your income.');
    } else {
         insights.push('Great job! You are saving a healthy portion of your income.');
    }
    
    // Category insights
    // Group by category...
    
    return insights;
  }
}
