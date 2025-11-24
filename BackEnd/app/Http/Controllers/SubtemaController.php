<?php

namespace App\Http\Controllers;

use App\Models\Subtema;
use App\Models\Tema;
use Illuminate\Http\Request;

class SubtemaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subtemas = Subtema::with('tema.materia', 'contenidos', 'ejercicios')->get();
        return response()->json($subtemas);
    }

    /**
     * Obtener subtemas por tema
     */
    public function indexByTema($temaId)
    {
        $subtemas = Subtema::with('contenidos', 'ejercicios')
                          ->where('tema_id', $temaId)
                          ->orderBy('orden')
                          ->get();
        
        return response()->json($subtemas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tema_id' => 'required|exists:tema,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
        ]);

        $subtema = Subtema::create($request->all());

        return response()->json([
            'message' => 'Subtema creado exitosamente',
            'subtema' => $subtema->load('tema.materia')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $subtema = Subtema::with('tema.materia', 'contenidos', 'ejercicios')->find($id);
        
        if (!$subtema) {
            return response()->json([
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        return response()->json($subtema);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $subtema = Subtema::find($id);
        
        if (!$subtema) {
            return response()->json([
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        $request->validate([
            'tema_id' => 'sometimes|required|exists:tema,id',
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
        ]);

        $subtema->update($request->all());

        return response()->json([
            'message' => 'Subtema actualizado exitosamente',
            'subtema' => $subtema->load('tema.materia')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subtema = Subtema::find($id);
        
        if (!$subtema) {
            return response()->json([
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        $subtema->delete();

        return response()->json([
            'message' => 'Subtema eliminado exitosamente'
        ]);
    }
}