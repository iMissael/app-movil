<?php

namespace App\Http\Controllers;

use App\Models\Tema;
use App\Models\Materia;
use Illuminate\Http\Request;

class TemaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $temas = Tema::with('materia', 'subtemas')->get();
        return response()->json($temas);
    }

    /**
     * Obtener temas por materia
     */
    public function indexByMateria($materiaId)
    {
        $temas = Tema::with('subtemas')
                    ->where('materia_id', $materiaId)
                    ->orderBy('orden')
                    ->get();
        
        return response()->json($temas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'materia_id' => 'required|exists:materia,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
        ]);

        $tema = Tema::create($request->all());

        return response()->json([
            'message' => 'Tema creado exitosamente',
            'tema' => $tema->load('materia')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tema = Tema::with('materia', 'subtemas.contenidos', 'subtemas.ejercicios')->find($id);
        
        if (!$tema) {
            return response()->json([
                'message' => 'Tema no encontrado'
            ], 404);
        }

        return response()->json($tema);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tema = Tema::find($id);
        
        if (!$tema) {
            return response()->json([
                'message' => 'Tema no encontrado'
            ], 404);
        }

        $request->validate([
            'materia_id' => 'sometimes|required|exists:materia,id',
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
        ]);

        $tema->update($request->all());

        return response()->json([
            'message' => 'Tema actualizado exitosamente',
            'tema' => $tema->load('materia')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tema = Tema::find($id);
        
        if (!$tema) {
            return response()->json([
                'message' => 'Tema no encontrado'
            ], 404);
        }

        $tema->delete();

        return response()->json([
            'message' => 'Tema eliminado exitosamente'
        ]);
    }
}