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
        next: (response) => {
           // Gelen yanıtı any olarak yakalayıp parçalıyoruz (nickname eklendi)
           const { id, name, surname, email, nickname } = response as any;
           
           // Tarayıcı hafızasına kayıt
           localStorage.setItem('userId', id);
           localStorage.setItem('myNickname', nickname); // Düzeltilen Satır
           localStorage.setItem('name', name + ' ' + surname);
           localStorage.setItem('email', email);
           
           // Angular Router yerine doğrudan pencere yönlendirmesi
           window.location.href = '/'; 
        },
        error: (error) => {
          alert('Sisteme giriş başarısız: ' + (error.error?.message || 'Bağlantı hatası'));
        }
      });
    }
  }
}