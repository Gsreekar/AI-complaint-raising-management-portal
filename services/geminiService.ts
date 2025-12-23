
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeComplaint = async (text: string, imageData?: string): Promise<AIAnalysis> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are an expert AI Complaint Classifier. 
  Your task is to analyze the user's complaint (text and optional image) and determine:
  1. Category: One of [Hardware, Software, Network, Facilities, Human Resources, Finance, Others]
  2. Priority: One of [Low, Medium, High, Critical]
  3. Assigned Department: Suggest the most relevant department for routing.
  4. Reasoning: A brief explanation of why you chose this classification.
  
  Be precise and objective. Return the output in JSON format.`;

  const parts: any[] = [{ text }];
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1] || imageData
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          priority: { type: Type.STRING },
          assignedDepartment: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["category", "priority", "assignedDepartment", "reasoning"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return {
    category: result.category || 'Others',
    priority: (result.priority as Priority) || Priority.MEDIUM,
    assignedDepartment: result.assignedDepartment || 'General Support',
    reasoning: result.reasoning || 'Default classification.'
  };
};
