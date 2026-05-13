import React, { useState, useRef, useEffect, useMemo } from 'react'

const VIEWS = ['Tasks', 'Ventures', 'Library', 'Notes', 'Settings']

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' },
  modal: { width: 560, maxWidth: '95vw', background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' },
  searchRow: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1a1a1a' },
  searchIcon: { color: '#555', marginRight: 10, fontSize: 14 },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 },
  results: { maxHeight: 360, overflowY: 'auto' },
  group: { padding: '6px 0' },
  groupLabel: { fontSize: 9, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 16px' },
  item: (active) => ({
    padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    background: active ? '#1a1a1a' : 'transparent', transition: 'background 0.1s'
  }),
  itemIcon: { fontSize: 12, color: '#555', width: 16, flexShrink: 0 },
  itemTitle: (active) => ({ fontSize: 13, color: active ? '#e5e5e5' : '#888', flex: 1 }),
  itemHint: { fontSize: 10, color: '#333' },
  empty: { padding: '20px 16px', fontSize: 12, color: '#333', textAlign: 'center' },
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
          <span style={{ fontSize: 10, color: '#333' }}>Esc to close</span>
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
