import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Events } from './events/events';
import { EventDetail } from './event-detail/event-detail';
import { MyDrafts } from './my-drafts/my-drafts';
import { EventCreate } from './event-create/event-create';
import { authGuard } from './auth-guard';
import { notAuthGuard } from './not-auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    { path: '', component: Login, canActivate: [notAuthGuard] },
    { path: 'register', component: Register, canActivate: [notAuthGuard] },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'events', component: Events },
            { path: 'events/:id', component: EventDetail },
            { path: 'my-drafts', component: MyDrafts },
            { path: 'events/:id/edit', component: EventCreate }
        ]
    },
    { path: '**', redirectTo: '' }
];