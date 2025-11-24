<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contenido extends Model
{
    use HasFactory;

    protected $table = 'contenido';

    protected $fillable = [
        'subtema_id',
        'titulo',
        'cuerpo',
        'tipo',
        'orden',
    ];

    protected $casts = [
        'tipo' => 'string',
    ];

    // Relación con subtema
    public function subtema()
    {
        return $this->belongsTo(Subtema::class);
    }
}