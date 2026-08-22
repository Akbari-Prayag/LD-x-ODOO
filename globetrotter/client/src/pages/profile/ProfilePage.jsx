import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { selectCurrentUser, updateProfile } from '../../store/slices/authSlice.js'
import api from '../../services/api.js'

import ProfileSidebar from './ProfileSidebar.jsx'
import ProfileInfo from './ProfileInfo.jsx'
import SecuritySettings from './SecuritySettings.jsx'
import Preferences from './Preferences.jsx'
import SavedDestinations from './SavedDestinations.jsx'
import DangerZone from './DangerZone.jsx'
import LiveProfilePreviewCard from './LiveProfilePreviewCard.jsx'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const [activeTab, setActiveTab] = useState('info')
  const [liveFormData, setLiveFormData] = useState({
    name: user?.name,
    avatar: user?.avatar,
    currency: user?.currency,
    language: user?.language,
  })

  // Synchronize live preview on initial load or user change
  useEffect(() => {
    if (user) {
      setLiveFormData({
        name: user.name,
        avatar: user.avatar,
        currency: user.currency,
        language: user.language,
      })
    }
  }, [user])

  const handleLiveChange = (partial) => {
    setLiveFormData((prev) => ({ ...prev, ...partial }))
  }

  const handleProfileUpdated = (updatedUser) => {
    setLiveFormData({
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      currency: updatedUser.currency,
      language: updatedUser.language,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12 max-w-7xl mx-auto"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 dark:border-surface-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ocean-600 dark:text-ocean-400 mb-1">
            <Link to="/dashboard" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
            Account & Settings
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            Manage your personal profile, security credentials, preferences, and saved destinations
          </p>
        </div>
      </div>

      {/* 3-Column Layout: Sidebar Navigation | Active Panel | Sticky Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Column 1: Vertical Tabs Navigation */}
        <div className="lg:col-span-3">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Column 2: Active Tab Panel with AnimatePresence */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <SecuritySettings />
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <SavedDestinations user={user} />
              </motion.div>
            )}

            {activeTab === 'danger' && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <DangerZone />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Column 3: Sticky Live Profile Preview Card */}
        <div className="hidden lg:block lg:col-span-4">
          <LiveProfilePreviewCard
            formData={liveFormData}
            user={user}
          />
        </div>
      </div>
    </motion.div>
  )
}
