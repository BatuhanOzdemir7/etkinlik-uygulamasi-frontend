import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // responseType: 'text' eklenerek JSON Parse hatası kesin olarak engellenir
  return http.get('http://localhost:8090/event/control', {
    withCredentials: true,
    responseType: 'text' 
  }).pipe(
    map(() => true),
    catchError(() => {
      localStorage.clear();
      router.navigate(['/']);
      return of(false);
    })
  );
};