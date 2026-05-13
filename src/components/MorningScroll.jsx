import React, { useState, useEffect, useMemo } from 'react'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatDate(d) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: '#080808', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' },
  beat: { textAlign: 'center', maxWidth: 640, padding: '0 32px' },
  date: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#e5e5e5', lineHeight: 1.2 },
  sub: { fontSize: 13, color: '#555', marginTop: 8, letterSpacing: '0.05em' },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#e5e5e5', marginBottom: 12 },
  stat: { fontSize: 14, color: '#f97316', fontVariantNumeric: 'tabular-nums' },
  taskList: { marginTop: 16 },
  taskItem: { fontSize: 12, color: '#888', padding: '6px 0', borderBottom: '1px solid #1a1a1a', textAlign: 'left' },
  taskTitle: { color: '#e5e5e5' },
  taskMeta: { color: '#444', fontSize: 11, marginLeft: 8 },
  unblocked: { fontSize: 13, color: '#22c55e', padding: '6px 0' },
  question: { fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#f97316', lineHeight: 1.4, fontStyle: 'italic' },
  skipBtn: { position: 'fixed', bottom: 40, right: 40, padding: '8px 16px', background: 'transparent', color: '#333', border: '1px solid #333', borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 },
  progress: { display: 'flex', gap: 6, marginTop: 40 },
  dot: (active, done) => ({ width: 6, height: 6, borderRadius: '50%', background: done ? '#f97316' : active ? '#e5e5e5' : '#1a1a1a', transition: 'background 0.3s' }),
}

const BEAT_DURATION = 4000

export default function MorningScroll({ data, onClose }) {
  const [beat, setBeat] = useState(0)
  const [opacity, setOpacity] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const TOTAL_BEATS = 5

  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setOpacity(1))
    // Skip button after 2s
    const skipTimer = setTimeout(() => setShowSkip(true), 2000)
    return () => clearTimeout(skipTimer)
  }, [])

  useEffect(() => {
    if (beat >= TOTAL_BEATS - 1) return
    const timer = setTimeout(() => {
      setOpacity(0)
      setTimeout(() => {
        setBeat(b => b + 1)
        setOpacity(1)
      }, 600)
    }, BEAT_DURATION)
    return () => clearTimeout(timer)
  }, [beat])

  const now = new Date()
  const doneTasks = data.doneTasks || []
  const allTasks = Object.values(data.tasks || {})
  const activeTasks = allTasks.filter(t => !doneTasks.includes(t.id))
  const activeVentures = new Set(activeTasks.map(t => t.venture)).size

  const topTasks = useMemo(() => {
    return [...activeTasks]
      .sort((a, b) => {
        const rOrder = { high: 0, medium: 1, low: 2 }
        return (rOrder[a.revenueImpact] || 1) - (rOrder[b.revenueImpact] || 1)
      })
      .slice(0, 3)
  }, [activeTasks])

  const unblockedTasks = useMemo(() => {
    return activeTasks.filter(t =>
      (t.dependsOn || []).length > 0 &&
      (t.dependsOn || []).every(id => doneTasks.includes(id))
    ).slice(0, 3)
  }, [activeTasks, doneTasks])

  const BEATS = [
    // Beat 0: Date
    <div style={s.beat} key="date">
      <div style={s.date}>{formatDate(now)}</div>
      <div style={s.sub}>Good morning.</div>
    </div>,

    // Beat 1: Overview
    <div style={s.beat} key="overview">
      <div style={s.heading}>Your Day</div>
      <div style={s.stat}>{activeVentures} active venture{activeVentures !== 1 ? 's' : ''}</div>
      <div style={{ ...s.stat, color: '#888', marginTop: 8 }}>{activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''} remaining</div>
    </div>,

    // Beat 2: Top tasks
    <div style={s.beat} key="tasks">
      <div style={s.heading}>Top Priority</div>
      <div style={s.taskList}>
        {topTasks.length === 0 ? (
          <div style={{ color: '#555', fontSize: 13 }}>No tasks. Clear runway.</div>
        ) : topTasks.map(t => (
          <div key={t.id} style={s.taskItem}>
            <span style={s.taskTitle}>{t.title}</span>
            <span style={s.taskMeta}>{t.venture} · {t.revenueImpact} revenue</span>
          </div>
        ))}
      </div>
    </div>,

    // Beat 3: Unblocked tasks
    <div style={s.beat} key="unblocked">
      <div style={s.heading}>Newly Unblocked</div>
      {unblockedTasks.length === 0 ? (
        <div style={s.sub}>No newly unblocked tasks.</div>
      ) : unblockedTasks.map(t => (
        <div key={t.id} style={s.unblocked}>{t.title}</div>
      ))}
    </div>,

    // Beat 4: Question
    <div style={s.beat} key="question">
      <div style={s.question}>"What's the one move that changes everything today?"</div>
    </div>,
  ]

  return (
    <div style={s.overlay}>
      <div style={{ opacity, transition: 'opacity 0.6s', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {BEATS[beat]}
        <div style={s.progress}>
          {Array.from({ length: TOTAL_BEATS }).map((_, i) => (
            <div key={i} style={s.dot(i === beat, i < beat)} />
          ))}
        </div>
      </div>
      {showSkip && (
        <button style={s.skipBtn} onClick={onClose}>Skip</button>
      )}
    </div>
  )
}
