import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService, IEvent, IUser } from '../services/event.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetail implements OnInit {

  private route          = inject(ActivatedRoute);
  private eventService   = inject(EventService);
  private sessionService = inject(SessionService);

  event     = signal<IEvent | null>(null);
  isLoading = signal<boolean>(true);
  isActing  = signal<boolean>(false);
  error     = signal<string | null>(null);
  toast     = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  // event() sinyali değiştiğinde otomatik yeniden hesaplanır — ayrı sinyal gerekmez
  participants = computed<IUser[]>(() => this.event()?.participants ?? []);

  // Mevcut kullanıcı katılımcılar arasında mı?
  isRegistered = computed<boolean>(() => {
    const currentUserId = this.sessionService.currentUser()?.id;
    if (!currentUserId) return false;
    return this.participants().some(p => p.id === currentUserId);
  });

  private eventId!: number;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.eventId) {
      this.error.set('Geçersiz etkinlik ID\'si.');
      this.isLoading.set(false);
      return;
    }

    // currentUser zaten app.component'te yüklendiyse direkt devam et,
    // aksi halde önce kullanıcıyı çek sonra etkinliği yükle.
    if (!this.sessionService.currentUser()) {
      this.sessionService.loadCurrentUser().subscribe({
        next: () => this.loadDetail(),
        error: () => this.loadDetail()
      });
    } else {
      this.loadDetail();
    }
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
      next: (res) => {
        this.showToast(res.message, 'success');
        this.refreshDetail();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Kayıt işlemi başarısız.', 'error');
        this.isActing.set(false);
      }
    });
  }

  leave(): void {
    this.isActing.set(true);
    this.eventService.leaveEvent(this.eventId).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.refreshDetail();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'İptal işlemi başarısız.', 'error');
        this.isActing.set(false);
      }
    });
  }

  private refreshDetail(): void {
    this.eventService.getEventDetail(this.eventId).subscribe({
      next: (data) => {
        this.event.set(data);
        this.isActing.set(false);
      },
      error: () => this.isActing.set(false)
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}