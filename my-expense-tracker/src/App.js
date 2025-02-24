import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./SignupPage";
import Login from "./LoginPage";
import Welcome from "./WelcomePage";
import Profile from "./ProfilePage";


function App() {
  return (
    <Router>  
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/welcome"
          element={localStorage.getItem("token") ? <Welcome /> : <Navigate to="/login" />}
        />
         <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/login" />} /> 
      </Routes>
    </Router>
  );
}

export default App;
