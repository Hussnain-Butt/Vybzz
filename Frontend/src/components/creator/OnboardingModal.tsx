// src/components/creator/OnboardingModal.tsx
import React, { useState, useCallback, Fragment } from 'react' // Fragment ko import karein
import * as Dialog from '@radix-ui/react-dialog'
import { X, Image as ImageIcon, FileText, Sparkles } from 'lucide-react'
import { updateDetails, uploadImages } from '../../api/apiClient' // API functions

// Note: CreatorProfile type ko yahan import ya define karna zaroori hai
interface CreatorProfile {
  profileImageUrl?: string | null
  bio?: string | null
  onboardingStep: number
  [key: string]: any // Baaki properties ke liye
}

// Helper components (Koi badlav nahi)
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="flex justify-center items-center space-x-2 mb-6">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          index + 1 === currentStep ? 'bg-sky-400 scale-125' : 'bg-slate-600'
        }`}
      />
    ))}
  </div>
)

const Step1_ProfilePhoto: React.FC<{ onNext: () => void; userProfile: CreatorProfile }> = ({
  onNext,
  userProfile,
}) => {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(userProfile.profileImageUrl || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!profileImage) {
      onNext()
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('profileImage', profileImage)
    try {
      await uploadImages(formData)
      await updateDetails({ onboardingStep: 3 })
      onNext()
    } catch (error) {
      console.error('Upload failed', error)
      alert('Failed to upload image.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-2 text-xl font-semibold text-white">Add a profile photo</h3>
      <p className="mt-2 text-sm text-slate-400">
        Your fans want to see you! A great photo helps build trust.
      </p>
      <div className="mt-6 flex justify-center">
        <label htmlFor="profile-upload" className="cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-slate-700 border-2 border-dashed border-slate-500 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-500 text-xs">Click to upload</span>
            )}
          </div>
        </label>
        <input
          id="profile-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button onClick={onNext} className="text-sm text-slate-400 hover:text-white transition">
          Skip for now
        </button>
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-md hover:bg-sky-600 disabled:bg-slate-600"
        >
          {isLoading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

const Step2_DescribePage: React.FC<{ onNext: () => void; userProfile: CreatorProfile }> = ({
  onNext,
  userProfile,
}) => {
  const [bio, setBio] = useState(userProfile.bio || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateDetails({ bio, onboardingStep: 4 })
      onNext()
    } catch (error) {
      console.error('Failed to save bio', error)
      alert('Could not save your description.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      <FileText className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-2 text-xl font-semibold text-white">Describe your page</h3>
      <p className="mt-2 text-sm text-slate-400">
        Tell everyone what you're creating. What can they expect?
      </p>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        maxLength={300}
        placeholder="e.g., I create weekly podcasts about indie music and share behind-the-scenes content..."
        className="mt-6 w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
      ></textarea>
      <p className="text-right text-xs text-slate-500 mt-1">{bio.length} / 300</p>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading || bio.length < 10}
          className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-md hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Finish Setup'}
        </button>
      </div>
    </div>
  )
}

const Step3_Final: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const handlePublish = async () => {
    try {
      await updateDetails({ status: 'ACTIVE' })
      onClose()
    } catch (error) {
      console.error('Failed to publish', error)
      alert('Could not publish your page. Please try again.')
    }
  }
  return (
    <div className="text-center">
      <Sparkles className="mx-auto h-12 w-12 text-yellow-400" />
      <h3 className="mt-2 text-2xl font-bold text-white">You're all set!</h3>
      <p className="mt-2 text-sm text-slate-300">
        Your creator page is ready. You can now start creating posts and setting up membership
        tiers.
      </p>
      <div className="mt-8">
        <button
          onClick={handlePublish}
          className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition"
        >
          Publish My Page & Go to Dashboard
        </button>
      </div>
    </div>
  )
}

interface OnboardingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userProfile: CreatorProfile
  onFinished: () => void
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  onOpenChange,
  userProfile,
  onFinished,
}) => {
  const [currentStep, setCurrentStep] = useState(userProfile.onboardingStep || 2)
  const totalSteps = 3

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps + 1))
  }, [])

  const handleClose = () => {
    onFinished()
    onOpenChange(false)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return <Step1_ProfilePhoto onNext={handleNext} userProfile={userProfile} />
      case 3:
        return <Step2_DescribePage onNext={handleNext} userProfile={userProfile} />
      case 4:
        return <Step3_Final onClose={handleClose} />
      default:
        return <Step3_Final onClose={handleClose} />
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* === UPDATED PART START === */}
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4" // Step 1: Poori screen par failayein aur flex center karein
        >
          <div
            className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8 animate-fadeIn" // Step 2: Yeh aapka asli modal panel hai
          >
            <Dialog.Title className="text-lg font-medium text-white sr-only">
              Creator Setup
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Complete these steps to launch your page.
            </Dialog.Description>

            {currentStep <= totalSteps && (
              <StepIndicator currentStep={currentStep - 1} totalSteps={totalSteps} />
            )}

            {renderStep()}

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
        {/* === UPDATED PART END === */}
      </Dialog.Portal>
    </Dialog.Root>
  )
}
