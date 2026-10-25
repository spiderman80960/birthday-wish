/* Interactive Birthday Cake with Candles & Chocolate Frosting */

import { useState } from "react";
import { Sparkles, Flame, RotateCcw, Heart, Gift } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playBlowSound, playBirthdayMelody, playSparkleStrum } from "@/lib/audio";

interface CakeProps {
  onBlown?: () => void;
}

export function CakeCandles({ onBlown }: CakeProps) {
  const [blown, setBlown] = useState(false);
  const [blowCount, setBlowCount] = useState(0);

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    setBlowCount((c) => c + 1);
    playBlowSound();

    setTimeout(() => {
      playBirthdayMelody();
      launchConfetti({
        particleCount: 110,
        spread: 95,
        origin: { x: 0.5, y: 0.5 },
        shapes: ["star", "heart", "circle"],
        colors: ["#7952e8", "#9667ff", "#d9ccff", "#f7b4c6", "#fedc77", "#ffffff"],
      });
      if (onBlown) onBlown();
    }, 400);
  };

  const handleRelight = () => {
    setBlown(false);
    playSparkleStrum();
  };

  return (
    <div className="cake-interactive-box flex flex-col items-center justify-center p-6 bg-[#fffdfb] border-2 border-[#1d1238] shadow-[8px_10px_0_rgba(121,82,232,0.2)] rounded-xl relative overflow-hidden">
      {/* Decorative tag */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#7952e8] bg-[#ede4ff] px-2.5 py-1 rounded-full border border-[#7952e8]/20">
        <Sparkles size={11} /> Birthday Special
      </div>

      <div className="cake-stage relative w-64 h-52 flex flex-col items-center justify-end my-4 select-none">
        {/* Flames & Candles */}
        <div className="candles-row flex gap-6 z-20 mb-[-4px]">
          {[1, 2, 3].map((candleIndex) => (
            <div key={candleIndex} className="candle-item relative flex flex-col items-center">
              {/* Flame */}
              {!blown ? (
                <div
                  className="flame-glow animate-bounce"
                  style={{ animationDuration: `${0.75 + candleIndex * 0.2}s` }}
                >
                  <Flame
                    size={24}
                    className="text-amber-400 fill-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.95)]"
                  />
                </div>
              ) : (
                <div className="smoke-puff text-xs opacity-70 text-purple-300 animate-pulse">
                  💨
                </div>
              )}
              {/* Candle Stick */}
              <div
                className="w-3.5 h-10 rounded-t-sm shadow-inner"
                style={{
                  background:
                    candleIndex === 2
                      ? "repeating-linear-gradient(45deg, #7952e8, #7952e8 4px, #f7b4c6 4px, #f7b4c6 8px)"
                      : "repeating-linear-gradient(45deg, #fedc77, #fedc77 4px, #7952e8 4px, #7952e8 8px)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Cake Tier (Dreamy Lilac Cream & Choco Drip) */}
        <div className="relative w-44 h-16 bg-[#d9ccff] border-2 border-[#1d1238] rounded-t-xl shadow-md z-10 flex items-center justify-center overflow-hidden">
          {/* Chocolate Drips */}
          <div className="absolute top-0 inset-x-0 h-4 bg-[#35180c] flex justify-around">
            <div className="w-4 h-6 bg-[#35180c] rounded-b-full shadow" />
            <div className="w-3 h-4 bg-[#35180c] rounded-b-full shadow" />
            <div className="w-5 h-7 bg-[#35180c] rounded-b-full shadow" />
            <div className="w-3 h-5 bg-[#35180c] rounded-b-full shadow" />
            <div className="w-4 h-6 bg-[#35180c] rounded-b-full shadow" />
          </div>
          {/* Sprinkles */}
          <span className="text-[10px] font-extrabold tracking-widest text-[#391757] mt-3 font-['Fraunces']">
            ✦ MAKE A WISH ✦
          </span>
        </div>

        {/* Bottom Cake Tier (Rich Dark Chocolate & Purple Glaze) */}
        <div className="relative w-56 h-20 bg-[#4a2e22] border-2 border-[#1d1238] rounded-t-2xl shadow-lg z-10 flex flex-col items-center justify-center -mt-1">
          {/* Purple Icing Swirls */}
          <div className="absolute top-0 inset-x-0 h-3.5 bg-[#7952e8] flex justify-around">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-6 h-4 bg-[#7952e8] rounded-b-full border-b border-[#1d1238]/30" />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#fedc77] font-['Fraunces'] italic mt-2 font-semibold">
            <Heart size={12} fill="currentColor" /> happy birthday <Heart size={12} fill="currentColor" />
          </div>
        </div>

        {/* Cake Stand / Plate */}
        <div className="w-64 h-4 bg-[#ede4ff] border-2 border-[#1d1238] rounded-full shadow-md -mt-1" />
        <div className="w-24 h-4 bg-[#d0beff] border-2 border-[#1d1238] -mt-1 rounded-b-md" />
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center gap-2 mt-2">
        {!blown ? (
          <button
            type="button"
            onClick={handleBlow}
            className="px-5 py-2.5 bg-[#7952e8] hover:bg-[#673ee0] text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-[4px_4px_0_#1d1238] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1d1238] transition-all flex items-center gap-2"
          >
            <Flame size={15} className="text-amber-300 fill-amber-300" /> Make a wish & blow candles!
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 text-sm font-['Fraunces'] text-[#7952e8] dark:text-[#fedc77] font-bold">
              <Gift size={16} /> Wish granted! Happy Birthday!
            </div>
            <button
              type="button"
              onClick={handleRelight}
              className="text-[10px] uppercase font-bold text-[#726284] dark:text-[#c9b8e8] hover:text-[#7952e8] dark:hover:text-[#fedc77] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> Relight the candles
            </button>
          </div>
        )}
      </div>

      {blowCount > 0 && blown && (
        <p className="mt-3 text-xs text-center font-['Fraunces'] italic text-[#391757] dark:text-[#ede4ff]">
          “May this year bring you endless laughter, warmth, and all the chocolate you desire!”
        </p>
      )}
    </div>
  );
}
