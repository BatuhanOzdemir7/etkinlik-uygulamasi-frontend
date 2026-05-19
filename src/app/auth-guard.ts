import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Eğer kod sunucuda (Node.js) çalışıyorsa HTTP isteği atma, doğrudan izin ver.
  // Kararı tarayıcı tarafındaki Angular motoruna bırakıyoruz.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Kod tarayıcıya indiğinde asıl güvenli oturum kontrolünü yap
  return http.get('http://localhost:8090/event/control', {
    withCredentials: true
  }).pipe(
    map(() => true),
    catchError(() => {
      localStorage.clear();
      router.navigate(['/']);
      return of(false);
    })
  );
};