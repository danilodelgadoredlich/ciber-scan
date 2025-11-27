import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImage = async (base64Image: string): Promise<AnalysisResponse> => {
  try {
    // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: `Actúa como un sistema de escaneo digital. Analiza esta imagen y lista los objetos, textos o alimentos detectados.
            
            Reglas de formato:
            1. Devuelve SOLO una lista simple separada por saltos de línea.
            2. No uses markdown, negritas, ni introducciones ("Aquí está la lista").
            3. Si detectas precios, inclúyelos a la derecha.
            4. Si es un paisaje o escena general, lista los elementos clave.
            5. Mantén un tono técnico y breve.
            6. Responde en Español.
            7. Lista solo los productos finales, por ejemplo evita decir envoltorio de hambuerguesa y luego la hamburguesa, solo di Hamburguesa.
            8. Lista solo los productos, evita decir por ejemplo bandejas, suelo, pared,etc
            9. Si hay productos que se repiten, cuentalos, en vez de decir hamburguesa, hamburguesa, di 2 hamburguesas.`,
          },
        ],
      },
    });

    const text = response.text || "No se detectaron datos.";
    
    // Process text into lines for the UI
    const items = text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^- /, '').replace(/^\* /, ''));

    return {
      rawText: text,
      items: items
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Error connecting to neural network.");
  }
};