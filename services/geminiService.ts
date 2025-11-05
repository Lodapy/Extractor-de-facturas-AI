
import { GoogleGenAI, Type } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    numeroFactura: { type: Type.STRING, description: 'El número de la factura o ticket. Si no existe, usar "N/D".' },
    fecha: { type: Type.STRING, description: 'La fecha de la factura en formato DD/MM/YYYY. Si no existe, usar "N/D".' },
    proveedor: { type: Type.STRING, description: 'El nombre del proveedor, tienda o empresa que emite la factura. Si no existe, usar "N/D".' },
    concepto: { type: Type.STRING, description: 'Una descripción breve del concepto o servicio principal. Si no existe, usar "N/D".' },
    categoria: { type: Type.STRING, description: 'Clasifica el concepto en una de las siguientes categorías: "Materiales de Construccion", "Materiales Electricos", "Pago de servicio de mano de obra", "Equipos de trabajo o electrodomesticos", "Otros". Si no se puede determinar, usar "Otros".' },
    importe: { type: Type.STRING, description: 'El monto total en formato numérico (ej: 123.45), sin símbolos de moneda. Si no existe, usar "0".' },
  },
  required: ['numeroFactura', 'fecha', 'proveedor', 'concepto', 'categoria', 'importe'],
};

export const extractDataFromImage = async (file: File) => {
  try {
    const base64Data = await fileToBase64(file);

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };

    const textPart = {
      text: "Analiza esta imagen de una factura para extraer los datos clave y clasificar el concepto. Responde únicamente con el objeto JSON según el esquema proporcionado.",
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    // Although we expect JSON, Gemini might wrap it in markdown, so we clean it.
    const cleanJson = jsonString.replace(/```json\n?|\n?```/g, '').trim();
    const invoiceData = JSON.parse(cleanJson);

    return invoiceData;

  } catch (error) {
    console.error("Error al contactar la API de Gemini:", error);
    throw new Error("No se pudieron extraer los datos de la imagen.");
  }
};