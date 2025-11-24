import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './materias.html',
  styleUrl: './materias.css'
})
export class MateriasComponent implements OnInit {
  materias: any[] = [];
  cargando: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarMaterias();
  }

  cargarMaterias() {
    this.cargando = true;
    this.apiService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando materias:', error);
        this.cargando = false;
        // Datos de ejemplo para desarrollo
        this.materias = [
          {
            id: 1,
            nombre: 'Fundamentos de Programación',
            descripcion: 'Introducción a la programación con Python',
            progreso: 75,
            temas_count: 5
          },
          {
            id: 2,
            nombre: 'Programación Orientada a Objetos',
            descripcion: 'Programación con Java y POO',
            progreso: 40,
            temas_count: 4
          }
        ];
        this.cargando = false;
      }
    });
  }

  calcularProgreso(materia: any): number {
    return materia.progreso || 0;
  }
}