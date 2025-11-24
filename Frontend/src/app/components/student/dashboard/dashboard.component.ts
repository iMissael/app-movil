import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  usuario: any = null;
  estadisticas = {
    materiasActivas: 0,
    ejerciciosCompletados: 0,
    progresoGeneral: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarUsuario();
    this.cargarEstadisticas();
  }

  cargarUsuario() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuario = JSON.parse(userData);
    }
  }

  cargarEstadisticas() {
    // Datos de ejemplo - luego conectaremos con el backend
    this.estadisticas = {
      materiasActivas: 2,
      ejerciciosCompletados: 15,
      progresoGeneral: 65
    };
  }
}