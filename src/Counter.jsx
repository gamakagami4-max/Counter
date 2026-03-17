import { useState, useEffect, useRef } from "react";

const TARGET = new Date("2025-05-29T00:00:00");
const EPOCH = new Date("2025-01-01T00:00:00");

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function getTimeLeft() {
  const diff = TARGET - new Date();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    total: Math.floor(diff / 1000),
    pct: Math.min(100, Math.max(0, ((TARGET - EPOCH - diff) / (TARGET - EPOCH)) * 100)),
  };
}

function TimeCard({ value, label, flash }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative w-24 h-24 flex items-center justify-center
          bg-gradient-to-br from-[#1a0a2e] to-[#0d0520]
          rounded border overflow-hidden
          transition-all duration-300
          ${flash ? "border-pink-400/50" : "border-purple-300/20"}
        `}
      >
        {/* Corner accents */}
        <span className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-purple-300/40" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-purple-300/40" />
        <span className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-purple-300/40" />
        <span className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-purple-300/40" />

        {/* Scan line */}
        <span className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-scan pointer-events-none" />

        <span
          className={`
            relative z-10 font-display text-4xl font-black leading-none tracking-tight
            transition-all duration-150
            ${flash
              ? "text-pink-400 [text-shadow:0_0_30px_#f472b6,0_0_60px_rgba(244,114,182,0.5)]"
              : "text-white [text-shadow:0_0_20px_#d8b4fe,0_0_40px_rgba(216,180,254,0.3)]"
            }
          `}
        >
          {value}
        </span>
      </div>
      <span className="mt-2 text-[9px] font-semibold tracking-[4px] uppercase text-purple-400/50">
        {label}
      </span>
    </div>
  );
}

// Pre-generate particles once
const COLORS = ["#c8aaff", "#ff6ec7", "#8b7fff", "#ffffff"];
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: `${Math.random() * 100}%`,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  duration: `${6 + Math.random() * 8}s`,
  delay: `${Math.random() * 8}s`,
}));

export default function AnimeCountdown() {
  const [time, setTime] = useState(getTimeLeft);
  const [flashing, setFlashing] = useState({});
  const prev = useRef({});

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft();
      setTime(t);
      if (t) {
        const f = {};
        for (const k of ["d", "h", "m", "s"]) {
          if (prev.current[k] !== undefined && prev.current[k] !== t[k]) f[k] = true;
        }
        if (Object.keys(f).length) {
          setFlashing(f);
          setTimeout(() => setFlashing({}), 320);
        }
        prev.current = { d: t.d, h: t.h, m: t.m, s: t.s };
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

        .font-display { font-family: 'Cinzel Decorative', serif; }
        .font-body    { font-family: 'Rajdhani', sans-serif; }

        @keyframes floatUp {
          0%   { opacity: 0;   transform: translateY(100vh) scale(0); }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { opacity: 0;   transform: translateY(-10vh) scale(1.5); }
        }
        @keyframes scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes colonBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        @keyframes gemPulse {
          0%, 100% { box-shadow: 0 0 10px #c8aaff, 0 0 20px rgba(200,170,255,.25); }
          50%       { box-shadow: 0 0 16px #ff6ec7, 0 0 32px rgba(255,110,199,.25); }
        }
        @keyframes eyebrowPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }

        .animate-float-up { animation: floatUp linear infinite; opacity: 0; }
        .animate-scan     { animation: scan 3s ease-in-out infinite; }
        .animate-colon    { animation: colonBlink 1s step-end infinite; }
        .animate-gem      { animation: gemPulse 1.5s ease-in-out infinite; }
        .animate-eyebrow  { animation: eyebrowPulse 2s ease-in-out infinite; }
      `}</style>

      <div className="font-body relative min-h-screen bg-[#0a0010] flex items-center justify-center overflow-hidden">

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="animate-float-up absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                background: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 w-[600px] px-4">

          {/* Title */}
          <div className="text-center">
            <p className="animate-eyebrow text-[11px] font-semibold tracking-[6px] uppercase text-pink-400 [text-shadow:0_0_12px_rgba(244,114,182,0.67)] mb-1.5">
              ★ FINAL COUNTDOWN ★
            </p>
            <h1 className="font-display text-3xl font-black tracking-wide leading-tight bg-gradient-to-br from-white via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Until May 29
            </h1>
            <p className="text-[12px] tracking-[4px] uppercase text-purple-400/60 mt-1.5">
              The Awakening Approaches
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
            <div className="animate-gem w-2 h-2 bg-purple-300 rotate-45" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
          </div>

          {/* Countdown */}
          {time ? (
            <div className="flex items-start gap-3">
              <TimeCard value={pad(time.d)} label="Days"    flash={!!flashing.d} />
              <span className="animate-colon font-display text-4xl text-purple-300/30 leading-none self-center pb-6">:</span>
              <TimeCard value={pad(time.h)} label="Hours"   flash={!!flashing.h} />
              <span className="animate-colon font-display text-4xl text-purple-300/30 leading-none self-center pb-6">:</span>
              <TimeCard value={pad(time.m)} label="Minutes" flash={!!flashing.m} />
              <span className="animate-colon font-display text-4xl text-purple-300/30 leading-none self-center pb-6">:</span>
              <TimeCard value={pad(time.s)} label="Seconds" flash={!!flashing.s} />
            </div>
          ) : (
            <p className="font-display text-xl text-center bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent animate-pulse">
              The Moment Has Arrived!
            </p>
          )}

          {/* Info row */}
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] tracking-[3px] uppercase text-purple-500/50">May 29, 2025</span>
            <span className="text-pink-400/30">◆</span>
            <span className="text-[12px] tracking-wide text-purple-600/50">
              {time ? `${time.total.toLocaleString()} seconds remaining` : ""}
            </span>
          </div>

          {/* Energy bar */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] tracking-[3px] uppercase text-purple-600/50">
              <span>Spirit Energy</span>
              <span>{time ? time.pct.toFixed(1) : "100"}%</span>
            </div>
            <div className="w-full h-0.5 bg-[#1a0a2e] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4a1a8a] via-purple-300 to-pink-400 transition-all duration-1000"
                style={{ width: `${time ? time.pct : 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}