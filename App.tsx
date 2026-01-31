
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { BusinessInput } from './components/BusinessInput';
import { AutomationPlan } from './components/AutomationPlan';
import { PlanLibrary } from './components/PlanLibrary';
import { ChatBot } from './components/ChatBot';
import { generateAutomationPlan } from './services/geminiService';
import type { Plan, SavedPlan } from './types';

const App: React.FC = () => {
    const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
        const saved = localStorage.getItem('bizflow_plans');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentPlan, setCurrentPlan] = useState<SavedPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingNew, setIsGeneratingNew] = useState(true);

    useEffect(() => {
        localStorage.setItem('bizflow_plans', JSON.stringify(savedPlans));
    }, [savedPlans]);

    const handleGeneratePlan = useCallback(async (businessDescription: string) => {
        if (!businessDescription.trim()) {
            setError("Por favor, describe tu negocio.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const result = await generateAutomationPlan(businessDescription);
            
            // Basic parsing of the response text into sections
            const sections = result.planText.split(/#{2,3}\s*\d+\.\s*/);
            const titles = result.planText.match(/#{2,3}\s*\d+\.\s*(.*?)\n/g) || [];

            let parsedPlan: Plan;

            if (sections.length > 5) {
                 parsedPlan = {
                    analysis: { title: titles[0]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || 'Análisis de Procesos Manuales', content: sections[1] },
                    flows: { title: titles[1]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || 'Diseño de Flujos de Agentes', content: sections[2] },
                    stack: { title: titles[2]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || 'Stack Tecnológico Recomendado', content: sections[3] },
                    implementation: { title: titles[3]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || 'Implementación Paso a Paso', content: sections[4] },
                    roi: { title: titles[4]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || 'ROI Estimado', content: sections[5] },
                };
            } else {
                parsedPlan = {
                    analysis: { title: 'Plan de Automatización', content: result.planText },
                    flows: { title: '', content: '' },
                    stack: { title: '', content: '' },
                    implementation: { title: '', content: '' },
                    roi: { title: '', content: '' },
                };
            }

            const newSavedPlan: SavedPlan = {
                ...parsedPlan,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
                businessDescription: businessDescription,
                sources: result.sources || []
            };

            setSavedPlans(prev => [newSavedPlan, ...prev]);
            setCurrentPlan(newSavedPlan);
            setIsGeneratingNew(false);

        } catch (err) {
            console.error("Error generating plan:", err);
            setError("Hubo un error al generar el plan. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleUpdatePlan = (updatedPlan: SavedPlan) => {
        setSavedPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
        setCurrentPlan(updatedPlan);
    };

    const handleDeletePlan = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
            setSavedPlans(prev => prev.filter(p => p.id !== id));
            if (currentPlan?.id === id) {
                setCurrentPlan(null);
                setIsGeneratingNew(true);
            }
        }
    };

    const handleNewPlanClick = () => {
        setCurrentPlan(null);
        setIsGeneratingNew(true);
    };

    const handleSelectPlan = (plan: SavedPlan) => {
        setCurrentPlan(plan);
        setIsGeneratingNew(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Hidden on mobile by default (implied simple responsive behavior) */}
                <div className="hidden md:block h-full">
                     <PlanLibrary 
                        plans={savedPlans}
                        currentPlanId={currentPlan?.id || null}
                        onSelectPlan={handleSelectPlan}
                        onDeletePlan={handleDeletePlan}
                        onNewPlan={handleNewPlanClick}
                    />
                </div>
               
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Mobile library toggle logic could go here, for now relying on desktop sidebar */}
                    
                    {isGeneratingNew ? (
                         <>
                            <div className="max-w-4xl mx-auto">
                                <BusinessInput onGenerate={handleGeneratePlan} isLoading={isLoading} />
                                {error && (
                                    <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
                                        {error}
                                    </div>
                                )}
                                {isLoading && (
                                     <div className="mt-8 flex flex-col items-center justify-center">
                                        <AutomationPlan plan={null} sources={[]} isLoading={true} onUpdatePlan={() => {}} />
                                    </div>
                                )}
                            </div>
                         </>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <button 
                                onClick={handleNewPlanClick}
                                className="md:hidden mb-4 text-cyan-400 text-sm flex items-center"
                            >
                                &larr; Volver a generar
                            </button>
                            <AutomationPlan 
                                plan={currentPlan}
                                sources={currentPlan?.sources || []}
                                isLoading={isLoading}
                                onUpdatePlan={handleUpdatePlan}
                            />
                        </div>
                    )}
                </main>
            </div>
            <ChatBot />
        </div>
    );
};

export default App;
