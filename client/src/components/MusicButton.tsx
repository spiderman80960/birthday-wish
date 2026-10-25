/* Floating Cute Birthday Music Player — Web Audio Music Box Synthesizer */

import { useState, useEffect, useRef } from "react";
import { Music, VolumeX } from "lucide-react";

const NOTES: Record<string, number> = {
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

type NoteStep = [string, number];

const MELODY: NoteStep[] = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2], ["R", 1],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2], ["R", 1],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2], ["R", 1],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2], ["R", 1],
];

export function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = master;
  };

  const playMusicBoxNote = (freq: number, t: number, vel = 0.4) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    // Fundamental note
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    g.connect(master);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * (1 + (Math.random() * 0.003 - 0.0015));
    osc.connect(g);
    osc.start(t);
    osc.stop(t + 1.5);

    // Harmonic chime partial
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(vel * 0.25, t + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    g2.connect(master);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 3.01;
    osc2.connect(g2);
    osc2.start(t);
    osc2.stop(t + 0.6);
  };

  const scheduleMelodyLoop = (t0: number) => {
    if (!isPlayingRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    let t = t0;
    const BEAT = 0.5;

    for (const [note, beats] of MELODY) {
      if (note !== "R" && NOTES[note]) {
        playMusicBoxNote(NOTES[note], t, 0.4);
      }
      t += beats * BEAT;
    }
    t += 2 * BEAT;

    const ms = Math.max(200, (t - ctx.currentTime - 0.3) * 1000);
    timerRef.current = setTimeout(() => {
      scheduleMelodyLoop(t);
    }, ms);
  };

  const toggleMusic = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (masterGainRef.current) {
        const now = ctx.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.2);
      }
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      if (masterGainRef.current) {
        const now = ctx.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(0.55, now);
      }
      scheduleMelodyLoop(ctx.currentTime + 0.1);
    }
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className={`floating-music-btn ${isPlaying ? "playing" : ""}`}
      aria-label={isPlaying ? "Mute music" : "Play birthday music"}
      title={isPlaying ? "Mute birthday music box" : "Play birthday music box 🎵"}
    >
      {isPlaying ? (
        <Music size={20} className="animate-bounce" style={{ animationDuration: "1.2s" }} />
      ) : (
        <VolumeX size={19} className="opacity-70" />
      )}
    </button>
  );
}
