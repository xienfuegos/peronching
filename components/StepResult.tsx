import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { HexagramData } from '../types';
import { TrigramVisual } from './HexagramVisual';
import { TRIGRAMS_DATA } from '../constants';
import { getPeronMessage, getEvitaMessage } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RefreshCw, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    userName: string;
    userQuestion: string;
    hexagram: HexagramData;
    lines: number[]; // Bottom to top
    onRestart: () => void;
    onHome: () => void;
}

type ShareType = 'peron' | 'evita';

export const StepResult: React.FC<Props> = ({ userName, userQuestion, hexagram, lines, onRestart, onHome }) => {
    const [peronMessage, setPeronMessage] = useState<string>('');
    const [peronLoading, setPeronLoading] = useState(false);

    const [evitaMessage, setEvitaMessage] = useState<string>('');
    const [evitaLoading, setEvitaLoading] = useState(false);

    const [sharing, setSharing] = useState<ShareType | null>(null);
    const shareRef = useRef<HTMLDivElement>(null);

    // Constants
    const lowerLines = lines.slice(0, 3);
    const upperLines = lines.slice(3, 6);
    const toBin = (vals: number[]) => vals.map(v => (v === 7 || v === 9) ? '1' : '0').reverse().join('');
    const lowerTrigram = TRIGRAMS_DATA[toBin(lowerLines)] || { name: '?', description: '' };
    const upperTrigram = TRIGRAMS_DATA[toBin(upperLines)] || { name: '?', description: '' };

    // Handlers
    const handlePeronAsk = async () => {
        setPeronLoading(true);
        const msg = await getPeronMessage(userName, userQuestion, hexagram.title, hexagram.fullText);
        setPeronMessage(msg);
        setPeronLoading(false);
    };

    const handleEvitaAsk = async () => {
        setEvitaLoading(true);
        const msg = await getEvitaMessage(userName, userQuestion, hexagram.title, hexagram.dictamen);
        setEvitaMessage(msg);
        setEvitaLoading(false);
    };

    const prepareAndShare = async (type: ShareType) => {
        setSharing(type);
        setTimeout(async () => {
            if (!shareRef.current) return;
            try {
                const canvas = await html2canvas(shareRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#050505',
                    scale: 2
                });
                const image = canvas.toDataURL("image/png", 1.0);
                const link = document.createElement('a');
                link.href = image;
                link.download = `ORACULO-${type.toUpperCase()}-${Date.now()}.png`;
                link.click();
            } catch (e) {
                console.error("Share error", e);
            } finally {
                setSharing(null);
            }
        }, 500);
    };

    return (
        <div className="w-full max-w-5xl mx-auto relative z-10 px-4 py-8 flex flex-col items-center">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-[0_0_50px_rgba(5,217,232,0.05)]"
            >
                {/* HEADLINE: COMPAÑERO/A [NOMBRE] */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-5xl font-zen font-bold text-white mb-2 text-shadow-neon break-words">
                        Compañero/a <span className="text-cyber-gold block md:inline">{userName},</span>
                    </h1>
                    <h2 className="text-lg md:text-2xl font-oswald font-bold text-neon-red tracking-widest uppercase">
                        Hexagrama N° {hexagram.id}
                    </h2>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-cyber-gold/50 to-transparent my-8"></div>

                {/* TWO COLUMNS: TRIGRAMS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-xl md:text-2xl font-bold font-serif text-hologram-blue mb-4">Arriba: {upperTrigram.name}</h3>
                        <div className="scale-125 md:scale-150 mb-6 origin-center">
                            <TrigramVisual lines={upperLines} />
                        </div>
                        <p className="text-slate-300 italic font-serif leading-relaxed text-sm md:text-base px-2">
                            "{upperTrigram.description}"
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-xl md:text-2xl font-bold font-serif text-hologram-blue mb-4">Abajo: {lowerTrigram.name}</h3>
                        <div className="scale-125 md:scale-150 mb-6 origin-center">
                            <TrigramVisual lines={lowerLines} />
                        </div>
                        <p className="text-slate-300 italic font-serif leading-relaxed text-sm md:text-base px-2">
                            "{lowerTrigram.description}"
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-cyber-gold/50 to-transparent my-12"></div>

                {/* HEXAGRAM CENTERED TITLE */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-cyber-gold mb-8 drop-shadow-md">
                        {hexagram.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-white font-serif italic mb-10 opacity-90">
                        "{hexagram.dictamen}"
                    </p>

                    <div className="text-left bg-black/40 p-10 rounded-2xl border-l-4 border-cyber-gold shadow-lg backdrop-blur-sm">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">El Dictamen</h4>
                        <p className="text-slate-200 text-lg md:text-xl leading-loose font-serif">
                            {hexagram.fullText}
                        </p>
                    </div>
                </div>

                {/* ACTIONS & PORTRAITS */}
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16 mt-16 w-full max-w-5xl px-4">

                    {/* PERÓN COLUMN */}
                    <div className="flex-1 flex flex-col items-center gap-6">
                        {/* PORTRAIT */}
                        <div className="relative group w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-indigo-600/50 shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-transform duration-500 hover:scale-105">
                            <img
                                src="https://i.imgur.com/Xe07mrz.jpeg"
                                alt="General Perón"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handlePeronAsk}
                            disabled={peronLoading || peronMessage !== ''}
                            className={`w-full max-w-sm group relative px-6 py-6 bg-indigo-900/40 border border-indigo-500/50 rounded-xl overflow-hidden hover:bg-indigo-900/60 transition-all ${peronMessage ? 'opacity-50 cursor-default' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="flex flex-col items-center justify-center gap-3 relative z-10 text-center">
                                <span className="text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">✌️</span>
                                <span className="font-zen text-white uppercase tracking-widest text-sm md:text-base text-shadow-neon leading-relaxed block w-full">
                                    Interpretación<br />de Perón
                                </span>
                            </div>
                            {peronLoading && <div className="absolute inset-0 bg-indigo-900/90 flex items-center justify-center z-20"><span className="animate-spin text-2xl">⏳</span></div>}
                        </button>
                    </div>

                    {/* EVITA COLUMN */}
                    <div className="flex-1 flex flex-col items-center gap-6">
                        {/* PORTRAIT */}
                        <div className="relative group w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-pink-600/50 shadow-[0_0_30px_rgba(219,39,119,0.3)] transition-transform duration-500 hover:scale-105">
                            <img
                                src="https://imgur.com/XaqPW1r.png"
                                alt="Evita"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-pink-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleEvitaAsk}
                            disabled={evitaLoading || evitaMessage !== ''}
                            className={`w-full max-w-sm group relative px-6 py-6 bg-pink-900/40 border border-pink-500/50 rounded-xl overflow-hidden hover:bg-pink-900/60 transition-all ${evitaMessage ? 'opacity-50 cursor-default' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="flex flex-col items-center justify-center gap-3 relative z-10 text-center">
                                <span className="text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">🌹</span>
                                <span className="font-zen text-white uppercase tracking-widest text-sm md:text-base text-shadow-neon leading-relaxed block w-full">
                                    Interpretación<br />de Evita
                                </span>
                            </div>
                            {evitaLoading && <div className="absolute inset-0 bg-pink-900/90 flex items-center justify-center z-20"><span className="animate-spin text-2xl">⏳</span></div>}
                        </button>
                    </div>

                </div>

                {/* AI MESSAGE DISPLAY */}
                {/* AI MESSAGES DISPLAY */}
                <div className="w-full flex flex-col gap-6">
                    <AnimatePresence>
                        {peronMessage && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full overflow-hidden">
                                <div className="glass-card bg-[#e0efff] border-l-8 border-indigo-600 p-6 md:p-8 rounded-r-xl shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-indigo-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md">
                                                <img src="https://i.imgur.com/Xe07mrz.jpeg" className="w-full h-full object-cover" alt="Peron" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-bold text-indigo-900 text-xl md:text-3xl leading-none">El General Responde:</h3>
                                                <p className="text-indigo-600 text-sm uppercase font-oswald tracking-widest">Conducción Estratégica</p>
                                            </div>
                                        </div>
                                        <button onClick={() => prepareAndShare('peron')} className="text-indigo-500 hover:text-indigo-800 transition-colors p-2"><Share2 className="w-6 h-6" /></button>
                                    </div>
                                    <div className="text-slate-800 text-lg md:text-xl leading-relaxed font-serif text-justify markdown-content px-2">
                                        <ReactMarkdown components={{
                                            strong: ({ node, ...props }) => <strong className="font-bold text-indigo-900" {...props} />
                                        }}>{peronMessage}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {evitaMessage && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full overflow-hidden">
                                <div className="glass-card bg-[#fff0f3] border-l-8 border-pink-600 p-6 md:p-8 rounded-r-xl shadow-[0_0_30px_rgba(219,39,119,0.3)]">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-pink-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-600 shadow-md">
                                                <img src="https://imgur.com/XaqPW1r.png" className="w-full h-full object-cover" alt="Evita" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-bold text-pink-900 text-xl md:text-3xl leading-none">Evita Responde:</h3>
                                                <p className="text-pink-600 text-sm uppercase font-oswald tracking-widest">Justicia Social</p>
                                            </div>
                                        </div>
                                        <button onClick={() => prepareAndShare('evita')} className="text-pink-500 hover:text-pink-800 transition-colors p-2"><Share2 className="w-6 h-6" /></button>
                                    </div>
                                    <div className="text-slate-800 text-lg md:text-xl leading-relaxed font-serif text-justify markdown-content px-2">
                                        <ReactMarkdown components={{
                                            strong: ({ node, ...props }) => <strong className="font-bold text-pink-900" {...props} />
                                        }}>{evitaMessage}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* NAVIGATION BUTTONS */}
                <div className="flex justify-center gap-8 pt-8 border-t border-white/10 w-full">
                    <button onClick={onRestart} className="flex flex-col items-center gap-2 group">
                        <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <RefreshCw className="text-cyber-gold w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                        <span className="text-xs font-oswald uppercase text-slate-400 group-hover:text-white">Nueva Consulta</span>
                    </button>
                    <button onClick={onHome} className="flex flex-col items-center gap-2 group">
                        <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <Home className="text-hologram-blue w-6 h-6" />
                        </div>
                        <span className="text-xs font-oswald uppercase text-slate-400 group-hover:text-white">Inicio</span>
                    </button>
                </div>

            </motion.div>

            {/* HIDDEN SHARE TEMPLATE */}
            {sharing && (
                <div ref={shareRef} className="absolute top-full left-0 w-[800px] bg-void-black p-12 text-white">
                    <div className="border border-white/20 p-10 rounded-3xl relative overflow-hidden bg-[#f0f4f8] text-slate-900">
                        {/* Header */}
                        <div className="text-center mb-8 border-b border-slate-300 pb-6">
                            <h2 className="text-4xl font-zen font-bold text-slate-900 mb-2">Compañero/a {userName}</h2>
                            <p className="text-xl font-oswald font-bold text-slate-600 uppercase tracking-widest">Hexagrama N° {hexagram.id}: {hexagram.title}</p>
                        </div>

                        {/* Trigrams Visual */}
                        <div className="flex justify-center gap-12 mb-8 opacity-80">
                            <div className="text-center">
                                <p className="mb-2 font-bold text-slate-700">{upperTrigram.name}</p>
                                <div className="scale-125 filter invert contrast-125">
                                    <TrigramVisual lines={upperLines} />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="mb-2 font-bold text-slate-700">{lowerTrigram.name}</p>
                                <div className="scale-125 filter invert contrast-125">
                                    <TrigramVisual lines={lowerLines} />
                                </div>
                            </div>
                        </div>

                        {/* AI Message */}
                        <div className={`p-8 rounded-2xl border-l-8 ${sharing === 'peron' ? 'border-indigo-600 bg-indigo-50' : 'border-rose-600 bg-rose-50'}`}>
                            <div className="flex items-center gap-4 mb-4">
                                {sharing === 'peron' ? (
                                    <div className="text-indigo-900 font-bold text-2xl font-serif">El General Responde:</div>
                                ) : (
                                    <div className="text-rose-900 font-bold text-2xl font-serif">Evita Responde:</div>
                                )}
                            </div>
                            <div className="text-slate-800 text-lg leading-relaxed font-serif text-justify markdown-content">
                                <ReactMarkdown>{sharing === 'peron' ? peronMessage : evitaMessage}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="mt-8 text-center opacity-40 font-oswald text-sm uppercase tracking-[0.3em] text-slate-500">
                            ORÁCULO DEL PUEBLO - {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};