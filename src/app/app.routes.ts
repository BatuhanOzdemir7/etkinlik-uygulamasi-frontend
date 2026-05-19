import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Events } from './events/events';
import { authGuard } from './auth-guard';
import { notAuthGuard } from './not-auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    // Sadece oturum açmamış kişilerin görebileceği rotalar
    { path: '', component: Login, canActivate: [notAuthGuard] },
    { path: 'register', component: Register, canActivate: [notAuthGuard] },

    // Oturum açmış kişilerin görebileceği korumalı ana iskelet (Main Layout)
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'events', component: Events }
            // İleride eklenecek sayfalar (örneğin profil, ajanda) buraya eklenecek
        ]
    }
];