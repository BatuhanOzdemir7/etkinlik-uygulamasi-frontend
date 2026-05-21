import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, IEvent, IEventSearchFilters } from '../services/event.service';

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
  isSearchMode         = signal<boolean>(false);
  
  // Arama durumu sinyalleri
  searchQuery          = signal<string>('');
  searchCategory       = signal<string>('');
  searchLocation       = signal<string>('');
  searchOnlyFuture     = signal<boolean>(false);
  sortDirection        = signal<'asc' | 'desc'>('asc');

  // Form (Arayüz) Bağlantı Değişkenleri
  formQ: string = '';
  formCategory: string = '';
  formLocation: string = '';
  formOnlyFuture: boolean = false;
  formSortDir: string = 'asc';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // URL'den parametreleri okuyup sinyallere aktarıyoruz
      const q = params['q'] ? params['q'].trim() : '';
      const cat = params['category'] ? params['category'].trim() : '';
      const loc = params['location'] ? params['location'].trim() : '';
      const future = params['onlyFuture'] === 'true';
      const sort = params['sortDir'] === 'desc' ? 'desc' : 'asc';
      const page = params['page'] ? parseInt(params['page'], 10) : 0;

      this.searchQuery.set(q);
      this.searchCategory.set(cat);
      this.searchLocation.set(loc);
      this.searchOnlyFuture.set(future);
      this.sortDirection.set(sort);
      this.currentPage.set(page);

      // Arayüzdeki form kutularını URL ile senkronize et
      this.formQ = q;
      this.formCategory = cat;
      this.formLocation = loc;
      this.formOnlyFuture = future;
      this.formSortDir = sort;

      this.isSearchMode.set(!!q || !!cat || !!loc || future);
      this.loadEvents();
    });
  }

  // Arama butonuna basıldığında URL'yi günceller
  onSearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.formQ || null,
        category: this.formCategory || null,
        location: this.formLocation || null,
        onlyFuture: this.formOnlyFuture ? 'true' : null,
        sortDir: this.formSortDir,
        page: 0 // Yeni aramada sayfayı 0'la
      }
    });
  }

loadEvents(): void {
    const filters: IEventSearchFilters = {
      q: this.searchQuery(),
      category: this.searchCategory(),
      location: this.searchLocation(),
      onlyFuture: this.searchOnlyFuture(),
      sortDir: this.sortDirection(),
      page: this.currentPage()
    };

    // İster arama modunda olalım ister olmayalım, HER ZAMAN searchEvents'i çağırıyoruz.
    // Çünkü sıralama (sort) işlemi arka planda bu metodun içinde (backend'de) yapılıyor.
    this.eventService.searchEvents(filters).subscribe({
      next: (res) => { this.eventList.set(res.content); this.totalPages.set(res.totalPages); },
      error: (err) => { console.error(err); this.eventList.set([]); }
    });
  }

  registerToEvent(eventId: number): void {
    this.eventService.joinEvent(eventId).subscribe({  
      next: () => { alert('Etkinliğe başarıyla kayıt oldunuz!'); this.loadEvents(); },
      error: (err) => alert('Kayıt Başarısız: ' + (err.error?.message || 'Hata oluştu.'))
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage() + 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage() - 1 },
        queryParamsHandling: 'merge'
      });
    }
  }
}