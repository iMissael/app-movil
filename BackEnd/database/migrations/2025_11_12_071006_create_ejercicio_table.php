<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subtema_id')->constrained('subtema')->onDelete('cascade');
            $table->longText('enunciado');
            $table->enum('dificultad', ['baja', 'media', 'alta'])->default('media');
            $table->enum('tipo', ['opcion_multiple', 'teorico', 'codigo'])->default('teorico');
            $table->longText('solucion_ejemplo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicio');
    }
};