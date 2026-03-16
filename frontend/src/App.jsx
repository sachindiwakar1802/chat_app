import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";   // correct
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> 
    </Routes>
  );
};

export default App;