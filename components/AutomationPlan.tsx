
import React, { useState, useEffect } from 'react';
import type { SavedPlan, PlanSection } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { 
    CheckCircleIcon, CodeBracketIcon, ArrowPathIcon, ChartBarIcon, 
    CurrencyDollarIcon, LinkIcon, PencilIcon, SaveIcon, DownloadIcon 
} from './icons';

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
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 transition-all">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-300">
                {icon}
                {title}
            </h3>
            
            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(sectionKey, e.target.value)}
                    className="w-full h-64 bg-gray-900 border border-gray-600 rounded p-4 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono text-sm leading-relaxed"
                />
            ) : (
                <div className="prose prose-invert prose-p:text-gray-300 prose-ul:text-gray-300 prose-li:marker:text-cyan-400 max-w-none">
                    {content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                            return <li key={index} className="ml-4 list-disc">{paragraph.substring(2)}</li>;
                        }
                        if (/^\d+\./.test(paragraph)) {
                             return <li key={index} className="ml-4 list-decimal">{paragraph.substring(paragraph.indexOf('.')+1)}</li>;
                        }
                        return <p key={index}>{paragraph}</p>;
                    })}
                </div>
            )}
        </div>
    );
};

export const AutomationPlan: React.FC<AutomationPlanProps> = ({ plan, isLoading, onUpdatePlan }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState<SavedPlan | null>(null);

    useEffect(() => {
        setEditedPlan(plan);
        setIsEditing(false); // Reset edit mode when switching plans
    }, [plan]);

    if (isLoading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[300px]">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold text-gray-300">Analizando tu negocio y generando el plan...</p>
                <p className="text-gray-400">El modo de pensamiento de Gemini Pro está trabajando en tu consulta compleja.</p>
            </div>
        );
    }

    if (!plan || !editedPlan) {
        return (
            <div className="mt-8 text-center text-gray-500 bg-gray-800/30 p-8 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center h-full min-h-[400px]">
                <p className="text-lg">Selecciona un plan de la biblioteca o genera uno nuevo.</p>
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
        
        let textContent = `# Plan de Automatización: ${editedPlan.businessDescription}\n\n`;
        textContent += `Fecha: ${new Date(editedPlan.createdAt).toLocaleDateString()}\n\n`;
        
        const sections = [editedPlan.analysis, editedPlan.flows, editedPlan.stack, editedPlan.implementation, editedPlan.roi];
        sections.forEach(s => {
            textContent += `## ${s.title}\n\n${s.content}\n\n`;
        });

        if (editedPlan.sources.length > 0) {
            textContent += `## Fuentes\n`;
            editedPlan.sources.forEach(s => textContent += `- ${s.title}: ${s.uri}\n`);
        }

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Plan_Automatizacion_${editedPlan.id.substring(0, 8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const icons = [
        <CheckCircleIcon className="w-6 h-6 mr-3" />,
        <ArrowPathIcon className="w-6 h-6 mr-3" />,
        <CodeBracketIcon className="w-6 h-6 mr-3" />,
        <ChartBarIcon className="w-6 h-6 mr-3" />,
        <CurrencyDollarIcon className="w-6 h-6 mr-3" />,
    ];

    const sectionKeys: (keyof SavedPlan)[] = ['analysis', 'flows', 'stack', 'implementation', 'roi'];

    return (
        <div className="mt-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                     <h2 className="text-3xl font-bold text-white">Plan de Automatización</h2>
                     <p className="text-gray-400 text-sm mt-1">Generado el {new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
               
                <div className="flex space-x-3">
                    {isEditing ? (
                         <button 
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium shadow-lg"
                        >
                            <SaveIcon className="w-4 h-4 mr-2" />
                            Guardar Cambios
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium border border-gray-600"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Editar
                        </button>
                    )}
                    
                    <button 
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium border border-gray-600"
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Descargar
                    </button>
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
                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-300">
                        <LinkIcon className="w-6 h-6 mr-3" />
                        Fuentes de Información
                    </h3>
                    <ul className="space-y-2">
                        {editedPlan.sources.map((source, index) => (
                            <li key={index}>
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                                >
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                 </div>
            )}
        </div>
    );
};
