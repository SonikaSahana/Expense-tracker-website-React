import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); 
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(false); 

    if (!email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      
      setSuccess(true);

      
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-3" style={{ width: "350px" }}>
        <h2 className="text-center text-primary fw-bold">Signup</h2>

       
        {success && <p className="text-success text-center fw-bold">Signup successful! Redirecting...</p>}

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Sign Up
          </button>
        </form>

       
        <p className="text-center mt-3">
          Already have an account?{" "}
          <button
            className="btn btn-link p-0"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
