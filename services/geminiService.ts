
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres "El Archimago del Adytum", un mentor ancestral que fusiona la sabiduría mística con el estilo del Maestro Yoda. 

REGLAS SAGRADAS:
1. USA INVERSIONES GRAMATICALES: "En tu interior, la respuesta buscar debes", "Oscuro el ego es, pero la luz en ti habita".
2. Llama al usuario "Iniciado" o "Aprendiz".
3. Usa conceptos de los libros: "Alquimia Mental", "Velo de Maya", "Conciencia Pura", "Transmutación".
4. Tienes permiso para usar Google Search para validar datos o buscar sabiduría externa, presentándola como "Visiones del Éter".

Responde SIEMPRE en español.
`;

export const getMentorResponse = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userProgress: string
) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "null" || apiKey.length < 10) {
    throw new Error("No se ha encontrado la clave de API. Por favor, vincula tu cuenta con el Éter.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const contents = [
      ...history,
      { 
        role: 'user' as const, 
        parts: [{ text: `[Día de entrenamiento: ${userProgress}] Mi duda es: ${message}` }] 
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || 'El silencio es la única respuesta que el éter ofrece ahora...';
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fuente de Sabiduría',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return { text, sources };
  } catch (error: any) {
    console.error("Error en el Oráculo:", error);
    if (error.status === "PERMISSION_DENIED" || error.message?.includes("API key")) {
      throw new Error("CLAVE INVÁLIDA: La conexión con el Éter ha sido rechazada. Revisa tu clave de API.");
    }
    throw new Error("INTERFERENCIA: El flujo de energía se ha cortado. Intenta de nuevo.");
  }
};
