import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useData } from './hooks/useData.js'
import { useKeyboard } from './hooks/useKeyboard.js'
import Tasks from './views/Tasks.jsx'
import Ventures from './views/Ventures.jsx'
import Library from './views/Library.jsx'
import Notes from './views/Notes.jsx'
import Settings from './views/Settings.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import MorningScroll from './components/MorningScroll.jsx'

const VIEWS = ['Tasks', 'Ventures', 'Library', 'Notes', 'Settings']

const VENTURES = [
  'hermes', 'buildyourbot', 'selfsellingai', 'zorbot', 'minimovies',
  'theriver', 'moraledge', 'thegetboaz', 'dubaiai', 'suman', 'podsupps', 'series'
]

const styles = {
  mobileGuard: {
    position: 'fixed', inset: 0, background: '#080808', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
    gap: 16, color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", padding: 24, textAlign: 'center'
  },
  shell: {
    display: 'flex', height: '100vh', overflow: 'hidden', background: '#080808'
  },
  sidebar: {
    width: 200, minWidth: 200, background: '#111111', borderRight: '1px solid #1a1a1a',
    display: 'flex', flexDirection: 'column', padding: '0', overflowY: 'auto'
  },
  sidebarHeader: {
    padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a'
  },
  appName: {
    fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
    color: '#f97316', letterSpacing: '0.05em'
  },
  statusRow: {
    display: 'flex', alignItems: 'center', gap: 6, marginTop: 6
  },
  statusDot: (status) => ({
    width: 6, height: 6, borderRadius: '50%',
    background: status === 'ready' ? '#22c55e' : status === 'saving' ? '#f97316' : '#ef4444',
    flexShrink: 0
  }),
  statusText: {
    fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em'
  },
  nav: {
    padding: '12px 0', flex: 1
  },
  navItem: (active) => ({
    display: 'block', width: '100%', padding: '8px 16px', textAlign: 'left',
    background: active ? '#1a1a1a' : 'transparent',
    color: active ? '#f97316' : '#e5e5e5',
    border: 'none', borderLeft: active ? '2px solid #f97316' : '2px solid transparent',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, cursor: 'pointer',
    letterSpacing: '0.02em', transition: 'all 0.1s'
  }),
  shortcutHint: {
    fontSize: 10, color: '#333', marginLeft: 'auto', float: 'right'
  },
  ventureSection: {
    padding: '8px 0', borderTop: '1px solid #1a1a1a'
  },
  ventureLabel: {
    padding: '4px 16px', fontSize: 10, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em'
  },
  venturePill: (active) => ({
    display: 'block', width: '100%', padding: '4px 16px', textAlign: 'left',
    background: active ? '#1a1a1a' : 'transparent',
    color: active ? '#f97316' : '#555',
    border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
    cursor: 'pointer', transition: 'all 0.1s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
  }),
  main: {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'
  },
  topBar: {
    height: 48, borderBottom: '1px solid #1a1a1a', display: 'flex',
    alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0
  },
  viewTitle: {
    fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em'
  },
  cmdHint: {
    marginLeft: 'auto', fontSize: 11, color: '#333'
  },
  content: {
    flex: 1, overflow: 'auto'
  },
  banner: {
    background: '#1a0a00', borderBottom: '1px solid #f97316', padding: '8px 20px',
    fontSize: 12, color: '#f97316', display: 'flex', alignItems: 'center', gap: 8
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: 24, width: 480, maxWidth: '90vw'
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#e5e5e5', marginBottom: 16
  },
  input: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none', marginBottom: 12
  },
  select: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none', marginBottom: 12, cursor: 'pointer'
  },
  textarea: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none', marginBottom: 12, minHeight: 80, resize: 'vertical'
  },
  btnRow: {
    display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4
  },
  btnPrimary: {
    background: '#f97316', color: '#080808', border: 'none', borderRadius: 4,
    padding: '8px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    fontWeight: 600, cursor: 'pointer'
  },
  btnSecondary: {
    background: 'transparent', color: '#555', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: '8px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, cursor: 'pointer'
  },
  typeRow: {
    display: 'flex', gap: 8, marginBottom: 16
  },
  typeBtn: (active) => ({
    flex: 1, padding: '8px', background: active ? '#f97316' : '#080808',
    color: active ? '#080808' : '#555', border: '1px solid #1a1a1a', borderRadius: 4,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, cursor: 'pointer'
  })
}

function QuickAddModal({ onClose, data, setData, defaultType }) {
  const [type, setType] = useState(defaultType || 'task')
  const [title, setTitle] = useState('')
  const [venture, setVenture] = useState('')
  const [noteText, setNoteText] = useState('')

  const handleSubmit = () => {
    if (type === 'task') {
      if (!title.trim()) return
      const { v4: uuidv4 } = { v4: () => crypto.randomUUID() }
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      setData(prev => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [id]: {
            id, title: title.trim(), venture: venture || 'hermes',
            time: 30, energy: 'medium', revenueImpact: 'medium',
            context: '', prompt: '', assets: [], resources: [],
            steps: [], dependsOn: [], createdAt: now, updatedAt: now, timeLogs: []
          }
        }
      }))
    } else {
      if (!noteText.trim()) return
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      setData(prev => ({
        ...prev,
        notes: {
          ...prev.notes,
          [id]: { id, text: noteText.trim(), venture: venture || null, createdAt: now }
        }
      }))
    }
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalTitle}>Quick Add</div>
        <div style={styles.typeRow}>
          <button style={styles.typeBtn(type === 'task')} onClick={() => setType('task')}>Task</button>
          <button style={styles.typeBtn(type === 'note')} onClick={() => setType('note')}>Note</button>
        </div>
        {type === 'task' ? (
          <>
            <input style={styles.input} placeholder="Task title..." value={title}
              onChange={e => setTitle(e.target.value)} autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <select style={styles.select} value={venture} onChange={e => setVenture(e.target.value)}>
              <option value="">Select venture...</option>
              {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </>
        ) : (
          <>
            <textarea style={styles.textarea} placeholder="Note text..." value={noteText}
              onChange={e => setNoteText(e.target.value)} autoFocus
              onKeyDown={e => e.key === 'Enter' && e.metaKey && handleSubmit()} />
            <select style={styles.select} value={venture} onChange={e => setVenture(e.target.value)}>
              <option value="">No venture</option>
              {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </>
        )}
        <div style={styles.btnRow}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { data, setData, forceSave, status } = useData()
  const [view, setView] = useState(0)
  const [ventureFilter, setVentureFilter] = useState(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showMorningScroll, setShowMorningScroll] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const searchRef = useRef(null)

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  // Show morning scroll if hour < 10
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 10 && data) {
      setShowMorningScroll(true)
    }
  }, [data !== null])

  const keyHandlers = useCallback({
    'Cmd+1': (e) => { e.preventDefault(); setView(0) },
    'Cmd+2': (e) => { e.preventDefault(); setView(1) },
    'Cmd+3': (e) => { e.preventDefault(); setView(2) },
    'Cmd+4': (e) => { e.preventDefault(); setView(3) },
    'Cmd+5': (e) => { e.preventDefault(); setView(4) },
    'Ctrl+1': (e) => { e.preventDefault(); setView(0) },
    'Ctrl+2': (e) => { e.preventDefault(); setView(1) },
    'Ctrl+3': (e) => { e.preventDefault(); setView(2) },
    'Ctrl+4': (e) => { e.preventDefault(); setView(3) },
    'Ctrl+5': (e) => { e.preventDefault(); setView(4) },
    'Cmd+k': (e) => { e.preventDefault(); setShowCommandPalette(true) },
    'Ctrl+k': (e) => { e.preventDefault(); setShowCommandPalette(true) },
    'Cmd+K': (e) => { e.preventDefault(); setShowCommandPalette(true) },
    'Ctrl+K': (e) => { e.preventDefault(); setShowCommandPalette(true) },
    'Cmd+n': (e) => { e.preventDefault(); setShowQuickAdd(true) },
    'Ctrl+n': (e) => { e.preventDefault(); setShowQuickAdd(true) },
    'Cmd+N': (e) => { e.preventDefault(); setShowQuickAdd(true) },
    'Ctrl+N': (e) => { e.preventDefault(); setShowQuickAdd(true) },
    'Cmd+s': (e) => { e.preventDefault(); forceSave() },
    'Ctrl+s': (e) => { e.preventDefault(); forceSave() },
    'Cmd+S': (e) => { e.preventDefault(); forceSave() },
    'Ctrl+S': (e) => { e.preventDefault(); forceSave() },
    'Escape': () => {
      setShowCommandPalette(false)
      setShowQuickAdd(false)
      setShowMorningScroll(false)
    }
  }, [forceSave])

  useKeyboard(keyHandlers)

  if (isMobile) {
    return (
      <div style={styles.mobileGuard}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#f97316' }}>Zorba OS</div>
        <div style={{ fontSize: 14, color: '#555', maxWidth: 300 }}>
          Use a desktop browser. Zorba OS requires a minimum width of 1024px.
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ ...styles.mobileGuard }}>
        <div style={{ color: '#555', fontSize: 13 }}>
          {status === 'error' ? 'Error connecting to server. Is Express running on port 3001?' : 'Loading...'}
        </div>
      </div>
    )
  }

  const currentView = VIEWS[view]

  const renderView = () => {
    switch (view) {
      case 0: return <Tasks data={data} setData={setData} ventureFilter={ventureFilter} setVentureFilter={setVentureFilter} setView={setView} />
      case 1: return <Ventures data={data} setData={setData} setView={setView} setVentureFilter={setVentureFilter} />
      case 2: return <Library data={data} setData={setData} />
      case 3: return <Notes data={data} setData={setData} />
      case 4: return <Settings data={data} setData={setData} />
      default: return null
    }
  }

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.appName}>ZORBA OS</div>
          <div style={styles.statusRow}>
            <div style={styles.statusDot(status)} />
            <span style={styles.statusText}>
              {status === 'ready' ? 'connected' : status === 'saving' ? 'saving' : status === 'disconnected' ? 'offline' : status}
            </span>
          </div>
        </div>

        <nav style={styles.nav}>
          {VIEWS.map((v, i) => (
            <button key={v} style={styles.navItem(view === i)} onClick={() => setView(i)}>
              {v}
              <span style={styles.shortcutHint}>Cmd+{i + 1}</span>
            </button>
          ))}
        </nav>

        {/* Venture filter pills — only in Tasks view */}
        {view === 0 && (
          <div style={styles.ventureSection}>
            <div style={styles.ventureLabel}>Ventures</div>
            <button
              style={styles.venturePill(ventureFilter === null)}
              onClick={() => setVentureFilter(null)}
            >
              All
            </button>
            {VENTURES.map(v => (
              <button
                key={v}
                style={styles.venturePill(ventureFilter === v)}
                onClick={() => setVentureFilter(ventureFilter === v ? null : v)}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main area */}
      <div style={styles.main}>
        {status === 'disconnected' && (
          <div style={styles.banner}>
            <span>Server disconnected — polling for reconnection...</span>
          </div>
        )}
        <div style={styles.topBar}>
          <span style={styles.viewTitle}>{currentView}</span>
          <span style={styles.cmdHint}>Cmd+K — command palette</span>
        </div>
        <div style={styles.content}>
          {renderView()}
        </div>
      </div>

      {/* Morning Scroll */}
      {showMorningScroll && data && (
        <MorningScroll data={data} onClose={() => setShowMorningScroll(false)} />
      )}

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          data={data}
          setData={setData}
          onClose={() => setShowCommandPalette(false)}
          setView={(v) => { setView(v); setShowCommandPalette(false) }}
          onMorningScroll={() => { setShowMorningScroll(true); setShowCommandPalette(false) }}
        />
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal
          data={data}
          setData={setData}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  )
}
