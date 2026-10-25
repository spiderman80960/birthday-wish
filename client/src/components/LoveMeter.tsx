/* Cute Speedometer Love-o-Meter for Ramya's Memories Page */

import { useState, useRef, useEffect } from "react";
import { Gauge, Sparkles, Heart, Zap, Flame, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playPopSound, playSparkleStrum, playChimeSound } from "@/lib/audio";

interface LoveMeterProps {
  onUnlock?: () => void;
}

export function LoveMeter({ onUnlock }: LoveMeterProps) {
  // Current love percentage: 0 to 100 (or 115 for overdrive)
  const [value, setValue] = useState<number>(50);
  const [isOverdrive, setIsOverdrive] = useState<boolean>(false);
  const [hasUnlocked, setHasUnlocked] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Sound debounce ref
  const lastSoundTime = useRef<number>(0);

  // Play sound smoothly on slider change
  const triggerTickSound = () => {
    const now = Date.now();
    if (now - lastSoundTime.current > 70) {
      lastSoundTime.current = now;
      playPopSound();
    }
  };

  const handleSliderChange = (newVal: number) => {
    setIsOverdrive(false);
    setValue(newVal);
    triggerTickSound();

    if (newVal >= 75 && !hasUnlocked) {
      setHasUnlocked(true);
      if (onUnlock) onUnlock();
    }
  };

  const handleSetPreset = (presetVal: number) => {
    setIsOverdrive(false);
    setValue(presetVal);
    playSparkleStrum();

    if (presetVal >= 75) {
      setHasUnlocked(true);
      if (onUnlock) onUnlock();
      launchConfetti({
        particleCount: 70,
        spread: 80,
        shapes: ["heart", "star"],
        colors: ["#8B5CF6", "#F5B84E", "#F43F5E", "#EC4899", "#FFFFFF"],
      });
    }
  };

  const handleOverdrive = () => {
    setIsOverdrive(true);
    setValue(115);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);

    setHasUnlocked(true);
    if (onUnlock) onUnlock();

    playSparkleStrum();
    playChimeSound(1.3);

    launchConfetti({
      particleCount: 140,
      spread: 100,
      shapes: ["heart", "star", "circle"],
      colors: ["#8B5CF6", "#A78BFA", "#F5B84E", "#F43F5E", "#EC4899", "#FFFFFF"],
    });
  };

  const handleReset = () => {
    setIsOverdrive(false);
    setValue(20);
    playPopSound();
  };

  // Speedometer geometry
  // Arc spans from -190deg (0%) to +10deg (100%), and +25deg (115% Overdrive)
  // Total span = 200 degrees for 0-100
  const needleAngle = -190 + (Math.min(value, 115) / 100) * 200;

  // Status Tier metadata
  const getTier = () => {
    if (isOverdrive || value > 100) {
      return {
        badge: "💥 OVERDRIVE! BROKE THE METER 🚀",
        title: "OFF THE CHARTS!! 💥🔥♾️",
        quote: "The speedometer literally couldn't handle that much love! Friendship points: ∞ / 100!",
        bgGradient: "linear-gradient(135deg, #fdf2f8, #fce7f3, #fae8ff)",
        borderColor: "#f43f5e",
        textColor: "#be123c",
        emoji: "🚀"
      };
    }
    if (value === 100) {
      return {
        badge: "💯 MAXIMUM VELOCITY 🚀",
        title: "100% Love & Pure Joy! 🏆💜",
        quote: "Every single tease, late-night phone call, silly laugh, and beach trip was 100% worth it!",
        bgGradient: "linear-gradient(135deg, #faf5ff, #f3e8ff, #ede4ff)",
        borderColor: "var(--purple)",
        textColor: "var(--purple-ink)",
        emoji: "💯"
      };
    }
    if (value >= 80) {
      return {
        badge: "🔥 REDLINE ZONE ⚡",
        title: "Dangerously High Love! 🥰✨",
        quote: "Almost max capacity! Those 2-hour calls and random adventures definitely left their mark!",
        bgGradient: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
        borderColor: "#fb7185",
        textColor: "#9f1239",
        emoji: "🔥"
      };
    }
    if (value >= 60) {
      return {
        badge: "⚡ HIGH GEAR 🏎️",
        title: "A Whole Lot of Love! 💖",
        quote: "Now we're cruising! That's a solid, sweet amount of unforgettable chaotic memories!",
        bgGradient: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
        borderColor: "#a78bfa",
        textColor: "#5b21b6",
        emoji: "💖"
      };
    }
    if (value >= 35) {
      return {
        badge: "👀 CRUISING SPEED 🚗",
        title: "Getting Warmer... 🙃",
        quote: "Not bad, but you know we laughed way too much for it to stay at half-speed! Push it higher!",
        bgGradient: "linear-gradient(135deg, #fffbeb, #fef3c7)",
        borderColor: "#f59e0b",
        textColor: "#92400e",
        emoji: "🚗"
      };
    }
    if (value >= 15) {
      return {
        badge: "🤏 WARMING UP 💨",
        title: "Just a little bit?! 🤭",
        quote: "After the Wonderla screams, beach walks, and table tennis matches?! Crank that throttle up!",
        bgGradient: "linear-gradient(135deg, #fff7ed, #ffedd5)",
        borderColor: "#ea580c",
        textColor: "#9a3412",
        emoji: "🤏"
      };
    }
    return {
      badge: "🤨 IDLE ENGINE",
      title: "Zero?! As if! 😤",
      quote: "That needle better start moving right now! Don't tell me our memories were a flat zero!",
      bgGradient: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
      borderColor: "#94a3b8",
      textColor: "#475569",
      emoji: "🤨"
    };
  };

  const tier = getTier();

  return (
    <section className="my-14 cute-card p-6 md:p-9 max-w-xl mx-auto text-center relative overflow-hidden">
      <span className="tape-strip center-tape" />

      {/* Decorative header tags */}
      <div className="flex items-center justify-center gap-2 mb-2 kicker">
        <Gauge size={16} className="text-[var(--purple)]" />
        <span>interactive challenge · memory love-o-meter</span>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--plum)" }}>
        How Much Did You Love Our Moments? 🏎️💜
      </h3>

      <p className="text-xs md:text-sm mb-6 leading-relaxed" style={{ color: "var(--plum-soft)", maxWidth: "460px", margin: "0 auto 20px" }}>
        Rev the engine and spin the dial! Rate how much you loved the laughs, trips, calls, and memories we shared.
      </p>

      {/* Speedometer Gauge Graphic */}
      <div className={`relative max-w-[320px] mx-auto select-none my-2 ${isShaking ? "animate-shake" : ""}`}>
        <svg viewBox="0 0 320 185" className="w-full drop-shadow-sm overflow-visible">
          <defs>
            {/* Speedometer Arc Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="35%" stopColor="#A78BFA" />
              <stop offset="65%" stopColor="#F5B84E" />
              <stop offset="90%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            {/* Overdrive Redline Glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc (Radius 115, Center 160, 150) */}
          {/* Path spanning from -190deg to +10deg */}
          <path
            d="M 46.7 130 A 115 115 0 1 1 273.3 170"
            fill="none"
            stroke="#EDE4FF"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d="M 46.7 130 A 115 115 0 1 1 273.3 170"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="402"
            strokeDashoffset={Math.max(0, 402 - (Math.min(value, 115) / 100) * 360)}
            className="transition-all duration-300"
          />

          {/* Scale Tick Marks */}
          {/* 0% */}
          <text x="36" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8B5CF6">0%</text>
          {/* 25% */}
          <text x="65" y="80" textAnchor="middle" fontSize="10" fontWeight="600" fill="#A78BFA">25%</text>
          {/* 50% */}
          <text x="160" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F5B84E">50%</text>
          {/* 75% */}
          <text x="255" y="80" textAnchor="middle" fontSize="10" fontWeight="600" fill="#FB7185">75%</text>
          {/* 100% */}
          <text x="282" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#EC4899">100%</text>
          {/* Overdrive marker */}
          <text x="288" y="180" textAnchor="middle" fontSize="9" fontWeight="800" fill="#F43F5E">🚀 MAX</text>

          {/* Needle Pointer */}
          <g
            style={{
              transformOrigin: "160px 150px",
              transform: `rotate(${needleAngle}deg)`,
              transition: isOverdrive ? "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 0.25s ease-out",
            }}
          >
            {/* Needle Triangle */}
            <path
              d="M 157 150 L 160 52 L 163 150 Z"
              fill={isOverdrive ? "#F43F5E" : "#7C3AED"}
              filter="url(#glow)"
            />
            {/* Needle Accent line */}
            <line x1="160" y1="52" x2="160" y2="150" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
            {/* Center Pivot Base */}
            <circle cx="160" cy="150" r="14" fill="#6D28D9" />
            <circle cx="160" cy="150" r="8" fill="#F5B84E" />
            <circle cx="160" cy="150" r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Digital Readout Box below Pivot */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-xs"
            style={{ background: isOverdrive ? "#fee2e2" : "rgba(139, 92, 246, 0.12)", border: `1.5px solid ${tier.borderColor}` }}>
            <span className="text-lg leading-none">{tier.emoji}</span>
            <span className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: tier.textColor }}>
              {isOverdrive ? "1000% ∞" : `${value}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Tier Reaction Card */}
      <div
        className="mt-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 max-w-md mx-auto text-center"
        style={{
          background: tier.bgGradient,
          border: `2px dashed ${tier.borderColor}`,
          boxShadow: isOverdrive ? "0 8px 24px rgba(244, 63, 94, 0.25)" : "0 4px 14px rgba(139, 92, 246, 0.08)",
        }}
      >
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5"
          style={{ background: "rgba(255, 255, 255, 0.75)", color: tier.textColor }}>
          {tier.badge}
        </span>
        <h4 className="text-base sm:text-lg font-bold" style={{ color: tier.textColor }}>
          {tier.title}
        </h4>
        <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90" style={{ color: tier.textColor }}>
          "{tier.quote}"
        </p>
      </div>

      {/* Interactive Throttle Slider */}
      <div className="mt-6 max-w-md mx-auto px-2">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: "var(--plum-soft)" }}>
          <span>Slide to adjust love level:</span>
          <span className="text-[var(--purple-deep)] font-extrabold">{value}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.min(value, 100)}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-3 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[var(--purple)] focus:outline-none focus:ring-2 focus:ring-[var(--purple)]"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleSetPreset(25)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: value === 25 ? "var(--purple)" : "var(--purple-light)",
              color: value === 25 ? "#ffffff" : "var(--plum)",
              border: "1px solid var(--line)"
            }}
          >
            🤏 25% A Little
          </button>

          <button
            type="button"
            onClick={() => handleSetPreset(50)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: value === 50 ? "var(--purple)" : "var(--purple-light)",
              color: value === 50 ? "#ffffff" : "var(--plum)",
              border: "1px solid var(--line)"
            }}
          >
            😊 50% Medium
          </button>

          <button
            type="button"
            onClick={() => handleSetPreset(75)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: value === 75 ? "var(--purple)" : "var(--purple-light)",
              color: value === 75 ? "#ffffff" : "var(--plum)",
              border: "1px solid var(--line)"
            }}
          >
            💖 75% A Lot!
          </button>

          <button
            type="button"
            onClick={() => handleSetPreset(100)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            style={{
              background: value === 100 && !isOverdrive ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "var(--butter)",
              color: value === 100 && !isOverdrive ? "#ffffff" : "var(--plum)",
              border: "1.5px solid var(--butter-deep)"
            }}
          >
            ✨ 100% To The Moon!
          </button>

          {/* Overdrive Button */}
          <button
            type="button"
            onClick={handleOverdrive}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md flex items-center gap-1 ${
              isOverdrive ? "ring-3 ring-rose-400 animate-pulse" : ""
            }`}
            style={{
              background: "linear-gradient(135deg, #F43F5E, #9333EA)",
              color: "#FFFFFF"
            }}
          >
            <Zap size={13} className="fill-yellow-300 text-yellow-300" />
            <span>OVERDRIVE (MAX ∞)</span>
          </button>
        </div>
      </div>

      {/* Chapter 04 Unlock Reward Card */}
      {hasUnlocked && (
        <div className="mt-8 p-5 sm:p-6 rounded-2xl animate-in zoom-in-95 duration-400 flex flex-col items-center gap-3.5 text-center"
          style={{
            background: "linear-gradient(135deg, #fff9e6, #fff3cc)",
            border: "2px dashed var(--butter)",
            boxShadow: "0 6px 18px rgba(245,184,78,0.22)"
          }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60">
            <Trophy size={13} className="text-amber-700" /> Moments Certified with 100% Love!
          </div>

          <h4 className="text-xl sm:text-2xl font-bold text-amber-950">
            Chapter 04 Unlocked: The Arcade! 🎮🎉
          </h4>

          <p className="text-xs sm:text-sm text-amber-900 max-w-sm leading-relaxed">
            Your love-meter test is officially certified! Ready to pop balloons, win vouchers, and play games?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <a
              href="/arcade"
              className="cute-btn butter flex items-center gap-2 text-sm px-6 py-3"
            >
              <span>Enter The Arcade 🎮</span>
              <ArrowRight size={16} />
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="cute-btn ghost sm flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Test Again</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
