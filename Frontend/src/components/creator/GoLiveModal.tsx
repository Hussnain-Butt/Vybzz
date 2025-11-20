// File: src/components/creator/GoLiveModal.js (COMPLETE REWRITE)

import React, { useEffect, useRef, useState } from 'react'
import { LuCamera, LuMic, LuX, LuRadio } from 'react-icons/lu'
import toast from 'react-hot-toast'

export const GoLiveModal = ({ streamKey, onClose }) => {
  const videoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const wsRef = useRef(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)

  // Step 1: Component load hone par user se camera/mic access lein
  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        mediaStreamRef.current = stream
      } catch (err) {
        console.error('Error accessing media devices.', err)
        toast.error('Could not access camera/microphone.')
        onClose()
      }
    }
    setupMedia()

    // Cleanup function: Component unmount hone par camera/mic band kar dein
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [onClose])

  // Step 2: "Start Streaming" button click hone par
  const startStreaming = () => {
    if (!mediaStreamRef.current) {
      toast.error('Media stream not available.')
      return
    }

    // API Gateway ka WebSocket URL banayein
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/stream/live/${streamKey}`

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connection established.')
      toast.success('Connection to server successful! Starting stream.')

      // MediaRecorder setup karein
      const recorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: 'video/webm; codecs=vp8,opus',
        videoBitsPerSecond: 3000000, // 3 Mbps
      })
      mediaRecorderRef.current = recorder

      // Jab bhi MediaRecorder video ka chunk record kare
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          // Us chunk ko WebSocket ke zariye server ko bhej dein
          ws.send(event.data)
        }
      }

      recorder.onstart = () => {
        setIsStreaming(true)
      }
      recorder.onstop = () => {
        setIsStreaming(false)
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }

      // Har 1 second mein data bhejein
      recorder.start(1000)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed.')
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      setIsStreaming(false)
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      toast.error('Streaming connection failed.')
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      setIsStreaming(false)
    }
  }

  // Step 3: "Stop Streaming" button click hone par
  const stopStreaming = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      toast.success('Stream stopped successfully.')
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex w-full max-w-4xl flex-col rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            <span className="flex items-center gap-3">
              <LuRadio
                className={`transition-colors ${
                  isStreaming ? 'text-red-500 animate-pulse' : 'text-gray-500'
                }`}
              />
              Live Studio
            </span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-[rgb(var(--color-surface-3))] hover:text-white"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
          <div
            className={`absolute top-4 left-4 rounded-md px-2 py-1 text-xs font-bold uppercase ${
              isStreaming ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-200'
            }`}
          >
            {isStreaming ? 'Live' : 'Offline'}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleTrack('video')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                isCameraOn ? 'bg-[rgb(var(--color-surface-3))]' : 'bg-red-600'
              }`}
            >
              <LuCamera size={22} />
            </button>
            <button
              onClick={() => toggleTrack('audio')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                isMicOn ? 'bg-[rgb(var(--color-surface-3))]' : 'bg-red-600'
              }`}
            >
              <LuMic size={22} />
            </button>
          </div>
          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="w-full rounded-xl bg-gray-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 sm:w-auto"
            >
              Stop Streaming
            </button>
          ) : (
            <button
              onClick={startStreaming}
              className="w-full rounded-xl bg-red-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
            >
              Go Live
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
