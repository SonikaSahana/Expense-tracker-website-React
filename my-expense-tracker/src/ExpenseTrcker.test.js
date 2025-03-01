import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../src/store/store";
import { MemoryRouter } from "react-router-dom";
import Welcome from "./WelcomePage";
import PremiumFeature from "./premiumFeature";

describe("Expense Tracker Tests", () => {
  
  // 1️⃣ Test: Welcome Component Renders
  test("renders welcome message", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Welcome to Expense Tracker")).toBeInTheDocument();
  });

  // 2️⃣ Test: Add Expense Form Renders
  test("renders Add Expense form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Add Expense")).toBeInTheDocument();
  });

  // 3️⃣ Test: "Add Expense" Button Exists
  test("checks for Add Expense button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("button", { name: /Add Expense/i })).toBeInTheDocument();
  });

  // 4️⃣ Test: Checking Form Input Fields
  test("checks amount input field", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    const amountInput = screen.getByLabelText(/Amount/i);
    userEvent.type(amountInput, "500");
    expect(amountInput).toHaveValue(500);
  });

  // 5️⃣ Test: Expense Form Submission
  test("checks form submission", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );

    const amountInput = screen.getByLabelText(/Amount/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const categoryInput = screen.getByLabelText(/Category/i);
    const addButton = screen.getByRole("button", { name: /Add Expense/i });

    userEvent.type(amountInput, "500");
    userEvent.type(descriptionInput, "Lunch");
    userEvent.selectOptions(categoryInput, "Food");
    userEvent.click(addButton);
  });

  // 6️⃣ Test: Checking "Logout" Button
  test("checks for Logout button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  // 7️⃣ Test: Checking Expense List Rendering
  test("checks if expense list is rendered", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText(/Expenses/i)).toBeInTheDocument();
  });

  // 8️⃣ Test: "Activate Premium" Button Visibility
  test("checks for Premium Button", () => {
    render(
      <Provider store={store}>
        <PremiumFeature expenses={[]} />
      </Provider>
    );
    expect(screen.getByText(/Activate Premium/i)).toBeInTheDocument();
  });

  // 9️⃣ Test: Dark Mode Toggle Works
  test("checks theme toggle", () => {
    render(
      <Provider store={store}>
        <PremiumFeature expenses={[]} />
      </Provider>
    );

    const toggleButton = screen.getByRole("button", { name: /Dark Mode/i });
    fireEvent.click(toggleButton);
  });

  // 🔟 Test: CSV Download Button Exists
  test("checks CSV Download button", () => {
    render(
      <Provider store={store}>
        <PremiumFeature expenses={[]} />
      </Provider>
    );
    expect(screen.getByText(/Download Expenses/i)).toBeInTheDocument();
  });

});
