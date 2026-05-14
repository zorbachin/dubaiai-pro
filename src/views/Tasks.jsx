import React, { useState, useCallback, useEffect } from 'react'
import TaskTimer from '../components/TaskTimer.jsx'
import ActionRunner from '../components/ActionRunner.jsx'

const VENTURES = [
  'hermes', 'buildyourbot', 'selfsellingai', 'zorbot', 'minimovies',
  'theriver', 'moraledge', 'thegetboaz', 'dubaiai', 'suman', 'podsupps', 'series'
]

export function calcHealthScore(ventureKey, tasks, doneTasks, completedSteps) {
  let score = 100
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const oneDay = 24 * 60 * 60 * 1000

  // Find last completed task for this venture
  const doneTaskIds = new Set(doneTasks || [])
  const ventureDoneTasks = Object.values(tasks || {})
    .filter(t => t.venture === ventureKey && doneTaskIds.has(t.id))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  if (ventureDoneTasks.length === 0) {
    score -= 20
  } else {
    const lastDone = new Date(ventureDoneTasks[0].updatedAt).getTime()
    const daysSince = (now - lastDone) / sevenDays
    if (daysSince > 1) {
      score -= 10 * Math.floor(daysSince)
    }
    if (now - lastDone < oneDay) {
      score += 10
    }
  }

  return Math.max(0, Math.min(100, score))
}

function healthColor(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

const s = {
  container: { padding: 20 },
  filterBar: {
    display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center'
  },
  filterLabel: { fontSize: 11, color: '#555', marginRight: 4 },
  pill: (active) => ({
    padding: '4px 12px', borderRadius: 4, border: '1px solid #1a1a1a',
    background: active ? '#f97316' : '#111111', color: active ? '#080808' : '#555',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, cursor: 'pointer'
  }),
  addBtn: {
    marginLeft: 'auto', padding: '6px 14px', background: '#f97316', color: '#080808',
    border: 'none', borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12, fontWeight: 600, cursor: 'pointer'
  },
  taskCard: (expanded, blocked) => ({
    background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4,
    marginBottom: 8, opacity: blocked ? 0.6 : 1, cursor: 'pointer',
    borderLeft: blocked ? '2px solid #ef4444' : '2px solid transparent'
  }),
  cardHeader: {
    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10
  },
  taskTitle: {
    fontSize: 14, color: '#e5e5e5', flex: 1, fontWeight: 500
  },
  badge: (color) => ({
    padding: '2px 8px', borderRadius: 4, background: color || '#1a1a1a',
    fontSize: 10, color: '#e5e5e5', textTransform: 'uppercase', letterSpacing: '0.05em'
  }),
  timeBadge: {
    fontSize: 11, color: '#555', whiteSpace: 'nowrap'
  },
  dot: (color) => ({
    width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0
  }),
  lockIcon: { fontSize: 14, marginLeft: 4 },
  cardBody: {
    padding: '0 16px 16px', borderTop: '1px solid #1a1a1a'
  },
  section: { marginTop: 12 },
  sectionLabel: { fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 },
  sectionText: { fontSize: 13, color: '#aaa', lineHeight: 1.6 },
  promptBox: {
    background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: '10px 12px', fontSize: 12, color: '#aaa', lineHeight: 1.6,
    fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word'
  },
  copyBtn: {
    marginTop: 6, padding: '4px 12px', background: 'transparent', border: '1px solid #1a1a1a',
    color: '#555', borderRadius: 4, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
  },
  runBtn: {
    marginTop: 6, marginLeft: 8, padding: '4px 12px', background: '#f97316', border: 'none',
    color: '#080808', borderRadius: 4, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer', fontWeight: 600
  },
  stepRow: { display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  stepCheck: { width: 14, height: 14, marginTop: 2, cursor: 'pointer', accentColor: '#f97316', flexShrink: 0 },
  stepText: (done) => ({ fontSize: 12, color: done ? '#555' : '#aaa', textDecoration: done ? 'line-through' : 'none' }),
  stepLink: { color: '#f97316', fontSize: 11, marginLeft: 6 },
  resourceLink: { color: '#f97316', fontSize: 12, display: 'inline-block', marginRight: 12 },
  asset: { fontSize: 12, color: '#555', display: 'inline-block', marginRight: 8 },
  depList: { fontSize: 12, color: '#ef4444' },
  actionRow: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  dangerBtn: {
    padding: '4px 12px', background: 'transparent', border: '1px solid #ef4444',
    color: '#ef4444', borderRadius: 4, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
  },
  doneBtn: {
    padding: '4px 12px', background: '#22c55e', border: 'none',
    color: '#080808', borderRadius: 4, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer', fontWeight: 600
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: 40
  },
  modal: {
    background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: 24, width: 600, maxWidth: '90vw'
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#e5e5e5', marginBottom: 20
  },
  formGroup: { marginBottom: 12 },
  label: { display: 'block', fontSize: 11, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none'
  },
  select: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none', cursor: 'pointer'
  },
  textarea: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none', minHeight: 80, resize: 'vertical'
  },
  row2: { display: 'flex', gap: 12 },
  btnRow: { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 },
  btnPrimary: {
    background: '#f97316', color: '#080808', border: 'none', borderRadius: 4,
    padding: '8px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, cursor: 'pointer'
  },
  btnSecondary: {
    background: 'transparent', color: '#555', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: '8px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, cursor: 'pointer'
  },
  emptyState: { padding: 40, textAlign: 'center', color: '#555', fontSize: 13 },
  layout: { display: 'flex', gap: 20, alignItems: 'flex-start' },
  taskList: { flex: 1, minWidth: 0 },
  calSidebar: {
    width: 240, flexShrink: 0, background: '#111111',
    border: '1px solid #1a1a1a', borderRadius: 4, padding: 14
  },
  calTitle: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 },
  calEvent: { marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #1a1a1a' },
  calEventTitle: { fontSize: 12, color: '#e5e5e5', marginBottom: 2, lineHeight: 1.4 },
  calEventTime: { fontSize: 11, color: '#555' },
  calEmpty: { fontSize: 12, color: '#333' },
  calLoading: { fontSize: 12, color: '#333' },
}

const ENERGY_COLORS = { low: '#22c55e', medium: '#eab308', high: '#ef4444' }
const REVENUE_COLORS = { low: '#555', medium: '#f97316', high: '#22c55e' }

function formatEventTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function CalendarWidget() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/calendar/today')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setEvents(data.events || [])
      })
      .catch(e => setError(e.message))
  }, [])

  return (
    <div style={s.calSidebar}>
      <div style={s.calTitle}>Today</div>
      {events === null && !error && <div style={s.calLoading}>Loading...</div>}
      {error && (
        <div style={s.calEmpty}>
          {error.includes('not connected') ? 'Connect Google in Settings' : error}
        </div>
      )}
      {events && events.length === 0 && <div style={s.calEmpty}>No events today</div>}
      {events && events.map(ev => (
        <div key={ev.id} style={s.calEvent}>
          <div style={s.calEventTitle}>
            {ev.htmlLink
              ? <a href={ev.htmlLink} target="_blank" rel="noopener noreferrer" style={{ color: '#e5e5e5', textDecoration: 'none' }}>{ev.title}</a>
              : ev.title
            }
          </div>
          <div style={s.calEventTime}>
            {ev.allDay ? 'All day' : `${formatEventTime(ev.start)} – ${formatEventTime(ev.end)}`}
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    title: '', venture: 'hermes', time: 30, energy: 'medium', revenueImpact: 'medium',
    context: '', prompt: '', assets: '', resources: '', steps: '', dependsOn: ''
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.title.trim()) return
    const now = new Date().toISOString()
    const task = {
      id: initial?.id || crypto.randomUUID(),
      title: form.title.trim(),
      venture: form.venture,
      time: parseInt(form.time) || 30,
      energy: form.energy,
      revenueImpact: form.revenueImpact,
      context: form.context.trim(),
      prompt: form.prompt.trim(),
      assets: form.assets ? form.assets.split('\n').map(a => a.trim()).filter(Boolean) : [],
      resources: form.resources ? form.resources.split('\n').map(r => {
        const [label, url] = r.split('|').map(x => x.trim())
        return { label: label || r, url: url || '' }
      }).filter(r => r.label) : [],
      steps: form.steps ? form.steps.split('\n').map(s => {
        const [text, dest] = s.split('|').map(x => x.trim())
        return { text: text || s, dest: dest || null }
      }).filter(s => s.text) : [],
      dependsOn: form.dependsOn ? form.dependsOn.split(',').map(x => x.trim()).filter(Boolean) : [],
      createdAt: initial?.createdAt || now,
      updatedAt: now,
      timeLogs: initial?.timeLogs || []
    }
    onSave(task)
    onClose()
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalTitle}>{initial ? 'Edit Task' : 'New Task'}</div>

        <div style={s.formGroup}>
          <label style={s.label}>Title *</label>
          <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} autoFocus />
        </div>

        <div style={{ ...s.row2 }}>
          <div style={{ ...s.formGroup, flex: 1 }}>
            <label style={s.label}>Venture</label>
            <select style={s.select} value={form.venture} onChange={e => set('venture', e.target.value)}>
              {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ ...s.formGroup, width: 100 }}>
            <label style={s.label}>Time (min)</label>
            <input style={s.input} type="number" value={form.time} onChange={e => set('time', e.target.value)} />
          </div>
        </div>

        <div style={s.row2}>
          <div style={{ ...s.formGroup, flex: 1 }}>
            <label style={s.label}>Energy</label>
            <select style={s.select} value={form.energy} onChange={e => set('energy', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={{ ...s.formGroup, flex: 1 }}>
            <label style={s.label}>Revenue Impact</label>
            <select style={s.select} value={form.revenueImpact} onChange={e => set('revenueImpact', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Context</label>
          <textarea style={s.textarea} value={form.context} onChange={e => set('context', e.target.value)} rows={3} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Prompt</label>
          <textarea style={s.textarea} value={form.prompt} onChange={e => set('prompt', e.target.value)} rows={4} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Assets (one per line)</label>
          <textarea style={{ ...s.textarea, minHeight: 50 }} value={form.assets}
            onChange={e => set('assets', e.target.value)} placeholder="asset name..." />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Resources (label|url, one per line)</label>
          <textarea style={{ ...s.textarea, minHeight: 50 }} value={form.resources}
            onChange={e => set('resources', e.target.value)} placeholder="Docs|https://..." />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Steps (text|dest url, one per line)</label>
          <textarea style={{ ...s.textarea, minHeight: 60 }} value={form.steps}
            onChange={e => set('steps', e.target.value)} placeholder="Open dashboard|https://..." />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Depends On (task IDs, comma separated)</label>
          <input style={s.input} value={form.dependsOn} onChange={e => set('dependsOn', e.target.value)} />
        </div>

        <div style={s.btnRow}>
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={handleSave}>Save Task</button>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task, data, setData, expanded, onExpand }) {
  const [actionRunnerPrompt, setActionRunnerPrompt] = useState(null)
  const [showEdit, setShowEdit] = useState(false)

  const doneTasks = data.doneTasks || []
  const completedSteps = data.completedSteps || []

  const isBlocked = (task.dependsOn || []).some(id => !doneTasks.includes(id))
  const blockingTitles = (task.dependsOn || [])
    .filter(id => !doneTasks.includes(id))
    .map(id => data.tasks[id]?.title || id)

  const score = calcHealthScore(task.venture, data.tasks, doneTasks, completedSteps)

  const toggleStep = (e, idx) => {
    e.stopPropagation()
    const key = `${task.id}:${idx}`
    setData(prev => {
      const steps = prev.completedSteps || []
      const next = steps.includes(key) ? steps.filter(s => s !== key) : [...steps, key]
      return { ...prev, completedSteps: next }
    })
  }

  const markDone = (e) => {
    e.stopPropagation()
    if (!doneTasks.includes(task.id)) {
      setData(prev => ({
        ...prev,
        doneTasks: [...(prev.doneTasks || []), task.id],
        tasks: { ...prev.tasks, [task.id]: { ...prev.tasks[task.id], updatedAt: new Date().toISOString() } }
      }))
      // Fire Zapier webhook if enabled
      if (data.settings?.zapierEnabled) {
        fetch('/api/zapier/task-done', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: task.id,
            taskTitle: task.title,
            venture: task.venture,
            completedAt: new Date().toISOString()
          })
        }).catch(err => console.warn('[zorba-ui] Zapier webhook failed:', err.message))
      }
    }
  }

  const deleteTask = (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this task?')) return
    setData(prev => {
      const tasks = { ...prev.tasks }
      delete tasks[task.id]
      return { ...prev, tasks }
    })
  }

  const copyPrompt = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(task.prompt)
  }

  const isDone = doneTasks.includes(task.id)

  return (
    <>
      <div style={s.taskCard(expanded, isBlocked)} onClick={onExpand}>
        <div style={s.cardHeader}>
          {isBlocked && <span style={s.lockIcon} title={`Blocked by: ${blockingTitles.join(', ')}`}>&#128274;</span>}
          {isDone && <span style={{ fontSize: 12, color: '#22c55e' }}>DONE</span>}
          <span style={s.taskTitle}>{task.title}</span>
          <span style={s.badge()}>{task.venture}</span>
          <span style={s.timeBadge}>{task.time}m</span>
          <span style={s.dot(ENERGY_COLORS[task.energy])} title={`Energy: ${task.energy}`} />
          <span style={s.dot(REVENUE_COLORS[task.revenueImpact])} title={`Revenue: ${task.revenueImpact}`} />
          <TaskTimer taskId={task.id} data={data} setData={setData} onClick={e => e.stopPropagation()} />
        </div>

        {expanded && (
          <div style={s.cardBody} onClick={e => e.stopPropagation()}>
            {isBlocked && (
              <div style={{ ...s.section }}>
                <div style={s.sectionLabel}>Blocked by</div>
                <div style={s.depList}>{blockingTitles.join(', ')}</div>
              </div>
            )}

            {task.context && (
              <div style={s.section}>
                <div style={s.sectionLabel}>Context</div>
                <div style={s.sectionText}>{task.context}</div>
              </div>
            )}

            {task.prompt && (
              <div style={s.section}>
                <div style={s.sectionLabel}>Prompt</div>
                <div style={s.promptBox}>{task.prompt}</div>
                <button style={s.copyBtn} onClick={copyPrompt}>Copy</button>
                <button style={s.runBtn} onClick={() => setActionRunnerPrompt(task.prompt)}>Run</button>
              </div>
            )}

            {task.assets && task.assets.length > 0 && (
              <div style={s.section}>
                <div style={s.sectionLabel}>Assets</div>
                {task.assets.map((a, i) => <span key={i} style={s.asset}>{a}</span>)}
              </div>
            )}

            {task.resources && task.resources.length > 0 && (
              <div style={s.section}>
                <div style={s.sectionLabel}>Resources</div>
                {task.resources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={s.resourceLink}
                    onClick={e => e.stopPropagation()}>{r.label}</a>
                ))}
              </div>
            )}

            {task.steps && task.steps.length > 0 && (
              <div style={s.section}>
                <div style={s.sectionLabel}>Steps</div>
                {task.steps.map((step, i) => {
                  const done = completedSteps.includes(`${task.id}:${i}`)
                  return (
                    <div key={i} style={s.stepRow}>
                      <input type="checkbox" style={s.stepCheck} checked={done} onChange={e => toggleStep(e, i)} />
                      <span style={s.stepText(done)}>{step.text}</span>
                      {step.dest && (
                        <a href={step.dest} target="_blank" rel="noopener noreferrer"
                          style={s.stepLink} onClick={e => e.stopPropagation()}>Open</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div style={s.actionRow}>
              {!isDone && <button style={s.doneBtn} onClick={markDone}>Mark Done</button>}
              <button style={s.copyBtn} onClick={() => setShowEdit(true)}>Edit</button>
              <button style={s.dangerBtn} onClick={deleteTask}>Delete</button>
            </div>
          </div>
        )}
      </div>

      {actionRunnerPrompt && (
        <ActionRunner
          prompt={actionRunnerPrompt}
          data={data}
          setData={setData}
          onClose={() => setActionRunnerPrompt(null)}
        />
      )}

      {showEdit && (
        <TaskModal
          initial={{
            ...task,
            assets: (task.assets || []).join('\n'),
            resources: (task.resources || []).map(r => `${r.label}|${r.url}`).join('\n'),
            steps: (task.steps || []).map(s => s.dest ? `${s.text}|${s.dest}` : s.text).join('\n'),
            dependsOn: (task.dependsOn || []).join(', ')
          }}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => {
            setData(prev => ({ ...prev, tasks: { ...prev.tasks, [updated.id]: updated } }))
          }}
        />
      )}
    </>
  )
}

export default function Tasks({ data, setData, ventureFilter, setVentureFilter, setView }) {
  const [expandedId, setExpandedId] = useState(null)
  const [energyFilter, setEnergyFilter] = useState(null)
  const [revenueFilter, setRevenueFilter] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const tasks = Object.values(data.tasks || {})

  const filtered = tasks.filter(t => {
    if (ventureFilter && t.venture !== ventureFilter) return false
    if (energyFilter && t.energy !== energyFilter) return false
    if (revenueFilter && t.revenueImpact !== revenueFilter) return false
    return true
  })

  const revenueOrder = { high: 0, medium: 1, low: 2 }
  filtered.sort((a, b) => {
    const rv = revenueOrder[a.revenueImpact] - revenueOrder[b.revenueImpact]
    if (rv !== 0) return rv
    return (a.time || 0) - (b.time || 0)
  })

  const handleAddTask = (task) => {
    setData(prev => ({ ...prev, tasks: { ...prev.tasks, [task.id]: task } }))
  }

  return (
    <div style={s.container}>
      <div style={s.filterBar}>
        <span style={s.filterLabel}>Energy:</span>
        {[null, 'low', 'medium', 'high'].map(e => (
          <button key={String(e)} style={s.pill(energyFilter === e)} onClick={() => setEnergyFilter(e)}>
            {e === null ? 'All' : e}
          </button>
        ))}
        <span style={{ ...s.filterLabel, marginLeft: 8 }}>Revenue:</span>
        {[null, 'low', 'medium', 'high'].map(r => (
          <button key={String(r)} style={s.pill(revenueFilter === r)} onClick={() => setRevenueFilter(r)}>
            {r === null ? 'All' : r}
          </button>
        ))}
        <button style={s.addBtn} onClick={() => setShowAddModal(true)}>+ Add Task</button>
      </div>

      <div style={s.layout}>
        <div style={s.taskList}>
          {filtered.length === 0 && (
            <div style={s.emptyState}>No tasks match the current filters.</div>
          )}

          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              data={data}
              setData={setData}
              expanded={expandedId === task.id}
              onExpand={() => setExpandedId(expandedId === task.id ? null : task.id)}
            />
          ))}
        </div>

        <CalendarWidget />
      </div>

      {showAddModal && (
        <TaskModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTask}
        />
      )}
    </div>
  )
}
