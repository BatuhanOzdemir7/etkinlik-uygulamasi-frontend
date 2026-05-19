import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Backend'den gelen Page nesnesini karşılayacak arayüz
export interface IPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// Backend'den dönen kullanıcı nesnesi
export interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  enabled: boolean;
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
  owner: IUser;
  participants: IUser[];
  status: string;
}

// /event/detail/{id} endpoint'inin döndürdüğü wrapper
export interface IEventDetailResponse {
  event: IEvent;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8090/event';

  // Sayfalanmış etkinlik listesini çeker
  getEvents(page: number = 0): Observable<IPageResponse<IEvent>> {
    return this.http.get<IPageResponse<IEvent>>(
      `${this.apiUrl}/list?page=${page}`,
      { withCredentials: true }
    );
  }

  // Tek etkinliğin detayını çeker; wrapper'dan IEvent'i ayıklayarak döner
  getEventDetail(id: number): Observable<IEvent> {
    return this.http.get<IEventDetailResponse>(
      `${this.apiUrl}/detail/${id}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.event)
    );
  }

  // Etkinliğe katılan kullanıcıların listesini çeker
  getParticipants(id: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      `${this.apiUrl}/${id}/participants`,
      { withCredentials: true }
    );
  }

  // Kullanıcıyı etkinliğe kaydeder
  joinEvent(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/join/${id}`,
      {},
      { withCredentials: true }
    );
  }
}