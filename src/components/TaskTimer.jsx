import React, { useState, useEffect } from 'react'

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${m}:${String(s).padStart(2,'0')}`
}

const pulseKeyframes = `
@keyframes zorba-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
  50% { box-shadow: 0 0 0 4px rgba(249,115,22,0); }
}
`

const s = {
  wrap: { display: 'flex', alignItems: 'center', gap: 8 },
  btn: (active) => ({
    padding: '4px 10px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', borderRadius: 3,
    background: active ? '#1a0a00' : 'transparent',
    color: active ? '#f97316' : '#555',
    border: `1px solid ${active ? '#f97316' : '#333'}`,
    animation: active ? 'zorba-pulse 2s ease-in-out infinite' : 'none',
    transition: 'color 0.2s, border-color 0.2s, background 0.2s',
  }),
  display: (active) => ({
    fontSize: 11, fontVariantNumeric: 'tabular-nums', minWidth: 48,
    color: active ? '#f97316' : '#444',
    letterSpacing: '0.02em',
  }),
}

export default function TaskTimer({ taskId, data, setData }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (typeof document === 'undefined') return
    const id = 'zorba-timer-styles'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = pulseKeyframes
      document.head.appendChild(el)
    }
  }, [])

  const timer = data.activeTimers?.[taskId]

  useEffect(() => {
    if (!timer) return
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [!!timer])

  const elapsed = timer
    ? (now - new Date(timer.startedAt).getTime()) + (timer.totalMs || 0)
    : (data.tasks?.[taskId]?.timeLogs || []).reduce((sum, l) => sum + (l.durationMs || 0), 0)

  const start = () => {
    const startedAt = new Date().toISOString()
    setData(prev => {
      let updated = { ...prev }
      // Stop any other active timers
      const newTimers = {}
      Object.entries(prev.activeTimers || {}).forEach(([tid, t]) => {
        if (tid !== taskId) {
          const dur = Date.now() - new Date(t.startedAt).getTime()
          const prevTask = prev.tasks[tid]
          if (prevTask) {
            updated = {
              ...updated,
              tasks: {
                ...updated.tasks,
                [tid]: {
                  ...prevTask,
                  timeLogs: [...(prevTask.timeLogs || []), {
                    startedAt: t.startedAt,
                    endedAt: new Date().toISOString(),
                    durationMs: dur + (t.totalMs || 0)
                  }]
                }
              }
            }
          }
        } else {
          newTimers[tid] = t
        }
      })
      newTimers[taskId] = { startedAt, totalMs: timer?.totalMs || 0 }
      return { ...updated, activeTimers: newTimers }
    })
  }

  const stop = () => {
    if (!timer) return
    const endedAt = new Date().toISOString()
    const dur = Date.now() - new Date(timer.startedAt).getTime()
    const totalMs = (timer.totalMs || 0) + dur
    setData(prev => {
      const newTimers = { ...prev.activeTimers }
      delete newTimers[taskId]
      const prevTask = prev.tasks[taskId]
      return {
        ...prev,
        activeTimers: newTimers,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...prevTask,
            timeLogs: [...(prevTask?.timeLogs || []), { startedAt: timer.startedAt, endedAt, durationMs: totalMs }]
          }
        }
      }
    })
  }

  return (
    <div style={s.wrap}>
      {timer ? (
        <button style={s.btn(true)} onClick={stop}>Stop</button>
      ) : (
        <button style={s.btn(false)} onClick={start}>Start</button>
      )}
      {elapsed > 0 && <span style={s.display(!!timer)}>{formatElapsed(elapsed)}</span>}
    </div>
  )
}
