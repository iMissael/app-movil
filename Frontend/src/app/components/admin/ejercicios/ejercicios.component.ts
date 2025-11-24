import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Ejercicio, Subtema, Tema, Materia } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ejercicios.html',
  styleUrls: ['./ejercicios.css']
})
export class EjerciciosComponent implements OnInit {
  ejercicios: Ejercicio[] = [];
  ejercicioEditando: Ejercicio | null = null;
  ejercicioViendo: Ejercicio | null = null;
  subtema: Subtema | null = null;
  tema: Tema | null = null;
  materia: Materia | null = null;
  mostrarFormulario: boolean = false;
  mostrarDetalles: boolean = false;
  cargando: boolean = true;
  modoEdicion: boolean = false;
  error: string = '';
  subtemaId: number = 0;

  // Propiedades separadas para el formulario
  formEnunciado: string = '';
  formDificultad: 'baja' | 'media' | 'alta' = 'media';
  formTipo: 'opcion_multiple' | 'teorico' | 'codigo' = 'teorico';
  formSolucionEjemplo: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subtemaId = Number(this.route.snapshot.paramMap.get('subtemaId'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.error = '';
    
    // Cargar ejercicios por subtema
    this.apiService.getEjerciciosBySubtema(this.subtemaId).subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
        if (ejercicios.length > 0 && ejercicios[0].subtema) {
          this.subtema = ejercicios[0].subtema;
          this.tema = ejercicios[0].subtema.tema || null;
          this.materia = ejercicios[0].subtema.tema?.materia || null;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando ejercicios:', error);
        this.error = 'Error al cargar los ejercicios';
        this.cargando = false;
        // Datos de ejemplo mientras implementamos
        this.usarDatosEjemplo();
      }
    });
  }

  private usarDatosEjemplo() {
    this.materia = {
      id: 1,
      nombre: 'Fundamentos de Programación',
      descripcion: 'Introducción a la programación con Python',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.tema = {
      id: 1,
      materia_id: 1,
      titulo: 'Variables y Tipos de Datos',
      descripcion: 'Manejo de variables y tipos de datos en Python',
      orden: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      materia: this.materia
    };

    this.subtema = {
      id: this.subtemaId,
      tema_id: 1,
      titulo: '¿Qué son las variables?',
      descripcion: 'Concepto y uso de variables en programación',
      orden: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tema: this.tema
    };

    this.ejercicios = [
      {
        id: 1,
        subtema_id: this.subtemaId,
        enunciado: '¿Qué es una variable en programación?',
        dificultad: 'baja',
        tipo: 'teorico',
        solucion_ejemplo: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtema: this.subtema
      },
      {
        id: 2,
        subtema_id: this.subtemaId,
        enunciado: 'Escribe un programa que declare una variable llamada "edad" y le asigne el valor 25.',
        dificultad: 'media',
        tipo: 'codigo',
        solucion_ejemplo: 'edad = 25\nprint(edad)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtema: this.subtema
      },
      {
        id: 3,
        subtema_id: this.subtemaId,
        enunciado: 'Selecciona el tipo de dato correcto para almacenar un nombre:',
        dificultad: 'media',
        tipo: 'opcion_multiple',
        solucion_ejemplo: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtema: this.subtema
      }
    ];
  }

  crearEjercicio() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.ejercicioEditando = null;
    this.limpiarFormulario();
  }

  editarEjercicio(ejercicio: Ejercicio) {
    this.ejercicioEditando = { ...ejercicio };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.cargarDatosFormulario(ejercicio);
  }

  cargarDatosFormulario(ejercicio: Ejercicio) {
    this.formEnunciado = ejercicio.enunciado;
    this.formDificultad = ejercicio.dificultad;
    this.formTipo = ejercicio.tipo;
    this.formSolucionEjemplo = ejercicio.solucion_ejemplo || '';
  }

  limpiarFormulario() {
    this.formEnunciado = '';
    this.formDificultad = 'media';
    this.formTipo = 'teorico';
    this.formSolucionEjemplo = '';
  }

  verDetalles(ejercicio: Ejercicio) {
    this.ejercicioViendo = ejercicio;
    this.mostrarDetalles = true;
  }

  guardarEjercicio() {
    this.error = '';
    
    if (this.modoEdicion && this.ejercicioEditando) {
      // Editar ejercicio existente
      const ejercicioActualizado = {
        enunciado: this.formEnunciado,
        dificultad: this.formDificultad,
        tipo: this.formTipo,
        solucion_ejemplo: this.formTipo === 'codigo' ? this.formSolucionEjemplo : null
      };
      
      this.apiService.updateEjercicio(this.ejercicioEditando.id, ejercicioActualizado).subscribe({
        next: (ejercicio) => {
          console.log('Ejercicio actualizado:', ejercicio);
          this.mostrarFormulario = false;
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error actualizando ejercicio:', error);
          this.error = 'Error al actualizar el ejercicio';
        }
      });
    } else {
      // Crear nuevo ejercicio
      const nuevoEjercicio = {
        subtema_id: this.subtemaId,
        enunciado: this.formEnunciado,
        dificultad: this.formDificultad,
        tipo: this.formTipo,
        solucion_ejemplo: this.formTipo === 'codigo' ? this.formSolucionEjemplo : null
      };
      
      this.apiService.createEjercicio(nuevoEjercicio).subscribe({
        next: (ejercicio) => {
          console.log('Ejercicio creado:', ejercicio);
          this.mostrarFormulario = false;
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error creando ejercicio:', error);
          this.error = 'Error al crear el ejercicio';
        }
      });
    }
  }

  eliminarEjercicio(ejercicio: Ejercicio) {
    if (confirm(`¿Estás seguro de eliminar el ejercicio?`)) {
      this.apiService.deleteEjercicio(ejercicio.id).subscribe({
        next: () => {
          console.log('Ejercicio eliminado:', ejercicio.id);
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error eliminando ejercicio:', error);
          this.error = 'Error al eliminar el ejercicio';
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.mostrarDetalles = false;
    this.ejercicioEditando = null;
    this.ejercicioViendo = null;
    this.limpiarFormulario();
    this.error = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  volverASubtemas() {
    if (this.tema?.id) {
      this.router.navigate(['/admin/tema', this.tema.id, 'subtemas']);
    } else {
      this.router.navigate(['/admin/temas']);
    }
  }

  getDificultadBadge(dificultad: string): string {
    switch (dificultad) {
      case 'baja': return '🟢 Baja';
      case 'media': return '🟡 Media';
      case 'alta': return '🔴 Alta';
      default: return '⚪ ' + dificultad;
    }
  }

  getTipoBadge(tipo: string): string {
    switch (tipo) {
      case 'opcion_multiple': return '🔘 Opción Múltiple';
      case 'teorico': return '📝 Teórico';
      case 'codigo': return '💻 Código';
      default: return '📄 ' + tipo;
    }
  }

  getBadgeClass(dificultad: string): string {
    switch (dificultad) {
      case 'baja': return 'badge success';
      case 'media': return 'badge warning';
      case 'alta': return 'badge danger';
      default: return 'badge info';
    }
  }

  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'opcion_multiple': return 'badge info';
      case 'teorico': return 'badge primary';
      case 'codigo': return 'badge secondary';
      default: return 'badge info';
    }
  }

  // Para mostrar/ocultar el campo de solución ejemplo
  get mostrarSolucionEjemplo(): boolean {
    return this.formTipo === 'codigo';
  }

  onTipoChange() {
    // Si cambia el tipo y no es código, limpiar la solución ejemplo
    if (this.formTipo !== 'codigo') {
      this.formSolucionEjemplo = '';
    }
  }

  recortarTexto(texto: string, longitud: number = 80): string {
    if (!texto) return '';
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
  }
}