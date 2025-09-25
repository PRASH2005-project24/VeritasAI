import React, { useState, useRef, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import apiService from './services/api.js';
import './App_ExactMatch.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-content">
          <div className="container">
            <div className="error-boundary">
              <h1>🚨 Something went wrong</h1>
              <div className="error-details">
                <p>The application encountered an unexpected error.</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                    window.location.href = '/';
                  }}
                >
                  🏠 Go to Home
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => window.location.reload()}
                  style={{ marginLeft: '1rem' }}
                >
                  🔄 Reload Page
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                  <summary>Error Details (Development Only)</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', marginTop: '1rem' }}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Authentication Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('veritasai_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('veritasai_user');
  };

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('veritasai_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('veritasai_user');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Navigation Component
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          VeritasAI
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && (
            <>
              {/* Show Student link for students and admins */}
              {(user?.role === 'student' || user?.role === 'admin') && (
                <Link to="/student" className="nav-link">Student</Link>
              )}
              {/* Show Verifier link for verifiers and admins */}
              {(user?.role === 'verifier' || user?.role === 'admin') && (
                <Link to="/verifier" className="nav-link">Verifier</Link>
              )}
              {/* Show Institution link for institutions and admins */}
              {(user?.role === 'institution' || user?.role === 'admin') && (
                <Link to="/institution" className="nav-link">Institution</Link>
              )}
              {/* Admin link only for admins */}
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <Link to="/agent" className="nav-link">MCP Agent</Link>
            </>
          )}
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-welcome">Welcome, {user?.name || user?.email}</span>
              <button className="logout-btn" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Main Hero Section
const HeroSection = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [uploadMode, setUploadMode] = useState(null); // 'upload' or 'verify'
  const fileInputRef = useRef();

  const handleFileSelect = (mode) => {
    setUploadMode(mode);
    setVerificationResult(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFile(file);
    
    if (uploadMode === 'verify') {
      handleVerifyCertificate(file);
    } else if (uploadMode === 'upload') {
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
          reason: error.message || 'Network error - please check if the backend server is running'
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
      formData.append('institutionName', 'Demo Institution');
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
          reason: error.message || 'Network error - please check if the backend server is running'
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="hero-section">
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
              className="btn-upload"
              onClick={() => handleFileSelect('upload')}
              disabled={isUploading}
            >
              {isUploading && uploadMode === 'upload' ? 'Uploading...' : 'Upload Certificate'}
            </button>
            <button 
              className="btn-verify"
              onClick={() => handleFileSelect('verify')}
              disabled={isUploading}
            >
              {isUploading && uploadMode === 'verify' ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          {/* Loading State */}
          {isUploading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                {uploadMode === 'verify' ? 'Verifying certificate...' : 'Processing upload...'}
              </p>
            </div>
          )}

          {/* Results Display */}
          {verificationResult && !isUploading && (
            <div className="result-container">
              {verificationResult.status === 'valid' && (
                <div className="result-success">
                  <div className="result-icon success">✓</div>
                  <div className="result-content">
                    <h3>Certificate Verified Successfully!</h3>
                    <div className="result-details">
                      <p><strong>Student:</strong> {verificationResult.certificate?.studentName || 'N/A'}</p>
                      <p><strong>Course:</strong> {verificationResult.certificate?.courseName || 'N/A'}</p>
                      <p><strong>Institution:</strong> {verificationResult.certificate?.institutionName || 'N/A'}</p>
                      <p><strong>Issue Date:</strong> {verificationResult.certificate?.issueDate || 'N/A'}</p>
                      {verificationResult.certificate?.grade && (
                        <p><strong>Grade:</strong> {verificationResult.certificate.grade}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {verificationResult.status === 'uploaded' && (
                <div className="result-success">
                  <div className="result-icon success">✓</div>
                  <div className="result-content">
                    <h3>Certificate Uploaded Successfully!</h3>
                    <div className="result-details">
                      <p><strong>Certificate ID:</strong> {verificationResult.certificate?.id}</p>
                      <p><strong>Student:</strong> {verificationResult.certificate?.extractedData?.studentName || 'Extracted from OCR'}</p>
                      <p><strong>Status:</strong> Ready for verification</p>
                    </div>
                    {verificationResult.certificate?.qrCodeUrl && (
                      <div className="qr-code-container">
                        <p><strong>QR Code for Verification:</strong></p>
                        <img 
                          src={apiService.getFileUrl(verificationResult.certificate.qrCodeUrl)}
                          alt="QR Code for Certificate Verification"
                          className="qr-code"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(verificationResult.status === 'invalid' || verificationResult.status === 'not_found' || verificationResult.status === 'error') && (
                <div className="result-error">
                  <div className="result-icon error">✗</div>
                  <div className="result-content">
                    <h3>
                      {verificationResult.status === 'not_found' ? 'Certificate Not Found' :
                       verificationResult.status === 'invalid' ? 'Certificate Invalid' : 
                       'Verification Error'}
                    </h3>
                    <p>{verificationResult.verification?.reason || 'Unknown error occurred'}</p>
                    {verificationResult.verification?.details && (
                      <p className="error-details">{verificationResult.verification.details}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="hero-image">
          <div className="certificate-visual">
            <div className="certificate-card">
              {/* Top verification badges */}
              <div className="verification-badge top">
                <div className="check-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              
              {/* Certificate content lines */}
              <div className="certificate-content">
                <div className="cert-line long"></div>
                <div className="cert-line medium"></div>
                <div className="cert-line short"></div>
                <div className="cert-line medium"></div>
              </div>
              
              {/* Bottom section with signature and QR */}
              <div className="certificate-footer">
                <div className="verification-badge bottom">
                  <div className="check-circle small">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
                <div className="signature-area">
                  <div className="signature-line"></div>
                </div>
                <div className="qr-code-area">
                  <div className="qr-pattern">
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                    <div className="qr-square"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => (
  <section className="features-section">
    <div className="features-container">
      <h2 className="features-title">Features</h2>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Blockchain Security</h3>
          <p>Immutable certificate records secured by distributed ledger technology</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered OCR</h3>
          <p>Advanced machine learning algorithms extract and verify certificate data</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Verification</h3>
          <p>Real-time certificate validation with immediate results and fraud detection</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>QR Code Integration</h3>
          <p>Generate and scan QR codes for quick and easy certificate verification</p>
        </div>
      </div>
    </div>
  </section>
);

// Role-Specific Pages
const StudentPage = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFile(file);
    handleVerifyCertificate(file);
  };

  const handleVerifyCertificate = async (file) => {
    if (!file) return;
    
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await apiService.verifyCertificate(formData);
      setVerificationResult(response);
      
      // Add to verification history
      const historyItem = {
        id: Date.now(),
        fileName: file.name,
        status: response.status,
        timestamp: new Date().toLocaleString(),
        studentName: response.certificate?.studentName || 'N/A',
        courseName: response.certificate?.courseName || 'N/A',
        institution: response.certificate?.institutionName || 'N/A'
      };
      setVerificationHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 verifications
    } catch (error) {
      const errorResult = {
        status: 'error',
        verification: {
          isValid: false,
          reason: error.message || 'Verification failed'
        }
      };
      setVerificationResult(errorResult);
      
      // Add error to history too
      const historyItem = {
        id: Date.now(),
        fileName: file.name,
        status: 'error',
        timestamp: new Date().toLocaleString(),
        studentName: 'N/A',
        courseName: 'N/A',
        institution: 'N/A',
        error: error.message || 'Verification failed'
      };
      setVerificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <h1>Student Portal</h1>
        <p>Verify your certificates to prove their authenticity to employers and institutions.</p>
        
        <div className="role-grid">
          <div className="role-card">
            <h2>Certificate Verification</h2>
            <p>Upload your certificate to verify its authenticity and get instant results.</p>
            
            <button 
              className="btn-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Select Certificate to Verify'}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

            {isVerifying && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Verifying your certificate...</p>
              </div>
            )}

            {verificationResult && !isVerifying && (
              <div className="result-container">
                {verificationResult.status === 'valid' ? (
                  <div className="result-success">
                    <div className="result-icon success">✓</div>
                    <div className="result-content">
                      <h3>Certificate Verified Successfully!</h3>
                      <div className="result-details">
                        <p><strong>Student:</strong> {verificationResult.certificate?.studentName}</p>
                        <p><strong>Course:</strong> {verificationResult.certificate?.courseName}</p>
                        <p><strong>Institution:</strong> {verificationResult.certificate?.institutionName}</p>
                        <p><strong>Issue Date:</strong> {verificationResult.certificate?.issueDate}</p>
                        <p><strong>Status:</strong> <span style={{color: '#4caf50', fontWeight: 'bold'}}>AUTHENTIC</span></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="result-error">
                    <div className="result-icon error">✗</div>
                    <div className="result-content">
                      <h3>Verification Failed</h3>
                      <p>{verificationResult.verification?.reason}</p>
                      <p><strong>Status:</strong> <span style={{color: '#f44336', fontWeight: 'bold'}}>FAILED</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="role-card">
            <h2>Recent Verifications</h2>
            <div className="verification-history">
              {verificationHistory.length === 0 ? (
                <p>No verifications yet. Upload a certificate to get started.</p>
              ) : (
                verificationHistory.map((item) => (
                  <div key={item.id} className={`history-item ${item.status}`}>
                    <div className="history-details">
                      <p><strong>File:</strong> {item.fileName}</p>
                      <p><strong>Student:</strong> {item.studentName}</p>
                      {item.status !== 'error' && (
                        <>
                          <p><strong>Course:</strong> {item.courseName}</p>
                          <p><strong>Institution:</strong> {item.institution}</p>
                        </>
                      )}
                      {item.error && (
                        <p><strong>Error:</strong> {item.error}</p>
                      )}
                      <p><strong>Time:</strong> {item.timestamp}</p>
                    </div>
                    <div className={`status-badge ${item.status}`}>
                      {item.status === 'valid' ? '✓ Verified' : 
                       item.status === 'error' ? '✗ Error' : 
                       '✗ Invalid'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifierPage = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('upload'); // 'upload', 'qr', 'id'
  const [dashboardStats, setDashboardStats] = useState({
    totalVerifications: 0,
    validCertificates: 0,
    invalidCertificates: 0,
    todayVerifications: 0
  });
  const fileInputRef = useRef();

  // Update dashboard stats when verification history changes
  React.useEffect(() => {
    const today = new Date().toDateString();
    const todayCount = verificationHistory.filter(item => 
      new Date(item.timestamp).toDateString() === today
    ).length;
    const validCount = verificationHistory.filter(item => item.status === 'valid').length;
    const invalidCount = verificationHistory.filter(item => item.status !== 'valid').length;

    setDashboardStats({
      totalVerifications: verificationHistory.length,
      validCertificates: validCount,
      invalidCertificates: invalidCount,
      todayVerifications: todayCount
    });
  }, [verificationHistory]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFile(file);
    handleVerifyCertificate(file);
  };

  const handleVerifyCertificate = async (file) => {
    if (!file) return;
    
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await apiService.verifyCertificate(formData);
      setVerificationResult(response);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        fileName: file.name,
        status: response.status,
        timestamp: new Date().toLocaleString(),
        studentName: response.certificate?.studentName || 'N/A',
        method: 'File Upload'
      };
      setVerificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } catch (error) {
      setVerificationResult({
        status: 'error',
        verification: {
          isValid: false,
          reason: error.message || 'Verification failed'
        }
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyById = async (id) => {
    if (!id) return;
    
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await apiService.verifyCertificateById(id);
      setVerificationResult(response);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        fileName: `Certificate ID: ${id}`,
        status: response.status,
        timestamp: new Date().toLocaleString(),
        studentName: response.certificate?.studentName || 'N/A',
        method: 'Certificate ID'
      };
      setVerificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } catch (error) {
      setVerificationResult({
        status: 'error',
        verification: {
          isValid: false,
          reason: error.message || 'Certificate ID not found'
        }
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const simulateQRScan = () => {
    // Simulate QR code scanning (in production, this would use device camera)
    const mockCertificateId = 'CERT_' + Date.now() + '_demo';
    setCertificateId(mockCertificateId);
    setQrScannerActive(false);
    alert(`QR Code Scanned! Certificate ID: ${mockCertificateId}\n\nClick "Verify by ID" to verify this certificate.`);
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Verifier Dashboard</h1>
            <p>Verify certificate authenticity and track verification activities</p>
          </div>
        </div>
        
        {/* Dashboard Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{dashboardStats.totalVerifications}</h3>
              <p>Total Verifications</p>
            </div>
          </div>
          <div className="stat-card valid">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{dashboardStats.validCertificates}</h3>
              <p>Valid Certificates</p>
            </div>
          </div>
          <div className="stat-card invalid">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{dashboardStats.invalidCertificates}</h3>
              <p>Invalid Certificates</p>
            </div>
          </div>
          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{dashboardStats.todayVerifications}</h3>
              <p>Today's Verifications</p>
            </div>
          </div>
        </div>
        
        <div className="role-grid">
          <div className="role-card">
            <h2>Certificate Verification</h2>
            <p>Choose your preferred verification method:</p>
            
            {/* Verification Method Selector */}
            <div className="verification-methods">
              <button 
                className={`method-btn ${verificationMethod === 'upload' ? 'active' : ''}`}
                onClick={() => setVerificationMethod('upload')}
              >
                📁 Upload File
              </button>
              <button 
                className={`method-btn ${verificationMethod === 'qr' ? 'active' : ''}`}
                onClick={() => setVerificationMethod('qr')}
              >
                📱 Scan QR Code
              </button>
              <button 
                className={`method-btn ${verificationMethod === 'id' ? 'active' : ''}`}
                onClick={() => setVerificationMethod('id')}
              >
                🔢 Enter ID
              </button>
            </div>

            {/* Upload Method */}
            {verificationMethod === 'upload' && (
              <div className="verification-method-content">
                <p>Upload a certificate file to verify its authenticity.</p>
                <button 
                  className="btn-upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : '📄 Choose File to Verify'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* QR Scanner Method */}
            {verificationMethod === 'qr' && (
              <div className="verification-method-content">
                <p>Use your device camera to scan a certificate QR code.</p>
                {qrScannerActive ? (
                  <div className="qr-scanner">
                    <div className="qr-scanner-frame">
                      <div className="qr-scanner-overlay">
                        <div className="qr-scanner-corner tl"></div>
                        <div className="qr-scanner-corner tr"></div>
                        <div className="qr-scanner-corner bl"></div>
                        <div className="qr-scanner-corner br"></div>
                      </div>
                      <p>Position QR code within the frame</p>
                    </div>
                    <div className="qr-scanner-actions">
                      <button className="btn-secondary" onClick={() => setQrScannerActive(false)}>
                        Cancel
                      </button>
                      <button className="btn-upload" onClick={simulateQRScan}>
                        🔍 Simulate Scan
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn-upload"
                    onClick={() => setQrScannerActive(true)}
                    disabled={isVerifying}
                  >
                    📱 Start Camera Scanner
                  </button>
                )}
              </div>
            )}

            {/* Certificate ID Method */}
            {verificationMethod === 'id' && (
              <div className="verification-method-content">
                <p>Enter the certificate ID to verify directly.</p>
                <div className="id-input-container">
                  <input
                    type="text"
                    placeholder="Enter certificate ID (e.g., CERT_123456_abc)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="cert-id-input"
                  />
                  <button 
                    className="btn-upload"
                    onClick={() => handleVerifyById(certificateId)}
                    disabled={isVerifying || !certificateId.trim()}
                  >
                    {isVerifying ? 'Verifying...' : '🔍 Verify by ID'}
                  </button>
                </div>
              </div>
            )}

            {isVerifying && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Verifying certificate authenticity...</p>
              </div>
            )}

            {verificationResult && !isVerifying && (
              <div className="result-container">
                {verificationResult.status === 'valid' ? (
                  <div className="result-success">
                    <div className="result-icon success">✓</div>
                    <div className="result-content">
                      <h3>Certificate is Authentic</h3>
                      <div className="result-details">
                        <p><strong>Student:</strong> {verificationResult.certificate?.studentName}</p>
                        <p><strong>Course:</strong> {verificationResult.certificate?.courseName}</p>
                        <p><strong>Institution:</strong> {verificationResult.certificate?.institutionName}</p>
                        <p><strong>Issue Date:</strong> {verificationResult.certificate?.issueDate}</p>
                        <p><strong>Verification Status:</strong> <span style={{color: '#4caf50', fontWeight: 'bold'}}>AUTHENTIC</span></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="result-error">
                    <div className="result-icon error">✗</div>
                    <div className="result-content">
                      <h3>Certificate Not Verified</h3>
                      <p>{verificationResult.verification?.reason}</p>
                      <p><strong>Status:</strong> <span style={{color: '#f44336', fontWeight: 'bold'}}>SUSPICIOUS</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="role-card">
            <h2>Recent Verifications</h2>
            <div className="verification-history">
              {verificationHistory.length === 0 ? (
                <p>No verifications yet. Upload a certificate to get started.</p>
              ) : (
                verificationHistory.map((item) => (
                  <div key={item.id} className={`history-item ${item.status}`}>
                    <div className="history-details">
                      <p><strong>{item.fileName}</strong></p>
                      <p>Student: {item.studentName}</p>
                      <p>Time: {item.timestamp}</p>
                    </div>
                    <div className={`status-badge ${item.status}`}>
                      {item.status === 'valid' ? '✓ Valid' : '✗ Invalid'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstitutionPage = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [institutionInfo, setInstitutionInfo] = useState({
    name: 'Demo University',
    email: 'admin@university.edu'
  });
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFile(file);
    handleUploadCertificate(file);
  };

  const handleUploadCertificate = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const formData = new FormData();
      formData.append('certificate', file);
      formData.append('institutionName', institutionInfo.name);
      formData.append('issuerEmail', institutionInfo.email);

      const response = await apiService.uploadCertificate(formData);
      setUploadResult({
        status: 'success',
        certificate: response.certificate
      });
    } catch (error) {
      setUploadResult({
        status: 'error',
        message: error.message || 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <h1>Institution Portal</h1>
        <p>Upload and manage certificates issued by your institution to the blockchain.</p>
        
        <div className="role-grid">
          <div className="role-card">
            <h2>Institution Information</h2>
            <div className="form-group">
              <label>Institution Name</label>
              <input 
                type="text" 
                value={institutionInfo.name}
                onChange={(e) => setInstitutionInfo(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div className="form-group">
              <label>Official Email</label>
              <input 
                type="email" 
                value={institutionInfo.email}
                onChange={(e) => setInstitutionInfo(prev => ({...prev, email: e.target.value}))}
              />
            </div>
          </div>

          <div className="role-card">
            <h2>Upload Certificate</h2>
            <p>Upload certificates to register them on the blockchain for verification.</p>
            
            <button 
              className="btn-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Select Certificate to Upload'}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

            {isUploading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Processing and uploading certificate...</p>
              </div>
            )}

            {uploadResult && !isUploading && (
              <div className="result-container">
                {uploadResult.status === 'success' ? (
                  <div className="result-success">
                    <div className="result-icon success">✓</div>
                    <div className="result-content">
                      <h3>Certificate Uploaded Successfully!</h3>
                      <div className="result-details">
                        <p><strong>Certificate ID:</strong> {uploadResult.certificate?.id}</p>
                        <p><strong>Student:</strong> {uploadResult.certificate?.extractedData?.studentName || 'Extracted from OCR'}</p>
                        <p><strong>Course:</strong> {uploadResult.certificate?.extractedData?.courseName || 'N/A'}</p>
                        <p><strong>Status:</strong> Registered on Blockchain</p>
                      </div>
                      {uploadResult.certificate?.qrCodeUrl && (
                        <div className="qr-code-container">
                          <p><strong>QR Code for Verification:</strong></p>
                          <img 
                            src={apiService.getFileUrl(uploadResult.certificate.qrCodeUrl)}
                            alt="QR Code"
                            className="qr-code"
                          />
                          <div className="qr-actions">
                            <button 
                              className="btn-download"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = apiService.getFileUrl(uploadResult.certificate.qrCodeUrl);
                                link.download = `certificate-qr-${uploadResult.certificate.id}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              📱 Download QR Code
                            </button>
                            <button 
                              className="btn-copy"
                              onClick={() => {
                                const verifyUrl = `${window.location.origin}/verify/${uploadResult.certificate.id}`;
                                navigator.clipboard.writeText(verifyUrl).then(() => {
                                  alert('Verification URL copied to clipboard!');
                                });
                              }}
                            >
                              🔗 Copy Verify Link
                            </button>
                          </div>
                          <p><em>Students and employers can scan this QR code or use the link for instant verification</em></p>
                          <div className="verification-info">
                            <p><strong>Certificate ID:</strong> {uploadResult.certificate.id}</p>
                            <p><strong>Direct Link:</strong> <code>{window.location.origin}/verify/{uploadResult.certificate.id}</code></p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="result-error">
                    <div className="result-icon error">✗</div>
                    <div className="result-content">
                      <h3>Upload Failed</h3>
                      <p>{uploadResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setIsLoading(false);
  };

  const loadCertificates = async () => {
    try {
      const response = await apiService.getAllCertificates();
      setCertificates(response.certificates || []);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  React.useEffect(() => {
    loadAnalytics();
    loadCertificates();
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p>Monitor certificate verification activities and system analytics.</p>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {analytics && (
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Total Certificates</h3>
                  <div className="analytics-number">{analytics.totalCertificates}</div>
                </div>
                <div className="analytics-card">
                  <h3>Valid Certificates</h3>
                  <div className="analytics-number">{analytics.validCertificates}</div>
                </div>
                <div className="analytics-card">
                  <h3>Fraud Attempts</h3>
                  <div className="analytics-number">{analytics.fraudAttempts}</div>
                </div>
                <div className="analytics-card">
                  <h3>Verification Rate</h3>
                  <div className="analytics-number">{analytics.verificationRate}%</div>
                </div>
              </div>
            )}

            <div className="role-card">
              <h2>Recent Certificates</h2>
              <div className="certificates-table">
                {certificates.length === 0 ? (
                  <p>No certificates found.</p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Student Name</th>
                          <th>Course</th>
                          <th>Institution</th>
                          <th>Upload Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.slice(0, 10).map((cert) => (
                          <tr key={cert.id}>
                            <td>
                              <button 
                                className="cert-id-link"
                                onClick={() => {
                                  setSelectedCertificate(cert);
                                  setShowCertificateModal(true);
                                }}
                              >
                                {cert.id}
                              </button>
                            </td>
                            <td>{cert.studentName || 'N/A'}</td>
                            <td>{cert.courseName || 'N/A'}</td>
                            <td>{cert.institutionName}</td>
                            <td>{new Date(cert.uploadTimestamp).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${cert.status}`}>{cert.status}</span>
                              <button 
                                className="view-details-btn"
                                onClick={() => {
                                  setSelectedCertificate(cert);
                                  setShowCertificateModal(true);
                                }}
                              >
                                🔍 View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Certificate Details Modal */}
        {showCertificateModal && selectedCertificate && (
          <div className="modal-overlay" onClick={() => setShowCertificateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Certificate Details</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCertificateModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="cert-details-grid">
                  <div className="cert-detail">
                    <label>Certificate ID:</label>
                    <span className="cert-value">{selectedCertificate.id}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Student Name:</label>
                    <span className="cert-value">{selectedCertificate.studentName || 'N/A'}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Course Name:</label>
                    <span className="cert-value">{selectedCertificate.courseName || 'N/A'}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Institution:</label>
                    <span className="cert-value">{selectedCertificate.institutionName}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Issue Date:</label>
                    <span className="cert-value">{selectedCertificate.issueDate || 'N/A'}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Upload Date:</label>
                    <span className="cert-value">{new Date(selectedCertificate.uploadTimestamp).toLocaleString()}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedCertificate.status}`}>{selectedCertificate.status}</span>
                  </div>
                  <div className="cert-detail">
                    <label>Hash (First 32 chars):</label>
                    <span className="cert-hash">{selectedCertificate.hash}</span>
                  </div>
                </div>
                
                <div className="validation-details">
                  <h3>Validation Information</h3>
                  {selectedCertificate.status === 'valid' ? (
                    <div className="validation-success">
                      <div className="validation-icon">✓</div>
                      <div>
                        <h4>Certificate is Valid</h4>
                        <p>This certificate has been successfully validated against our blockchain records.</p>
                        <ul>
                          <li>✓ Hash matches blockchain record</li>
                          <li>✓ Institution signature verified</li>
                          <li>✓ No tampering detected</li>
                          <li>✓ Certificate data integrity confirmed</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="validation-error">
                      <div className="validation-icon">✗</div>
                      <div>
                        <h4>Certificate Issues Detected</h4>
                        <p>This certificate has validation concerns:</p>
                        <ul>
                          <li>✗ Potential data inconsistency</li>
                          <li>✗ Requires manual review</li>
                          <li>✗ May need re-verification</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="cert-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      const verifyUrl = `${window.location.origin}/verify/${selectedCertificate.id}`;
                      navigator.clipboard.writeText(verifyUrl);
                      alert('Verification URL copied to clipboard!');
                    }}
                  >
                    🔗 Copy Verify Link
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      alert('Detailed audit log would be displayed here in production');
                    }}
                  >
                    📊 View Audit Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MCPAgentPage = () => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! I\'m your VeritasAI assistant. I can help you with certificate verification, blockchain queries, and fraud detection. How can I assist you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', message: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      let botResponse = '';
      const msg = inputMessage.toLowerCase();
      
      if (msg.includes('verify') || msg.includes('certificate')) {
        botResponse = 'To verify a certificate, you can upload it through the Student or Verifier portal. Our AI-powered OCR will extract the text and compare it against our blockchain records for authenticity verification.';
      } else if (msg.includes('upload') || msg.includes('institution')) {
        botResponse = 'Institutions can upload certificates through the Institution portal. The system will process the certificate using OCR, generate a unique hash, and create a QR code for easy verification.';
      } else if (msg.includes('fraud') || msg.includes('fake')) {
        botResponse = 'Our fraud detection system uses cryptographic hashing to create unique fingerprints for each certificate. Any tampering or forgery will result in a hash mismatch, immediately flagging the document as suspicious.';
      } else if (msg.includes('blockchain')) {
        botResponse = 'VeritasAI uses blockchain technology to create immutable records of certificates. Once a certificate is registered, its hash is stored on the blockchain, ensuring it cannot be altered or forged.';
      } else if (msg.includes('help') || msg.includes('how')) {
        botResponse = 'I can help you with: \n• Certificate verification process\n• Understanding blockchain security\n• Fraud detection capabilities\n• Institution certificate upload\n• Technical questions about VeritasAI\n\nWhat would you like to know more about?';
      } else {
        botResponse = 'I understand you\'re asking about "' + inputMessage + '". Could you please be more specific? I can help with certificate verification, fraud detection, blockchain technology, or general questions about VeritasAI.';
      }

      const aiMessage = { id: Date.now() + 1, type: 'bot', message: botResponse };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="page-content">
      <div className="container">
        <h1>MCP Agent - AI Assistant</h1>
        <p>Get intelligent assistance with certificate verification, fraud detection, and blockchain queries.</p>
        
        <div className="agent-container">
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`message ${msg.type}`}>
                  <div className="message-content">
                    {msg.message.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="message bot">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about certificate verification, fraud detection, or blockchain..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isProcessing || !inputMessage.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </div>

          <div className="agent-info">
            <h3>AI Capabilities</h3>
            <div className="capability-list">
              <div className="capability-item">
                <span className="capability-icon">🔍</span>
                <div>
                  <h4>Certificate Analysis</h4>
                  <p>Deep analysis of certificate authenticity and fraud patterns</p>
                </div>
              </div>
              <div className="capability-item">
                <span className="capability-icon">🛡️</span>
                <div>
                  <h4>Fraud Detection</h4>
                  <p>Advanced algorithms to identify tampered or forged certificates</p>
                </div>
              </div>
              <div className="capability-item">
                <span className="capability-icon">⛓️</span>
                <div>
                  <h4>Blockchain Queries</h4>
                  <p>Real-time blockchain verification and hash validation</p>
                </div>
              </div>
              <div className="capability-item">
                <span className="capability-icon">📊</span>
                <div>
                  <h4>Analytics Insights</h4>
                  <p>Statistical analysis and reporting on verification trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Other Pages
const AboutPage = () => (
  <div className="page-content">
    <div className="container">
      <h1>About VeritasAI</h1>
      <p>VeritasAI revolutionizes certificate verification by combining blockchain technology with artificial intelligence. Our platform ensures the authenticity and integrity of educational certificates, preventing fraud and building trust in academic credentials.</p>
      <div className="about-features">
        <div className="about-feature">
          <h3>Mission</h3>
          <p>To eliminate certificate fraud and create a trusted ecosystem for academic verification.</p>
        </div>
        <div className="about-feature">
          <h3>Technology</h3>
          <p>Cutting-edge AI and blockchain technologies working together for maximum security.</p>
        </div>
        <div className="about-feature">
          <h3>Impact</h3>
          <p>Protecting institutions, employers, and students from fraudulent academic credentials.</p>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="page-content">
    <div className="container">
      <h1>Contact Us</h1>
      <p>Get in touch with our team for support, partnerships, or inquiries.</p>
      <div className="contact-grid">
        <div className="contact-card">
          <h3>Business Inquiries</h3>
          <p>Email: business@veritasai.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div className="contact-card">
          <h3>Technical Support</h3>
          <p>Email: support@veritasai.com</p>
          <p>Phone: +1 (555) 234-5678</p>
        </div>
        <div className="contact-card">
          <h3>Partnership</h3>
          <p>Email: partners@veritasai.com</p>
          <p>Phone: +1 (555) 345-6789</p>
        </div>
      </div>
    </div>
  </div>
);

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isLogging, setIsLogging] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);

    // Demo authentication - in production, this would be an API call
    setTimeout(() => {
      const userData = {
        email,
        name: email.split('@')[0],
        role: selectedRole,
        loginTime: new Date().toISOString()
      };
      
      login(userData);
      setIsLogging(false);
    }, 1500);
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="login-container">
          <h1>Login to VeritasAI</h1>
          <p className="login-subtitle">Secure certificate verification platform</p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
              >
                <option value="student">Student</option>
                <option value="verifier">Verifier</option>
                <option value="institution">Institution</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="login-submit"
              disabled={isLogging || !email || !password}
            >
              {isLogging ? (
                <>
                  <div className="login-spinner"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="demo-credentials">
            <h3>Demo Credentials:</h3>
            <div className="demo-user">
              <strong>Student:</strong> student@university.edu / password123
            </div>
            <div className="demo-user">
              <strong>Verifier:</strong> verifier@company.com / password123
            </div>
            <div className="demo-user">
              <strong>Institution:</strong> admin@university.edu / password123
            </div>
            <div className="demo-user">
              <strong>Admin:</strong> admin@veritasai.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiresAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiresAdmin && user?.role !== 'admin') {
    return (
      <div className="page-content">
        <div className="container">
          <div className="access-denied">
            <h1>🚫 Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <p>Admin access required.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return children;
};

// Main App Component
function AppContent() {
  // Add debugging for navigation issues
  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    };
    const handleError = (event) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="app">
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <FeaturesSection />
              </>
            } />
            <Route path="/student" element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            } />
            <Route path="/verifier" element={
              <ProtectedRoute>
                <VerifierPage />
              </ProtectedRoute>
            } />
            <Route path="/institution" element={
              <ProtectedRoute>
                <InstitutionPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiresAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/agent" element={
              <ProtectedRoute>
                <MCPAgentPage />
              </ProtectedRoute>
            } />
            <Route path="/verify/:certificateId" element={
              <ErrorBoundary>
                <CertificateVerifyPage />
              </ErrorBoundary>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={
              <div className="page-content">
                <div className="container">
                  <div className="error-boundary">
                    <h1>🔍 Page Not Found</h1>
                    <div className="error-details">
                      <p>The page you're looking for doesn't exist.</p>
                      <button 
                        className="btn-primary"
                        onClick={() => window.location.href = '/'}
                      >
                        🏠 Go to Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

// Certificate Verify Page (for QR code links)
const CertificateVerifyPage = () => {
  const { certificateId } = useParams();
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const verifyCertificate = async () => {
      if (!certificateId) {
        setError('No certificate ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Verifying certificate ID:', certificateId);
        const response = await apiService.verifyCertificateById(certificateId);
        console.log('Verification response:', response);
        setVerificationResult(response);
        setError(null);
      } catch (error) {
        console.error('Verification error:', error);
        setError(error.message || 'Verification failed');
        setVerificationResult({
          status: 'error',
          verification: {
            isValid: false,
            reason: error.message || 'Certificate not found or verification failed'
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId]);

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verifying certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <button 
            className="btn-secondary back-btn"
            onClick={() => window.history.back()}
            style={{ marginBottom: '1rem' }}
          >
            ← Back
          </button>
          <h1>Certificate Verification Result</h1>
          <p>Certificate ID: <code>{certificateId || 'Not provided'}</code></p>
        </div>
        
        {error && (
          <div className="result-container">
            <div className="result-error">
              <div className="result-icon error">✗</div>
              <div className="result-content">
                <h3>Verification Error</h3>
                <p>{error}</p>
                <p><em>Please check if the certificate ID is correct and the backend server is running.</em></p>
              </div>
            </div>
          </div>
        )}
        
        {verificationResult && !error && (
          <div className="result-container">
            {verificationResult.status === 'valid' ? (
              <div className="result-success">
                <div className="result-icon success">✓</div>
                <div className="result-content">
                  <h3>Certificate is Valid!</h3>
                  <div className="result-details">
                    <p><strong>Student:</strong> {verificationResult.certificate?.studentName || 'N/A'}</p>
                    <p><strong>Course:</strong> {verificationResult.certificate?.courseName || 'N/A'}</p>
                    <p><strong>Institution:</strong> {verificationResult.certificate?.institutionName || 'N/A'}</p>
                    <p><strong>Issue Date:</strong> {verificationResult.certificate?.issueDate || 'N/A'}</p>
                  </div>
                  <div className="verification-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => window.location.href = '/'}
                    >
                      🏠 Go to Home
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="result-error">
                <div className="result-icon error">✗</div>
                <div className="result-content">
                  <h3>Certificate Not Verified</h3>
                  <p>{verificationResult.verification?.reason}</p>
                  <div className="verification-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => window.location.href = '/'}
                    >
                      🏠 Go to Home
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
