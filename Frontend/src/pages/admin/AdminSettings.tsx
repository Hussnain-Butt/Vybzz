import React, { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import {
  FiSettings,
  FiShield,
  FiBell,
  FiCode,
  FiAlertTriangle,
  FiCheckCircle,
} from 'react-icons/fi'
import { FaPalette } from 'react-icons/fa'

// Settings data structure
interface AppSettings {
  general: {
    siteName: string
    maintenanceMode: boolean
  }
  appearance: {
    theme: 'dark' | 'light'
    accentColor: string
  }
  security: {
    enable2FA: boolean
    passwordPolicy: 'simple' | 'medium' | 'strong'
  }
}

// Initial dummy settings
const initialSettings: AppSettings = {
  general: {
    siteName: 'Vybzz',
    maintenanceMode: false,
  },
  appearance: {
    theme: 'dark',
    accentColor: 'rgb(var(--color-primary-blue))',
  },
  security: {
    enable2FA: true,
    passwordPolicy: 'medium',
  },
}

const settingsTabs = [
  { id: 'general', name: 'General', icon: <FiSettings /> },
  { id: 'appearance', name: 'Appearance', icon: <FaPalette /> },
  { id: 'security', name: 'Security', icon: <FiShield /> },
  { id: 'notifications', name: 'Notifications', icon: <FiBell /> },
  { id: 'integrations', name: 'Integrations', icon: <FiCode /> },
  { id: 'advanced', name: 'Advanced', icon: <FiAlertTriangle /> },
]

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<AppSettings>(initialSettings)
  const [showToast, setShowToast] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Animate page on load
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power3.out' },
    )
  }, [])

  // Animate content when tab changes
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
    }
  }, [activeTab])

  const handleSave = () => {
    console.log('Saving settings:', settings)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <SettingsCard
            title="General Settings"
            description="Update your site's basic information."
          >
            <InputField
              label="Site Name"
              value={settings.general.siteName}
              onChange={(val) =>
                setSettings((s) => ({ ...s, general: { ...s.general, siteName: val } }))
              }
            />
            <ToggleSwitch
              label="Maintenance Mode"
              enabled={settings.general.maintenanceMode}
              onChange={(val) =>
                setSettings((s) => ({ ...s, general: { ...s.general, maintenanceMode: val } }))
              }
              description="Temporarily take your site offline for visitors."
            />
          </SettingsCard>
        )
      case 'appearance':
        return (
          <SettingsCard title="Appearance" description="Customize how your platform looks.">
            {/* Theme selection to be implemented */}
            <p className="text-[rgb(var(--color-text-secondary))]">
              Theme and color options will be available here.
            </p>
          </SettingsCard>
        )
      case 'security':
        return (
          <SettingsCard title="Security" description="Manage your platform's security features.">
            <ToggleSwitch
              label="Enable Two-Factor Authentication (2FA)"
              enabled={settings.security.enable2FA}
              onChange={(val) =>
                setSettings((s) => ({ ...s, security: { ...s.security, enable2FA: val } }))
              }
            />
            {/* Password policy to be implemented */}
          </SettingsCard>
        )
      case 'advanced':
        return (
          <SettingsCard
            title="Danger Zone"
            description="These actions are permanent and cannot be undone."
            isDanger
          >
            <div className="flex justify-between items-center p-4 border border-transparent rounded-lg hover:border-red-500/50 hover:bg-red-500/10">
              <div>
                <p className="font-semibold text-white">Clear System Cache</p>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">
                  This will clear all cached data on the server.
                </p>
              </div>
              <button className="bg-red-600/80 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600">
                Clear Cache
              </button>
            </div>
          </SettingsCard>
        )
      default:
        return (
          <SettingsCard
            title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings`}
            description={`Settings for ${activeTab} are not yet implemented.`}
          ></SettingsCard>
        )
    }
  }

  return (
    <div ref={containerRef} className="p-4 md:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fadeIn">
          <FiCheckCircle /> Settings saved successfully!
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">System Settings</h1>
        <p className="text-lg text-[rgb(var(--color-text-secondary))] mt-1">
          Configure system-wide settings.
        </p>
      </div>

      {/* Main Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <ul className="space-y-2 bg-[rgb(var(--color-surface-1))] p-4 rounded-xl">
            {settingsTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[rgb(var(--color-primary-blue))] text-white'
                      : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                  }`}
                >
                  {React.cloneElement(tab.icon, { size: 20 })}
                  <span className="font-semibold">{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <div ref={contentRef}>{renderContent()}</div>
          {/* Global Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-[rgb(var(--color-primary-cyan))] text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save All Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

// --- Reusable Sub-components ---

const SettingsCard = ({
  title,
  description,
  children,
  isDanger = false,
}: {
  title: string
  description: string
  children: React.ReactNode
  isDanger?: boolean
}) => (
  <div
    className={`bg-[rgb(var(--color-surface-1))] rounded-xl shadow-lg ${
      isDanger ? 'border border-red-500/30' : ''
    }`}
  >
    <div className="p-6 border-b border-[rgb(var(--color-surface-2))]">
      <h2 className={`text-2xl font-bold ${isDanger ? 'text-red-400' : 'text-white'}`}>{title}</h2>
      <p className="text-md text-[rgb(var(--color-text-secondary))] mt-1">{description}</p>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
)

const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) => (
  <div>
    <label className="block text-md font-semibold text-white mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[rgb(var(--color-surface-2))] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))]"
    />
  </div>
)

const ToggleSwitch = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description?: string
  enabled: boolean
  onChange: (val: boolean) => void
}) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="text-md font-semibold text-white">{label}</p>
      {description && <p className="text-sm text-[rgb(var(--color-text-muted))]">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
        enabled ? 'bg-[rgb(var(--color-primary-blue))]' : 'bg-[rgb(var(--color-surface-3))]'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

export default AdminSettings
