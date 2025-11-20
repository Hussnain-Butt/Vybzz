// File: Frontend/src/components/creator/CreatorHeader.tsx (COMPLETE AND FINAL UPDATED VERSION)

import React, { useState, useRef } from 'react'
import { Camera, Eye, Link, Plus, Share2, Radio } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { uploadImages, createLiveStream } from '../../api/apiClient' // Naya function import kiya gaya
import { GoLiveModal } from './GoLiveModal' // Naya modal import kiya gaya

// Interfaces
interface CreatorProfile {
  pageName: string
  pageUrl: string
  profileImageUrl: string | null
  bannerUrl: string | null
}

interface UserData {
  name: string
  creatorProfile: CreatorProfile
}

interface CreatorHeaderProps {
  user: UserData
  onProfileUpdate: (updatedProfile: Partial<CreatorProfile>) => void
}

const DEFAULT_BANNER = '/default-banner.png'

export const CreatorHeader: React.FC<CreatorHeaderProps> = ({ user, onProfileUpdate }) => {
  // Existing State
  const [isUploading, setIsUploading] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // New State for Live Streaming
  const [isCreatingStream, setIsCreatingStream] = useState(false)
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false)
  const [streamDetails, setStreamDetails] = useState<{ streamKey: string | null }>({
    streamKey: null,
  })

  // --- BANNER UPLOAD FUNCTIONALITY (Unchanged) ---
  const handleBannerFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('bannerImage', file) // The key must be 'bannerImage'

    const uploadToast = toast.loading('Uploading banner...')

    try {
      const response = await uploadImages(formData)
      if (response.profile && response.profile.bannerUrl) {
        onProfileUpdate({ bannerUrl: response.profile.bannerUrl })
        toast.success('Banner updated successfully!', { id: uploadToast })
      } else {
        throw new Error('Banner URL not found in API response.')
      }
    } catch (error) {
      console.error('Banner upload failed:', error)
      toast.error('Failed to upload banner. Please try again.', { id: uploadToast })
    } finally {
      setIsUploading(false)
    }
  }

  const triggerBannerUpload = () => {
    bannerInputRef.current?.click()
  }

  // --- GO LIVE FUNCTIONALITY (Updated for Debugging) ---
  const handleGoLive = async () => {
    alert('Go Live function CALL HUA!') // <--- YEH LINE ADD KAREIN
    console.log('[DEBUG] "Go Live" button clicked.') // <-- LOG 1

    setIsCreatingStream(true)
    const goLiveToast = toast.loading('Preparing your live stream...')

    try {
      console.log('[DEBUG] Calling createLiveStream API function.') // <-- LOG 2

      // Backend ko request bhej kar naya stream create karein
      const response = await createLiveStream({ title: `${user.name}'s Live Stream` })

      console.log('[DEBUG] API Response Received:', response) // <-- LOG 3

      if (response && response.streamKey) {
        setStreamDetails({ streamKey: response.streamKey })
        setIsGoLiveModalOpen(true) // Modal ko open karein
        toast.success('Your stream is ready!', { id: goLiveToast })
      } else {
        // YEH BOHAT ZAROORI HAI
        console.error('[DEBUG] ERROR: Stream key not found in API response!', response)
        throw new Error('Stream key not found in API response.')
      }
    } catch (error) {
      // YEH BHI BOHAT ZAROORI HAI
      console.error('[DEBUG] Failed to create live stream in CATCH block:', error)
      toast.error('Could not start live stream. Please try again.', { id: goLiveToast })
    } finally {
      setIsCreatingStream(false)
    }
  }

  const profile = user.creatorProfile
  const bannerSrc = profile.bannerUrl || DEFAULT_BANNER

  return (
    // Fragment use karein kyunki ab hum component ke sath modal bhi return kar rahe hain
    <>
      <header className="rounded-t-2xl overflow-hidden">
        {/* Banner Section */}
        <div className="relative group bg-slate-900">
          <img
            src={bannerSrc}
            alt={`${profile.pageName}'s banner`}
            className="h-40 sm:h-48 md:h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={triggerBannerUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="h-4 w-4" />
              <span>{isUploading ? 'Uploading...' : 'Change Banner'}</span>
            </button>
          </div>
          <input
            type="file"
            ref={bannerInputRef}
            onChange={handleBannerFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
        </div>

        {/* Profile Info Section */}
        <div className="bg-slate-800 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-14 sm:-mt-16 md:-mt-20">
            <img
              src={user.creatorProfile.profileImageUrl || '/default-avatar.png'}
              alt={`${user.name}'s profile`}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full border-4 border-slate-800 object-cover shadow-lg"
            />
            <div className="flex-1 text-center md:text-left md:ml-6 mt-3 sm:mt-4 md:mt-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start text-sm text-sky-400 mt-1">
                <Link className="h-3 w-3 mr-1.5" />
                <span>{`vybzz.com/${profile.pageUrl}`}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 mt-4 md:mt-0 w-full md:w-auto">
              <button className="flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button className="flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Share2 className="h-4 w-4" /> Share
              </button>

              {/* Go Live Button with loading state */}
              <button
                onClick={handleGoLive}
                disabled={isCreatingStream}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Radio className="h-4 w-4" />
                {isCreatingStream ? 'Preparing...' : 'Go Live'}
              </button>

              <button className="flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors">
                <Plus className="h-4 w-4" /> Create
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-6 border-t border-slate-700 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#"
                className="px-3 py-1.5 sm:px-4 text-xs sm:text-sm bg-slate-700 rounded-full"
              >
                Home
              </a>
              <a
                href="#"
                className="px-3 py-1.5 sm:px-4 text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
              >
                Collections
              </a>
              <a
                href="#"
                className="px-3 py-1.5 sm:px-4 text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
              >
                Membership
              </a>
              <a
                href="#"
                className="px-3 py-1.5 sm:px-4 text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
              >
                About
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Go Live Modal yahan conditionally render hoga */}
      {isGoLiveModalOpen && streamDetails.streamKey && (
        <GoLiveModal
          streamKey={streamDetails.streamKey}
          onClose={() => setIsGoLiveModalOpen(false)}
        />
      )}
    </>
  )
}
