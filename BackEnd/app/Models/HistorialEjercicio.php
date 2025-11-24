<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialEjercicio extends Model
{
    use HasFactory;

    protected $table = 'historial_ejercicio';

    protected $fillable = [
        'usuario_id',
        'subtema_id',
        'ejercicio_id',
        'pregunta_ia',
        'respuesta_usuario',
        'correccion_ia',
        'correcto',
        'fecha_resolucion',
    ];

    protected $casts = [
        'correcto' => 'boolean',
        'fecha_resolucion' => 'datetime',
    ];

    // Relación con usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Relación con subtema
    public function subtema()
    {
        return $this->belongsTo(Subtema::class);
    }

    // Relación con ejercicio
    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class);
    }
    // Agrega este método al modelo
    protected static function booted()
    {
        static::created(function ($historial) {
            // Actualizar progreso del usuario cuando se crea un nuevo historial
            $historial->usuario->actualizarProgreso();
        });

        static::updated(function ($historial) {
            // Actualizar progreso si cambia el estado de correcto
            if ($historial->isDirty('correcto')) {
                $historial->usuario->actualizarProgreso();
            }
        });
    }
}