import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Simple components for testing
const Navbar = () => (
  <nav className="glass-card m-4 sticky top-4 z-50 text-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="text-xl font-bold">🛡️ VeritasAI</div>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600">Home</a>
          <a href="/verify" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600">Verify</a>
          <a href="/institution" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600">Institution</a>
          <a href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600">Admin</a>
        </div>
      </div>
    </div>
  </nav>
);

const LandingPage = () => (
  <div className="min-h-screen text-white text-center py-20">
    <div className="animate-pulse-glow text-6xl mb-6">🛡️</div>
    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
      VeritasAI
    </h1>
    <p className="text-xl mb-8 max-w-3xl mx-auto px-4">
      Revolutionary certificate authenticity validator powered by blockchain technology and AI
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12 px-4">
      <div className="glass-card p-6 text-center">
        <div className="text-3xl font-bold mb-2">10+</div>
        <div className="text-gray-300 text-sm">Sample Certificates</div>
      </div>
      <div className="glass-card p-6 text-center">
        <div className="text-3xl font-bold mb-2">100%</div>
        <div className="text-gray-300 text-sm">Accuracy Rate</div>
      </div>
      <div className="glass-card p-6 text-center">
        <div className="text-3xl font-bold mb-2">&lt;2s</div>
        <div className="text-gray-300 text-sm">Verification Time</div>
      </div>
      <div className="glass-card p-6 text-center">
        <div className="text-3xl font-bold mb-2">24/7</div>
        <div className="text-gray-300 text-sm">Availability</div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
      <div className="glass-card p-8 hover:bg-blue-900 transition-all duration-300">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold mb-3">Students & Verifiers</h3>
        <p className="text-gray-300 mb-4">Upload and verify certificate authenticity instantly</p>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold">Get Started</button>
      </div>
      <div className="glass-card p-8 hover:bg-green-900 transition-all duration-300">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-2xl font-bold mb-3">Institutions</h3>
        <p className="text-gray-300 mb-4">Issue certificates with blockchain anchoring and QR codes</p>
        <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold">Get Started</button>
      </div>
    </div>

    <div className="mt-16 max-w-2xl mx-auto px-4">
      <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Certificates?</h2>
      <p className="text-xl mb-8">
        Join institutions and verifiers worldwide who trust VeritasAI for certificate authenticity
      </p>
      <div className="space-x-4">
        <button className="bg-white text-purple-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors">
          🔍 Verify Certificate
        </button>
        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-700 transition-colors">
          🏢 Institution Portal
        </button>
      </div>
    </div>
  </div>
);

const VerifyPage = () => (
  <div className="min-h-screen text-white text-center py-20">
    <div className="text-6xl mb-6">🔍</div>
    <h1 className="text-4xl font-bold mb-4">Certificate Verification</h1>
    <p className="text-xl mb-8">Upload your certificate to verify its authenticity instantly</p>
    
    <div className="glass-card p-8 max-w-2xl mx-auto">
      <div className="upload-area">
        <div className="text-4xl mb-4">📁</div>
        <h3 className="text-xl font-semibold mb-2">Upload Certificate</h3>
        <p className="text-gray-300 mb-4">Drag and drop your certificate here or click to browse</p>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
          Select File
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen gradient-bg">
      <Router>
        <Navbar />
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/institution" element={<div className="text-white text-center py-20"><h1 className="text-4xl">Institution Portal - Coming Soon</h1></div>} />
            <Route path="/admin" element={<div className="text-white text-center py-20"><h1 className="text-4xl">Admin Dashboard - Coming Soon</h1></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;