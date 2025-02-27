import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: false,
    isPremiumActivated: false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    activateDarkMode: (state) => {
      state.darkMode = true;
      state.isPremiumActivated = true; 
    },
    loadTheme: (state, action) => {
        const { darkMode = false, isPremiumActivated = false } = action.payload || {};
      state.darkMode = action.payload.darkMode;
      state.isPremiumActivated = action.payload.isPremiumActivated; 
    }
  },
});

export const { toggleTheme, activateDarkMode, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;
