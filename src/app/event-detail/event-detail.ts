import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService, IEvent, IUser } from '../services/event.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetail implements OnInit {

  private route        = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private http         = inject(HttpClient); // Eksik olan HttpClient bağımlılığı eklendi

  event        = signal<IEvent | null>(null);
  isLoading    = signal<boolean>(true);
  isActing     = signal<boolean>(false);
  error        = signal<string | null>(null);
  toast        = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  
  isRegistered = computed(() => {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) return false;
    return this.participants().some(p => p.email === userEmail);
  });

  participants = computed<IUser[]>(() => this.event()?.participants ?? []);

  private eventId!: number;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.eventId) {
      this.error.set('Geçersiz etkinlik ID\'si.');
      this.isLoading.set(false);
      return;
    }
    this.loadDetail();
  }

  private loadDetail(): void {
    this.eventService.getEventDetail(this.eventId).subscribe({
      next: (data) => {
        this.event.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Etkinlik detayı yüklenemedi.');
        this.isLoading.set(false);
      }
    });
  }

  join(): void {
    this.isActing.set(true);
    this.eventService.joinEvent(this.eventId).subscribe({
      next: (res: any) => {
        // showToast yerine doğrudan toast sinyali güncellendi
        this.toast.set({ message: res.message || 'İşlem başarılı.', type: 'success' });
        setTimeout(() => this.toast.set(null), 3000);
        this.loadDetail();
      },
      error: (err: any) => {
        // showToast yerine doğrudan toast sinyali güncellendi
        this.toast.set({ message: err.error?.message || 'Kayıt işlemi başarısız.', type: 'error' });
        setTimeout(() => this.toast.set(null), 3000);
        this.isActing.set(false);
      },
      complete: () => {
        this.isActing.set(false);
      }
    });
  }

  leave() {
    this.isActing.set(true);
    const currentEventId = this.event()!.id;

    this.http.delete(`http://localhost:8090/event/leave/${currentEventId}`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadDetail(); // Tanımlı olmayan fetchEventDetail yerine mevcut fonksiyon kullanıldı
        this.toast.set({ type: 'success', message: 'Ağdan çıkış yapıldı.' });
        setTimeout(() => this.toast.set(null), 3000);
      },
      error: (error: any) => {
        console.error('İptal Hatası:', error);
        this.toast.set({ type: 'error', message: 'Çıkış işlemi başarısız.' });
        setTimeout(() => this.toast.set(null), 3000);
      },
      complete: () => {
        this.isActing.set(false);
      }
    });
  }

  registerToEvent(id: number) {
    this.isActing.set(true);
    
    this.http.post(`http://localhost:8090/event/join/${id}`, {}, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadDetail(); // Tanımlı olmayan fetchEventDetail yerine mevcut fonksiyon kullanıldı
        this.toast.set({ type: 'success', message: 'Ağa başarıyla katıldın.' });
        setTimeout(() => this.toast.set(null), 3000);
      },
      error: (error: any) => {
        console.error('Kayıt Hatası:', error);
        this.toast.set({ type: 'error', message: 'Bağlantı reddedildi.' });
        setTimeout(() => this.toast.set(null), 3000);
      },
      complete: () => {
        this.isActing.set(false);
      }
    });
  }
  
}