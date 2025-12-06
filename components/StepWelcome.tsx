import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Activity } from 'lucide-react';

interface Props {
  onNext: (name: string) => void;
}

export const StepWelcome: React.FC<Props> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('IDENTIFICACIÓN REQUERIDA');
      return;
    }
    onNext(name.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-16 relative">
      {/* Holographic Circle */}
      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-neon-red blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full animate-pulse-glow" />
        <div className="w-32 h-32 relative border-2 border-neon-red/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,42,109,0.3)] bg-black/40 backdrop-blur-sm">
          <Zap className="w-16 h-16 text-neon-red animate-pulse" />
        </div>
        <div className="absolute -inset-4 border border-dashed border-hologram-blue/30 rounded-full animate-spin-slow w-40 h-40" />
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-zen uppercase text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center leading-tight">
        PERON <span className="text-neon-red drop-shadow-[0_0_15px_rgba(255,42,109,0.8)]">CHING</span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl md:text-2xl text-hologram-blue mb-12 font-oswald tracking-[0.2em] uppercase text-shadow-neon text-center"
      >
        Sistema de Predicción Justicialista v4.0
      </motion.p>

      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-red to-hologram-blue rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="relative w-full bg-black border border-white/10 text-white text-center text-xl p-4 rounded-lg focus:outline-none focus:border-hologram-blue focus:ring-1 focus:ring-hologram-blue placeholder-white/20 font-zen uppercase tracking-widest transition-all"
          placeholder="SU NOMBRE COMPAÑERA/O"
          autoFocus
        />
      </div>

      <div className="h-8 mt-2 mb-4">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-neon-red font-mono text-sm flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleSubmit}
        className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none skew-x-[-10deg] border border-neon-red/50 hover:border-neon-red transition-colors"
      >
        <div className="absolute inset-0 w-3 bg-neon-red transition-all duration-[250ms] ease-out group-hover:w-full opacity-10 group-hover:opacity-100" />
        <span className="relative flex items-center gap-3 text-neon-red group-hover:text-white font-zen uppercase tracking-widest text-lg skew-x-[10deg]">
          CONSULTAR EL ORÁCULO DEL PUEBLO <ArrowRight className="w-5 h-5" />
        </span>
      </button>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

// Start the Imports for AnimatePresence as it's used in the component
import { AnimatePresence } from 'framer-motion';