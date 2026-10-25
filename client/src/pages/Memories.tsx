import { useState } from "react";
import { Camera, Sparkles, Heart, ArrowRight, CheckCircle2, Film, Image as ImageIcon, Lock, Unlock, Laugh, PlusCircle, KeyRound } from "lucide-react";
import { PhotoSlot } from "@/components/PhotoSlot";
import { LoveMeter } from "@/components/LoveMeter";
import { launchConfetti } from "@/lib/confetti";
import { playSparkleStrum, playChimeSound, playPopSound } from "@/lib/audio";

type MediaType = "all" | "photos" | "videos";

export interface MediaItem {
  id: number;
  type: "photo" | "video";
  src: string;
  label: string;
  tilt: number;
  tape: "top" | "top-left" | "top-right" | "cross";
  sticker?: string;
  prompt: string;
}

const STANDARD_MEMORY_ITEMS: MediaItem[] = [
  { id: 1, type: "photo", src: "/photos/duo.jpg", label: "01 — The last picture", tilt: -2, tape: "top", sticker: "The last picture", prompt: "Perhaps the most unexpected thing about this picture is that we took it when we barely spoke anymore. Our time in Chennai was coming to an end, and so much between us had changed. Still, I'm glad this moment exists." },
  { id: 2, type: "photo", src: "/photos/beach.jpg", label: "02 — Beach", tilt: 2, tape: "top-left", sticker: "Beach", prompt: "The day I learned some hard truths and realised that trusting blindly wasn't always wise." },
  { id: 3, type: "photo", src: "/photos/wonderla.jpg", label: "03 — Wonderla", tilt: -3, tape: "top-right", sticker: "Wonderla", prompt: "The moment I realised where I stood in your life and understood the limits of my place in it." },
  { id: 4, type: "video", src: "/videos/table_tennis.mp4", label: "04 — Table tennis", tilt: 1, tape: "top", sticker: "Table tennis", prompt: "The little changes in your behaviour around different people that I noticed, but chose to ignore." },
  { id: 5, type: "photo", src: "/photos/fb-cakes.jpg", label: "05 — Little moments", tilt: 3, tape: "cross", sticker: "LITTLE MOMENTS ✨", prompt: "One of those simple moments that became a little memory worth keeping." },
  { id: 6, type: "video", src: "/videos/sleepimg.mp4", label: "06 — Anger shown", tilt: -3, tape: "top-left", sticker: "The moment you showed anger", prompt: "You noticed the anger I showed, but not the little things that had been building up behind it. Sometimes, what we see on the surface isn't the whole story." },
  { id: 7, type: "photo", src: "/photos/sehari.png", label: "07 — Beach video", tilt: 1, tape: "top-right", sticker: "The beach video", prompt: "A little piece of our beach day, captured and edited into something I wanted to remember. Some moments deserve to be kept a little longer." },
  { id: 8, type: "video", src: "/videos/spotlight.mp4", label: "08 — Spotlight incident", tilt: 2, tape: "top", sticker: "The Teams spotlight incident", prompt: "The day a small Teams incident turned into a serious ODC matter. Everyone was trying to clear their name, and the tension was real. Looking back, it's one of those oddly unforgettable moments from our internship." },
];

export const GOOFY_MEMORIES: MediaItem[] = [
  { id: 101, type: "photo", src: "/photos/funny_img.jpg", label: "GOOFY #01", tilt: -2, tape: "cross", sticker: "100% unhinged 🤪", prompt: "" },
  { id: 102, type: "photo", src: "/photos/peek.jpg", label: "GOOFY #02", tilt: 2, tape: "top-left", sticker: "Peek-a-boo 🫣", prompt: "" },
  { id: 103, type: "photo", src: "/photos/peppapig.jpg", label: "GOOFY #03", tilt: -2, tape: "top-right", sticker: "Peppa Pig 🐷", prompt: "" },
  { id: 104, type: "video", src: "/videos/challenge.mp4", label: "GOOFY #04", tilt: 1, tape: "top", sticker: "The Challenge 🎬", prompt: "" },
];

export default function Memories() {
  const [filter, setFilter] = useState<MediaType>("all");
  const [revealed, setRevealed] = useState(false);
  const [goofyVaultUnlocked, setGoofyVaultUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const displayedItems =
    filter === "all"
      ? STANDARD_MEMORY_ITEMS
      : STANDARD_MEMORY_ITEMS.filter((item) => (filter === "photos" ? item.type === "photo" : item.type === "video"));

  const photoCount = STANDARD_MEMORY_ITEMS.filter((i) => i.type === "photo").length;
  const videoCount = STANDARD_MEMORY_ITEMS.filter((i) => i.type === "video").length;

  const handleReveal = () => {
    setRevealed(true);
    playSparkleStrum();
    launchConfetti({
      particleCount: 75,
      shapes: ["heart", "star"],
      colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
    });
  };

  const handlePasswordSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = passwordInput.trim().toUpperCase().replace(/\s+/g, " ");

    // SHA-256 hash checking so secret word is never exposed in plain text in client code or GitHub
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(normalized));
    const inputHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Precomputed SHA-256 hashes for accepted password variations
    const validHashes = new Set([
      "ee2f7a83825bba3de1348f9b54bcc0dc7292653ba2769c4b70d2ceee557f2b50",
      "caf0271dadab4389d47f6b45b311c08979c41007b97b7c7ac958e0d9aa4a48e0",
      "2a00e9ba670535790234d6946ec81080ccd2b5da74e136cd2dae3a3af579e294",
      "ffee0a3f1857b498a9447f476cb9c81dab72853f0b6fecfa9e1f220ad06176ec",
    ]);

    if (validHashes.has(inputHash)) {
      setPasswordError("");
      setGoofyVaultUnlocked(true);
      playSparkleStrum();
      launchConfetti({
        particleCount: 110,
        spread: 90,
        shapes: ["star", "heart", "circle"],
        colors: ["#F5B84E", "#8B5CF6", "#A78BFA", "#C4B5FD", "#FFFFFF"],
      });
    } else {
      setPasswordError("Oops! That's not the secret password 🤭 Check the hint!");
      playPopSound();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  return (
    <main className="chapter inner-chapter page-wrap memories-chapter pt-8 pb-16">
      {/* Chapter Intro */}
      <div className="chapter-intro flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-index">03</span> the memory shelf
          </p>
          <h1>
            Memories &amp; <i>good times.</i>
          </h1>
          <p className="lede">
            Some memories don't need a special occasion to stay with you. These are a few from a time when we laughed a lot, talked a lot, and somehow made ordinary days feel memorable.
          </p>
        </div>
        <img
          src="/gifs/bear_movie.gif"
          alt="Cute Bear Watching Memories"
          className="w-20 h-20 object-contain drop-shadow-md shrink-0"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button type="button" onClick={() => setFilter("all")} className={`filter-pill ${filter === "all" ? "active" : ""}`}>
          All Memories ({STANDARD_MEMORY_ITEMS.length})
        </button>
        <button type="button" onClick={() => setFilter("photos")} className={`filter-pill flex items-center gap-1.5 ${filter === "photos" ? "active" : ""}`}>
          <ImageIcon size={14} /> Photos ({photoCount})
        </button>
        <button type="button" onClick={() => setFilter("videos")} className={`filter-pill flex items-center gap-1.5 ${filter === "videos" ? "active" : ""}`}>
          <Film size={14} /> Videos ({videoCount})
        </button>
      </div>

      {/* Memory Scrapbook Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start my-8">
        {displayedItems.map((slot) => (
          <div key={slot.id} className="w-full">
            <PhotoSlot
              initialImage={slot.src}
              slotLabel={slot.label}
              tiltDeg={slot.tilt}
              tapePosition={slot.tape}
              stickerText={slot.sticker}
              captionPrompt={slot.prompt}
              aspect="portrait"
            />
          </div>
        ))}
      </section>

      {/* Secret Goofy Vault */}
      <section className="my-16 max-w-4xl mx-auto">
        {!goofyVaultUnlocked ? (
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl text-center"
            style={{ background: "linear-gradient(135deg, #f3ebff, #faf5ff, #ede4ff)", border: "2px dashed var(--line)", boxShadow: "0 6px 0 var(--line)" }}>
            <div className="absolute top-4 left-6 text-2xl select-none opacity-30">✦</div>
            <div className="absolute top-8 right-10 text-xl select-none opacity-30">✨</div>
            <div className="absolute bottom-6 left-12 text-2xl select-none opacity-30">✦</div>
            <div className="absolute bottom-6 right-8 text-xl select-none opacity-30 animate-pulse">✨</div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 kicker text-sm"
              style={{ background: "rgba(139,92,246,0.12)", border: "1.5px dashed var(--purple)" }}>
              <Lock size={12} /> Top Secret Classified Vault
            </div>

            <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: "var(--plum)" }}>
              The <i>Favourite Goofy &amp; Funny</i> Photos Vault 🤫
            </h2>

            <p className="text-sm md:text-base mb-5 leading-relaxed" style={{ color: "var(--plum-soft)", maxWidth: "500px", margin: "0 auto 20px" }}>
              Warning: Strictly unfiltered smiles, silly expressions, and zero seriousness ahead. Enter the secret password to unlock my favourite funny photos!
            </p>

            {/* Hint Box */}
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl mb-6 text-sm font-medium transition-all max-w-lg mx-auto"
              style={{ background: "rgba(245, 184, 78, 0.2)", border: "1.5px dashed var(--butter)", color: "var(--plum)" }}>
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <span className="text-xs sm:text-sm">
                <strong>💡 Hint:</strong> Use the language only you and I know... as of my knowledge 🤫
              </span>
            </div>

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full flex-1">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="Enter secret password..."
                  className={`w-full px-5 py-3 rounded-full text-center sm:text-left text-sm font-bold tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[var(--purple)] ${isShaking ? "animate-shake" : ""}`}
                  style={{
                    background: "var(--paper)",
                    border: passwordError ? "2px solid #ef4444" : "2px solid var(--line)",
                    color: "var(--plum)",
                    boxShadow: "0 2px 8px rgba(139,92,246,0.06)"
                  }}
                />
              </div>

              <button
                type="submit"
                className="cute-btn butter flex items-center justify-center gap-2 text-sm w-full sm:w-auto shrink-0"
              >
                <KeyRound size={16} />
                <span>Unlock Photos ✦</span>
              </button>
            </form>

            {passwordError && (
              <p className="text-xs md:text-sm font-bold mt-3 text-red-500 animate-in fade-in flex items-center justify-center gap-1.5">
                <span>{passwordError}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="cute-card relative p-6 md:p-10 animate-in zoom-in-95 duration-500">
            <span className="tape-strip center-tape" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6 mb-8 text-center sm:text-left" style={{ borderColor: "var(--line)" }}>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ background: "var(--butter)", color: "var(--plum)" }}>
                  <Sparkles size={12} /> The Real Favourites · Funny Vault Unlocked
                </span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--plum)" }}>
                  The Hall of <i>Goofiness</i> 🤪💖
                </h2>
                <p className="text-xs md:text-sm mt-1 max-w-xl" style={{ color: "var(--plum-soft)" }}>
                  Anyone can pose for a regular picture, but the candid, unhinged ones where we laughed until our cheeks hurt are the ones that actually matter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGoofyVaultUnlocked(false);
                  setPasswordInput("");
                  setPasswordError("");
                  playPopSound();
                }}
                className="cute-btn ghost sm flex items-center gap-1.5 shrink-0"
              >
                <Lock size={12} /> Close Vault
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {GOOFY_MEMORIES.map((slot) => (
                <div key={slot.id} className="w-full">
                  <PhotoSlot initialImage={slot.src} slotLabel={slot.label} tiltDeg={slot.tilt} tapePosition={slot.tape} stickerText={slot.sticker} captionPrompt={slot.prompt} aspect="portrait" />
                </div>
              ))}
              <div className="w-full">
                <div className="p-6 rounded-xl min-h-[300px] flex flex-col items-center justify-center text-center gap-3 transition-all"
                  style={{ border: "2px dashed var(--line)", background: "var(--cream)" }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(245,184,78,0.2)", border: "1.5px solid var(--butter)", color: "var(--butter-deep)" }}>
                    <PlusCircle size={28} />
                  </div>
                  <strong className="text-base font-bold" style={{ color: "var(--plum)" }}>More Goofy Memories Loading... 📸</strong>
                  <p className="text-xs max-w-[220px] leading-relaxed" style={{ color: "var(--plum-soft)" }}>Reserved slot for the next round of chaotic and funny photos!</p>
                  <span className="text-xs font-bold tracking-widest px-2.5 py-1 rounded-full" style={{ color: "var(--rose-ink)", background: "rgba(242,132,158,0.1)", border: "1.5px solid var(--rose)" }}>
                    ✦ Coming soon ✦
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Ribbon Surprise */}
      <div className="flex flex-col items-center justify-center my-10">
        <button
          className={`cute-btn ${revealed ? "ghost" : ""} flex items-center gap-2`}
          onClick={handleReveal}
        >
          <Camera size={16} />
          {revealed
            ? "Surprise: Maybe this isn't the end of the good memories. Maybe life will surprise us with a few more."
            : "Pull the satin ribbon for a secret note ✦"}
        </button>

        {revealed && (
          <p className="mt-3 hand text-base flex items-center gap-1.5 animate-in fade-in max-w-lg text-center">
            <Heart size={14} fill="currentColor" />
            <span>Whatever happens, I'm genuinely grateful for the memories we already have. They meant more to me than I probably ever said.</span>
          </p>
        )}
      </div>

      {/* Speedometer Love-o-Meter Challenge to Unlock Chapter 4 */}
      <LoveMeter />
    </main>
  );
}
