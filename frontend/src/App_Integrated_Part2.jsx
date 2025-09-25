import React, { useState, useEffect, useRef } from 'react';
import apiService from './services/api.js';

// File Upload Component
const FileUploadArea = ({ onFileSelect, loading, accept = "image/*,.pdf" }) => {
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
      className="upload-area-working"
      style={{
        border: dragOver ? '2px solid #3b82f6' : '2px dashed #e5e7eb',
        background: dragOver ? '#f0f9ff' : 'transparent',
        opacity: loading ? 0.6 : 1,
        pointerEvents: loading ? 'none' : 'auto'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {loading ? '⏳' : '📁'}
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
        {loading ? 'Processing...' : 'Upload Certificate'}
      </h3>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
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
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

// Verify Page with Backend Integration
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)', padding: '80px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          Certificate <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verification</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '48px' }}>
          Upload your certificate to verify its authenticity instantly with our AI-powered system
        </p>
        
        {/* Upload Area */}
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px', marginBottom: '48px' }}>
          <FileUploadArea onFileSelect={handleFileSelect} loading={loading} />
          
          {selectedFile && !loading && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f0f9ff', borderRadius: '12px', textAlign: 'left' }}>
              <p style={{ margin: 0, color: '#3b82f6', fontWeight: '600' }}>
                📎 Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Verification Results */}
        {result && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            textAlign: 'left'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
              Verification Results
            </h2>
            
            {/* Status Badge */}
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

            {/* Certificate Details */}
            {result.certificate && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  Certificate Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'Student Name', value: result.certificate.studentName },
                    { label: 'Course', value: result.certificate.courseName },
                    { label: 'Institution', value: result.certificate.institutionName },
                    { label: 'Issue Date', value: result.certificate.issueDate },
                    { label: 'Grade/Result', value: result.certificate.grade },
                    { label: 'Issuer Email', value: result.certificate.issuerEmail }
                  ].map((item, index) => (
                    <div key={index} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {item.value || 'Not specified'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Info */}
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Verification Details
              </h4>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                <strong>Status:</strong> {result.verification.reason}
              </p>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                <strong>Verified at:</strong> {new Date(result.verification.verifiedAt).toLocaleString()}
              </p>
              {result.verification.details && (
                <p style={{ margin: '8px 0 0 0', color: '#ef4444', fontSize: '14px' }}>
                  <strong>Details:</strong> {result.verification.details}
                </p>
              )}
            </div>
          </div>
        )}

        {/* How it Works */}
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>
            How Verification Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { step: '1', icon: '📤', title: 'Upload', desc: 'Upload your certificate (PDF/Image)' },
              { step: '2', icon: '🔍', title: 'AI Analysis', desc: 'Our AI extracts and analyzes content' },
              { step: '3', icon: '✅', title: 'Verification', desc: 'Compare against blockchain records' }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  Step {item.step}: {item.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Institution Page with Backend Integration
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏢</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Institution <span style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portal</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280' }}>Issue certificates with blockchain anchoring and QR code generation</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr' : '1fr 1fr', gap: '48px' }}>
          {/* Upload Form */}
          {!result && (
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Upload Certificate</h2>
              
              {/* Institution Name */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Institution Name *
                </label>
                <input 
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px', 
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  placeholder="Enter your institution name"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              
              {/* Issuer Email */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Issuer Email *
                </label>
                <input 
                  name="issuerEmail"
                  type="email"
                  value={formData.issuerEmail}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px', 
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  placeholder="Enter issuer email address"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              
              {/* File Upload */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Certificate Document *
                </label>
                <FileUploadArea onFileSelect={handleFileSelect} loading={loading} />
                
                {formData.file && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>
                      📎 Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #10b981)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? '⏳ Processing Certificate...' : '🚀 Process Certificate'}
              </button>
            </div>
          )}

          {/* Generated Assets / Instructions */}
          {!result ? (
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>What You'll Get</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '📱', title: 'QR Code', desc: 'Generated for easy verification' },
                  { icon: '✍️', title: 'Digital Signature', desc: 'Cryptographic proof of authenticity' },
                  { icon: '⛓️', title: 'Blockchain Hash', desc: 'Immutable record on blockchain' },
                  { icon: '🔍', title: 'AI Extraction', desc: 'Automatic data extraction from certificate' }
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
          ) : (
            // Results Display
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
                🎉 Certificate Processed Successfully!
              </h2>
              
              {/* Success Message */}
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: '16px', marginBottom: '32px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#065f46', margin: 0, marginBottom: '8px' }}>
                  Certificate ID: {result.certificate?.id}
                </h3>
                <p style={{ color: '#047857', margin: 0 }}>Your certificate has been successfully processed and secured on the blockchain.</p>
              </div>

              {/* Extracted Data */}
              {result.certificate?.extractedData && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Extracted Certificate Data
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {Object.entries(result.certificate.extractedData).map(([key, value]) => (
                      <div key={key} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                          {value || 'Not detected'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code */}
              {result.certificate?.qrCodeUrl && (
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Verification QR Code
                  </h3>
                  <div style={{ display: 'inline-block', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <img 
                      src={apiService.getFileUrl(result.certificate.qrCodeUrl)} 
                      alt="Certificate QR Code" 
                      style={{ width: '200px', height: '200px', display: 'block' }}
                    />
                  </div>
                  <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>
                    Scan this QR code to verify the certificate
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button 
                  onClick={() => {
                    setResult(null);
                    setFormData({ institutionName: '', issuerEmail: '', file: null });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📤 Upload Another Certificate
                </button>
                {result.certificate?.qrCodeUrl && (
                  <a 
                    href={apiService.getFileUrl(result.certificate.qrCodeUrl)} 
                    download={`qr_${result.certificate.id}.png`}
                    style={{
                      background: 'white',
                      color: '#374151',
                      border: '2px solid #e5e7eb',
                      padding: '12px 24px',
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
    </div>
  );
};

export { VerifyPage, InstitutionPage, FileUploadArea };