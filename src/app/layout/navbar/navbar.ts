import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-navbar',
    imports: [RouterModule, CommonModule, FormsModule],
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class Navbar {
    private http = inject(HttpClient);
    private router = inject(Router);

// GET metodu kullandığımız için, HTML'de bu değişkene her tıklandığında 
// gidip localStorage'daki en taze veriyi anlık olarak okuyacaktır.
get myNickname(): string {
  return localStorage.getItem('myNickname') || '';
}
    searchQuery = signal<string>('');

    logout() {
        const answer = confirm('Çıkış yapmak istediğinize emin misiniz?');
        if (answer) {
            this.http.post('http://localhost:8090/user/logout', {}, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe({
                next: () => { localStorage.clear(); window.location.href = '/'; },
                error: () => { localStorage.clear(); window.location.href = '/'; }
            });
        }
    }

    onSearch(): void {
        const q = this.searchQuery().trim();
        if (!q) {
            this.router.navigate(['/events']);
            return;
        }
        this.router.navigate(['/events'], { queryParams: { q } });
    }
}