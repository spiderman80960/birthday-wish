/* Birthday celebration: Chapter 6 (The Birthday Wish Room) — Dreamy Purple Restyle */

import { useState } from "react";
import { Check, RotateCcw, Sparkles, Moon, Sun, Heart, Home } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playChimeSound, playSparkleStrum, playBirthdayMelody } from "@/lib/audio";
import { useTheme } from "@/contexts/ThemeContext";
import { CosmicSphere3D } from "@/components/CosmicSphere3D";

const STAR_PROMPTS = [
  "May you always have places and people where your mind feels completely peaceful",
  "May there always be exciting new places, stories, and spontaneous plans waiting for you",
  "May all the goals you're quietly working toward find their way to you",
  "May you keep finding reasons to laugh until your cheeks hurt",
  "May this next chapter of your life be kinder, brighter, and happier than you expect",
];

const LOVE_MSGS: Record<number, string> = {
  1: "the universe says: right back at you! 💖",
  3: "okay, you're making the universe blush! 😊",
  7: "the love is officially excessive. as it should be! ✨",
  15: "certified overflow! Ramya is truly loved, folks. 👑",
  25: "infinite birthday love unlocked! You're the absolute best! 🌟",
};

export default function Wish() {
  const { setTheme } = useTheme();
  const [stars, setStars] = useState<boolean[]>([false, false, false, false, false]);
  const [activeBlessing, setActiveBlessing] = useState<string | null>(null);

  // Send some love back state
  const [heartsSent, setHeartsSent] = useState(0);
  const [loveBump, setLoveBump] = useState(false);
  const [loveMessage, setLoveMessage] = useState("");

  const complete = stars.every(Boolean);

  const tapStar = (index: number) => {
    setActiveBlessing(STAR_PROMPTS[index]);
    setStars((current) => {
      const next = current.map((value, item) => (item === index ? true : value));
      playChimeSound(1 + index * 0.15);
      if (next.every(Boolean)) {
        setTimeout(() => {
          setTheme("light");
          playBirthdayMelody();
          launchConfetti({
            particleCount: 160,
            spread: 110,
            shapes: ["star", "heart", "circle"],
            colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
          });
        }, 400);
      }
      return next;
    });
  };

  const handleSendLove = () => {
    const next = heartsSent + 1;
    setHeartsSent(next);
    setLoveBump(true);
    setTimeout(() => setLoveBump(false), 350);
    playChimeSound(1.1 + Math.min(0.6, next * 0.04));
    launchConfetti({
      particleCount: 20 + Math.min(35, next * 2),
      shapes: ["heart"],
      colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F472B6", "#F5B84E"],
    });
    if (LOVE_MSGS[next]) {
      setLoveMessage(LOVE_MSGS[next]);
    } else if (next > 25 && next % 5 === 0) {
      setLoveMessage(`✨ ${next} hearts and counting! Supernova of love! 💖`);
    }
  };

  const reset = () => {
    setStars([false, false, false, false, false]);
    setActiveBlessing(null);
    setHeartsSent(0);
    setLoveMessage("");
    setTheme("light");
  };

  return (
    <main className="chapter wish-chapter page-wrap pt-8 pb-20">
      <section className="wish-hero">
        <div className="wish-copy">
          <p className="eyebrow">
            <span className="eyebrow-index">05</span> the birthday wish
          </p>
          <h1>
            Make a wish.<br />
            <i>Launch it to the sky.</i>
          </h1>
          <p className="lede">
            Five celestial stars are holding special birthday blessings. Tap each one to illuminate the night and break into golden sunshine!
          </p>

          <div className="wish-progress" aria-live="polite">
            <span>{stars.filter(Boolean).length} / 5</span> stars collected
            <div className="progress-line">
              <span style={{ width: `${stars.filter(Boolean).length * 20}%` }} />
            </div>
          </div>

          {/* 3D Celestial Gyroscope & Starlight Sphere */}
          <CosmicSphere3D isComplete={complete} />
        </div>

        {/* The Cosmic Sky — kept dark as an atmospheric stargaze scene */}
        <div className={`wish-sky ${complete ? "complete" : ""}`}>
          <div className="moon-orb">
            {complete ? (
              <Sun
                size={38}
                className="text-amber-400 fill-amber-300 animate-spin"
                style={{ animationDuration: "20s" }}
              />
            ) : (
              <Moon size={38} style={{ color: "#8B5CF6", fill: "#8B5CF6" }} />
            )}
          </div>

          {stars.map((active, index) => (
            <button
              className={`wish-star star-${index + 1} ${active ? "active" : ""}`}
              key={index}
              onClick={() => tapStar(index)}
              aria-label={`${active ? "Collected" : "Collect"} star ${index + 1}`}
              title={STAR_PROMPTS[index]}
            >
              <Sparkles size={index === 2 ? 32 : 24} fill={active ? "currentColor" : "none"} />
            </button>
          ))}

          {complete && (
            <div className="sky-surprise" role="status">
              <Sparkles size={16} /> All stars collected: Happy Birthday! ✦
            </div>
          )}

          <p className="sky-caption">
            tap the stars <span>✦</span>
          </p>
        </div>

        {/* Illuminated Star Blessing Card */}
        {activeBlessing && (
          <div className="mt-4 p-4 cute-card rounded-xl text-center animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-1.5 kicker text-sm mb-1">
              <Sparkles size={13} style={{ color: "var(--butter)" }} /> Celestial Blessing
            </div>
            <p className="hand text-base" style={{ color: "var(--plum)" }}>"{activeBlessing}"</p>
          </div>
        )}
      </section>

      {/* Final Birthday Note Section (Hidden until all 5 celestial stars are collected) */}
      {!complete ? (
        <section className="my-10 p-7 rounded-2xl text-center border-2 border-dashed border-purple-200 bg-purple-50/50 backdrop-blur-xs flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 border border-purple-300 text-purple-600 flex items-center justify-center text-xl shadow-xs animate-bounce" style={{ animationDuration: "2.5s" }}>
            🔒
          </div>
          <div className="kicker text-xs uppercase tracking-wider text-purple-700 font-bold flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" /> Final Birthday Note Sealed
          </div>
          <h3 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--plum)" }}>
            A Quiet Birthday Message is Waiting... 🌌✨
          </h3>
          <p className="text-xs sm:text-sm max-w-md leading-relaxed" style={{ color: "var(--plum-soft)" }}>
            Collect and illuminate all 5 celestial stars above to reveal the quiet final birthday message for Ramya.
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-purple-900 bg-purple-200/60 mt-1">
            <span>{stars.filter(Boolean).length} / 5 stars illuminated</span>
          </div>
        </section>
      ) : (
        <section
          className="my-12 p-8 sm:p-12 rounded-3xl animate-in zoom-in-95 duration-500 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #faf7ff 65%, #f5efff 100%)",
            border: "2px solid var(--purple)",
            boxShadow: "0 14px 40px rgba(109, 40, 217, 0.12), 0 4px 12px rgba(109, 40, 217, 0.06)",
          }}
        >
          <span className="tape-strip center-tape" />

          {/* Header Badge */}
          <div className="flex items-center gap-2 kicker text-xs uppercase tracking-wider font-extrabold text-[var(--purple-deep)] mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <span>A quiet birthday wish for you, Ramya 💜</span>
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-6" style={{ color: "var(--plum)" }}>
            May this year bring you peace, laughter, and <i>genuine happiness.</i>
          </h2>

          {/* Note Body Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--plum-soft)" }}>
            <p className="font-semibold text-base sm:text-lg" style={{ color: "var(--plum)" }}>
              Happy Birthday, Ramya.
            </p>

            <p>
              There's something I've wanted to say for a long time, and maybe this is the last place I'll try to put it into words.
            </p>

            <p>
              For a long time, I felt like I was being made out to be the one who was wrong, as though my reactions were the whole story and everything that led to them didn't matter. But I noticed things too, Ramya. Things that changed, things that didn't add up, and things I tried to talk to you about but never felt were truly heard. You might have thought I didn't know, but I had been noticing more than you realised.
            </p>

            <p>
              What hurt me most wasn't just the changes between us. It was seeing behaviour change depending on who was around, feeling that things were being hidden from me, and wondering why I was left to question myself while my concerns went unheard. I kept giving you the benefit of the doubt because I trusted you. Looking back, trusting so blindly was my mistake.
            </p>

            <p>
              I don't know whether you ever understood how things looked from my side. Sometimes, I felt that my mistakes were brought forward while the things that hurt me stayed unspoken. I wanted to sit down with you, tell you what I'd noticed, and ask you honestly why things happened the way they did. Not to win an argument, but because I thought what we shared deserved that honesty. But we never really had that conversation.
            </p>

            <p>
              I'm not writing this to reopen every incident or demand an explanation from you. You made your choices, and that's your right. I've made mine too. I just don't want my silence to be mistaken for not noticing, not understanding, or being unaffected by what happened.
            </p>

            <p>
              Despite everything, I can't pretend our time together meant nothing to me. You were once a part of my everyday life, someone I looked forward to talking to, laughing with, and sharing the smallest details of my day with. That mattered to me, and the memories don't disappear just because things changed.
            </p>

            <p>
              I wish things had been different. I wish we could have spoken honestly before everything became so distant. There are still questions I never got to ask, but I've accepted that I may never get the answers. Not every story ends with the clarity we hoped for.
            </p>

            <p>
              Whatever happened between us, you will always be a part of my life. I can acknowledge the hurt without denying the good, and I can let go of what happened without pretending it never mattered.
            </p>

            <p>
              So, today, I genuinely hope life brings you happiness, peace, and everything you're working towards. I hope you have plenty of reasons to smile, and that the people in your life treat your trust and care with the same sincerity you hope to receive.
            </p>

            <div className="pt-5 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div>
                <p className="text-base sm:text-lg font-bold" style={{ color: "var(--plum)" }}>
                  Happy Birthday, Ramya. 💜
                </p>
                <p className="hand text-lg sm:text-xl italic mt-0.5" style={{ color: "var(--purple-ink)" }}>
                  Despite everything, I truly hope you're happy. ✨
                </p>
              </div>

              <button
                className="cute-btn ghost sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                onClick={reset}
              >
                <RotateCcw size={14} /> reset the stars
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FEATURE: SEND SOME LOVE BACK & GRAND FINALE */}
      {/* ========================================================================= */}
      <section className="mt-14 pt-8 flex flex-col items-center gap-4" style={{ borderTop: "2px dashed var(--line)" }}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSendLove}
            className="cute-btn flex items-center gap-2 text-base px-6 py-3"
          >
            <Heart size={16} fill="currentColor" /> send some love back
          </button>
          <span className={`love-chip ${loveBump ? "bump" : ""}`}>
            × {heartsSent}
          </span>
          <a href="/" className="cute-btn ghost flex items-center gap-2 text-base px-6 py-3">
            <Home size={16} /> do it all again 🚀
          </a>
        </div>

        {loveMessage && (
          <p className="hand text-lg animate-in fade-in" style={{ color: "var(--purple-ink)" }}>
            {loveMessage}
          </p>
        )}

        <p className="tiny mt-2" style={{ color: "var(--plum-soft)" }}>
          made with an unreasonable amount of care &amp; appreciation 💜
        </p>
      </section>
    </main>
  );
}
