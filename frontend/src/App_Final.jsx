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
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle at 20% 80%, rgba(120, 0, 255, 0.3) 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, rgba(0, 120, 255, 0.3) 0%, transparent 50%),
                   radial-gradient(circle at 40% 40%, rgba(255, 0, 120, 0.2) 0%, transparent 50%)`
    }}></div>
    
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
              Learn More
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
        onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
};

// Verify Page with Dark Theme + Backend Integration
const VerifyPage = ({ showMessage }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
      } else if (response.status === 'invalid') {
        showMessage('error', '❌ Certificate appears to be tampered!');
      } else {
        showMessage('error', '🔍 Certificate not found in our database');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showMessage('error', `Verification failed: ${error.message}`);
      setResult(null);
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
        <div style={{ marginBottom: '48px' }}>
          <FileUploadArea 
            onFileSelect={handleFileSelect} 
            loading={loading} 
            selectedFile={selectedFile}
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
                  <div key={index} style={{ 
                    padding: '16px', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
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

// Institution Page with Dark Theme + Backend Integration
const InstitutionPage = ({ showMessage }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    institutionName: '',
    issuerEmail: '',
    file: null
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (file) => {
    setFormData({
      ...formData,
      file: file
    });
  };

  const handleSubmit = async () => {
    if (!formData.institutionName || !formData.issuerEmail || !formData.file) {
      showMessage('error', 'Please fill all fields and select a certificate file');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const uploadData = new FormData();
      uploadData.append('certificate', formData.file);
      uploadData.append('institutionName', formData.institutionName);
      uploadData.append('issuerEmail', formData.issuerEmail);

      const response = await apiService.uploadCertificate(uploadData);
      setResult(response);
      showMessage('success', '🎉 Certificate uploaded and processed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', `Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
      <AnimatedBackground />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏢</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
            Institution <span style={{ 
              background: 'linear-gradient(135deg, #10b981, #3b82f6)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>Portal</span>
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Issue certificates with blockchain anchoring and QR code generation
          </p>
        </div>

        {!result ? (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px', 
            padding: '40px', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '32px', textAlign: 'center' }}>
              Upload Certificate
            </h2>
            
            {/* Institution Name */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '500', 
                color: '#ffffff', 
                marginBottom: '8px' 
              }}>
                Institution Name *
              </label>
              <input 
                name="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  borderRadius: '12px', 
                  fontSize: '16px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }} 
                placeholder="Enter your institution name"
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              />
            </div>
            
            {/* Issuer Email */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '500', 
                color: '#ffffff', 
                marginBottom: '8px' 
              }}>
                Issuer Email *
              </label>
              <input 
                name="issuerEmail"
                type="email"
                value={formData.issuerEmail}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  borderRadius: '12px', 
                  fontSize: '16px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }} 
                placeholder="Enter issuer email address"
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              />
            </div>
            
            {/* File Upload */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '500', 
                color: '#ffffff', 
                marginBottom: '12px' 
              }}>
                Certificate Document *
              </label>
              <FileUploadArea 
                onFileSelect={handleFileSelect} 
                loading={loading} 
                selectedFile={formData.file}
              />
            </div>
            
            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(156, 163, 175, 0.5)' : 'linear-gradient(135deg, #3b82f6, #10b981)',
                color: 'white',
                border: 'none',
                padding: '18px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(59, 130, 246, 0.3)'
              }}
            >
              {loading ? '⏳ Processing Certificate...' : '🚀 Process Certificate'}
            </button>
          </div>
        ) : (
          // Results Display
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px', 
            padding: '40px', 
            maxWidth: '800px', 
            margin: '0 auto' 
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#ffffff', marginBottom: '32px', textAlign: 'center' }}>
              🎉 Certificate Processed Successfully!
            </h2>
            
            {/* Success Message */}
            <div style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(167, 243, 208, 0.2))', 
              borderRadius: '16px', 
              marginBottom: '32px', 
              textAlign: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: 0, marginBottom: '8px' }}>
                Certificate ID: {result.certificate?.id}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Your certificate has been successfully processed and secured on the blockchain.
              </p>
            </div>

            {/* Extracted Data */}
            {result.certificate?.extractedData && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                  Extracted Certificate Data
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {Object.entries(result.certificate.extractedData).map(([key, value]) => (
                    <div key={key} style={{ 
                      padding: '16px', 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        marginBottom: '8px', 
                        textTransform: 'capitalize' 
                      }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                        {value || 'Not detected'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code */}
            {result.certificate?.qrCodeUrl && (
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                  Verification QR Code
                </h3>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '20px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <img 
                    src={apiService.getFileUrl(result.certificate.qrCodeUrl)} 
                    alt="Certificate QR Code" 
                    style={{ width: '200px', height: '200px', display: 'block', borderRadius: '8px' }}
                  />
                </div>
                <p style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  Scan this QR code to verify the certificate
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  setResult(null);
                  setFormData({ institutionName: '', issuerEmail: '', file: null });
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                }}
              >
                📤 Upload Another Certificate
              </button>
              {result.certificate?.qrCodeUrl && (
                <a 
                  href={apiService.getFileUrl(result.certificate.qrCodeUrl)} 
                  download={`qr_${result.certificate.id}.png`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  💾 Download QR Code
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Dashboard with Dark Theme + Backend Integration
const AdminPage = ({ showMessage }) => {
  const [analytics, setAnalytics] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsData, certificatesData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getAllCertificates()
      ]);
      
      setAnalytics(analyticsData);
      setCertificates(certificatesData.certificates || []);
    } catch (error) {
      console.error('Admin data loading error:', error);
      showMessage('error', `Failed to load admin data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedBackground />
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
      <AnimatedBackground />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚙️</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
            Admin <span style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>Dashboard</span>
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Monitor system analytics and blockchain transactions
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
            {[
              { label: 'Total Certificates', value: analytics.totalCertificates, icon: '📄', color: '#3b82f6' },
              { label: 'Valid Certificates', value: analytics.validCertificates, icon: '✅', color: '#10b981' },
              { label: 'Fraud Attempts', value: analytics.fraudAttempts, icon: '🚨', color: '#ef4444' },
              { label: 'Recent (7 days)', value: analytics.recentCertificates, icon: '📊', color: '#8b5cf6' }
            ].map((stat, index) => (
              <div key={index} style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px', 
                padding: '24px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', margin: 0 }}>{stat.label}</h3>
                {stat.label === 'Valid Certificates' && analytics.verificationRate && (
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0 0' }}>
                    {analytics.verificationRate}% success rate
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certificates List */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px', 
          padding: '32px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Recent Certificates</h2>
            <button 
              onClick={loadAdminData}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {certificates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255, 255, 255, 0.7)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#ffffff' }}>No certificates found</h3>
              <p>Upload some certificates through the Institution portal to see them here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Student</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Course</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Institution</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert, index) => (
                    <tr key={cert.id} style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.parentNode.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.target.parentNode.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 12px' }}>
                        <code style={{ 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          padding: '4px 8px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          color: '#ffffff'
                        }}>
                          {cert.id}
                        </code>
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '500', color: '#ffffff' }}>
                        {cert.studentName || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {cert.courseName || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {cert.institutionName}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {new Date(cert.uploadTimestamp).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          background: cert.status === 'valid' 
                            ? 'linear-gradient(135deg, #10b981, #059669)' 
                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Information */}
        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌐</span> System Status
            </h3>
            <div style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              All Systems Operational
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⛓️</span> Blockchain
            </h3>
            <div style={{ color: '#10b981', fontWeight: '600' }}>Connected & Synced</div>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0 0' }}>
              Last block: #1,234,567
            </p>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🕒</span> Last Update
            </h3>
            <div style={{ fontWeight: '600', color: '#ffffff' }}>
              {analytics?.lastUpdate ? new Date(analytics.lastUpdate).toLocaleString() : 'Just now'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MCP Agent Page with Dark Theme
const AgentPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm the VeritasAI MCP Agent. I can help you with certificate verification queries, fraud statistics, and system information. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('verify') || lowerQuestion.includes('verification')) {
      return "To verify a certificate, navigate to the Student/Verifier page and upload your certificate file. Our AI will analyze it against our blockchain records and provide instant verification results with detailed authentication status.";
    } else if (lowerQuestion.includes('upload') || lowerQuestion.includes('institution')) {
      return "Institutions can upload certificates through our Institution Portal. You'll need to provide your institution name, issuer email, and the certificate file. We'll generate a QR code and blockchain hash for verification.";
    } else if (lowerQuestion.includes('fraud') || lowerQuestion.includes('fake')) {
      return "Our system detects fraudulent certificates by comparing uploaded documents against our blockchain-secured database. Any tampering or modifications are immediately identified through hash comparison and AI-powered analysis.";
    } else if (lowerQuestion.includes('how') || lowerQuestion.includes('work')) {
      return "VeritasAI uses AI-powered OCR to extract data from certificates, generates cryptographic hashes, and stores them on blockchain for immutable verification. This ensures certificates cannot be forged or tampered with.";
    } else if (lowerQuestion.includes('admin') || lowerQuestion.includes('dashboard')) {
      return "The Admin Dashboard provides real-time analytics including total certificates, valid certificates, fraud attempts, and system status. Access it through the Admin navigation link.";
    } else {
      return "I can help you with certificate verification, institution uploads, fraud detection, admin analytics, and system information. Feel free to ask about any specific feature or process!";
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative' }}>
      <AnimatedBackground />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
            MCP <span style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>Agent</span>
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
            AI-powered assistant for certificate verification and system queries
          </p>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px', 
          padding: '32px' 
        }}>
          {/* Chat Messages */}
          <div style={{ 
            height: '400px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '24px', 
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px', 
                marginBottom: '24px', 
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row' 
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: message.type === 'ai' 
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {message.type === 'ai' ? 'AI' : 'You'}
                </div>
                <div style={{ 
                  background: message.type === 'ai' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  color: '#ffffff',
                  borderRadius: '16px', 
                  padding: '16px', 
                  maxWidth: '70%',
                  border: message.type === 'ai' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{message.content}</p>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7, 
                    marginTop: '8px',
                    color: message.type === 'ai' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255,255,255,0.8)'
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  AI
                </div>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '16px', 
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#8b5cf6', 
                        borderRadius: '50%', 
                        animation: `pulse 1.5s infinite ${i * 0.2}s` 
                      }}></div>
                    ))}
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', marginLeft: '8px', fontSize: '14px' }}>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              "How do I verify a certificate?",
              "How does fraud detection work?",
              "What is blockchain verification?",
              "Show me admin dashboard info"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  color: '#a855f7',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(139, 92, 246, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                fontSize: '16px',
                color: '#ffffff',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Ask me anything about certificate verification..."
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                e.target.style.background = 'rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading || !inputValue.trim()}
              style={{
                background: loading || !inputValue.trim() 
                  ? 'rgba(156, 163, 175, 0.5)' 
                  : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading || !inputValue.trim() 
                  ? 'none' 
                  : '0 8px 32px rgba(139, 92, 246, 0.3)'
              }}
            >
              {loading ? '⏳' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
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