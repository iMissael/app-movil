export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'student';
  ultima_conexion?: string;  // Solo para estudiantes
  progreso?: number;         // Solo para estudiantes
  ejercicios_completados?: number; // Solo para estudiantes
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  password_confirmation: string;
  rol?: 'admin' | 'student';
}

// Interfaz específica para estudiantes
export interface StudentUser extends User {
  ultima_conexion: string;
  progreso: number;
  ejercicios_completados: number;
}

// Interfaz específica para administradores
export interface AdminUser extends User {
  // Los administradores no tienen los campos extra
}

// ========== MATERIAS INTERFACES ==========
export interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
  temas?: Tema[];
  progreso?: number;
  temas_count?: number;
}

export interface Tema {
  id: number;
  materia_id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  created_at: string;
  updated_at: string;
  materia?: Materia;
  subtemas?: Subtema[];
  subtemas_count?: number;
  completado?: boolean;
}

export interface Subtema {
  id: number;
  tema_id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  created_at: string;
  updated_at: string;
  tema?: Tema;
  contenidos?: Contenido[];
  ejercicios?: Ejercicio[];
  contenidos_count?: number; 
  ejercicios_count?: number; 
}

export interface Contenido {
  id: number;
  subtema_id: number;
  titulo: string;
  cuerpo: string;
  tipo: 'teoria' | 'ejemplo' | 'consejo';
  orden: number;
  created_at: string;
  updated_at: string;
  subtema?: Subtema;
}

export interface Ejercicio {
  id: number;
  subtema_id: number;
  enunciado: string;
  dificultad: 'baja' | 'media' | 'alta';
  tipo: 'opcion_multiple' | 'teorico' | 'codigo';
  solucion_ejemplo?: string | null;
  created_at: string;
  updated_at: string;
  subtema?: Subtema;
}

export interface HistorialEjercicio {
  id: number;
  usuario_id: number;
  subtema_id: number;
  ejercicio_id: number;
  pregunta_ia: string;
  respuesta_usuario: string;
  correccion_ia: string;
  correcto: boolean;
  fecha_resolucion: string;
  created_at: string;
  updated_at: string;
  usuario?: User;
  subtema?: Subtema;
  ejercicio?: Ejercicio;
}