
import React, { useState, useMemo } from 'react';
import type { SavedPlan } from '../types';
import { LibraryIcon, TrashIcon, PlusIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

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
    const { t } = useLanguage();
    const [filterNiche, setFilterNiche] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');

    const niches = useMemo(() => {
        const unique = new Set(plans.map(p => p.niche));
        return ['all', ...Array.from(unique)];
    }, [plans]);

    const solutionTypes = useMemo(() => {
        const unique = new Set(plans.map(p => p.solutionType));
        return ['all', ...Array.from(unique)];
    }, [plans]);

    const filteredPlans = useMemo(() => {
        return plans.filter(p => {
            const matchNiche = filterNiche === 'all' || p.niche === filterNiche;
            const matchType = filterType === 'all' || p.solutionType === filterType;
            return matchNiche && matchType;
        });
    }, [plans, filterNiche, filterType]);

    return (
        <aside className="w-full md:w-80 bg-[#0A0A0A] flex-shrink-0 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] flex items-center text-white/50">
                        <LibraryIcon className="w-4 h-4 mr-3 text-cyan-400" />
                        {t('archive_index')}
                    </h2>
                </div>
                
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-2 block">{t('sector_filter')}</label>
                        <select 
                            value={filterNiche}
                            onChange={(e) => setFilterNiche(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-none px-3 py-2 text-[10px] font-mono text-white/70 focus:border-cyan-500/50 outline-none transition-colors appearance-none cursor-pointer"
                        >
                            {niches.map(n => (
                                <option key={n} value={n}>{n === 'all' ? t('all_sectors') : n.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-2 block">{t('solution_type')}</label>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-none px-3 py-2 text-[10px] font-mono text-white/70 focus:border-cyan-500/50 outline-none transition-colors appearance-none cursor-pointer"
                        >
                            {solutionTypes.map(t_key => (
                                <option key={t_key} value={t_key}>{t_key === 'all' ? t('all_solutions') : t_key.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={onNewPlan}
                    className="w-full flex items-center justify-center px-4 py-3 bg-white text-black hover:bg-cyan-400 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                    <PlusIcon className="w-3 h-3 mr-2" />
                    {t('initialize_new')}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredPlans.length === 0 ? (
                    <div className="text-center py-20 px-8 text-white/20 text-[10px] font-mono uppercase tracking-widest">
                        {plans.length === 0 ? t('no_records') : t('no_matches')}
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredPlans.map((plan) => (
                            <div 
                                key={plan.id}
                                onClick={() => onSelectPlan(plan)}
                                className={`group relative p-6 cursor-pointer transition-all ${
                                    currentPlanId === plan.id 
                                        ? 'bg-white/[0.03] border-l-2 border-cyan-500' 
                                        : 'hover:bg-white/[0.01] border-l-2 border-transparent'
                                }`}
                            >
                                <div className="pr-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[8px] px-1.5 py-0.5 border border-white/10 text-white/40 font-mono uppercase tracking-tighter">
                                            {plan.niche}
                                        </span>
                                    </div>
                                    <h4 className="font-serif text-sm text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-snug mb-3">
                                        {plan.businessDescription}
                                    </h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                                            {new Date(plan.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-[9px] font-mono text-cyan-500/50 group-hover:text-cyan-500 transition-colors">
                                            ID_{plan.id.substring(0, 4)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => onDeletePlan(plan.id, e)}
                                    className="absolute top-6 right-4 p-1.5 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title={t('purge_record')}
                                >
                                    <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};
