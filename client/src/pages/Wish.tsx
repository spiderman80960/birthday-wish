/* Birthday celebration: Chapter 6 (The Birthday Wish Room) — Dreamy Purple Restyle */

import { useState } from "react";
import { Check, RotateCcw, Sparkles, Send, Moon, Sun, Heart, Home } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playChimeSound, playSparkleStrum, playBirthdayMelody } from "@/lib/audio";
import { useTheme } from "@/contexts/ThemeContext";
import { sendWishEmail } from "@/lib/email";

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
  const [customWish, setCustomWish] = useState("");
  const [launchedWish, setLaunchedWish] = useState<string | null>(null);
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

  const handleLaunchWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWish.trim()) return;
    setLaunchedWish(customWish.trim());
    playSparkleStrum();
    launchConfetti({
      particleCount: 110,
      spread: 90,
      shapes: ["star", "heart"],
      colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
    });
    // Send launched wish to Raghav via EmailJS
    sendWishEmail(customWish.trim(), "star_room");
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
    setLaunchedWish(null);
    setCustomWish("");
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

          {/* Custom Wish Launcher */}
          <div className="mt-8 cute-card p-5 relative">
            <span className="tape-strip left-tape" />
            <h3 className="text-sm font-bold flex items-center gap-1.5 mb-3" style={{ color: "var(--plum)" }}>
              <Sparkles size={14} style={{ color: "var(--purple)" }} /> What is your biggest birthday wish?
            </h3>
            {!launchedWish ? (
              <form onSubmit={handleLaunchWish} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                  placeholder="Type your secret wish here..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl outline-none"
                  style={{
                    background: "#FAF7FF",
                    border: "2px solid var(--line)",
                    color: "var(--plum)",
                    fontFamily: "Baloo 2, sans-serif",
                  }}
                />
                <button
                  type="submit"
                  disabled={!customWish.trim()}
                  className="cute-btn sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={13} /> Launch Wish to the Stars
                </button>
              </form>
            ) : (
              <div
                className="mt-2 p-3 rounded-xl animate-in zoom-in-75"
                style={{ background: "#F3EBFF", border: "1.5px dashed var(--purple)" }}
              >
                <p className="hand text-base" style={{ color: "var(--plum)" }}>"{launchedWish}"</p>
                <small className="text-xs font-bold mt-1 block" style={{ color: "var(--purple-ink)" }}>
                  ✦ Locked in the stars for your birthday ✦
                </small>
              </div>
            )}
          </div>
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

      {/* Completion Reveal Card */}
      <section className={`wish-reveal ${complete ? "visible" : ""}`} aria-live="polite">
        <div className="reveal-icon">
          <Check size={22} />
        </div>
        <div className="space-y-3">
          <p className="kicker text-sm">A quiet birthday wish for you, Ramya</p>
          <h2>
            May this year bring you peace, laughter, and <i>genuine happiness.</i>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--plum-soft)" }}>
            I hope this birthday gives you everything you deserve. We shared a chapter during the internship that became a really special part of my everyday life. Even though things aren't the same now, I don't want to forget how happy and effortless that time was — the calls, the teasing, the trips, the games, and all the random laughter.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--plum-soft)" }}>
            I don't know what the future looks like for us, and I'm not asking it to be anything specific. If someday we naturally find our way back to talking like we used to, I'll honestly be very happy. If life takes us in different directions, that's okay too — I'll always be grateful for the time we shared.
          </p>
          <p className="hand text-base pt-2">
            Happy Birthday, Ramya. I genuinely hope you're happy. ✨
          </p>
        </div>
        {complete && (
          <button className="cute-btn ghost sm mt-4 flex items-center gap-1" onClick={reset}>
            <RotateCcw size={15} /> reset the stars
          </button>
        )}
      </section>

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
