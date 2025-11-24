import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  // Auth interfaces
  LoginRequest, RegisterRequest, LoginResponse, User,
  // Entities interfaces
  Materia, Tema, Subtema, Contenido, Ejercicio, HistorialEjercicio
} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Auth endpoints
  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers: this.getHeaders() });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, { headers: this.getHeaders() });
  }

  // Materias CRUD
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias`, { headers: this.getHeaders() });
  }

  createMateria(materia: Partial<Materia>): Observable<Materia> {
    return this.http.post<Materia>(`${this.apiUrl}/materias`, materia, { headers: this.getHeaders() });
  }

  // Temas CRUD
  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.apiUrl}/temas`, { headers: this.getHeaders() });
  }

  getTemasByMateria(materiaId: number): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.apiUrl}/materias/${materiaId}/temas`, { headers: this.getHeaders() });
  }

  createTema(tema: Partial<Tema>): Observable<Tema> {
    return this.http.post<Tema>(`${this.apiUrl}/temas`, tema, { headers: this.getHeaders() });
  }

  // Subtemas CRUD
  getSubtemasByTema(temaId: number): Observable<Subtema[]> {
    return this.http.get<Subtema[]>(`${this.apiUrl}/temas/${temaId}/subtemas`, { headers: this.getHeaders() });
  }

  // Contenidos CRUD
  getContenidosBySubtema(subtemaId: number): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(`${this.apiUrl}/subtemas/${subtemaId}/contenidos`, { headers: this.getHeaders() });
  }

  // Ejercicios CRUD
  getEjerciciosBySubtema(subtemaId: number): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(`${this.apiUrl}/subtemas/${subtemaId}/ejercicios`, { headers: this.getHeaders() });
  }
  // Ejercicios CRUD - MÉTODOS FALTANTES
getEjercicios(): Observable<Ejercicio[]> {
  return this.http.get<Ejercicio[]>(`${this.apiUrl}/ejercicios`, { headers: this.getHeaders() });
}

getEjercicio(id: number): Observable<Ejercicio> {
  return this.http.get<Ejercicio>(`${this.apiUrl}/ejercicios/${id}`, { headers: this.getHeaders() });
}

createEjercicio(ejercicio: Partial<Ejercicio>): Observable<Ejercicio> {
  return this.http.post<Ejercicio>(`${this.apiUrl}/ejercicios`, ejercicio, { headers: this.getHeaders() });
}

updateEjercicio(id: number, ejercicio: Partial<Ejercicio>): Observable<Ejercicio> {
  return this.http.put<Ejercicio>(`${this.apiUrl}/ejercicios/${id}`, ejercicio, { headers: this.getHeaders() });
}

deleteEjercicio(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/ejercicios/${id}`, { headers: this.getHeaders() });
}
  // IA endpoints
  generarEjercicio(subtemaId: number, dificultad: string = 'media', tipo: string = 'practico'): Observable<any> {
    return this.http.post(`${this.apiUrl}/ia/generar-ejercicio`, {
      subtema_id: subtemaId,
      dificultad,
      tipo
    }, { headers: this.getHeaders() });
  }

  evaluarRespuesta(data: {
    subtema_id: number;
    ejercicio_id: number | null;
    pregunta: string;
    respuesta_usuario: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/ia/evaluar-respuesta`, data, { headers: this.getHeaders() });
  }
  // Users CRUD
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  getUsuario(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  actualizarUsuario(id: number, usuario: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, usuario, { headers: this.getHeaders() });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }
  // En ApiService, agrega:
  actualizarMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}`, materia, { headers: this.getHeaders() });
  }

  eliminarMateria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/materias/${id}`, { headers: this.getHeaders() });
  }
  actualizarTema(id: number, tema: Partial<Tema>): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/temas/${id}`, tema, { headers: this.getHeaders() });
  }

  eliminarTema(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/temas/${id}`, { headers: this.getHeaders() });
  }
  // En ApiService, agrega:
  createSubtema(subtema: Partial<Subtema>): Observable<Subtema> {
    return this.http.post<Subtema>(`${this.apiUrl}/subtemas`, subtema, { headers: this.getHeaders() });
  }

  actualizarSubtema(id: number, subtema: Partial<Subtema>): Observable<Subtema> {
    return this.http.put<Subtema>(`${this.apiUrl}/subtemas/${id}`, subtema, { headers: this.getHeaders() });
  }

  eliminarSubtema(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subtemas/${id}`, { headers: this.getHeaders() });
  }

}