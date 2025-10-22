// src/components/creator/OnboardingModal.tsx
import React, { useState, useCallback, Fragment } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Image as ImageIcon, FileText, Sparkles, MonitorUp } from 'lucide-react'
import { updateDetails, uploadImages } from '../../api/apiClient' // API functions

// Define the CreatorProfile type for clarity
interface CreatorProfile {
  profileImageUrl?: string | null
  bannerUrl?: string | null
  bio?: string | null
  onboardingStep: number
  [key: string]: any // For other properties
}

// StepIndicator has been slightly restyled for a more elegant look
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="flex justify-center items-center space-x-2.5 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out ${
          index + 1 === currentStep
            ? 'bg-sky-400 transform scale-150 shadow-lg shadow-sky-400/30'
            : 'bg-slate-600'
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
      onNext() // Go to next step even if no image is selected
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('profileImage', profileImage)
    try {
      await uploadImages(formData)
      // IMPORTANT: Update onboarding step to 3 for the new cover photo step
      await updateDetails({ onboardingStep: 3 })
      onNext()
    } catch (error) {
      console.error('Profile photo upload failed', error)
      alert('Failed to upload profile photo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-2" />
      <h3 className="text-xl font-semibold text-white">Add a Profile Photo</h3>
      <p className="mt-2 text-sm text-slate-400">
        Your fans want to see you! A great photo helps build trust.
      </p>
      <div className="mt-6 flex justify-center">
        <label htmlFor="profile-upload" className="cursor-pointer group">
          <div className="w-32 h-32 rounded-full bg-slate-700/50 border-2 border-dashed border-slate-600 group-hover:border-sky-500 transition-colors flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-500 text-xs px-4">Click to upload</span>
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
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={onNext}
          className="text-sm font-medium text-slate-400 hover:text-white transition"
        >
          Skip for now
        </button>
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-slate-600 transition-all shadow-md shadow-sky-500/10"
        >
          {isLoading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

// === NEW STEP ADDED HERE ===
const Step2_CoverPhoto: React.FC<{ onNext: () => void; userProfile: CreatorProfile }> = ({
  onNext,
  userProfile,
}) => {
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(userProfile.bannerUrl || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!bannerImage) {
      onNext()
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('bannerImage', bannerImage) // Use 'bannerImage' key
    try {
      await uploadImages(formData)
      // Update onboarding step to 4 for the description step
      await updateDetails({ onboardingStep: 4 })
      onNext()
    } catch (error) {
      console.error('Banner upload failed', error)
      alert('Failed to upload cover photo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      <MonitorUp className="mx-auto h-12 w-12 text-slate-400 mb-2" />
      <h3 className="text-xl font-semibold text-white">Set a Cover Photo</h3>
      <p className="mt-2 text-sm text-slate-400">
        This is the first thing people see. Make a great impression!
      </p>
      <div className="mt-6 flex justify-center">
        <label
          htmlFor="banner-upload"
          className="cursor-pointer group w-full aspect-[16/6] rounded-lg bg-slate-700/50 border-2 border-dashed border-slate-600 hover:border-sky-500 transition-colors flex items-center justify-center overflow-hidden"
        >
          {preview ? (
            <img src={preview} alt="Banner preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-8 w-8 text-slate-500 mb-2" />
              <span className="text-slate-500 text-xs">Click to upload (1500x500 recommended)</span>
            </div>
          )}
        </label>
        <input
          id="banner-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={onNext}
          className="text-sm font-medium text-slate-400 hover:text-white transition"
        >
          Skip for now
        </button>
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-slate-600 transition-all shadow-md shadow-sky-500/10"
        >
          {isLoading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

const Step3_DescribePage: React.FC<{ onNext: () => void; userProfile: CreatorProfile }> = ({
  onNext,
  userProfile,
}) => {
  const [bio, setBio] = useState(userProfile.bio || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Update onboarding step to 5 for the final step
      await updateDetails({ bio, onboardingStep: 5 })
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
      <FileText className="mx-auto h-12 w-12 text-slate-400 mb-2" />
      <h3 className="text-xl font-semibold text-white">Describe Your Page</h3>
      <p className="mt-2 text-sm text-slate-400">
        Tell everyone what you're creating. What can they expect?
      </p>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        maxLength={300}
        placeholder="e.g., I create weekly podcasts about indie music and share behind-the-scenes content..."
        className="mt-6 w-full bg-slate-900/70 border border-slate-700 rounded-md p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
      />
      <p className="text-right text-xs text-slate-500 mt-1">{bio.length} / 300</p>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading || bio.length < 10}
          className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-md shadow-sky-500/10"
        >
          {isLoading ? 'Saving...' : 'Finish Setup'}
        </button>
      </div>
    </div>
  )
}

const Step4_Final: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
      <Sparkles className="mx-auto h-16 w-16 text-yellow-400" />
      <h3 className="mt-4 text-2xl font-bold text-white">You're all set!</h3>
      <p className="mt-2 text-base text-slate-300">
        Your creator page is ready. You can now start creating posts and setting up membership
        tiers.
      </p>
      <div className="mt-8">
        <button
          onClick={handlePublish}
          className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20"
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
  const totalSteps = 4 // Now there are 4 steps in total

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps + 1))
  }, [totalSteps])

  const handleClose = () => {
    onFinished()
    onOpenChange(false)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return <Step1_ProfilePhoto onNext={handleNext} userProfile={userProfile} />
      case 3: // New cover photo step
        return <Step2_CoverPhoto onNext={handleNext} userProfile={userProfile} />
      case 4: // Description step is now #4
        return <Step3_DescribePage onNext={handleNext} userProfile={userProfile} />
      case 5: // Final step is now #5
        return <Step4_Final onClose={handleClose} />
      default: // Fallback
        return <Step4_Final onClose={handleClose} />
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl shadow-black/30 p-6 sm:p-8 backdrop-blur-xl animate-fadeInUp">
            <Dialog.Title className="sr-only">Creator Setup</Dialog.Title>
            <Dialog.Description className="sr-only">
              Complete these steps to launch your page.
            </Dialog.Description>

            {currentStep <= totalSteps && (
              <StepIndicator currentStep={currentStep - 1} totalSteps={totalSteps} />
            )}

            {renderStep()}

            {currentStep <= totalSteps && (
              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </Dialog.Close>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
