import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.apiService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  markAsRead(id: number) {
    this.apiService.markAsRead(id).subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
    });
  }
}
