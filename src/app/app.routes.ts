import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
    {path: '', component: Login}, //sayfaya ilk defa giriş yaptığında login sayfasını göstermek için
    {path: 'register', component: Register} //kayıt sayfasına yönlendirmek için
];