import { useEffect, useRef } from "react";

const FRAME_MS = 1000 / 30; // 30 quadros por segundo bastam para partículas lentas
const STEP = 2; // cada quadro anda o que andariam dois quadros a 60 fps

// Brilho pré-desenhado: um sprite por lente, em vez de shadowBlur em cada partícula a cada quadro.
function sprite(core, glow) {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d").createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, core);
  g.addColorStop(0.18, core);
  g.addColorStop(0.35, glow);
  g.addColorStop(1, "transparent");
  const ctx = c.getContext("2d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return c;
}

/** Partículas de fundo: brasas que sobem na Máscara, luz em suspensão na Verdade. */
export default function Atmosphere({ truthMode }) {
  const canvasRef = useRef(null);
  const truthRef = useRef(truthMode);
  truthRef.current = truthMode;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const ember = sprite("rgba(255, 190, 90, 1)", "rgba(255, 106, 26, 0.45)");
    const light = sprite("rgba(220, 245, 255, 1)", "rgba(143, 220, 255, 0.4)");
    const count = innerWidth < 768 ? 28 : 55; // celular: metade das partículas
    let width, height, frame, last = 0;

    const resize = () => {
      width = canvas.width = innerWidth;
      height = canvas.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);

    const reset = (p, anywhere) =>
      Object.assign(p, {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 10,
        r: 0.6 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 0.4,
        rise: 0.25 + Math.random() * 0.7,
        life: anywhere ? Math.random() : 0,
        speed: 0.002 + Math.random() * 0.004,
      });
    const particles = Array.from({ length: count }, () => reset({}, true));

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;

      const truth = truthRef.current;
      const img = truth ? light : ember;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.life += p.speed * STEP;
        if (truth) {
          p.x += (p.drift * 0.5 + Math.sin(p.y / 70) * 0.15) * STEP;
          p.y -= p.rise * 0.25 * STEP;
        } else {
          p.x += (p.drift + Math.sin(p.life * 12) * 0.3) * STEP;
          p.y -= p.rise * STEP;
        }
        if (p.life >= 1 || p.y < -10) reset(p, truth);

        const fade = Math.sin(p.life * Math.PI);
        ctx.globalAlpha = truth ? fade * 0.55 : fade * (0.5 + Math.random() * 0.4); // brasa tremula
        const size = p.r * (truth ? 9 : 7); // o sprite inclui o halo em volta do núcleo
        ctx.drawImage(img, p.x - size / 2, p.y - size / 2, size, size);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" aria-hidden="true" />;
}
