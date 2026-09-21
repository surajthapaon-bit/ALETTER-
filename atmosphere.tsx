import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";
import type { Stage } from "./types";

type AtmosphereProps = {
  stage: Stage;
  archiveOpen: boolean;
  onOpenArchive: () => void;
};

export function Atmosphere({ stage, archiveOpen, onOpenArchive }: AtmosphereProps) {
  const show = stage === "room" || stage === "letter";
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || !show) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const drops = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.35 + Math.random() * 0.55,
      len: 6 + Math.random() * 10,
    }));

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const draw = () => {
      if (!running) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(220, 228, 236, 0.38)";
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      for (const drop of drops) {
        drop.y += drop.v * 0.012;
        if (drop.y > 1.1) {
          drop.y = -0.1;
          drop.x = Math.random();
        }
        const x = drop.x * width;
        const y = drop.y * height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.8, y + drop.len);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVis = () => {
      running = document.visibilityState !== "hidden";
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, show]);

  if (!show) return null;

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="lamp-glow" />
      <div className="lamp-fixture">
        <div className="lamp-arm" />
        <div className="lamp-shade" />
        <div className="lamp-print" />
      </div>
      <div className="window-pane">
        <div className="window-muntin-v" />
        <div className="window-muntin-h" />
        <canvas ref={canvasRef} className="rain-canvas" />
      </div>
      <div className="desk" />
      <div className="desk-edge" />
      <div className="chair">
        <div className="chair-back" />
        <div className="chair-seat" />
      </div>
      <span className="artifact coffee-ring" />
      <span className="artifact crumb" />
      <span className="artifact pen" />
      <span className="artifact glass">
        <span className="glass-shine" />
      </span>
      {!archiveOpen && (stage === "room" || stage === "letter") ? (
        <button
          type="button"
          className="archive-book"
          aria-label="Open the archive"
          onClick={onOpenArchive}
        >
          <span className="archive-book-spine" />
        </button>
      ) : null}
    </div>
  );
}
