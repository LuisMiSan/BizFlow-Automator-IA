import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
    [key: string]: {
        es: string;
        en: string;
    };
}

export const translations: Translations = {
    // Header
    system_name: { es: 'Google_AI_Automator', en: 'Google_AI_Automator' },
    neural_engine_active: { es: 'Motor_Neural_Activo', en: 'Neural_Engine_Active' },
    core_model: { es: 'Modelo_Base', en: 'Core_Model' },
    environment: { es: 'Entorno', en: 'Environment' },
    system_uptime: { es: 'Tiempo_Actividad', en: 'System_Uptime' },
    stable: { es: 'ESTABLE', en: 'STABLE' },
    
    // PlanLibrary
    archive_index: { es: 'Índice_Archivo', en: 'Archive_Index' },
    sector_filter: { es: 'Filtro_Sector', en: 'Sector_Filter' },
    solution_type: { es: 'Tipo_Solución', en: 'Solution_Type' },
    all_sectors: { es: 'TODOS_LOS_SECTORES', en: 'ALL_SECTORS' },
    all_solutions: { es: 'TODAS_LAS_SOLUCIONES', en: 'ALL_SOLUTIONS' },
    initialize_new: { es: 'Inicializar_Nuevo', en: 'Initialize_New' },
    no_records: { es: 'No_Se_Encontraron_Registros', en: 'No_Records_Found' },
    no_matches: { es: 'Sin_Coincidencias_En_Índice', en: 'No_Matches_In_Index' },
    purge_record: { es: 'Purgar_Registro', en: 'Purge_Record' },
    
    // BusinessInput
    system_ready: { es: 'Sistema_Listo', en: 'System_Ready' },
    generate_title: { es: 'Generar Estrategia de Automatización', en: 'Generate Automation Strategy' },
    executive: { es: 'Ejecutiva', en: 'Executive' },
    input_description: { es: 'Ingrese los parámetros de su negocio a continuación. Nuestro motor neural diseñará un marco de automatización integral aprovechando el ecosistema de Google AI.', en: 'Input your business parameters below. Our neural engine will architect a comprehensive automation framework leveraging the Google AI ecosystem.' },
    business_context_label: { es: 'Entrada_Contexto_Negocio', en: 'Business_Context_Input' },
    placeholder_description: { es: 'Describa su modelo de negocio, cuellos de botella actuales y objetivos principales...', en: 'Describe your business model, current bottlenecks, and primary objectives...' },
    char_count: { es: 'Conteo_Caracteres', en: 'Character_Count' },
    processing_unit: { es: 'Unidad_Procesamiento', en: 'Processing_Unit' },
    output_format: { es: 'Formato_Salida', en: 'Output_Format' },
    executive_report_v2: { es: 'Informe_Ejecutivo_v2', en: 'Executive_Report_v2' },
    architecting: { es: 'Arquitectando...', en: 'Architecting...' },
    generate_strategy: { es: 'Generar_Estrategia', en: 'Generate_Strategy' },
    analysis_step: { es: '01_Análisis', en: '01_Analysis' },
    analysis_desc: { es: 'Inmersión profunda en las ineficiencias operativas e identificación de cuellos de botella.', en: 'Deep dive into operational inefficiencies and bottleneck identification.' },
    architecture_step: { es: '02_Arquitectura', en: '02_Architecture' },
    architecture_desc: { es: 'Diseño de flujo de trabajo personalizado utilizando Vertex AI y capacidades multimodales de Gemini.', en: 'Custom workflow design using Vertex AI and Gemini multimodal capabilities.' },
    projection_step: { es: '03_Proyección', en: '03_Projection' },
    projection_desc: { es: 'Análisis detallado del ROI y hoja de ruta de implementación escalable.', en: 'Detailed ROI analysis and scalable implementation roadmap.' },
    
    // AutomationPlan
    processing_request: { es: 'Procesando_Solicitud', en: 'Processing_Request' },
    synthesizing: { es: 'Gemini 3.1 Pro está sintetizando su estrategia ejecutiva...', en: 'Gemini 3.1 Pro is synthesizing your executive strategy...' },
    system_idle: { es: 'Sistema_Inactivo', en: 'System_Idle' },
    waiting_input: { es: 'Esperando parámetros de negocio o selección de biblioteca', en: 'Waiting for business parameters or library selection' },
    executive_summary: { es: 'Resumen Ejecutivo', en: 'Executive Summary' },
    automation_plan_title: { es: 'Plan de Automatización', en: 'Automation Plan' },
    generated_on: { es: 'Generado_El', en: 'Generated_On' },
    status: { es: 'Estado', en: 'Status' },
    optimized_status: { es: 'OPTIMIZADO_GOOGLE_AI', en: 'OPTIMIZED_GOOGLE_AI' },
    commit_changes: { es: 'Confirmar_Cambios', en: 'Commit_Changes' },
    edit_report: { es: 'Editar_Informe', en: 'Edit_Report' },
    export_pdf: { es: 'Exportar_PDF', en: 'Export_PDF' },
    confidential: { es: 'Confidencial / Solo Uso Interno', en: 'Confidential / Internal Use Only' },
    references: { es: 'Referencias y Fuentes de Datos', en: 'References & Data Sources' },
    source_label: { es: 'Fuente', en: 'Source' },
    
    // App
    system_error: { es: 'Error_Sistema', en: 'System_Error' },
    error_description: { es: 'Hubo un error al generar el plan. Por favor, inténtalo de nuevo.', en: 'There was an error generating the plan. Please try again.' },
    input_error: { es: 'Por favor, describe tu negocio.', en: 'Please describe your business.' },
    confirm_delete: { es: '¿Estás seguro de que quieres eliminar este plan?', en: 'Are you sure you want to delete this plan?' },
    implementation_plan_title: { es: 'Plan de Implementación', en: 'Implementation Plan' },
    roi_estimated: { es: 'ROI Estimado', en: 'Estimated ROI' },
    expense_estimation: { es: 'Estimación de Gastos', en: 'Expense Estimation' },
    date_label: { es: 'Fecha', en: 'Date' },
    sources_label: { es: 'Fuentes', en: 'Sources' },
    
    // ChatBot
    chat_title: { es: 'Asistente de Estrategia AI', en: 'AI Strategy Assistant' },
    chat_placeholder: { es: 'Pregunte sobre su plan...', en: 'Ask about your plan...' },
    chat_welcome: { es: 'Hola. Soy su consultor de automatización de Google AI. ¿Cómo puedo ayudarle con su estrategia hoy?', en: 'Hello. I am your Google AI automation consultant. How can I assist with your strategy today?' }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
