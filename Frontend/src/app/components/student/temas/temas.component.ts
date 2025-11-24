import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './temas.html',
  styleUrl: './temas.css'
})
export class TemasComponent implements OnInit {
  materiaId: number = 0;
  temas: any[] = [];
  materia: any = null;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.materiaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTemas();
  }

  cargarTemas() {
    this.cargando = true;
    this.apiService.getTemasByMateria(this.materiaId).subscribe({
      next: (temas) => {
        this.temas = temas;
        if (temas.length > 0) {
          this.materia = temas[0].materia;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando temas:', error);
        // Datos de ejemplo
        this.materia = {
          nombre: 'Fundamentos de Programación',
          descripcion: 'Introducción a la programación con Python'
        };
        this.temas = [
          {
            id: 1,
            titulo: 'Introducción a la Programación',
            descripcion: 'Conceptos básicos de programación',
            orden: 1,
            subtemas_count: 3,
            completado: true
          },
          {
            id: 2,
            titulo: 'Variables y Tipos de Datos',
            descripcion: 'Manejo de variables y tipos de datos',
            orden: 2,
            subtemas_count: 4,
            completado: true
          },
          {
            id: 3,
            titulo: 'Estructuras de Control',
            descripcion: 'Condicionales y bucles',
            orden: 3,
            subtemas_count: 5,
            completado: false
          }
        ];
        this.cargando = false;
      }
    });
  }
}