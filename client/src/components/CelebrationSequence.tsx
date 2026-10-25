/* Step-by-Step Interactive Birthday Surprise Sequence — Dreamy Purple Theme */

import { useState } from "react";
import { Lightbulb, Music, Sparkles, Heart, Flame, ArrowRight, Gift, Send } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playChimeSound, playSparkleStrum, playBirthdayMelody, playPopSound, playBlowSound } from "@/lib/audio";
import { FloatingBalloons } from "./FloatingBalloons";
import { sendWishEmail } from "@/lib/email";

interface CelebrationSequenceProps {
  onComplete?: () => void;
}

export function CelebrationSequence({ onComplete }: CelebrationSequenceProps) {
  const [step, setStep] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [wishText, setWishText] = useState("");
  const [wishSealed, setWishSealed] = useState(false);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [sealPrompt, setSealPrompt] = useState(false);

  // Step 0: Open Gift
  const handleOpenGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);
    playSparkleStrum();
    playPopSound();
    launchConfetti({
      particleCount: 80,
      shapes: ["circle", "heart", "star"],
      colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
    });
    setTimeout(() => {
      setStep(1);
    }, 600);
  };

  // Step 1: Lights
  const handleLights = () => {
    setStep(2);
    playSparkleStrum();
  };

  // Step 2: Music
  const handleMusic = () => {
    setStep(3);
    playBirthdayMelody();
  };

  // Step 3: Decorate / Banner
  const handleDecorate = () => {
    setStep(4);
    playChimeSound(1.1);
    launchConfetti({ particleCount: 50, colors: ["#8B5CF6", "#A78BFA", "#F5B84E", "#C4B5FD"] });
  };

  // Step 4: Balloons
  const handleBalloons = () => {
    setStep(5);
    playPopSound();
    launchConfetti({
      particleCount: 75,
      shapes: ["circle", "heart", "star"],
      colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
    });
  };

  // Step 5: Cake
  const handleCake = () => {
    setStep(6);
    playSparkleStrum();
  };

  // Seal the whispered wish
  const handleSealWish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!wishText.trim()) return;
    setWishSealed(true);
    setSealPrompt(false);
    playChimeSound(1.2);
    launchConfetti({
      particleCount: 40,
      shapes: ["heart", "star"],
      colors: ["#8B5CF6", "#A78BFA", "#F5B84E", "#FFFFFF"],
    });
    // Send sealed wish to Raghav's email via EmailJS
    sendWishEmail(wishText.trim(), "cake_candle");
  };

  // Tap individual candle to blow out — ONLY allowed if message/wish is sealed!
  const handleBlowIndividualCandle = (index: number) => {
    if (!wishSealed) {
      setSealPrompt(true);
      playPopSound();
      return;
    }
    if (!candlesLit[index]) return;
    playBlowSound();

    const next = [...candlesLit];
    next[index] = false;
    setCandlesLit(next);

    const remaining = next.filter(Boolean).length;
    if (remaining === 0) {
      setCandlesBlown(true);
      setTimeout(() => {
        playBirthdayMelody();
        launchConfetti({
          particleCount: 140,
          spread: 110,
          shapes: ["star", "heart", "circle"],
          colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
        });
        setStep(7);
        if (onComplete) onComplete();
      }, 500);
    } else {
      playChimeSound(1 + (3 - remaining) * 0.15);
    }
  };

  return (
    <div className="celebration-sequence-box relative overflow-hidden">
      {/* Fairy Lights String */}
      {step >= 2 && (
        <div className="absolute top-0 inset-x-0 h-8 flex justify-around items-start z-20 pointer-events-none animate-in fade-in duration-500">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1.5 h-2 opacity-40" style={{ background: "var(--purple-deep)" }} />
              <div
                className="w-3.5 h-3.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: ["#8B5CF6", "#F5B84E", "#A78BFA", "#C4B5FD", "#F472B6"][i % 5],
                  boxShadow: `0 0 12px ${["#8B5CF6", "#F5B84E", "#A78BFA", "#C4B5FD", "#F472B6"][i % 5]}`,
                  animationDuration: `${0.8 + (i % 4) * 0.25}s`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Happy Birthday Bunting Banner */}
      {step >= 4 && (
        <div className="flex justify-center gap-1.5 md:gap-2.5 my-4 z-20 flex-wrap animate-in slide-in-from-top-6 duration-600">
          {"HAPPY BIRTHDAY".split("").map((letter, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center justify-center w-6 h-8 md:w-8 md:h-10 text-xs md:text-sm font-black rounded-b-md shadow-sm border border-white/30 ${
                letter === " "
                  ? "w-2 md:w-3 opacity-0"
                  : idx % 2 === 0
                  ? "text-white"
                  : "text-[var(--plum)]"
              }`}
              style={{
                background:
                  letter === " " ? "transparent" : idx % 2 === 0 ? "var(--purple)" : "var(--butter)",
                transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * ((idx % 3) * 2 + 1)}deg)`,
                fontFamily: "Baloo 2, sans-serif",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      {/* Floating Helium Balloons */}
      {step >= 5 && <FloatingBalloons count={14} />}

      {/* Center Stage */}
      <div className="flex flex-col items-center justify-center text-center relative z-20 py-2">
        {step === 0 && (
          /* Step 0: The Interactive Gift Box */
          <div className="my-6 max-w-md flex flex-col items-center animate-in zoom-in-95 duration-400">
            <p className="hand text-lg mb-1" style={{ color: "var(--purple-ink)" }}>
              there's a birthday surprise waiting in here for you… 🎁
            </p>
            <div
              onClick={handleOpenGift}
              className="gift-container cursor-pointer my-3 group"
              role="button"
              tabIndex={0}
              aria-label="Tap to open birthday gift"
            >
              <svg
                className={`gift-svg ${giftOpened ? "opened" : ""}`}
                viewBox="0 0 260 230"
                role="img"
                aria-label="a gift with a purple bow"
              >
                <ellipse cx="130" cy="214" rx="92" ry="9" fill="#D4BEF5" opacity=".5" />
                <g id="giftBox">
                  <rect x="50" y="112" width="160" height="92" rx="12" fill="#8B5CF6" />
                  <rect x="112" y="112" width="36" height="92" fill="#FAF5FF" />
                  <path
                    d="M78 150c-4.5-4.5-10.5-2.3-10.5 3 0 4.5 6 7.5 10.5 11.3 4.5-3.8 10.5-6.8 10.5-11.3 0-5.3-6-7.5-10.5-3Z"
                    fill="#FAF5FF"
                  />
                  <path
                    d="M182 168c-4.5-4.5-10.5-2.3-10.5 3 0 4.5 6 7.5 10.5 11.3 4.5-3.8 10.5-6.8 10.5-11.3 0-5.3-6-7.5-10.5-3Z"
                    fill="#FAF5FF"
                  />
                  <g id="giftLid">
                    <rect x="38" y="78" width="184" height="38" rx="14" fill="#6D28D9" />
                    <rect x="112" y="78" width="36" height="38" fill="#FAF5FF" />
                    <path
                      d="M130 72 C102 38 58 42 66 60 C72 74 104 78 130 72 Z"
                      fill="#6D28D9"
                    />
                    <path
                      d="M130 72 C158 38 202 42 194 60 C188 74 156 78 130 72 Z"
                      fill="#6D28D9"
                    />
                    <ellipse cx="130" cy="72" rx="12" ry="10" fill="#F5B84E" />
                  </g>
                </g>
              </svg>
            </div>
            <button type="button" onClick={handleOpenGift} className="cute-btn flex items-center gap-2">
              <Gift size={16} /> tap to open the gift!
            </button>
            <p className="tiny mt-2">go on — it won't bite. promise. ✨</p>
          </div>
        )}

        {step > 0 && step < 6 && (
          <div className="my-6 max-w-md animate-in fade-in duration-300">
            <span className="text-3xl mb-2 block">✨</span>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--plum)" }}>
              Let's set the stage for your celebration!
            </h3>
            <p className="text-sm" style={{ color: "var(--plum-soft)" }}>
              Follow the surprise steps below to turn on the magic, play the birthday melody, and bring out your cake!
            </p>
          </div>
        )}

        {step >= 6 && (
          /* Step 6 & 7: Cake with Blowing Candles & Whispered Wish */
          <div className="my-2 flex flex-col items-center animate-in zoom-in-75 duration-500 w-full max-w-md">
            {/* Candle Flames */}
            <div className="flex gap-7 mb-[-4px] z-30">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBlowIndividualCandle(idx)}
                  className={`flex flex-col items-center transition-transform focus:outline-none ${
                    !wishSealed
                      ? "cursor-pointer hover:scale-105 opacity-90"
                      : "cursor-pointer hover:scale-115"
                  }`}
                  aria-label={`Blow candle ${idx + 1}`}
                  title={
                    !wishSealed
                      ? "🔒 Whisper your wish below & tap 'seal it' first before blowing!"
                      : candlesLit[idx]
                      ? "Tap to blow out this candle!"
                      : "Candle blown out"
                  }
                >
                  {candlesLit[idx] ? (
                    <Flame
                      size={26}
                      className="text-amber-400 fill-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] animate-bounce"
                      style={{ animationDuration: `${0.7 + idx * 0.2}s` }}
                    />
                  ) : (
                    <span className="text-xs font-bold animate-pulse text-[#a78bfa]">💨</span>
                  )}
                  <div
                    className="w-3.5 h-8 rounded-t-sm border border-white/40"
                    style={{
                      background: `linear-gradient(to top, ${
                        ["#8B5CF6", "#F5B84E", "#A78BFA"][idx]
                      }, #FFF3D0)`,
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Cake Tiers */}
            <div
              className="w-52 h-14 border-2 rounded-t-xl flex items-center justify-center relative overflow-hidden shadow-md"
              style={{ background: "var(--purple)", borderColor: "var(--purple-deep)" }}
            >
              <div
                className="absolute top-0 inset-x-0 h-3 flex justify-around"
                style={{ background: "var(--plum)" }}
              >
                <div className="w-4 h-5 rounded-b-full" style={{ background: "var(--plum)" }} />
                <div className="w-3 h-4 rounded-b-full" style={{ background: "var(--plum)" }} />
                <div className="w-4 h-6 rounded-b-full" style={{ background: "var(--plum)" }} />
                <div className="w-3 h-4 rounded-b-full" style={{ background: "var(--plum)" }} />
              </div>
              <span className="hand text-sm font-bold mt-2" style={{ color: "#fff" }}>
                ✦ CHOWTIE-PIE RAMYA ✦
              </span>
            </div>
            <div
              className="w-64 h-16 border-2 rounded-t-2xl flex items-center justify-center -mt-1 shadow-lg"
              style={{ background: "var(--butter)", borderColor: "var(--butter-deep)" }}
            >
              <span className="hand text-base" style={{ color: "var(--plum)" }}>
                {!wishSealed
                  ? "whisper your wish below & tap 'seal it' first! 🎂"
                  : "now tap each candle to blow it out! 💨✨"}
              </span>
            </div>
            <div
              className="w-68 h-3 rounded-full -mt-0.5"
              style={{ background: "#ede4ff", border: "2px solid var(--line)" }}
            />

            {/* Alert if user tried to blow candles without sealing */}
            {sealPrompt && !wishSealed && (
              <div className="mt-3 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full animate-bounce shadow-sm">
                🔒 Whisper your wish below &amp; tap 'seal it' before blowing the candles!
              </div>
            )}

            {/* Whispered Wish Input (From reference HTML) */}
            <div className="mt-5 w-full">
              {!wishSealed ? (
                <form onSubmit={handleSealWish} className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    value={wishText}
                    onChange={(e) => {
                      setWishText(e.target.value);
                      if (sealPrompt) setSealPrompt(false);
                    }}
                    maxLength={70}
                    placeholder="whisper your wish here… (just between us)"
                    className="w-full max-w-xs px-3.5 py-1.5 text-center text-sm font-['Caveat'] text-lg outline-none rounded-full"
                    style={{
                      background: "transparent",
                      borderBottom: "2px dashed var(--purple-glow)",
                      color: "var(--plum)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!wishText.trim()}
                    className="cute-btn sm disabled:opacity-40 flex items-center gap-1 shrink-0"
                  >
                    <Send size={13} /> seal it
                  </button>
                </form>
              ) : (
                <p className="hand text-base animate-in fade-in" style={{ color: "var(--purple-ink)" }}>
                  ✨ wish sealed &amp; carried off on the wind. now tap the candles above!
                </p>
              )}
            </div>

            <p className="hand text-sm mt-3" style={{ color: "var(--purple-ink)" }}>
              {!wishSealed && "🔒 the candles won't blow out until your wish is sealed!"}
              {wishSealed && candlesLit.filter(Boolean).length === 3 && "three little flames, one big wish 🕯️ (tap each candle!)"}
              {wishSealed && candlesLit.filter(Boolean).length === 2 && "one down… the wish is warming up ✨"}
              {wishSealed && candlesLit.filter(Boolean).length === 1 && "two down — one last candle to blow! 💨"}
              {wishSealed && candlesLit.filter(Boolean).length === 0 && "all candles blown! Happy Birthday, Ramya! 🎉"}
            </p>
          </div>
        )}

        {/* Step Controller Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {step === 1 && (
            <button
              type="button"
              onClick={handleLights}
              className="cute-btn flex items-center gap-2 animate-in zoom-in-75"
            >
              <Lightbulb size={16} /> 1. Turn on the fairy lights
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={handleMusic}
              className="cute-btn flex items-center gap-2 animate-in zoom-in-75"
            >
              <Music size={16} /> 2. Play the birthday tune
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={handleDecorate}
              className="cute-btn flex items-center gap-2 animate-in zoom-in-75"
            >
              <Sparkles size={16} /> 3. Hang the birthday banner
            </button>
          )}
          {step === 4 && (
            <button
              type="button"
              onClick={handleBalloons}
              className="cute-btn flex items-center gap-2 animate-in zoom-in-75"
            >
              <Heart size={16} /> 4. Release the balloons
            </button>
          )}
          {step === 5 && (
            <button
              type="button"
              onClick={handleCake}
              className="cute-btn flex items-center gap-2 animate-in zoom-in-75"
            >
              <Sparkles size={16} /> 5. Bring out the cake!
            </button>
          )}

          {step >= 7 && (
            /* "You've got mail" button as requested by user */
            <div className="flex flex-col items-center gap-3 animate-in zoom-in-75 duration-300">
              <img
                src="/gifs/bear_celebration.gif"
                alt="Cute Celebration Bear"
                className="w-24 h-24 object-contain drop-shadow-md"
              />
              <a href="/letter" className="cute-btn flex items-center gap-2 text-base px-7 py-3.5">
                <Heart size={17} fill="currentColor" /> you've got mail 💌 <ArrowRight size={17} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
