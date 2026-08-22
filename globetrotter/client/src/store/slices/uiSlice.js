import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen:      true,
    sidebarCollapsed: false,
    mobileMenuOpen:   false,
    activeModal:      null,  // e.g. 'createTrip', 'addCity', 'addActivity'
    modalData:        null,  // payload passed to active modal
    theme:            'light',
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen(state, { payload }) {
      state.sidebarOpen = payload
    },
    toggleSidebarCollapse(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenu(state, { payload }) {
      state.mobileMenuOpen = payload
    },
    openModal(state, { payload }) {
      state.activeModal = payload.modal
      state.modalData   = payload.data ?? null
    },
    closeModal(state) {
      state.activeModal = null
      state.modalData   = null
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  toggleMobileMenu,
  setMobileMenu,
  openModal,
  closeModal,
  toggleTheme,
} = uiSlice.actions

export const selectSidebarOpen      = (s) => s.ui.sidebarOpen
export const selectSidebarCollapsed = (s) => s.ui.sidebarCollapsed
export const selectMobileMenu       = (s) => s.ui.mobileMenuOpen
export const selectActiveModal      = (s) => s.ui.activeModal
export const selectModalData        = (s) => s.ui.modalData
export const selectTheme            = (s) => s.ui.theme

export default uiSlice.reducer
