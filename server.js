import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { watch } from 'chokidar'
import { readFile, writeFile, rename, copyFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import https from 'https'
import { URL } from 'url'
import cron from 'node-cron'
import { google } from 'googleapis'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DATA_FILE = join(DATA_DIR, 'data.json')
const TMP_FILE = join(DATA_DIR, 'data.tmp.json')
const TOKENS_FILE = join(DATA_DIR, 'tokens.json')
const PREFIX = '[zorba-os]'

// ── Google OAuth ──────────────────────────────────────────────────────────────

function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
  )
}

async function loadTokens() {
  try {
    if (existsSync(TOKENS_FILE)) {
      const raw = await readFile(TOKENS_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error(`${PREFIX} tokens.json read error:`, e.message)
  }
  return null
}

async function saveTokens(tokens) {
  await ensureDataDir()
  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2), 'utf8')
}

async function getAuthClient() {
  const tokens = await loadTokens()
  if (!tokens) return null
  const client = createOAuth2Client()
  client.setCredentials(tokens)
  // Auto-refresh if expired
  client.on('tokens', async (newTokens) => {
    const merged = { ...tokens, ...newTokens }
    await saveTokens(merged)
    console.log(`${PREFIX} Google tokens auto-refreshed`)
  })
  return client
}

// Log env key presence/absence (never values)
const ENV_KEYS = [
  'ANTHROPIC_API_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
  'WORDPRESS_URL', 'WORDPRESS_APP_PASSWORD', 'ZAPIER_WEBHOOK_URL',
  'SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL', 'OLLAMA_ENDPOINT',
  'OLLAMA_MODEL', 'PORT'
]
console.log(`${PREFIX} Environment check:`)
ENV_KEYS.forEach(key => {
  console.log(`${PREFIX}   ${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`)
})

const app = express()
app.use(express.json({ limit: '10mb' }))

// Ensure data dir exists
async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
  } catch (e) {
    // already exists
  }
}

const DEFAULT_DATA = {
  version: 2,
  tasks: {},
  library: {},
  notes: {},
  completedSteps: [],
  doneTasks: [],
  activeTimers: {},
  settings: {
    ollamaEndpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
    ollamaEnabled: false,
    sendgridEnabled: false,
    briefingEmail: '',
    briefingTime: '07:00',
    theme: 'dark'
  }
}

async function loadData() {
  // Try main file
  if (existsSync(DATA_FILE)) {
    try {
      const raw = await readFile(DATA_FILE, 'utf8')
      return JSON.parse(raw)
    } catch (e) {
      console.error(`${PREFIX} Main data.json parse error:`, e.message)
    }
  }
  // Try backups
  for (let i = 1; i <= 5; i++) {
    const backup = join(DATA_DIR, `data.backup.${i}.json`)
    if (existsSync(backup)) {
      try {
        const raw = await readFile(backup, 'utf8')
        const parsed = JSON.parse(raw)
        console.log(`${PREFIX} Loaded from backup ${i}`)
        return parsed
      } catch (e) {
        console.error(`${PREFIX} Backup ${i} parse error:`, e.message)
      }
    }
  }
  console.log(`${PREFIX} No valid data found, using defaults`)
  return { ...DEFAULT_DATA }
}

async function rotateBackups() {
  // Rotate: backup.5 → delete, backup.4 → backup.5, ..., backup.1 → backup.2, data.json → backup.1
  for (let i = 5; i >= 1; i--) {
    const src = i === 1 ? DATA_FILE : join(DATA_DIR, `data.backup.${i - 1}.json`)
    const dst = join(DATA_DIR, `data.backup.${i}.json`)
    if (existsSync(src)) {
      try {
        await copyFile(src, dst)
      } catch (e) {
        // ignore
      }
    }
  }
}

async function saveData(dataObj) {
  await ensureDataDir()
  await rotateBackups()
  const json = JSON.stringify(dataObj, null, 2)
  await writeFile(TMP_FILE, json, 'utf8')
  await rename(TMP_FILE, DATA_FILE)
}

// GET /api/load
app.get('/api/load', async (req, res) => {
  try {
    const data = await loadData()
    res.json(data)
  } catch (e) {
    console.error(`${PREFIX} /api/load error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// POST /api/save
app.post('/api/save', async (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid body' })
    }
    if (typeof body.version === 'undefined') {
      return res.status(400).json({ error: 'Missing version field' })
    }
    await saveData(body)
    res.json({ ok: true })
  } catch (e) {
    console.error(`${PREFIX} /api/save error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// GET /api/export/:view
app.get('/api/export/:view', async (req, res) => {
  try {
    const { view } = req.params
    const data = await loadData()
    let md = `# Zorba OS Export — ${view}\n\nExported: ${new Date().toISOString()}\n\n`

    if (view === 'tasks' || view === 'all') {
      md += `## Tasks\n\n`
      const tasks = Object.values(data.tasks || {})
      if (tasks.length === 0) {
        md += '_No tasks_\n\n'
      } else {
        for (const t of tasks) {
          md += `### ${t.title}\n`
          md += `- **Venture:** ${t.venture}\n`
          md += `- **Time:** ${t.time} min\n`
          md += `- **Energy:** ${t.energy}\n`
          md += `- **Revenue Impact:** ${t.revenueImpact}\n`
          if (t.context) md += `- **Context:** ${t.context}\n`
          if (t.prompt) md += `\n**Prompt:**\n\`\`\`\n${t.prompt}\n\`\`\`\n`
          if (t.steps && t.steps.length > 0) {
            md += `\n**Steps:**\n`
            t.steps.forEach((s, i) => {
              const done = (data.completedSteps || []).includes(`${t.id}:${i}`)
              md += `- [${done ? 'x' : ' '}] ${s.text}${s.dest ? ` → ${s.dest}` : ''}\n`
            })
          }
          md += '\n'
        }
      }
    }

    if (view === 'library' || view === 'all') {
      md += `## Library\n\n`
      const items = Object.values(data.library || {})
      if (items.length === 0) {
        md += '_No library items_\n\n'
      } else {
        for (const item of items) {
          md += `### ${item.title} [${item.type}]\n`
          md += `- **Venture:** ${item.venture}\n`
          if (item.tags && item.tags.length > 0) md += `- **Tags:** ${item.tags.join(', ')}\n`
          md += `\n${item.content}\n\n`
        }
      }
    }

    if (view === 'notes' || view === 'all') {
      md += `## Notes\n\n`
      const notes = Object.values(data.notes || {})
      if (notes.length === 0) {
        md += '_No notes_\n\n'
      } else {
        for (const note of notes) {
          md += `### ${note.createdAt}${note.venture ? ` [${note.venture}]` : ''}\n`
          md += `${note.text}\n\n`
        }
      }
    }

    res.setHeader('Content-Type', 'text/markdown')
    res.setHeader('Content-Disposition', `attachment; filename="zorba-${view}-${Date.now()}.md"`)
    res.send(md)
  } catch (e) {
    console.error(`${PREFIX} /api/export error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// Helper: proxy HTTP request
function proxyRequest(targetUrl, method, headers, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl)
    const lib = parsed.protocol === 'https:' ? https : http
    const bodyStr = body ? JSON.stringify(body) : undefined
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    }
    if (bodyStr) reqHeaders['Content-Length'] = Buffer.byteLength(bodyStr)

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method,
      headers: reqHeaders
    }

    const req = lib.request(options, (resp) => {
      let data = ''
      resp.on('data', chunk => { data += chunk })
      resp.on('end', () => resolve({ status: resp.statusCode, body: data, headers: resp.headers }))
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

// Helper: stream proxy
function streamProxy(targetUrl, method, headers, body, res) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl)
    const lib = parsed.protocol === 'https:' ? https : http
    const bodyStr = body ? JSON.stringify(body) : undefined
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    }
    if (bodyStr) reqHeaders['Content-Length'] = Buffer.byteLength(bodyStr)

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method,
      headers: reqHeaders
    }

    const req = lib.request(options, (resp) => {
      res.setHeader('Content-Type', resp.headers['content-type'] || 'application/json')
      resp.pipe(res)
      resp.on('end', resolve)
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

// POST /api/ollama/chat
app.post('/api/ollama/chat', async (req, res) => {
  try {
    const endpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434'
    const targetUrl = `${endpoint}/api/chat`
    await streamProxy(targetUrl, 'POST', {}, req.body, res)
  } catch (e) {
    console.error(`${PREFIX} /api/ollama/chat error:`, e.message)
    if (!res.headersSent) res.status(500).json({ error: e.message })
  }
})

// GET /api/ollama/test
app.get('/api/ollama/test', async (req, res) => {
  try {
    const endpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434'
    const result = await proxyRequest(`${endpoint}/api/tags`, 'GET', {}, null)
    if (result.status === 200) {
      res.json({ ok: true, status: result.status })
    } else {
      res.status(result.status).json({ ok: false, error: `Ollama returned ${result.status}` })
    }
  } catch (e) {
    console.error(`${PREFIX} /api/ollama/test error:`, e.message)
    res.status(500).json({ ok: false, error: e.message })
  }
})

// POST /api/anthropic/chat
app.post('/api/anthropic/chat', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(400).json({ error: 'ANTHROPIC_API_KEY not configured' })
    }
    const targetUrl = 'https://api.anthropic.com/v1/messages'
    const headers = {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }
    // Stream if requested
    if (req.body && req.body.stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      await streamProxy(targetUrl, 'POST', headers, req.body, res)
    } else {
      const result = await proxyRequest(targetUrl, 'POST', headers, req.body)
      res.status(result.status).json(JSON.parse(result.body))
    }
  } catch (e) {
    console.error(`${PREFIX} /api/anthropic/chat error:`, e.message)
    if (!res.headersSent) res.status(500).json({ error: e.message })
  }
})

// ── Google OAuth routes ───────────────────────────────────────────────────────

// GET /auth/google — redirect to Google consent screen
app.get('/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).send('Google credentials not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env')
  }
  const client = createOAuth2Client()
  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ]
  })
  res.redirect(url)
})

// GET /auth/google/callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query
    if (error) return res.status(400).send(`Google auth error: ${error}`)
    if (!code) return res.status(400).send('Missing auth code')

    const client = createOAuth2Client()
    const { tokens } = await client.getToken(code)
    await saveTokens(tokens)
    console.log(`${PREFIX} Google OAuth tokens saved`)
    res.send('<script>window.close()</script><p>Connected! You can close this tab.</p>')
  } catch (e) {
    console.error(`${PREFIX} /auth/google/callback error:`, e.message)
    res.status(500).send(`Auth failed: ${e.message}`)
  }
})

// GET /api/google/status
app.get('/api/google/status', async (req, res) => {
  try {
    const tokens = await loadTokens()
    if (!tokens) return res.json({ connected: false })
    // Try to get user info to verify tokens work
    const client = createOAuth2Client()
    client.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: 'v2', auth: client })
    const { data } = await oauth2.userinfo.get()
    res.json({ connected: true, email: data.email })
  } catch (e) {
    res.json({ connected: false, error: e.message })
  }
})

// POST /api/google/revoke
app.post('/api/google/revoke', async (req, res) => {
  try {
    const tokens = await loadTokens()
    if (tokens) {
      const client = createOAuth2Client()
      client.setCredentials(tokens)
      await client.revokeCredentials()
    }
    // Remove tokens file
    const { unlink } = await import('fs/promises')
    if (existsSync(TOKENS_FILE)) await unlink(TOKENS_FILE)
    res.json({ ok: true })
  } catch (e) {
    console.error(`${PREFIX} /api/google/revoke error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── Google Calendar ───────────────────────────────────────────────────────────

// GET /api/calendar/today
app.get('/api/calendar/today', async (req, res) => {
  try {
    const auth = await getAuthClient()
    if (!auth) return res.status(401).json({ error: 'Google not connected' })

    const calendar = google.calendar({ version: 'v3', auth })
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    const { data } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 20,
    })

    const events = (data.items || []).map(e => ({
      id: e.id,
      title: e.summary || '(No title)',
      start: e.start?.dateTime || e.start?.date,
      end: e.end?.dateTime || e.end?.date,
      location: e.location || null,
      allDay: !e.start?.dateTime,
      htmlLink: e.htmlLink,
    }))

    res.json({ events })
  } catch (e) {
    console.error(`${PREFIX} /api/calendar/today error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// POST /api/calendar/create
app.post('/api/calendar/create', async (req, res) => {
  try {
    const auth = await getAuthClient()
    if (!auth) return res.status(401).json({ error: 'Google not connected' })

    const { title, start, end, description, location } = req.body
    if (!title || !start) return res.status(400).json({ error: 'title and start are required' })

    const calendar = google.calendar({ version: 'v3', auth })
    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        description: description || '',
        location: location || '',
        start: { dateTime: start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: end || start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      }
    })

    res.json({ ok: true, event: { id: data.id, htmlLink: data.htmlLink } })
  } catch (e) {
    console.error(`${PREFIX} /api/calendar/create error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── Gmail ─────────────────────────────────────────────────────────────────────

// POST /api/gmail/send
app.post('/api/gmail/send', async (req, res) => {
  try {
    const auth = await getAuthClient()
    if (!auth) return res.status(401).json({ error: 'Google not connected' })

    const { to, subject, body: emailBody } = req.body
    if (!to || !subject || !emailBody) {
      return res.status(400).json({ error: 'to, subject, and body are required' })
    }

    const gmail = google.gmail({ version: 'v1', auth })

    // Build RFC 2822 message
    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      emailBody,
    ]
    const message = messageParts.join('\n')
    const encoded = Buffer.from(message).toString('base64url')

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encoded }
    })

    res.json({ ok: true })
  } catch (e) {
    console.error(`${PREFIX} /api/gmail/send error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── Google Drive ──────────────────────────────────────────────────────────────

// GET /api/drive/list?q=searchTerm
app.get('/api/drive/list', async (req, res) => {
  try {
    const auth = await getAuthClient()
    if (!auth) return res.status(401).json({ error: 'Google not connected' })

    const { q } = req.query
    const drive = google.drive({ version: 'v3', auth })

    const query = q
      ? `name contains '${q.replace(/'/g, "\\'")}' and trashed = false`
      : 'trashed = false'

    const { data } = await drive.files.list({
      q: query,
      pageSize: 20,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink, webContentLink)',
      orderBy: 'modifiedTime desc',
    })

    res.json({ files: data.files || [] })
  } catch (e) {
    console.error(`${PREFIX} /api/drive/list error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// POST /api/drive/upload-note — push a note as .md file to Drive
app.post('/api/drive/upload-note', async (req, res) => {
  try {
    const auth = await getAuthClient()
    if (!auth) return res.status(401).json({ error: 'Google not connected' })

    const { title, content } = req.body
    if (!content) return res.status(400).json({ error: 'content is required' })

    const drive = google.drive({ version: 'v3', auth })
    const fileName = `${title || 'Zorba Note'} — ${new Date().toISOString().split('T')[0]}.md`

    const { data } = await drive.files.create({
      requestBody: { name: fileName, mimeType: 'text/markdown' },
      media: { mimeType: 'text/markdown', body: content },
      fields: 'id, webViewLink',
    })

    res.json({ ok: true, fileId: data.id, webViewLink: data.webViewLink })
  } catch (e) {
    console.error(`${PREFIX} /api/drive/upload-note error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// GET /api/env-status — reports which .env keys are present (never their values)
app.get('/api/env-status', (req, res) => {
  const keys = ['ANTHROPIC_API_KEY', 'SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'ZAPIER_WEBHOOK_URL', 'OLLAMA_ENDPOINT']
  const result = {}
  for (const k of keys) result[k] = !!process.env[k]
  res.json(result)
})

// ── Zapier ────────────────────────────────────────────────────────────────────

// POST /api/zapier/task-done — called when a task is marked complete
app.post('/api/zapier/task-done', async (req, res) => {
  try {
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL
    if (!webhookUrl) return res.status(400).json({ error: 'ZAPIER_WEBHOOK_URL not configured' })

    const { taskId, taskTitle, venture, completedAt } = req.body
    if (!taskId) return res.status(400).json({ error: 'taskId required' })

    const result = await proxyRequest(webhookUrl, 'POST', {}, {
      taskId, taskTitle, venture, completedAt: completedAt || new Date().toISOString()
    })

    console.log(`${PREFIX} Zapier webhook fired for task: ${taskTitle} (status ${result.status})`)
    res.json({ ok: true, status: result.status })
  } catch (e) {
    console.error(`${PREFIX} /api/zapier/task-done error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// POST /api/zapier/test — fire a test payload to the webhook
app.post('/api/zapier/test', async (req, res) => {
  try {
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL
    if (!webhookUrl) return res.status(400).json({ error: 'ZAPIER_WEBHOOK_URL not configured' })

    const result = await proxyRequest(webhookUrl, 'POST', {}, {
      taskId: 'test-123',
      taskTitle: 'Test Task from Zorba OS',
      venture: 'zorbot',
      completedAt: new Date().toISOString(),
      _test: true
    })

    res.json({ ok: result.status < 400, status: result.status })
  } catch (e) {
    console.error(`${PREFIX} /api/zapier/test error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── SendGrid Briefing ─────────────────────────────────────────────────────────

function generateBriefingHtml(data) {
  const now = new Date()
  const today = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const tasks = Object.values(data.tasks || {})
  const doneTasks = new Set(data.doneTasks || [])
  const activeTasks = tasks.filter(t => !doneTasks.has(t.id))

  // Top tasks by revenue impact
  const revenueOrder = { high: 0, medium: 1, low: 2 }
  const topTasks = [...activeTasks]
    .sort((a, b) => revenueOrder[a.revenueImpact] - revenueOrder[b.revenueImpact])
    .slice(0, 5)

  // Venture health
  const VENTURE_KEYS = ['hermes','buildyourbot','selfsellingai','zorbot','minimovies','theriver','moraledge','thegetboaz','dubaiai','suman','podsupps','series']
  const ventureHealth = VENTURE_KEYS.map(key => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    const ventureDone = tasks.filter(t => t.venture === key && doneTasks.has(t.id))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    let score = 100
    if (ventureDone.length === 0) {
      score -= 20
    } else {
      const daysSince = (Date.now() - new Date(ventureDone[0].updatedAt)) / sevenDays
      if (daysSince > 1) score -= 10 * Math.floor(daysSince)
      if (Date.now() - new Date(ventureDone[0].updatedAt) < 86400000) score += 10
    }
    score = Math.max(0, Math.min(100, score))
    const activeCount = tasks.filter(t => t.venture === key && !doneTasks.has(t.id)).length
    return { key, score, activeCount }
  }).filter(v => v.activeCount > 0).sort((a, b) => a.score - b.score)

  const color = s => s >= 70 ? '#22c55e' : s >= 40 ? '#eab308' : '#ef4444'

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { background: #080808; color: #e5e5e5; font-family: 'IBM Plex Mono', monospace; padding: 32px; max-width: 600px; margin: 0 auto; }
  h1 { font-family: Georgia, serif; font-size: 28px; color: #f97316; margin-bottom: 4px; }
  h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin: 28px 0 12px; }
  .task { background: #111; border: 1px solid #1a1a1a; border-radius: 4px; padding: 12px 16px; margin-bottom: 8px; }
  .task-title { font-size: 14px; color: #e5e5e5; }
  .task-meta { font-size: 11px; color: #555; margin-top: 4px; }
  .venture { display: inline-flex; align-items: center; gap: 8px; background: #111; border: 1px solid #1a1a1a; border-radius: 4px; padding: 8px 12px; margin-bottom: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
  .footer { margin-top: 40px; font-size: 11px; color: #333; border-top: 1px solid #1a1a1a; padding-top: 16px; }
</style></head>
<body>
  <h1>Zorba OS</h1>
  <p style="color:#555;font-size:13px;margin-top:0">${today}</p>

  <h2>Top Priority Tasks</h2>
  ${topTasks.length === 0 ? '<p style="color:#555;font-size:13px">No active tasks.</p>' :
    topTasks.map(t => `
    <div class="task">
      <div class="task-title">${t.title}</div>
      <div class="task-meta">${t.venture} &nbsp;·&nbsp; ${t.time}m &nbsp;·&nbsp; revenue: ${t.revenueImpact} &nbsp;·&nbsp; energy: ${t.energy}</div>
    </div>`).join('')}

  <h2>Venture Health</h2>
  ${ventureHealth.length === 0 ? '<p style="color:#555;font-size:13px">No active ventures.</p>' :
    ventureHealth.map(v => `
    <div class="venture">
      <span class="dot" style="background:${color(v.score)}"></span>
      <span style="font-size:12px;color:#e5e5e5">${v.key}</span>
      <span style="font-size:11px;color:#555">${v.score}/100 &nbsp;·&nbsp; ${v.activeCount} tasks</span>
    </div>`).join('')}

  <div class="footer">Zorba OS Daily Briefing &nbsp;·&nbsp; ${now.toISOString()}</div>
</body>
</html>`
}

async function sendBriefingEmail(settings, data) {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  const toEmail = settings.briefingEmail

  if (!apiKey) throw new Error('SENDGRID_API_KEY not configured')
  if (!fromEmail) throw new Error('SENDGRID_FROM_EMAIL not configured')
  if (!toEmail) throw new Error('No briefing email set in Settings')

  const html = generateBriefingHtml(data)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const payload = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: { email: fromEmail },
    subject: `Zorba OS Briefing — ${today}`,
    content: [{ type: 'text/html', value: html }]
  }

  const result = await proxyRequest('https://api.sendgrid.com/v3/mail/send', 'POST', {
    Authorization: `Bearer ${apiKey}`
  }, payload)

  if (result.status >= 400) {
    throw new Error(`SendGrid error ${result.status}: ${result.body}`)
  }
  return { ok: true }
}

// POST /api/briefing/send-now
app.post('/api/briefing/send-now', async (req, res) => {
  try {
    const data = await loadData()
    const settings = data.settings || {}
    await sendBriefingEmail(settings, data)
    console.log(`${PREFIX} Briefing sent to ${settings.briefingEmail}`)
    res.json({ ok: true, message: `Briefing sent to ${settings.briefingEmail}` })
  } catch (e) {
    console.error(`${PREFIX} /api/briefing/send-now error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// GET /api/briefing/preview
app.get('/api/briefing/preview', async (req, res) => {
  try {
    const data = await loadData()
    const html = generateBriefingHtml(data)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (e) {
    console.error(`${PREFIX} /api/briefing/preview error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── Substack ──────────────────────────────────────────────────────────────────

// POST /api/substack/format — formats content as Substack-ready markdown
// Substack has no public write API; we generate clean markdown for manual paste
app.post('/api/substack/format', async (req, res) => {
  try {
    const { title, content, venture } = req.body
    if (!content) return res.status(400).json({ error: 'content is required' })

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const md = [
      `# ${title || 'Untitled'}`,
      '',
      venture ? `*${venture} &nbsp;·&nbsp; ${date}*` : `*${date}*`,
      '',
      '---',
      '',
      content.trim(),
      '',
      '---',
      '',
      '*Published via Zorba OS*',
    ].join('\n')

    res.json({ ok: true, markdown: md })
  } catch (e) {
    console.error(`${PREFIX} /api/substack/format error:`, e.message)
    res.status(500).json({ error: e.message })
  }
})

// Create HTTP server
const httpServer = createServer(app)

// WebSocket server
const wss = new WebSocketServer({ server: httpServer, path: '/ws' })

wss.on('connection', (ws) => {
  console.log(`${PREFIX} WebSocket client connected`)
  ws.on('close', () => console.log(`${PREFIX} WebSocket client disconnected`))
  ws.on('error', (e) => console.error(`${PREFIX} WebSocket error:`, e.message))
})

function broadcast(msg) {
  const data = JSON.stringify(msg)
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data)
    }
  })
}

// Watch data.json for external changes
async function startWatcher() {
  await ensureDataDir()

  // Ensure data.json exists
  if (!existsSync(DATA_FILE)) {
    await saveData({ ...DEFAULT_DATA })
    console.log(`${PREFIX} Created initial data.json`)
  }

  const watcher = watch(DATA_FILE, {
    persistent: true,
    ignoreInitial: true,
    ignored: TMP_FILE
  })

  watcher.on('change', () => {
    console.log(`${PREFIX} data.json changed, broadcasting update`)
    broadcast({ type: 'data-updated' })
  })

  watcher.on('error', (e) => console.error(`${PREFIX} Watcher error:`, e.message))
}

// ── Daily briefing cron ───────────────────────────────────────────────────────

function scheduleBriefing() {
  // Run every minute, check if current time matches settings.briefingTime
  cron.schedule('* * * * *', async () => {
    try {
      const data = await loadData()
      const settings = data.settings || {}
      if (!settings.sendgridEnabled || !settings.briefingEmail || !settings.briefingTime) return

      const now = new Date()
      const [hh, mm] = settings.briefingTime.split(':').map(Number)
      if (now.getHours() === hh && now.getMinutes() === mm) {
        console.log(`${PREFIX} Sending scheduled briefing to ${settings.briefingEmail}`)
        await sendBriefingEmail(settings, data)
      }
    } catch (e) {
      console.error(`${PREFIX} Briefing cron error:`, e.message)
    }
  })
  console.log(`${PREFIX} Briefing cron scheduled`)
}

const PORT = parseInt(process.env.PORT || '3001', 10)

httpServer.listen(PORT, async () => {
  await startWatcher()
  scheduleBriefing()
  console.log(`${PREFIX} Server running on port ${PORT}`)
})
