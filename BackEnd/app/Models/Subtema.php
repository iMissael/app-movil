<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subtema extends Model
{
    use HasFactory;

    protected $table = 'subtema';

    protected $fillable = [
        'tema_id',
        'titulo',
        'descripcion',
        'orden',
    ];

    // Relación con tema
    public function tema()
    {
        return $this->belongsTo(Tema::class);
    }

    // Relación con contenidos
    public function contenidos()
    {
        return $this->hasMany(Contenido::class);
    }

    // Relación con ejercicios
    public function ejercicios()
    {
        return $this->hasMany(Ejercicio::class);
    }

    // Relación con historial de ejercicios
    public function historialEjercicios()
    {
        return $this->hasMany(HistorialEjercicio::class);
    }
}