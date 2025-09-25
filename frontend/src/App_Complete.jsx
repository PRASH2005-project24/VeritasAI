import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import apiService from './services/api.js';
import { LoadingSpinner, SuccessMessage, ErrorMessage, LandingPage } from './App_Integrated.jsx';
import { VerifyPage, InstitutionPage } from './App_Integrated_Part2.jsx';
import './Working.css';

// Navbar Component
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
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
        <Link to="/verify" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Verify</Link>
        <Link to="/institution" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Institution</Link>
        <Link to="/admin" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Admin</Link>
        <Link to="/agent" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>AI Agent</Link>
        <button style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          padding: '10px 24px',
          borderRadius: '25px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Login
        </button>
      </div>
    </div>
  </nav>
);

// Admin Dashboard with Real Backend Data
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
      
      // Load analytics and certificates in parallel
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fecaca 100%)', padding: '80px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '20px', color: '#6b7280' }}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fecaca 100%)', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚙️</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Admin <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280' }}>Monitor system analytics and blockchain transactions</p>
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
              <div key={index} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', color: stat.color }}>{stat.icon}</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{stat.value}</div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{stat.label}</h3>
                {stat.label === 'Valid Certificates' && analytics.verificationRate && (
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    {analytics.verificationRate}% success rate
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certificates List */}
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>Recent Certificates</h2>
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
                cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {certificates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No certificates found</h3>
              <p>Upload some certificates through the Institution portal to see them here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Certificate ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Student Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Course</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Institution</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Upload Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert, index) => (
                    <tr key={cert.id} style={{ borderBottom: '1px solid #f3f4f6', ':hover': { backgroundColor: '#f9fafb' } }}>
                      <td style={{ padding: '12px' }}>
                        <code style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                          {cert.id}
                        </code>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{cert.studentName || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{cert.courseName || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{cert.institutionName}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                        {new Date(cert.uploadTimestamp).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: cert.status === 'valid' ? '#dcfce7' : '#fef2f2',
                          color: cert.status === 'valid' ? '#166534' : '#991b1b',
                          padding: '4px 12px',
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
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌐</span> System Status
            </h3>
            <div style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
              All Systems Operational
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⛓️</span> Blockchain
            </h3>
            <div style={{ color: '#10b981', fontWeight: '600' }}>Connected & Synced</div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Last block: #1,234,567</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🕒</span> Last Update
            </h3>
            <div style={{ fontWeight: '600', color: '#374151' }}>
              {analytics?.lastUpdate ? new Date(analytics.lastUpdate).toLocaleString() : 'Just now'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Agent Page (Simple Chat Interface)
const AgentPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm the VeritasAI assistant. I can help you with certificate verification queries, fraud statistics, and system information. How can I assist you today?",
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('verify') || lowerQuestion.includes('verification')) {
      return "To verify a certificate, navigate to the Verify page and upload your certificate file. Our AI will analyze it against our blockchain records and provide instant verification results.";
    } else if (lowerQuestion.includes('upload') || lowerQuestion.includes('institution')) {
      return "Institutions can upload certificates through our Institution Portal. You'll need to provide your institution name, issuer email, and the certificate file. We'll generate a QR code and blockchain hash for verification.";
    } else if (lowerQuestion.includes('fraud') || lowerQuestion.includes('fake')) {
      return "Our system detects fraudulent certificates by comparing uploaded documents against our blockchain-secured database. Any tampering or modifications are immediately identified through hash comparison.";
    } else if (lowerQuestion.includes('how') || lowerQuestion.includes('work')) {
      return "VeritasAI uses AI-powered OCR to extract data from certificates, generates cryptographic hashes, and stores them on blockchain for immutable verification. This ensures certificates cannot be forged or tampered with.";
    } else {
      return "I can help you with certificate verification, institution uploads, fraud detection, and system information. Feel free to ask about any specific feature or process!";
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 50%, #fce7f3 100%)', padding: '80px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            AI <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Assistant</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280' }}>Get instant answers about certificate verification and system features</p>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          {/* Chat Messages */}
          <div style={{ height: '400px', background: '#f9fafb', borderRadius: '16px', padding: '24px', marginBottom: '24px', overflowY: 'auto' }}>
            {messages.map((message) => (
              <div key={message.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', flexDirection: message.type === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: message.type === 'ai' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {message.type === 'ai' ? 'AI' : 'You'}
                </div>
                <div style={{ 
                  background: message.type === 'ai' ? 'white' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  color: message.type === 'ai' ? '#111827' : 'white',
                  borderRadius: '16px', 
                  padding: '16px', 
                  maxWidth: '70%', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                }}>
                  <p style={{ margin: 0 }}>{message.content}</p>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7, 
                    marginTop: '8px',
                    color: message.type === 'ai' ? '#6b7280' : 'rgba(255,255,255,0.8)'
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
                <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                    <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }}></div>
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
              "What is blockchain verification?"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                style={{
                  background: '#f3e8ff',
                  border: '1px solid #e879f9',
                  color: '#a855f7',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="Ask me anything about certificate verification..."
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading || !inputValue.trim()}
              style={{
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
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
    const newMessage = {
      id: Date.now(),
      type,
      message,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);

    // Auto-remove message after 5 seconds
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

      {/* Global Messages */}
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