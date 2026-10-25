/* Birthday celebration: Chapter 1 (The Start) — Cute & Aesthetic Restyle */

import { useState } from "react";
import { Heart, Sparkles, Wand2 } from "lucide-react";
import { PhotoSlot } from "@/components/PhotoSlot";
import { CelebrationSequence } from "@/components/CelebrationSequence";
import { launchConfetti } from "@/lib/confetti";
import { playSparkleStrum } from "@/lib/audio";

export default function Home() {
  const [secret, setSecret] = useState(false);

  const handleUnlockSecret = () => {
    setSecret(true);
    playSparkleStrum();
    launchConfetti({
      particleCount: 70,
      colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F5B84E", "#FFFFFF"],
    });
  };

  return (
    <main className="chapter home-chapter page-wrap relative pt-8 pb-16">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-copy">
          <p className="kicker">
            <span className="kicker-badge">✦</span>
            a special corner · made just for you
          </p>
          <div className="flex items-center gap-4">
            <h1>
              Happy Birthday,<br />
              <i>Ramya!</i> 🎉
            </h1>
            <img
              src="/gifs/bubu-cute-dancing.gif"
              alt="Cute Dancing Bear"
              className="w-16 h-16 object-contain drop-shadow-md shrink-0"
            />
          </div>
          <p className="lede mt-4">
            A little corner of the internet, made just for you. Filled with little notes, familiar memories, and a few things I wanted you to know on your special day. Some moments are too meaningful to let them pass without a little celebration.
          </p>

          <div className="hero-actions">
            <button className="cute-btn" onClick={handleUnlockSecret}>
              <Wand2 size={16} />
              {secret ? "secret unlocked ✨" : "tap for a quick surprise"}
            </button>
          </div>

          {secret && (
            <p className="secret-note animate-in fade-in" role="status">
              <Heart size={14} fill="currentColor" />
              It's funny how life brings certain people into our world when we least expect it. Some become part of our routine, some leave us with stories to tell, and some give us memories we'll always be glad we made. 💜
            </p>
          )}
        </div>

        {/* Hero Photo Slot */}
        <div className="home-art-wrap flex flex-col items-center justify-center">
          <div className="burst-sticker">
            birthday<br />
            vibes<br />
            <i>✨</i>
          </div>

          <div className="w-full max-w-sm">
            <PhotoSlot
              initialImage="/photos/main-photo.jpg"
              slotLabel="BIRTHDAY ✦"
              tiltDeg={-2}
              stickerText="pure sunshine"
              captionPrompt="Happy Birthday, Ramya!"
            />
          </div>

          <div className="art-caption mt-6">
            good vibes &amp; celebration <span>✦</span>
          </div>
        </div>
      </section>

      {/* Step-by-Step Celebration Sequence */}
      <section className="my-10">
        <p className="kicker mb-3">
          <Sparkles size={15} />
          let's set the scene
        </p>
        <CelebrationSequence />
      </section>
    </main>
  );
}
