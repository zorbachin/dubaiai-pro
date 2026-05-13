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
  container: { padding: 20 },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12
  },
  card: {
    background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s'
  },
  cardHover: {
    background: '#111111', border: '1px solid #f97316', borderRadius: 4,
    padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  vName: { fontSize: 15, color: '#e5e5e5', fontWeight: 600 },
  statusBadge: (status) => ({
    padding: '2px 8px', borderRadius: 4, background: '#080808',
    border: `1px solid ${STATUS_COLORS[status] || '#555'}`,
    color: STATUS_COLORS[status] || '#555', fontSize: 10,
    textTransform: 'uppercase', letterSpacing: '0.05em'
  }),
  desc: { fontSize: 12, color: '#555', marginBottom: 12 },
  healthRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  healthLabel: { fontSize: 10, color: '#555', width: 50 },
  healthBar: { flex: 1, height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' },
  healthFill: (score) => ({
    height: '100%', width: `${score}%`,
    background: healthColor(score), borderRadius: 2, transition: 'width 0.3s'
  }),
  healthScore: (score) => ({ fontSize: 11, color: healthColor(score), width: 28, textAlign: 'right' }),
  statsRow: { display: 'flex', gap: 16, marginTop: 8 },
  stat: { fontSize: 11, color: '#555' },
  statVal: { color: '#aaa' },
  lastActivity: { fontSize: 10, color: '#333', marginTop: 6 }
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
      style={hovered ? s.cardHover : s.card}
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
        <span style={s.healthLabel}>Health</span>
        <div style={s.healthBar}>
          <div style={s.healthFill(score)} />
        </div>
        <span style={s.healthScore(score)}>{score}</span>
      </div>
      <div style={s.statsRow}>
        <span style={s.stat}>Tasks: <span style={s.statVal}>{doneCount}/{tasks.length}</span></span>
      </div>
      <div style={s.lastActivity}>Last activity: {formatDate(lastActivity)}</div>
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
