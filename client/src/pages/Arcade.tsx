/* Birthday celebration: Chapter 5 (The Arcade) — Cute & Aesthetic Restyle */

import { useState } from "react";
import { Sparkles, Trophy, Heart, RotateCcw, AlertTriangle, ArrowRight, Crown } from "lucide-react";
import { PuzzleGame } from "@/components/PuzzleGame";
import { launchConfetti } from "@/lib/confetti";
import { playPopSound, playSparkleStrum, playChimeSound, playBirthdayMelody } from "@/lib/audio";

interface Balloon {
  id: number;
  color: string;
  label: string;
  popped: boolean;
  message: string;
}

const INITIAL_BALLOONS: Balloon[] = [
  { id: 1, color: "#8B5CF6", label: "01", popped: false, message: "You somehow had a way of making even the most ordinary days genuinely fun. ✨" },
  { id: 2, color: "#A78BFA", label: "02", popped: false, message: "Your 'quick' phone calls had a habit of accidentally turning into two-hour conversations. 💖" },
  { id: 3, color: "#F5B84E", label: "03", popped: false, message: "You have a laugh that was dangerously easy to join in on. 😂" },
  { id: 4, color: "#9CCBE8", label: "04", popped: false, message: "Somehow, you could turn a simple random plan into an entire adventure. ☕" },
  { id: 5, color: "#C4B5FD", label: "05", popped: false, message: "You were very easy to tease... which is probably why I did it so much! 🌟" },
  { id: 6, color: "#6D28D9", label: "06", popped: false, message: "You've been part of some genuinely happy memories of mine, and I'll always appreciate that. 🎉" },
];

const VOUCHERS = [
  "☕ Coffee & a ridiculous catch-up",
  "🍫 Your favorite dessert — my treat",
  "📸 20 aesthetic photos (since I'm your photographer now)",
  "🍕 One completely unnecessary food adventure",
  "🍿 Movie + snacks on me",
  "🗣️ A random, no-pressure chat whenever life allows",
];

export default function Arcade() {
  const [balloons, setBalloons] = useState<Balloon[]>(INITIAL_BALLOONS);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonVoucher, setWonVoucher] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [crowned, setCrowned] = useState(false);

  const handlePopBalloon = (id: number) => {
    setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    playPopSound();
    launchConfetti({ particleCount: 50, spread: 65, shapes: ["circle", "star", "heart"], colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"] });
  };

  const handleResetBalloons = () => { setBalloons(INITIAL_BALLOONS); playChimeSound(); };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWonVoucher(null);
    playSparkleStrum();
    const randomDegrees = Math.floor(1800 + Math.random() * 1800);
    const newRotation = wheelRotation + randomDegrees;
    setWheelRotation(newRotation);
    setTimeout(() => {
      setSpinning(false);
      const segmentDegrees = 360 / VOUCHERS.length;
      const normalizedDegrees = ((newRotation % 360) + 360) % 360;
      const winningIndex = Math.floor(((360 - normalizedDegrees + 30) % 360) / segmentDegrees) % VOUCHERS.length;
      setWonVoucher(VOUCHERS[winningIndex]);
      playSparkleStrum();
      launchConfetti({ particleCount: 110, spread: 95, shapes: ["star", "heart"], colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"] });
    }, 3500);
  };

  const cheekyMessages = [
    "Do NOT press this button.",
    "Hey! I explicitly said don't click it!",
    "Why are you still clicking? Stop it! 😤",
    "Are you naturally this rebellious? (Yes, you are)",
    "Okay, one more click and something explodes...",
    "🎉 BOOM: 1,000,000 friendship brownie points. Some things apparently survive everything. ❤️",
  ];

  const handleCheekyClick = () => {
    setClickCount((c) => {
      const next = Math.min(c + 1, cheekyMessages.length - 1);
      if (next === cheekyMessages.length - 1) {
        launchConfetti({ particleCount: 130, spread: 100, shapes: ["heart", "star"], colors: ["#F2849E", "#F5B84E", "#A9CFA0", "#9CCBE8"] });
        playSparkleStrum();
      } else { playPopSound(); }
      return next;
    });
  };

  const handleCoronation = () => {
    setCrowned(true);
    playBirthdayMelody();
    launchConfetti({ particleCount: 140, spread: 100, shapes: ["star", "heart", "circle"], colors: ["#F2849E", "#F5B84E", "#A9CFA0", "#9CCBE8"] });
  };

  const allPopped = balloons.every((b) => b.popped);

  return (
    <main className="chapter inner-chapter page-wrap pt-8 pb-16">
      <div className="chapter-intro flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-index">04</span> the fun arcade
          </p>
          <h1>Little games, <i>big laughs</i> &amp; prizes.</h1>
          <p className="lede">
            Pop the celebration balloons, solve the birthday memory puzzle, spin the wheel for real-life vouchers, and whatever you do... do NOT press the secret forbidden button!
          </p>
        </div>
        <img src="/gifs/bear-party.gif" alt="Cute Party Bear" className="w-20 h-20 object-contain drop-shadow-md shrink-0 animate-bounce" style={{ animationDuration: "2.5s" }} />
      </div>

      {/* Activity 1: Puzzle Game */}
      <section className="mb-14">
        <PuzzleGame />
      </section>

      {/* Activity 2: Balloon Pop Wall */}
      <section className="mb-14 cute-card p-6 md:p-8">
        <span className="tape-strip center-tape" />
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} style={{ color: "var(--rose)" }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--plum)" }}>Balloon Pop Wall</h2>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--plum-soft)" }}>
              Tap each floating balloon to pop it and reveal a sweet compliment inside!
            </p>
          </div>
          {allPopped && (
            <button onClick={handleResetBalloons} className="cute-btn ghost sm flex items-center gap-1.5">
              <RotateCcw size={13} /> Inflate balloons again
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {balloons.map((b) => (
            <div key={b.id} className="flex flex-col items-center">
              {!b.popped ? (
                <button
                  type="button"
                  onClick={() => handlePopBalloon(b.id)}
                  className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                  aria-label={`Pop balloon ${b.id}`}
                >
                  <div
                    className="w-20 h-24 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-lg flex items-center justify-center text-white font-bold text-lg border border-white/30 relative overflow-hidden transition-all group-hover:drop-shadow-[0_0_14px_rgba(242,132,158,0.55)]"
                    style={{ backgroundColor: b.color }}
                  >
                    <div className="absolute top-2 left-3 w-4 h-6 bg-white/40 rounded-full rotate-[-30deg] blur-[0.5px]" />
                    <span className="relative z-10 font-['Baloo_2'] font-bold">{b.label}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full -mt-0.5" style={{ backgroundColor: b.color }} />
                  <div className="w-[1.5px] h-8 bg-[#e8d3af]" />
                  <span className="text-xs font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity hand" style={{ color: "var(--rose-ink)" }}>
                    Pop me!
                  </span>
                </button>
              ) : (
                <div className="w-full min-h-[140px] p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-xs animate-in zoom-in-50 duration-300"
                  style={{ background: "#fff1e6", border: "2px dashed var(--line)" }}>
                  <span className="text-base mb-1">✨</span>
                  <p className="text-xs font-semibold leading-snug hand" style={{ color: "var(--plum)" }}>{b.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Activity 3: Spin the Prize Wheel */}
      <section className="mb-14 cute-card p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-10">
        <span className="tape-strip left-tape" />
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <Trophy size={18} style={{ color: "var(--butter-deep)" }} />
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--plum)" }}>The Birthday <i>Prize Wheel</i></h2>
          </div>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--plum-soft)" }}>
            Spin the wheel to claim a real-life birthday treat voucher! Take a screenshot to redeem whenever you want.
          </p>

          {wonVoucher && (
            <div className="mt-6 p-4 rounded-lg shadow-md animate-in zoom-in-75 duration-300"
              style={{ background: "var(--butter)", border: "2px solid var(--line)", boxShadow: "0 4px 0 var(--butter-deep)" }}>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: "var(--plum)" }}>
                <Sparkles size={13} style={{ color: "var(--rose)" }} /> Official Voucher Unlocked:
              </div>
              <strong className="block text-base font-bold mt-1" style={{ color: "var(--plum)", fontFamily: "Baloo 2" }}>
                {wonVoucher}
              </strong>
              <small className="text-xs font-bold mt-1 block" style={{ color: "var(--plum-soft)" }}>
                Screenshot &amp; show me anytime to redeem!
              </small>
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSpinWheel}
              disabled={spinning}
              className="cute-btn flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles size={16} />
              {spinning ? "Spinning the Wheel..." : "Spin for a Birthday Treat!"}
            </button>
          </div>
        </div>

        {/* Wheel Visual */}
        <div className="wheel-wrapper relative w-72 h-72 flex items-center justify-center select-none">
          <div className="absolute -top-3 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px]" style={{ borderTopColor: "var(--plum)" }} />
          <div
            className="w-full h-full rounded-full border-4 shadow-xl relative overflow-hidden"
            style={{
              borderColor: "var(--line)",
              transform: `rotate(${wheelRotation}deg)`,
              transition: spinning ? "transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)" : "none",
              background: "conic-gradient(#8B5CF6 0deg 60deg, #F5B84E 60deg 120deg, #A78BFA 120deg 180deg, #9CCBE8 180deg 240deg, #C4B5FD 240deg 300deg, #6D28D9 300deg 360deg)",
            }}
          >
            <div className="absolute inset-0 m-auto w-14 h-14 rounded-full z-20 flex items-center justify-center font-bold text-xs"
              style={{ background: "var(--paper)", border: "3px solid var(--line)", color: "var(--purple-ink)", fontFamily: "Caveat, cursive", fontSize: "1.1rem" }}>
              SPIN ✨
            </div>
          </div>
        </div>
      </section>

      {/* Activity 4: Cheeky "Do NOT Click" */}
      <section className="mb-14 p-8 rounded-xl border-2 flex flex-col items-center text-center relative overflow-hidden"
        style={{ background: "var(--plum)", borderColor: "var(--purple)", color: "var(--cream)", boxShadow: "6px 8px 0 var(--purple-deep)" }}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--butter)" }}>
          <AlertTriangle size={14} /> Warning: Highly Forbidden
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-4 hand" style={{ color: "var(--cream)" }}>
          The "Do NOT Click" Button
        </h3>
        <p className="text-xs mb-6 leading-relaxed max-w-md" style={{ color: "#f0dfc6" }}>
          {cheekyMessages[clickCount]}
        </p>
        <button
          type="button"
          onClick={handleCheekyClick}
          className="cute-btn flex items-center gap-2"
          style={{ background: "var(--purple)", boxShadow: "0 5px 0 var(--purple-deep), 0 0 20px rgba(139,92,246,0.5)" }}
        >
          <Heart size={15} fill="currentColor" />
          {clickCount === cheekyMessages.length - 1 ? "You did it! ❤️" : "Click Me Anyway!"}
        </button>
      </section>

      {/* Coronation Gateway */}
      <section className="my-14 cute-card p-6 md:p-8 max-w-2xl mx-auto text-center">
        <span className="tape-strip center-tape" />
        <div className="flex items-center justify-center gap-2 mb-2 kicker">
          <Crown size={16} /> The Final Gateway
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--plum)" }}>Birthday Crown Ceremony 👑</h3>
        <p className="text-xs mb-6" style={{ color: "var(--plum-soft)" }}>
          Before entering the moonlit wish room, claim your official birthday crown!
        </p>

        {!crowned ? (
          <button type="button" onClick={handleCoronation} className="cute-btn butter mx-auto flex items-center gap-2">
            <Crown size={18} style={{ color: "var(--rose)" }} />
            Claim My Birthday Crown! 👑
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-75 duration-300">
            <div className="cute-card-inner text-sm font-bold" style={{ color: "var(--plum)" }}>
              👑 Crowned! You are hereby granted passage to the Stars! ✨
            </div>
            <a href="/wish" className="cute-btn">
              Enter The Cosmic Wish Room ✦ <ArrowRight size={16} />
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
