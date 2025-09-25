import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Globe, User, LogOut, Menu, X, QrCode } from 'lucide-react';

// Import all components
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import QRCodeScanner from './components/QRCodeScanner';
import EnhancedAdminDashboard from './components/EnhancedAdminDashboard';
import BulkVerificationTool from './components/BulkVerificationTool';
import ActivityHistory from './components/ActivityHistory';
import apiService from './services/mockApi.js';
import databaseService from './services/databaseService';
import './Working.css';

// Main App Content Component
const AppContent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Enhanced Navbar Component
  const Navbar = () => (
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '80px' 
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            VeritasAI
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div style={{ display: window.innerWidth >= 768 ? 'flex' : 'none', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
            {t('home')}
          </Link>
          <Link to="/verify" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
            {t('verify')}
          </Link>
          <Link to="/institution" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
            {t('institution')}
          </Link>
          {user?.role === 'verifier' && (
            <Link to="/bulk-verify" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
              Bulk Verify
            </Link>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                {t('admin')}
              </Link>
              <Link to="/history" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                History
              </Link>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                fontSize: '14px',
                background: '#f3f4f6',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Globe style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {availableLanguages.find(lang => lang.code === currentLanguage)?.native}
            </button>
            
            {showLanguageMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: '8px',
                width: '160px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                paddingTop: '4px',
                paddingBottom: '4px',
                zIndex: 50
              }}>
                {availableLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      fontSize: '14px',
                      background: currentLanguage === lang.code ? '#eff6ff' : 'transparent',
                      color: currentLanguage === lang.code ? '#2563eb' : '#374151',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentLanguage !== lang.code) {
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentLanguage !== lang.code) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* QR Scanner Button */}
          <button
            onClick={() => setShowQRScanner(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              fontSize: '14px',
              background: '#f3e8ff',
              color: '#7c3aed',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9d5ff'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3e8ff'}
            title="Scan QR Code"
          >
            <QrCode style={{ width: '16px', height: '16px' }} />
          </button>

          {/* Authentication */}
          {isAuthenticated() ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize', margin: 0 }}>{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#dc2626',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Logout"
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {t('login')}
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #1d4ed8, #7c3aed)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #2563eb, #8b5cf6)';
                }}
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              display: window.innerWidth < 768 ? 'block' : 'none',
              padding: '8px',
              color: '#4b5563',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {showMobileMenu ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div style={{
          display: window.innerWidth < 768 ? 'block' : 'none',
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px',
          paddingBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}>
            <Link 
              to="/" 
              style={{
                paddingTop: '8px',
                paddingBottom: '8px',
                color: '#374151',
                textDecoration: 'none'
              }}
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              {t('home')}
            </Link>
            <Link 
              to="/verify" 
              style={{
                paddingTop: '8px',
                paddingBottom: '8px',
                color: '#374151',
                textDecoration: 'none'
              }}
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              {t('verify')}
            </Link>
            <Link 
              to="/institution" 
              style={{
                paddingTop: '8px',
                paddingBottom: '8px',
                color: '#374151',
                textDecoration: 'none'
              }}
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              {t('institution')}
            </Link>
            {user?.role === 'verifier' && (
              <Link 
                to="/bulk-verify" 
                style={{
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  color: '#374151',
                  textDecoration: 'none'
                }}
                onClick={() => setShowMobileMenu(false)}
                onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                onMouseLeave={(e) => e.target.style.color = '#374151'}
              >
                Bulk Verify
              </Link>
            )}
            {user?.role === 'admin' && (
              <>
                <Link 
                  to="/admin" 
                  style={{
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    color: '#374151',
                    textDecoration: 'none'
                  }}
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.color = '#374151'}
                >
                  {t('admin')}
                </Link>
                <Link 
                  to="/history" 
                  style={{
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    color: '#374151',
                    textDecoration: 'none'
                  }}
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.color = '#374151'}
                >
                  History
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // Enhanced Pages with Authentication
  const LandingPage = () => (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)' 
    }}>
      <div style={{ padding: '80px 20px 120px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '64px', 
              fontWeight: 'bold', 
              color: '#111827', 
              lineHeight: '1.1', 
              marginBottom: '24px',
              margin: 0
            }}>
              {t('landingTitle')}<br />
              <span style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {t('landingSubtitle')}
              </span><br />
              {t('landingAction')}
            </h1>
            <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '40px', maxWidth: '500px' }}>
              {t('landingDescription')}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/verify" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {t('verifyNow')}
                </button>
              </Link>
              
              <Link to="/institution" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white',
                  color: '#3b82f6',
                  border: '2px solid #3b82f6',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {t('uploadCertificate')}
                </button>
              </Link>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '400px',
              height: '300px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Certificate Verification System
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/" replace />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<StudentVerifierPage />} />
        <Route path="/institution" element={<InstitutionPage />} />
        
        {/* Role-based Routes */}
        <Route 
          path="/bulk-verify" 
          element={
            <ProtectedRoute allowedRoles={['verifier', 'admin']}>
              <BulkVerificationTool />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EnhancedAdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <ActivityHistory />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      <QRCodeScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onResult={(result) => {
          console.log('QR Scan Result:', result);
          setShowQRScanner(false);
        }}
      />
    </>
  );
};

// Placeholder components (simplified versions)
const StudentVerifierPage = () => (
  <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
        Certificate Verification
      </h1>
      <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px' }}>
        Upload your certificate to verify its authenticity
      </p>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '2px dashed #d1d5db',
        textAlign: 'center'
      }}>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>Drag & drop your certificate or click to upload</p>
        <button style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Select Certificate
        </button>
      </div>
    </div>
  </div>
);

const InstitutionPage = () => (
  <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%)' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>
        Institution Portal
      </h1>
      <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px', textAlign: 'center' }}>
        Upload and manage certificates for your students
      </p>
      
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Institution Name
          </label>
          <input
            type="text"
            placeholder="Enter your institution name"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Certificate File
          </label>
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Upload certificate file</p>
            <button style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Choose File
            </button>
          </div>
        </div>
        
        <button style={{
          width: '100%',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: 'white',
          border: 'none',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Upload Certificate
        </button>
      </div>
    </div>
  </div>
);

// Main App Component with Providers
const MainApp = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div style={{ minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <AppContent />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default MainApp;