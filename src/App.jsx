import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Room from './Pages/Room';
import { AuthProvider } from './Context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;  // Make sure this line is present