<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    use HasFactory;

    protected $table = 'ejercicio';

    protected $fillable = [
        'subtema_id',
        'enunciado',
        'dificultad',
        'tipo',
        'solucion_ejemplo',
    ];

    protected $casts = [
        'dificultad' => 'string',
        'tipo' => 'string',
    ];

    // Relación con subtema
    public function subtema()
    {
        return $this->belongsTo(Subtema::class);
    }

    // Relación con historial de ejercicios
    public function historialEjercicios()
    {
        return $this->hasMany(HistorialEjercicio::class);
    }
}