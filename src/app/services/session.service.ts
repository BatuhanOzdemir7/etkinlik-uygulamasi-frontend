import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface ISessionUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface IMeResponse {
  success: boolean;
  user: ISessionUser;
}

@Injectable({ providedIn: 'root' })
export class SessionService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8090/user';

  // Oturum açmış kullanıcı — uygulama genelinde tek kaynak
  currentUser = signal<ISessionUser | null>(null);

  /**
   * Backend'den oturum açmış kullanıcıyı çeker ve sinyale yazar.
   * app.component.ts'de ngOnInit'te bir kez çağrılması yeterli.
   */
  loadCurrentUser(): Observable<IMeResponse> {
    return this.http.get<IMeResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.currentUser.set(response.user);
        }
      })
    );
  }

  clearCurrentUser(): void {
    this.currentUser.set(null);
  }
}