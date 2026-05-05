import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RotateCcw, ChevronLeft, Info } from 'lucide-react'
import {
  QUESTIONS, OPTIONS, INSTRUCTIONS,
  calculateScore, getBand, getSubscaleScores
} from './icfsData'

// ── Animation variants ──────────────────────────────────────────
const card = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.35 } },
}
const optStagger = { visible: { transition: { staggerChildren: 0.055 } } }
const optItem    = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.28, ease: 'easeOut' } },
}

// ── Sub-component: Subscale bar ─────────────────────────────────
function SubscaleBar({ label, percent, color, score, max }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--deep-navy)', fontWeight: 800 }}>
          {score}/{max}
        </span>
      </div>
      <div style={{ height: '12px', background: 'var(--off-white)', border: '2px solid var(--deep-navy)', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275], delay: 0.2 }}
          style={{ height: '100%', background: color, borderRadius: 0, borderRight: '2px solid var(--deep-navy)' }}
        />
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────
export default function Questionnaire({ onComplete }) {
  const [step, setStep]       = useState('intro')      // intro | instructions | questions | results
  const [idx,  setIdx]        = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [result, setResult]   = useState(null)

  const total = QUESTIONS.length
  const progress = step === 'questions' ? ((idx + 1) / total) * 100 : 0

  const handleStart = () => setStep('instructions')

  const handleBegin = () => {
    setIdx(0); setAnswers({}); setSelected(null); setStep('questions')
  }

  const handleBack = () => {
    if (idx > 0) setIdx(prev => prev - 1)
  }

  const handleSelect = (value) => {
    if (selected !== null) return 
    setSelected(value)
    const next = { ...answers, [idx]: value }
    setAnswers(next)

    setTimeout(() => {
      setSelected(null)
      if (idx < total - 1) {
        setIdx(prev => prev + 1)
      } else {
        const score    = calculateScore(next)
        const band     = getBand(score)
        const subscales = getSubscaleScores(next)
        setResult({ score, band, subscales })
        setStep('results')
        if (onComplete) onComplete({ score, band })
      }
    }, 420)
  }

  const handleReset = () => {
    setStep('intro'); setIdx(0); setAnswers({}); setSelected(null); setResult(null)
  }

  return (
    <div className="main-card">
      <AnimatePresence mode="wait">

        {step === 'intro' && (
          <motion.div key="intro" variants={card} initial="hidden" animate="visible" exit="exit"
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}>

            <h1 className="display-title">
              Internal Conflict <br /> Fatigue Scale
            </h1>

            <div className="divider" />

            <p className="lead-text">
              The <strong>ICFS</strong> is a validated psychological scale that measures
              fatigue arising from persistent internal conflict. It takes around 3–4 minutes
              to complete.
            </p>

            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
              padding: '1.5rem',
              background: 'var(--off-white)',
              borderRadius: 'var(--radius)', border: 'var(--border-width) solid var(--deep-navy)',
              boxShadow: '4px 4px 0 var(--deep-navy)',
              width: '100%'
            }}>
              {[
                ['19', 'Questions'],
                ['6', 'Dimensions'],
                ['.90', 'α Reliability'],
              ].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign:'center', flex: 1 }}>
                  <div style={{ fontFamily:'var(--font-accent)', fontSize:'1.8rem', color:'var(--hot-pink)' }}>{val}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--deep-navy)', fontWeight:800, letterSpacing:'0.05em', textTransform:'uppercase' }}>{lbl}</div>
                </div>
              ))}
            </div>

            <button className="cta-primary" onClick={handleStart} style={{ marginTop:'0.5rem', display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap' }}>
              View Instructions <ArrowRight size={17} />
            </button>
          </motion.div>
        )}

        {step === 'instructions' && (
          <motion.div key="instructions" variants={card} initial="hidden" animate="visible" exit="exit"
            style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <Info size={16} color="var(--sage-dark)" />
              <span style={{ fontSize:'0.8rem', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--muted)' }}>
                Instructions
              </span>
            </div>

            <p style={{ fontSize:'1.05rem', color:'var(--deep)', lineHeight:1.75 }}>
              {INSTRUCTIONS}
            </p>

            <div style={{
              padding: '1rem 1.25rem', borderRadius: 12,
              background: 'rgba(212,180,180,0.1)', border: '1px solid rgba(212,180,180,0.3)',
              fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6
            }}>
              <strong style={{ color:'var(--deep)' }}>Confidentiality notice:</strong> Your responses are processed entirely in your browser and are never transmitted or stored externally.
            </div>

            <button className="cta-primary" onClick={handleBegin} style={{ display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap' }}>
              Begin Scale <ArrowRight size={17} />
            </button>
          </motion.div>
        )}

        {step === 'questions' && (
          <motion.div key={`q-${idx}`} variants={card} initial="hidden" animate="visible" exit="exit"
            style={{ display:'flex', flexDirection:'column', gap:'1.75rem', width:'100%' }}>

            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width:`${progress}%` }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span className="question-counter">
                  {idx + 1} <span style={{ opacity:0.4 }}>/ {total}</span>
                </span>
                {idx > 0 && (
                  <button onClick={handleBack} style={{
                    display:'flex', alignItems:'center', gap:'4px',
                    background:'none', border:'none', cursor:'pointer',
                    fontSize:'0.8rem', color:'var(--muted)', fontFamily:'var(--font-body)'
                  }}>
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
              </div>
            </div>

            <h2 className="question-text">{QUESTIONS[idx].text}</h2>

            <motion.div className="options-stack" variants={optStagger} initial="hidden" animate="visible">
              {OPTIONS.map((opt, i) => {
                const isSelected = selected === opt.value
                const isPrevAnswered = answers[idx] === opt.value && selected === null
                return (
                  <motion.button
                    key={opt.value}
                    variants={optItem}
                    className={`opt-btn ${(isSelected || isPrevAnswered) ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    {opt.label}
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div key="results" variants={card} initial="hidden" animate="visible" exit="exit"
            style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

            <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem' }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: result.band.orbColor,
                border: 'var(--border-width) solid var(--deep-navy)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'3rem',
                boxShadow: '8px 8px 0 var(--deep-navy)',
                animation: 'fade-scale-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                {result.band.emoji}
              </div>

              <div style={{ fontFamily:'var(--font-accent)', fontSize:'5rem', fontWeight:400,
                color: 'var(--hot-pink)', WebkitTextStroke: '2px var(--deep-navy)',
                textShadow: '6px 6px 0 var(--deep-navy)',
                lineHeight:1, letterSpacing:'-0.02em', marginTop: '1rem' }}>
                {result.score}
              </div>
              <div style={{ fontSize:'0.8rem', color:'var(--deep-navy)', textTransform:'uppercase',
                letterSpacing:'0.1em', fontWeight:800 }}>
                Total Score
              </div>

              <h2 className="display-title" style={{ fontSize:'2.2rem', marginTop:'0.5rem', WebkitTextStroke: '1.5px var(--deep-navy)' }}>
                {result.band.label}
              </h2>
              <p style={{ fontSize:'0.9rem', color:'var(--deep-navy)', fontWeight:700, textTransform: 'uppercase' }}>
                {result.band.sublabel}
              </p>
            </div>

            <div className="divider" />

            <p className="lead-text" style={{ fontSize:'0.97rem' }}>
              {result.band.description}
            </p>

            <div style={{
              padding:'1.25rem', borderRadius:16,
              background:'rgba(255,255,255,0.4)',
              border:'1px solid var(--border)',
              display:'flex', flexDirection:'column', gap:'1rem'
            }}>
              <div style={{ fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.08em',
                textTransform:'uppercase', color:'var(--muted)', marginBottom:'0.25rem' }}>
                Dimension Breakdown
              </div>
              {Object.values(result.subscales).map(sub => (
                <SubscaleBar
                  key={sub.label}
                  label={sub.label}
                  percent={sub.percent}
                  color={sub.color}
                  score={sub.score}
                  max={sub.max}
                />
              ))}
            </div>

            <details style={{ cursor:'pointer' }}>
              <summary style={{ fontSize:'0.85rem', color:'var(--muted)', fontWeight:500,
                listStyle:'none', display:'flex', alignItems:'center', gap:'6px' }}>
                <Info size={13} /> View score band reference
              </summary>
              <div style={{ marginTop:'0.75rem', display:'flex', flexDirection:'column', gap:'4px' }}>
                {[
                  ['19–39', 'Low Fatigue'],
                  ['40–43', 'Below Average'],
                  ['44–50', 'Average'],
                  ['51–55', 'Above Average'],
                  ['56–65', 'High Fatigue'],
                  ['66–76', 'Extremely High'],
                ].map(([range, lbl]) => (
                  <div key={range} style={{ display:'flex', justifyContent:'space-between',
                    fontSize:'0.8rem', color:'var(--muted)', padding:'2px 0' }}>
                    <span style={{ fontVariantNumeric:'tabular-nums', fontWeight:500 }}>{range}</span>
                    <span>{lbl}</span>
                  </div>
                ))}
              </div>
            </details>

            <button className="cta-ghost" onClick={handleReset} style={{ alignSelf:'center' }}>
              <RotateCcw size={14} /> Retake Scale
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
