
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
  // Limpieza profunda de la clave
  const rawKey = process.env.API_KEY;
  const apiKey = (rawKey && typeof rawKey === 'string' && rawKey.length > 10 && rawKey !== "null" && rawKey !== "undefined") 
    ? rawKey.trim().replace(/['"]/g, '') 
    : null;
  
  if (!apiKey) {
    throw new Error("LA LLAVE NO ENCAJA: No hemos encontrado tu API_KEY sagrada. Si Netlify está pausado, intenta migrar a Vercel o revisa las variables de entorno.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const contents = [
      ...history,
      { 
        role: 'user' as const, 
        parts: [{ text: `[Contexto: Día ${userProgress}] Iniciado pregunta: ${message}` }] 
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
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
    
    // Manejo específico del error 400 de clave inválida
    if (error.message?.includes("API key not valid") || error.status === "INVALID_ARGUMENT") {
      throw new Error("TU LLAVE ES INVÁLIDA: La clave que has puesto en el panel de control no es correcta. Asegúrate de que es la clave de API de Google Gemini (empieza por AIza...).");
    }
    
    throw new Error("INTERFERENCIA EN EL ÉTER: El servidor está saturado o pausado. Usa el Maestro Yoda externo por ahora.");
  }
};
