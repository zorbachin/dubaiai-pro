import React, { useState, useRef, useEffect, useMemo } from 'react'

const VIEWS = ['Tasks', 'Ventures', 'Library', 'Notes', 'Settings']

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 500,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh'
  },
  modal: {
    width: 580, maxWidth: '95vw', background: '#0d0d0d',
    border: '1px solid #222', borderRadius: 4, overflow: 'hidden',
    boxShadow: '0 32px 80px rgba(0,0,0,0.9)'
  },
  searchRow: {
    display: 'flex', alignItems: 'center', padding: '14px 18px',
    borderBottom: '1px solid #1a1a1a'
  },
  searchIcon: { color: '#333', marginRight: 10, fontSize: 13 },
  input: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
    letterSpacing: '0.01em'
  },
  escHint: { fontSize: 10, color: '#2a2a2a' },
  results: { maxHeight: 380, overflowY: 'auto' },
  group: { padding: '4px 0' },
  groupLabel: {
    fontSize: 9, color: '#2d2d2d', letterSpacing: '0.14em',
    textTransform: 'uppercase', padding: '8px 18px 4px'
  },
  item: (active) => ({
    padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    background: active ? '#161616' : 'transparent',
    borderLeft: active ? '2px solid #f97316' : '2px solid transparent'
  }),
  itemIcon: { fontSize: 11, color: '#333', width: 14, flexShrink: 0 },
  itemTitle: (active) => ({ fontSize: 13, color: active ? '#e5e5e5' : '#666', flex: 1 }),
  itemHint: { fontSize: 9, color: '#2d2d2d', background: '#161616', padding: '1px 5px', borderRadius: 2 },
  empty: { padding: '24px 18px', fontSize: 12, color: '#2d2d2d', textAlign: 'center' },
}

export default function CommandPalette({ data, setData, onClose, setView, onMorningScroll }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const items = useMemo(() => {
    const q = query.toLowerCase()
    const results = []

    // Navigate to views
    VIEWS.forEach((v, i) => {
      if (!q || v.toLowerCase().includes(q) || ['go', 'view', 'nav'].some(k => q.includes(k))) {
        results.push({ id: `view-${i}`, group: 'Navigate', icon: '→', title: v, hint: `Cmd+${i + 1}`, action: () => setView(i) })
      }
    })

    // Morning scroll
    if (!q || 'morning scroll'.includes(q)) {
      results.push({ id: 'morning', group: 'Actions', icon: '★', title: 'Morning Scroll', hint: '', action: onMorningScroll })
    }

    // Tasks
    Object.values(data.tasks || {})
      .filter(t => !(data.doneTasks || []).includes(t.id))
      .filter(t => !q || t.title?.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(t => {
        results.push({ id: `task-${t.id}`, group: 'Tasks', icon: '◦', title: t.title, hint: t.venture, action: () => { setView(0) } })
      })

    // Library
    Object.values(data.library || {})
      .filter(i => !q || i.title?.toLowerCase().includes(q) || i.content?.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach(i => {
        results.push({ id: `lib-${i.id}`, group: 'Library', icon: '▤', title: i.title, hint: i.type, action: () => setView(2) })
      })

    // Quick note
    if (q) {
      results.push({
        id: 'quick-note',
        group: 'Actions',
        icon: '+',
        title: `Add note: "${query}"`,
        hint: '',
        action: () => {
          const id = crypto.randomUUID()
          setData(prev => ({
            ...prev,
            notes: { ...prev.notes, [id]: { id, text: query, venture: null, createdAt: new Date().toISOString() } }
          }))
          onClose()
        }
      })
    }

    return results
  }, [query, data])

  useEffect(() => { setActiveIdx(0) }, [query])

  const handleKey = (e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, items.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && items[activeIdx]) {
      items[activeIdx].action()
      if (!items[activeIdx].id.startsWith('quick-note')) onClose()
    }
  }

  const groups = [...new Set(items.map(i => i.group))]

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.searchRow}>
          <span style={s.searchIcon}>⌘</span>
          <input
            ref={inputRef}
            style={s.input}
            placeholder="Search tasks, library, navigate..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <span style={s.escHint}>esc</span>
        </div>
        <div style={s.results} ref={listRef}>
          {items.length === 0 && <div style={s.empty}>No results</div>}
          {groups.map(group => {
            const groupItems = items.filter(i => i.group === group)
            return (
              <div key={group} style={s.group}>
                <div style={s.groupLabel}>{group}</div>
                {groupItems.map(item => {
                  const idx = items.indexOf(item)
                  const active = idx === activeIdx
                  return (
                    <div
                      key={item.id}
                      style={s.item(active)}
                      onClick={() => { item.action(); if (!item.id.startsWith('quick-note')) onClose() }}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      <span style={s.itemIcon}>{item.icon}</span>
                      <span style={s.itemTitle(active)}>{item.title}</span>
                      {item.hint && <span style={s.itemHint}>{item.hint}</span>}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
