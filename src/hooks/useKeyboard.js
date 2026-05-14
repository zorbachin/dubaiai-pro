import { useEffect } from 'react'

export function useKeyboard(handlers) {
  useEffect(() => {
    const handle = (e) => {
      const key = [
        e.metaKey && 'Cmd',
        e.ctrlKey && 'Ctrl',
        e.shiftKey && 'Shift',
        e.key
      ].filter(Boolean).join('+')
      handlers[key]?.(e)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [handlers])
}
