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
    {Array.from({ length: 50 }).map((_, i) => (
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
    
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-30px) rotate(120deg); }
        66% { transform: translateY(30px) rotate(240deg); }
      }
    `}</style>
  </div>
);

// Navigation Component matching the design
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
    {/* Logo */}
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

    {/* Navigation Links */}
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

// Main Landing Page matching the exact design
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
    
    {/* Main Content Card */}
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
        
        {/* Action Buttons */}
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
            Learn More
          </button>
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
          {/* Certificate Header */}
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

          {/* Certificate Lines */}
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

          {/* Blockchain visualization */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
            {/* Signature area */}
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

            {/* Verification checkmark */}
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

            {/* Blockchain cubes */}
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

// Updated pages with dark theme
const VerifyPage = ({ showMessage }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('certificate', file);
      const response = await apiService.verifyCertificate(formData);
      setResult(response);
      
      if (response.status === 'valid') {
        showMessage('success', '✅ Certificate is Valid!');
      } else {
        showMessage('error', response.status === 'invalid' ? '❌ Certificate appears to be tampered!' : '🔍 Certificate not found');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showMessage('error', `Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
      <AnimatedBackground />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#ffffff', 
          marginBottom: '16px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          Certificate <span style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>Verification</span>
        </h1>
        <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '48px' }}>
          Upload your certificate to verify its authenticity instantly
        </p>
        
        {/* Upload Area */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          borderRadius: '24px', 
          padding: '48px 32px', 
          marginBottom: '48px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
          e.target.style.background = 'rgba(59, 130, 246, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {loading ? '⏳' : '📁'}
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            {loading ? 'Processing...' : 'Upload Certificate'}
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
            {loading ? 'Please wait while we process your certificate' : 'Drag and drop your certificate here or click to browse'}
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
              cursor: 'pointer'
            }}>
              Select File
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </div>

        {/* Results */}
        {result && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'left'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '24px', textAlign: 'center' }}>
              Verification Results
            </h2>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                background: result.status === 'valid' 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white'
              }}>
                <span style={{ fontSize: '24px' }}>
                  {result.status === 'valid' ? '✅' : result.status === 'invalid' ? '⚠️' : '❌'}
                </span>
                <span>
                  {result.status === 'valid' ? 'CERTIFICATE VALID' : 
                   result.status === 'invalid' ? 'CERTIFICATE TAMPERED' : 
                   'CERTIFICATE NOT FOUND'}
                </span>
              </div>
            </div>

            {result.certificate && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Student Name', value: result.certificate.studentName },
                  { label: 'Course', value: result.certificate.courseName },
                  { label: 'Institution', value: result.certificate.institutionName },
                  { label: 'Issue Date', value: result.certificate.issueDate }
                ].map((item, index) => (
                  <div key={index} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      {item.value || 'Not specified'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Success/Error Messages
const SuccessMessage = ({ message, onClose }) => (
  <div style={{
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <span style={{ fontSize: '18px' }}>✅</span>
    <span>{message}</span>
    <button 
      onClick={onClose}
      style={{
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '0 4px'
      }}
    >
      ×
    </button>
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
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <span style={{ fontSize: '18px' }}>❌</span>
    <span>{message}</span>
    <button 
      onClick={onClose}
      style={{
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '0 4px'
      }}
    >
      ×
    </button>
  </div>
);

// Placeholder pages for other routes
const InstitutionPage = ({ showMessage }) => (
  <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
    <AnimatedBackground />
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#ffffff', marginBottom: '24px' }}>Institution Portal</h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>Coming soon - Upload and manage certificates</p>
    </div>
  </div>
);

const AdminPage = ({ showMessage }) => (
  <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
    <AnimatedBackground />
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#ffffff', marginBottom: '24px' }}>Admin Dashboard</h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>Coming soon - System analytics and management</p>
    </div>
  </div>
);

const AgentPage = () => (
  <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
    <AnimatedBackground />
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#ffffff', marginBottom: '24px' }}>MCP Agent</h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>Coming soon - AI-powered certificate assistant</p>
    </div>
  </div>
);

// Main App
function App() {
  const [messages, setMessages] = useState([]);

  const showMessage = (type, message) => {
    const newMessage = { id: Date.now(), type, message };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 5000);
  };

  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerifyPage showMessage={showMessage} />} />
          <Route path="/institution" element={<InstitutionPage showMessage={showMessage} />} />
          <Route path="/admin" element={<AdminPage showMessage={showMessage} />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {messages.map((msg) => (
        msg.type === 'success' ? (
          <SuccessMessage
            key={msg.id}
            message={msg.message}
            onClose={() => removeMessage(msg.id)}
          />
        ) : (
          <ErrorMessage
            key={msg.id}
            message={msg.message}
            onClose={() => removeMessage(msg.id)}
          />
        )
      ))}
    </div>
  );
}

export default App;