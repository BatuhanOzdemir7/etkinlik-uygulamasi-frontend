import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, IEvent } from '../services/event.service';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class Events implements OnInit {
  
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  
  eventList = signal<IEvent[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);

  searchQuery = signal<string>('');
  selectedFilterFields = signal<string[]>(['title']);
  showFilterModal = signal<boolean>(false);
  sortDirection = signal<'asc' | 'desc'>('asc');

  filterOptions = [
    { id: 'title', label: 'Başlık' },
    { id: 'description', label: 'Açıklama' },
    { id: 'host', label: 'Host' },
    { id: 'location', label: 'Konum' },
    { id: 'category', label: 'Kategori' }
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] ?? '';
      const fields = params['fields'] ? params['fields'].split(',') : ['title'];
      const page = params['page'] ? parseInt(params['page'], 10) : 0;
      const sort = params['sortDir'] === 'desc' ? 'desc' : 'asc';

      this.searchQuery.set(q.trim());
      this.selectedFilterFields.set(fields);
      this.currentPage.set(page);
      this.sortDirection.set(sort);

      this.loadEvents();
    });
  }

  loadEvents(): void {
    const query = this.searchQuery().trim();
    const fields = this.selectedFilterFields();
    const sortDir = this.sortDirection();

    if (query === '' || fields.length === 0) {
      this.eventService.getEvents(this.currentPage()).subscribe({
        next: (response) => {
          this.eventList.set(response.content);
          this.totalPages.set(response.totalPages);
        },
        error: (err) => {
          console.error('Etkinlik ağa bağlanırken hata oluştu:', err);
          this.eventList.set([]);
        }
      });
      return;
    }

    const params: any = {
      title: fields.includes('title') ? query : undefined,
      description: fields.includes('description') ? query : undefined,
      host: fields.includes('host') ? query : undefined,
      location: fields.includes('location') ? query : undefined,
      category: fields.includes('category') ? query : undefined
    };

    this.eventService.searchEvents(
      '',
      this.currentPage(),
      sortDir,
      params.category,
      params.location,
      params.host,
      params.title,
      params.description
    ).subscribe({
      next: (response) => {
        this.eventList.set(response.content);
        this.totalPages.set(response.totalPages);
      },
      error: (err) => {
        console.error('Etkinlik ağa bağlanırken hata oluştu:', err);
        this.eventList.set([]);
      }
    });
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(0);
    this.loadEvents();
  }

  toggleFilterField(fieldId: string): void {
    const current = this.selectedFilterFields();
    if (current.includes(fieldId)) {
      this.selectedFilterFields.set(current.filter(f => f !== fieldId));
    } else {
      this.selectedFilterFields.set([...current, fieldId]);
    }
    this.currentPage.set(0);
    this.loadEvents();
  }

  toggleFilterModal(): void {
    this.showFilterModal.set(!this.showFilterModal());
  }

  setSortDirection(direction: string): void {
    this.sortDirection.set(direction as 'asc' | 'desc');
    this.currentPage.set(0);
    this.loadEvents();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedFilterFields.set(['title']);
    this.sortDirection.set('asc');
    this.currentPage.set(0);
    this.loadEvents();
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

  // Sonraki Sayfa Metodu
  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadEvents();
    }
  }

  // Önceki Sayfa Metodu
  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadEvents();
    }
  }
}