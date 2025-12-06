import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';

interface Props {
  userName: string;
  onNext: (question: string) => void;
}

export const StepQuestion: React.FC<Props> = ({ userName, onNext }) => {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!question.trim()) {
      setError('DATOS INSUFICIENTES. FORMULE CONSULTA.');
      return;
    }
    onNext(question.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl relative z-10">

      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-cyber-gold blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyber-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
          <img
            src="https://i.imgur.com/Xe07mrz.jpeg"
            alt="General"
            className="w-full h-full object-cover grayscale contrast-125 sepia hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 w-full h-1 bg-cyber-gold animate-pulse" />
        </div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-zen uppercase text-white mb-2 text-center"
      >
        Compañero/a <span className="text-cyber-gold">{userName}</span>
      </motion.h2>

      <p className="text-hologram-blue font-oswald tracking-widest uppercase mb-10 text-sm md:text-base opacity-80">
        El oráculo del pueblo escucha.
      </p>

      <div className="w-full max-w-2xl relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-gold to-neon-red rounded-2xl blur opacity-20 pointer-events-none" />
        <div className="relative bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/5">
            <MessageSquare className="w-4 h-4 text-cyber-gold" />
            <span className="text-xs font-oswald uppercase text-slate-400">Terminal de Entrada</span>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-40 bg-transparent text-white p-6 text-xl md:text-2xl font-oswald uppercase focus:outline-none resize-none placeholder-slate-600 leading-relaxed custom-scrollbar"
            placeholder="Concentre su espíritu y formule con claridad su consulta."
          />
          <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-cyber-gold animate-pulse delay-75" />
            <span className="w-2 h-2 rounded-full bg-hologram-blue animate-pulse delay-150" />
          </div>
        </div>
      </div>

      <div className="h-8 mt-4 mb-4">
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neon-red font-mono text-sm tracking-tighter"
          >
            ⚠ {error}
          </motion.p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="group relative px-10 py-4 bg-cyber-gold/10 hover:bg-cyber-gold/20 border border-cyber-gold/50 hover:border-cyber-gold transition-all duration-300 rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyber-gold/10 blur-xl"></div>
        <span className="relative flex items-center gap-3 text-cyber-gold font-zen uppercase tracking-wider text-lg">
          Consultar el oráculo <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

    </div>
  );
};