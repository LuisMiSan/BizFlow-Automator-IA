import React from 'react';
import type { Plan, GroundingSource } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircleIcon, CodeBracketIcon, ArrowPathIcon, ChartBarIcon, CurrencyDollarIcon, LinkIcon } from './icons';

interface AutomationPlanProps {
    plan: Plan | null;
    sources: GroundingSource[];
    isLoading: boolean;
}

const Section: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => {
    if (!content) return null;
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-300">
                {icon}
                {title}
            </h3>
            <div className="prose prose-invert prose-p:text-gray-300 prose-ul:text-gray-300 prose-li:marker:text-cyan-400">
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
        </div>
    );
};

export const AutomationPlan: React.FC<AutomationPlanProps> = ({ plan, sources, isLoading }) => {
    if (isLoading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[300px]">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold text-gray-300">Analizando tu negocio y generando el plan...</p>
                <p className="text-gray-400">El modo de pensamiento de Gemini Pro está trabajando en tu consulta compleja.</p>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="mt-8 text-center text-gray-500 bg-gray-800/30 p-8 rounded-xl border border-dashed border-gray-700">
                <p>El plan de automatización aparecerá aquí una vez generado.</p>
            </div>
        );
    }
    
    const icons = [
        <CheckCircleIcon className="w-6 h-6 mr-3" />,
        <ArrowPathIcon className="w-6 h-6 mr-3" />,
        <CodeBracketIcon className="w-6 h-6 mr-3" />,
        <ChartBarIcon className="w-6 h-6 mr-3" />,
        <CurrencyDollarIcon className="w-6 h-6 mr-3" />,
    ];

    // FIX: Replaced Object.values(plan) with an explicit array to ensure correct type inference for plan sections and preserve their order.
    const planSections = [plan.analysis, plan.flows, plan.stack, plan.implementation, plan.roi];

    return (
        <div className="mt-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Tu Plan de Automatización Personalizado</h2>
            {planSections.map((section, index) => (
                section.title && section.content && <Section key={index} title={section.title} content={section.content} icon={icons[index]} />
            ))}
            {sources.length > 0 && (
                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-300">
                        <LinkIcon className="w-6 h-6 mr-3" />
                        Fuentes de Información (Google Search Grounding)
                    </h3>
                    <ul className="space-y-2">
                        {sources.map((source, index) => (
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
