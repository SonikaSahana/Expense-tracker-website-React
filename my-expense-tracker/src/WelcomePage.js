import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { auth } from "./FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";



const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login"); 
      }
    });
  }, [navigate]);

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <h1>Welcome to expense tracker</h1>
      <p className="text-danger">Your profile is incomplete!</p>
      <button className="btn btn-primary" onClick={() => navigate("/profile")}>
        Complete Profile
      </button>
    </div>
  );
};


export default Welcome;
