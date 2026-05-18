import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get('http://localhost:8090/event/control', {
    withCredentials: true
  }).pipe(
    map(() => {
      // Eğer oturum varsa (hata dönmediyse), kullanıcıyı doğrudan etkinliklerin olduğu ana sisteme yönlendir
      router.navigate(['/events']);
      return false;
    }),
    catchError(() => {
      // Eğer hata dönerse (oturum yoksa), login/register formlarını görmesine izin ver
      return of(true);
    })
  );
};