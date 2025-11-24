import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LoginRequest } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onLogin() {
    this.apiService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirigir según el rol
        if (response.user.rol === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/student/materias']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Error en el login. Verifica tus credenciales.';
        console.error('Login error:', error);
      }
    });
  }
}