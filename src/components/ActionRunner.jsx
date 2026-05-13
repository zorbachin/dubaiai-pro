import React, { useState } from 'react'

const s = {
  wrap: { padding: 20 },
  label: { fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' },
  textarea: { width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, color: '#e5e5e5', fontFamily: 'inherit', fontSize: 12, padding: '10px 12px', outline: 'none', resize: 'vertical', minHeight: 100, marginBottom: 12 },
  select: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, color: '#e5e5e5', fontFamily: 'inherit', fontSize: 12, padding: '7px 10px', marginBottom: 12, marginRight: 8 },
  btnRow: { display: 'flex', gap: 8, marginBottom: 16 },
  btn: { padding: '7px 14px', background: '#f97316', color: '#080808', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 },
  btnSecondary: { padding: '7px 14px', background: 'transparent', color: '#555', border: '1px solid #333', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' },
  output: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, padding: '12px', fontSize: 12, color: '#ccc', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 100 },
  status: { fontSize: 11, color: '#555', marginBottom: 8 },
}

export default function ActionRunner({ data, setData, prompt: initialPrompt, onClose }) {
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [model, setModel] = useState((data?.settings?.actionModel) || 'claude-sonnet-4-6')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const settings = data?.settings || {}

  const run = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setOutput('')
    setError('')
    try {
      const useOllama = model === 'ollama' || (model !== 'claude-opus-4-6' && model !== 'claude-sonnet-4-6' && settings.ollamaEnabled)
      if (useOllama) {
        const res = await fetch('/api/ollama/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: settings.ollamaModel || 'llama3', messages: [{ role: 'user', content: prompt }], stream: false })
        })
        const json = await res.json()
        setOutput(json.message?.content || json.error || 'No output')
      } else {
        const res = await fetch('/api/anthropic/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, max_tokens: 2048, messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }] })
        })
        const json = await res.json()
        if (json.error) setError(typeof json.error === 'string' ? json.error : json.error.message || 'Error')
        else setOutput(json.content?.[0]?.text || 'No output')
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const looksLikeEmail = output && (output.includes('Subject:') || output.includes('Dear ') || output.includes('Hi ') || output.includes('Hello '))

  const inner = (
    <div style={s.wrap}>
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#e5e5e5' }}>Action Runner</span>
          <button style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18 }} onClick={onClose}>x</button>
        </div>
      )}
      <label style={s.label}>Prompt</label>
      <textarea style={s.textarea} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter your prompt..." />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <label style={{ ...s.label, marginBottom: 0, marginRight: 8 }}>Model:</label>
        <select style={s.select} value={model} onChange={e => setModel(e.target.value)}>
          <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
          <option value="claude-opus-4-6">Claude Opus 4.6</option>
          <option value="ollama">Ollama (local)</option>
        </select>
      </div>

      <div style={s.btnRow}>
        <button style={s.btn} onClick={run} disabled={loading || !prompt.trim()}>
          {loading ? 'Running...' : 'Run'}
        </button>
        {output && <button style={s.btnSecondary} onClick={() => navigator.clipboard.writeText(output)}>Copy Output</button>}
        {output && looksLikeEmail && (
          <button style={s.btnSecondary} onClick={() => alert('Configure SendGrid in Settings to send emails.')}>
            Send as Email
          </button>
        )}
      </div>

      {error && <div style={{ ...s.status, color: '#ef4444', marginBottom: 8 }}>Error: {error}</div>}
      {(output || loading) && (
        <>
          <label style={s.label}>Output</label>
          <div style={s.output}>
            {loading ? <span style={{ color: '#555' }}>Generating...</span> : output}
          </div>
        </>
      )}
    </div>
  )

  if (onClose) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ background: '#111111', border: '1px solid #1a1a1a', borderRadius: 4, width: 600, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }}>
          {inner}
        </div>
      </div>
    )
  }

  return inner
}
