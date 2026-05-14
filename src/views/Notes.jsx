import React, { useState, useRef } from 'react'

const VENTURES = [
  'hermes', 'buildyourbot', 'selfsellingai', 'zorbot', 'minimovies',
  'theriver', 'moraledge', 'thegetboaz', 'dubaiai', 'suman', 'podsupps', 'series'
]

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const s = {
  container: { padding: '16px 20px' },
  captureBox: {
    background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3,
    padding: '14px 16px', marginBottom: 16
  },
  captureLabel: { fontSize: 9, color: '#333', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8, display: 'block' },
  textarea: {
    width: '100%', background: '#080808', border: '1px solid #161616', borderRadius: 3,
    color: '#d5d5d5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '10px 12px', outline: 'none', minHeight: 70, resize: 'vertical',
    display: 'block', marginBottom: 8
  },
  captureRow: { display: 'flex', gap: 8, alignItems: 'center' },
  select: {
    background: '#080808', border: '1px solid #161616', borderRadius: 3,
    color: '#888', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
    padding: '5px 8px', outline: 'none', cursor: 'pointer', flex: 1
  },
  saveBtn: {
    padding: '5px 14px', background: '#f97316', color: '#080808',
    border: 'none', borderRadius: 3, fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
  },
  hint: { fontSize: 9, color: '#2a2a2a', marginLeft: 4 },
  filterRow: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #141414' },
  pill: (active) => ({
    padding: '3px 10px', borderRadius: 3, border: `1px solid ${active ? '#f97316' : '#1a1a1a'}`,
    background: active ? '#f97316' : 'transparent', color: active ? '#080808' : '#555',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, cursor: 'pointer'
  }),
  note: {
    background: '#0d0d0d', border: '1px solid #161616', borderRadius: 3,
    padding: '10px 14px', marginBottom: 5
  },
  noteHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  timestamp: { fontSize: 10, color: '#2d2d2d' },
  ventureBadge: {
    padding: '1px 6px', borderRadius: 2, background: 'transparent',
    border: '1px solid #1a1a1a', fontSize: 9, color: '#444'
  },
  deleteBtn: {
    padding: '2px 8px', background: 'transparent',
    border: '1px solid #1a1a1a', color: '#555', borderRadius: 4,
    fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
  },
  driveBtn: {
    padding: '2px 8px', background: 'transparent',
    border: '1px solid #1a1a1a', color: '#555', borderRadius: 4,
    fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
  },
  noteActions: { marginLeft: 'auto', display: 'flex', gap: 6 },
  noteText: { fontSize: 12, color: '#888', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  emptyState: { padding: 60, textAlign: 'center', color: '#2d2d2d', fontSize: 12 }
}

export default function Notes({ data, setData }) {
  const [text, setText] = useState('')
  const [venture, setVenture] = useState('')
  const [ventureFilter, setVentureFilter] = useState(null)
  const [driveStatus, setDriveStatus] = useState({})  // { [noteId]: 'uploading' | 'done' | { error } }
  const textareaRef = useRef(null)

  const saveNote = () => {
    if (!text.trim()) return
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    setData(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [id]: { id, text: text.trim(), venture: venture || null, createdAt: now }
      }
    }))
    setText('')
    setVenture('')
    textareaRef.current?.focus()
  }

  const deleteNote = (id) => {
    setData(prev => {
      const notes = { ...prev.notes }
      delete notes[id]
      return { ...prev, notes }
    })
  }

  const exportToDrive = async (note) => {
    setDriveStatus(prev => ({ ...prev, [note.id]: 'uploading' }))
    try {
      const title = note.text.split('\n')[0].slice(0, 60) || 'Note'
      const content = `# ${title}\n\n${note.text}\n\n---\nVenture: ${note.venture || 'none'}\nCreated: ${note.createdAt}`
      const res = await fetch('/api/drive/upload-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      const json = await res.json()
      if (json.error) {
        setDriveStatus(prev => ({ ...prev, [note.id]: { error: json.error } }))
      } else {
        setDriveStatus(prev => ({ ...prev, [note.id]: { link: json.webViewLink } }))
      }
    } catch (e) {
      setDriveStatus(prev => ({ ...prev, [note.id]: { error: e.message } }))
    }
  }

  const notes = Object.values(data.notes || {})
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(n => ventureFilter === null || n.venture === ventureFilter)

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      saveNote()
    }
  }

  return (
    <div style={s.container}>
      {/* Quick capture */}
      <div style={s.captureBox}>
        <div style={s.captureLabel}>Quick Capture</div>
        <textarea
          ref={textareaRef}
          style={s.textarea}
          placeholder="Capture a thought..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div style={s.captureRow}>
          <select style={s.select} value={venture} onChange={e => setVenture(e.target.value)}>
            <option value="">No venture</option>
            {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button style={s.saveBtn} onClick={saveNote}>Save</button>
          <span style={s.hint}>Cmd+Enter</span>
        </div>
      </div>

      {/* Venture filter */}
      <div style={s.filterRow}>
        <button style={s.pill(ventureFilter === null)} onClick={() => setVentureFilter(null)}>All</button>
        {VENTURES.map(v => (
          <button key={v} style={s.pill(ventureFilter === v)} onClick={() => setVentureFilter(ventureFilter === v ? null : v)}>
            {v}
          </button>
        ))}
      </div>

      {/* Notes list */}
      {notes.length === 0 && (
        <div style={s.emptyState}>No notes yet. Capture a thought above.</div>
      )}

      {notes.map(note => {
        const ds = driveStatus[note.id]
        return (
          <div key={note.id} style={s.note}>
            <div style={s.noteHeader}>
              <span style={s.timestamp}>{formatDate(note.createdAt)}</span>
              {note.venture && <span style={s.ventureBadge}>{note.venture}</span>}
              <div style={s.noteActions}>
                {ds === 'uploading' ? (
                  <span style={{ fontSize: 10, color: '#555' }}>Uploading...</span>
                ) : ds?.link ? (
                  <a href={ds.link} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: '#22c55e', textDecoration: 'none' }}>
                    Saved to Drive
                  </a>
                ) : ds?.error ? (
                  <span style={{ fontSize: 10, color: '#ef4444' }} title={ds.error}>Drive error</span>
                ) : (
                  <button style={s.driveBtn} onClick={() => exportToDrive(note)}>Export to Drive</button>
                )}
                <button style={s.deleteBtn} onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </div>
            <div style={s.noteText}>{note.text}</div>
          </div>
        )
      })}
    </div>
  )
}
