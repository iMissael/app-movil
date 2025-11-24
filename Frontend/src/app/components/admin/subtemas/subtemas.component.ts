import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Subtema, Tema, Materia } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-subtemas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './subtemas.html',
  styleUrl: './subtemas.css'
})
export class SubtemasComponent implements OnInit {
  subtemas: Subtema[] = [];
  subtemaEditando: Subtema | null = null;
  subtemaViendo: Subtema | null = null;
  tema: Tema | null = null;
  materia: Materia | null = null;
  mostrarFormulario: boolean = false;
  mostrarDetalles: boolean = false;
  cargando: boolean = true;
  modoEdicion: boolean = false;
  error: string = '';
  temaId: number = 0;

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
    this.temaId = Number(this.route.snapshot.paramMap.get('temaId'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.error = '';
    
    // Cargar tema y subtemas
    this.apiService.getSubtemasByTema(this.temaId).subscribe({
      next: (subtemas) => {
        this.subtemas = subtemas;
        if (subtemas.length > 0 && subtemas[0].tema) {
          this.tema = subtemas[0].tema;
          this.materia = subtemas[0].tema.materia || null; // Asegurar que sea null si es undefined
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando subtemas:', error);
        this.error = 'Error al cargar los subtemas';
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
      id: this.temaId,
      materia_id: 1,
      titulo: 'Variables y Tipos de Datos',
      descripcion: 'Manejo de variables y tipos de datos en Python',
      orden: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      materia: this.materia
    };

    this.subtemas = [
      {
        id: 1,
        tema_id: this.temaId,
        titulo: '¿Qué son las variables?',
        descripcion: 'Concepto y uso de variables en programación',
        orden: 1,
        contenidos_count: 2,
        ejercicios_count: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        contenidos: [
          {
            id: 1,
            titulo: 'Definición de variables',
            cuerpo: 'Las variables son contenedores para almacenar datos...',
            tipo: 'teoria',
            orden: 1,
            subtema_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 2,
        tema_id: this.temaId,
        titulo: 'Tipos de Datos Básicos',
        descripcion: 'String, números, booleanos y otros tipos de datos',
        orden: 2,
        contenidos_count: 3,
        ejercicios_count: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        tema_id: this.temaId,
        titulo: 'Declaración y Asignación',
        descripcion: 'Cómo declarar y asignar valores a variables',
        orden: 3,
        contenidos_count: 2,
        ejercicios_count: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  crearSubtema() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.subtemaEditando = null;
    this.limpiarFormulario();
    this.formOrden = this.obtenerSiguienteOrden();
  }

  editarSubtema(subtema: Subtema) {
    this.subtemaEditando = { ...subtema };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.cargarDatosFormulario(subtema);
  }

  cargarDatosFormulario(subtema: Subtema) {
    this.formTitulo = subtema.titulo;
    this.formDescripcion = subtema.descripcion || '';
    this.formOrden = subtema.orden;
  }

  limpiarFormulario() {
    this.formTitulo = '';
    this.formDescripcion = '';
    this.formOrden = 1;
  }

  obtenerSiguienteOrden(): number {
    if (this.subtemas.length === 0) return 1;
    const maxOrden = Math.max(...this.subtemas.map(t => t.orden));
    return maxOrden + 1;
  }

  verDetalles(subtema: Subtema) {
    this.subtemaViendo = subtema;
    this.mostrarDetalles = true;
  }

  verContenidos(subtema: Subtema) {
    // Redirigir a la página de contenidos de este subtema
    this.router.navigate(['/admin/subtema', subtema.id, 'contenidos']);
  }

  verEjercicios(subtema: Subtema) {
    // Redirigir a la página de ejercicios de este subtema
    this.router.navigate(['/admin/subtema', subtema.id, 'ejercicios']);
  }

  guardarSubtema() {
    this.error = '';
    
    if (this.modoEdicion && this.subtemaEditando) {
      // Editar subtema existente
      const subtemaActualizado = {
        titulo: this.formTitulo,
        descripcion: this.formDescripcion,
        orden: this.formOrden
      };
      
      this.apiService.actualizarSubtema(this.subtemaEditando.id, subtemaActualizado).subscribe({
        next: (subtema) => {
          console.log('Subtema actualizado:', subtema);
          this.mostrarFormulario = false;
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error actualizando subtema:', error);
          this.error = 'Error al actualizar el subtema';
        }
      });
    } else {
      // Crear nuevo subtema
      const nuevoSubtema = {
        tema_id: this.temaId,
        titulo: this.formTitulo,
        descripcion: this.formDescripcion,
        orden: this.formOrden
      };
      
      this.apiService.createSubtema(nuevoSubtema).subscribe({
        next: (subtema) => {
          console.log('Subtema creado:', subtema);
          this.mostrarFormulario = false;
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error creando subtema:', error);
          this.error = 'Error al crear el subtema';
        }
      });
    }
  }

  eliminarSubtema(subtema: Subtema) {
    if (confirm(`¿Estás seguro de eliminar el subtema "${subtema.titulo}"?`)) {
      this.apiService.eliminarSubtema(subtema.id).subscribe({
        next: () => {
          console.log('Subtema eliminado:', subtema.id);
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error eliminando subtema:', error);
          this.error = 'Error al eliminar el subtema';
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.mostrarDetalles = false;
    this.subtemaEditando = null;
    this.subtemaViendo = null;
    this.limpiarFormulario();
    this.error = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  contarContenidos(subtema: Subtema): number {
    return subtema.contenidos?.length || subtema.contenidos_count || 0;
  }

  contarEjercicios(subtema: Subtema): number {
    return subtema.ejercicios?.length || subtema.ejercicios_count || 0;
  }

  volverATemas() {
    // Usar operador de encadenamiento opcional para evitar el error
    if (this.materia?.id) {
      this.router.navigate(['/admin/materia', this.materia.id, 'temas']);
    } else {
      this.router.navigate(['/admin/materias']);
    }
  }

  getTipoBadge(tipo: string): string {
    switch (tipo) {
      case 'teoria': return '📚 Teoría';
      case 'ejemplo': return '💡 Ejemplo';
      case 'consejo': return '💎 Consejo';
      default: return '📝 Contenido';
    }
  }
}