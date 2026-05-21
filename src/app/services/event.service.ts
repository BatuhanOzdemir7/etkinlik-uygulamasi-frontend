import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface IPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface IUser {
  id: number;
  nickname: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  enabled: boolean;
}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  owner: IUser;
  participants: IUser[];
  status: string;
}

export interface IEventDetailResponse {
  event: IEvent;
  success: boolean;
}

export interface IActionResponse {
  success: boolean;
  message: string;
}

// Filtre parametreleri için arayüz
export interface IEventSearchFilters {
  q?: string;
  category?: string;
  location?: string;
  onlyFuture?: boolean;
  page?: number;
  sortDir?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8090/event';

  getEvents(page: number = 0): Observable<IPageResponse<IEvent>> {
    return this.http.get<IPageResponse<IEvent>>(
      `${this.apiUrl}/list?page=${page}`,
      { withCredentials: true }
    );
  }

  // Detay endpoint'inden wrapper'ı soyarak doğrudan IEvent döndürür.
  // participants dizisi bu response'un içinde dolu gelir — ayrı endpoint'e gerek yok.
    getEventDetail(id: number): Observable<IEvent> {
    return this.http.get<any>(
        `${this.apiUrl}/detail/${id}`,
        { withCredentials: true }
    ).pipe(map(response => response.event));
    }

  // POST /event/join/{id}
  joinEvent(id: number): Observable<IActionResponse> {
    return this.http.post<IActionResponse>(
      `${this.apiUrl}/join/${id}`,
      {},
      { withCredentials: true }
    );
  }

  // DELETE /event/leave/{id}
    leaveEvent(id: number): Observable<any> {
    return this.http.delete(
        `${this.apiUrl}/leave/${id}`,
        { withCredentials: true }
    );
    }

searchEvents(filters: IEventSearchFilters): Observable<IPageResponse<IEvent>> {
    let params = new HttpParams()
      .set('page', filters.page || 0)
      .set('sortDir', filters.sortDir || 'asc');

    if (filters.q) params = params.set('q', filters.q);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.onlyFuture !== null && filters.onlyFuture !== undefined) {
      params = params.set('onlyFuture', filters.onlyFuture);
    }

    return this.http.get<IPageResponse<IEvent>>(
      `${this.apiUrl}/search`,
      { params, withCredentials: true }
    );
  }
}