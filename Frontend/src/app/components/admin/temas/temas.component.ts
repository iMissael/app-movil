import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Tema, Materia } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './temas.html',
  styleUrl: './temas.css'
})
export class TemasComponent implements OnInit {
  temas: Tema[] = [];
  temaEditando: Tema | null = null;
  temaViendo: Tema | null = null;
  materia: Materia | null = null;
  mostrarFormulario: boolean = false;
  mostrarDetalles: boolean = false;
  cargando: boolean = true;
  modoEdicion: boolean = false;
  error: string = '';
  materiaId: number = 0;

  // Propiedades separadas para el formulario
  formTitulo: string = '';
  formDescripcion: string = '';
  formOrden: number = 1;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.materiaId = Number(this.route.snapshot.paramMap.get('materiaId'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.error = '';
    
    // Cargar materia y temas
    this.apiService.getTemasByMateria(this.materiaId).subscribe({
      next: (temas) => {
        this.temas = temas;
        if (temas.length > 0 && temas[0].materia) {
          this.materia = temas[0].materia;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando temas:', error);
        this.error = 'Error al cargar los temas';
        this.cargando = false;
        // Datos de ejemplo mientras implementamos
        this.usarDatosEjemplo();
      }
    });
  }

  private usarDatosEjemplo() {
    this.materia = {
      id: this.materiaId,
      nombre: 'Fundamentos de Programación',
      descripcion: 'Introducción a la programación con Python',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.temas = [
      {
        id: 1,
        materia_id: this.materiaId,
        titulo: 'Introducción a la Programación',
        descripcion: 'Conceptos básicos de programación y algoritmos',
        orden: 1,
        subtemas_count: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtemas: [
          {
            id: 1,
            titulo: '¿Qué es programar?',
            descripcion: 'Conceptos fundamentales',
            orden: 1,
            tema_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 2,
        materia_id: this.materiaId,
        titulo: 'Variables y Tipos de Datos',
        descripcion: 'Manejo de variables y tipos de datos en Python',
        orden: 2,
        subtemas_count: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        materia_id: this.materiaId,
        titulo: 'Estructuras de Control',
        descripcion: 'Condicionales y bucles en programación',
        orden: 3,
        subtemas_count: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  crearTema() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.temaEditando = null;
    this.limpiarFormulario();
    this.formOrden = this.obtenerSiguienteOrden();
  }

  editarTema(tema: Tema) {
    this.temaEditando = { ...tema };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.cargarDatosFormulario(tema);
  }

  cargarDatosFormulario(tema: Tema) {
    this.formTitulo = tema.titulo;
    this.formDescripcion = tema.descripcion || '';
    this.formOrden = tema.orden;
  }

  limpiarFormulario() {
    this.formTitulo = '';
    this.formDescripcion = '';
    this.formOrden = 1;
  }

  obtenerSiguienteOrden(): number {
    if (this.temas.length === 0) return 1;
    const maxOrden = Math.max(...this.temas.map(t => t.orden));
    return maxOrden + 1;
  }

  verDetalles(tema: Tema) {
    this.temaViendo = tema;
    this.mostrarDetalles = true;
  }

  verSubtemas(tema: Tema) {
    // Redirigir a la página de subtemas de este tema
    this.router.navigate(['/admin/tema', tema.id, 'subtemas']);
  }

  guardarTema() {
    this.error = '';
    
    if (this.modoEdicion && this.temaEditando) {
      // Editar tema existente
      const temaActualizado = {
        titulo: this.formTitulo,
        descripcion: this.formDescripcion,
        orden: this.formOrden
      };
      
      this.apiService.actualizarTema(this.temaEditando.id, temaActualizado).subscribe({
        next: (tema) => {
          console.log('Tema actualizado:', tema);
          this.mostrarFormulario = false;
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error actualizando tema:', error);
          this.error = 'Error al actualizar el tema';
        }
      });
    } else {
      // Crear nuevo tema
      const nuevoTema = {
        materia_id: this.materiaId,
        titulo: this.formTitulo,
        descripcion: this.formDescripcion,
        orden: this.formOrden
      };
      
      this.apiService.createTema(nuevoTema).subscribe({
        next: (tema) => {
          console.log('Tema creado:', tema);
          this.mostrarFormulario = false;
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error creando tema:', error);
          this.error = 'Error al crear el tema';
        }
      });
    }
  }

  eliminarTema(tema: Tema) {
    if (confirm(`¿Estás seguro de eliminar el tema "${tema.titulo}"?`)) {
      this.apiService.eliminarTema(tema.id).subscribe({
        next: () => {
          console.log('Tema eliminado:', tema.id);
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error eliminando tema:', error);
          this.error = 'Error al eliminar el tema';
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.mostrarDetalles = false;
    this.temaEditando = null;
    this.temaViendo = null;
    this.limpiarFormulario();
    this.error = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  contarSubtemas(tema: Tema): number {
    return tema.subtemas?.length || tema.subtemas_count || 0;
  }

  volverAMaterias() {
    this.router.navigate(['/admin/materias']);
  }
}