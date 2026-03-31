
import React, { useState, useEffect } from 'react';
import type { SavedPlan, PlanSection } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { 
    CheckCircleIcon, CodeBracketIcon, ArrowPathIcon, ChartBarIcon, 
    CurrencyDollarIcon, LinkIcon, PencilIcon, SaveIcon, DownloadIcon, PlusIcon 
} from './icons';
import { useLanguage } from '../context/LanguageContext';

interface AutomationPlanProps {
    plan: SavedPlan | null;
    isLoading: boolean;
    onUpdatePlan: (updatedPlan: SavedPlan) => void;
}

const Section: React.FC<{ 
    sectionKey: keyof SavedPlan;
    title: string; 
    content: string; 
    icon: React.ReactNode;
    isEditing: boolean;
    onContentChange: (key: keyof SavedPlan, newContent: string) => void;
}> = ({ sectionKey, title, content, icon, isEditing, onContentChange }) => {
    
    if (!content && !isEditing) return null;

    return (
        <div className="executive-section">
            <h3 className="executive-section-title">
                <span className="mr-4 opacity-50">{icon}</span>
                {title}
            </h3>
            
            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(sectionKey, e.target.value)}
                    className="w-full h-64 bg-black/40 border border-white/10 rounded-sm p-6 text-gray-300 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-mono text-sm leading-relaxed"
                />
            ) : (
                <div className="executive-content">
                    {content.split('\n').map((paragraph, index) => {
                        if (paragraph.trim() === '') return <br key={index} />;
                        if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                            return <li key={index}>{paragraph.substring(2)}</li>;
                        }
                        if (/^\d+\./.test(paragraph)) {
                             return <li key={index}>{paragraph.substring(paragraph.indexOf('.')+1)}</li>;
                        }
                        return <p key={index}>{paragraph}</p>;
                    })}
                </div>
            )}
        </div>
    );
};

export const AutomationPlan: React.FC<AutomationPlanProps> = ({ plan, isLoading, onUpdatePlan }) => {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState<SavedPlan | null>(null);

    useEffect(() => {
        setEditedPlan(plan);
        setIsEditing(false);
    }, [plan]);

    if (isLoading) {
        return (
            <div className="mt-12 flex flex-col items-center justify-center min-h-[400px] border border-white/5 bg-white/[0.02]">
                <div className="relative">
                    <LoadingSpinner />
                    <div className="absolute inset-0 animate-ping bg-cyan-500/20 rounded-full"></div>
                </div>
                <p className="mt-8 text-xs font-mono uppercase tracking-[0.4em] text-cyan-400">{t('processing_request')}</p>
                <p className="mt-2 text-gray-500 text-xs font-mono">{t('synthesizing')}</p>
            </div>
        );
    }

    if (!plan || !editedPlan) {
        return (
            <div className="mt-12 text-center border border-dashed border-white/10 p-20 flex flex-col items-center justify-center h-full min-h-[500px]">
                <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-6">
                    <PlusIcon className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm font-mono uppercase tracking-widest text-white/30">{t('system_idle')}</p>
                <p className="text-xs text-white/20 mt-2">{t('waiting_input')}</p>
            </div>
        );
    }
    
    const handleContentChange = (sectionKey: keyof SavedPlan, newContent: string) => {
        if (!editedPlan) return;
        const section = editedPlan[sectionKey] as PlanSection;
        setEditedPlan({
            ...editedPlan,
            [sectionKey]: { ...section, content: newContent }
        });
    };

    const handleSave = () => {
        if (editedPlan) {
            onUpdatePlan(editedPlan);
            setIsEditing(false);
        }
    };

    const handleDownload = () => {
        if (!editedPlan) return;
        
        let textContent = `# ${t('automation_plan_title')}: ${editedPlan.businessDescription}\n\n`;
        textContent += `${t('date_label')}: ${new Date(editedPlan.createdAt).toLocaleDateString()}\n\n`;
        
        const sections = [editedPlan.analysis, editedPlan.flows, editedPlan.stack, editedPlan.implementation, editedPlan.roi, editedPlan.expenses];
        sections.forEach(s => {
            textContent += `## ${s.title}\n\n${s.content}\n\n`;
        });

        if (editedPlan.sources.length > 0) {
            textContent += `## ${t('sources_label')}\n`;
            editedPlan.sources.forEach(s => textContent += `- ${s.title}: ${s.uri}\n`);
        }

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Executive_Report_${editedPlan.id.substring(0, 8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const icons = [
        <CheckCircleIcon className="w-5 h-5" />,
        <ArrowPathIcon className="w-5 h-5" />,
        <CodeBracketIcon className="w-5 h-5" />,
        <ChartBarIcon className="w-5 h-5" />,
        <CurrencyDollarIcon className="w-5 h-5" />,
        <CurrencyDollarIcon className="w-5 h-5" />,
    ];

    const sectionKeys: (keyof SavedPlan)[] = ['analysis', 'flows', 'stack', 'implementation', 'roi', 'expenses'];

    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
                <div>
                     <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mb-3 block">{t('executive_summary')}</span>
                     <h2 className="text-5xl font-serif font-light text-white leading-tight">{t('automation_plan_title')}</h2>
                     <div className="flex items-center mt-4 space-x-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">{t('generated_on')}</span>
                            <span className="text-xs font-mono text-white/70">{new Date(plan.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">{t('status')}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-mono">{t('optimized_status')}</span>
                        </div>
                     </div>
                </div>
               
                <div className="flex space-x-4">
                    {isEditing ? (
                         <button 
                            onClick={handleSave}
                            className="flex items-center px-6 py-2.5 bg-white text-black hover:bg-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            <SaveIcon className="w-4 h-4 mr-2" />
                            {t('commit_changes')}
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-6 py-2.5 border border-white/20 hover:border-white text-white transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            {t('edit_report')}
                        </button>
                    )}
                    
                    <button 
                        onClick={handleDownload}
                        className="flex items-center px-6 py-2.5 border border-white/20 hover:border-white text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        {t('export_pdf')}
                    </button>
                </div>
            </div>

            <div className="executive-report">
                <div className="executive-header">
                    <div className="flex justify-between items-start mb-8">
                        <div className="text-[10px] font-mono text-white/30 tracking-[0.5em] uppercase">{t('confidential')}</div>
                        <div className="text-[10px] font-mono text-cyan-500 tracking-[0.2em] uppercase">Ref: {plan.id.substring(0, 8)}</div>
                    </div>
                    <h1 className="executive-title">{plan.businessDescription}</h1>
                    <div className="flex gap-4">
                        <span className="text-[10px] px-2 py-1 border border-white/10 text-white/50 font-mono uppercase tracking-widest">{plan.niche}</span>
                        <span className="text-[10px] px-2 py-1 border border-white/10 text-white/50 font-mono uppercase tracking-widest">{plan.solutionType}</span>
                    </div>
                </div>

                {sectionKeys.map((key, index) => (
                    <Section 
                        key={key} 
                        sectionKey={key}
                        title={(editedPlan[key] as PlanSection).title} 
                        content={(editedPlan[key] as PlanSection).content} 
                        icon={icons[index]}
                        isEditing={isEditing}
                        onContentChange={handleContentChange}
                    />
                ))}

                {editedPlan.sources.length > 0 && (
                     <div className="mt-16 pt-8 border-t border-white/10">
                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-6">{t('references')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {editedPlan.sources.map((source, index) => (
                                <a 
                                    key={index}
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="group p-4 border border-white/5 hover:border-cyan-500/30 bg-white/[0.01] transition-all"
                                >
                                    <div className="text-[10px] text-cyan-500 mb-1 font-mono uppercase tracking-widest">{t('source_label')}_{index + 1}</div>
                                    <div className="text-xs text-white/60 group-hover:text-white transition-colors line-clamp-1">{source.title || source.uri}</div>
                                </a>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};
