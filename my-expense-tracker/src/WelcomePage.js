import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, sendEmailVerification, signOut } from "firebase/auth";
import { getDatabase, ref, push, set, onValue, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setExpenses, addExpense } from "../src/store/expensesSlice";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const totalAmount = useSelector((state) => state.expenses.totalAmount); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsVerified(user.emailVerified);
        fetchExpenses(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setMessage("✅ Verification email sent! Check your inbox.");
    } catch (error) {
      setMessage("❌ Error sending verification email. Try again.");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    try {
      const db = getDatabase();
      const userExpenseRef = ref(db, `expenses/${user.uid}`);
      const newExpenseRef = push(userExpenseRef);

      const newExpense = {
        id: newExpenseRef.key,
        amount: Number(amount),
        description,
        category,
        createdAt: new Date().toISOString(),
      };

      await set(newExpenseRef, newExpense);
      dispatch(addExpense(newExpense));

      setAmount("");
      setDescription("");
      setCategory("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const fetchExpenses = (userId) => {
    const db = getDatabase();
    const userExpenseRef = ref(db, `expenses/${userId}`);

    onValue(userExpenseRef, (snapshot) => {
      if (snapshot.exists()) {
        const expenseData = snapshot.val();
        const expenseList = Object.keys(expenseData).map((key) => ({
          id: key,
          ...expenseData[key],
        }));
        dispatch(setExpenses(expenseList));
      } else {
        dispatch(setExpenses([]));
      }
    });
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const db = getDatabase();
      const expenseRef = ref(db, `expenses/${user.uid}/${expenseId}`);
      await remove(expenseRef);
      dispatch(setExpenses(expenses.filter((exp) => exp.id !== expenseId)));
    } catch (error) {
      console.error("❌ Error deleting expense:", error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    if (!editingExpense) return;

    try {
      const db = getDatabase();
      const expenseRef = ref(db, `expenses/${user.uid}/${editingExpense.id}`);

      await update(expenseRef, {
        amount,
        description,
        category,
      });

      dispatch(
        setExpenses(
          expenses.map((exp) =>
            exp.id === editingExpense.id ? { ...exp, amount, description, category } : exp
          )
        )
      );

      setEditingExpense(null);
      setAmount("");
      setDescription("");
      setCategory("");
    } catch (error) {
      console.error("❌ Error updating expense:", error);
    }
  };

  const handleActivatePremium = () => {
    alert("🎉 Premium Activated! Enjoy extra features!");
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="text-center">Welcome to Expense Tracker</h1>

      {!isVerified ? (
        <div className="text-center mt-4">
          <p className="text-danger">⚠️ Your email is not verified!</p>
          <button className="btn btn-primary" onClick={handleVerifyEmail}>
            Verify Email
          </button>
          {message && <p className="text-success mt-2">{message}</p>}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-success">✅ Your email is verified! 🎉</p>
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/profile")}>
        Complete Profile
      </button>

      {totalAmount > 10000 && (
        <div className="text-center mt-4">
          <button className="btn btn-dark btn-lg" onClick={handleActivatePremium}>
            🚀 Activate Premium
          </button>
        </div>
      )}

      {isVerified && (
        <div className="mt-5">
          <h2>{editingExpense ? "Edit Expense" : "Add Daily Expense"}</h2>
          <form className="card p-4 shadow" onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}>
            <div className="mb-3">
              <label className="form-label">Amount Spent</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expense description"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Petrol">Petrol</option>
                <option value="Salary">Salary</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {editingExpense ? "Update Expense" : "Add Expense"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Welcome;
