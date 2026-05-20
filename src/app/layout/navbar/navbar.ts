import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
    standalone: true,
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

    myNickname: string = '';

    ngOnInit(): void {
        // Tarayıcıdan nickname'i oku
        this.myNickname = localStorage.getItem('myNickname') || '';
    }

    private http = inject(HttpClient);
    private router = inject(Router);
    globalName = 'Guest';

    constructor() {
        const name = localStorage.getItem('name');
        if (name) {
            this.globalName = name;
        }
    }

    onSearch(query: string) {
            if (query && query.trim() !== '') {
                // Kullanıcıyı arama parametresi ile etkinlikler sayfasına yönlendirir
                this.router.navigate(['/event/search'], { 
                  queryParams: { 
                    q: query.trim(),
                    page: 0,
                    sortDir: 'asc'
                  } 
                });
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