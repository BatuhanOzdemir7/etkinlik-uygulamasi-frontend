import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

searchEvents(q: string, page: number = 0, sortDir: string = 'asc'): Observable<IPageResponse<IEvent>> {
  return this.http.get<IPageResponse<IEvent>>(
    `${this.apiUrl}/search?q=${encodeURIComponent(q)}&page=${page}&sortDir=${sortDir}`,
    { withCredentials: true }
  );
}
}