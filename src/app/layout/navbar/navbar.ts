import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class Navbar {

    private http = inject(HttpClient);
    globalName = 'Guest';

    constructor() {
        const name = localStorage.getItem('name');
        if (name) {
            this.globalName = name;
        }
    }

    logout() {
        const answer = confirm('Çıkış yapmak istediğinize emin misiniz?');
        if (answer) {
            this.http.post('http://localhost:8090/user/logout', {}, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe({
                next: () => {
                    localStorage.clear();
                    window.location.href = '/';
                },
                error: () => {
                    localStorage.clear();
                    window.location.href = '/';
                }
            });
        }
    }
}