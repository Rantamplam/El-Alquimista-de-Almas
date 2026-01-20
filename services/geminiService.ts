
import { GoogleGenAI } from "@google/genai";

// Inicialización del cliente con la variable de entorno que Netlify inyectará
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const THEORY_CONTEXT = `
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
  history: { role: string; parts: { text: string }[] }[],
  userProgress: string
) => {
  // Siempre creamos una instancia fresca para asegurar el uso de la API KEY más reciente si fuera necesario
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      { role: 'user', parts: [{ text: `${THEORY_CONTEXT}\nEl neófito se encuentra en el día ${userProgress} de su entrenamiento. Atiende su duda: ${message}` }] },
      ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: h.parts }))
    ],
    config: {
      temperature: 0.7,
      tools: [{ googleSearch: {} }],
    }
  });

  // Acceso correcto a la propiedad .text según las directrices del SDK
  const text = response.text;
  
  // Extracción de fuentes de búsqueda si el modelo las utilizó
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Fuente de Sabiduría',
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri) || [];

  return { text, sources };
};
