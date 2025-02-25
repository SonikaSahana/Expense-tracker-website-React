import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, sendEmailVerification,signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

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
      await signOut(auth); // Sign out from Firebase
      localStorage.removeItem("token"); // Clear stored token
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleVerifyEmail = async () => {
    setMessage("");
    if (!user) return;

    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent! Check your inbox.");
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        setMessage("You have requested too many verification emails. Please try again later.");
      } else {
        setMessage("Error sending verification email. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">'
       <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={handleLogout}>
        Logout
      </button>
      <h1>Welcome to Expense Tracker</h1>

      {!isVerified ? (
        <>
          <p className="text-danger">Your email is not verified!</p>
          <button className="btn btn-primary" onClick={handleVerifyEmail}>
            Verify Email
          </button>
          {message && <p className="text-success mt-2">{message}</p>}
        </>
      ) : (
        <p className="text-success">Your email is verified! 🎉</p>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/profile")}>
        Complete Profile
      </button>
    </div>
  );
};

export default Welcome;
