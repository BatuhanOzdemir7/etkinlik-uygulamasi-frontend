import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, IEvent } from '../services/event.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class Events implements OnInit {
  
  private eventService = inject(EventService);
  
  // 1. Dizi yerine Sinyal tanımlıyoruz
  eventList = signal<IEvent[]>([]); 
  currentPage = signal<number>(0);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    // Sinyalin güncel değerini okumak için () kullanıyoruz (örn: this.currentPage())
    this.eventService.getEvents(this.currentPage()).subscribe({
      next: (response) => {
        // 2. Veri geldiğinde Sinyale 'set' atıyoruz.
        // Bu işlem, Zoneless mimaride Angular'a "HTML'i hemen çiz!" emrini otomatik verir.
        this.eventList.set(response.content);
      },
      error: (err) => {
        console.error('Etkinlik ağa bağlanırken hata oluştu:', err);
      }
    });
  }

  registerToEvent(eventId: number): void {
    this.eventService.joinEvent(eventId).subscribe({
      next: () => {
        alert('Etkinliğe başarıyla kayıt oldunuz!');
        this.loadEvents();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Kayıt işlemi sırasında bir hata oluştu.';
        alert('Kayıt Başarısız: ' + errorMsg);
      }
    });
  }
}