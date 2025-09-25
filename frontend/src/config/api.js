// API Configuration for different environments

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Backend API URLs for different environments
const API_BASE_URLS = {
  development: 'http://localhost:3001',
  production: 'https://veritasai-backend.onrender.com', // Render deployment
  // Alternative backends for high availability
  fallback: 'https://project-u5k3s-13yrpkt5q-binarybits-projects.vercel.app',
  mock: 'https://jsonplaceholder.typicode.com' // For demo purposes
};

// Auto-detect environment and set API URL
export const API_BASE_URL = isDevelopment 
  ? API_BASE_URLS.development 
  : API_BASE_URLS.production;

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  UPLOAD_CERTIFICATE: '/api/upload-certificate',
  VERIFY_CERTIFICATE: '/api/verify-certificate',
  VERIFY_BY_ID: '/api/verify',
  ADMIN_CERTIFICATES: '/api/admin/certificates',
  ADMIN_ANALYTICS: '/api/admin/analytics',
  BULK_VERIFY: '/api/bulk-verify'
};

// Full API URLs
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export configuration object
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

console.log(`🌍 API Mode: ${import.meta.env.MODE}`);
console.log(`🔗 API Base URL: ${API_BASE_URL}`);