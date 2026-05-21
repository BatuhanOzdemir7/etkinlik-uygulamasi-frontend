import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private http = inject(HttpClient); 
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      
this.http.post('http://localhost:8090/user/login', loginData, { withCredentials: true }).subscribe({
        next: (response: any) => {
           console.log("Login'den dönen saf cevap:", response); // F12'den görmek için
           
           // Backend veriyi 'user', 'data' veya direkt kök dizinde gönderebilir. Hepsini kontrol et:
           const user = response.data || response.user || response.profile || response;
           
           // KESİN ÇÖZÜM: Eğer backend nickname göndermiyorsa, e-postanın @'ten önceki kısmını al
           const finalNickname = user.nickname || user.email.split('@')[0];
           
           // Tarayıcı hafızasına kayıt
           localStorage.setItem('userId', user.id);
           localStorage.setItem('myNickname', finalNickname); // Artık asla 'null' olmayacak
           localStorage.setItem('name', user.name + ' ' + user.surname);
           localStorage.setItem('email', user.email);
           
           // Ana sayfaya yönlendir
           window.location.href = '/'; 
        },
        error: (error) => {
          alert('Sisteme giriş başarısız: ' + (error.error?.message || 'Bağlantı hatası'));
        }
      });
    }
  }
}