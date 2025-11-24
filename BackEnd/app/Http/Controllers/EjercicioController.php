<?php

namespace App\Http\Controllers;

use App\Models\Ejercicio;
use App\Models\Subtema;
use Illuminate\Http\Request;

class EjercicioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ejercicios = Ejercicio::with('subtema.tema.materia')->get();
        return response()->json($ejercicios);
    }

    /**
     * Obtener ejercicios por subtema
     */
    public function indexBySubtema($subtemaId)
    {
        $ejercicios = Ejercicio::with('subtema.tema.materia')
                              ->where('subtema_id', $subtemaId)
                              ->get();
        
        return response()->json($ejercicios);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subtema_id' => 'required|exists:subtema,id',
            'enunciado' => 'required|string',
            'dificultad' => 'required|in:baja,media,alta',
            'tipo' => 'required|in:practico,teorico,codigo',
            'solucion_ejemplo' => 'nullable|string',
        ]);

        $ejercicio = Ejercicio::create($request->all());

        return response()->json([
            'message' => 'Ejercicio creado exitosamente',
            'ejercicio' => $ejercicio->load('subtema.tema.materia')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ejercicio = Ejercicio::with('subtema.tema.materia')->find($id);
        
        if (!$ejercicio) {
            return response()->json([
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        return response()->json($ejercicio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $ejercicio = Ejercicio::find($id);
        
        if (!$ejercicio) {
            return response()->json([
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        $request->validate([
            'subtema_id' => 'sometimes|required|exists:subtema,id',
            'enunciado' => 'sometimes|required|string',
            'dificultad' => 'sometimes|required|in:baja,media,alta',
            'tipo' => 'sometimes|required|in:practico,teorico,codigo',
            'solucion_ejemplo' => 'nullable|string',
        ]);

        $ejercicio->update($request->all());

        return response()->json([
            'message' => 'Ejercicio actualizado exitosamente',
            'ejercicio' => $ejercicio->load('subtema.tema.materia')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $ejercicio = Ejercicio::find($id);
        
        if (!$ejercicio) {
            return response()->json([
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        $ejercicio->delete();

        return response()->json([
            'message' => 'Ejercicio eliminado exitosamente'
        ]);
    }
}