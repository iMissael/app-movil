import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent implements OnInit {
  isCollapsed = false;
  searchTerm: string = '';
  usuario: User | null = null;
  activeSection: string = 'dashboard';

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

  setActiveSection(section: string) {
    this.activeSection = section;
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