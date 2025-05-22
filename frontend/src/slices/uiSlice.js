import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  darkMode: false,
  currentTab: 'overview',
  notifications: [],
  loading: {
    datasets: false,
    models: false,
    training: false,
    visualization: false
  },
  errors: {
    datasets: null,
    models: null,
    training: null,
    visualization: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    setError: (state, action) => {
      const { key, value } = action.payload;
      state.errors[key] = value;
    },
    clearError: (state, action) => {
      state.errors[action.payload] = null;
    },
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    }
  }
});

export const {
  toggleSidebar,
  toggleDarkMode,
  setCurrentTab,
  addNotification,
  removeNotification,
  setLoading,
  setError,
  clearError,
  clearAllErrors
} = uiSlice.actions;

export default uiSlice.reducer;
