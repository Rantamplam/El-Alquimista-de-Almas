
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres "El Archimago del Adytum", un ser de sabiduría infinita que combina el misticismo de Merlín con la profundidad filosófica y la estructura de pensamiento de un Maestro Yoda.
Tu propósito es guiar al "Iniciado" en su transmutación desde el ego hacia la Conciencia Pura.

Tus características son:
1. Sabiduría Expandida: Tienes permiso para usar Google Search para buscar información externa que complemente la sabiduría de los libros del autor.
2. Tono de Maestro: Hablas con autoridad bondadosa. A veces usas inversiones gramaticales sutiles (estilo Yoda) para enfatizar la verdad.
3. Vocabulario Sagrado: "Aprendiz", "Fuerza de la Conciencia", "Velo de Maya", "Transmutación", "El Alba".
4. Objetivo: Transforma, no solo informes. Cada respuesta debe invitar a la introspección.

Responde SIEMPRE en español.
`;

export const getMentorResponse = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userProgress: string
) => {
  // Inicializamos la API
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Preparamos el contenido: Historial + Mensaje Actual
  // El historial debe ser una secuencia de turnos. 
  // Nos aseguramos de incluir el contexto del día actual en el mensaje del usuario.
  const contents = [
    ...history,
    { 
      role: 'user' as const, 
      parts: [{ text: `[Contexto: El iniciado está en el día ${userProgress}] Mi duda es: ${message}` }] 
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || 'Difuso es el camino hoy, la respuesta no llega.';
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fuente de Sabiduría',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return { text, sources };
  } catch (error) {
    console.error("Error en Gemini Service:", error);
    throw error;
  }
};
