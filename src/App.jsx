import { useState, useEffect } from 'react'
import './App.css'

function getTimeLeft() {
  const target = new Date(new Date().getFullYear(), 4, 29)
  if (target < new Date()) target.setFullYear(target.getFullYear() + 1)
  const diff = target - new Date()
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.abs(Math.sin(i * 73.1) * 800),
  delay: i * 0.45,
  dur: 7 + Math.abs(Math.sin(i * 31)) * 6,
  size: 7 + Math.abs(Math.sin(i * 17)) * 9,
  drift: Math.sin(i * 53) * 100,
}))

// Character positions: left offset (%), height (%), bottom offset (%)
const CHARS = [
  { src: '1.png', left: '4%',  height: '30%', bottom: '17%' },
  { src: '2.png', left: '25%', height: '32%', bottom: '19%' },
  { src: '3.png', left: '59%', height: '30%', bottom: '17%' },
  { src: '4.png', left: '80%', height: '28%', bottom: '15%' },
]

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="page">
      <div className="card">

        {/* Sky gradient */}
        <div className="c-sky" />

        {/* Stars */}
        <svg className="c-layer" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 60 }, (_, i) => (
            <circle key={i}
              cx={Math.abs(Math.sin(i * 137.5) * 800)}
              cy={Math.abs(Math.cos(i * 97.3) * 260)}
              r={0.5 + Math.abs(Math.sin(i * 31)) * 1.3}
              fill="white"
              opacity={0.25 + Math.abs(Math.sin(i * 17)) * 0.55}
            />
          ))}
        </svg>

        {/* Moon */}
        <div className="c-moon" />
        <div className="c-moon-glow" />

        {/* Far mountains */}
        <svg className="c-layer" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,500 L0,295 Q70,195 155,275 Q230,345 315,215 Q375,120 440,235 Q495,330 575,195 Q635,100 700,215 Q752,305 800,260 L800,500Z" fill="#2d1040" opacity="0.75"/>
          <path d="M0,500 L0,335 Q95,258 195,315 Q295,372 395,298 Q478,238 558,305 Q638,368 720,298 Q762,262 800,290 L800,500Z" fill="#3a1650" opacity="0.88"/>
        </svg>

        {/* Petals */}
        <svg className="c-layer" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {PETALS.map(p => (
            <ellipse key={p.id} cx={p.x} cy={-p.size * 2} rx={p.size * 0.65} ry={p.size * 0.38} fill="#f9b8cc" opacity="0.82">
              <animateTransform attributeName="transform" type="translate"
                values={`0,0; ${p.drift},560`}
                dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" additive="sum"/>
              <animate attributeName="opacity" values="0;0.82;0.6;0"
                dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite"/>
            </ellipse>
          ))}
        </svg>

        {/* Content */}
        <div className="c-content">
          <p className="c-sup">自由へ · toward</p>
          <h1 className="c-title">FREEDOM</h1>
          <div className="c-rule" />
          <p className="c-date">May 29</p>

          <div className="c-countdown">
            {Object.entries(timeLeft).map(([unit, val], i) => (
              <>
                <div key={unit} className="c-unit">
                  <span className="c-num">{String(val).padStart(2,'0')}</span>
                  <span className="c-lbl">{unit}</span>
                </div>
                {i < 3 && <span key={`s${i}`} className="c-colon">:</span>}
              </>
            ))}
          </div>

          <p className="c-haiku">「自由は待っている」<em> — Freedom is waiting</em></p>
        </div>

        {/* Ground */}
        <svg className="c-ground" viewBox="0 0 800 230" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,230 L0,115 Q100,65 210,100 Q330,138 450,88 Q570,38 690,82 Q750,105 800,92 L800,230Z" fill="#0d2210"/>
          <path d="M0,230 L0,158 Q110,132 230,150 Q375,172 520,148 Q655,126 800,152 L800,230Z" fill="#162a18"/>
        </svg>

        {/* PNG character images */}
        {CHARS.map(({ src, left, height, bottom }) => (
          <img
            key={src}
            src={src}
            alt=""
            className="c-char"
            style={{ left, height, bottom }}
          />
        ))}

      </div>
    </div>
  )
}