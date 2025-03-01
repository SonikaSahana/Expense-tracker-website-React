import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import fetchMock from "../__mocks__/fetchMock";
import Welcome from "./WelcomePage";
import { toggleTheme } from "../src/store/themeSlice";

const mockStore = configureStore([]);

describe("Expense Tracker Tests", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      expenses: { expenses: [], totalAmount: 0 },
      user: { profileComplete: false },
      theme: { darkMode: false },
    });
    store.dispatch = jest.fn();
  });

  /** ✅ 1. Test API Call for Fetching Expenses */
  test("fetches and displays expenses from API", async () => {
    fetchMock([
      { id: "1", amount: 200, description: "Food", category: "Groceries" },
    ]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText("Food")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  /** ✅ 2. Test if Expense Form is Cleared After Adding */
  test("clears form inputs after adding expense", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "100" } });
    fireEvent.click(screen.getByText("Add Expense"));

    expect(screen.getByLabelText("Amount").value).toBe("");
  });

  /** ✅ 3. Test Empty Expense List */
  test("displays message when no expenses exist", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("No expenses found")).toBeInTheDocument();
  });

  /** ✅ 4. Test API Call for Deleting Expense */
  test("calls API and removes expense when delete is clicked", async () => {
    fetchMock({ status: 200 });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(fetch).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText("Lunch")).not.toBeInTheDocument());
  });

  /** ✅ 5. Test Invalid Expense Submission */
  test("does not add expense if amount is missing", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Snacks" } });
    fireEvent.click(screen.getByText("Add Expense"));

    expect(screen.getByText("Please enter a valid amount")).toBeInTheDocument();
  });

  /** ✅ 6. Test Expense List Updates When Expense is Edited */
  test("updates expense description on edit", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Dinner" } });
    fireEvent.click(screen.getByText("Update Expense"));

    expect(await screen.findByText("Dinner")).toBeInTheDocument();
  });

  /** ✅ 7. Test API Error Handling */
  test("shows error if API call fails", async () => {
    fetchMock([], true); // Mocking API failure

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Add Expense"));

    expect(await screen.findByText("Failed to add expense")).toBeInTheDocument();
  });

  /** ✅ 8. Test Theme Toggle API Call */
  test("toggles dark mode when clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("🌙 Dark Mode"));

    expect(store.dispatch).toHaveBeenCalledWith(toggleTheme());
  });

  /** ✅ 9. Test CSV Download API Call */
  test("triggers CSV download", () => {
    global.URL.createObjectURL = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("📂 Download Expenses (CSV)"));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  /** ✅ 10. Test Profile Completion Check */
  test("shows complete profile message if user is incomplete", () => {
    store = mockStore({ user: { profileComplete: false } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Complete Profile")).toBeInTheDocument();
  });
});
