import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(private http: HttpClient, private router: Router) {}

  logout() {
    // Spring Boot tarafındaki güvenli oturum kapatma uç noktasını tetikliyoruz
    this.http.post('http://localhost:8090/user/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }
}