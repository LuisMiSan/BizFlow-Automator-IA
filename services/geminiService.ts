
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planGenerationModel = 'gemini-3.1-pro-preview';
const chatModel = 'gemini-3-flash-preview';

let chat: Chat | null = null;

export const generateAutomationPlan = async (businessDescription: string, language: 'es' | 'en' = 'es'): Promise<{ planText: string, niche: string, solutionType: string, sources: GroundingSource[] }> => {
    const isSpanish = language === 'es';
    
    const prompt = isSpanish ? `
Eres un experto consultor en automatización de clase mundial especializado en el ecosistema de Google Cloud y Google AI. Tu tarea es analizar una descripción de negocio y crear un plan de automatización detallado, escalable y profesional utilizando PRIORITARIAMENTE herramientas de Google.

### REGLA OBLIGATORIA:
Debes proponer soluciones integrales dentro del ecosistema de Google (Google AI, Gemini, Vertex AI, Google Cloud, AppSheet, Google Workspace Automation, Firebase, etc.). Solo si no existe una solución viable en Google, busca alternativas externas, pero siempre justifica por qué la solución de Google es la preferida o cómo se integra.

Basado en la siguiente descripción de negocio, crea un plan de automatización completo.

### Descripción del negocio:
"${businessDescription}"

### El plan debe incluir los siguientes seis puntos, usando exactamente estos encabezados en formato markdown ###:

### 1. Análisis de Procesos Manuales
Identifica los procesos clave que son repetitivos, propensos a errores o que consumen mucho tiempo y que son candidatos ideales para la automatización. Sé específico y da ejemplos concretos relacionados con el negocio.

### 2. Diseño de Flujos de Agentes con Gemini
Propón flujos de trabajo automatizados utilizando Agentes de IA (Gemini). Describe cómo Gemini interactuaría con los datos del negocio, cómo se integraría con Google Workspace (Docs, Sheets, Gmail) y cómo operaría de forma autónoma o asistida.

### 3. Stack Tecnológico Google AI (Recomendado)
Sugiere un conjunto de herramientas y tecnologías de Google (Vertex AI, Gemini API, Google Cloud Functions, AppSheet, BigQuery, etc.) para construir e implementar las automatizaciones. Justifica tus elecciones basándote en la escalabilidad, seguridad y potencia del ecosistema de Google.

### 4. Implementación Paso a Paso en Google Cloud
Proporciona una hoja de ruta clara para la implementación utilizando servicios de Google, dividida en fases o hitos (ej. Fase 1: Despliegue de Agentes en Vertex AI, Fase 2: Integración con Google Workspace via Apps Script, etc.).

### 5. ROI Estimado y Escalabilidad
Ofrece un análisis del retorno de la inversión esperado y cómo la infraestructura de Google permite escalar el negocio sin fricciones. Proporciona estimaciones cuantitativas de ahorro de tiempo y costes.

### 6. Estimación de Gastos y Presupuesto
Proporciona un desglose claro y entendible de los gastos asociados. Incluye:
- **Gastos Mensuales:** Costes recurrentes de suscripciones o mantenimiento.
- **Estimación por Uso:** Cálculo aproximado del coste por ejecución de agentes o consultas a la API de Gemini/Vertex AI.
- **Gastos Asociados/No Especificados:** Posibles costes adicionales como almacenamiento en Cloud Storage, transferencia de datos o servicios de terceros necesarios.

### METADATOS DEL INFORME (IMPORTANTE) ###
Al final del informe, incluye una sección llamada "### METADATOS ###" con el siguiente formato JSON exacto (no incluyas nada más en esa sección):
{"niche": "Nombre del Nicho", "solutionType": "Tipo de Solución"}
Ejemplo: {"niche": "E-commerce", "solutionType": "Atención al Cliente"}

Utiliza información actualizada y precisa de la web (Google Search) para asegurar que las soluciones propuestas aprovechan las últimas capacidades de Gemini y Google Cloud.
` : `
You are a world-class automation consultant specialized in the Google Cloud and Google AI ecosystem. Your task is to analyze a business description and create a detailed, scalable, and professional automation plan PRIORITIZING Google tools.

### MANDATORY RULE:
You must propose comprehensive solutions within the Google ecosystem (Google AI, Gemini, Vertex AI, Google Cloud, AppSheet, Google Workspace Automation, Firebase, etc.). Only if there is no viable solution in Google, look for external alternatives, but always justify why the Google solution is preferred or how it integrates.

Based on the following business description, create a complete automation plan.

### Business Description:
"${businessDescription}"

### The plan must include the following six points, using exactly these headers in markdown format ###:

### 1. Manual Process Analysis
Identify key processes that are repetitive, error-prone, or time-consuming and are ideal candidates for automation. Be specific and give concrete examples related to the business.

### 2. Agent Flow Design with Gemini
Propose automated workflows using AI Agents (Gemini). Describe how Gemini would interact with business data, how it would integrate with Google Workspace (Docs, Sheets, Gmail), and how it would operate autonomously or assisted.

### 3. Google AI Tech Stack (Recommended)
Suggest a set of Google tools and technologies (Vertex AI, Gemini API, Google Cloud Functions, AppSheet, BigQuery, etc.) to build and implement the automations. Justify your choices based on the scalability, security, and power of the Google ecosystem.

### 4. Step-by-Step Implementation on Google Cloud
Provide a clear roadmap for implementation using Google services, divided into phases or milestones (e.g., Phase 1: Agent Deployment on Vertex AI, Phase 2: Integration with Google Workspace via Apps Script, etc.).

### 5. Estimated ROI and Scalability
Offer an analysis of the expected return on investment and how Google's infrastructure allows the business to scale seamlessly. Provide quantitative estimates of time and cost savings.

### 6. Expense Estimation and Budget
Provide a clear and understandable breakdown of associated expenses. Include:
- **Monthly Expenses:** Recurring subscription or maintenance costs.
- **Usage Estimation:** Approximate calculation of the cost per agent execution or Gemini/Vertex AI API queries.
- **Associated/Unspecified Expenses:** Possible additional costs such as Cloud Storage, data transfer, or necessary third-party services.

### REPORT METADATA (IMPORTANT) ###
At the end of the report, include a section called "### METADATOS ###" with the following exact JSON format (do not include anything else in that section):
{"niche": "Niche Name", "solutionType": "Solution Type"}
Example: {"niche": "E-commerce", "solutionType": "Customer Support"}

Use up-to-date and accurate information from the web (Google Search) to ensure the proposed solutions leverage the latest capabilities of Gemini and Google Cloud.
`;

    try {
        const response = await ai.models.generateContent({
            model: planGenerationModel,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
                tools: [{ googleSearch: {} }],
            },
        });

        const planText = response.text;
        
        // Extract metadata
        let niche = isSpanish ? 'General' : 'General';
        let solutionType = isSpanish ? 'Automatización' : 'Automation';
        const metadataMatch = planText.match(/### METADATOS ###\s*({.*?})/s);
        if (metadataMatch) {
            try {
                const metadata = JSON.parse(metadataMatch[1]);
                niche = metadata.niche || niche;
                solutionType = metadata.solutionType || solutionType;
            } catch (e) {
                console.error("Error parsing metadata JSON:", e);
            }
        }

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = groundingChunks
            .map((chunk: any) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || (isSpanish ? 'Fuente sin título' : 'Untitled Source')
            }))
            .filter((source: GroundingSource) => source.uri);
        
        return { planText, niche, solutionType, sources };
    } catch (error) {
        console.error("Gemini API Error (generateAutomationPlan):", error);
        throw new Error(isSpanish ? "Error al generar el plan de automatización desde Gemini API." : "Failed to generate automation plan from Gemini API.");
    }
};


export const chatWithBot = async (history: ChatMessage[], newMessage: string, language: 'es' | 'en' = 'es'): Promise<string> => {
    const isSpanish = language === 'es';
    
    if (!chat) {
        chat = ai.chats.create({
            model: chatModel,
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            config: {
                systemInstruction: isSpanish 
                    ? "Eres un experto consultor de automatización de Google AI. Responde siempre en ESPAÑOL. Ayuda al usuario a entender y refinar su plan de automatización."
                    : "You are a Google AI automation consultant expert. Always respond in ENGLISH. Help the user understand and refine their automation plan."
            }
        });
    }

    try {
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Gemini API Error (chatWithBot):", error);
        // Reset chat on error
        chat = null;
        throw new Error(isSpanish ? "Error al obtener respuesta del chat desde Gemini API." : "Failed to get chat response from Gemini API.");
    }
};

export const resetChat = () => {
    chat = null;
};
