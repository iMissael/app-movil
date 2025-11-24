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
  estadisticas = {
    totalUsuarios: 0,
    totalMaterias: 0,
    totalEjercicios: 0,
    actividadReciente: 0
  };

  actividadReciente: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarActividadReciente();
  }

  cargarEstadisticas() {
    // Datos de ejemplo - conectar con endpoints reales después
    this.estadisticas = {
      totalUsuarios: 45,
      totalMaterias: 8,
      totalEjercicios: 125,
      actividadReciente: 23
    };
  }

  cargarActividadReciente() {
    this.actividadReciente = [
      { usuario: 'Ana García', accion: 'Completó ejercicio', tiempo: 'Hace 5 min', tipo: 'success' },
      { usuario: 'Carlos López', accion: 'Nuevo registro', tiempo: 'Hace 12 min', tipo: 'info' },
      { usuario: 'María Rodríguez', accion: 'Error en ejercicio', tiempo: 'Hace 25 min', tipo: 'warning' },
      { usuario: 'Pedro Martínez', accion: 'Materia completada', tiempo: 'Hace 1 hora', tipo: 'success' }
    ];
  }
}