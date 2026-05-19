import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css']
})
export class EventCreate implements OnInit {

  private http    = inject(HttpClient);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  // Form sinyalleri
  title       = signal('');
  description = signal('');
  eventDate   = signal('');
  eventTime   = signal('');
  location    = signal('');
  category    = signal('');

  // Mod sinyalleri
  isEditMode   = signal<boolean>(false);
  eventId      = signal<number | null>(null);
  isSubmitting = signal<boolean>(false);
  error        = signal<string | null>(null);

  todayDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.eventId.set(Number(idParam));
      this.loadEventData(Number(idParam));
    }
  }

  private loadEventData(id: number): void {
    this.http.get<any>(`http://localhost:8090/event/detail/${id}`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          const e = res.event;
          this.title.set(e.title);
          this.description.set(e.description);
          this.eventDate.set(e.eventDate);      // "2026-05-20" formatı — input[type=date] ile uyumlu
          this.eventTime.set(e.eventTime.substring(0, 5)); // "14:00:00" → "14:00"
          this.location.set(e.location);
          this.category.set(e.category);
        },
        error: () => {
          this.error.set('Etkinlik verisi yüklenemedi.');
        }
      });
  }

  private validateDateTime(): boolean {
    const selectedDate = this.eventDate();
    const selectedTime = this.eventTime();
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().split('T')[0];

    if (selectedDate === localToday) {
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (selectedTime < currentTime) {
        this.error.set('Geçersiz İşlem: Lütfen saati şu anki güncel saatten sonraki bir zamana giriniz.');
        return false;
      }
    }
    return true;
  }

  saveEvent(): void {
    this.error.set(null);
    if (!this.validateDateTime()) return;

    this.isSubmitting.set(true);

    if (this.isEditMode()) {
      this.updateEvent();
    } else {
      this.createEvent();
    }
  }

  private createEvent(): void {
    const payload = {
      title:       this.title(),
      description: this.description(),
      eventDate:   this.eventDate(),
      eventTime:   this.eventTime(),
      location:    this.location(),
      category:    this.category()
    };

    this.http.post('http://localhost:8090/event/create', payload, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => this.router.navigate(['/my-drafts']),
      error: (err) => {
        this.error.set(err.error?.message || 'Etkinlik oluşturulurken hata meydana geldi.');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateEvent(): void {
    // Backend EventUpdateRequestDto: id zorunlu, body'den geliyor
    const payload = {
      id:          this.eventId(),
      title:       this.title(),
      description: this.description(),
      eventDate:   this.eventDate(),
      eventTime:   this.eventTime() + ':00', // "14:00" → "14:00:00" — LocalTime için
      location:    this.location(),
      category:    this.category()
    };

    this.http.put('http://localhost:8090/event/update', payload, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => this.router.navigate(['/my-drafts']),
      error: (err) => {
        this.error.set(err.error?.message || 'Etkinlik güncellenirken hata meydana geldi.');
        this.isSubmitting.set(false);
      }
    });
  }
}