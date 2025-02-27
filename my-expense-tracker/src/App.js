import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTheme } from "./store/themeSlice"; 
import "./App.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./SignupPage";
import Login from "./LoginPage";
import Welcome from "./WelcomePage";
import Profile from "./ProfilePage";
import ForgotPassword from "./ForgotPassword";


function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  
  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  
  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <Router>  
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/welcome"
            element={localStorage.getItem("token") ? <Welcome /> : <Navigate to="/login" />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/login" />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
