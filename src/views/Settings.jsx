import React, { useState } from 'react'

const s = {
  wrap: { padding: 20, maxWidth: 640 },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#e5e5e5', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #1a1a1a' },
  row: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  label: { fontSize: 12, color: '#888', width: 160, flexShrink: 0 },
  input: { flex: 1, background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, color: '#e5e5e5', fontFamily: 'inherit', fontSize: 12, padding: '7px 10px', outline: 'none' },
  select: { flex: 1, background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, color: '#e5e5e5', fontFamily: 'inherit', fontSize: 12, padding: '7px 10px' },
  toggle: (on) => ({
    width: 36, height: 20, borderRadius: 10, background: on ? '#f97316' : '#1a1a1a',
    position: 'relative', cursor: 'pointer', border: 'none', padding: 0, transition: 'background 0.2s', flexShrink: 0
  }),
  toggleKnob: (on) => ({
    position: 'absolute', top: 3, left: on ? 19 : 3, width: 14, height: 14,
    borderRadius: '50%', background: '#e5e5e5', transition: 'left 0.2s'
  }),
  btn: { padding: '7px 14px', background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' },
  btnOrange: { padding: '7px 14px', background: '#f97316', color: '#080808', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 },
  btnDanger: { padding: '7px 14px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' },
  status: (ok) => ({ fontSize: 11, color: ok ? '#22c55e' : '#ef4444', padding: '4px 8px', background: '#0d0d0d', borderRadius: 3, border: '1px solid #1a1a1a' }),
  desc: { fontSize: 11, color: '#444', marginBottom: 16, lineHeight: 1.5 },
  keyRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#888' },
  keyDot: (present) => ({ width: 6, height: 6, borderRadius: '50%', background: present ? '#22c55e' : '#ef4444', flexShrink: 0 }),
}

function Toggle({ value, onChange }) {
  return (
    <button style={s.toggle(value)} onClick={() => onChange(!value)}>
      <div style={s.toggleKnob(value)} />
    </button>
  )
}

export default function Settings({ data, setData }) {
  const settings = data.settings || {}
  const [ollamaStatus, setOllamaStatus] = useState(null)
  const [ollamaLoading, setOllamaLoading] = useState(false)
  const [briefingStatus, setBriefingStatus] = useState(null)

  const set = (key, value) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }))
  }

  const testOllama = async () => {
    setOllamaLoading(true)
    setOllamaStatus(null)
    try {
      const res = await fetch('/api/ollama/test')
      const json = await res.json()
      setOllamaStatus(json.ok ? 'Connected' : `Failed: ${json.error}`)
    } catch (e) {
      setOllamaStatus(`Error: ${e.message}`)
    }
    setOllamaLoading(false)
  }

  const sendBriefing = async () => {
    setBriefingStatus(null)
    try {
      const res = await fetch('/api/briefing/send-now', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings }) })
      const json = await res.json()
      setBriefingStatus(json.message || 'Sent')
    } catch (e) {
      setBriefingStatus(`Error: ${e.message}`)
    }
  }

  const exportData = () => {
    window.open('/api/export/all', '_blank')
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      try {
        const text = await file.text()
        const parsed = JSON.parse(text)
        setData(parsed)
      } catch (err) {
        alert('Invalid JSON file: ' + err.message)
      }
    }
    input.click()
  }

  const resetAll = () => {
    if (!window.confirm('Reset ALL data? This cannot be undone.')) return
    setData({
      version: 2, tasks: {}, library: {}, notes: {},
      completedSteps: [], doneTasks: [], activeTimers: {},
      settings: data.settings
    })
  }

  const API_KEYS = [
    { key: 'ANTHROPIC_API_KEY', label: 'Anthropic API Key' },
    { key: 'SENDGRID_API_KEY', label: 'SendGrid API Key' },
    { key: 'GOOGLE_CLIENT_ID', label: 'Google Client ID' },
    { key: 'WORDPRESS_URL', label: 'WordPress URL' },
    { key: 'ZAPIER_WEBHOOK_URL', label: 'Zapier Webhook URL' },
  ]

  return (
    <div style={s.wrap}>
      {/* Ollama */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Ollama (Local AI)</div>
        <div style={s.row}>
          <span style={s.label}>Enabled</span>
          <Toggle value={!!settings.ollamaEnabled} onChange={v => set('ollamaEnabled', v)} />
        </div>
        <div style={s.row}>
          <span style={s.label}>Endpoint</span>
          <input style={s.input} value={settings.ollamaEndpoint || 'http://localhost:11434'}
            onChange={e => set('ollamaEndpoint', e.target.value)} />
        </div>
        <div style={s.row}>
          <span style={s.label}>Model</span>
          <input style={s.input} value={settings.ollamaModel || 'llama3'}
            onChange={e => set('ollamaModel', e.target.value)} />
        </div>
        <div style={s.row}>
          <span style={s.label}></span>
          <button style={s.btn} onClick={testOllama} disabled={ollamaLoading}>
            {ollamaLoading ? 'Testing...' : 'Test Connection'}
          </button>
          {ollamaStatus && <span style={s.status(ollamaStatus === 'Connected')}>{ollamaStatus}</span>}
        </div>
      </div>

      {/* Action Runner */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Action Runner</div>
        <div style={s.row}>
          <span style={s.label}>Default Model</span>
          <select style={s.select} value={settings.actionModel || 'claude-sonnet-4-6'}
            onChange={e => set('actionModel', e.target.value)}>
            <option value="claude-opus-4-6">Claude Opus 4.6</option>
            <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
            <option value="ollama">Ollama (local)</option>
          </select>
        </div>
        <div style={s.desc}>
          API Keys (set in .env file on server):
        </div>
        {API_KEYS.map(({ key, label }) => (
          <div key={key} style={s.keyRow}>
            <div style={s.keyDot(false)} title="Status unknown — check server logs" />
            <span>{label}</span>
            <span style={{ color: '#333', fontSize: 10 }}>Set in .env</span>
          </div>
        ))}
      </div>

      {/* Daily Briefing */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Daily Briefing</div>
        <div style={s.row}>
          <span style={s.label}>Enabled</span>
          <Toggle value={!!settings.sendgridEnabled} onChange={v => set('sendgridEnabled', v)} />
        </div>
        <div style={s.row}>
          <span style={s.label}>Email</span>
          <input style={s.input} type="email" value={settings.briefingEmail || ''}
            onChange={e => set('briefingEmail', e.target.value)} placeholder="you@example.com" />
        </div>
        <div style={s.row}>
          <span style={s.label}>Send Time</span>
          <input style={s.input} type="time" value={settings.briefingTime || '07:00'}
            onChange={e => set('briefingTime', e.target.value)} />
        </div>
        <div style={s.row}>
          <span style={s.label}></span>
          <button style={s.btn} onClick={sendBriefing}>Send Test Now</button>
          {briefingStatus && <span style={{ fontSize: 11, color: '#888' }}>{briefingStatus}</span>}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Danger Zone</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={s.btnOrange} onClick={exportData}>Export All Data</button>
          <button style={s.btn} onClick={importData}>Import Data</button>
          <button style={s.btnDanger} onClick={resetAll}>Reset All Data</button>
        </div>
      </div>
    </div>
  )
}
