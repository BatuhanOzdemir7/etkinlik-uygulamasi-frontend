import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // Backend'de sadece giriş yapmış kullanıcıların görebileceği bir uç noktaya doğrulama isteği atılır.
  return http.get('http://localhost:8090/event/control', {
    withCredentials: true // Session bilgisini barındıran cookie'leri sunucuya taşır
  }).pipe(
    map(() => true), // HTTP 200 dönerse oturum aktiftir, rota erişimine izin ver
    catchError(() => {
      // HTTP 401 veya 403 dönerse oturum yoktur veya düşmüştür, anasayfaya (Login) at
      localStorage.clear();
      router.navigate(['/']);
      return of(false);
    })
  );
};