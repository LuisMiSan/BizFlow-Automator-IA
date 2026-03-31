
import React from 'react';
import { CpuIcon, UserIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="bg-[#050505] border-b border-white/10 px-8 py-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white flex items-center justify-center">
                        <CpuIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-white">
                            {t('system_name')}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest">{t('neural_engine_active')}</span>
                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
                
                <nav className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-8">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-0.5">{t('core_model')}</span>
                        <span className="text-[10px] font-mono text-white/60 uppercase">Gemini_3.1_Pro</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-0.5">{t('environment')}</span>
                        <span className="text-[10px] font-mono text-white/60 uppercase">Vertex_AI_Cloud</span>
                    </div>
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <button 
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    className="px-3 py-1 border border-white/10 text-[10px] font-mono text-white/40 hover:text-white hover:border-white/30 transition-all uppercase tracking-widest"
                >
                    {language === 'es' ? 'EN' : 'ES'}
                </button>
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-0.5">{t('system_uptime')}</span>
                    <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-tighter">99.999%_{t('stable')}</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <UserIcon className="w-5 h-5 text-white/40" />
                </div>
            </div>
        </header>
    );
};
