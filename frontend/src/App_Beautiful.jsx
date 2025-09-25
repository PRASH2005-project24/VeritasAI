import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// Modern Navbar Component
const Navbar = () => (
  <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200/20 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <Link to="/" className="flex items-center space-x-3">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VeritasAI
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
          <Link to="/verify" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Verify</Link>
          <Link to="/institution" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Institution</Link>
          <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Admin</Link>
          <Link to="/agent" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">AI Agent</Link>
        </div>

        <div className="hidden md:block">
          <button className="bg-white text-gray-700 px-6 py-2.5 rounded-full border border-gray-300 font-medium hover:shadow-md transition-all duration-300">
            Login
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// Modern Landing Page
const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    {/* Hero Section */}
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Trusted <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Certificate
                </span> <br />
                Validation
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Fight fake degrees with blockchain + AI
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/institution">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Upload Certificate
                </button>
              </Link>
              <Link to="/verify">
                <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-300 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Verify Certificate
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Certificate Mockup */}
          <div className="relative">
            <div className="certificate-mockup">
              <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30"></div>
                
                {/* Verification badges */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Certificate content */}
                <div className="relative space-y-6">
                  {/* Header lines */}
                  <div className="space-y-3">
                    <div className="h-3 bg-blue-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                  </div>

                  {/* Main content area */}
                  <div className="bg-blue-50 rounded-2xl p-6 relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-300 rounded-full w-full"></div>
                      <div className="h-4 bg-blue-200 rounded-full w-2/3"></div>
                    </div>
                  </div>

                  {/* Footer content */}
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                  </div>

                  {/* QR Code and signature */}
                  <div className="flex justify-between items-end">
                    <div className="italic text-2xl text-blue-600 font-script">Signature</div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-1 p-2">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced technology meets user-friendly design for the most secure certificate verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🛡️",
              title: "Blockchain Security",
              description: "Certificates are anchored on blockchain for immutable verification"
            },
            {
              icon: "⚡",
              title: "Instant Verification",
              description: "Get verification results in seconds with our AI-powered OCR"
            },
            {
              icon: "🔒",
              title: "Tamper Detection",
              description: "Advanced algorithms detect any document modifications"
            }
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10+", label: "Sample Certificates" },
            { value: "100%", label: "Accuracy Rate" },
            { value: "<2s", label: "Verification Time" },
            { value: "24/7", label: "Availability" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA Section */}
    <div className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Secure Your Certificates?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join institutions and verifiers worldwide who trust VeritasAI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/verify">
            <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              🔍 Verify Certificate
            </button>
          </Link>
          <Link to="/institution">
            <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-300 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              🏢 Institution Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Modern Verify Page
const VerifyPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Certificate <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Verification</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your certificate to verify its authenticity instantly using blockchain technology
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
        <div className="upload-area-modern">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Certificate</h3>
              <p className="text-gray-600 mb-6">Drag and drop your certificate here or click to browse</p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Select File
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "⚡", title: "Instant Results", desc: "Get verification results in seconds" },
          { icon: "🔍", title: "Tamper Detection", desc: "Advanced algorithms detect modifications" },
          { icon: "🛡️", title: "Blockchain Verified", desc: "Certificates verified against blockchain" }
        ].map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Modern Institution Page
const InstitutionPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">🏢</div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Institution <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Portal</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Issue certificates with blockchain anchoring and QR code generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upload Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Upload Certificate</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your institution name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issuer Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter issuer email"
              />
            </div>
            <div className="upload-area-modern">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">Upload Certificate Document</p>
                <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Choose File
                </button>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300">
              Process Certificate
            </button>
          </div>
        </div>

        {/* Generated Assets */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Generated Assets</h2>
          </div>

          <div className="space-y-4">
            {[
              { icon: "📱", title: "QR Code", desc: "Generated after successful upload" },
              { icon: "✍️", title: "Digital Signature", desc: "Cryptographic proof of authenticity" },
              { icon: "⛓️", title: "Blockchain Hash", desc: "Immutable record on blockchain" }
            ].map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl mr-4">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Modern Admin Dashboard
const AdminPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">⚙️</div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Admin <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Monitor system analytics and blockchain transactions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Certificates", value: "10", icon: "📄", color: "from-blue-500 to-blue-600" },
          { label: "Valid Certificates", value: "10", icon: "✅", color: "from-green-500 to-green-600" },
          { label: "Fraud Attempts", value: "0", icon: "🚨", color: "from-red-500 to-red-600" },
          { label: "Active Institutions", value: "5", icon: "🏢", color: "from-purple-500 to-purple-600" }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
            <h3 className="font-semibold text-gray-900">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">📊 Analytics Overview</h2>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-gray-600">Chart visualization will be implemented</p>
              <p className="text-sm text-gray-500 mt-2">Showing verification trends</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">⛓️ Blockchain Status</h2>
          <div className="space-y-4">
            {[
              { label: "Network Status", value: "Connected", color: "text-green-600" },
              { label: "Latest Block", value: "#12,345", color: "text-blue-600" },
              { label: "Gas Price", value: "20 gwei", color: "text-yellow-600" },
              { label: "Contract", value: "0x1234...5678", color: "text-purple-600" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Modern AI Agent Page
const AgentPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          AI <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Assistant</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Natural language queries for certificate verification and analytics
        </p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <div className="h-96 bg-gray-50 rounded-2xl p-6 mb-6 overflow-y-auto">
          <div className="flex items-start space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm max-w-md">
              <p className="text-gray-800">
                Hello! I'm the VeritasAI assistant. I can help you with certificate verification queries, fraud statistics, and system information. How can I assist you today?
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <input
            type="text"
            className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Ask me anything about certificate verification..."
          />
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
            Send
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Queries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Show fraud stats for last 7 days",
            "How many certificates were verified today?",
            "Verify this certificate",
            "What are the most common fraud patterns?"
          ].map((query, index) => (
            <button key={index} className="text-left p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:shadow-md">
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen">
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