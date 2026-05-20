import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-archives',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-archives.html',
  styleUrls: ['./my-archives.css']
})
export class MyArchives implements OnInit {

  private http = inject(HttpClient);

  archiveList  = signal<any[]>([]);
  currentPage  = signal<number>(0);
  totalPages   = signal<number>(0);
  isLoading    = signal<boolean>(true);
  error        = signal<string | null>(null);

  ngOnInit(): void {
    this.loadArchives();
  }

  loadArchives(): void {
    this.isLoading.set(true);
    const page = this.currentPage();

    this.http.get(`http://localhost:8090/event/my-archives?page=${page}`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.archiveList.set(response.content || []);
        this.totalPages.set(response.totalPages || 0);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Arşivler yüklenirken hata oluştu:', err);
        this.error.set('Sistem ağından arşiv verileri çekilemedi.');
        this.isLoading.set(false);
      }
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadArchives();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadArchives();
    }
  }
}