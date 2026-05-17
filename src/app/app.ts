import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- BU İMPORTUN OLDUĞUNDAN EMİN OL

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- BİLEŞENİN ROUTEROUTLET'İ TANIMASI İÇİN BURAYA EKLENMELİ
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'frontend';
}