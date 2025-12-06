import React from 'react';

export const HexagramVisual = ({ lines }: { lines: number[] }) => {
  // Lines build up from bottom (index 0) to top (index 5).
  // In visual stack (flex-col), top comes first.
  // So we need [Line 6... Line 1].
  // If we have 2 lines [L1, L2], we need [P, P, P, P, L2, L1].

  const totalSlots = 6;
  // Create full array of 6 items, filling from bottom up with real data
  const visualStack = [];

  for (let i = totalSlots - 1; i >= 0; i--) {
    if (i < lines.length) {
      visualStack.push(lines[i]); // Real line
    } else {
      visualStack.push(null); // Placeholder
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center p-4">
      {visualStack.map((val, idx) => {
        const isPlaceholder = val === null;

        if (isPlaceholder) {
          return (
            <div key={`p-${idx}`} className="w-full max-w-[200px] h-4 bg-white/5 border border-white/10 rounded-sm relative">
              {/* Subtle guide line */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/5"></div>
            </div>
          );
        }

        // Logic for Yin/Yang
        // Odd (7,9) = Yang (Solid)
        // Even (6,8) = Yin (Broken)
        const isYang = (val === 7 || val === 9);
        const isMoving = (val === 6 || val === 9);

        return (
          <div key={`l-${idx}`} className="w-full max-w-[200px] h-4 flex justify-between relative group">
            {/* Glow effect */}
            <div className={`absolute -inset-2 bg-neon-red/20 blur-xl rounded-full opacity-0 transition-opacity duration-500 ${isMoving ? 'animate-pulse opacity-100' : 'opacity-50'}`} />

            {isYang ? (
              // Solid Line (Yang)
              <div className="z-10 w-full h-full bg-neon-red shadow-[0_0_15px_rgba(255,42,109,0.8)] rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
              </div>
            ) : (
              // Broken Line (Yin)
              <>
                <div className="z-10 w-[42%] h-full bg-neon-red shadow-[0_0_15px_rgba(255,42,109,0.8)] rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="z-10 w-[42%] h-full bg-neon-red shadow-[0_0_15px_rgba(255,42,109,0.8)] rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TrigramVisual = ({ lines }: { lines: number[] }) => {
  // Trigrams are static, usually top to bottom rendering of 3 lines
  const displayLines = [...lines].reverse();
  return (
    <div className="flex flex-col gap-1 w-16 mx-auto">
      {displayLines.map((val, idx) => {
        const isYang = (val === 7 || val === 9);
        return (
          <div key={idx} className="w-full h-2 flex justify-between">
            {isYang ? (
              <div className="w-full h-full bg-neon-red shadow-[0_0_8px_rgba(255,42,109,0.8)] rounded-sm" />
            ) : (
              <>
                <div className="w-[45%] h-full bg-neon-red shadow-[0_0_8px_rgba(255,42,109,0.8)] rounded-sm" />
                <div className="w-[45%] h-full bg-neon-red shadow-[0_0_8px_rgba(255,42,109,0.8)] rounded-sm" />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}