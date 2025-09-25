import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import apiService from './services/api.js';
import './Working.css';

// Animated Background Component
const AnimatedBackground = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #0f0c29 0%, #24243e 50%, #302b63 100%)',
    zIndex: -2
  }}>
    {/* Floating particles */}
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle at 20% 80%, rgba(120, 0, 255, 0.3) 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, rgba(0, 120, 255, 0.3) 0%, transparent 50%),
                   radial-gradient(circle at 40% 40%, rgba(255, 0, 120, 0.2) 0%, transparent 50%)`
    }}></div>
    
    {/* Animated dots */}
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 4 + 2 + 'px',
          height: Math.random() * 4 + 2 + 'px',
          background: ['#7c3aed', '#3b82f6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 4)],
          borderRadius: '50%',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
          opacity: Math.random() * 0.8 + 0.2
        }}
      />
    ))}
  </div>
);

// Navigation Component
const Navbar = () => (
  <nav style={{
    position: 'fixed',
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50px',
    padding: '16px 32px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '40px'
  }}>
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        ✓
      </div>
    </Link>

    <div style={{ display: 'flex', gap: '32px' }}>
      {[
        { name: 'Student', path: '/verify' },
        { name: 'Verifier', path: '/verify' },
        { name: 'Institution', path: '/institution' },
        { name: 'Admin', path: '/admin' },
        { name: 'MCP Agent', path: '/agent' }
      ].map((item) => (
        <Link
          key={item.name}
          to={item.path}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
            e.target.style.transform = 'translateY(0px)';
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  </nav>
);

// Loading Spinner with Dark Theme
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid rgba(255, 255, 255, 0.1)',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
);

// Success/Error Messages
const SuccessMessage = ({ message, onClose }) => (
  <div style={{
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <span style={{ fontSize: '18px' }}>✅</span>
    <span>{message}</span>
    <button onClick={onClose} style={{
      background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '0 4px'
    }}>×</button>
  </div>
);

const ErrorMessage = ({ message, onClose }) => (
  <div style={{
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <span style={{ fontSize: '18px' }}>❌</span>
    <span>{message}</span>
    <button onClick={onClose} style={{
      background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '0 4px'
    }}>×</button>
  </div>
);

// Landing Page
const LandingPage = () => (
  <div style={{ 
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    position: 'relative'
  }}>
    <AnimatedBackground />
    
    <div style={{
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(236, 72, 153, 0.3) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '32px',
      padding: '80px 60px',
      maxWidth: '1100px',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '80px',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow effects */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>

      {/* Left Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: '700',
          color: '#ffffff',
          lineHeight: '1.1',
          marginBottom: '24px',
          margin: 0,
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          VeritasAI
        </h1>
        
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '16px',
          opacity: 0.95
        }}>
          Secure & Instant Certificate Verification<br />
          for Academia
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '48px',
          lineHeight: '1.6',
          maxWidth: '400px'
        }}>
          Empowering Trust in Education, One Block at a Time
        </p>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/verify" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: '1px solid rgba(6, 182, 212, 0.5)',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              Verify a Certificate
            </button>
          </Link>
          
          <Link to="/institution" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(236, 72, 153, 0.5)',
              color: '#ec4899',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Issue Certificate
            </button>
          </Link>
        </div>
      </div>

      {/* Right Content - Certificate Illustration */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '32px',
          position: 'relative',
          transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.4)'
            }}>
              <span style={{ color: '#ffffff', fontSize: '24px' }}>💡</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '3px',
                  background: i % 2 === 0 
                    ? 'linear-gradient(90deg, #06b6d4, #3b82f6)' 
                    : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px',
                  marginBottom: '12px',
                  width: i === 0 ? '80%' : i === 1 ? '100%' : i === 2 ? '60%' : '90%'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
            <div style={{
              padding: '16px',
              background: 'rgba(6, 182, 212, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              <div style={{
                width: '60px',
                height: '20px',
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                borderRadius: '10px',
                marginBottom: '8px'
              }}></div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Digital Signature</div>
            </div>

            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
            }}>
              <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>✓</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '24px',
                    height: '24px',
                    background: i === 0 
                      ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                      : i === 1 
                      ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                      : 'linear-gradient(135deg, #06b6d4, #10b981)',
                    borderRadius: '6px',
                    transform: `translateY(${i * -4}px) rotateZ(${i * 15}deg)`,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    animation: `float ${2 + i * 0.5}s ease-in-out infinite`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// File Upload Component
const FileUploadArea = ({ onFileSelect, loading, accept = "image/*,.pdf", selectedFile = null }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      style={{
        background: dragOver 
          ? 'rgba(59, 130, 246, 0.2)' 
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: dragOver 
          ? '2px solid rgba(59, 130, 246, 0.6)' 
          : '2px dashed rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '48px 32px',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: loading ? 0.7 : 1
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !loading && fileInputRef.current?.click()}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {loading ? '⏳' : selectedFile ? '📄' : '📁'}
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
        {loading ? 'Processing...' : selectedFile ? selectedFile.name : 'Upload Certificate'}
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
        {loading 
          ? 'Please wait while we process your certificate' 
          : selectedFile 
          ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB - Click to change`
          : 'Drag and drop your certificate here or click to browse'
        }
      </p>
      {!loading && (
        <button style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
        }}>
          {selectedFile ? 'Change File' : 'Select File'}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

// Continue in next file due to length limit...