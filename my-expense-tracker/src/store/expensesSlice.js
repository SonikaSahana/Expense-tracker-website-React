import { createSlice } from "@reduxjs/toolkit";

const initialExpensesState = {
  expenses: [],
  totalAmount: 0,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState: initialExpensesState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
      state.totalAmount = action.payload.reduce((sum, expense) => sum + expense.amount, 0);
    },
    addExpense(state, action) {
      state.expenses.push(action.payload);
      state.totalAmount += action.payload.amount;
    },
  },
});

export const { setExpenses, addExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
