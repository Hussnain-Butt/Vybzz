// src/components/creator/CreatorHeader.tsx

import React, { useState, useRef } from 'react'
import { Camera, Eye, Link, Plus, Share2 } from 'lucide-react'
import { uploadImages } from '../../api/apiClient' // API function for uploading
import { toast } from 'react-hot-toast' // For showing success/error messages

// Define the shape of the profile data for type safety
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

// A default banner image in case the user hasn't uploaded one
const DEFAULT_BANNER = '/default-banner.png' // Make sure you have a default image in your public folder

export const CreatorHeader: React.FC<CreatorHeaderProps> = ({ user, onProfileUpdate }) => {
  const [isUploading, setIsUploading] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement>(null)

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
        // Update the parent component's state with the new URL
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

  // Function to trigger the hidden file input
  const triggerBannerUpload = () => {
    bannerInputRef.current?.click()
  }

  const profile = user.creatorProfile
  const bannerSrc = profile.bannerUrl || DEFAULT_BANNER

  return (
    <header className="rounded-t-2xl overflow-hidden">
      {/* Banner Section */}
      <div className="relative group bg-slate-900">
        <img
          src={bannerSrc}
          alt={`${profile.pageName}'s banner`}
          className="h-48 md:h-64 w-full object-cover"
        />
        {/* Hover Overlay with Upload Button */}
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
        {/* Hidden file input for banner upload */}
        <input
          type="file"
          ref={bannerInputRef}
          onChange={handleBannerFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
      </div>

      {/* Profile Info Section */}
      <div className="bg-slate-800 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20">
          <img
            src={user.creatorProfile.profileImageUrl || '/default-avatar.png'}
            alt={`${user.name}'s profile`}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-slate-800 object-cover shadow-lg"
          />
          <div className="flex-1 text-center md:text-left md:ml-6 mt-4 md:mt-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start text-sm text-sky-400 mt-1">
              <Link className="h-3 w-3 mr-1.5" />
              <span>{`vybzz.com/${profile.pageUrl}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <Eye className="h-4 w-4" /> Preview
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-slate-900 font-semibold hover:bg-slate-200 rounded-lg transition-colors">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors">
              <Plus className="h-4 w-4" /> Create
            </button>
          </div>
        </div>
        {/* Navigation Tabs */}
        <nav className="mt-6 border-t border-slate-700 pt-4">
          <div className="flex items-center gap-2">
            <a href="#" className="px-4 py-1.5 text-sm bg-slate-700 rounded-full">
              Home
            </a>
            <a
              href="#"
              className="px-4 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
            >
              Collections
            </a>
            <a
              href="#"
              className="px-4 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
            >
              Membership
            </a>
            <a
              href="#"
              className="px-4 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
            >
              About
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
