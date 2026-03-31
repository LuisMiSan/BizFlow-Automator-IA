
import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { SparklesIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

interface BusinessInputProps {
    onGenerate: (description: string) => void;
    isLoading: boolean;
}

export const BusinessInput: React.FC<BusinessInputProps> = ({ onGenerate, isLoading }) => {
    const { t } = useLanguage();
    const [description, setDescription] = useState<string>('Ejemplo: Una empresa de reformas de viviendas que gestiona proyectos desde el presupuesto inicial hasta la entrega final. Los procesos manuales incluyen la captación de clientes, la creación de presupuestos, la planificación de proyectos, la comunicación con los clientes y la facturación.');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(description);
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-cyan-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">{t('system_ready')}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                    {t('generate_title').split(' ').map((word, i) => 
                        word === 'Executive' || word === 'Ejecutiva' ? <span key={i} className="italic text-white/60">{word} </span> : word + ' '
                    )}
                </h1>
                <p className="text-white/40 text-sm max-w-xl leading-relaxed">
                    {t('input_description')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative">
                    <label className="absolute -top-3 left-4 px-2 bg-[#050505] text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] z-10">
                        {t('business_context_label')}
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('placeholder_description')}
                        className="w-full bg-transparent border border-white/10 rounded-none p-6 pt-8 text-white placeholder:text-white/10 focus:border-cyan-500/50 outline-none transition-all min-h-[200px] font-serif text-lg leading-relaxed"
                        required
                    />
                    <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                        {t('char_count')}: {description.length}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">{t('processing_unit')}</span>
                            <span className="text-[10px] font-mono text-cyan-500/70 uppercase">Gemini_3.1_Pro</span>
                        </div>
                        <div className="w-px h-8 bg-white/5"></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">{t('output_format')}</span>
                            <span className="text-[10px] font-mono text-white/50 uppercase">{t('executive_report_v2')}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`group relative px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
                    >
                        <span className="relative z-10 flex items-center">
                            {isLoading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin mr-3"></div>
                                    {t('architecting')}
                                </>
                            ) : (
                                <>
                                    {t('generate_strategy')}
                                    <SparklesIcon className="w-3 h-3 ml-3 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </form>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-30">
                <div className="p-6 border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 mb-3 uppercase tracking-widest">{t('analysis_step')}</div>
                    <p className="text-[11px] text-white/30 leading-relaxed">{t('analysis_desc')}</p>
                </div>
                <div className="p-6 border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 mb-3 uppercase tracking-widest">{t('architecture_step')}</div>
                    <p className="text-[11px] text-white/30 leading-relaxed">{t('architecture_desc')}</p>
                </div>
                <div className="p-6 border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 mb-3 uppercase tracking-widest">{t('projection_step')}</div>
                    <p className="text-[11px] text-white/30 leading-relaxed">{t('projection_desc')}</p>
                </div>
            </div>
        </div>
    );
};
