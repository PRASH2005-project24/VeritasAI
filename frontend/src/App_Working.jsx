import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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

// Landing Page Component
const LandingPage = () => (
  <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)' 
  }}>
    {/* Hero Section */}
    <div style={{ padding: '80px 20px 120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        {/* Left Content */}
        <div>
          <h1 style={{ 
            fontSize: '64px', 
            fontWeight: 'bold', 
            color: '#111827', 
            lineHeight: '1.1', 
            marginBottom: '24px',
            margin: 0
          }}>
            Trusted<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Certificate
            </span><br />
            Validation
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '40px', maxWidth: '500px' }}>
            Fight fake degrees with blockchain + AI
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/institution" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                Upload Certificate
              </button>
            </Link>
            <Link to="/verify" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                Verify Certificate
              </button>
            </Link>
          </div>
        </div>

        {/* Right Content - Certificate Mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            padding: '32px',
            position: 'relative',
            width: '400px',
            minHeight: '500px'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)',
              opacity: 0.3,
              borderRadius: '24px'
            }}></div>
            
            {/* Verification Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              background: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
            </div>

            {/* Certificate Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ height: '12px', background: '#93c5fd', borderRadius: '6px', width: '75%', marginBottom: '12px' }}></div>
                <div style={{ height: '12px', background: '#e5e7eb', borderRadius: '6px', width: '50%' }}></div>
              </div>

              {/* Main Content */}
              <div style={{
                background: '#eff6ff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <span style={{ color: 'white', fontSize: '20px' }}>✓</span>
                </div>
                <div style={{ height: '16px', background: '#60a5fa', borderRadius: '8px', width: '100%', marginBottom: '8px' }}></div>
                <div style={{ height: '16px', background: '#93c5fd', borderRadius: '8px', width: '67%' }}></div>
              </div>

              {/* Footer Content */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', width: '100%', marginBottom: '8px' }}></div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', width: '83%', marginBottom: '8px' }}></div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', width: '75%' }}></div>
              </div>

              {/* Signature and QR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ 
                  fontStyle: 'italic', 
                  fontSize: '24px', 
                  color: '#3b82f6', 
                  fontFamily: 'cursive' 
                }}>
                  Signature
                </div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '4px',
                  padding: '8px'
                }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} style={{ 
                      width: '4px', 
                      height: '4px', 
                      background: 'white', 
                      borderRadius: '50%' 
                    }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div style={{ background: 'white', padding: '100px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Features</h2>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px' }}>
          Advanced technology meets user-friendly design for secure certificate verification
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { icon: '🛡️', title: 'Blockchain Security', desc: 'Certificates anchored on blockchain for immutable verification' },
            { icon: '⚡', title: 'Instant Verification', desc: 'Get verification results in seconds with AI-powered OCR' },
            { icon: '🔒', title: 'Tamper Detection', desc: 'Advanced algorithms detect any document modifications' }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              padding: '32px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div style={{
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      padding: '100px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { value: '10+', label: 'Sample Certificates' },
            { value: '100%', label: 'Accuracy Rate' },
            { value: '<2s', label: 'Verification Time' },
            { value: '24/7', label: 'Availability' }
          ].map((stat, index) => (
            <div key={index}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA Section */}
    <div style={{ background: '#f9fafb', padding: '100px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
          Ready to Secure Your Certificates?
        </h2>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px' }}>
          Join institutions and verifiers worldwide who trust VeritasAI
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/verify" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              🔍 Verify Certificate
            </button>
          </Link>
          <Link to="/institution" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              🏢 Institution Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Other Pages (Simplified)
const VerifyPage = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)', padding: '80px 20px' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
        Certificate <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verification</span>
      </h1>
      <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '48px' }}>Upload your certificate to verify its authenticity instantly</p>
      
      <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px', marginBottom: '48px' }}>
        <div className="upload-area-working">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Upload Certificate</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Drag and drop your certificate here or click to browse</p>
          <button style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Select File
          </button>
        </div>
      </div>
    </div>
  </div>
);

const InstitutionPage = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)', padding: '80px 20px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏢</div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          Institution <span style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portal</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Issue certificates with blockchain anchoring and QR code generation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Upload Certificate</h2>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Institution Name</label>
            <input style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px' }} placeholder="Enter your institution name" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Issuer Email</label>
            <input style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px' }} placeholder="Enter issuer email" />
          </div>
          <div className="upload-area-working" style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>Upload Certificate Document</p>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Choose File
              </button>
            </div>
          </div>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Process Certificate
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Generated Assets</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '📱', title: 'QR Code', desc: 'Generated after successful upload' },
              { icon: '✍️', title: 'Digital Signature', desc: 'Cryptographic proof of authenticity' },
              { icon: '⛓️', title: 'Blockchain Hash', desc: 'Immutable record on blockchain' }
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', marginRight: '16px' }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminPage = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fecaca 100%)', padding: '80px 20px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚙️</div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          Admin <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Monitor system analytics and blockchain transactions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
        {[
          { label: 'Total Certificates', value: '10', icon: '📄', color: '#3b82f6' },
          { label: 'Valid Certificates', value: '10', icon: '✅', color: '#10b981' },
          { label: 'Fraud Attempts', value: '0', icon: '🚨', color: '#ef4444' },
          { label: 'Active Institutions', value: '5', icon: '🏢', color: '#8b5cf6' }
        ].map((stat, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', color: stat.color }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{stat.value}</div>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{stat.label}</h3>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AgentPage = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 50%, #fce7f3 100%)', padding: '80px 20px' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          AI <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Assistant</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Natural language queries for certificate verification and analytics</p>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px', marginBottom: '32px' }}>
        <div style={{ height: '400px', background: '#f9fafb', borderRadius: '16px', padding: '24px', marginBottom: '24px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
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
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px', maxWidth: '400px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <p style={{ margin: 0, color: '#111827' }}>
                Hello! I'm the VeritasAI assistant. I can help you with certificate verification queries, fraud statistics, and system information. How can I assist you today?
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
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
          <button style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/institution" element={<InstitutionPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;