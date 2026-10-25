/* Twinkling star cursor trail — aesthetic purple & gold 4-pointed sparkle stars */

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  rot: number;
  vrot: number;
  life: number;
  maxLife: number;
  color: string;
}

// Aesthetic purple and warm sparkle color palette
const COLORS = [
  "#8B5CF6", // primary vibrant purple
  "#A78BFA", // soft lavender
  "#C4B5FD", // light lilac
  "#DDD6FE", // pale lilac
  "#F5B84E", // golden butter star
  "#FDE047", // bright gold
  "#F472B6", // gentle rose accent
  "#FFFFFF", // sparkling white
];

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  // 4-pointed cute sparkle star
  const s = size;
  const inner = s * 0.38;
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? s : inner;
    const angle = (i * Math.PI) / 4 - Math.PI / 4;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function StarTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = innerWidth;
      H = innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function tick(ts: number) {
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000);
      lastRef.current = ts;
      ctx!.clearRect(0, 0, W, H);

      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const s = starsRef.current[i];
        s.life -= dt;
        s.rot += s.vrot * dt;
        if (s.life <= 0) {
          starsRef.current.splice(i, 1);
          continue;
        }
        const progress = s.life / s.maxLife;
        // Twinkling sine wave pulse
        const twinkle = 0.7 + 0.3 * Math.sin(ts * 0.012 + i);
        const alpha = Math.min(1, progress * 3) * twinkle;
        const size = s.size * (0.4 + 0.6 * Math.sin(Math.PI * Math.min(1, progress * 1.5)));
        drawStar(ctx!, s.x, s.y, size, s.rot, s.color, alpha * s.alpha);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    const handleMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRef.current < 26 && starsRef.current.length > 70) return;
      const life = 0.55 + Math.random() * 0.45;
      starsRef.current.push({
        x: e.clientX + (Math.random() - 0.5) * 14,
        y: e.clientY + (Math.random() - 0.5) * 14,
        size: 4.5 + Math.random() * 6.5,
        alpha: 0.8 + Math.random() * 0.2,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 5,
        life,
        maxLife: life,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
