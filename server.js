import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { watch } from 'chokidar'
import { readFile, writeFile, rename, copyFile, mkdir, access } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import https from 'https'
import { URL } from 'url'
import cron from 'node-cron'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DATA_FILE = join(DATA_DIR, 'data.json')
const TMP_FILE = join(DATA_DIR, 'data.tmp.json')
const PREFIX = '[zorba-os]'

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

// POST /api/briefing/send-now (stub — real sendgrid integration optional)
app.post('/api/briefing/send-now', async (req, res) => {
  try {
    // Stub: log intent
    console.log(`${PREFIX} Briefing send-now requested`)
    res.json({ ok: true, message: 'Briefing send triggered (configure SendGrid to enable)' })
  } catch (e) {
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

const PORT = parseInt(process.env.PORT || '3001', 10)

httpServer.listen(PORT, async () => {
  await startWatcher()
  console.log(`${PREFIX} Server running on port ${PORT}`)
})
