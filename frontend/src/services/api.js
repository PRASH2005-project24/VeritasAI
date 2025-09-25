import axios from 'axios';

// Base API configuration
const BASE_URL = 'http://localhost:3001';

// Create axios instance with retry logic
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'Server error';
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check if the backend server is running');
    } else {
      // Something else happened
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
);

// API Service Methods
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Institution: Upload certificate
  async uploadCertificate(formData) {
    try {
      const response = await api.post('/api/upload-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Student/Verifier: Verify certificate by upload
  async verifyCertificate(formData) {
    try {
      const response = await api.post('/api/verify-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify certificate by ID (for QR code scanning)
  async verifyCertificateById(certificateId) {
    try {
      const response = await api.get(`/api/verify/${certificateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Get all certificates
  async getAllCertificates() {
    try {
      const response = await api.get('/api/admin/certificates');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Get analytics data
  async getAnalytics() {
    try {
      const response = await api.get('/api/admin/analytics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk verification
  async bulkVerification(formData) {
    try {
      const response = await api.post('/api/bulk-verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get file URL (for images, QR codes, etc.)
  getFileUrl(relativePath) {
    return `${BASE_URL}${relativePath}`;
  }
};

// Export individual methods for convenience
export const {
  healthCheck,
  uploadCertificate,
  verifyCertificate,
  verifyCertificateById,
  getAllCertificates,
  getAnalytics,
  bulkVerification,
  getFileUrl
} = apiService;

export default apiService;