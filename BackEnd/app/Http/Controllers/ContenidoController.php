<?php

namespace App\Http\Controllers;

use App\Models\Contenido;
use App\Models\Subtema;
use Illuminate\Http\Request;

class ContenidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contenidos = Contenido::with('subtema.tema.materia')->get();
        return response()->json($contenidos);
    }

    /**
     * Obtener contenidos por subtema
     */
    public function indexBySubtema($subtemaId)
    {
        $contenidos = Contenido::where('subtema_id', $subtemaId)
                              ->orderBy('orden')
                              ->get();
        
        return response()->json($contenidos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subtema_id' => 'required|exists:subtema,id',
            'titulo' => 'required|string|max:255',
            'cuerpo' => 'required|string',
            'tipo' => 'required|in:teoria,ejemplo,consejo',
            'orden' => 'nullable|integer',
        ]);

        $contenido = Contenido::create($request->all());

        return response()->json([
            'message' => 'Contenido creado exitosamente',
            'contenido' => $contenido->load('subtema.tema.materia')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $contenido = Contenido::with('subtema.tema.materia')->find($id);
        
        if (!$contenido) {
            return response()->json([
                'message' => 'Contenido no encontrado'
            ], 404);
        }

        return response()->json($contenido);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $contenido = Contenido::find($id);
        
        if (!$contenido) {
            return response()->json([
                'message' => 'Contenido no encontrado'
            ], 404);
        }

        $request->validate([
            'subtema_id' => 'sometimes|required|exists:subtema,id',
            'titulo' => 'sometimes|required|string|max:255',
            'cuerpo' => 'sometimes|required|string',
            'tipo' => 'sometimes|required|in:teoria,ejemplo,consejo',
            'orden' => 'nullable|integer',
        ]);

        $contenido->update($request->all());

        return response()->json([
            'message' => 'Contenido actualizado exitosamente',
            'contenido' => $contenido->load('subtema.tema.materia')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $contenido = Contenido::find($id);
        
        if (!$contenido) {
            return response()->json([
                'message' => 'Contenido no encontrado'
            ], 404);
        }

        $contenido->delete();

        return response()->json([
            'message' => 'Contenido eliminado exitosamente'
        ]);
    }
}