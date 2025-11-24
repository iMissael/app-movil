import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejercicios.html',
  styleUrl: './ejercicios.css'
})
export class EjerciciosComponent implements OnInit {
  subtemaId: number = 0;
  ejercicioGenerado: string = '';
  respuestaUsuario: string = '';
  evaluacion: any = null;
  cargando: boolean = false;
  evaluando: boolean = false;
  historial: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.subtemaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarHistorial();
  }

  generarEjercicio() {
    this.cargando = true;
    this.ejercicioGenerado = '';
    this.evaluacion = null;
    
    this.apiService.generarEjercicio(this.subtemaId).subscribe({
      next: (response) => {
        this.ejercicioGenerado = response.ejercicio;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error generando ejercicio:', error);
        // Ejemplo de ejercicio para desarrollo
        this.ejercicioGenerado = `**Ejercicio de Práctica:**\n\nEscribe un programa en Python que:\n1. Pida al usuario su nombre\n2. Pida al usuario su edad\n3. Muestre un mensaje personalizado que diga "Hola [nombre], tienes [edad] años."\n\n**Requisitos:**\n- Usar input() para recibir datos\n- Usar print() para mostrar el resultado\n- Convertir la edad a número entero`;
        this.cargando = false;
      }
    });
  }

  evaluarRespuesta() {
    if (!this.ejercicioGenerado || !this.respuestaUsuario.trim()) {
      alert('Por favor, genera un ejercicio y escribe tu respuesta primero.');
      return;
    }

    this.evaluando = true;
    this.apiService.evaluarRespuesta({
      subtema_id: this.subtemaId,
      ejercicio_id: null,
      pregunta: this.ejercicioGenerado,
      respuesta_usuario: this.respuestaUsuario
    }).subscribe({
      next: (response) => {
        this.evaluacion = response.evaluacion;
        this.evaluando = false;
        this.cargarHistorial(); // Recargar historial después de evaluar
      },
      error: (error) => {
        console.error('Error evaluando respuesta:', error);
        // Evaluación de ejemplo para desarrollo
        this.evaluacion = {
          correcto: true,
          explicacion: 'Tu respuesta es correcta. Has utilizado adecuadamente las funciones input() y print(), y convertiste la edad a entero.',
          sugerencias: 'Puedes mejorar agregando validación de datos, por ejemplo, verificar que la edad sea un número válido.'
        };
        this.evaluando = false;
        this.cargarHistorial();
      }
    });
  }

  cargarHistorial() {
    // Simular historial de ejercicios
    this.historial = [
      {
        id: 1,
        pregunta: 'Ejercicio sobre variables en Python',
        correcto: true,
        fecha: new Date().toISOString()
      },
      {
        id: 2,
        pregunta: 'Ejercicio sobre condicionales',
        correcto: false,
        fecha: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  limpiarEjercicio() {
    this.ejercicioGenerado = '';
    this.respuestaUsuario = '';
    this.evaluacion = null;
  }
}