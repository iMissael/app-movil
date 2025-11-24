<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\TemaController;
use App\Http\Controllers\SubtemaController;
use App\Http\Controllers\ContenidoController;
use App\Http\Controllers\EjercicioController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ✅ RUTAS PÚBLICAS (sin autenticación)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ RUTAS PROTEGIDAS (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // CRUD de Materias - SOLO ADMIN
    Route::apiResource('materias', MateriaController::class)->middleware('role:admin');

    // CRUD de Temas - SOLO ADMIN
    Route::apiResource('temas', TemaController::class)->middleware('role:admin');
    Route::get('/materias/{materia}/temas', [TemaController::class, 'indexByMateria'])->middleware('role:admin');

    // CRUD de Subtemas - SOLO ADMIN
    Route::apiResource('subtemas', SubtemaController::class)->middleware('role:admin');
    Route::get('/temas/{tema}/subtemas', [SubtemaController::class, 'indexByTema'])->middleware('role:admin');

    // CRUD de Contenidos - SOLO ADMIN
    Route::apiResource('contenidos', ContenidoController::class)->middleware('role:admin');
    Route::get('/subtemas/{subtema}/contenidos', [ContenidoController::class, 'indexBySubtema'])->middleware('role:admin');

    // CRUD de Ejercicios - SOLO ADMIN
    Route::apiResource('ejercicios', EjercicioController::class)->middleware('role:admin');
    Route::get('/subtemas/{subtema}/ejercicios', [EjercicioController::class, 'indexBySubtema'])->middleware('role:admin');

    // Rutas para IA (accesibles para estudiantes y admin)
    Route::post('/ia/generar-ejercicio', [AIController::class, 'generarEjercicio']);
    Route::post('/ia/evaluar-respuesta', [AIController::class, 'evaluarRespuesta']);

    Route::apiResource('users', UserController::class)->middleware('role:admin');

});

// ✅ Ruta de prueba
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});