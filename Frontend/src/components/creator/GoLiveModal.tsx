import React, { useEffect, useRef, useState } from 'react'
import { LuCamera, LuMic, LuX, LuRadio, LuCameraOff, LuMicOff } from 'react-icons/lu'
import toast from 'react-hot-toast'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

/**
 * GoLiveModal (Robust, backend-matched)
 *
 * - Converts Blob -> ArrayBuffer before sending to WebSocket
 * - Sets ws.binaryType = 'arraybuffer'
 * - Pauses MediaRecorder when ws.bufferedAmount exceeds threshold
 * - Bounded local queue as fallback while ffmpeg restarts / WS reconnects
 * - Keepalive pings and small reconnect/backoff logic
 */
export const GoLiveModal = ({ streamKey, onClose }) => {
  const videoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const wsRef = useRef(null)

  // small local bounded queue for temporary buffering
  const localQueueRef = useRef([])
  const LOCAL_QUEUE_LIMIT = 60 // max chunks to keep (60 * 250ms = 15s worst-case)

  // backpressure thresholds
  const MAX_WS_BUFFERED_BYTES = 5_000_000 // 5MB - if exceeded pause recorder
  const RESUME_WS_BUFFERED_BYTES = 1_000_000 // 1MB - resume when below this

  // reconnection config
  const MAX_RECONNECT_ATTEMPTS = 3
  const RECONNECT_BASE_DELAY_MS = 1000 // multiplied by attempt

  // ping config
  const PING_INTERVAL_MS = 20_000

  const [isStreaming, setIsStreaming] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isPausedForBackpressure, setIsPausedForBackpressure] = useState(false)
  const reconnectAttemptsRef = useRef(0)
  const pingTimerRef = useRef(null)
  const resumeCheckTimerRef = useRef(null)
  const desiredChunkMsRef = useRef(250)

  useEffect(() => {
    let mounted = true
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        })
        if (!mounted) {
          // if unmounted quickly, stop tracks
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        if (videoRef.current) videoRef.current.srcObject = stream
        mediaStreamRef.current = stream
      } catch (err) {
        console.error('Error accessing media devices.', err)
        toast.error('Could not access camera/microphone.')
        onClose && onClose()
      }
    }
    setupMedia()

    return () => {
      mounted = false
      cleanupEverything()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper: create WS url correctly (http -> ws, https -> wss)
  const makeWsUrl = () => {
    if (!apiBaseUrl) {
      console.warn('VITE_API_BASE_URL missing; attempting relative URL')
      // fallback to same host
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${proto}//${window.location.host}/stream/live/${streamKey}`
    }
    return `${apiBaseUrl.replace(/^http/, 'ws')}/stream/live/${streamKey}`
  }

  // Send localQueue contents (bounded)
  const flushLocalQueue = async (ws) => {
    try {
      while (localQueueRef.current.length > 0 && ws && ws.readyState === WebSocket.OPEN) {
        const buf = localQueueRef.current.shift()
        // check bufferedAmount again
        if (ws.bufferedAmount > MAX_WS_BUFFERED_BYTES) {
          // push back and break
          localQueueRef.current.unshift(buf)
          break
        }
        ws.send(buf)
      }
    } catch (err) {
      console.error('Error flushing local queue to WS', err)
    }
  }

  const startPing = (ws) => {
    stopPing()
    pingTimerRef.current = setInterval(() => {
      try {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', t: Date.now() }))
        }
      } catch (e) {
        // ignore
      }
    }, PING_INTERVAL_MS)
  }
  const stopPing = () => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current)
      pingTimerRef.current = null
    }
  }

  // Monitors bufferedAmount and resumes recorder when safe
  const startResumeCheck = (ws) => {
    stopResumeCheck()
    resumeCheckTimerRef.current = setInterval(() => {
      try {
        if (!ws || ws.readyState !== WebSocket.OPEN) return
        if (isPausedForBackpressure && ws.bufferedAmount <= RESUME_WS_BUFFERED_BYTES) {
          // resume recorder
          try {
            mediaRecorderRef.current &&
              mediaRecorderRef.current.state === 'paused' &&
              mediaRecorderRef.current.resume()
            setIsPausedForBackpressure(false)
            toast.success('Network recovered — resuming stream')
            // flush any queued chunks
            flushLocalQueue(ws)
          } catch (e) {
            console.warn('Failed to resume recorder', e)
          }
        }
      } catch (e) {
        // ignore
      }
    }, 500)
  }
  const stopResumeCheck = () => {
    if (resumeCheckTimerRef.current) {
      clearInterval(resumeCheckTimerRef.current)
      resumeCheckTimerRef.current = null
    }
  }

  // Cleanup everything (recorder, ws, timers, tracks)
  const cleanupEverything = () => {
    try {
      stopPing()
      stopResumeCheck()
      // MediaRecorder cleanup
      if (mediaRecorderRef.current) {
        try {
          if (
            mediaRecorderRef.current.state === 'recording' ||
            mediaRecorderRef.current.state === 'paused'
          ) {
            mediaRecorderRef.current.stop()
          }
        } catch (e) {}
        mediaRecorderRef.current = null
      }
      // WS cleanup
      if (wsRef.current) {
        try {
          wsRef.current.onopen = null
          wsRef.current.onclose = null
          wsRef.current.onerror = null
          wsRef.current.onmessage = null
          if (wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close()
        } catch (e) {}
        wsRef.current = null
      }
      // Stop media tracks
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        } catch (e) {}
        mediaStreamRef.current = null
      }
      // clear local queue
      localQueueRef.current = []
      setIsStreaming(false)
      setIsPausedForBackpressure(false)
    } catch (err) {
      console.error('Error during cleanupEverything', err)
    }
  }

  // Reconnect logic (attempts, backoff)
  const scheduleReconnect = () => {
    const attempts = reconnectAttemptsRef.current + 1
    reconnectAttemptsRef.current = attempts
    if (attempts > MAX_RECONNECT_ATTEMPTS) {
      toast.error('Connection failed. Please try again later.')
      cleanupEverything()
      return
    }
    const delay = RECONNECT_BASE_DELAY_MS * attempts
    toast(`Reconnecting... attempt ${attempts}`, { duration: 3000 })
    setTimeout(() => {
      if (mediaStreamRef.current) {
        // try re-starting streaming with same settings
        internalStartStreaming({ isReconnect: true })
      } else {
        cleanupEverything()
      }
    }, delay)
  }

  // Core: start streaming logic (internal so we can call on reconnect)
  const internalStartStreaming = ({ isReconnect = false } = {}) => {
    if (!mediaStreamRef.current) {
      toast.error('Camera / mic not available.')
      return
    }

    // If already have a WS open, close it first (clean attempt)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // already connected
      return
    }

    const wsUrl = makeWsUrl()
    console.log(`[GoLiveModal] Connecting to WebSocket at: ${wsUrl}`)
    const ws = new WebSocket(wsUrl)
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connection established.')
      toast.success('Connected — starting stream')
      reconnectAttemptsRef.current = 0
      startPing(ws)
      startResumeCheck(ws)
      // small meta to notify backend of fps expectation (backend supports meta)
      try {
        ws.send(JSON.stringify({ type: 'meta', fps: 30 }))
      } catch (e) {}

      // create media recorder
      try {
        const recorder = new MediaRecorder(mediaStreamRef.current, {
          mimeType: 'video/webm; codecs=vp8,opus',
          videoBitsPerSecond: 2500000, // tuned to backend defaults
        })
        mediaRecorderRef.current = recorder

        // dataavailable handler
        recorder.ondataavailable = async (event) => {
          try {
            if (!event.data || event.data.size === 0) return
            // convert to ArrayBuffer
            const buffer = await event.data.arrayBuffer()
            if (!ws || ws.readyState !== WebSocket.OPEN) {
              // fallback to local queue (bounded)
              if (localQueueRef.current.length >= LOCAL_QUEUE_LIMIT) {
                // drop the oldest to keep memory bounded
                localQueueRef.current.shift()
              }
              localQueueRef.current.push(Buffer.from(buffer))
              return
            }
            // if bufferedAmount is too high, pause recorder and queue
            if (ws.bufferedAmount > MAX_WS_BUFFERED_BYTES) {
              // push to queue
              if (localQueueRef.current.length >= LOCAL_QUEUE_LIMIT) localQueueRef.current.shift()
              localQueueRef.current.push(Buffer.from(buffer))
              if (!isPausedForBackpressure) {
                try {
                  recorder.pause()
                  setIsPausedForBackpressure(true)
                  toast('Network congested — temporarily pausing stream', { duration: 4000 })
                } catch (e) {
                  console.warn('Failed to pause recorder on backpressure', e)
                }
              }
              return
            }
            // safe to send directly
            ws.send(buffer)
          } catch (err) {
            console.error('Error in ondataavailable:', err)
            // try queuing as fallback
            try {
              if (localQueueRef.current.length >= LOCAL_QUEUE_LIMIT) localQueueRef.current.shift()
              const fallbackBuffer = await event.data.arrayBuffer()
              localQueueRef.current.push(Buffer.from(fallbackBuffer))
            } catch (e) {}
          }
        }

        recorder.onstart = () => {
          setIsStreaming(true)
          setIsPausedForBackpressure(false)
          // flush localQueue if any
          flushLocalQueue(ws)
        }

        recorder.onstop = () => {
          setIsStreaming(false)
          // close WS gracefully after stopping
          try {
            if (ws && ws.readyState === WebSocket.OPEN) ws.close()
          } catch (e) {}
        }

        recorder.onerror = (err) => {
          console.error('MediaRecorder error:', err)
          toast.error('Recording error occurred.')
        }

        // start collecting chunks
        recorder.start(desiredChunkMsRef.current)
      } catch (recErr) {
        console.error('Failed to start MediaRecorder', recErr)
        toast.error('Failed to start recording.')
      }
    }

    ws.onmessage = (ev) => {
      try {
        // handle optional server control messages: e.g., ack, pause/resume, etc.
        if (typeof ev.data === 'string') {
          try {
            const parsed = JSON.parse(ev.data)
            if (parsed && parsed.type === 'ack') {
              // flush queue opportunistically
              flushLocalQueue(ws)
            }
            // server could request a client-side action
            if (parsed && parsed.type === 'control' && parsed.action === 'stop') {
              // stop streaming as requested
              stopStreaming()
            }
          } catch (e) {
            // ignore malformed text
          }
        }
      } catch (e) {
        // ignore
      }
    }

    ws.onclose = (ev) => {
      console.log('WebSocket closed', ev)
      stopPing()
      stopResumeCheck()
      // If we were actively streaming, attempt reconnect
      if (isStreaming) {
        scheduleReconnect()
      } else {
        // not streaming (user likely stopped) — cleanup
        cleanupEverything()
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error', err)
      toast.error('Streaming connection experienced an error.')
      // close socket to trigger onclose + reconnect logic
      try {
        ws.close()
      } catch (e) {}
    }
  }

  const startStreaming = () => {
    reconnectAttemptsRef.current = 0
    internalStartStreaming({ isReconnect: false })
  }

  const stopStreaming = () => {
    // stop recorder (which will trigger ws close)
    if (mediaRecorderRef.current) {
      try {
        if (
          mediaRecorderRef.current.state === 'recording' ||
          mediaRecorderRef.current.state === 'paused'
        ) {
          mediaRecorderRef.current.stop()
        }
      } catch (e) {}
      mediaRecorderRef.current = null
    }
    // close ws
    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch (e) {}
      wsRef.current = null
    }
    // clear queue
    localQueueRef.current = []
    setIsStreaming(false)
    setIsPausedForBackpressure(false)
    stopPing()
    stopResumeCheck()
    toast.success('Stream stopped. Processing the recording...')
  }

  const toggleTrack = (type) => {
    if (!mediaStreamRef.current) return
    const tracks =
      type === 'video'
        ? mediaStreamRef.current.getVideoTracks()
        : mediaStreamRef.current.getAudioTracks()
    tracks.forEach((track) => {
      track.enabled = !track.enabled
      if (type === 'video') setIsCameraOn(track.enabled)
      if (type === 'audio') setIsMicOn(track.enabled)
    })
  }

  // If user closes modal while streaming, stop everything
  const handleClose = () => {
    stopStreaming()
    onClose && onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-background-dark)/0.8)] backdrop-blur-md">
      <div className="relative flex w-full max-w-4xl flex-col rounded-xl border border-[rgb(var(--color-surface-2))] bg-[rgb(var(--color-surface-1))] p-5 shadow-2xl animate-fadeInUp md:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">
            <span className="flex items-center gap-3">
              <LuRadio
                className={`transition-colors ${
                  isStreaming
                    ? 'text-pink-500 animate-pulse'
                    : 'text-[rgb(var(--color-text-muted))]'
                }`}
              />
              Live Studio
            </span>
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-2))] hover:text-[rgb(var(--color-text-primary))]"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
          <div
            className={`absolute top-3 left-4 flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
              isStreaming
                ? 'bg-pink-600/90 text-white'
                : 'bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-secondary))]'
            }`}
          >
            {isStreaming && <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>}
            {isStreaming ? 'Live' : isPausedForBackpressure ? 'Paused (network)' : 'Offline'}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleTrack('video')}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isCameraOn
                  ? 'border-[rgb(var(--color-surface-2))] bg-[rgb(var(--color-surface-2))]'
                  : 'border-[rgb(var(--color-surface-3))] bg-transparent text-[rgb(var(--color-text-secondary))]'
              } hover:border-[rgb(var(--color-primary-cyan))]`}
              aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {isCameraOn ? <LuCamera size={22} /> : <LuCameraOff size={22} />}
            </button>
            <button
              onClick={() => toggleTrack('audio')}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isMicOn
                  ? 'border-[rgb(var(--color-surface-2))] bg-[rgb(var(--color-surface-2))]'
                  : 'border-[rgb(var(--color-surface-3))] bg-transparent text-[rgb(var(--color-text-secondary))]'
              } hover:border-[rgb(var(--color-primary-cyan))]`}
              aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isMicOn ? <LuMic size={22} /> : <LuMicOff size={22} />}
            </button>
          </div>

          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="w-full rounded-lg bg-[rgb(var(--color-surface-2))] px-8 py-3 text-base font-semibold text-[rgb(var(--color-text-primary))] transition-colors hover:bg-[rgb(var(--color-surface-3))] sm:w-auto"
            >
              Stop Streaming
            </button>
          ) : (
            <button
              onClick={startStreaming}
              className="w-full rounded-lg bg-red-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:bg-red-700 hover:scale-[1.02] sm:w-auto"
            >
              Go Live
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
