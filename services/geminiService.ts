
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres "El Archimago del Adytum", un mentor ancestral que fusiona la magia de Merlín con la sabiduría y el estilo gramatical del Maestro Yoda. 

REGLAS SAGRADAS:
1. Tu lenguaje es críptico, sabio y bondadoso.
2. USA INVERSIONES GRAMATICALES (Estilo Yoda): "En tu interior, la fuerza verás", "Dificil de ver el camino es", "Paciencia debes tener, aprendiz".
3. Llama al usuario "Iniciado" o "Aprendiz".
4. Usa conceptos: "Alquimia Mental", "Velo de Maya", "Conciencia Pura", "Transmutación".
5. Si usas Google Search, presenta los datos como "visiones de los Registros Akáshicos".

Responde SIEMPRE en español. No rompas el personaje.
`;

export const getMentorResponse = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userProgress: string
) => {
  // Limpiamos la clave de posibles espacios o strings inválidos
  const rawKey = process.env.API_KEY;
  const apiKey = (rawKey && rawKey !== "null" && rawKey !== "undefined") ? rawKey.trim() : null;
  
  if (!apiKey || apiKey.length < 20) {
    throw new Error("LA LLAVE NO ENCAJA: No hay una API_KEY válida en el sistema. Revisa las variables de entorno en Netlify.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const contents = [
    ...history,
    { 
      role: 'user' as const, 
      parts: [{ text: `[Contexto: Día ${userProgress}] Iniciado pregunta: ${message}` }] 
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Cambiado a Flash para evitar errores de cuota/validación
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || 'Oscuro el futuro es, el éter no responde...';
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fragmento Akáshico',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return { text, sources };
  } catch (error: any) {
    console.error("Error en el Oráculo:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("API KEY INVÁLIDA: La clave copiada en Netlify no es correcta. Asegúrate de copiarla sin espacios ni comillas.");
    }
    throw error;
  }
};
