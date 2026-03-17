// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Remove BrowserRouter from here
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>  {/* Only Routes here, no Router */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </div>
  );
}

export default App;