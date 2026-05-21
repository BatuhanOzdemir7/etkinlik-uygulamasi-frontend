import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, IEvent } from '../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class Events implements OnInit {

  private eventService = inject(EventService);
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);

  eventList            = signal<IEvent[]>([]);
  currentPage          = signal<number>(0);
  totalPages           = signal<number>(0);
  searchQuery          = signal<string>('');
  isSearchMode         = signal<boolean>(false);
  sortDirection        = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q    = params['q'] ? params['q'].trim() : '';
      const page = params['page'] ? parseInt(params['page'], 10) : 0;
      const sort = params['sortDir'] === 'desc' ? 'desc' : 'asc';

      this.searchQuery.set(q);
      this.currentPage.set(page);
      this.sortDirection.set(sort);
      this.isSearchMode.set(!!q);

      this.loadEvents();
    });
  }

  loadEvents(): void {
    const query   = this.searchQuery().trim();
    const sortDir = this.sortDirection();

    if (!query) {
      this.eventService.getEvents(this.currentPage()).subscribe({
        next: (res) => { this.eventList.set(res.content); this.totalPages.set(res.totalPages); },
        error: (err) => { console.error(err); this.eventList.set([]); }
      });
      return;
    }

    this.eventService.searchEvents(query, this.currentPage(), sortDir).subscribe({
      next: (res) => { this.eventList.set(res.content); this.totalPages.set(res.totalPages); },
      error: (err) => { console.error(err); this.eventList.set([]); }
    });
  }

  setSortDirection(direction: string): void {
    this.sortDirection.set(direction as 'asc' | 'desc');
    this.currentPage.set(0);
    this.loadEvents();
  }

  registerToEvent(eventId: number): void {
    this.eventService.joinEvent(eventId).subscribe({  
      next: () => { alert('Etkinliğe başarıyla kayıt oldunuz!'); this.loadEvents(); },
      error: (err) => alert('Kayıt Başarısız: ' + (err.error?.message || 'Hata oluştu.'))
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadEvents();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadEvents();
    }
  }
}