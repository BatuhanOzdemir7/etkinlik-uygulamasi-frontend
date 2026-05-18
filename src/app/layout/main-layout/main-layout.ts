import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  // Alt parçaları buraya import ederek HTML şablonunda tanınmalarını sağlıyoruz
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './main-layout.html'
})
export class MainLayout {
}