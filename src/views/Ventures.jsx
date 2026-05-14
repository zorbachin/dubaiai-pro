import React from 'react'
import { calcHealthScore } from './Tasks.jsx'

const VENTURES = [
  { key: 'hermes', name: 'Hermes', status: 'live', description: 'AI automation workflows' },
  { key: 'buildyourbot', name: 'Build Your Bot', status: 'launching', description: 'Custom AI bot builder' },
  { key: 'selfsellingai', name: 'Self Selling AI', status: 'dev', description: 'AI-powered sales automation' },
  { key: 'zorbot', name: 'Zorbot', status: 'building', description: 'Personal AI assistant' },
  { key: 'minimovies', name: 'Mini Movies', status: 'building', description: 'AI short film generation' },
  { key: 'theriver', name: 'The River', status: 'dev', description: 'Content distribution network' },
  { key: 'moraledge', name: 'Moraledge', status: 'building', description: 'Team morale analytics' },
  { key: 'thegetboaz', name: 'The Get Boaz', status: 'dev', description: 'Creator monetization platform' },
  { key: 'dubaiai', name: 'Dubai AI', status: 'live', description: 'AI consulting Dubai' },
  { key: 'suman', name: 'Suman', status: 'building', description: 'Personal brand platform' },
  { key: 'podsupps', name: 'Pod Supps', status: 'launching', description: 'Podcast supplement brand' },
  { key: 'series', name: 'Series', status: 'dev', description: 'Long-form content series' },
]

const STATUS_COLORS = {
  live: '#22c55e',
  launching: '#f97316',
  dev: '#eab308',
  building: '#555'
}

function healthColor(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function lastActivityDate(ventureKey, tasks, doneTasks) {
  const doneSet = new Set(doneTasks || [])
  const ventureTasks = Object.values(tasks || {}).filter(t => t.venture === ventureKey)
  if (ventureTasks.length === 0) return null
  const sorted = ventureTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  return sorted[0]?.updatedAt || null
}

function formatDate(iso) {
  if (!iso) return 'never'
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

const s = {
  container: { padding: '16px 20px' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10
  },
  card: (hovered) => ({
    background: hovered ? '#111111' : '#0d0d0d',
    border: `1px solid ${hovered ? '#2a2a2a' : '#161616'}`,
    borderRadius: 3, padding: '14px 16px', cursor: 'pointer',
    transition: 'border-color 0.1s, background 0.1s'
  }),
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  vName: { fontSize: 13, color: '#d5d5d5', fontWeight: 500, letterSpacing: '0.01em' },
  statusBadge: (status) => ({
    padding: '1px 6px', borderRadius: 2,
    border: `1px solid ${STATUS_COLORS[status] || '#222'}`,
    color: STATUS_COLORS[status] || '#444', fontSize: 9,
    textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0
  }),
  desc: { fontSize: 11, color: '#444', marginBottom: 12, lineHeight: 1.5 },
  healthRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  healthBar: { flex: 1, height: 2, background: '#1a1a1a', borderRadius: 1, overflow: 'hidden' },
  healthFill: (score) => ({
    height: '100%', width: `${score}%`,
    background: healthColor(score), borderRadius: 1
  }),
  healthScore: (score) => ({ fontSize: 10, color: healthColor(score), width: 24, textAlign: 'right', flexShrink: 0 }),
  statsRow: { display: 'flex', gap: 14, borderTop: '1px solid #141414', paddingTop: 10 },
  stat: { fontSize: 10, color: '#333' },
  statVal: { color: '#666' },
  lastActivity: { fontSize: 10, color: '#2a2a2a', marginTop: 6 }
}

function VentureCard({ venture, data, onSelect }) {
  const [hovered, setHovered] = React.useState(false)
  const tasks = Object.values(data.tasks || {}).filter(t => t.venture === venture.key)
  const doneTasks = data.doneTasks || []
  const doneCount = tasks.filter(t => doneTasks.includes(t.id)).length
  const score = calcHealthScore(venture.key, data.tasks, doneTasks, data.completedSteps)
  const lastActivity = lastActivityDate(venture.key, data.tasks, doneTasks)

  return (
    <div
      style={s.card(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(venture.key)}
    >
      <div style={s.cardHeader}>
        <span style={s.vName}>{venture.name}</span>
        <span style={s.statusBadge(venture.status)}>{venture.status}</span>
      </div>
      <div style={s.desc}>{venture.description}</div>
      <div style={s.healthRow}>
        <div style={s.healthBar}>
          <div style={s.healthFill(score)} />
        </div>
        <span style={s.healthScore(score)}>{score}</span>
      </div>
      <div style={s.statsRow}>
        <span style={s.stat}><span style={s.statVal}>{doneCount}</span>/{tasks.length} done</span>
        <span style={s.stat}>{formatDate(lastActivity)}</span>
      </div>
    </div>
  )
}

export default function Ventures({ data, setData, setView, setVentureFilter }) {
  const handleSelect = (ventureKey) => {
    setVentureFilter(ventureKey)
    setView(0)
  }

  return (
    <div style={s.container}>
      <div style={s.grid}>
        {VENTURES.map(v => (
          <VentureCard
            key={v.key}
            venture={v}
            data={data}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  )
}
