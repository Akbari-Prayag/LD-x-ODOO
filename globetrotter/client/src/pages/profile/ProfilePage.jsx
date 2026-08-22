import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCredentials } from '../../store/slices/authSlice.js'
import api from '../../services/api.js'

import ProfileSidebar from './ProfileSidebar.jsx'
import ProfileInfo from './ProfileInfo.jsx'
import SecuritySettings from './SecuritySettings.jsx'
import Preferences from './Preferences.jsx'
import SavedDestinations from './SavedDestinations.jsx'
import DangerZone from './DangerZone.jsx'
import LoadingPage from '../../components/ui/LoadingPage.jsx'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const reduxUser = useSelector(selectCurrentUser)
  const [activeTab, setActiveTab] = useState('info')
  const [userProfile, setUserProfile] = useState(reduxUser)
  const [loading, setLoading] = useState(false)

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/users/profile')
      if (data.success && data.user) {
        setUserProfile(data.user)
      }
    } catch (err) {
      console.error('Failed to fetch fresh user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleProfileUpdated = (updatedUser) => {
    setUserProfile(updatedUser)
  }

  if (loading && !userProfile) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900">
          Account Settings
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Manage your personal details, login security, and travel preferences.
        </p>
      </div>

      {/* Main Settings Body */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Sidebar */}
        <ProfileSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Tab Content Panel */}
        <div className="flex-1 w-full min-w-0">
          {activeTab === 'info' && (
            <ProfileInfo
              user={userProfile}
              onProfileUpdated={handleProfileUpdated}
            />
          )}

          {activeTab === 'security' && <SecuritySettings />}

          {activeTab === 'preferences' && (
            <Preferences
              user={userProfile}
              onPreferencesUpdated={handleProfileUpdated}
            />
          )}

          {activeTab === 'saved' && <SavedDestinations />}

          {activeTab === 'danger' && <DangerZone />}
        </div>
      </div>
    </div>
  )
}
