/* Birthday celebration: Chapter 2 (The Folded Letter & 5 Envelopes) — Dreamy Purple Restyle */

import { useState, useRef, useEffect } from "react";
import { Heart, Sparkles, ArrowRight, Smile, Mail, MailOpen, Lock, Unlock, KeyRound } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playPopSound, playSparkleStrum, playChimeSound } from "@/lib/audio";

interface NoteItem {
  tag: string;
  title: string;
  message: string;
}



function renderLetterParagraph(text: string, idx: number) {
  const isSpecialCallout =
    text.startsWith("**") && text.endsWith("**") && text.length > 30;

  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return (
    <p
      key={idx}
      className={`leading-relaxed text-[15px] md:text-base ${
        isSpecialCallout
          ? "py-2.5 px-4 my-2.5 rounded-xl bg-purple-50/80 border-l-4 border-[var(--purple)] text-[var(--plum)] font-semibold shadow-2xs"
          : "text-[var(--plum)]"
      }`}
    >
      {parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-[var(--plum)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em
              key={pIdx}
              className="font-['Caveat'] text-lg md:text-xl font-bold text-[var(--purple-ink)] not-italic"
            >
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      })}
    </p>
  );
}

const MINI_LETTERS: NoteItem[] = [
  {
    tag: "NOTE NO. 1 · THE HAPPY ONE",
    title: "Your laugh 😂✨",
    message:
      "Your laugh should honestly be classified as a public good. 😂 You have no idea how many ordinary moments became happy memories just because you were part of them. I hope you never lose that laugh.",
  },
  {
    tag: "NOTE NO. 2 · THE NOSTALGIC ONE",
    title: "Our ordinary days 🎈",
    message:
      "It's funny how nightly calls, random teasing, silly conversations, and sharing the little details of a day can become some of your favourite memories. Back then, they felt so ordinary. Looking back, I realise they weren't ordinary to me at all.",
  },
  {
    tag: "NOTE NO. 3 · THE BITTERSWEET ONE",
    title: "Some things stay 🌸",
    message:
      "Life is strange. Sometimes, people who once knew the smallest details of each other's days slowly become people who know much less. But that doesn't erase the days when talking to you was one of my favourite parts of the day.",
  },
  {
    tag: "NOTE NO. 4 · THE ONE THAT MAKES HER THINK",
    title: "A little reminder ☀️",
    message:
      "I hope the people you care about never have to wonder whether they matter to you. Sometimes, the smallest things—being included, being remembered, feeling considered—mean more than we realise. We don't always know how much a little gesture matters to someone until we look back.",
  },
  {
    tag: "NOTE NO. 5 · THE HEARTFELT ONE",
    title: "What I wish for you 🌌",
    message:
      "If wishes came true in proportion to how much happiness someone deserves, I hope the universe has an endless supply waiting for you. And I hope that, someday, when you look back on our time in Chennai, you remember that there was someone who genuinely cared about you, rooted for you, and was grateful to have you in his life. Happy birthday. 💜",
  },
];

const HIGH_FIVE_STAGES = [
  {
    btnText: "🤗 Send a Birthday Hug across the distance",
    taunt: "Just a gentle reminder that your birthday will always be special! ✨",
    status: "Warmth: 🌸 Sending Good Vibes",
    badge: "Step 1",
  },
  {
    btnText: "✨ Floating through time and memories...",
    taunt: "Remembering all the fun moments we used to share back then. 😊",
    status: "Nostalgia: 💭 Sweet Memories",
    badge: "Step 2",
  },
  {
    btnText: "🌸 People drift, but good memories stay untarnished.",
    taunt: "Even though life took us in different directions, I still root for you! 🌟",
    status: "Friendship: 🕊️ Quiet Appreciation",
    badge: "Step 3",
  },
  {
    btnText: "💫 I'm really glad for the chapter we shared.",
    taunt: "Every laugh and shared smile from back then is still cherished. 💜",
    status: "Gratitude: 🌷 Always Grateful",
    badge: "Step 4",
  },
  {
    btnText: "🤗 Waiting right here for you. Tap to connect! 💜",
    taunt: "Wishing you genuine peace, laughter, and so much happiness today! ✨",
    status: "Connection: 🎯 Ready & Waiting",
    badge: "Final Step",
  },
];

export default function Letter() {
  // 5 Mini Envelopes State
  const [openedEnvelopes, setOpenedEnvelopes] = useState<boolean[]>([false, false, false, false, false]);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);

  // Full Long Letter State & Password Protection
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [letterData, setLetterData] = useState<{ title: string; subtitle: string; paragraphs: string[] } | null>(null);
  const [fullLetterOpened, setFullLetterOpened] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccessAnim, setUnlockSuccessAnim] = useState(false);

  const secretInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      sessionStorage.removeItem("ramya_letter_unlocked");
      sessionStorage.removeItem("ramya_letter_data");
    } catch {}
  }, []);

  const handleEnvelopeClick = () => {
    setShowPasswordPrompt(true);
    playPopSound();
    setTimeout(() => {
      secretInputRef.current?.focus();
    }, 150);
  };

  // Playful High-Five Dodge Game State
  const [dodgeCount, setDodgeCount] = useState(0);
  const [hugOffset, setHugOffset] = useState({ x: 0, y: 0, rot: 0 });
  const [hugCaught, setHugCaught] = useState(false);
  const [poofEmoji, setPoofEmoji] = useState<{ x: number; y: number; text: string } | null>(null);

  const openMiniEnvelope = (idx: number) => {
    setActiveLetterIdx(idx);
    playChimeSound(1 + idx * 0.12);

    if (!openedEnvelopes[idx]) {
      const next = [...openedEnvelopes];
      next[idx] = true;
      setOpenedEnvelopes(next);

      launchConfetti({
        particleCount: 50,
        shapes: ["heart", "star"],
        colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
      });
    }
  };

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = secretInput.trim().toLowerCase();
    if (!clean) {
      setUnlockError("Please enter the secret word ✨");
      playPopSound();
      return;
    }

    setIsUnlocking(true);
    setUnlockError(null);

    // Call server endpoint
    try {
      const alreadyNotified = sessionStorage.getItem("ramya_letter_notified") === "true";
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

      const res = await fetch("/api/unlock-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: clean,
          websiteUrl: window.location.origin,
          timezone: userTz,
          sessionId: !alreadyNotified ? undefined : "already_notified"
        })
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Non-JSON response from /api/unlock-letter:", res.status, jsonErr);
      }

      if (!res.ok || !data || !data.success || !data.letter) {
        const errorMsg = data?.error || (res.status === 401
          ? "Hmm, not quite! Think about what we used to call each other. 🥹"
          : "Could not verify code. Please check your connection and try again.");
        setUnlockError(errorMsg);
        playPopSound();
        setIsUnlocking(false);
        return;
      }

      setLetterData(data.letter);
      try {
        sessionStorage.setItem("ramya_letter_data", JSON.stringify(data.letter));
      } catch {}
      sessionStorage.setItem("ramya_letter_notified", "true");

      setIsUnlocking(false);
      setUnlockSuccessAnim(true);
      playSparkleStrum();
      playChimeSound(1.2);
      launchConfetti({
        particleCount: 120,
        spread: 90,
        shapes: ["heart", "star", "circle"],
        colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
      });

      setTimeout(() => {
        setIsUnlocked(true);
        setFullLetterOpened(true);
        setUnlockSuccessAnim(false);
      }, 700);
    } catch (err) {
      console.warn("Unlock API offline/unreachable:", err);
      setUnlockError("Could not reach verification server. Please check your connection and try again.");
      playPopSound();
      setIsUnlocking(false);
    }
  };

  const toggleFullLetter = () => {
    if (!fullLetterOpened) {
      setFullLetterOpened(true);
      playSparkleStrum();
      launchConfetti({
        particleCount: 85,
        shapes: ["heart", "star", "circle"],
        colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
      });
    } else {
      setFullLetterOpened(false);
      playPopSound();
    }
  };

  const handleHugAttempt = () => {
    if (dodgeCount < HIGH_FIVE_STAGES.length - 1) {
      // Calculate funny random jump position inside bounded arena
      const nextX = Math.round((Math.random() - 0.5) * 260);
      const nextY = Math.round((Math.random() - 0.5) * 100);
      const nextRot = Math.round((Math.random() - 0.5) * 28);

      // Leave a gentle sparkle / sweet emoji where the button was
      setPoofEmoji({
        x: hugOffset.x,
        y: hugOffset.y,
        text: ["✨", "🌸", "💫", "🌷", "💜"][dodgeCount % 5],
      });
      setTimeout(() => setPoofEmoji(null), 700);

      setHugOffset({ x: nextX, y: nextY, rot: nextRot });
      setDodgeCount((c) => c + 1);
      playPopSound();
    } else {
      // Caught the high-five!
      setHugCaught(true);
      playSparkleStrum();
      launchConfetti({
        particleCount: 130,
        spread: 100,
        shapes: ["heart", "star", "circle"],
        colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
      });
    }
  };

  const handleCheatSurrender = () => {
    setDodgeCount(HIGH_FIVE_STAGES.length - 1);
    setHugOffset({ x: 0, y: 0, rot: 0 });
    playChimeSound(1.2);
  };

  const resetHighFive = () => {
    setDodgeCount(0);
    setHugOffset({ x: 0, y: 0, rot: 0 });
    setHugCaught(false);
    setPoofEmoji(null);
  };

  const openedCount = openedEnvelopes.filter(Boolean).length;
  const tilts = [-6, 4, -3, 6, -5];

  return (
    <main className="chapter inner-chapter page-wrap pt-8 pb-16">
      {/* Chapter Intro */}
      <div className="chapter-intro">
        <p className="eyebrow">
          <span className="eyebrow-index">02</span> the mailroom
        </p>
        <h1>
          Letters &amp; little notes <i>for you.</i>
        </h1>
        <p className="lede">
          Five little envelopes sealed with love, plus a heartfelt letter to celebrate your special day.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE: 5 SMALL ENVELOPES & LETTER REVEAL */}
      {/* ========================================================================= */}
      <section className="my-8 cute-card p-6 md:p-8 flex flex-col items-center text-center">
        <span className="tape-strip center-tape" />
        <p className="kicker mb-1">psst… there's mail for you</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "var(--plum)" }}>
          Five little envelopes, sealed with love
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--plum-soft)" }}>
          Open them one by one — each holds a special birthday thought for you!
        </p>

        {/* The 5 Mini Envelopes Row */}
        <div className="env-row">
          {MINI_LETTERS.map((note, i) => {
            const isOpen = openedEnvelopes[i];
            const isSelected = activeLetterIdx === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => openMiniEnvelope(i)}
                className={`env-mini ${isOpen ? "open read" : ""} ${isSelected ? "ring-2 ring-[#8B5CF6] rounded-xl" : ""}`}
                style={{ "--tilt": `${tilts[i % tilts.length]}deg` } as React.CSSProperties}
                aria-label={`Open letter envelope ${i + 1}: ${note.title}`}
                title={`Open envelope ${i + 1}: ${note.title}`}
              >
                <span className="env-mini-body" />
                <span className="env-mini-card" />
                <span className="env-mini-flap" />
                <span className="env-mini-seal">
                  <Heart size={11} fill="currentColor" />
                </span>
                <span className="env-mini-num">{i + 1}</span>
              </button>
            );
          })}
        </div>

        <p className="hand text-base counter mt-3" style={{ color: "var(--purple-ink)" }}>
          {openedCount} of 5 opened
        </p>

        {/* Revealed Mini Note Display Card */}
        <div className="cute-card w-full max-w-xl p-6 md:p-8 my-4 text-left relative animate-in fade-in duration-300">
          <span className="tape-strip center-tape" />
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 mb-3">
            <span className="tiny font-bold uppercase tracking-wider" style={{ color: "var(--purple)" }}>
              {activeLetterIdx !== null ? `✦ ${MINI_LETTERS[activeLetterIdx].tag}` : "✦ Pick an envelope"}
            </span>
            <Sparkles size={14} style={{ color: "var(--butter-deep)" }} />
          </div>

          {activeLetterIdx !== null ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-xl md:text-2xl font-bold leading-snug" style={{ color: "var(--plum)" }}>
                {MINI_LETTERS[activeLetterIdx].title}
              </h3>
              <p className="hand text-lg md:text-xl leading-relaxed" style={{ color: "var(--plum)" }}>
                “{MINI_LETTERS[activeLetterIdx].message}”
              </p>
            </div>
          ) : (
            <p className="hand text-lg md:text-xl leading-relaxed py-2 text-center" style={{ color: "var(--plum)" }}>
              pick any little envelope above — your notes are waiting inside… ✨
            </p>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FULL HEARTFELT LETTER SECTION */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* FULL HEARTFELT LETTER SECTION (PASSWORD PROTECTED) */}
      {/* ========================================================================= */}
      <section className="my-12 flex flex-col items-center justify-center">
        {!isUnlocked ? (
          !showPasswordPrompt ? (
            /* Initial state: The sealed letter envelope */
            <div className="relative w-full max-w-lg flex flex-col items-center animate-in fade-in duration-300">
              <div className="envelope-backdrop" />
              <div
                onClick={handleEnvelopeClick}
                className="envelope cursor-pointer select-none group"
                role="button"
                tabIndex={0}
                aria-label="Click to unlock Ramya's birthday letter"
              >
                <div className="envelope-flap" />
                <div className="envelope-front" />
                <div className="letter-paper">
                  <p className="paper-kicker">✦ sealed with a secret word</p>
                </div>

                {/* Lock Wax Seal */}
                <div
                  className="envelope-seal flex items-center justify-center transition-all group-hover:scale-110 shadow-md"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
                >
                  <Lock size={19} className="text-white" />
                </div>

                {/* Address */}
                <div className="envelope-address">
                  <span
                    className="font-['Baloo_2'] text-lg font-bold block leading-tight"
                    style={{ color: "var(--plum)" }}
                  >
                    to: Ramya ✨
                  </span>
                  <small>tap to unlock letter</small>
                </div>
              </div>

              <p
                className="stage-hint mt-5 flex items-center gap-1.5 cursor-pointer hover:opacity-100 transition-opacity"
                onClick={handleEnvelopeClick}
              >
                <Lock size={16} /> tap the letter to enter the secret code
              </p>
            </div>
          ) : (
            /* When clicked: The unlock & password entry screen appears */
            <div className="relative w-full max-w-lg flex flex-col items-center animate-in zoom-in-95 duration-300">
              {/* Sealed Envelope Graphic */}
              <div className="envelope-backdrop" />
              <div
                className={`envelope select-none transition-transform ${
                  unlockSuccessAnim ? "scale-105" : ""
                }`}
                aria-label="Locked birthday letter for Ramya"
              >
                <div className="envelope-flap" />
                <div className="envelope-front" />
                <div className="letter-paper">
                  <p className="paper-kicker">✦ sealed with a secret word</p>
                </div>

                {/* Lock Wax Seal */}
                <div
                  className={`envelope-seal flex items-center justify-center transition-all ${
                    unlockSuccessAnim ? "scale-125" : ""
                  }`}
                  style={{
                    background: unlockSuccessAnim
                      ? "linear-gradient(135deg, #10B981, #059669)"
                      : "linear-gradient(135deg, #7C3AED, #A855F7)",
                  }}
                >
                  {unlockSuccessAnim ? (
                    <Unlock size={20} className="text-white animate-bounce" />
                  ) : (
                    <Lock size={19} className="text-white" />
                  )}
                </div>

                {/* Address */}
                <div className="envelope-address">
                  <span
                    className="font-['Baloo_2'] text-lg font-bold block leading-tight"
                    style={{ color: "var(--plum)" }}
                  >
                    to: Ramya ✨
                  </span>
                  <small>password-protected letter</small>
                </div>
              </div>

              {/* Romantic Password Entry Screen */}
              <div className="cute-card w-full p-6 md:p-8 mt-7 text-center relative shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                <span className="tape-strip center-tape" />

                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ background: "var(--purple-soft)", color: "var(--purple-deep)" }}
                >
                  <KeyRound size={13} />
                  <span>✦ A Secret for Ramya's Eyes Only ✦</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-1.5" style={{ color: "var(--plum)" }}>
                  Unlock Ramya's Birthday Letter 💜
                </h3>

                <p className="text-xs mb-4" style={{ color: "var(--plum-soft)" }}>
                  Before this folded letter unfolds, enter the special word that belongs to our time together.
                </p>

                {/* Hint Callout */}
                <div
                  className="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-['Caveat'] text-lg font-bold mb-5 border border-purple-200 inline-block"
                  style={{ background: "#F5EFFE", color: "var(--purple-ink)" }}
                >
                  💭 Hint: “The name we used to call each other 💜”
                </div>

                {/* Unlock Form */}
                <form onSubmit={handleUnlock} className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
                  <div className="relative w-full">
                    <input
                      ref={secretInputRef}
                      type="text"
                      value={secretInput}
                      onChange={(e) => {
                        setSecretInput(e.target.value);
                        if (unlockError) setUnlockError(null);
                      }}
                      placeholder="Enter our secret word..."
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className="w-full px-5 py-3 pr-11 rounded-full border-2 border-[var(--line)] bg-white text-center font-['Baloo_2'] text-base font-semibold focus:outline-none focus:border-[var(--purple)] focus:ring-4 focus:ring-purple-200 transition-all shadow-xs"
                      disabled={isUnlocking || unlockSuccessAnim}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none">
                      {unlockSuccessAnim ? (
                        <Unlock size={18} className="text-emerald-500" />
                      ) : (
                        <Lock size={18} />
                      )}
                    </div>
                  </div>

                  {unlockError && (
                    <div className="text-xs md:text-sm font-bold text-rose-600 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl animate-in fade-in duration-200">
                      {unlockError}
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-full mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordPrompt(false);
                        setUnlockError(null);
                        playPopSound();
                      }}
                      disabled={isUnlocking || unlockSuccessAnim}
                      className="cute-btn ghost sm py-3 text-xs md:text-sm font-bold flex-1 cursor-pointer"
                    >
                      Fold back
                    </button>
                    <button
                      type="submit"
                      disabled={isUnlocking || unlockSuccessAnim}
                      className="cute-btn py-3 text-sm md:text-base flex-[2] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isUnlocking ? (
                        <>
                          <Sparkles size={16} className="animate-spin" />
                          <span>Unlocking...</span>
                        </>
                      ) : unlockSuccessAnim ? (
                        <>
                          <Unlock size={16} />
                          <span>Unlocked! ✨</span>
                        </>
                      ) : (
                        <>
                          <Heart size={16} fill="currentColor" />
                          <span>Unlock Letter 💜</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        ) : !fullLetterOpened ? (
          /* Unlocked Envelope - Ready to re-open or fold */
          <div className="relative w-full max-w-lg flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="envelope-backdrop" />
            <div
              onClick={toggleFullLetter}
              className="envelope cursor-pointer select-none"
              role="button"
              tabIndex={0}
              aria-label="Open Ramya's full birthday letter"
            >
              <div className="envelope-flap" />
              <div className="envelope-front" />
              <div className="letter-paper">
                <p className="paper-kicker">✦ the complete folded letter</p>
              </div>

              {/* Unlocked wax seal */}
              <div className="envelope-seal" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
                <Heart size={20} className="fill-current text-white" />
              </div>

              {/* Address */}
              <div className="envelope-address">
                <span
                  className="font-['Baloo_2'] text-lg font-bold block leading-tight"
                  style={{ color: "var(--plum)" }}
                >
                  to: Ramya ✨
                </span>
                <small>unlocked · tap to read</small>
              </div>
            </div>

            <p className="stage-hint mt-5">
              <MailOpen size={16} /> tap the wax seal to read your letter
            </p>
          </div>
        ) : (
          /* The Full Unlocked Heartfelt Letter Card */
          <div className="cute-card w-full max-w-2xl p-7 md:p-11 animate-in zoom-in-95 duration-400 relative">
            <span className="tape-strip center-tape" />
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-6">
              <span className="kicker text-sm">✦ Birthday Letter for Ramya 💜</span>
              <button
                type="button"
                onClick={toggleFullLetter}
                className="cute-btn ghost sm flex items-center gap-1.5"
              >
                <Mail size={13} /> Fold back
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black mb-1.5" style={{ color: "var(--plum)" }}>
                {letterData?.title || "A Birthday Letter for Ramya 💜"}
              </h2>
              <p className="hand text-lg md:text-xl" style={{ color: "var(--purple-ink)" }}>
                {letterData?.subtitle || "Wishing you a beautiful year ahead."}
              </p>
            </div>

            <div className="space-y-4">
              {(letterData?.paragraphs || []).map((paragraph, idx) =>
                renderLetterParagraph(paragraph, idx)
              )}
            </div>

            <div className="mt-9 pt-4 border-t border-[var(--line)] flex items-center justify-between">
              <span className="hand text-base md:text-lg">Always wishing you the very best ✨</span>
              <Sparkles size={18} style={{ color: "var(--purple)" }} />
            </div>
          </div>
        )}
      </section>

      {/* A Little Birthday Hug Mini Moment */}
      <section className="my-14 cute-card p-6 md:p-8 max-w-2xl mx-auto text-center relative overflow-hidden">
        <span className="tape-strip center-tape" />
        <div className="flex items-center justify-center gap-2 mb-2 kicker">
          <Heart size={16} /> Across The Miles · A Little Birthday Hug
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "var(--plum)" }}>
          A Little Birthday Hug 🤗✨
        </h3>
        <p className="text-xs max-w-md mx-auto mb-5" style={{ color: "var(--plum-soft)" }}>
          A little birthday surprise sent across time and distance. Even if things aren't quite the same as they used to be, some memories are still worth celebrating. here's a little something to make you smile. Tap to connect!
        </p>

        {!hugCaught ? (
          <div className="flex flex-col items-center">
            {/* Nostalgic Thought Speech Bubble */}
            <div
              className="px-4 py-2 rounded-2xl text-xs md:text-sm font-['Caveat'] text-lg font-bold mb-3 shadow-xs border border-purple-200 animate-in fade-in duration-200"
              style={{ background: "#F5EFFE", color: "var(--purple-ink)" }}
            >
              💭 “{HIGH_FIVE_STAGES[dodgeCount].taunt}”
            </div>

            {/* Dodge Arena Box */}
            <div className="relative w-full max-w-lg h-52 sm:h-60 rounded-2xl border-2 border-dashed border-[var(--line)] bg-[#faf5ff] flex items-center justify-center overflow-hidden my-2 select-none shadow-inner">
              {/* Gentle watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <span className="text-7xl">🤗</span>
              </div>

              {/* Floating dust/smoke poof left behind on dodge */}
              {poofEmoji && (
                <div
                  className="absolute pointer-events-none text-2xl animate-out fade-out zoom-out duration-700"
                  style={{
                    transform: `translate(${poofEmoji.x}px, ${poofEmoji.y}px)`,
                  }}
                >
                  {poofEmoji.text}
                </div>
              )}

              {/* The Slippery Hug Button */}
              <button
                type="button"
                onClick={handleHugAttempt}
                onMouseEnter={dodgeCount < HIGH_FIVE_STAGES.length - 1 ? handleHugAttempt : undefined}
                style={{
                  transform: `translate(${hugOffset.x}px, ${hugOffset.y}px) rotate(${hugOffset.rot}deg)`,
                  transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                className={`cute-btn text-sm md:text-base py-3 px-6 select-none cursor-pointer ${
                  dodgeCount === HIGH_FIVE_STAGES.length - 1
                    ? "animate-bounce ring-4 ring-purple-300 shadow-xl"
                    : ""
                }`}
              >
                <Heart size={16} fill="currentColor" />
                {HIGH_FIVE_STAGES[dodgeCount].btnText}
              </button>
            </div>

            {/* Status Bar & Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full border border-[var(--line)]"
                style={{ background: "#fff", color: "var(--plum)" }}
              >
                {HIGH_FIVE_STAGES[dodgeCount].status}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: "var(--butter)", color: "var(--plum)" }}
              >
                {HIGH_FIVE_STAGES[dodgeCount].badge}
              </span>
            </div>

            {/* Skip if missed 2+ times */}
            {dodgeCount >= 2 && dodgeCount < HIGH_FIVE_STAGES.length - 1 && (
              <button
                type="button"
                onClick={handleCheatSurrender}
                className="mt-3 text-xs underline font-bold transition-opacity hover:opacity-100 opacity-70 cursor-pointer"
                style={{ color: "var(--purple-ink)" }}
              >
                🤍 Skip the chase (I just want to connect the hug!)
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-75 duration-300">
            <img
              src="/gifs/hug-rabbit.jpg"
              alt="Cute Hug Rabbit"
              className="w-36 h-36 object-contain rounded-2xl border-2 border-[var(--line)] shadow-md select-none pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="cute-card p-6 max-w-md text-center border-2 border-[var(--line)]">
              <span className="text-4xl block mb-2">🤗✨</span>
              <h4 className="text-xl md:text-2xl font-black mb-1" style={{ color: "var(--plum)" }}>
                A Little Warmth Across The Distance 🤗✨
              </h4>
              <p className="hand text-lg mb-2" style={{ color: "var(--purple-ink)" }}>
                Some friendships may grow quiet, but the warmth of those memories stays.
              </p>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={{ background: "var(--purple-soft)", color: "var(--purple-deep)" }}
              >
                ✦ A Little Birthday Wish From An Old Friend ✦
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--plum-soft)" }}>
                Even though things aren't the same as they used to be and life has taken us in different directions, I'm truly grateful for the chapter we shared. Today is all about celebrating you. I hope this year brings you lots of laughter, little surprises, and genuine happiness.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetHighFive}
                className="cute-btn ghost sm cursor-pointer"
              >
                One More Time ✨
              </button>
              <a href="/memories" className="cute-btn flex items-center gap-2">
                Step Into The Memory Box 📸 <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
