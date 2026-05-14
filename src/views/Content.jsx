import React, { useState, useMemo } from 'react'

const VENTURES = [
  { key: 'hermes', label: 'Hermes' },
  { key: 'buildyourbot', label: 'Build Your Bot' },
  { key: 'selfsellingai', label: 'Self Selling AI' },
  { key: 'zorbot', label: 'Zorbot' },
  { key: 'minimovies', label: 'Mini Movies' },
  { key: 'theriver', label: 'The River' },
  { key: 'moraledge', label: 'Moraledge' },
  { key: 'thegetboaz', label: 'The Get Boaz' },
  { key: 'dubaiai', label: 'Dubai AI' },
  { key: 'suman', label: 'Suman' },
  { key: 'podsupps', label: 'Pod Supps' },
  { key: 'series', label: 'Series' },
]

const PLATFORMS = ['Instagram', 'X', 'LinkedIn', 'YouTube', 'TikTok', 'Threads']
const CONTENT_TYPES = ['post', 'video', 'story', 'thread', 'newsletter']
const STATUS_OPTIONS = ['idea', 'drafting', 'ready', 'scheduled', 'published']

const STATUS_COLORS = {
  idea: '#333',
  drafting: '#eab308',
  ready: '#f97316',
  scheduled: '#a78bfa',
  published: '#22c55e',
}

const PLATFORM_ICONS = {
  Instagram: '◈', X: '✕', LinkedIn: '◉', YouTube: '▶', TikTok: '◆', Threads: '◎'
}

const HIGGSFIELD_STYLES = [
  'cinematic', 'anime', 'photorealistic', '3d-render', 'watercolor', 'sketch'
]
const HIGGSFIELD_RATIOS = ['16:9', '9:16', '1:1', '4:3', '21:9']
const HIGGSFIELD_DURATION = [2, 4, 6, 8]

const s = {
  wrap: { display: 'flex', flexDirection: 'column', height: '100%' },
  tabBar: {
    display: 'flex', borderBottom: '1px solid #1a1a1a', background: '#0a0a0a', flexShrink: 0
  },
  tab: (active) => ({
    padding: '12px 20px', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer', background: 'transparent', border: 'none',
    borderBottom: active ? '2px solid #f97316' : '2px solid transparent',
    color: active ? '#f97316' : '#555',
    letterSpacing: '0.06em', textTransform: 'uppercase'
  }),
  body: { flex: 1, overflow: 'auto', padding: '20px' },
  row2: { display: 'flex', gap: 16 },
  col: { flex: 1, minWidth: 0 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 15, color: '#e5e5e5',
    marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #1a1a1a'
  },
  label: { display: 'block', fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 },
  input: {
    width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    padding: '8px 10px', outline: 'none'
  },
  textarea: {
    width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    padding: '8px 10px', outline: 'none', resize: 'vertical', minHeight: 80
  },
  select: {
    width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3,
    color: '#e5e5e5', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    padding: '8px 10px', outline: 'none', cursor: 'pointer'
  },
  pill: (active) => ({
    padding: '3px 10px', borderRadius: 3, border: `1px solid ${active ? '#f97316' : '#1a1a1a'}`,
    background: active ? '#f97316' : 'transparent', color: active ? '#080808' : '#555',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, cursor: 'pointer'
  }),
  pillRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  btn: {
    padding: '7px 16px', background: '#f97316', color: '#080808', border: 'none',
    borderRadius: 3, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
    fontWeight: 600, cursor: 'pointer'
  },
  btnSecondary: {
    padding: '7px 16px', background: 'transparent', color: '#555',
    border: '1px solid #333', borderRadius: 3, fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11, cursor: 'pointer'
  },
  outputBox: {
    background: '#080808', border: '1px solid #1a1a1a', borderRadius: 3,
    padding: '12px', fontSize: 12, color: '#ccc', lineHeight: 1.8,
    whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 80
  },
  formGroup: { marginBottom: 12 },
  card: {
    background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3,
    padding: '12px 14px', marginBottom: 8
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  statusBadge: (status) => ({
    padding: '1px 6px', borderRadius: 2, fontSize: 9, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: STATUS_COLORS[status] || '#555',
    border: `1px solid ${STATUS_COLORS[status] || '#333'}`, flexShrink: 0
  }),
  platformBadge: {
    padding: '1px 6px', borderRadius: 2, fontSize: 9, color: '#555',
    border: '1px solid #1a1a1a', flexShrink: 0
  },
  cardTitle: { fontSize: 13, color: '#d5d5d5', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardMeta: { fontSize: 11, color: '#444' },
  actionRow: { display: 'flex', gap: 6, marginTop: 10 },
  btnTiny: (accent) => ({
    padding: '3px 8px', background: accent ? '#f97316' : 'transparent',
    color: accent ? '#080808' : '#555', border: accent ? 'none' : '1px solid #1a1a1a',
    borderRadius: 3, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer',
    fontWeight: accent ? 600 : 400
  }),
  gridVideo: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10
  },
  videoCard: {
    background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, padding: '14px'
  },
  videoThumb: {
    width: '100%', aspectRatio: '16/9', background: '#080808', borderRadius: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, color: '#1a1a1a', marginBottom: 10
  },
  calGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginTop: 12
  },
  calDay: (hasContent) => ({
    minHeight: 70, background: hasContent ? '#0f0f0f' : '#080808',
    border: `1px solid ${hasContent ? '#1a1a1a' : '#111'}`,
    borderRadius: 2, padding: 6
  }),
  calDayNum: (isToday) => ({
    fontSize: 10, color: isToday ? '#f97316' : '#333',
    fontWeight: isToday ? 700 : 400, marginBottom: 4
  }),
  calItem: (status) => ({
    fontSize: 9, color: STATUS_COLORS[status] || '#555', padding: '1px 4px',
    background: '#0a0a0a', borderRadius: 2, marginBottom: 2,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
  }),
  calDow: { fontSize: 9, color: '#2a2a2a', textAlign: 'center', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.1em' },
  emptyState: { padding: 40, textAlign: 'center', color: '#333', fontSize: 12 },
  statusRow: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 },
}

// ── Social Tab ────────────────────────────────────────────────────────────────

function SocialTab({ data, setData }) {
  const [venture, setVenture] = useState('hermes')
  const [platform, setPlatform] = useState('Instagram')
  const [contentType, setContentType] = useState('post')
  const [brief, setBrief] = useState('')
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState('')
  const [filterStatus, setFilterStatus] = useState(null)
  const [filterVenture, setFilterVenture] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const content = data.content || {}
  const items = Object.values(content)
    .filter(i => i.kind === 'social')
    .filter(i => !filterStatus || i.status === filterStatus)
    .filter(i => !filterVenture || i.venture === filterVenture)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const generate = async () => {
    if (!brief.trim()) return
    setGenerating(true)
    setOutput('')
    try {
      const sysPrompt = `You are a social media expert. Write ${contentType} copy for ${platform}. Venture: ${VENTURES.find(v => v.key === venture)?.label || venture}. Be concise, engaging, on-brand. Include relevant hashtags at the end.`
      const res = await fetch('/api/anthropic/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: data.settings?.actionModel || 'claude-sonnet-4-6',
          max_tokens: 1024, stream: true,
          system: sysPrompt,
          messages: [{ role: 'user', content: [{ type: 'text', text: brief }] }]
        })
      })
      if (!res.ok) { setOutput('Error: check ANTHROPIC_API_KEY'); setGenerating(false); return }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = '', acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const d = line.slice(6).trim()
          if (d === '[DONE]') continue
          try {
            const evt = JSON.parse(d)
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              acc += evt.delta.text; setOutput(acc)
            }
          } catch {}
        }
      }
    } catch (e) { setOutput(`Error: ${e.message}`) }
    setGenerating(false)
  }

  const saveToCalendar = () => {
    if (!output.trim()) return
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    setData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          id, kind: 'social', platform, contentType, venture,
          title: brief.slice(0, 60) || 'Untitled',
          copy: output, status: 'ready',
          scheduledDate: null, createdAt: now, updatedAt: now
        }
      }
    }))
    setOutput('')
    setBrief('')
  }

  const updateStatus = (id, status) => {
    setData(prev => ({
      ...prev,
      content: { ...prev.content, [id]: { ...prev.content[id], status, updatedAt: new Date().toISOString() } }
    }))
  }

  const deleteItem = (id) => {
    setData(prev => {
      const c = { ...prev.content }; delete c[id]
      return { ...prev, content: c }
    })
  }

  return (
    <div>
      <div style={s.row2}>
        {/* Generator */}
        <div style={{ ...s.col, maxWidth: 480 }}>
          <div style={s.section}>
            <div style={s.sectionTitle}>Generate Copy</div>
            <div style={s.formGroup}>
              <label style={s.label}>Venture</label>
              <select style={s.select} value={venture} onChange={e => setVenture(e.target.value)}>
                {VENTURES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Platform</label>
                <div style={s.pillRow}>
                  {PLATFORMS.map(p => (
                    <button key={p} style={s.pill(platform === p)} onClick={() => setPlatform(p)}>
                      {PLATFORM_ICONS[p]} {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Content Type</label>
              <div style={s.pillRow}>
                {CONTENT_TYPES.map(t => (
                  <button key={t} style={s.pill(contentType === t)} onClick={() => setContentType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Brief / Topic</label>
              <textarea style={s.textarea} value={brief} onChange={e => setBrief(e.target.value)}
                placeholder={`What's this ${contentType} about?`} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={s.btn} onClick={generate} disabled={generating || !brief.trim()}>
                {generating ? 'Writing...' : 'Generate'}
              </button>
              {output && (
                <>
                  <button style={s.btnSecondary} onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
                  <button style={s.btnSecondary} onClick={saveToCalendar}>Save to Calendar</button>
                </>
              )}
            </div>
            {output && (
              <div style={{ ...s.outputBox, marginTop: 12 }}>{output}</div>
            )}
          </div>
        </div>

        {/* Content list */}
        <div style={s.col}>
          <div style={s.section}>
            <div style={s.sectionTitle}>Content Pipeline</div>
            <div style={s.statusRow}>
              {[null, ...STATUS_OPTIONS].map(st => (
                <button key={String(st)} style={s.pill(filterStatus === st)} onClick={() => setFilterStatus(st)}>
                  {st === null ? 'All' : st}
                </button>
              ))}
            </div>
            {items.length === 0 && <div style={s.emptyState}>No content yet. Generate some copy.</div>}
            {items.map(item => (
              <div key={item.id} style={s.card}>
                <div style={s.cardHeader}>
                  <span style={{ fontSize: 12 }}>{PLATFORM_ICONS[item.platform]}</span>
                  <span style={s.cardTitle}>{item.title}</span>
                  <span style={s.statusBadge(item.status)}>{item.status}</span>
                  <span style={s.platformBadge}>{item.contentType}</span>
                </div>
                <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5, maxHeight: 60, overflow: 'hidden' }}>
                  {item.copy}
                </div>
                <div style={s.actionRow}>
                  {STATUS_OPTIONS.map(st => st !== item.status && (
                    <button key={st} style={s.btnTiny(st === 'published')} onClick={() => updateStatus(item.id, st)}>
                      → {st}
                    </button>
                  ))}
                  <button style={s.btnTiny(false)} onClick={() => navigator.clipboard.writeText(item.copy)}>Copy</button>
                  <button style={{ ...s.btnTiny(false), color: '#884444', borderColor: '#2a1010' }} onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Higgsfield Tab ────────────────────────────────────────────────────────────

function HiggsfieldTab({ data, setData }) {
  const [form, setForm] = useState({
    prompt: '', negativePrompt: '', style: 'cinematic', ratio: '16:9',
    duration: 4, venture: 'hermes', seed: ''
  })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const hasKey = true // will check via env-status

  const generate = async () => {
    if (!form.prompt.trim()) return
    setGenerating(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/higgsfield/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (json.error) { setError(json.error); setGenerating(false); return }
      setResult(json)
      // Save to content library
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      setData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [id]: {
            id, kind: 'video', source: 'higgsfield',
            prompt: form.prompt, style: form.style, ratio: form.ratio,
            duration: form.duration, venture: form.venture,
            jobId: json.jobId, status: json.status || 'processing',
            videoUrl: json.videoUrl || null, thumbnailUrl: json.thumbnailUrl || null,
            createdAt: now, updatedAt: now
          }
        }
      }))
    } catch (e) { setError(e.message) }
    setGenerating(false)
  }

  const videos = Object.values(data.content || {}).filter(i => i.kind === 'video' && i.source === 'higgsfield')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const enhancePrompt = async () => {
    if (!form.prompt.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/anthropic/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: data.settings?.actionModel || 'claude-sonnet-4-6',
          max_tokens: 512, stream: false,
          messages: [{ role: 'user', content: [{ type: 'text', text: `Enhance this video generation prompt to be more cinematic and detailed. Return only the improved prompt, nothing else:\n\n${form.prompt}` }] }]
        })
      })
      const json = await res.json()
      if (json.content?.[0]?.text) set('prompt', json.content[0].text.trim())
    } catch (e) {}
    setGenerating(false)
  }

  return (
    <div style={s.row2}>
      <div style={{ ...s.col, maxWidth: 440 }}>
        <div style={s.section}>
          <div style={s.sectionTitle}>Higgsfield Video</div>
          <div style={{ fontSize: 11, color: '#444', marginBottom: 16, lineHeight: 1.6 }}>
            AI video generation. Set <code style={{ color: '#f97316' }}>HIGGSFIELD_API_KEY</code> in .env to enable generation. Use "Enhance Prompt" to improve your prompt with Claude first.
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Venture</label>
            <select style={s.select} value={form.venture} onChange={e => set('venture', e.target.value)}>
              {VENTURES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
            </select>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Prompt</label>
            <textarea style={{ ...s.textarea, minHeight: 100 }} value={form.prompt}
              onChange={e => set('prompt', e.target.value)}
              placeholder="Describe your video scene in detail..." />
            <button style={{ ...s.btnSecondary, marginTop: 6, fontSize: 10 }}
              onClick={enhancePrompt} disabled={generating || !form.prompt.trim()}>
              ✦ Enhance with Claude
            </button>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Negative Prompt</label>
            <input style={s.input} value={form.negativePrompt}
              onChange={e => set('negativePrompt', e.target.value)}
              placeholder="blurry, low quality, text..." />
          </div>

          <div style={{ ...s.row2, gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Style</label>
              <select style={s.select} value={form.style} onChange={e => set('style', e.target.value)}>
                {HIGGSFIELD_STYLES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Aspect Ratio</label>
              <select style={s.select} value={form.ratio} onChange={e => set('ratio', e.target.value)}>
                {HIGGSFIELD_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...s.formGroup, marginTop: 10 }}>
            <label style={s.label}>Duration (seconds)</label>
            <div style={s.pillRow}>
              {HIGGSFIELD_DURATION.map(d => (
                <button key={d} style={s.pill(form.duration === d)} onClick={() => set('duration', d)}>{d}s</button>
              ))}
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Seed (optional)</label>
            <input style={s.input} value={form.seed} onChange={e => set('seed', e.target.value)} placeholder="leave blank for random" />
          </div>

          <button style={s.btn} onClick={generate} disabled={generating || !form.prompt.trim()}>
            {generating ? 'Submitting...' : 'Generate Video'}
          </button>

          {error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>{error}</div>}
          {result && (
            <div style={{ marginTop: 12, padding: 12, background: '#080808', borderRadius: 3, border: '1px solid #1a1a1a', fontSize: 11 }}>
              {result.jobId && <div style={{ color: '#888', marginBottom: 4 }}>Job ID: <span style={{ color: '#f97316' }}>{result.jobId}</span></div>}
              {result.status && <div style={{ color: result.status === 'completed' ? '#22c55e' : '#eab308' }}>Status: {result.status}</div>}
              {result.videoUrl && (
                <a href={result.videoUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#22c55e', fontSize: 11, display: 'block', marginTop: 6 }}>
                  View / Download Video →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video library */}
      <div style={s.col}>
        <div style={s.section}>
          <div style={s.sectionTitle}>Video Library</div>
          {videos.length === 0 && <div style={s.emptyState}>No Higgsfield videos yet.</div>}
          <div style={s.gridVideo}>
            {videos.map(v => (
              <div key={v.id} style={s.videoCard}>
                <div style={s.videoThumb}>
                  {v.videoUrl
                    ? <video src={v.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} controls muted />
                    : '▶'
                  }
                </div>
                <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5, marginBottom: 6 }}>
                  {v.prompt.slice(0, 80)}{v.prompt.length > 80 ? '...' : ''}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 9, color: '#555', padding: '1px 5px', border: '1px solid #1a1a1a', borderRadius: 2 }}>{v.style}</span>
                  <span style={{ fontSize: 9, color: '#555', padding: '1px 5px', border: '1px solid #1a1a1a', borderRadius: 2 }}>{v.ratio}</span>
                  <span style={{ fontSize: 9, color: '#555', padding: '1px 5px', border: '1px solid #1a1a1a', borderRadius: 2 }}>{v.duration}s</span>
                  <span style={{ fontSize: 9, color: v.status === 'completed' ? '#22c55e' : '#eab308', padding: '1px 5px', border: '1px solid #1a1a1a', borderRadius: 2 }}>{v.status}</span>
                </div>
                {v.videoUrl && (
                  <a href={v.videoUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', marginTop: 8, fontSize: 10, color: '#f97316' }}>
                    Open →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Local Models Tab ──────────────────────────────────────────────────────────

const LOCAL_ENDPOINTS = [
  { label: 'ComfyUI', default: 'http://localhost:8188' },
  { label: 'Automatic1111', default: 'http://localhost:7860' },
  { label: 'InvokeAI', default: 'http://localhost:9090' },
  { label: 'Custom', default: '' },
]

function LocalModelsTab({ data, setData }) {
  const [endpoint, setEndpoint] = useState(data.settings?.localModelEndpoint || 'http://localhost:8188')
  const [endpointType, setEndpointType] = useState('ComfyUI')
  const [prompt, setPrompt] = useState('')
  const [negPrompt, setNegPrompt] = useState('')
  const [steps, setSteps] = useState(20)
  const [cfgScale, setCfgScale] = useState(7)
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [seed, setSeed] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)

  const testConnection = async () => {
    setStatus('testing')
    try {
      const res = await fetch('/api/local-model/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, type: endpointType })
      })
      const json = await res.json()
      setStatus(json.ok ? 'connected' : `error: ${json.error}`)
    } catch (e) { setStatus(`error: ${e.message}`) }
  }

  const generate = async () => {
    if (!prompt.trim()) return
    setGenerating(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/local-model/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, type: endpointType, prompt, negPrompt, steps, cfgScale, width, height, seed: seed || -1 })
      })
      const json = await res.json()
      if (json.error) { setError(json.error); setGenerating(false); return }
      setResult(json)
    } catch (e) { setError(e.message) }
    setGenerating(false)
  }

  const localImages = Object.values(data.content || {}).filter(i => i.kind === 'image' && i.source === 'local')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const saveResult = () => {
    if (!result?.imageUrl && !result?.imageData) return
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    setData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          id, kind: 'image', source: 'local', endpoint, endpointType,
          prompt, negPrompt, steps, cfgScale, width, height,
          imageUrl: result.imageUrl || null,
          imageData: result.imageData || null,
          createdAt: now, updatedAt: now
        }
      }
    }))
  }

  return (
    <div style={s.row2}>
      <div style={{ ...s.col, maxWidth: 440 }}>
        <div style={s.section}>
          <div style={s.sectionTitle}>Local Model (Image/Video)</div>
          <div style={{ fontSize: 11, color: '#444', marginBottom: 16, lineHeight: 1.6 }}>
            Connect to a locally running image or video generation tool. Make sure the tool is running first.
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Tool</label>
            <div style={s.pillRow}>
              {LOCAL_ENDPOINTS.map(e => (
                <button key={e.label} style={s.pill(endpointType === e.label)}
                  onClick={() => { setEndpointType(e.label); if (e.default) setEndpoint(e.default) }}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Endpoint URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...s.input, flex: 1 }} value={endpoint} onChange={e => setEndpoint(e.target.value)} />
              <button style={s.btnSecondary} onClick={testConnection}>Test</button>
            </div>
            {status && (
              <div style={{ fontSize: 10, marginTop: 4, color: status === 'connected' ? '#22c55e' : status === 'testing' ? '#eab308' : '#ef4444' }}>
                {status}
              </div>
            )}
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Prompt</label>
            <textarea style={{ ...s.textarea, minHeight: 80 }} value={prompt}
              onChange={e => setPrompt(e.target.value)} placeholder="Describe the image or video..." />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Negative Prompt</label>
            <input style={s.input} value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
              placeholder="blurry, low quality..." />
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Steps</label>
              <input style={s.input} type="number" value={steps} onChange={e => setSteps(Number(e.target.value))} min={1} max={150} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>CFG Scale</label>
              <input style={s.input} type="number" value={cfgScale} onChange={e => setCfgScale(Number(e.target.value))} min={1} max={30} step={0.5} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Width</label>
              <select style={s.select} value={width} onChange={e => setWidth(Number(e.target.value))}>
                {[256, 512, 768, 1024, 1280, 1536].map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Height</label>
              <select style={s.select} value={height} onChange={e => setHeight(Number(e.target.value))}>
                {[256, 512, 768, 1024, 1280, 1536].map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Seed (optional)</label>
            <input style={s.input} value={seed} onChange={e => setSeed(e.target.value)} placeholder="-1 for random" />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button style={s.btn} onClick={generate} disabled={generating || !prompt.trim()}>
              {generating ? 'Generating...' : 'Generate'}
            </button>
            {result && <button style={s.btnSecondary} onClick={saveResult}>Save to Library</button>}
          </div>

          {error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>{error}</div>}

          {result && (result.imageUrl || result.imageData) && (
            <div style={{ marginTop: 14 }}>
              <img
                src={result.imageData ? `data:image/png;base64,${result.imageData}` : result.imageUrl}
                alt="Generated"
                style={{ width: '100%', borderRadius: 3, border: '1px solid #1a1a1a' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Image library */}
      <div style={s.col}>
        <div style={s.section}>
          <div style={s.sectionTitle}>Generated Images</div>
          {localImages.length === 0 && <div style={s.emptyState}>No generated images yet.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {localImages.map(img => (
              <div key={img.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
                <img
                  src={img.imageData ? `data:image/png;base64,${img.imageData}` : img.imageUrl}
                  alt={img.prompt}
                  style={{ width: '100%', display: 'block' }}
                />
                <div style={{ padding: '6px 8px', fontSize: 9, color: '#555', lineHeight: 1.4 }}>
                  {img.prompt.slice(0, 60)}{img.prompt.length > 60 ? '...' : ''}
                  <div style={{ color: '#333', marginTop: 2 }}>{img.endpointType} · {img.width}×{img.height}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Content Calendar Tab ──────────────────────────────────────────────────────

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function CalendarTab({ data, setData }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const [filterVenture, setFilterVenture] = useState(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const contentItems = Object.values(data.content || {}).filter(i => i.kind === 'social')

  const itemsByDate = useMemo(() => {
    const map = {}
    contentItems.forEach(item => {
      if (!item.scheduledDate) return
      const d = item.scheduledDate.slice(0, 10)
      if (!map[d]) map[d] = []
      map[d].push(item)
    })
    return map
  }, [contentItems])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const setItemDate = (itemId, date) => {
    setData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [itemId]: { ...prev.content[itemId], scheduledDate: date, updatedAt: new Date().toISOString() }
      }
    }))
  }

  const unscheduled = contentItems.filter(i => !i.scheduledDate)
    .filter(i => !filterVenture || i.venture === filterVenture)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

  return (
    <div>
      <div style={s.row2}>
        {/* Calendar grid */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button style={s.btnSecondary} onClick={prevMonth}>←</button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#e5e5e5', flex: 1, textAlign: 'center' }}>
              {MONTHS[month]} {year}
            </span>
            <button style={s.btnSecondary} onClick={nextMonth}>→</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DOW.map(d => <div key={d} style={s.calDow}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayItems = (itemsByDate[dateStr] || []).filter(i => !filterVenture || i.venture === filterVenture)
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
              return (
                <div key={day} style={s.calDay(dayItems.length > 0)}>
                  <div style={s.calDayNum(isToday)}>{day}</div>
                  {dayItems.map(item => (
                    <div key={item.id} style={s.calItem(item.status)} title={item.title}>
                      {PLATFORM_ICONS[item.platform]} {item.title}
                    </div>
                  ))}
                  {selected && (
                    <button
                      style={{ fontSize: 8, color: '#333', background: 'none', border: '1px dashed #222', borderRadius: 2, width: '100%', cursor: 'pointer', padding: '1px 0', marginTop: 2 }}
                      onClick={() => { setItemDate(selected, dateStr); setSelected(null) }}
                    >
                      + schedule here
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Unscheduled queue */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Unscheduled ({unscheduled.length})
          </div>
          <div style={{ marginBottom: 10 }}>
            <select style={{ ...s.select, fontSize: 10, padding: '4px 8px' }} value={filterVenture || ''} onChange={e => setFilterVenture(e.target.value || null)}>
              <option value="">All ventures</option>
              {VENTURES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
            </select>
          </div>
          {unscheduled.length === 0 && (
            <div style={{ fontSize: 11, color: '#333' }}>All content scheduled.</div>
          )}
          {unscheduled.map(item => (
            <div key={item.id}
              style={{ ...s.card, cursor: 'pointer', borderColor: selected === item.id ? '#f97316' : '#1a1a1a', opacity: selected && selected !== item.id ? 0.5 : 1 }}
              onClick={() => setSelected(selected === item.id ? null : item.id)}
            >
              <div style={s.cardHeader}>
                <span style={{ fontSize: 11 }}>{PLATFORM_ICONS[item.platform]}</span>
                <span style={{ fontSize: 11, color: '#d5d5d5', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                <span style={s.statusBadge(item.status)}>{item.status}</span>
              </div>
              {selected === item.id && (
                <div style={{ fontSize: 9, color: '#f97316', marginTop: 4 }}>Click a day to schedule →</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Content View ─────────────────────────────────────────────────────────

const TABS = ['Social', 'Higgsfield', 'Local Models', 'Calendar']

export default function Content({ data, setData }) {
  const [tab, setTab] = useState(0)

  return (
    <div style={s.wrap}>
      <div style={s.tabBar}>
        {TABS.map((t, i) => (
          <button key={t} style={s.tab(tab === i)} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      <div style={s.body}>
        {tab === 0 && <SocialTab data={data} setData={setData} />}
        {tab === 1 && <HiggsfieldTab data={data} setData={setData} />}
        {tab === 2 && <LocalModelsTab data={data} setData={setData} />}
        {tab === 3 && <CalendarTab data={data} setData={setData} />}
      </div>
    </div>
  )
}
