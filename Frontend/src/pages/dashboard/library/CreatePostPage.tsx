// File: src/pages/dashboard/library/posts/CreatePostPage.tsx (COMPLETE AND FINAL UPDATED VERSION)

import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  X,
  Eye,
  Send,
  Video,
  Image as ImageIcon,
  Link2,
  Globe,
  Lock,
  ChevronRight,
  Plus,
  Bell,
  Package,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  Lightbulb,
  Trash2,
  MessageSquare,
  Tag,
  ChevronUp,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
  RemoveFormatting,
} from 'lucide-react'
import { gsap } from 'gsap'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'

// FIX: Sirf createNewPost import karein. uploadMediaFile ki ab zaroorat nahi.
import { createNewPost } from '../../../api/apiClient'

const lowlight = createLowlight(all)

// ==========================================================
// === Reusable Switch Component (No changes)             ===
// ==========================================================
const CustomSwitch = ({
  id,
  checked,
  onChange,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
}) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      className="sr-only peer"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div className="w-11 h-6 bg-[rgb(var(--color-surface-3))] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--color-primary-blue))]"></div>
  </label>
)

// ==========================================================
// === Emails and Notifications Modal Component (No changes) ===
// ==========================================================
const EmailsAndNotificationsModal = ({ onClose }: { onClose: () => void }) => {
  const [allowNotifications, setAllowNotifications] = useState(true)
  const [emailDisplay, setEmailDisplay] = useState('full')

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-[rgb(var(--color-background-dark))] w-full max-w-md m-4 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[rgb(var(--color-surface-2))] flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[rgb(var(--color-surface-2))] transition-colors"
          >
            <ChevronRight className="transform -rotate-180" size={24} />
          </button>
          <h2 className="text-lg font-semibold">Emails and notifications</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <label htmlFor="allow-notifications-switch" className="font-medium">
              Allow members to be notified when this post is published
            </label>
            <CustomSwitch
              id="allow-notifications-switch"
              checked={allowNotifications}
              onChange={setAllowNotifications}
            />
          </div>
          <div>
            <h3 className="font-medium mb-3">Email display</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="email-display"
                  value="preview"
                  checked={emailDisplay === 'preview'}
                  onChange={(e) => setEmailDisplay(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    emailDisplay === 'preview'
                      ? 'border-[rgb(var(--color-primary-blue))]'
                      : 'border-[rgb(var(--color-text-secondary))]'
                  }`}
                >
                  {emailDisplay === 'preview' && (
                    <span className="w-2.5 h-2.5 bg-[rgb(var(--color-primary-blue))] rounded-full"></span>
                  )}
                </span>
                <span>Show preview for all members</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="email-display"
                  value="full"
                  checked={emailDisplay === 'full'}
                  onChange={(e) => setEmailDisplay(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    emailDisplay === 'full'
                      ? 'border-[rgb(var(--color-primary-blue))]'
                      : 'border-[rgb(var(--color-text-secondary))]'
                  }`}
                >
                  {emailDisplay === 'full' && (
                    <span className="w-2.5 h-2.5 bg-[rgb(var(--color-primary-blue))] rounded-full"></span>
                  )}
                </span>
                <span>Show full post for members with access</span>
              </label>
            </div>
            <div className="flex items-start gap-3 mt-4 text-sm text-[rgb(var(--color-text-muted))]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-info flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>Controls cannot be adjusted for free posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================================
// === Add to Collection Modal Component (No changes)      ===
// ==========================================================
const AddToCollectionModal = ({
  onClose,
  onSelectionChange,
  initialSelectedIds,
}: {
  onClose: () => void
  onSelectionChange: (ids: string[]) => void
  initialSelectedIds: string[]
}) => {
  // NOTE: This data should come from the backend. It's static for now.
  const [collections, setCollections] = useState([
    {
      id: 'clxqvo9d0000008l3dsj0d20d',
      name: 'Growth Strategies',
      count: 12,
    },
    { id: 'clxqvo9d0000108l31m5y506z', name: 'Marketing Tips', count: 5 },
    { id: 'clxqvo9d0000208l34j6g2f9a', name: 'Case Studies', count: 8 },
  ])
  const [selectedCollections, setSelectedCollections] = useState<string[]>(initialSelectedIds)
  const [isCreating, setIsCreating] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  const handleToggleCollection = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((colId) => colId !== id) : [...prev, id],
    )
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: `new_${Date.now()}`,
        name: newCollectionName.trim(),
        count: 0,
      }
      setCollections([...collections, newCollection])
      setSelectedCollections([...selectedCollections, newCollection.id])
      setNewCollectionName('')
      setIsCreating(false)
    }
  }

  const handleDone = () => {
    onSelectionChange(selectedCollections)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-[rgb(var(--color-surface-1))] w-full max-w-lg m-4 rounded-xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[rgb(var(--color-surface-2))] flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add to collection</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[rgb(var(--color-surface-2))] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto">
          {isCreating ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name"
                className="w-full px-3 py-2 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] focus:border-[rgb(var(--color-primary-cyan))] focus:ring-0 outline-none transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary px-4 py-2 text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="btn-primary px-4 py-2 text-sm rounded-lg bg-[rgb(var(--color-primary-blue))] hover:bg-[rgb(var(--color-primary-cyan))] text-white"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 mb-4 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Create new collection</span>
            </button>
          )}
          <div className="space-y-2 mt-4">
            {collections.map((collection) => (
              <label
                key={collection.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[rgb(var(--color-surface-2))] cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium">{collection.name}</p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    {collection.count} posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCollections.includes(collection.id)}
                  onChange={() => handleToggleCollection(collection.id)}
                  className="h-5 w-5 rounded text-[rgb(var(--color-primary-blue))] bg-[rgb(var(--color-surface-3))] border-[rgb(var(--color-surface-3))] focus:ring-offset-0 focus:ring-0"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-[rgb(var(--color-surface-2))]">
          <button
            onClick={handleDone}
            className="w-full btn-primary px-4 py-2.5 text-sm rounded-lg bg-[rgb(var(--color-primary-blue))] hover:bg-[rgb(var(--color-primary-cyan))] text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================================
// === Tiptap Editor Component (No changes needed)   ===
// ==========================================================
const TiptapEditorComponent = ({
  editor,
  onFileSelect,
}: {
  editor: Editor | null
  onFileSelect: (file: File) => void
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) onFileSelect(file)
      event.target.value = ''
    },
    [onFileSelect],
  )

  const handleVideoSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) onFileSelect(file)
      event.target.value = ''
    },
    [onFileSelect],
  )

  const toggleLinkModal = useCallback(() => {
    if (!editor) return
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, ' ')
    setLinkText(text)
    setLinkUrl(editor.getAttributes('link').href || '')
    setIsLinkModalVisible(!isLinkModalVisible)
  }, [editor, isLinkModalVisible])

  const handleAddLink = useCallback(() => {
    if (editor && linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl, target: '_blank' })
        .run()
      if (linkText && !editor.state.selection.empty) {
        editor.chain().insertContent(linkText).run()
      }
      setIsLinkModalVisible(false)
      setLinkUrl('')
      setLinkText('')
    }
  }, [editor, linkUrl, linkText])

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return
    const url = prompt('Enter YouTube URL')
    if (url) {
      editor.commands.setYoutubeVideo({ src: url })
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    tooltip,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    tooltip: string
  }) => (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`p-2 rounded-md transition-colors ${
          isActive
            ? 'bg-[rgb(var(--color-primary-blue))] text-white'
            : 'hover:bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-secondary))]'
        }`}
      >
        {children}
      </button>
      <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
      </span>
    </div>
  )

  return (
    <div className="border border-[rgb(var(--color-surface-2))] rounded-lg shadow-sm">
      <div className="p-2 border-b border-[rgb(var(--color-surface-2))] flex items-center gap-1.5 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          tooltip="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          tooltip="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>
        <div className="w-px h-6 bg-[rgb(var(--color-surface-3))] mx-2"></div>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          tooltip="Bulleted List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          tooltip="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          tooltip="Quote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          tooltip="Code Block"
        >
          <Code size={18} />
        </ToolbarButton>
        <div className="w-px h-6 bg-[rgb(var(--color-surface-3))] mx-2"></div>
        <ToolbarButton onClick={toggleLinkModal} tooltip="Add Link">
          <Link2 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => imageInputRef.current?.click()} tooltip="Upload Image">
          <ImageIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => videoInputRef.current?.click()} tooltip="Upload Video">
          <Video size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutubeVideo} tooltip="Embed YouTube">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-youtube"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z" />
            <path d="m10 15 5-3-5-3z" />
          </svg>
        </ToolbarButton>
        <div className="w-px h-6 bg-[rgb(var(--color-surface-3))] mx-2"></div>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          tooltip="Clear Format"
        >
          <RemoveFormatting size={18} />
        </ToolbarButton>
      </div>
      {isLinkModalVisible && (
        <div className="p-4 bg-[rgb(var(--color-surface-1))] space-y-3">
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Link text (optional)"
            className="w-full px-3 py-2 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] focus:border-[rgb(var(--color-primary-cyan))] focus:ring-0 outline-none transition-colors"
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] focus:border-[rgb(var(--color-primary-cyan))] focus:ring-0 outline-none transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLinkModalVisible(false)}
              className="btn-secondary px-4 py-2 text-sm rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              className="btn-primary px-4 py-2 text-sm rounded-lg bg-[rgb(var(--color-primary-blue))] hover:bg-[rgb(var(--color-primary-cyan))] text-white"
            >
              Add Link
            </button>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoSelect}
        accept="video/*"
        className="hidden"
      />
    </div>
  )
}

// ==========================================================
// === Main CreatePostPage Component (FIXED LOGIC) ===
// ==========================================================
const CreatePostPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const headerMenuRef = useRef<HTMLDivElement>(null)

  const [title, setTitle] = useState('')
  const [audience, setAudience] = useState('free')
  const [isDrop, setIsDrop] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [publishDate, setPublishDate] = useState<Date | null>(new Date())
  const [allowComments, setAllowComments] = useState(true)
  const [tagList, setTagList] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // FIX: Yeh state ab saari files ko jama karegi jo upload honi hain.
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])

  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isMoreSettingsOpen, setIsMoreSettingsOpen] = useState(true)
  const [isEmailsModalOpen, setIsEmailsModalOpen] = useState(false)
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, history: true }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { target: '_blank' },
      }),
      Image.configure({
        inline: false,
        allowBase64: true, // Yeh local image preview foran dikhane mein madad karta hai
      }),
      Youtube.configure({
        nocookie: true,
        width: '100%',
        height: 'auto',
        modestBranding: true,
      }),
      Placeholder.configure({ placeholder: 'Start writing here...' }),
      Blockquote,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: ``,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none w-full min-h-[400px] bg-transparent text-lg text-[rgb(var(--color-text-secondary))] p-4 tiptap',
      },
    },
  })

  // FIX: Ab file select hone par foran upload nahi hogi.
  // Yeh function file ko jama karega aur editor mein preview dikhayega.
  const handleFileSelection = useCallback(
    (file: File) => {
      if (!editor) return

      // File ko 'filesToUpload' state mein add karein
      setFilesToUpload((prevFiles) => [...prevFiles, file])

      // Editor mein preview ke liye temporary (blob) URL banayein
      const tempUrl = URL.createObjectURL(file)

      // File type ke hisaab se editor mein content daalein
      if (file.type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: tempUrl }).run()
      } else if (file.type.startsWith('video/')) {
        editor
          .chain()
          .focus()
          .insertContent(
            `<video controls src="${tempUrl}" style="width: 100%; height: auto; border-radius: 8px;"></video><p></p>`,
          )
          .run()
      } else {
        toast.error('Only image and video files can be previewed.')
        // Ghalat file ko state se hata dein
        setFilesToUpload((prevFiles) => prevFiles.filter((f) => f !== file))
      }
    },
    [editor],
  )

  // FIX: 'Publish' function ab saara data (text + files) ek saath FormData mein bheje ga.
  const handlePublish = async () => {
    if (!editor) {
      toast.error('Editor is not ready yet.')
      return
    }
    if (!title.trim()) {
      toast.error('Post title is required!')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Publishing your post...')

    // Step 1: Naya FormData object banayein
    const formData = new FormData()

    // Step 2: Saare text fields ko append karein
    formData.append('title', title)
    formData.append('content', editor.getHTML())
    formData.append('audience', audience)
    formData.append('status', 'PUBLISHED')
    formData.append('isDrop', String(isDrop))
    formData.append('isScheduled', String(isScheduled))
    if (isScheduled && publishDate) {
      formData.append('publishDate', publishDate.toISOString())
    }
    formData.append('allowComments', String(allowComments))

    // Arrays ko JSON string banakar append karein (backend inko parse karega)
    formData.append('tags', JSON.stringify(tagList))
    formData.append('collectionIds', JSON.stringify(selectedCollectionIds))

    // Step 3: Jama ki hui saari files ko append karein
    filesToUpload.forEach((file) => {
      // Key 'media' backend ke multer.array('media') se match honi chahiye
      formData.append('media', file)
    })

    try {
      // Step 4: Poora FormData object API call mein bhej dein
      await createNewPost(formData)

      toast.dismiss(loadingToast)
      toast.success('Post published successfully!')
      setTimeout(() => navigate('/dashboard/library/posts'), 1500)
    } catch (error: any) {
      setIsLoading(false)
      toast.dismiss(loadingToast)
      console.error('Failed to publish post:', error)
      toast.error(error.response?.data?.error || 'An unexpected error occurred.')
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node))
        setIsHeaderMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = currentTag.trim()
      if (newTag && !tagList.includes(newTag) && tagList.length < 5) {
        setTagList([...tagList, newTag])
        setCurrentTag('')
      }
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTagList(tagList.filter((_, index) => index !== indexToRemove))
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-[rgb(var(--color-background-dark))]">
        Loading Editor...
      </div>
    )
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div
        ref={containerRef}
        className="fixed inset-0 bg-[rgb(var(--color-background-dark))] z-50 overflow-y-auto"
      >
        <div className="min-h-screen flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-[rgb(var(--color-surface-2))] sticky top-0 bg-[rgb(var(--color-background-dark))] z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-[rgb(var(--color-surface-2))] transition-colors"
              >
                <X size={24} />
              </button>
              <span className="text-sm text-[rgb(var(--color-text-muted))]">Draft</span>
            </div>
            <div className="flex items-center gap-3">
              <div ref={headerMenuRef} className="relative">
                <button
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="p-2 rounded-full hover:bg-[rgb(var(--color-surface-2))] transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
                {isHeaderMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-surface-2))] rounded-lg shadow-lg py-1 z-20">
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-3))]"
                    >
                      <Lightbulb size={16} /> Revisit tips
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-pink-400 hover:bg-[rgb(var(--color-surface-3))]"
                    >
                      <Trash2 size={16} /> Delete draft
                    </a>
                  </div>
                )}
              </div>
              <button className="btn-secondary px-4 py-2 text-sm rounded-lg flex items-center gap-2">
                <Eye size={18} /> Preview post
              </button>
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="btn-primary px-4 py-2 text-sm rounded-lg flex items-center gap-2 bg-[rgb(var(--color-primary-blue))] hover:bg-[rgb(var(--color-primary-cyan))] text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                {isLoading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </header>

          <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
            <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-4xl sm:text-5xl font-bold placeholder:text-[rgb(var(--color-text-muted))] focus:outline-none mb-4"
              />
              <TiptapEditorComponent editor={editor} onFileSelect={handleFileSelection} />
            </div>

            <aside className="w-full lg:col-span-1 xl:col-span-1 space-y-6">
              <div className="p-4 bg-[rgb(var(--color-surface-1))] rounded-lg">
                <h3 className="font-semibold mb-4">Audience</h3>
                <div className="space-y-3">
                  <div
                    onClick={() => setAudience('free')}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      audience === 'free'
                        ? 'border-[rgb(var(--color-primary-blue))] bg-[rgba(var(--color-primary-blue),0.1)]'
                        : 'border-[rgb(var(--color-surface-3))] hover:border-[rgb(var(--color-surface-2))]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={20} />
                      <div>
                        <p className="font-medium">Free access</p>
                        <p className="text-xs text-[rgb(var(--color-text-muted))]">
                          Everyone can access this post.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        audience === 'free'
                          ? 'border-[rgb(var(--color-primary-blue))]'
                          : 'border-[rgb(var(--color-text-secondary))]'
                      }`}
                    >
                      {audience === 'free' && (
                        <div className="w-2.5 h-2.5 bg-[rgb(var(--color-primary-blue))] rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div
                    onClick={() => setAudience('paid')}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      audience === 'paid'
                        ? 'border-[rgb(var(--color-primary-blue))] bg-[rgba(var(--color-primary-blue),0.1)]'
                        : 'border-[rgb(var(--color-surface-3))] hover:border-[rgb(var(--color-surface-2))]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={20} />
                      <div>
                        <p className="font-medium">Paid access</p>
                        <p className="text-xs text-[rgb(var(--color-text-muted))]">
                          Only for paid members.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        audience === 'paid'
                          ? 'border-[rgb(var(--color-primary-blue))]'
                          : 'border-[rgb(var(--color-text-secondary))]'
                      }`}
                    >
                      {audience === 'paid' && (
                        <div className="w-2.5 h-2.5 bg-[rgb(var(--color-primary-blue))] rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
                <button className="w-full text-sm text-left mt-3 p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] rounded-md flex justify-between items-center">
                  <span>More options</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="p-4 bg-[rgb(var(--color-surface-1))] rounded-lg">
                <button
                  onClick={() => setIsCollectionModalOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors duration-200"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">Add to collection</span>
                </button>
              </div>

              <div className="p-4 bg-[rgb(var(--color-surface-1))] rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Package size={16} /> Make this a drop
                    </h4>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                      Create a unique, collectible version.
                    </p>
                  </div>
                  <CustomSwitch id="drop-switch" checked={isDrop} onChange={setIsDrop} />
                </div>
                <div className="w-full h-px bg-[rgb(var(--color-surface-2))]"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Calendar size={16} /> Set publish date
                    </h4>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                      Schedule this post for a future date.
                    </p>
                  </div>
                  <CustomSwitch
                    id="schedule-switch"
                    checked={isScheduled}
                    onChange={setIsScheduled}
                  />
                </div>
                <div className="w-full h-px bg-[rgb(var(--color-surface-2))]"></div>
                <button
                  onClick={() => setIsEmailsModalOpen(true)}
                  className="w-full text-sm text-left p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] rounded-md flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span>Emails and notifications</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="p-4 bg-[rgb(var(--color-surface-1))] rounded-lg">
                <button
                  onClick={() => setIsMoreSettingsOpen(!isMoreSettingsOpen)}
                  className="w-full flex justify-between items-center font-semibold"
                >
                  More settings
                  {isMoreSettingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isMoreSettingsOpen ? 'max-h-96 mt-4' : 'max-h-0'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="comments-switch"
                        className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                      >
                        <MessageSquare size={16} /> Allow comments
                      </label>
                      <CustomSwitch
                        id="comments-switch"
                        checked={allowComments}
                        onChange={setAllowComments}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tags-input"
                        className="flex items-center gap-2 font-medium text-sm mb-2"
                      >
                        <Tag size={16} /> Add tags
                      </label>
                      <input
                        id="tags-input"
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Start typing and press Enter..."
                        disabled={tagList.length >= 5}
                        className="w-full px-3 py-2 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] focus:border-[rgb(var(--color-primary-cyan))] focus:ring-0 outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tagList.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-primary))] text-xs font-semibold px-2.5 py-1 rounded-full"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => handleRemoveTag(index)}
                              className="text-[rgb(var(--color-text-muted))] hover:text-white transition-colors"
                              aria-label={`Remove ${tag} tag`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
      {isEmailsModalOpen && (
        <EmailsAndNotificationsModal onClose={() => setIsEmailsModalOpen(false)} />
      )}
      {isCollectionModalOpen && (
        <AddToCollectionModal
          onClose={() => setIsCollectionModalOpen(false)}
          onSelectionChange={setSelectedCollectionIds}
          initialSelectedIds={selectedCollectionIds}
        />
      )}
    </>
  )
}

export default CreatePostPage
