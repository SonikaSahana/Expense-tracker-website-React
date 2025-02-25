import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      localStorage.setItem("token", await user.getIdToken());

      
      navigate("/welcome");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-3" style={{ width: "350px" }}>
        <h2 className="text-center text-primary fw-bold">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <button className="btn btn-link text-decoration-none" onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
        </div>
        <div className="text-center mt-2">
          <p>Not a user? <button className="btn btn-link text-decoration-none" onClick={() => navigate("/signup")}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
