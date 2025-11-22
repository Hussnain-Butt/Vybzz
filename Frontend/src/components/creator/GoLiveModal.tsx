// GoLiveModal.jsx

import React, { useEffect, useRef, useState } from 'react'
import { LuCamera, LuMic, LuX, LuRadio, LuCameraOff, LuMicOff } from 'react-icons/lu'
import toast from 'react-hot-toast'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

export const GoLiveModal = ({ streamKey, onClose }) => {
  const videoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const wsRef = useRef(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)

  // --- Helper function to build WebSocket URL ---
  const getWebSocketUrl = () => {
    if (!apiBaseUrl) {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${proto}//${window.location.host}/stream/live/${streamKey}`
    }
    return `${apiBaseUrl.replace(/^http/, 'ws')}/stream/live/${streamKey}`
  }

  // --- Setup and Teardown Effect ---
  useEffect(() => {
    let isMounted = true

    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        })
        if (isMounted) {
          mediaStreamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        }
      } catch (err) {
        console.error('Error accessing media devices:', err)
        toast.error('Could not access camera/microphone.')
        if (isMounted) onClose()
      }
    }

    setupMedia()

    return () => {
      isMounted = false
      // Cleanup all resources on component unmount
      if (wsRef.current) wsRef.current.close()
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Streaming Logic ---
  const startStreaming = () => {
    if (isStreaming || !mediaStreamRef.current) return

    const wsUrl = getWebSocketUrl()
    console.log(`[WS] Connecting to: ${wsUrl}`)
    const ws = new WebSocket(wsUrl)
    ws.binaryType = 'arraybuffer' // Use ArrayBuffer for efficiency
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS] Connection established.')
      toast.success('Stream connection is live!')

      const recorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: 'video/webm; codecs=vp8,opus',
        videoBitsPerSecond: 2500000,
      })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          try {
            // Convert Blob to ArrayBuffer before sending
            const arrayBuffer = await event.data.arrayBuffer()
            ws.send(arrayBuffer)
          } catch (err) {
            console.error('Error sending data:', err)
          }
        }
      }

      recorder.onstart = () => {
        setIsStreaming(true)
      }

      recorder.onstop = () => {
        // This can be triggered by stopStreaming() or by an error
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }

      recorder.onerror = (err) => {
        console.error('MediaRecorder error:', err)
        toast.error('An error occurred during recording.')
        stopStreaming()
      }

      // Start recording and send data chunks every 250ms
      recorder.start(250)
    }

    ws.onclose = () => {
      console.log('[WS] Connection closed.')
      if (isStreaming) {
        // If it was closed while streaming, update state
        toast.error('Stream disconnected.')
        setIsStreaming(false)
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop()
        }
      }
    }

    ws.onerror = (err) => {
      console.error('[WS] WebSocket error:', err)
      toast.error('A connection error occurred.')
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }

  const stopStreaming = () => {
    if (!isStreaming || !mediaRecorderRef.current) return
    mediaRecorderRef.current.stop() // This will also trigger ws.close() in the onstop handler
    setIsStreaming(false)
    toast.success('Stream stopped.')
  }

  const toggleTrack = (type) => {
    if (!mediaStreamRef.current) return
    const tracks =
      type === 'video'
        ? mediaStreamRef.current.getVideoTracks()
        : mediaStreamRef.current.getAudioTracks()
    tracks.forEach((track) => {
      const wasEnabled = track.enabled
      track.enabled = !wasEnabled
      if (type === 'video') setIsCameraOn(!wasEnabled)
      if (type === 'audio') setIsMicOn(!wasEnabled)
    })
  }

  const handleCloseModal = () => {
    if (isStreaming) {
      stopStreaming()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex w-full max-w-4xl flex-col rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-bold text-white">
            <LuRadio className={isStreaming ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
            Live Studio
          </h2>
          <button
            onClick={handleCloseModal}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
          <div
            className={`absolute top-3 left-4 flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
              isStreaming ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {isStreaming && <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>}
            {isStreaming ? 'Live' : 'Offline'}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleTrack('video')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                isCameraOn ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
              } hover:bg-gray-600`}
              aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {isCameraOn ? <LuCamera size={22} /> : <LuCameraOff size={22} />}
            </button>
            <button
              onClick={() => toggleTrack('audio')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                isMicOn ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
              } hover:bg-gray-600`}
              aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isMicOn ? <LuMic size={22} /> : <LuMicOff size={22} />}
            </button>
          </div>

          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="w-full rounded-lg bg-gray-700 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-600 sm:w-auto"
            >
              Stop Streaming
            </button>
          ) : (
            <button
              onClick={startStreaming}
              className="w-full rounded-lg bg-red-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-transform hover:scale-105 sm:w-auto"
            >
              Go Live
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
