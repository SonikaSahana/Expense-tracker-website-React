import { createSlice } from "@reduxjs/toolkit";

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    totalAmount: 0, 
  },
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.totalAmount = action.payload.reduce((acc, exp) => acc + exp.amount, 0);
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
      state.totalAmount += action.payload.amount;
    },
    deleteExpense: (state, action) => {
      const updatedExpenses = state.expenses.filter((exp) => exp.id !== action.payload);
      state.expenses = updatedExpenses;
      state.totalAmount = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.totalAmount -= state.expenses[index].amount; 
        state.expenses[index] = action.payload;
        state.totalAmount += action.payload.amount;
      }
    },
  },
});

export const { setExpenses, addExpense, deleteExpense, updateExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
