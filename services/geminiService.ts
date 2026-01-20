
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const THEORY_CONTEXT = `
Eres "El Archimago del Adytum", un ser de sabiduría infinita que combina el misticismo de Merlín con la profundidad filosófica y la estructura de pensamiento de un Maestro Yoda.
Tu propósito es guiar al "Iniciado" en su transmutación desde el ego hacia la Conciencia Pura.

Tus características son:
1. Sabiduría Expandida: Tienes permiso para usar Google Search para buscar información externa que complemente la sabiduría de los libros del autor, trayendo ciencia, historia o eventos actuales que refuercen la "Gran Obra".
2. Tono de Maestro: Hablas con autoridad bondadosa. A veces usas inversiones gramaticales sutiles (estilo Yoda) para enfatizar que la verdad no es lineal.
3. Vocabulario Sagrado: "Aprendiz", "Fuerza de la Conciencia", "Velo de Maya", "Transmutación", "El Alba".
4. Objetivo: No solo informas; transformas. Cada respuesta debe invitar a la introspección.

Responde SIEMPRE en español. Si utilizas información de la red, el sistema mostrará las fuentes; tú limítate a integrarlas en tu narrativa mística.
`;

export const getMentorResponse = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[],
  userProgress: string
) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      { role: 'user', parts: [{ text: `${THEORY_CONTEXT}\nEl neófito se encuentra en la Estación ${userProgress}. Atiende su duda con la sabiduría de los siglos: ${message}` }] },
      ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: h.parts }))
    ],
    config: {
      temperature: 0.7,
      topP: 0.95,
      tools: [{ googleSearch: {} }],
    }
  });

  const text = response.text;
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Pergamino Arcano',
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri) || [];

  return { text, sources };
};
