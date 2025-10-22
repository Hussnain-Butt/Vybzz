// src/components/creator/BannerCropModal.tsx

import React, { useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css' // Important styles for the cropper

interface BannerCropModalProps {
  imageSrc: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCropComplete: (croppedBlob: Blob) => void
}

// Helper function to extract the cropped image data
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  canvas: HTMLCanvasElement,
): Promise<Blob | null> {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  )

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      0.9,
    ) // Use high-quality JPEG
  })
}

export const BannerCropModal: React.FC<BannerCropModalProps> = ({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isLoading, setIsLoading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height),
      width,
      height,
    )
    setCrop(initialCrop)
  }

  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return
    setIsLoading(true)
    try {
      const croppedBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
        previewCanvasRef.current,
      )
      if (croppedBlob) {
        onCropComplete(croppedBlob)
        onOpenChange(false)
      }
    } catch (e) {
      console.error('Cropping failed', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 animate-fadeInUp">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Adjust your banner
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-400 mb-6">
              Drag to reposition the image. The highlighted area (16:9) will be your new banner.
            </Dialog.Description>
            {imageSrc && (
              <div className="bg-black/50 rounded-lg overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={16 / 9}
                  minWidth={300}
                  keepSelection={true}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    onLoad={onImageLoad}
                    style={{ maxHeight: '70vh' }}
                  />
                </ReactCrop>
              </div>
            )}
            <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => onOpenChange(false)}
                className="px-5 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                disabled={isLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition disabled:bg-slate-600"
              >
                {isLoading ? 'Saving...' : 'Save Banner'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
