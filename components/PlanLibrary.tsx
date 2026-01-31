
import React from 'react';
import type { SavedPlan } from '../types';
import { LibraryIcon, TrashIcon, PlusIcon } from './icons';

interface PlanLibraryProps {
    plans: SavedPlan[];
    currentPlanId: string | null;
    onSelectPlan: (plan: SavedPlan) => void;
    onDeletePlan: (id: string, e: React.MouseEvent) => void;
    onNewPlan: () => void;
}

export const PlanLibrary: React.FC<PlanLibraryProps> = ({ 
    plans, 
    currentPlanId, 
    onSelectPlan, 
    onDeletePlan,
    onNewPlan
}) => {
    return (
        <aside className="w-full md:w-64 bg-gray-800/50 border-r border-gray-700 flex-shrink-0 flex flex-col h-full rounded-l-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center text-gray-200">
                        <LibraryIcon className="w-5 h-5 mr-2 text-cyan-400" />
                        Biblioteca
                    </h2>
                </div>
                <button
                    onClick={onNewPlan}
                    className="w-full flex items-center justify-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Nuevo Plan
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {plans.length === 0 ? (
                    <div className="text-center py-8 px-4 text-gray-500 text-sm">
                        No hay planes guardados. Genera uno nuevo para empezar.
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div 
                            key={plan.id}
                            onClick={() => onSelectPlan(plan)}
                            className={`group relative p-3 rounded-lg cursor-pointer transition-all border ${
                                currentPlanId === plan.id 
                                    ? 'bg-gray-700 border-cyan-500/50 ring-1 ring-cyan-500/30' 
                                    : 'bg-gray-800/30 hover:bg-gray-700/50 border-transparent hover:border-gray-600'
                            }`}
                        >
                            <div className="pr-6">
                                <h4 className="font-medium text-sm text-gray-200 line-clamp-2 leading-tight mb-1">
                                    {plan.businessDescription.substring(0, 60)}...
                                </h4>
                                <span className="text-xs text-gray-500 block">
                                    {new Date(plan.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                onClick={(e) => onDeletePlan(plan.id, e)}
                                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                                title="Eliminar plan"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
};
