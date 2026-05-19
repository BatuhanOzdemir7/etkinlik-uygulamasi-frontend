import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService, IEvent, IUser } from '../services/event.service';

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

  event        = signal<IEvent | null>(null);
  isLoading    = signal<boolean>(true);
  isActing     = signal<boolean>(false);
  error        = signal<string | null>(null);
  toast        = signal<{ message: string; type: 'success' | 'error' } | null>(null);

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
        this.showToast(res.message, 'success');
        this.loadDetail();
      },
      error: (err: any) => {
        this.showToast(err.error?.message || 'Kayıt işlemi başarısız.', 'error');
        this.isActing.set(false);
      }
    });
  }

  leave(): void {
    this.isActing.set(true);
    this.eventService.leaveEvent(this.eventId).subscribe({
      next: (res: any) => {
        this.showToast(res.message, 'success');
        this.loadDetail();
      },
      error: (err: any) => {
        this.showToast(err.error?.message || 'İptal işlemi başarısız.', 'error');
        this.isActing.set(false);
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}