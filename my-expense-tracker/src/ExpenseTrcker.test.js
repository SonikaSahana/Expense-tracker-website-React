import expensesReducer, { setExpenses, addExpense, deleteExpense, updateExpense } from "../src/store/expensesSlice";

describe("expensesSlice reducer", () => {
  const initialState = { expenses: [], totalAmount: 0 };

  it("should handle initial state", () => {
    expect(expensesReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle setExpenses", () => {
    const expenses = [{ id: "1", amount: 500, description: "Groceries", category: "Food" }];
    const action = setExpenses(expenses);
    const newState = expensesReducer(initialState, action);
    expect(newState.expenses).toEqual(expenses);
  });

  it("should handle addExpense", () => {
    const newExpense = { id: "2", amount: 1000, description: "Fuel", category: "Petrol" };
    const action = addExpense(newExpense);
    const newState = expensesReducer(initialState, action);
    expect(newState.expenses).toContainEqual(newExpense);
  });

  it("should handle deleteExpense", () => {
    const stateWithExpenses = { expenses: [{ id: "3", amount: 200 }], totalAmount: 200 };
    const action = deleteExpense("3");
    const newState = expensesReducer(stateWithExpenses, action);
    expect(newState.expenses).toHaveLength(0);
  });

  it("should handle updateExpense", () => {
    const stateWithExpenses = { expenses: [{ id: "4", amount: 300, description: "Old" }] };
    const updatedExpense = { id: "4", amount: 400, description: "Updated" };
    const action = updateExpense(updatedExpense);
    const newState = expensesReducer(stateWithExpenses, action);
    expect(newState.expenses[0].amount).toBe(400);
    expect(newState.expenses[0].description).toBe("Updated");
  });
});
