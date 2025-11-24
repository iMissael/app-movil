<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tema', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materia')->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tema');
    }
};