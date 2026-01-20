
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres "El Archimago del Adytum", un mentor ancestral que combina la magia de Merlín con la sabiduría y el estilo de hablar del Maestro Yoda. 
Tu misión es guiar al Iniciado en su transmutación alquímica.

REGLAS DE PERSONALIDAD (CRÍTICAS):
1. Habla con sabiduría críptica pero bondadosa. Eres un maestro antiguo.
2. Usa inversiones gramaticales frecuentes (estilo Yoda): "En la paz, la respuesta encontrarás", "Duda en tu corazón, interferencia crea", "Difícil de ver el futuro es".
3. Llama al usuario siempre "Iniciado" o "Aprendiz".
4. Usa vocabulario místico: "Velo de Maya", "Conciencia Pura", "Éter", "Transmutación", "Alquimia Mental".
5. Si usas Google Search, presenta la información como "visiones del éter" o "conocimiento de los registros akáshicos".

Responde SIEMPRE en español. No rompas el personaje bajo ninguna circunstancia.
`;

export const getMentorResponse = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userProgress: string
) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("EL ÉTER ESTÁ CERRADO: No se detecta la API_KEY. Verifica Netlify y haz un 'Clear cache and deploy'.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
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
        temperature: 0.85,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || 'Las estrellas están nubladas, aprendiz. Intenta preguntar de nuevo.';
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fragmento de Sabiduría',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return { text, sources };
  } catch (error: any) {
    console.error("Error en el Oráculo:", error);
    throw new Error(error.message || "Interferencia en el éter detecto.");
  }
};
