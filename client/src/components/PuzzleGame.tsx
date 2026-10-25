/* Best Friend Memory Match Puzzle Game (inspired by shivangi-tiwari/birthday_wish) */

import { useState, useEffect } from "react";
import { Sparkles, RotateCcw, Trophy, Heart } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playPopSound, playSparkleStrum, playBirthdayMelody } from "@/lib/audio";

interface Card {
  id: number;
  icon: string;
  label: string;
  matched: boolean;
}

const ICONS = [
  { icon: "🍫", label: "Choco Lava" },
  { icon: "🍨", label: "DBC Sundae" },
  { icon: "💖", label: "Best Friends" },
  { icon: "👑", label: "Birthday Queen" },
  { icon: "🎈", label: "Balloons" },
  { icon: "✨", label: "Magic Star" },
];

function generateShuffledCards(): Card[] {
  const deck = [...ICONS, ...ICONS].map((item, index) => ({
    id: index,
    icon: item.icon,
    label: item.label,
    matched: false,
  }));
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function PuzzleGame() {
  const [cards, setCards] = useState<Card[]>(generateShuffledCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setSolved(true);
      playBirthdayMelody();
      launchConfetti({
        particleCount: 120,
        spread: 95,
        shapes: ["star", "heart", "circle"],
        colors: ["#7952e8", "#9667ff", "#d9ccff", "#f7b4c6", "#fedc77", "#ffffff"],
      });
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id)) return;
    const clickedCard = cards.find((c) => c.id === id);
    if (clickedCard?.matched) return;

    playPopSound();
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setFlipped([]);
          playSparkleStrum();
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  const resetGame = () => {
    setCards(generateShuffledCards());
    setFlipped([]);
    setMoves(0);
    setSolved(false);
  };

  return (
    <div className="puzzle-game-box bg-[#fffdfb] dark:bg-[#1a0f2e] border-2 border-[#1d1238] dark:border-[#7952e8] p-6 md:p-8 rounded-xl shadow-[8px_10px_0_rgba(121,82,232,0.2)] flex flex-col items-center text-center my-8">
      <div className="flex items-center justify-between w-full mb-6 flex-wrap gap-3">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#7952e8] dark:text-[#fedc77]" />
            <h3 className="font-['Fraunces'] text-2xl font-bold text-[#1d1238] dark:text-[#ffffff]">
              The Birthday Memory Match
            </h3>
          </div>
          <p className="text-xs text-[#726284] dark:text-[#d1c2eb] mt-1">
            Match all the pairs of sweet memories, choco lava, and sundae treats!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold font-['Fraunces'] text-[#7952e8] bg-[#ede4ff] px-3 py-1.5 rounded-full border border-[#7952e8]/20">
            Moves: {moves}
          </span>
          <button
            type="button"
            onClick={resetGame}
            className="p-2 rounded-full bg-[#f6f0ff] hover:bg-[#ede4ff] text-[#7952e8] transition-colors"
            title="Reset Game"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Grid of 12 Cards (3x4 or 4x3) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 max-w-lg w-full my-2">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              className={`h-20 sm:h-24 rounded-xl border-2 font-bold text-2xl flex flex-col items-center justify-center transition-all duration-300 transform select-none ${
                isFlipped
                  ? card.matched
                    ? "bg-[#ede4ff] dark:bg-[#2e1752] border-[#7952e8] shadow-xs scale-95 opacity-90"
                    : "bg-[#fffdfb] dark:bg-[#251540] border-[#7952e8] shadow-md scale-100"
                  : "bg-[#7952e8] hover:bg-[#673ee0] border-[#1d1238] shadow-[3px_4px_0_#1d1238] hover:-translate-y-0.5"
              }`}
            >
              {isFlipped ? (
                <div className="flex flex-col items-center animate-in zoom-in-75 duration-200">
                  <span className="text-2xl sm:text-3xl">{card.icon}</span>
                  <span className="text-[8px] font-black uppercase tracking-wider text-[#7952e8] dark:text-[#fedc77] mt-1">
                    {card.label}
                  </span>
                </div>
              ) : (
                <span className="text-white text-lg font-['Fraunces']">✦</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Banner */}
      {solved && (
        <div className="mt-6 p-4 bg-[#fedc77] border-2 border-[#1d1238] rounded-xl flex items-center justify-between gap-4 max-w-md w-full animate-in zoom-in-75 duration-300">
          <div className="flex items-center gap-3 text-left">
            <Trophy size={28} className="text-[#7952e8] shrink-0" />
            <div>
              <strong className="font-['Fraunces'] text-sm text-[#1d1238] block">
                Ramya solved the puzzle in {moves} moves!
              </strong>
              <small className="text-[10px] text-[#391757] font-bold">
                Ramya is the ultimate champion of celebrations & chocolate!
              </small>
            </div>
          </div>
          <button
            type="button"
            onClick={resetGame}
            className="px-3 py-1.5 bg-[#7952e8] text-white text-xs font-bold rounded-lg shrink-0 shadow-xs hover:bg-[#673ee0]"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
