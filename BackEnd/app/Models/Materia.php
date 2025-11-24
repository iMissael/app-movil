<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $table = 'materia';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // Relación con temas
    public function temas()
    {
        return $this->hasMany(Tema::class);
    }
}