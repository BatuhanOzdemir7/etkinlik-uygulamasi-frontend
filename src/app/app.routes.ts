import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './auth-guard';
import { notAuthGuard } from './not-auth-guard';
import { Events } from './events/events';

export const routes: Routes = [
    // Giriş yapmış birinin tekrar bu sayfalara girmesini engelleyen koruma
    {path: '', component: Login, canActivate: [notAuthGuard]},
    {path: 'register', component: Register, canActivate: [notAuthGuard]},
    
    // Sadece giriş yapanların görebileceği, Navbar ve Footer içeren ana sistem
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {path: 'events', component: Events} // url/events yazılınca layoutun ortasında açılacak
        ]
    }
];