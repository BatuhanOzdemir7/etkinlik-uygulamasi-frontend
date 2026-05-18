import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Experimental kelimesi kaldırıldı, Angular 21'in kararlı Zoneless motoru aktif
    provideZonelessChangeDetection(), 
    
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch())
  ]
};