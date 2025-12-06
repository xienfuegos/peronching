import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StepWelcome } from './components/StepWelcome';
import { StepQuestion } from './components/StepQuestion';
import { StepCoinToss } from './components/StepCoinToss';
import { StepResult } from './components/StepResult';
import { YouTubeAudio } from './components/YouTubeAudio';
import { HexagramData } from './types';
import { HEXAGRAMS_MAP } from './constants';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [lines, setLines] = useState<number[]>([]);
  const [currentHexagram, setCurrentHexagram] = useState<HexagramData | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setStep(2);
  };

  const handleQuestionSubmit = (question: string) => {
    setUserQuestion(question);
    setStep(3);
  };

  const handleHexagramComplete = (finalLines: number[]) => {
    setLines(finalLines);

    // Convert lines to binary string (bottom to top)
    const binaryString = finalLines.map(val => (val === 7 || val === 9) ? '1' : '0').reverse().join('');

    const hexagram = HEXAGRAMS_MAP[binaryString] || {
      id: 0,
      title: "El Misterio",
      binary: binaryString,
      dictamen: "El destino es inescrutable.",
      imagen: "Niebla sobre el río.",
      fullText: "La combinación obtenida no figura en los registros canónicos. Medite sobre su pregunta."
    };

    setCurrentHexagram(hexagram);

    // Add a small delay for dramatic effect before showing result
    setTimeout(() => {
      setStep(4);
      setIsPlayingAudio(true);
    }, 1500);
  };

  const handleRestart = () => {
    setStep(2); // Go back to question
    setUserQuestion('');
    setLines([]);
    setCurrentHexagram(null);
    setIsPlayingAudio(false);
  };

  const handleHome = () => {
    setStep(1);
    setUserName('');
    setUserQuestion('');
    setLines([]);
    setCurrentHexagram(null);
    setIsPlayingAudio(false);
  };

  return (
    <div className="min-h-screen bg-void-black text-white relative overflow-hidden font-oswald selection:bg-neon-red selection:text-white">

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-midnight-blue via-void-black to-void-black z-0 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-red/10 rounded-full blur-[128px] animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-hologram-blue/10 rounded-full blur-[128px] animate-pulse-glow delay-1000 pointer-events-none" />

      {/* Audio Player */}
      <YouTubeAudio isPlaying={isPlayingAudio} />

      {/* Floating Mute Button */}
      <button
        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors group"
      >
        {isPlayingAudio ? (
          <div className="flex gap-1 items-end h-4 w-4 justify-center">
            <span className="w-1 bg-neon-red h-full animate-[bounce_1s_infinite]" />
            <span className="w-1 bg-neon-red h-2/3 animate-[bounce_1.2s_infinite]" />
            <span className="w-1 bg-neon-red h-full animate-[bounce_0.8s_infinite]" />
          </div>
        ) : (
          <div className="w-4 h-4 border-2 border-slate-500 rounded-full flex items-center justify-center">
            <div className="w-px h-full bg-slate-500 rotate-45 transform scale-150" />
          </div>
        )}
      </button>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-12 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-6xl flex justify-center perspective-1000"
          >

            {step === 1 && <StepWelcome onNext={handleNameSubmit} />}

            {step === 2 && (
              <StepQuestion
                userName={userName}
                onNext={handleQuestionSubmit}
              />
            )}

            {step === 3 && (
              <StepCoinToss
                onComplete={handleHexagramComplete}
              />
            )}

            {step === 4 && currentHexagram && (
              <StepResult
                userName={userName}
                userQuestion={userQuestion}
                hexagram={currentHexagram}
                lines={lines}
                onRestart={handleRestart}
                onHome={handleHome}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}