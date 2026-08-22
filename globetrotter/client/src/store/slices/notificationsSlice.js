import { createSlice } from '@reduxjs/toolkit'
import { fetchTrips } from './tripsSlice.js'

// ── LocalStorage persistence ─────────────────────────────────────────
const LS_READ_KEY      = 'gt_notif_readMap'
const LS_DISMISS_KEY   = 'gt_notif_dismissed'

function loadReadMap() {
  try { return JSON.parse(localStorage.getItem(LS_READ_KEY) || '{}') } catch { return {} }
}
function saveReadMap(map) {
  try { localStorage.setItem(LS_READ_KEY, JSON.stringify(map)) } catch {}
}
function loadDismissed() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_DISMISS_KEY) || '[]')) } catch { return new Set() }
}
function saveDismissed(set) {
  try { localStorage.setItem(LS_DISMISS_KEY, JSON.stringify([...set])) } catch {}
}

// ── Helpers ─────────────────────────────────────────────────────────
function daysFromToday(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

function timeAgo(isoStr) {
  if (!isoStr) return 'Just now'
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

/**
 * Derive a list of notification objects from a list of trips.
 * We preserve existing `readAt` timestamps so marking as read is sticky.
 */
function deriveNotifications(trips, existingMap = {}) {
  const notifs = []
  const now = new Date().toISOString()

  trips.forEach((trip) => {
    const id = trip.id || trip._id
    const days = daysFromToday(trip.startDate)
    const endDays = daysFromToday(trip.endDate)

    // ─ Trip starting very soon (≤3 days)
    if (days !== null && days >= 0 && days <= 3 && trip.status !== 'completed') {
      const nid = `trip-soon-${id}`
      notifs.push({
        id: nid,
        type: 'upcoming',
        icon: 'plane',
        title: days === 0 ? `Today! "${trip.name}" starts` : `"${trip.name}" starts in ${days} day${days === 1 ? '' : 's'}`,
        body: `Get ready — your trip to ${trip.name} is almost here!`,
        link: `/trips/${id}`,
        createdAt: trip.updatedAt || trip.createdAt || now,
        readAt: existingMap[nid]?.readAt || null,
      })
    }

    // ─ Trip starting within 7–14 days
    if (days !== null && days > 3 && days <= 14 && trip.status !== 'completed') {
      const nid = `trip-week-${id}`
      notifs.push({
        id: nid,
        type: 'reminder',
        icon: 'calendar',
        title: `Upcoming: "${trip.name}" in ${days} days`,
        body: `Start finalising your itinerary and budget for this trip.`,
        link: `/trips/${id}`,
        createdAt: trip.updatedAt || trip.createdAt || now,
        readAt: existingMap[nid]?.readAt || null,
      })
    }

    // ─ Trip is currently ongoing
    if (trip.status === 'ongoing') {
      const nid = `trip-ongoing-${id}`
      notifs.push({
        id: nid,
        type: 'ongoing',
        icon: 'map',
        title: `You're on a trip: "${trip.name}"`,
        body: endDays !== null && endDays > 0
          ? `${endDays} day${endDays === 1 ? '' : 's'} remaining. Have a great journey!`
          : `Trip ends today — safe travels!`,
        link: `/trips/${id}`,
        createdAt: trip.updatedAt || trip.createdAt || now,
        readAt: existingMap[nid]?.readAt || null,
      })
    }

    // ─ Trip was recently completed (within 7 days)
    if (trip.status === 'completed' && endDays !== null && endDays >= -7 && endDays < 0) {
      const nid = `trip-done-${id}`
      notifs.push({
        id: nid,
        type: 'completed',
        icon: 'check',
        title: `"${trip.name}" completed!`,
        body: `Hope you had an amazing time. Add memories and photos to your journal.`,
        link: `/trips/${id}`,
        createdAt: trip.updatedAt || trip.createdAt || now,
        readAt: existingMap[nid]?.readAt || null,
      })
    }

    // ─ New trip just created (planning status, within 24h)
    if (trip.status === 'planning' && trip.createdAt) {
      const hoursOld = (Date.now() - new Date(trip.createdAt).getTime()) / 3600000
      if (hoursOld < 48) {
        const nid = `trip-new-${id}`
        notifs.push({
          id: nid,
          type: 'new',
          icon: 'plus',
          title: `New trip created: "${trip.name}"`,
          body: `Start building your itinerary and set your budget goals.`,
          link: `/trips/${id}`,
          createdAt: trip.createdAt,
          readAt: existingMap[nid]?.readAt || null,
        })
      }
    }
  })

  // Sort: unread first, then by createdAt desc
  notifs.sort((a, b) => {
    if (!!a.readAt !== !!b.readAt) return a.readAt ? 1 : -1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return notifs
}

// ── Slice ────────────────────────────────────────────────────────────
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list:        [],
    readMap:     loadReadMap(),      // ← restored from localStorage on boot
    dismissed:   [...loadDismissed()], // stored as array (Set is not serialisable)
  },
  reducers: {
    /** Mark a single notification as read */
    markRead(state, { payload: id }) {
      const n = state.list.find((x) => x.id === id)
      if (n && !n.readAt) {
        n.readAt = new Date().toISOString()
        state.readMap[id] = { readAt: n.readAt }
        saveReadMap(state.readMap)          // ← persist immediately
      }
    },
    /** Mark all notifications as read */
    markAllRead(state) {
      const now = new Date().toISOString()
      state.list.forEach((n) => {
        if (!n.readAt) {
          n.readAt = now
          state.readMap[n.id] = { readAt: now }
        }
      })
      saveReadMap(state.readMap)            // ← persist immediately
    },
    /** Dismiss (remove) a notification — survives refresh */
    dismiss(state, { payload: id }) {
      state.list = state.list.filter((n) => n.id !== id)
      if (!state.dismissed.includes(id)) {
        state.dismissed.push(id)
        saveDismissed(new Set(state.dismissed)) // ← persist immediately
      }
    },
  },
  extraReducers: (builder) => {
    // Regenerate notifications whenever trips are fetched,
    // but skip IDs the user already dismissed
    builder.addCase(fetchTrips.fulfilled, (state, { payload: trips }) => {
      const dismissedSet = new Set(state.dismissed)
      const all = deriveNotifications(
        Array.isArray(trips) ? trips : [],
        state.readMap
      )
      state.list = all.filter((n) => !dismissedSet.has(n.id))
    })
  },
})

export const { markRead, markAllRead, dismiss } = notificationsSlice.actions

export const selectNotifications = (s) => s.notifications.list
export const selectUnreadCount   = (s) => s.notifications.list.filter((n) => !n.readAt).length
export const selectHasUnread     = (s) => s.notifications.list.some((n) => !n.readAt)

export default notificationsSlice.reducer
