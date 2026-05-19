import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  capacity: number;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class Events {
  
  eventList: IEvent[] = [
    {
      id: 1,
      title: 'Indie Oyun Zirvesi',
      date: '2026-03-27',
      time: '10:00',
      location: 'Mete Cengiz Kültür Merkezi',
      host: 'ULUDOTT',
      description: 'Bağımsız oyun geliştiricilerini bir araya getiren dev zirve. Sektör profesyonelleriyle tanışma ve ağ kurma fırsatı.',
      capacity: 500
    },
    {
      id: 2,
      title: 'ULUDOTT Game Jam',
      date: '2026-05-15',
      time: '18:00',
      location: 'Bursa Uludağ Üniversitesi',
      host: 'ULUDOTT Etkinlik Departmanı',
      description: '48 saatlik kesintisiz oyun geliştirme maratonu. Unity ve 3D modelleme yeteneklerini sergile, takımını kur.',
      capacity: 150
    },
    {
      id: 3,
      title: 'İleri Java Bootcamp',
      date: '2026-06-01',
      time: '20:00',
      location: 'Çevrimiçi Terminal',
      host: 'Sabancı Gençlik Seferberliği',
      description: 'İleri seviye Java, Spring Boot ve nesne yönelimli programlama prensipleri üzerine yoğunlaştırılmış eğitim programı.',
      capacity: 50
    }
  ];
}