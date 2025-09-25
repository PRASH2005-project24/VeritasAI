// Mock API service for demonstration and testing
import { API_BASE_URL } from '../config/api.js';

// Mock data for certificates
const mockCertificates = [
  {
    id: 'CERT_001',
    studentName: 'John Doe',
    courseName: 'Bachelor of Computer Science',
    institutionName: 'Tech University',
    issueDate: '2024-06-15',
    grade: 'First Class Honours',
    status: 'valid',
    hash: 'abc123def456',
    qrCodeUrl: '/mock-qr-code.png',
    uploadTimestamp: '2024-06-15T10:30:00Z'
  },
  {
    id: 'CERT_002',
    studentName: 'Jane Smith',
    courseName: 'Master of Data Science',
    institutionName: 'AI Institute',
    issueDate: '2024-07-20',
    grade: 'Distinction',
    status: 'valid',
    hash: 'def456ghi789',
    qrCodeUrl: '/mock-qr-code.png',
    uploadTimestamp: '2024-07-20T14:15:00Z'
  }
];

// Mock API responses
const mockResponses = {
  health: {
    status: 'OK',
    message: 'VeritasAI Mock Backend is running',
    timestamp: new Date().toISOString(),
    certificatesCount: mockCertificates.length
  },
  
  uploadCertificate: {
    success: true,
    certificate: {
      id: 'CERT_' + Date.now(),
      hash: 'mock_hash_' + Math.random().toString(36).substr(2, 9),
      extractedData: {
        studentName: 'Mock Student',
        courseName: 'Mock Course',
        institutionName: 'Mock University',
        issueDate: new Date().toISOString().split('T')[0],
        grade: 'Mock Grade'
      },
      qrCodeUrl: '/mock-qr-code.png',
      status: 'uploaded_successfully'
    }
  },

  verifyCertificate: {
    success: true,
    isValid: true,
    certificate: mockCertificates[0],
    message: 'Certificate is valid and authentic',
    verificationTimestamp: new Date().toISOString()
  },

  analytics: {
    totalCertificates: mockCertificates.length,
    validCertificates: mockCertificates.length,
    fraudAttempts: 2,
    recentCertificates: 5,
    verificationRate: '100.00',
    lastUpdate: new Date().toISOString()
  }
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockApiService = {
  async healthCheck() {
    await delay(500);
    return mockResponses.health;
  },

  async uploadCertificate(formData) {
    await delay(2000); // Simulate OCR processing time
    
    // Create a new certificate with some form data if available
    const mockCert = {
      ...mockResponses.uploadCertificate,
      certificate: {
        ...mockResponses.uploadCertificate.certificate,
        extractedData: {
          ...mockResponses.uploadCertificate.certificate.extractedData,
          studentName: formData.get('studentName') || 'Mock Student',
          institutionName: formData.get('institutionName') || 'Mock University'
        }
      }
    };
    
    return mockCert;
  },

  async verifyCertificate(formData) {
    await delay(1500);
    return mockResponses.verifyCertificate;
  },

  async verifyCertificateById(certificateId) {
    await delay(800);
    const cert = mockCertificates.find(c => c.id === certificateId) || mockCertificates[0];
    return {
      success: true,
      isValid: true,
      certificate: cert,
      message: 'Certificate verified successfully'
    };
  },

  async getAllCertificates() {
    await delay(1000);
    return {
      success: true,
      total: mockCertificates.length,
      certificates: mockCertificates
    };
  },

  async getAnalytics() {
    await delay(700);
    return mockResponses.analytics;
  },

  async bulkVerification(formData) {
    await delay(3000); // Simulate bulk processing time
    return {
      success: true,
      totalProcessed: 3,
      results: [
        { certificateId: 'CERT_001', status: 'valid', studentName: 'John Doe' },
        { certificateId: 'CERT_002', status: 'valid', studentName: 'Jane Smith' },
        { certificateId: 'CERT_003', status: 'not_found', studentName: 'Bob Johnson' }
      ]
    };
  },

  getFileUrl(relativePath) {
    return '/mock-assets' + relativePath;
  }
};

// Enhanced API service that tries real API first, falls back to mock
export const enhancedApiService = {
  async callWithFallback(apiMethod, mockMethod, ...args) {
    try {
      // Try real API first
      const realApi = await import('./api.js');
      return await realApi.apiService[apiMethod](...args);
    } catch (error) {
      console.warn(`Real API failed, using mock data: ${error.message}`);
      return await mockApiService[mockMethod](...args);
    }
  },

  async healthCheck() {
    return this.callWithFallback('healthCheck', 'healthCheck');
  },

  async uploadCertificate(formData) {
    return this.callWithFallback('uploadCertificate', 'uploadCertificate', formData);
  },

  async verifyCertificate(formData) {
    return this.callWithFallback('verifyCertificate', 'verifyCertificate', formData);
  },

  async verifyCertificateById(certificateId) {
    return this.callWithFallback('verifyCertificateById', 'verifyCertificateById', certificateId);
  },

  async getAllCertificates() {
    return this.callWithFallback('getAllCertificates', 'getAllCertificates');
  },

  async getAnalytics() {
    return this.callWithFallback('getAnalytics', 'getAnalytics');
  },

  async bulkVerification(formData) {
    return this.callWithFallback('bulkVerification', 'bulkVerification', formData);
  },

  getFileUrl(relativePath) {
    return mockApiService.getFileUrl(relativePath);
  }
};

export default enhancedApiService;