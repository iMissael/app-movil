import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Materia } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './materias.html',
  styleUrl: './materias.css'
})
export class MateriasComponent implements OnInit {
  materias: Materia[] = [];
  materiaEditando: Materia | null = null;
  materiaViendo: Materia | null = null;
  mostrarFormulario: boolean = false;
  mostrarDetalles: boolean = false;
  cargando: boolean = true;
  modoEdicion: boolean = false;
  error: string = '';

  // Propiedades separadas para el formulario
  formNombre: string = '';
  formDescripcion: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMaterias();
  }

  cargarMaterias() {
    this.cargando = true;
    this.error = '';
    
    this.apiService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando materias:', error);
        this.error = 'Error al cargar las materias';
        this.cargando = false;
        // Datos de ejemplo mientras implementamos
        this.usarDatosEjemplo();
      }
    });
  }

  private usarDatosEjemplo() {
    this.materias = [
      {
        id: 1,
        nombre: 'Fundamentos de Programación',
        descripcion: 'Introducción a la programación con Python',
        progreso: 75,
        temas_count: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        temas: [
          {
            id: 1,
            titulo: 'Introducción a la Programación',
            descripcion: 'Conceptos básicos',
            orden: 1,
            materia_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            titulo: 'Variables y Tipos de Datos',
            descripcion: 'Manejo de variables',
            orden: 2,
            materia_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 2,
        nombre: 'Programación Orientada a Objetos',
        descripcion: 'POO con Java',
        progreso: 40,
        temas_count: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        temas: [
          {
            id: 3,
            titulo: 'Clases y Objetos',
            descripcion: 'Fundamentos de POO',
            orden: 1,
            materia_id: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
    ];
  }

  crearMateria() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.materiaEditando = null;
    this.limpiarFormulario();
  }

  editarMateria(materia: Materia) {
    this.materiaEditando = { ...materia };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.cargarDatosFormulario(materia);
  }

  cargarDatosFormulario(materia: Materia) {
    this.formNombre = materia.nombre;
    this.formDescripcion = materia.descripcion || '';
  }

  limpiarFormulario() {
    this.formNombre = '';
    this.formDescripcion = '';
  }

  verDetalles(materia: Materia) {
    this.materiaViendo = materia;
    this.mostrarDetalles = true;
  }

  verTemas(materia: Materia) {
    // Redirigir a la página de temas de esta materia
    this.router.navigate(['/admin/materia', materia.id, 'temas']);
  }

  guardarMateria() {
    this.error = '';
    
    if (this.modoEdicion && this.materiaEditando) {
      // Editar materia existente
      const materiaActualizada = {
        nombre: this.formNombre,
        descripcion: this.formDescripcion
      };
      
      this.apiService.actualizarMateria(this.materiaEditando.id, materiaActualizada).subscribe({
        next: (materia) => {
          console.log('Materia actualizada:', materia);
          this.mostrarFormulario = false;
          this.cargarMaterias();
        },
        error: (error) => {
          console.error('Error actualizando materia:', error);
          this.error = 'Error al actualizar la materia';
        }
      });
    } else {
      // Crear nueva materia
      const nuevaMateria = {
        nombre: this.formNombre,
        descripcion: this.formDescripcion
      };
      
      this.apiService.createMateria(nuevaMateria).subscribe({
        next: (materia) => {
          console.log('Materia creada:', materia);
          this.mostrarFormulario = false;
          this.cargarMaterias();
        },
        error: (error) => {
          console.error('Error creando materia:', error);
          this.error = 'Error al crear la materia';
        }
      });
    }
  }

  eliminarMateria(materia: Materia) {
    if (confirm(`¿Estás seguro de eliminar la materia "${materia.nombre}"?`)) {
      this.apiService.eliminarMateria(materia.id).subscribe({
        next: () => {
          console.log('Materia eliminada:', materia.id);
          this.cargarMaterias();
        },
        error: (error) => {
          console.error('Error eliminando materia:', error);
          this.error = 'Error al eliminar la materia';
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.mostrarDetalles = false;
    this.materiaEditando = null;
    this.materiaViendo = null;
    this.limpiarFormulario();
    this.error = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  contarTemas(materia: Materia): number {
    return materia.temas?.length || materia.temas_count || 0;
  }
}