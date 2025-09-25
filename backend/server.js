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

// Global error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  // Don't exit the process - just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit the process - just log the error
});

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local port
    'https://prash2005-project24.github.io', // GitHub Pages
    process.env.CORS_ORIGIN // Environment variable for custom domains
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

// Mock database (will be replaced with actual DB in production)
let certificatesDB = [];

// Load mock data on startup
const loadMockData = async () => {
  try {
    const mockDataPath = path.join(__dirname, '..', 'data', 'mock_db.json');
    if (fs.existsSync(mockDataPath)) {
      const data = await fs.readJson(mockDataPath);
      certificatesDB = data.certificates || [];
      console.log(`Loaded ${certificatesDB.length} certificates from mock database`);
    }
  } catch (error) {
    console.error('Error loading mock data:', error);
  }
};

// Helper functions
const generateHash = (text) => {
  return crypto.SHA256(text).toString();
};

const generateCertificateId = () => {
  return 'CERT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const extractTextFromImage = async (imagePath) => {
  let worker;
  try {
    // Validate file exists and is readable
    if (!fs.existsSync(imagePath)) {
      throw new Error('Certificate file not found');
    }
    
    // Check file size (prevent processing of very large files)
    const stats = fs.statSync(imagePath);
    if (stats.size > 15 * 1024 * 1024) { // 15MB limit
      throw new Error('Certificate file too large');
    }
    
    console.log(`🔍 Starting OCR processing for: ${imagePath}`);
    
    // Create Tesseract worker with better error handling
    worker = await Tesseract.createWorker('eng', 1, {
      errorHandler: (err) => {
        console.error('Tesseract Worker Error:', err);
      }
    });
    
    // Set OCR options for better accuracy and error handling
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,;:()/-',
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    });
    
    // Process the image with timeout
    const result = await Promise.race([
      worker.recognize(imagePath),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OCR processing timeout')), 30000) // 30 second timeout
      )
    ]);
    
    const text = result.data.text.trim();
    
    // Validate extracted text
    if (!text || text.length < 10) {
      throw new Error('No meaningful text could be extracted from the certificate');
    }
    
    console.log(`✅ OCR completed successfully. Extracted ${text.length} characters.`);
    return text;
    
  } catch (error) {
    console.error('🚨 OCR Error:', error.message);
    
    // Provide specific error messages based on error type
    if (error.message.includes('Unknown format') || error.message.includes('no pix returned')) {
      throw new Error('Unsupported image format. Please upload a valid JPEG, PNG, or PDF file.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Certificate processing took too long. Please try with a smaller or clearer image.');
    } else if (error.message.includes('too large')) {
      throw new Error('Certificate file is too large. Please upload a file smaller than 15MB.');
    } else if (error.message.includes('not found')) {
      throw new Error('Certificate file could not be accessed.');
    } else {
      throw new Error(`Failed to process certificate: ${error.message}`);
    }
  } finally {
    // Always clean up the worker
    if (worker) {
      try {
        await worker.terminate();
        console.log('🧹 Tesseract worker cleaned up');
      } catch (cleanupError) {
        console.error('Worker cleanup error:', cleanupError);
      }
    }
  }
};

const parseCertificateText = (text) => {
  // Simple parsing logic - can be enhanced based on certificate formats
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  let certificateData = {
    studentName: '',
    courseName: '',
    institutionName: '',
    issueDate: '',
    grade: '',
    certificateType: 'Academic Certificate'
  };

  // Basic pattern matching for common certificate fields
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('this is to certify') || lowerLine.includes('certified that')) {
      // Look for student name in the next few lines
      const nameMatch = line.match(/certify(?:\s+that)?\s+([A-Za-z\s]+)/i);
      if (nameMatch) {
        certificateData.studentName = nameMatch[1].trim();
      }
    }
    
    if (lowerLine.includes('course') || lowerLine.includes('program')) {
      certificateData.courseName = line;
    }
    
    if (lowerLine.includes('university') || lowerLine.includes('institute') || lowerLine.includes('college')) {
      certificateData.institutionName = line;
    }
    
    if (line.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/) || line.match(/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/)) {
      certificateData.issueDate = line;
    }
    
    if (lowerLine.includes('grade') || lowerLine.includes('cgpa') || lowerLine.includes('percentage')) {
      certificateData.grade = line;
    }
  });

  return certificateData;
};

// API Routes

// Health check - allow all origins for this endpoint
app.get('/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.json({ 
    status: 'OK', 
    message: 'VeritasAI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    certificatesCount: certificatesDB.length
  });
});

// Upload certificate (Institution role)
app.post('/api/upload-certificate', upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No certificate file uploaded' });
    }

    const { institutionName, issuerEmail } = req.body;
    
    if (!institutionName || !issuerEmail) {
      return res.status(400).json({ error: 'Institution name and issuer email are required' });
    }

    // Extract text using OCR
    const extractedText = await extractTextFromImage(req.file.path);
    
    // Parse certificate data
    const certificateData = parseCertificateText(extractedText);
    
    // Generate hash and certificate ID
    const certificateHash = generateHash(extractedText);
    const certificateId = generateCertificateId();
    
    // Generate QR code
    const qrCodeData = {
      certificateId,
      hash: certificateHash,
      verifyUrl: `${req.protocol}://${req.get('host')}/api/verify/${certificateId}`
    };
    
    const qrCodePath = path.join(uploadsDir, `qr_${certificateId}.png`);
    await QRCode.toFile(qrCodePath, JSON.stringify(qrCodeData));

    // Create certificate record
    const certificate = {
      id: certificateId,
      hash: certificateHash,
      originalText: extractedText,
      ...certificateData,
      institutionName,
      issuerEmail,
      filePath: req.file.path,
      fileName: req.file.filename,
      qrCodePath,
      uploadTimestamp: new Date().toISOString(),
      status: 'valid',
      blockchainTxHash: null // Will be updated after blockchain anchoring
    };

    // Save to mock database
    certificatesDB.push(certificate);
    
    // Save to file (persistence)
    const mockDataPath = path.join(__dirname, '..', 'data', 'mock_db.json');
    await fs.ensureDir(path.dirname(mockDataPath));
    await fs.writeJson(mockDataPath, { certificates: certificatesDB }, { spaces: 2 });

    res.json({
      success: true,
      certificate: {
        id: certificate.id,
        hash: certificate.hash,
        extractedData: {
          studentName: certificate.studentName,
          courseName: certificate.courseName,
          institutionName: certificate.institutionName,
          issueDate: certificate.issueDate,
          grade: certificate.grade
        },
        qrCodeUrl: `/uploads/qr_${certificateId}.png`,
        status: 'uploaded_successfully'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process certificate', details: error.message });
  }
});

// Verify certificate (Student/Verifier role)
app.post('/api/verify-certificate', upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No certificate file uploaded for verification' });
    }

    // Extract text using OCR
    const extractedText = await extractTextFromImage(req.file.path);
    
    // Generate hash of uploaded certificate
    const uploadedHash = generateHash(extractedText);
    
    // Search for matching certificate in database
    const matchingCert = certificatesDB.find(cert => cert.hash === uploadedHash);
    
    if (matchingCert) {
      // Certificate found and valid
      res.json({
        status: 'valid',
        certificate: {
          id: matchingCert.id,
          studentName: matchingCert.studentName,
          courseName: matchingCert.courseName,
          institutionName: matchingCert.institutionName,
          issueDate: matchingCert.issueDate,
          grade: matchingCert.grade,
          issuerEmail: matchingCert.issuerEmail,
          uploadTimestamp: matchingCert.uploadTimestamp,
          hash: matchingCert.hash
        },
        verification: {
          isValid: true,
          reason: 'Certificate hash matches our records',
          verifiedAt: new Date().toISOString()
        }
      });
    } else {
      // Check if it's a tampered version of an existing certificate
      const parsedData = parseCertificateText(extractedText);
      const possibleMatch = certificatesDB.find(cert => 
        cert.studentName === parsedData.studentName && 
        cert.courseName === parsedData.courseName
      );
      
      if (possibleMatch) {
        // Same certificate data but different hash - likely tampered
        res.json({
          status: 'invalid',
          certificate: null,
          verification: {
            isValid: false,
            reason: 'Certificate appears to be tampered. Hash mismatch detected.',
            details: 'A certificate with similar details exists but the digital fingerprint does not match.',
            verifiedAt: new Date().toISOString()
          }
        });
      } else {
        // Certificate not found at all
        res.json({
          status: 'not_found',
          certificate: null,
          verification: {
            isValid: false,
            reason: 'Certificate not found in our database',
            details: 'This certificate was not issued by any registered institution in our system.',
            verifiedAt: new Date().toISOString()
          }
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify certificate', details: error.message });
  }
});

// Verify certificate by ID
app.get('/api/verify/:certificateId', (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = certificatesDB.find(cert => cert.id === certificateId);
    
    if (certificate) {
      res.json({
        status: 'valid',
        certificate: {
          id: certificate.id,
          studentName: certificate.studentName,
          courseName: certificate.courseName,
          institutionName: certificate.institutionName,
          issueDate: certificate.issueDate,
          grade: certificate.grade,
          issuerEmail: certificate.issuerEmail,
          uploadTimestamp: certificate.uploadTimestamp
        },
        verification: {
          isValid: true,
          reason: 'Certificate found and valid',
          verifiedAt: new Date().toISOString()
        }
      });
    } else {
      res.json({
        status: 'not_found',
        certificate: null,
        verification: {
          isValid: false,
          reason: 'Certificate ID not found',
          verifiedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('ID verification error:', error);
    res.status(500).json({ error: 'Failed to verify certificate by ID' });
  }
});

// Get all certificates (Admin role)
app.get('/api/admin/certificates', (req, res) => {
  try {
    const certificates = certificatesDB.map(cert => ({
      id: cert.id,
      studentName: cert.studentName,
      courseName: cert.courseName,
      institutionName: cert.institutionName,
      issueDate: cert.issueDate,
      issuerEmail: cert.issuerEmail,
      uploadTimestamp: cert.uploadTimestamp,
      status: cert.status,
      hash: cert.hash.substring(0, 16) + '...' // Show only first 16 characters for security
    }));

    res.json({
      total: certificates.length,
      certificates
    });
  } catch (error) {
    console.error('Admin certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get analytics data (Admin role)
app.get('/api/admin/analytics', (req, res) => {
  try {
    const totalCertificates = certificatesDB.length;
    const validCertificates = certificatesDB.filter(cert => cert.status === 'valid').length;
    const recentCertificates = certificatesDB.filter(cert => {
      const uploadDate = new Date(cert.uploadTimestamp);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return uploadDate >= sevenDaysAgo;
    }).length;

    // Mock fraud detection data
    const fraudAttempts = Math.floor(Math.random() * 10) + 5; // Random number for demo
    
    const analytics = {
      totalCertificates,
      validCertificates,
      fraudAttempts,
      recentCertificates,
      verificationRate: totalCertificates > 0 ? ((validCertificates / totalCertificates) * 100).toFixed(2) : 0,
      lastUpdate: new Date().toISOString()
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Bulk verification endpoint
app.post('/api/bulk-verify', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    // For now, return mock data - can be enhanced to parse actual CSV
    const mockResults = [
      { certificateId: 'CERT_001', status: 'valid', studentName: 'John Doe' },
      { certificateId: 'CERT_002', status: 'invalid', studentName: 'Jane Smith', reason: 'Hash mismatch' },
      { certificateId: 'CERT_003', status: 'not_found', studentName: 'Bob Johnson' }
    ];

    res.json({
      success: true,
      totalProcessed: mockResults.length,
      results: mockResults
    });

  } catch (error) {
    console.error('Bulk verification error:', error);
    res.status(500).json({ error: 'Failed to process bulk verification' });
  }
});

// Initialize data on startup
loadMockData().catch(console.error);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
  }
  if (error.message.includes('Only image and PDF files')) {
    return res.status(400).json({ error: error.message });
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 VeritasAI Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`💾 Mock database loaded with ${certificatesDB.length} certificates`);
  });
}

module.exports = app;