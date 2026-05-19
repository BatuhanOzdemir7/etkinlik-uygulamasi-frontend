import { Component, OnInit, inject, signal } from '@angular/core';
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
  participants = signal<IUser[]>([]);
  isLoading    = signal<boolean>(true);
  error        = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Geçersiz etkinlik ID\'si.');
      this.isLoading.set(false);
      return;
    }

    this.loadDetail(id);
    this.loadParticipants(id);
  }

  private loadDetail(id: number): void {
    this.eventService.getEventDetail(id).subscribe({
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

  private loadParticipants(id: number): void {
    this.eventService.getParticipants(id).subscribe({
      next: (data) => this.participants.set(data),
      error: () => this.participants.set([])
    });
  }
}