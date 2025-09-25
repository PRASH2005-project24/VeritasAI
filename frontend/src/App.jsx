import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StudentVerifierPage from './pages/StudentVerifierPage';
import InstitutionPage from './pages/InstitutionPage';
import AdminDashboard from './pages/AdminDashboard';
import MCPAgent from './pages/MCPAgent';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Router basename={'/VeritasAI'}>
        <div className="gradient-bg min-h-screen">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/verify" element={<StudentVerifierPage />} />
              <Route path="/institution" element={<InstitutionPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/agent" element={<MCPAgent />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </div>
  );
}

export default App;