import { useState, useEffect, useRef, useCallback } from 'react'

const PREFIX = '[zorba-ui]'
const DEBOUNCE_MS = 500
const POLL_INTERVAL_MS = 5000

export function useData() {
  const [data, setDataRaw] = useState(null)
  const [status, setStatus] = useState('loading')
  const saveTimerRef = useRef(null)
  const wsRef = useRef(null)
  const lastSaveRef = useRef(0)
  const reconnectTimerRef = useRef(null)
  const pollTimerRef = useRef(null)
  const pendingDataRef = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/load')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setDataRaw(json)
      setStatus('ready')
      console.log(`${PREFIX} Data loaded`)
      return json
    } catch (e) {
      console.error(`${PREFIX} Failed to load data:`, e.message)
      setStatus('error')
      return null
    }
  }, [])

  const doSave = useCallback(async (dataToSave) => {
    setStatus('saving')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      lastSaveRef.current = Date.now()
      setStatus('ready')
      console.log(`${PREFIX} Data saved`)
    } catch (e) {
      console.error(`${PREFIX} Save failed:`, e.message)
      setStatus('disconnected')
    }
  }, [])

  const setData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      pendingDataRef.current = next

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        if (pendingDataRef.current) {
          doSave(pendingDataRef.current)
          pendingDataRef.current = null
        }
      }, DEBOUNCE_MS)

      return next
    })
  }, [doSave])

  const forceSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setDataRaw(prev => {
      if (prev) doSave(prev)
      return prev
    })
    console.log(`${PREFIX} Force save triggered`)
  }, [doSave])

  // WebSocket connection
  const connectWS = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState < 2) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`

    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(`${PREFIX} WebSocket connected`)
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current)
          pollTimerRef.current = null
        }
        setStatus(s => s === 'disconnected' ? 'ready' : s)
      }

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data)
          if (msg.type === 'data-updated') {
            // Skip if we just saved (within 2s)
            if (Date.now() - lastSaveRef.current < 2000) {
              console.log(`${PREFIX} data-updated skipped (just saved)`)
              return
            }
            console.log(`${PREFIX} data-updated received, re-fetching`)
            fetchData()
          }
        } catch (e) {
          // ignore parse errors
        }
      }

      ws.onclose = () => {
        console.warn(`${PREFIX} WebSocket disconnected, starting poll`)
        setStatus('disconnected')
        startPolling()
        // Reconnect after 3s
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = setTimeout(connectWS, 3000)
      }

      ws.onerror = (e) => {
        console.error(`${PREFIX} WebSocket error`)
      }
    } catch (e) {
      console.error(`${PREFIX} WebSocket creation failed:`, e.message)
      startPolling()
    }
  }, [fetchData])

  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return
    pollTimerRef.current = setInterval(() => {
      fetchData()
    }, POLL_INTERVAL_MS)
  }, [fetchData])

  // On mount: load data and connect WS
  useEffect(() => {
    fetchData().then(() => {
      connectWS()
    })

    return () => {
      if (wsRef.current) wsRef.current.close()
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [])

  return { data, setData, forceSave, status }
}
