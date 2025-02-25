import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, sendEmailVerification, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsVerified(user.emailVerified);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("token"); 
      navigate("/login"); 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleVerifyEmail = async () => {
    setMessage("");
    if (!user) return;

    try {
      await sendEmailVerification(user);
      setMessage("✅ Verification email sent! Check your inbox.");
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        setMessage("⚠️ Too many requests! Please try again later.");
      } else {
        setMessage("❌ Error sending verification email. Try again.");
      }
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert("⚠️ Please fill all fields!");
      return;
    }
    const newExpense = {
      id: Date.now(),
      amount,
      description,
      category,
    };
    setExpenses([...expenses, newExpense]);
    setAmount("");
    setDescription("");
    setCategory("");
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

      {isVerified && (
        <div className="mt-5">
          <h2>Add Daily Expense</h2>
          <form className="card p-4 shadow" onSubmit={handleAddExpense}>
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
              Add Expense
            </button>
          </form>

          <div className="mt-4">
            <h3>Expense List</h3>
            {expenses.length === 0 ? (
              <p className="text-muted">No expenses added yet.</p>
            ) : (
              <ul className="list-group">
                {expenses.map((exp) => (
                  <li key={exp.id} className="list-group-item d-flex justify-content-between">
                    <span>💰 {exp.amount} | {exp.description} | {exp.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
