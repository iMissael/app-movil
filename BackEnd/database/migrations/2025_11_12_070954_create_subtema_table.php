<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subtema', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tema_id')->constrained('tema')->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subtema');
    }
};