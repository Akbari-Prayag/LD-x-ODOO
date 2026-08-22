import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Shield, Lock, Settings, Bookmark, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { selectCurrentUser } from '../../store/slices/authSlice.js'

import ProfileSidebar from './ProfileSidebar.jsx'
import ProfileInfo from './ProfileInfo.jsx'
import SecuritySettings from './SecuritySettings.jsx'
import Preferences from './Preferences.jsx'
import SavedDestinations from './SavedDestinations.jsx'
import DangerZone from './DangerZone.jsx'
import LiveProfilePreviewCard from './LiveProfilePreviewCard.jsx'

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser)
  const [activeTab, setActiveTab] = useState('info')
  const [liveFormData, setLiveFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    currency: user?.currency || 'INR',
    language: user?.language || 'en',
  })

  // Synchronize live preview on initial load or user change
  useEffect(() => {
    if (user) {
      setLiveFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        currency: user.currency || 'INR',
        language: user.language || 'en',
      })
    }
  }, [user])

  const handleLiveChange = (partial) => {
    setLiveFormData((prev) => ({ ...prev, ...partial }))
  }

  const handleProfileUpdated = (updatedUser) => {
    if (updatedUser) {
      setLiveFormData({
        name: updatedUser.name || '',
        avatar: updatedUser.avatar || '',
        currency: updatedUser.currency || 'INR',
        language: updatedUser.language || 'en',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1222] text-[#f0f8fb] font-sans pb-16 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#89c7e2] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Account & Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#d2e9ec]/70 font-light">
              Manage your personal details, credentials, preferences, and saved destinations.
            </p>
          </div>
        </div>

        {/* 3-Column Layout: Sidebar Navigation | Active Panel | Sticky Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Column 1: Vertical Tabs Navigation (3 cols) */}
          <div className="lg:col-span-3">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Column 2: Active Tab Panel (5 cols) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileInfo
                    user={user}
                    onProfileUpdated={handleProfileUpdated}
                    onLiveChange={handleLiveChange}
                  />
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SecuritySettings />
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Preferences
                    user={user}
                    onPreferencesUpdated={handleProfileUpdated}
                    onLiveChange={handleLiveChange}
                  />
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SavedDestinations user={user} />
                </motion.div>
              )}

              {activeTab === 'danger' && (
                <motion.div
                  key="danger"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <DangerZone />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Column 3: Sticky Live Profile Preview Card (4 cols) */}
          <div className="hidden lg:block lg:col-span-4">
            <LiveProfilePreviewCard formData={liveFormData} user={user} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
