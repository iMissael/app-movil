<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_ejercicio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subtema_id')->constrained('subtema')->onDelete('cascade');
            $table->foreignId('ejercicio_id')->nullable()->constrained('ejercicio')->onDelete('set null');
            $table->longText('pregunta_ia');
            $table->longText('respuesta_usuario');
            $table->longText('correccion_ia')->nullable();
            $table->boolean('correcto')->nullable();
            $table->timestamp('fecha_resolucion')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_ejercicio');
    }
};