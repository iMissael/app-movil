<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $materias = Materia::with('temas.subtemas')->get();
        return response()->json($materias);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:materia',
            'descripcion' => 'nullable|string',
        ]);

        $materia = Materia::create($request->all());

        return response()->json([
            'message' => 'Materia creada exitosamente',
            'materia' => $materia
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $materia = Materia::with('temas.subtemas')->find($id);
        
        if (!$materia) {
            return response()->json([
                'message' => 'Materia no encontrada'
            ], 404);
        }

        return response()->json($materia);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $materia = Materia::find($id);
        
        if (!$materia) {
            return response()->json([
                'message' => 'Materia no encontrada'
            ], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|required|string|max:255|unique:materia,nombre,' . $id,
            'descripcion' => 'nullable|string',
        ]);

        $materia->update($request->all());

        return response()->json([
            'message' => 'Materia actualizada exitosamente',
            'materia' => $materia
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $materia = Materia::find($id);
        
        if (!$materia) {
            return response()->json([
                'message' => 'Materia no encontrada'
            ], 404);
        }

        $materia->delete();

        return response()->json([
            'message' => 'Materia eliminada exitosamente'
        ]);
    }
}