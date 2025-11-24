// GoLiveModal.jsx

import React, { useEffect, useRef, useState } from 'react'
import {
  LuCamera,
  LuMic,
  LuX,
  LuRadio,
  LuCameraOff,
  LuMicOff,
  LuSparkles,
  LuUpload,
} from 'react-icons/lu'
import toast from 'react-hot-toast'
import apiClient, { createLiveStream } from '../../api/apiClient'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

export const GoLiveModal = ({ streamKey: initialStreamKey, onClose }) => {
  const videoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const wsRef = useRef(null)

  const [streamKey, setStreamKey] = useState(initialStreamKey) // Local state for stream key
  const [isStreaming, setIsStreaming] = useState(false)
  const [isCreatingStream, setIsCreatingStream] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null) // Cloudinary URL store karne ke liye
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)

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
  const startStreaming = async () => {
    if (isStreaming || !mediaStreamRef.current) return
    if (!title) {
      toast.error('Please enter a title for your stream.')
      return
    }

    // Agar stream key nahi hai, pehle stream create karein
    if (!streamKey) {
      try {
        setIsCreatingStream(true)
        const createToast = toast.loading('Creating stream...')

        const streamData = {
          title,
          description,
          tags,
          thumbnailUrl,
        }

        const response = await createLiveStream(streamData)
        
        if (!response || !response.streamKey) {
          throw new Error('Stream key not received from server')
        }

        setStreamKey(response.streamKey)
        toast.success('Stream created! Starting...', { id: createToast })
        
        // Ab stream key mil gayi hai, ab WebSocket connect karein
        connectWebSocket(response.streamKey)
      } catch (error) {
        console.error('Failed to create stream:', error)
        toast.error('Could not create stream. Please try again.')
        setIsCreatingStream(false)
        return
      } finally {
        setIsCreatingStream(false)
      }
    } else {
      // Agar stream key already hai, seedha connect karein
      connectWebSocket(streamKey)
    }
  }

  const connectWebSocket = (key) => {
    const wsUrl = apiBaseUrl 
      ? `${apiBaseUrl.replace(/^http/, 'ws')}/stream/live/${key}`
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/stream/live/${key}`
    
    console.log(`[WS] Connecting to: ${wsUrl}`)
    const ws = new WebSocket(wsUrl)
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS] Connection established.')
      toast.success('Stream is now LIVE!')

      const recorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: 'video/webm; codecs=vp8,opus',
        videoBitsPerSecond: 2500000,
      })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          try {
            const arrayBuffer = await event.data.arrayBuffer()
            ws.send(arrayBuffer)
          } catch (err) {
            console.error('Error sending data:', err)
          }
        }
      }

      recorder.onstart = () => setIsStreaming(true)
      recorder.onstop = () => {
        if (ws.readyState === WebSocket.OPEN) ws.close()
      }
      recorder.onerror = (err) => {
        console.error('MediaRecorder error:', err)
        toast.error('An error occurred during recording.')
        stopStreaming()
      }
      recorder.start(250)
    }

    ws.onclose = () => {
      console.log('[WS] Connection closed.')
      if (isStreaming) {
        toast.error('Stream disconnected.')
        setIsStreaming(false)
        if (mediaRecorderRef.current?.state !== 'inactive') {
          mediaRecorderRef.current.stop()
        }
      }
    }

    ws.onerror = (err) => {
      console.error('[WS] WebSocket error:', err)
      toast.error('A connection error occurred.')
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }

  const stopStreaming = () => {
    if (!isStreaming || !mediaRecorderRef.current) return
    mediaRecorderRef.current.stop()
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
    if (isStreaming) stopStreaming()
    onClose()
  }

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result)
      reader.readAsDataURL(file)

      // Thumbnail ko Cloudinary pe upload kar dete hain
      try {
        setIsUploadingThumbnail(true)
        const formData = new FormData()
        formData.append('media', file)
        
        const response = await apiClient.post('/posts/upload-media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        
        setThumbnailUrl(response.data.url)
        toast.success('Thumbnail uploaded successfully!')
      } catch (error) {
        console.error('Error uploading thumbnail:', error)
        toast.error('Failed to upload thumbnail')
      } finally {
        setIsUploadingThumbnail(false)
      }
    }
  }

  const handleGenerateAIThumbnail = () => {
    toast.success('Generating AI thumbnail... (feature coming soon!)')
  }

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && tags.length < 5 && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      } else if (tags.length >= 5) {
        toast.error('You can add a maximum of 5 tags.')
      }
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    // Main overlay with padding for smaller screens
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 backdrop-blur-lg sm:p-4">
      {/* Modal container: Limits height and width, enables internal scrolling */}
      <div className="relative flex h-full max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/80 shadow-2xl shadow-black/50">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleCloseModal}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Content wrapper: Lays out children and enables scrolling on small screens */}
        <div className="flex h-full flex-col lg:flex-row lg:overflow-hidden">
          {/* Left Side (Video): Added responsive padding */}
          <div className="flex w-full flex-col p-4 sm:p-6 lg:w-2/3 lg:p-8">
            <div className="mb-4 flex items-center gap-3 text-xl font-bold text-white sm:text-2xl">
              <LuRadio className={isStreaming ? 'animate-pulse text-red-500' : 'text-gray-400'} />
              <h2>Live Studio</h2>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-gray-800 bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute top-3 left-3 flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider sm:top-4 sm:left-4 sm:px-3 sm:py-1.5 sm:text-sm ${
                  isStreaming ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {isStreaming && (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white sm:h-2.5 sm:w-2.5"></span>
                )}
                {isStreaming ? 'Live' : 'Offline'}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 sm:mt-6">
              {/* Responsive control buttons */}
              <button
                onClick={() => toggleTrack('video')}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 sm:h-14 sm:w-14 ${
                  isCameraOn
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-gray-700 text-gray-300'
                } hover:bg-blue-500`}
                aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
              >
                {isCameraOn ? <LuCamera size={26} /> : <LuCameraOff size={26} />}
              </button>
              <button
                onClick={() => toggleTrack('audio')}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 sm:h-14 sm:w-14 ${
                  isMicOn
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-gray-700 text-gray-300'
                } hover:bg-blue-500`}
                aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? <LuMic size={26} /> : <LuMicOff size={26} />}
              </button>
            </div>
          </div>

          {/* Right Side (Stream Details): This part becomes scrollable on small screens */}
          <div className="flex w-full flex-col overflow-y-auto rounded-r-2xl bg-gray-900 p-4 sm:p-6 lg:w-1/3 lg:p-8">
            <h3 className="mb-6 text-xl font-semibold text-white">Stream Details</h3>
            <div className="flex-grow space-y-5">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., My Awesome Live Stream"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none"
                  placeholder="Tell everyone what your stream is about..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-300">
                  Tags ({tags.length}/5)
                </label>
                <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg border-2 border-gray-700 bg-gray-800 p-2 focus-within:border-blue-500">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-blue-500/20 px-2.5 py-1 text-sm font-medium text-blue-300"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-300 transition-colors hover:text-white"
                      >
                        <LuX size={14} />
                      </button>
                    </div>
                  ))}
                  {tags.length < 5 && (
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      className="flex-1 bg-transparent p-1 text-white placeholder-gray-500 focus:outline-none"
                      placeholder="Add a tag..."
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Thumbnail</label>
                <div className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-700 bg-gray-800">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-gray-500">
                      <LuUpload size={32} />
                      <p className="mt-2 text-sm">Upload a thumbnail</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer rounded-md bg-gray-700 p-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-600"
                  >
                    Upload File
                    <input
                      id="thumbnail-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                  <button
                    onClick={handleGenerateAIThumbnail}
                    className="flex items-center justify-center gap-2 rounded-md bg-purple-600 p-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
                  >
                    <LuSparkles size={16} />
                    Create with AI
                  </button>
                </div>
              </div>
            </div>
            {/* Action button at the bottom */}
            <div className="mt-8 flex-shrink-0">
              {isStreaming ? (
                <button
                  onClick={stopStreaming}
                  className="w-full rounded-lg bg-gray-700 py-3 font-semibold text-white transition-colors hover:bg-gray-600 sm:py-4"
                >
                  Stop Streaming
                </button>
              ) : (
                <button
                  onClick={startStreaming}
                  disabled={isCreatingStream || isUploadingThumbnail}
                  className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed sm:py-4"
                >
                  {isCreatingStream ? 'Creating Stream...' : isUploadingThumbnail ? 'Uploading Thumbnail...' : 'Go Live'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
