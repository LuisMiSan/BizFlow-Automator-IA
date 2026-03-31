
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { BusinessInput } from './components/BusinessInput';
import { AutomationPlan } from './components/AutomationPlan';
import { PlanLibrary } from './components/PlanLibrary';
import { ChatBot } from './components/ChatBot';
import { generateAutomationPlan } from './services/geminiService';
import type { Plan, SavedPlan } from './types';
import { useLanguage } from './context/LanguageContext';

const App: React.FC = () => {
    const { t, language } = useLanguage();
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
            setError(t('input_error'));
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const result = await generateAutomationPlan(businessDescription, language);
            
            // Basic parsing of the response text into sections
            const sections = result.planText.split(/#{2,3}\s*\d+\.\s*/);
            const titles = result.planText.match(/#{2,3}\s*\d+\.\s*(.*?)\n/g) || [];

            let parsedPlan: Plan;

            if (sections.length > 6) {
                 parsedPlan = {
                    analysis: { title: titles[0]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || t('analysis_step'), content: sections[1] },
                    flows: { title: titles[1]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || t('architecture_step'), content: sections[2] },
                    stack: { title: titles[2]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || t('projection_step'), content: sections[3] },
                    implementation: { title: titles[3]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || t('implementation_plan_title'), content: sections[4] },
                    roi: { title: titles[4]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || t('roi_estimated'), content: sections[5] },
                    expenses: { title: titles[5]?.replace(/#{2,3}\s*\d+\.\s*/, '').trim() || t('expense_estimation'), content: sections[6] },
                };
            } else {
                parsedPlan = {
                    analysis: { title: t('automation_plan_title'), content: result.planText },
                    flows: { title: '', content: '' },
                    stack: { title: '', content: '' },
                    implementation: { title: '', content: '' },
                    roi: { title: '', content: '' },
                    expenses: { title: '', content: '' },
                };
            }

            const newSavedPlan: SavedPlan = {
                ...parsedPlan,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
                businessDescription: businessDescription,
                niche: result.niche,
                solutionType: result.solutionType,
                sources: result.sources || []
            };

            setSavedPlans(prev => [newSavedPlan, ...prev]);
            setCurrentPlan(newSavedPlan);
            setIsGeneratingNew(false);

        } catch (err) {
            console.error("Error generating plan:", err);
            setError(t('error_description'));
        } finally {
            setIsLoading(false);
        }
    }, [language, t]);

    const handleUpdatePlan = (updatedPlan: SavedPlan) => {
        setSavedPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
        setCurrentPlan(updatedPlan);
    };

    const handleDeletePlan = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(t('confirm_delete'))) {
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
        <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            <Header />
            
            <main className="flex flex-1 overflow-hidden relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                <PlanLibrary 
                    plans={savedPlans} 
                    onSelectPlan={handleSelectPlan}
                    onDeletePlan={handleDeletePlan}
                    onNewPlan={handleNewPlanClick}
                    currentPlanId={currentPlan?.id || null}
                />
                
                <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#050505]">
                    <div className="relative z-10 p-4 md:p-12">
                        {error && (
                            <div className="max-w-2xl mx-auto mb-12 p-6 border border-red-500/20 bg-red-500/5 text-red-400 font-mono text-xs uppercase tracking-widest flex items-center gap-4">
                                <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
                                System_Error: {error}
                            </div>
                        )}
                        
                        {isGeneratingNew ? (
                            <BusinessInput onGenerate={handleGeneratePlan} isLoading={isLoading} />
                        ) : (
                            <div className="max-w-5xl mx-auto">
                                <AutomationPlan 
                                    plan={currentPlan}
                                    isLoading={isLoading}
                                    onUpdatePlan={handleUpdatePlan}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <ChatBot />
        </div>
    );
};

export default App;
