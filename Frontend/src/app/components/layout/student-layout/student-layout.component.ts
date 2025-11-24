import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css'
})
export class StudentLayoutComponent implements OnInit {
  isCollapsed = false;
  searchTerm: string = '';
  usuario: User | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuario = JSON.parse(userData);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenu() {
    // Si el sidebar está colapsado en móvil, cerrarlo después de hacer clic
    if (window.innerWidth < 768) {
      this.isCollapsed = true;
    }
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        this.limpiarSesion();
      },
      error: () => {
        this.limpiarSesion();
      }
    });
  }

  private limpiarSesion() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}