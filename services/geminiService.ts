
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from "../types";

export const parseReceipt = async (base64Image: string): Promise<ReceiptData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1],
            },
          },
          {
            text: "Extract the items, prices, subtotal, tax, and total from this receipt image. If specific items are not clear, do your best to estimate. Return in valid JSON.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.NUMBER },
              },
              required: ["name", "price"],
            },
          },
          subtotal: { type: Type.NUMBER },
          tax: { type: Type.NUMBER },
          total: { type: Type.NUMBER },
        },
        required: ["items", "total"],
      },
    },
  });

  const data = JSON.parse(response.text);
  return {
    items: data.items || [],
    subtotal: data.subtotal || data.items?.reduce((acc: number, item: any) => acc + item.price, 0) || 0,
    tax: data.tax || 0,
    total: data.total || 0,
  };
};
