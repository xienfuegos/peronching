import React, { useState, useEffect } from 'react';
import { HexagramVisual } from './HexagramVisual';
import { motion } from 'framer-motion';

interface Props {
  onComplete: (lines: number[]) => void;
}

// Internal component for a single 3D Coin
const Coin3D = ({ animating, delay }: { animating: boolean; delay: string }) => {
  return (
    <div
      className={`relative w-32 h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 aspect-square flex-shrink-0 transition-transform duration-1000 transform-style-3d cursor-pointer ${animating ? 'animate-coin-toss' : 'hover:scale-105'}`}
      style={{
        animationDelay: delay,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Coin Face Front */}
      <div className="absolute inset-0 rounded-full border-[2px] border-[#B8860B] flex items-center justify-center backface-hidden shadow-xl overflow-hidden bg-black">
        {/* Generated Texture */}
        <img src="/coin_texture.png" alt="Moneda" className="absolute inset-0 w-full h-full object-cover" />

        {/* Shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-black/20 pointer-events-none z-30" />
      </div>

      {/* Coin Face Back (Tails) - Same Image as requested */}
      <div
        className="absolute inset-0 rounded-full border-[2px] border-[#B8860B] flex items-center justify-center backface-hidden shadow-xl overflow-hidden bg-black"
        style={{ transform: 'rotateY(180deg)' }}
      >
        {/* Generated Texture */}
        <img src="/coin_texture.png" alt="Moneda" className="absolute inset-0 w-full h-full object-cover" />

        {/* Shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-black/20 pointer-events-none z-30" />
      </div>
    </div>
  );
};

export const StepCoinToss: React.FC<Props> = ({ onComplete }) => {
  const [currentLines, setCurrentLines] = useState<number[]>([]);
  const [tossCount, setTossCount] = useState(0);
  const [isTossing, setIsTossing] = useState(false);

  // Intro text randomization
  const comments = ["EL MOMENTO DE LA VERDAD", "LA SUERTE ESTÁ ECHADA", "CONSULTANDO AL ORÁCULO"];
  const [introText] = useState(comments[Math.floor(Math.random() * comments.length)]);

  const handleToss = () => {
    if (tossCount >= 6 || isTossing) return;

    // Audio removed as requested
    setIsTossing(true);

    setTimeout(() => {
      // I Ching Logic: 3 coins. Heads (3) vs Tails (2).
      const coin1 = Math.random() < 0.5 ? 2 : 3;
      const coin2 = Math.random() < 0.5 ? 2 : 3;
      const coin3 = Math.random() < 0.5 ? 2 : 3;
      const sum = coin1 + coin2 + coin3;

      const newLines = [...currentLines, sum];
      setCurrentLines(newLines);
      setTossCount(prev => prev + 1);

      setIsTossing(false);

      if (newLines.length === 6) {
        setTimeout(() => onComplete(newLines), 1500); // Longer delay to see full hexagram
      }

    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full relative z-10 p-4 min-h-[80vh]">
      <style>{`
          .transform-style-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          @keyframes coinToss {
            0% { transform: translateY(0) rotateX(0); }
            50% { transform: translateY(-200px) rotateX(720deg) scale(1.2); }
            100% { transform: translateY(0) rotateX(1440deg) scale(1); }
          }
          .animate-coin-toss { animation: coinToss 1.2s cubic-bezier(0.4, 0.0, 0.2, 1); }
        `}</style>

      {/* Dynamic Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none z-0 animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <h2 className="text-2xl md:text-4xl font-zen text-white mb-2 uppercase tracking-wide text-shadow-neon">{introText}</h2>
        <p className="text-hologram-blue font-oswald uppercase text-sm md:text-base tracking-widest opacity-80">
          PROGRESO: {Math.round((tossCount / 6) * 100)}%
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-1 bg-white/10 rounded-full mb-12 overflow-hidden relative z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-red to-cyber-gold shadow-[0_0_10px_rgba(255,42,109,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${(tossCount / 6) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl items-center justify-items-center relative z-10">

        {/* Left: Coins */}
        <div className="flex flex-col items-center order-2 lg:order-1 w-full">
          <div
            onClick={handleToss}
            className={`flex justify-center items-center gap-4 md:gap-8 perspective-1000 mb-8 w-full ${tossCount >= 6 ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:scale-105 transition-transform'}`}
          >
            <Coin3D animating={isTossing} delay="0s" />
            <Coin3D animating={isTossing} delay="0.05s" />
            <Coin3D animating={isTossing} delay="0.1s" />
          </div>
          <div className="text-white/50 text-xs md:text-sm font-oswald uppercase tracking-[0.2em] animate-pulse">
            [ TOQUE LAS MONEDAS PARA LANZAR ]
          </div>
        </div>

        {/* Right: Hexagram */}
        <div className="flex flex-col items-center justify-center order-1 lg:order-2 w-full">
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-sm flex flex-col items-center justify-center min-h-[320px]">
            <h3 className="text-cyber-gold font-zen mb-6 text-xl uppercase tracking-widest border-b border-cyber-gold/30 pb-2 w-full text-center">
              HEXAGRAMA
            </h3>

            <div className="w-full flex justify-center py-4">
              <HexagramVisual lines={currentLines} />
            </div>

            <div className="mt-4 h-6">
              {currentLines.length < 6 ? (
                <p className="text-slate-500 font-oswald text-xs uppercase tracking-widest animate-pulse text-center">
                  Generando línea {currentLines.length + 1}...
                </p>
              ) : (
                <p className="text-neon-red font-oswald text-xs uppercase tracking-widest text-center">
                  COMPLETADO
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};