import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("ADVERTENCIA: VITE_API_KEY no está definida. La IA no funcionará.");
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');
// Usamos el modelo Flash 2.5 por ser más rápido y económico, manteniendo buena calidad
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const getQuestionSuggestion = async (): Promise<string> => {
  try {
    const prompt = "Genera una única pregunta breve (máximo 20 palabras), solemne y reflexiva, que un trabajador o militante peronista le haría al destino sobre su futuro, el trabajo, la lealtad o la patria. Solo devuelve el texto de la pregunta, sin comillas.";

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Suggest Error:", error);
    return "¿Cuál es mi rol en la reconstrucción de la Patria?";
  }
};

export const getPeronMessage = async (userName: string, question: string, hexTitle: string, hexText: string): Promise<string> => {
  try {
    const prompt = `Tienes el rol del General Juan Domingo Perón.
    Tu tarea es responder BREVEMENTE (máximo 150 palabras) al compañero ${userName}.
    
    ESTRUCTURA OBLIGATORIA:
    1. INICIO: "Compañero ${userName}, me preguntas sobre: '${question}'."
    2. DESARROLLO: Analiza el hexagrama ${hexTitle} ("${hexText}") y responde DIRECTAMENTE a la pregunta usando las "20 Verdades Peronistas" y la "Comunidad Organizada".
    3. CIERRE: Un saludo paternal y la firma "Juan Perón".

    IMPORTANTE:
    - Sé CONCISO y DIRECTO.
    - Habla en primera persona, como el Conductor.
    - Formato Markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Peron Error:", error);
    if (!import.meta.env.VITE_API_KEY) {
      return "⚠️ Error: Falta configurar la API KEY de Google Gemini (VITE_API_KEY).";
    }
    return `Compañero, hubo un error de conexión con el Comando Superior (IA). Detalles: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const getEvitaMessage = async (userName: string, question: string, hexTitle: string, hexDictamen: string): Promise<string> => {
  try {
    const prompt = `Tienes el rol de Eva Perón (Evita).
    Tu tarea es responder BREVEMENTE (máximo 150 palabras) a ${userName}.
    
    ESTRUCTURA OBLIGATORIA:
    1. INICIO: "Querido ${userName}, sobre tu inquietud: '${question}'."
    2. DESARROLLO: Interpreta el hexagrama ${hexTitle} desde la DOCTRINA SOCIAL y la HISTORIA. Responde con pasión y combatividad.
    3. CIERRE: Un saludo revolucionario y la firma "Evita".

    IMPORTANTE:
    - Sé CONCISA, APASIONADA y COMBATIVA.
    - Habla como la Abanderada de los Humildes.
    - Formato Markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Evita Error:", error);
    return "Mis queridos, donde hay una necesidad nace un derecho. ¡Luchad por él!";
  }
};