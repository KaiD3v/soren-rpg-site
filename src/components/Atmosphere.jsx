import { useEffect, useRef } from "react";

const COUNT = 55;

/** Partículas de fundo: brasas que sobem na Máscara, luz em suspensão na Verdade. */
export default function Atmosphere({ truthMode }) {
  const canvasRef = useRef(null);
  const truthRef = useRef(truthMode);
  truthRef.current = truthMode;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, frame;

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
    const particles = Array.from({ length: COUNT }, () => reset({}, true));

    const tick = () => {
      const truth = truthRef.current;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.life += p.speed;
        if (truth) {
          p.x += p.drift * 0.5 + Math.sin(p.y / 70) * 0.15;
          p.y -= p.rise * 0.25;
        } else {
          p.x += p.drift + Math.sin(p.life * 12) * 0.3;
          p.y -= p.rise;
        }
        if (p.life >= 1 || p.y < -10) reset(p, truth);

        const fade = Math.sin(p.life * Math.PI);
        const alpha = truth ? fade * 0.55 : fade * (0.5 + Math.random() * 0.4); // brasa tremula
        ctx.shadowBlur = truth ? 14 : 8;
        ctx.shadowColor = truth ? "#8fdcff" : "#ff6a1a";
        ctx.fillStyle = truth ? `rgba(190, 235, 255, ${alpha})` : `rgba(255, ${110 + p.r * 40}, 40, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" aria-hidden="true" />;
}
