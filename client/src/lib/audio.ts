/* Web Audio API based cute sound synthesizer for birthday chimes, pops, and fanfares */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Pop sound for balloon popping or buttons */
export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  const now = ctx.currentTime;

  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

/** Gentle chime when stars or items are collected */
export function playChimeSound(pitchMultiplier = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * pitchMultiplier, now + idx * 0.06);

    gain.gain.setValueAtTime(0.18, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.36);
  });
}

/** Cake blow out whoosh / sparkle sound */
export function playBlowSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Noise buffer for gentle breath/sparkle
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 800;
  filter.Q.value = 1.2;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.4);
}

/** Celebratory Birthday Fanfare / Happy Melody snippet */
export function playBirthdayMelody() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Happy Birthday first 6 notes (G4, G4, A4, G4, C5, B4)
  const melody = [
    { freq: 392.0, duration: 0.25, time: 0 },
    { freq: 392.0, duration: 0.25, time: 0.28 },
    { freq: 440.0, duration: 0.5, time: 0.56 },
    { freq: 392.0, duration: 0.5, time: 1.1 },
    { freq: 523.25, duration: 0.5, time: 1.65 },
    { freq: 493.88, duration: 0.9, time: 2.2 },
  ];

  const now = ctx.currentTime;

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    gain.gain.setValueAtTime(0.22, now + note.time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.duration + 0.05);
  });
}

/** Cute success sparkle strum */
export function playSparkleStrum() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.04);

    gain.gain.setValueAtTime(0.15, now + idx * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.04);
    osc.stop(now + idx * 0.04 + 0.45);
  });
}
