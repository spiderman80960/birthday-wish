/* Interactive 3D Celestial Gyroscope & Starlight Sphere */

import { useState, useRef, useEffect } from "react";
import { Sparkles, Moon, Sun, Heart, Zap } from "lucide-react";
import { playSparkleStrum, playPopSound } from "@/lib/audio";

interface CosmicSphere3DProps {
  isComplete?: boolean;
}

export function CosmicSphere3D({ isComplete = false }: CosmicSphere3DProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt angles (-18deg to +18deg)
    const rotateY = ((x - centerX) / centerX) * 18;
    const rotateX = -((y - centerY) / centerY) * 18;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handlePulse = () => {
    setPulsing(true);
    setPulseCount((c) => c + 1);
    playSparkleStrum();
    setTimeout(() => setPulsing(false), 700);
  };

  return (
    <div className="mt-7 cute-card p-5 relative overflow-hidden select-none">
      <span className="tape-strip left-tape" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs font-bold" style={{ color: "var(--plum)" }}>
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Celestial Memory Orb</span>
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
          style={{
            background: isComplete ? "rgba(245, 184, 78, 0.25)" : "rgba(139, 92, 246, 0.12)",
            color: isComplete ? "var(--butter-deep)" : "var(--purple-deep)",
            border: `1px solid ${isComplete ? "var(--butter)" : "var(--line)"}`
          }}>
          {isComplete ? "Supernova Active ✨" : "3D Cosmic Core"}
        </span>
      </div>

      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handlePulse}
        className="w-full h-56 rounded-2xl relative flex items-center justify-center cursor-pointer transition-colors duration-500"
        style={{
          perspective: "1000px",
          background: isComplete
            ? "radial-gradient(circle at 50% 50%, #2e1065 0%, #150630 100%)"
            : "radial-gradient(circle at 50% 50%, #1e0d3d 0%, #0d041a 100%)",
          boxShadow: isComplete
            ? "inset 0 0 40px rgba(245, 184, 78, 0.25), 0 8px 24px rgba(109, 40, 217, 0.15)"
            : "inset 0 0 35px rgba(139, 92, 246, 0.2), 0 6px 18px rgba(0, 0, 0, 0.08)",
        }}
        title="Tap to pulse energy through the celestial orb!"
      >
        {/* Background Starfield Twinkles */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <span className="absolute top-4 left-6 text-xs text-purple-300 animate-pulse">✦</span>
          <span className="absolute top-8 right-8 text-xs text-amber-300 animate-pulse" style={{ animationDelay: "1s" }}>✨</span>
          <span className="absolute bottom-6 left-10 text-xs text-pink-300 animate-pulse" style={{ animationDelay: "1.5s" }}>✦</span>
          <span className="absolute bottom-5 right-12 text-xs text-indigo-300 animate-pulse" style={{ animationDelay: "0.5s" }}>✨</span>
        </div>

        {/* 3D Gyroscope Assembly */}
        <div
          className="relative w-44 h-44 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${pulsing ? 1.08 : 1})`,
            transition: isHovered && !pulsing ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Ring 1 — Outer Violet Gyro Ring */}
          <div
            className="absolute rounded-full border-2 border-purple-400/70"
            style={{
              width: "155px",
              height: "155px",
              transformStyle: "preserve-3d",
              animation: "spin3d-ring1 8s linear infinite",
              boxShadow: "0 0 16px rgba(139, 92, 246, 0.6), inset 0 0 12px rgba(139, 92, 246, 0.3)",
            }}
          >
            {/* Orbiting Satellite 1 */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple-300 shadow-[0_0_10px_#a78bfa] flex items-center justify-center text-[7px]"
            >
              ✦
            </div>
          </div>

          {/* Ring 2 — Middle Gold Gyro Ring */}
          <div
            className="absolute rounded-full border-2 border-amber-300/80"
            style={{
              width: "128px",
              height: "128px",
              transformStyle: "preserve-3d",
              animation: "spin3d-ring2 6s linear infinite",
              boxShadow: "0 0 18px rgba(245, 184, 78, 0.7), inset 0 0 10px rgba(245, 184, 78, 0.4)",
            }}
          >
            {/* Orbiting Satellite 2 */}
            <div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-200 shadow-[0_0_12px_#fde047] flex items-center justify-center text-[7px] text-amber-900 font-bold"
            >
              ★
            </div>
          </div>

          {/* Ring 3 — Inner Hot Pink/Rose Ring */}
          <div
            className="absolute rounded-full border-2 border-pink-400/75"
            style={{
              width: "102px",
              height: "102px",
              transformStyle: "preserve-3d",
              animation: "spin3d-ring3 4.5s linear infinite reverse",
              boxShadow: "0 0 16px rgba(244, 63, 94, 0.6), inset 0 0 8px rgba(244, 63, 94, 0.3)",
            }}
          >
            {/* Orbiting Micro Node */}
            <div
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-300 shadow-[0_0_8px_#f472b6]"
            />
          </div>

          {/* Center Pulsating 3D Star Core */}
          <div
            className="relative rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              width: "60px",
              height: "60px",
              transformStyle: "preserve-3d",
              background: isComplete
                ? "radial-gradient(circle at 35% 35%, #fffbeb 0%, #fef08a 35%, #f59e0b 70%, #b45309 100%)"
                : "radial-gradient(circle at 35% 35%, #ffffff 0%, #ddd6fe 35%, #8b5cf6 70%, #4c1d95 100%)",
              boxShadow: isComplete
                ? "0 0 35px rgba(245, 184, 78, 0.9), 0 0 60px rgba(245, 184, 78, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.8)"
                : "0 0 28px rgba(139, 92, 246, 0.85), 0 0 50px rgba(167, 139, 250, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.7)",
              animation: "pulse-core 3s ease-in-out infinite",
            }}
          >
            {/* Rotating Star Glyph */}
            <span
              className="text-white text-2xl select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              style={{
                animation: "spin-flat 12s linear infinite",
              }}
            >
              {isComplete ? "☀️" : "✦"}
            </span>

            {/* Glowing Corona Rays */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
              style={{
                background: isComplete ? "#fde047" : "#c4b5fd",
                animationDuration: "3s",
              }}
            />
          </div>

          {/* Floating 3D Depth Particles */}
          <div
            className="absolute -top-3 -right-2 text-xs text-amber-300 font-bold pointer-events-none drop-shadow-[0_0_6px_#fde047]"
            style={{ transform: "translateZ(35px)" }}
          >
            ✨
          </div>
          <div
            className="absolute -bottom-2 -left-2 text-xs text-pink-300 pointer-events-none drop-shadow-[0_0_6px_#f472b6]"
            style={{ transform: "translateZ(45px)" }}
          >
            💖
          </div>
        </div>

        {/* Ambient Click Prompt Overlay */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1.5 text-[10px] text-purple-200/90 font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/10">
          <Zap size={11} className="text-amber-300 fill-amber-300" />
          <span>Tap orb to pulse · Drag to tilt</span>
        </div>
      </div>

      {/* Subtext info */}
      <p className="text-[11px] text-center mt-2.5 leading-relaxed" style={{ color: "var(--plum-soft)" }}>
        {isComplete
          ? "✦ The 5 celestial stars are fully illuminated! Your birthday starlight shines at maximum radiance ✦"
          : "✦ Hover & move your cursor to view in 3D. Tap to send pulses into the constellation ✦"}
      </p>

      {/* CSS 3D Keyframe Animations */}
      <style>{`
        @keyframes spin3d-ring1 {
          0% {
            transform: rotateX(65deg) rotateY(15deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(65deg) rotateY(15deg) rotateZ(360deg);
          }
        }
        @keyframes spin3d-ring2 {
          0% {
            transform: rotateY(55deg) rotateX(35deg) rotateZ(0deg);
          }
          100% {
            transform: rotateY(55deg) rotateX(35deg) rotateZ(360deg);
          }
        }
        @keyframes spin3d-ring3 {
          0% {
            transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg);
          }
        }
        @keyframes pulse-core {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
        @keyframes spin-flat {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
