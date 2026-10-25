/* Lightweight purple and gold celebratory confetti generator using HTML5 Canvas */

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: ("circle" | "square" | "heart" | "star")[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "square" | "heart" | "star";
  alpha: number;
  decay: number;
}

const DEFAULT_COLORS = ["#7654d6", "#9d7be8", "#d9ccff", "#f5b6c6", "#f7dd87", "#e4b476", "#ffffff", "#4b315f"];

export function launchConfetti(options: ConfettiOptions = {}) {
  const count = options.particleCount ?? 80;
  const spread = options.spread ?? 70;
  const origin = options.origin ?? { x: 0.5, y: 0.6 };
  const colors = options.colors ?? DEFAULT_COLORS;
  const shapes = options.shapes ?? ["circle", "square", "heart", "star"];

  let canvas = document.getElementById("birthday-confetti-canvas") as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "birthday-confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const startX = origin.x * window.innerWidth;
  const startY = origin.y * window.innerHeight;

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI / 180) * (270 + (Math.random() - 0.5) * spread);
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
    });
  }

  function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) {
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.translate(x, y);
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.3);
    c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    c.closePath();
    c.fill();
    c.restore();
  }

  function drawStar(c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    c.save();
    c.globalAlpha = alpha;
    c.beginPath();
    c.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      c.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      c.lineTo(x, y);
      rot += step;
    }
    c.lineTo(cx, cy - outerRadius);
    c.closePath();
    c.fillStyle = color;
    c.fill();
    c.restore();
  }

  let animationFrameId: number;

  function render() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeParticles = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      activeParticles++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.98; // friction
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === "heart") {
        drawHeart(ctx, 0, -p.radius, p.radius * 1.5, p.color, Math.max(0, p.alpha));
      } else if (p.shape === "star") {
        drawStar(ctx, 0, 0, 5, p.radius * 1.2, p.radius * 0.6, p.color, Math.max(0, p.alpha));
      } else if (p.shape === "circle") {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
      }
      ctx.restore();
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      cancelAnimationFrame(animationFrameId);
    }
  }

  render();
}
