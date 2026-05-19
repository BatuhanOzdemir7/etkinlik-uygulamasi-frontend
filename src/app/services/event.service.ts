import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Backend'den gelen Page nesnesini karşılayacak arayüz
export interface IPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// Event.java nesnesinin Angular tarafındaki karşılığı
export interface IEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  owner: any; // User objesi tam bilinmediği için any veya IUser tanımlanabilir
  participants: any[];
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8090/event';

  // Sayfalanmış etkinlik listesini çeker
  getEvents(page: number = 0): Observable<IPageResponse<IEvent>> {
    return this.http.get<IPageResponse<IEvent>>(`${this.apiUrl}/list?page=${page}`, { 
      withCredentials: true 
    });
  }

  // Kullanıcıyı etkinliğe kaydeder
  joinEvent(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/join/${id}`, {}, { 
      withCredentials: true 
    });
  }
}