import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./expensesSlice";
import authReducer from "./authSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    theme: themeReducer, 
  },
});

export default store;
