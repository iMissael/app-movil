<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contenido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subtema_id')->constrained('subtema')->onDelete('cascade');
            $table->string('titulo');
            $table->longText('cuerpo');
            $table->enum('tipo', ['teoria', 'ejemplo', 'consejo'])->default('teoria');
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenido');
    }
};