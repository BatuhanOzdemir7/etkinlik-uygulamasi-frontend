import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface IProfileUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  bio: string | null;
  badge: string | null;
  hostedCount: number;
  joinedCount: number;
  hostedEvents: any[];
  joinedEvents: any[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  private http  = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private apiUrl = 'http://localhost:8090/user';

  profile     = signal<IProfileUser | null>(null);
  isLoading   = signal<boolean>(true);
  error       = signal<string | null>(null);
  activeTab   = signal<'hosted' | 'joined'>('hosted');
  isMe        = signal<boolean>(false);

  // Profil düzenleme modal sinyalleri
  showEditModal = signal<boolean>(false);
  editBio       = signal<string>('');
  editBadge     = signal<string>('');
  isSaving      = signal<boolean>(false);

  // İlgi alanı analizi: sadece yayımlanmış katıldığım etkinliklerin en çok geçen 3 kategorisi
  topCategories = computed<string[]>(() => {
    const joined = this.publishedJoinedEvents();
    const freq: Record<string, number> = {};
    for (const event of joined) {
      if (event.category) {
        freq[event.category] = (freq[event.category] ?? 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
  });

  // Sadece yayımlanmış organize edilen etkinlikler
  publishedHostedEvents = computed<any[]>(() => {
    return (this.profile()?.hostedEvents ?? []).filter(
      event => event.status?.toUpperCase() === 'PUBLISHED'
    );
  });

  publishedHostedCount = computed<number>(() => this.publishedHostedEvents().length);

  // Sadece yayımlanmış katıldığım etkinlikler
  publishedJoinedEvents = computed<any[]>(() => {
    return (this.profile()?.joinedEvents ?? []).filter(
      event => event.status?.toUpperCase() === 'PUBLISHED'
    );
  });

  publishedJoinedCount = computed<number>(() => this.publishedJoinedEvents().length);

  // Ağ puanı: yayımlanmış organizasyonlar * 10 + yayımlanmış katılımlar * 3
  networkScore = computed<number>(() => {
    return this.publishedHostedCount() * 10 + this.publishedJoinedCount() * 3;
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      // /profile/me rotası — kendi profili
      this.isMe.set(true);
      this.loadMyProfile();
    } else {
      // /profile/:id rotası — başkasının profili
      // Kendi ID'siyle girilip girilmediğini kontrol etmek için önce /me çek
      this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).subscribe({
        next: (res) => {
          if (res.success && res.user.id === Number(idParam)) {
            this.isMe.set(true);
            this.loadMyProfile();
          } else {
            this.isMe.set(false);
            this.loadProfileById(Number(idParam));
          }
        },
        error: () => {
          this.isMe.set(false);
          this.loadProfileById(Number(idParam));
        }
      });
    }
  }

  private loadMyProfile(): void {
    this.http.get<any>(`${this.apiUrl}/profile/me`, { withCredentials: true }).subscribe({
      next: (res) => {
        this.profile.set(res.profile);
        this.editBio.set(res.profile.bio ?? '');
        this.editBadge.set(res.profile.badge ?? 'NET_RUNNER');
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Profil verisi yüklenemedi.');
        this.isLoading.set(false);
      }
    });
  }

  private loadProfileById(id: number): void {
    this.http.get<any>(`${this.apiUrl}/profile/${id}`, { withCredentials: true }).subscribe({
      next: (res) => {
        this.profile.set(res.profile);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Profil verisi yüklenemedi.');
        this.isLoading.set(false);
      }
    });
  }

  openEditModal(): void {
    this.editBio.set(this.profile()?.bio ?? '');
    this.editBadge.set(this.profile()?.badge ?? 'NET_RUNNER');
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  saveProfile(): void {
    this.isSaving.set(true);
    this.http.put(`${this.apiUrl}/profile/update`,
      { bio: this.editBio(), badge: this.editBadge() },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        // Sinyali manuel güncelle — yeniden istek atmaya gerek yok
        const current = this.profile();
        if (current) {
          this.profile.set({ ...current, bio: this.editBio(), badge: this.editBadge() });
        }
        this.isSaving.set(false);
        this.showEditModal.set(false);
      },
      error: () => {
        this.isSaving.set(false);
      }
    });
  }

  setTab(tab: 'hosted' | 'joined'): void {
    this.activeTab.set(tab);
  }

  getInitials(): string {
    const p = this.profile();
    if (!p) return '??';
    return `${p.name[0]}${p.surname[0]}`.toUpperCase();
  }
}