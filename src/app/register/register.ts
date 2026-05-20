import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nickname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      enabled: [true], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;

      this.http.post('http://localhost:8090/user/register', registerData, { withCredentials: true }).subscribe({
        next: (response) => {
          alert('Ağa kayıt işlemi başarıyla tamamlandı. Oturum açma protokolüne yönlendiriliyorsunuz.');
          
          // Angular Router ile güvenli ve sayfa yenilemesiz yönlendirme
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Kayıt protokolü başarısız: ' + (error.error?.message || 'Bağlantı hatası tespiti'));
        }
      });
    }
  }
}