import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, push, set, update, remove, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setExpenses, addExpense, deleteExpense, updateExpense } from "../src/store/expensesSlice";
import PremiumFeature from "./premiumFeature"; 

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchExpenses(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, dispatch]);

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate("/login");
  };

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    const db = getDatabase();
    const userExpenseRef = ref(db, `expenses/${user.uid}`);

    if (editingId) {
      // **Update Expense**
      const expenseRef = ref(db, `expenses/${user.uid}/${editingId}`);
      const updatedExpense = { id: editingId, amount: Number(amount), description, category };
      await update(expenseRef, updatedExpense);
      dispatch(updateExpense(updatedExpense));
    } else {
      // **Add Expense**
      const newExpenseRef = push(userExpenseRef);
      const newExpense = { id: newExpenseRef.key, amount: Number(amount), description, category, createdAt: new Date().toISOString() };
      await set(newExpenseRef, newExpense);
      dispatch(addExpense(newExpense));
    }

    setAmount("");
    setDescription("");
    setCategory("");
    setEditingId(null);
  };

  const fetchExpenses = (userId) => {
    const db = getDatabase();
    const userExpenseRef = ref(db, `expenses/${userId}`);

    onValue(userExpenseRef, (snapshot) => {
      if (snapshot.exists()) {
        const expenseData = snapshot.val();
        const expenseList = Object.keys(expenseData).map((key) => ({ id: key, ...expenseData[key] }));
        dispatch(setExpenses(expenseList));
      } else {
        dispatch(setExpenses([]));
      }
    });
  };

  const handleEditExpense = (expense) => {
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditingId(expense.id);
  };

  const handleDeleteExpense = async (id) => {
    const db = getDatabase();
    await remove(ref(db, `expenses/${user.uid}/${id}`));
    dispatch(deleteExpense(id));
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="text-center">Welcome to Expense Tracker</h1>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/profile")}>
        Complete Profile
      </button>

      <PremiumFeature expenses={expenses} />

      <div className="mt-5">
        <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>
        <form className="card p-4 shadow" onSubmit={handleAddOrUpdateExpense}>
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Petrol">Petrol</option>
              <option value="Salary">Salary</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="mt-4">
        <h2>Expenses</h2>
        <ul className="list-group">
          {expenses.map((exp) => (
            <li key={exp.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                ₹{exp.amount} - {exp.description} ({exp.category})
              </span>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditExpense(exp)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Welcome;
