import React, { useState, useMemo } from 'react'
import ActionRunner from '../components/ActionRunner.jsx'

const VENTURES = [
  'hermes', 'buildyourbot', 'selfsellingai', 'zorbot', 'minimovies',
  'theriver', 'moraledge', 'thegetboaz', 'dubaiai', 'suman', 'podsupps', 'series'
]

const TYPES = ['prompt', 'template', 'strategy', 'link', 'doc']

const TYPE_COLORS = {
  prompt: '#f97316', template: '#22c55e', strategy: '#a78bfa',
  link: '#38bdf8', doc: '#e5e5e5'
}

const s = {
  container: { padding: 20 },
  toolbar: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' },
  searchInput: {
    flex: 1, minWidth: 200, background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none'
  },
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
  filterRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  item: { background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4, marginBottom: 8 },
  itemHeader: { padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 },
  itemTitle: { fontSize: 14, color: '#e5e5e5', flex: 1, fontWeight: 500 },
  typeBadge: (type) => ({
    padding: '2px 8px', borderRadius: 4, border: `1px solid ${TYPE_COLORS[type] || '#1a1a1a'}`,
    color: TYPE_COLORS[type] || '#aaa', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em'
  }),
  tag: {
    padding: '1px 6px', borderRadius: 4, background: '#080808',
    border: '1px solid #1a1a1a', fontSize: 10, color: '#555'
  },
  itemBody: { padding: '0 16px 16px', borderTop: '1px solid #1a1a1a' },
  contentBox: {
    background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: '10px 12px', fontSize: 12, color: '#aaa', lineHeight: 1.6,
    fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    marginTop: 12, maxHeight: 200, overflow: 'hidden'
  },
  contentBoxExpanded: {
    background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: '10px 12px', fontSize: 12, color: '#aaa', lineHeight: 1.6,
    fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    marginTop: 12
  },
  showMoreBtn: {
    fontSize: 11, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4
  },
  actionRow: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' },
  editInput: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
    padding: '8px 12px', outline: 'none', marginBottom: 8
  },
  editTextarea: {
    width: '100%', background: '#080808', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    padding: '8px 12px', outline: 'none', minHeight: 120, resize: 'vertical', marginBottom: 8
  },
  versionBtn: {
    padding: '2px 8px', background: 'transparent', border: '1px solid #1a1a1a',
    color: '#555', borderRadius: 4, fontSize: 10, cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace"
  },
  btnSmall: (accent) => ({
    padding: '4px 12px', background: accent ? '#f97316' : 'transparent',
    color: accent ? '#080808' : '#555', border: accent ? 'none' : '1px solid #1a1a1a',
    borderRadius: 4, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer',
    fontWeight: accent ? 600 : 400
  }),
  dangerBtn: {
    padding: '4px 12px', background: 'transparent', border: '1px solid #ef4444',
    color: '#ef4444', borderRadius: 4, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
  },
  versionsSection: { marginTop: 12, borderTop: '1px solid #1a1a1a', paddingTop: 10 },
  versionRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 11, color: '#555' },
  emptyState: { padding: 40, textAlign: 'center', color: '#555', fontSize: 13 },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: 40
  },
  modal: {
    background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4,
    padding: 24, width: 560, maxWidth: '90vw'
  },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#e5e5e5', marginBottom: 20 },
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
    padding: '8px 12px', outline: 'none', minHeight: 160, resize: 'vertical'
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
  }
}

function ItemModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    title: '', type: 'prompt', venture: 'all', content: '', tags: ''
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) return
    const now = new Date().toISOString()
    const item = {
      id: initial?.id || crypto.randomUUID(),
      title: form.title.trim(),
      type: form.type,
      venture: form.venture,
      content: form.content,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      versions: initial?.versions || [],
      createdAt: initial?.createdAt || now,
      updatedAt: now
    }
    onSave(item)
    onClose()
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalTitle}>{initial ? 'Edit Item' : 'New Library Item'}</div>

        <div style={s.formGroup}>
          <label style={s.label}>Title *</label>
          <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} autoFocus />
        </div>

        <div style={{ ...s.row2 }}>
          <div style={{ ...s.formGroup, flex: 1 }}>
            <label style={s.label}>Type</label>
            <select style={s.select} value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ ...s.formGroup, flex: 1 }}>
            <label style={s.label}>Venture</label>
            <select style={s.select} value={form.venture} onChange={e => set('venture', e.target.value)}>
              <option value="all">All</option>
              {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Content</label>
          <textarea style={s.textarea} value={form.content} onChange={e => set('content', e.target.value)} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Tags (comma separated)</label>
          <input style={s.input} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="tag1, tag2..." />
        </div>

        <div style={s.btnRow}>
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

function LibraryItem({ item, data, setData }) {
  const [expanded, setExpanded] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [actionRunnerPrompt, setActionRunnerPrompt] = useState(null)

  const saveEdit = (updated) => {
    setData(prev => {
      const existingContent = prev.library[updated.id]?.content || ''
      let versions = updated.versions || []
      if (existingContent && existingContent !== updated.content) {
        versions = [{ content: existingContent, savedAt: new Date().toISOString() }, ...versions].slice(0, 5)
      }
      return { ...prev, library: { ...prev.library, [updated.id]: { ...updated, versions } } }
    })
  }

  const deleteItem = () => {
    if (!window.confirm('Delete this item?')) return
    setData(prev => {
      const library = { ...prev.library }
      delete library[item.id]
      return { ...prev, library }
    })
  }

  const restoreVersion = (vContent) => {
    setData(prev => {
      const curr = prev.library[item.id]
      const versions = [{ content: curr.content, savedAt: new Date().toISOString() }, ...(curr.versions || [])].slice(0, 5)
      return {
        ...prev,
        library: { ...prev.library, [item.id]: { ...curr, content: vContent, versions, updatedAt: new Date().toISOString() } }
      }
    })
  }

  return (
    <>
      <div style={s.item}>
        <div style={s.itemHeader} onClick={() => setExpanded(!expanded)}>
          <span style={s.itemTitle}>{item.title}</span>
          <span style={s.typeBadge(item.type)}>{item.type}</span>
          {item.venture !== 'all' && <span style={{ fontSize: 11, color: '#555' }}>{item.venture}</span>}
          {(item.tags || []).map(tag => <span key={tag} style={s.tag}>{tag}</span>)}
        </div>

        {expanded && (
          <div style={s.itemBody}>
            <div style={showMore ? s.contentBoxExpanded : s.contentBox}>{item.content}</div>
            {item.content && item.content.length > 300 && (
              <button style={s.showMoreBtn} onClick={() => setShowMore(!showMore)}>
                {showMore ? 'Show less' : 'Show more'}
              </button>
            )}

            <div style={s.actionRow}>
              <button style={s.btnSmall(true)} onClick={() => setActionRunnerPrompt(item.content)}>Run</button>
              <button style={s.btnSmall(false)} onClick={() => setShowEdit(true)}>Edit</button>
              <button style={s.btnSmall(false)} onClick={() => navigator.clipboard.writeText(item.content)}>Copy</button>
              {item.versions && item.versions.length > 0 && (
                <button style={s.btnSmall(false)} onClick={() => setShowVersions(!showVersions)}>
                  Versions ({item.versions.length})
                </button>
              )}
              <button style={s.dangerBtn} onClick={deleteItem}>Delete</button>
            </div>

            {showVersions && item.versions && item.versions.length > 0 && (
              <div style={s.versionsSection}>
                <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Version History</div>
                {item.versions.map((v, i) => (
                  <div key={i} style={s.versionRow}>
                    <span>v{item.versions.length - i}: {new Date(v.savedAt).toLocaleString()}</span>
                    <button style={s.versionBtn} onClick={() => restoreVersion(v.content)}>Restore</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && (
        <ItemModal
          initial={{ ...item, tags: (item.tags || []).join(', ') }}
          onClose={() => setShowEdit(false)}
          onSave={saveEdit}
        />
      )}

      {actionRunnerPrompt && (
        <ActionRunner
          prompt={actionRunnerPrompt}
          data={data}
          setData={setData}
          onClose={() => setActionRunnerPrompt(null)}
        />
      )}
    </>
  )
}

export default function Library({ data, setData }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState(null)
  const [ventureFilter, setVentureFilter] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const items = useMemo(() => {
    let list = Object.values(data.library || {})
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    if (typeFilter) list = list.filter(i => i.type === typeFilter)
    if (ventureFilter) list = list.filter(i => i.venture === ventureFilter || i.venture === 'all')
    return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [data.library, search, typeFilter, ventureFilter])

  const handleAdd = (item) => {
    setData(prev => ({ ...prev, library: { ...prev.library, [item.id]: item } }))
  }

  return (
    <div style={s.container}>
      <div style={s.toolbar}>
        <input
          style={s.searchInput}
          placeholder="Search library..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={s.addBtn} onClick={() => setShowAddModal(true)}>+ Add Item</button>
      </div>

      <div style={s.filterRow}>
        <span style={{ fontSize: 11, color: '#555', marginRight: 4 }}>Type:</span>
        {[null, ...TYPES].map(t => (
          <button key={String(t)} style={s.pill(typeFilter === t)} onClick={() => setTypeFilter(t)}>
            {t === null ? 'All' : t}
          </button>
        ))}
      </div>

      <div style={{ ...s.filterRow, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: '#555', marginRight: 4 }}>Venture:</span>
        {[null, 'all', ...VENTURES].map(v => (
          <button key={String(v)} style={s.pill(ventureFilter === v)} onClick={() => setVentureFilter(v === ventureFilter ? null : v)}>
            {v === null ? 'Any' : v}
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <div style={s.emptyState}>No library items found.</div>
      )}

      {items.map(item => (
        <LibraryItem key={item.id} item={item} data={data} setData={setData} />
      ))}

      {showAddModal && (
        <ItemModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
    </div>
  )
}
