import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // SSR ortamındaysa sessiz kal, Login sayfasının iskeletini tut
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  return http.get('http://localhost:8090/event/control', {
    withCredentials: true
  }).pipe(
    map(() => {
      // Eğer tarayıcıda oturum bulunursa, Login'de durmasına izin verme, içeri al
      router.navigate(['/events']);
      return false;
    }),
    catchError(() => {
      return of(true);
    })
  );
};