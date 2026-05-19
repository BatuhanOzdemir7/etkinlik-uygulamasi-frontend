import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css']
})
export class EventCreate {
  
  private http = inject(HttpClient);
  private router = inject(Router);

  title = signal('');
  description = signal('');
  eventDate = signal('');
  eventTime = signal('');
  location = signal('');
  category = signal('');
  
  isSubmitting = signal<boolean>(false);
  error = signal<string | null>(null);

  todayDate = new Date().toISOString().split('T')[0];

createEvent() {
    this.isSubmitting.set(true);
    this.error.set(null);

    const selectedDate = this.eventDate();
    const selectedTime = this.eventTime();
    
    const now = new Date();
    const localTodayString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    // Eğer seçilen tarih bugün ise, saat kontrolü (mantıksal validasyon) yapılır
    if (selectedDate === localTodayString) {
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      if (selectedTime < currentTimeString) {
        this.error.set('Geçersiz İşlem: Lütfen saati şu anki güncel saatten sonraki bir zamana giriniz.');
        this.isSubmitting.set(false);
        return; // Hatalı durumda backend'e HTTP isteği atılmasını engeller
      }
    }

    const payload = {
      title: this.title(),
      description: this.description(),
      eventDate: this.eventDate(),
      eventTime: this.eventTime(),
      location: this.location(),
      category: this.category()
    };

    this.http.post('http://localhost:8090/event/create', payload, { withCredentials: true }).subscribe({
      next: () => {
        this.router.navigate(['/my-drafts']); 
      },
      error: (err: any) => {
        console.error('Oluşturma hatası', err);
        this.error.set(err.error?.message || 'Etkinlik oluşturulurken hata meydana geldi. Lütfen bilgileri kontrol edin.');
        this.isSubmitting.set(false);
      }
    });
  }
}