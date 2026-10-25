/* Full-Screen Floating Balloons Animation with strings and pop interactions */

import { useEffect, useState } from "react";
import { launchConfetti } from "@/lib/confetti";
import { playPopSound } from "@/lib/audio";

export interface BalloonItem {
  id: number;
  color: string;
  leftPercent: number;
  size: number;
  speedSec: number;
  delaySec: number;
  swaySec: number;
  popped: boolean;
}

const BALLOON_COLORS = [
  "#7952e8", // Vivid purple
  "#9667ff", // Light purple
  "#d9ccff", // Soft lilac
  "#f7b4c6", // Pastel rose
  "#fedc77", // Gold
  "#6032c9", // Deep violet
  "#b085ff", // Amethyst
];

export function FloatingBalloons({ count = 12 }: { count?: number }) {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  useEffect(() => {
    const items: BalloonItem[] = Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
      leftPercent: 5 + Math.random() * 88, // between 5% and 93% width
      size: 44 + Math.random() * 26, // 44px to 70px
      speedSec: 9 + Math.random() * 7, // 9s to 16s float duration
      delaySec: Math.random() * 4, // 0 to 4s stagger
      swaySec: 2.5 + Math.random() * 2, // side to side sway duration
      popped: false,
    }));
    setBalloons(items);
  }, [count]);

  const handlePop = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    playPopSound();
    launchConfetti({
      particleCount: 35,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      shapes: ["circle", "heart", "star"],
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {balloons.map((b) => {
        if (b.popped) return null;
        return (
          <div
            key={b.id}
            className="absolute bottom-[-120px] pointer-events-auto cursor-pointer group hover:scale-110 transition-transform select-none"
            style={{
              left: `${b.leftPercent}%`,
              animation: `floatUp ${b.speedSec}s linear infinite`,
              animationDelay: `${b.delaySec}s`,
            }}
            onClick={(e) => handlePop(b.id, e)}
            title="Pop me!"
          >
            {/* Balloon Body with sway */}
            <div
              className="relative flex flex-col items-center"
              style={{
                animation: `balloonSway ${b.swaySec}s ease-in-out infinite alternate`,
              }}
            >
              {/* Balloon Egg Shape */}
              <div
                className="rounded-[50%_50%_50%_50%_/_42%_42%_58%_58%] shadow-lg border border-[#1d1238]/15 relative overflow-hidden flex items-center justify-center transition-all group-hover:brightness-110"
                style={{
                  width: `${b.size}px`,
                  height: `${b.size * 1.22}px`,
                  backgroundColor: b.color,
                  boxShadow: `0 8px 20px ${b.color}55, inset -4px -6px 10px rgba(0,0,0,0.18)`,
                }}
              >
                {/* Gloss highlight */}
                <div className="absolute top-2 left-2.5 w-2.5 h-5 bg-white/50 rounded-full rotate-[-35deg] blur-[0.4px]" />
                {/* Cute sparkle inside */}
                <span className="text-[10px] text-white/80 font-['Fraunces'] opacity-60">✦</span>
              </div>

              {/* Knot */}
              <div
                className="w-2.5 h-2 rounded-full -mt-0.5 shadow-xs"
                style={{ backgroundColor: b.color }}
              />

              {/* String */}
              <div className="w-[1px] h-14 bg-[#726284]/40" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
