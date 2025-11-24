<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'ultima_conexion',
        'progreso',
        'ejercicios_completados',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'ultima_conexion' => 'datetime',
        ];
    }

    // Relación con el historial de ejercicios
    public function historialEjercicios()
    {
        return $this->hasMany(HistorialEjercicio::class, 'usuario_id');
    }

    // Scope para estudiantes
    public function scopeEstudiantes($query)
    {
        return $query->where('rol', 'student');
    }

    // Scope para administradores
    public function scopeAdministradores($query)
    {
        return $query->where('rol', 'admin');
    }

    // Método para actualizar última conexión
    public function actualizarUltimaConexion()
    {
        $this->update(['ultima_conexion' => now()]);
    }

    // Método para actualizar progreso (solo estudiantes)
    public function actualizarProgreso($nuevoProgreso)
    {
        if ($this->rol === 'student') {
            $this->update(['progreso' => $nuevoProgreso]);
        }
    }

    // Método para incrementar ejercicios completados (solo estudiantes)
    public function incrementarEjerciciosCompletados()
    {
        if ($this->rol === 'student') {
            $this->increment('ejercicios_completados');
        }
    }
}