import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import apiService from './services/api.js';
import './App_Clean.css';

// Navigation Component
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-container">
      <Link to="/" className="nav-logo">
        VeritasAI
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </div>
  </nav>
);

// Hero Section Component
const HeroSection = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const fileInputRef = useRef();

  const handleFileUpload = (file, type) => {
    setUploadFile(file);
    if (type === 'verify') {
      handleVerifyCertificate(file);
    } else if (type === 'upload') {
      handleUploadCertificate(file);
    }
  };

  const handleVerifyCertificate = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await apiService.verifyCertificate(formData);
      setVerificationResult(response);
    } catch (error) {
      setVerificationResult({
        status: 'error',
        verification: {
          isValid: false,
          reason: error.message || 'Verification failed'
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadCertificate = async (file) => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('certificate', file);
      formData.append('institutionName', 'Sample Institution');
      formData.append('issuerEmail', 'issuer@institution.edu');

      const response = await apiService.uploadCertificate(formData);
      setVerificationResult({
        status: 'uploaded',
        certificate: response.certificate
      });
    } catch (error) {
      setVerificationResult({
        status: 'error',
        verification: {
          isValid: false,
          reason: error.message || 'Upload failed'
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Trusted<br />
            Certificate<br />
            Validation
          </h1>
          <p className="hero-subtitle">
            Fight fake degrees with blockchain + AI
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Certificate
            </button>
            <button 
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Verify Certificate
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                handleFileUpload(file, 'verify');
              }
            }}
          />

          {/* Verification Result */}
          {isUploading && (
            <div className="verification-loading">
              <div className="loading-spinner"></div>
              <p>Processing certificate...</p>
            </div>
          )}

          {verificationResult && !isUploading && (
            <div className={`verification-result ${verificationResult.status}`}>
              {verificationResult.status === 'valid' ? (
                <div className="result-success">
                  <div className="check-icon">✓</div>
                  <div>
                    <h3>Certificate Verified!</h3>
                    <p>Student: {verificationResult.certificate?.studentName}</p>
                    <p>Course: {verificationResult.certificate?.courseName}</p>
                    <p>Institution: {verificationResult.certificate?.institutionName}</p>
                  </div>
                </div>
              ) : verificationResult.status === 'uploaded' ? (
                <div className="result-success">
                  <div className="check-icon">✓</div>
                  <div>
                    <h3>Certificate Uploaded Successfully!</h3>
                    <p>Certificate ID: {verificationResult.certificate?.id}</p>
                    {verificationResult.certificate?.qrCodeUrl && (
                      <img 
                        src={apiService.getFileUrl(verificationResult.certificate.qrCodeUrl)}
                        alt="QR Code"
                        className="qr-code"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="result-error">
                  <div className="error-icon">✗</div>
                  <div>
                    <h3>Verification Failed</h3>
                    <p>{verificationResult.verification?.reason}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="hero-image">
          <div className="certificate-mockup">
            <div className="certificate-card">
              <div className="check-badge">✓</div>
              <div className="certificate-lines">
                <div className="cert-line long"></div>
                <div className="cert-line medium"></div>
                <div className="cert-line short"></div>
                <div className="cert-line medium"></div>
              </div>
              <div className="signature">
                <div className="signature-line"></div>
                <div className="qr-code-mini">
                  <div className="qr-grid">
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Section
const FeaturesSection = () => (
  <div className="features-section">
    <div className="container">
      <h2 className="features-title">Features</h2>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Blockchain Security</h3>
          <p>Immutable certificate records secured by blockchain technology</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered OCR</h3>
          <p>Advanced text extraction and certificate data parsing</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Verification</h3>
          <p>Real-time certificate validation with immediate results</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>QR Code Integration</h3>
          <p>Generate and scan QR codes for quick verification</p>
        </div>
      </div>
    </div>
  </div>
);

// About Page
const AboutPage = () => (
  <div className="page-container">
    <div className="container">
      <h1>About VeritasAI</h1>
      <p>VeritasAI is a cutting-edge platform that combines blockchain technology and artificial intelligence to provide secure, instant certificate verification for educational institutions and employers.</p>
    </div>
  </div>
);

// Contact Page
const ContactPage = () => (
  <div className="page-container">
    <div className="container">
      <h1>Contact Us</h1>
      <p>Get in touch with our team for any questions or support.</p>
      <div className="contact-info">
        <p>Email: contact@veritasai.com</p>
        <p>Phone: +1 (555) 123-4567</p>
      </div>
    </div>
  </div>
);

// Login Page
const LoginPage = () => (
  <div className="page-container">
    <div className="container">
      <div className="login-form">
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email" className="form-input" />
          <input type="password" placeholder="Password" className="form-input" />
          <button type="submit" className="btn-primary full-width">Login</button>
        </form>
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturesSection />
            </>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;