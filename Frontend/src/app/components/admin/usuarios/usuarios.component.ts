import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User, RegisterRequest } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuarioEditando: User | null = null;
  usuarioViendo: User | null = null;
  mostrarFormulario: boolean = false;
  mostrarDetalles: boolean = false;
  cargando: boolean = true;
  modoEdicion: boolean = false;
  error: string = '';

  // Propiedades separadas para el formulario
  formNombre: string = '';
  formEmail: string = '';
  formPassword: string = '';
  formPasswordConfirmation: string = '';
  formRol: 'admin' | 'student' = 'student';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.error = '';
    
    this.apiService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.error = 'Error al cargar los usuarios';
        this.cargando = false;
        // Mientras no tengamos el endpoint, usar datos de ejemplo
        this.usarDatosEjemplo();
      }
    });
  }

  // Método temporal mientras implementamos el backend
  private usarDatosEjemplo() {
    this.usuarios = [
      {
        id: 1,
        nombre: 'Ana García',
        email: 'ana@ito.edu.mx',
        rol: 'student',
        ultima_conexion: '2025-01-18T10:30:00.000Z',
        progreso: 75,
        ejercicios_completados: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        nombre: 'Carlos López',
        email: 'carlos@ito.edu.mx',
        rol: 'student',
        ultima_conexion: '2025-01-17T15:45:00.000Z',
        progreso: 40,
        ejercicios_completados: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        nombre: 'Admin Sistema',
        email: 'admin@ito.edu.mx',
        rol: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  crearUsuario() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.usuarioEditando = null;
    this.limpiarFormulario();
  }

  editarUsuario(usuario: User) {
    this.usuarioEditando = { ...usuario };
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.cargarDatosFormulario(usuario);
  }

  cargarDatosFormulario(usuario: User) {
    this.formNombre = usuario.nombre;
    this.formEmail = usuario.email;
    this.formRol = usuario.rol;
    this.formPassword = '';
    this.formPasswordConfirmation = '';
  }

  limpiarFormulario() {
    this.formNombre = '';
    this.formEmail = '';
    this.formPassword = '';
    this.formPasswordConfirmation = '';
    this.formRol = 'student';
  }

  verDetalles(usuario: User) {
    this.usuarioViendo = usuario;
    this.mostrarDetalles = true;
  }

  guardarUsuario() {
    this.error = '';
    
    if (this.modoEdicion && this.usuarioEditando) {
      // Editar usuario existente
      const usuarioActualizado = {
        nombre: this.formNombre,
        email: this.formEmail,
        rol: this.formRol
      };
      
      this.apiService.actualizarUsuario(this.usuarioEditando.id, usuarioActualizado).subscribe({
        next: (usuario) => {
          console.log('Usuario actualizado:', usuario);
          this.mostrarFormulario = false;
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error actualizando usuario:', error);
          this.error = 'Error al actualizar el usuario';
        }
      });
    } else {
      // Crear nuevo usuario
      const nuevoUsuario: RegisterRequest = {
        nombre: this.formNombre,
        email: this.formEmail,
        password: this.formPassword,
        password_confirmation: this.formPasswordConfirmation,
        rol: this.formRol
      };
      
      this.apiService.register(nuevoUsuario).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response.user);
          this.mostrarFormulario = false;
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error creando usuario:', error);
          this.error = 'Error al crear el usuario';
        }
      });
    }
  }

  eliminarUsuario(usuario: User) {
    if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
      this.apiService.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          console.log('Usuario eliminado:', usuario.id);
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          this.error = 'Error al eliminar el usuario';
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.mostrarDetalles = false;
    this.usuarioEditando = null;
    this.usuarioViendo = null;
    this.limpiarFormulario();
    this.error = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-MX');
  }
}