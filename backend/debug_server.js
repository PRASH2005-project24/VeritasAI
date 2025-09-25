const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const crypto = require('crypto-js');
const fs = require('fs-extra');
const path = require('path');
const QRCode = require('qrcode');
const Tesseract = require('tesseract.js');
require('dotenv').config();

console.log('🔍 Debug server starting...');

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔍 Setting up middleware...');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log('🔍 Middleware setup complete');

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
console.log('🔍 Creating uploads directory:', uploadsDir);
fs.ensureDirSync(uploadsDir);

// Mock database (will be replaced with actual DB in production)
let certificatesDB = [];

// Load mock data on startup
const loadMockData = async () => {
  try {
    console.log('🔍 Loading mock data...');
    const mockDataPath = path.join(__dirname, '..', 'data', 'mock_db.json');
    console.log('🔍 Mock data path:', mockDataPath);
    
    if (fs.existsSync(mockDataPath)) {
      console.log('🔍 Mock data file exists, reading...');
      const data = await fs.readJson(mockDataPath);
      certificatesDB = data.certificates || [];
      console.log(`✅ Loaded ${certificatesDB.length} certificates from mock database`);
    } else {
      console.log('⚠️ Mock data file does not exist at:', mockDataPath);
    }
  } catch (error) {
    console.error('🚨 Error loading mock data:', error);
    throw error; // Re-throw to see if this is causing the crash
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🔍 Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('🔍 Test endpoint requested');
  res.json({ message: 'Debug server test successful!', certificates: certificatesDB.length });
});

// Start server with debug logging
const startServer = async () => {
  try {
    console.log('🔍 Starting server initialization...');
    
    console.log('🔍 About to load mock data...');
    await loadMockData();
    console.log('🔍 Mock data loaded successfully');
    
    console.log('🔍 About to start listening on port', PORT);
    const server = app.listen(PORT, () => {
      console.log(`🚀 Debug VeritasAI Backend Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
      console.log(`💾 Mock database loaded with ${certificatesDB.length} certificates`);
    });

    server.on('error', (error) => {
      console.error('🚨 Server error:', error);
    });

    // Keep server alive and log periodically
    setInterval(() => {
      console.log('🔍 Server still running...', new Date().toISOString());
    }, 10000); // Log every 10 seconds

  } catch (error) {
    console.error('🚨 Server startup error:', error);
    console.error('🚨 Error stack:', error.stack);
    process.exit(1);
  }
};

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🔍 SIGTERM received, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔍 SIGINT received, shutting down...');
  process.exit(0);
});

console.log('🔍 About to call startServer()');
startServer().catch((error) => {
  console.error('🚨 Failed to start server:', error);
  console.error('🚨 Error stack:', error.stack);
  process.exit(1);
});