import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  sidebarCollapsed: boolean
  currentPage: string
}

const initialState: UIState = {
  sidebarCollapsed: false,
  currentPage: "dashboard",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, setCurrentPage } = uiSlice.actions
export default uiSlice.reducer
