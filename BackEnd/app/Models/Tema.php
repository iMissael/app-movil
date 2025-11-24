<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    use HasFactory;

    protected $table = 'tema';

    protected $fillable = [
        'materia_id',
        'titulo',
        'descripcion',
        'orden',
    ];

    // Relación con materia
    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }

    // Relación con subtemas
    public function subtemas()
    {
        return $this->hasMany(Subtema::class);
    }
}