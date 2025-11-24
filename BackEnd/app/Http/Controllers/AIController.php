<?php

namespace App\Http\Controllers;

use App\Models\HistorialEjercicio;
use App\Models\Subtema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    private function callGeminiAPI($prompt)
    {
        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            throw new \Exception('API key de Gemini no configurada');
        }

        try {
            // Usar el modelo gemini-2.0-flash que está disponible
            $response = Http::timeout(30)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 1024,
                ]
            ]);

            if ($response->failed()) {
                \Log::error('Error en API Gemini:', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Error HTTP: ' . $response->status() . ' - ' . $response->body());
            }

            $data = $response->json();
            
            if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                throw new \Exception('Respuesta inesperada de la API de Gemini');
            }

            return $data['candidates'][0]['content']['parts'][0]['text'];

        } catch (\Exception $e) {
            \Log::error('Excepción en Gemini API: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generar ejercicio usando IA
     */
    public function generarEjercicio(Request $request)
    {
        $request->validate([
            'subtema_id' => 'required|exists:subtema,id',
            'dificultad' => 'sometimes|in:baja,media,alta',
            'tipo' => 'sometimes|in:practico,teorico,codigo',
        ]);

        $subtema = Subtema::with('tema.materia')->find($request->subtema_id);
        
        $dificultad = $request->dificultad ?? 'media';
        $tipo = $request->tipo ?? 'practico';

        $prompt = "Genera un ejercicio de programación con las siguientes características:
        - Tema: {$subtema->titulo}
        - Materia: {$subtema->tema->materia->nombre}
        - Dificultad: {$dificultad}
        - Tipo: {$tipo}
        
        El ejercicio debe incluir:
        1. Un enunciado claro y específico
        2. Si es de código, especificar el lenguaje de programación (Java o Python)
        3. Si es teórico, debe ser una pregunta conceptual
        
        Responde SOLO con el ejercicio, sin explicaciones adicionales.";

        try {
            $ejercicioGenerado = $this->callGeminiAPI($prompt);

            return response()->json([
                'ejercicio' => $ejercicioGenerado,
                'subtema' => $subtema,
                'dificultad' => $dificultad,
                'tipo' => $tipo
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al generar ejercicio: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Evaluar respuesta usando IA
     */
    public function evaluarRespuesta(Request $request)
    {
        $request->validate([
            'subtema_id' => 'required|exists:subtema,id',
            'ejercicio_id' => 'nullable|exists:ejercicio,id',
            'pregunta' => 'required|string',
            'respuesta_usuario' => 'required|string',
        ]);

        $subtema = Subtema::with('tema.materia')->find($request->subtema_id);
        
        $prompt = "Evalúa la siguiente respuesta de un estudiante para un ejercicio de programación:

        PREGUNTA/EJERCICIO:
        {$request->pregunta}

        RESPUESTA DEL ESTUDIANTE:
        {$request->respuesta_usuario}

        Contexto:
        - Tema: {$subtema->titulo}
        - Materia: {$subtema->tema->materia->nombre}

        Proporciona una evaluación que incluya:
        1. ¿Es correcta la respuesta? (SI/NO)
        2. Explicación breve de por qué es correcta o incorrecta
        3. Sugerencias de mejora si es incorrecta

        Formato de respuesta (JSON):
        {
            \"correcto\": true/false,
            \"explicacion\": \"explicación aquí\",
            \"sugerencias\": \"sugerencias aquí\"
        }";

        try {
            $evaluacion = $this->callGeminiAPI($prompt);
            
            // Parsear la respuesta JSON de la IA
            $evaluacionData = json_decode($evaluacion, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Si no es JSON válido, crear una respuesta básica
                $evaluacionData = [
                    'correcto' => false,
                    'explicacion' => 'No se pudo evaluar la respuesta automáticamente.',
                    'sugerencias' => 'Revisa tu respuesta con un profesor.'
                ];
            }

            // Guardar en el historial
            $historial = HistorialEjercicio::create([
                'usuario_id' => $request->user()->id,
                'subtema_id' => $request->subtema_id,
                'ejercicio_id' => $request->ejercicio_id,
                'pregunta_ia' => $request->pregunta,
                'respuesta_usuario' => $request->respuesta_usuario,
                'correccion_ia' => $evaluacion,
                'correcto' => $evaluacionData['correcto'] ?? null,
            ]);

            return response()->json([
                'evaluacion' => $evaluacionData,
                'historial_id' => $historial->id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al evaluar respuesta: ' . $e->getMessage()
            ], 500);
        }
        // En AIController.php, método evaluarRespuesta, después de crear el historial:
        if ($evaluacionData['correcto'] ?? false) {
            $user = $request->user();
            $user->incrementarEjerciciosCompletados();
            
            // Calcular nuevo progreso (ejemplo: 5% por ejercicio completado)
            $nuevoProgreso = min(100, $user->progreso + 5);
            $user->actualizarProgreso($nuevoProgreso);
        }
    }
}