// Enhanced Database Service with comprehensive data models
import { v4 as uuidv4 } from 'uuid';

// Database keys for localStorage
const STORAGE_KEYS = {
  USERS: 'veritasai_users',
  CERTIFICATES: 'veritasai_certificates',
  HISTORY: 'veritasai_history',
  SESSIONS: 'veritasai_sessions',
  SETTINGS: 'veritasai_settings'
};

class DatabaseService {
  constructor() {
    this.initializeDatabase();
  }

  // Initialize database with default data
  initializeDatabase() {
    try {
      // Initialize users if not exists
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
          {
            id: 'usr_admin_001',
            email: 'admin@veritasai.com',
            name: 'Admin User',
            role: 'admin',
            password: 'admin123', // In production, this would be hashed
            createdAt: new Date('2024-01-01').toISOString(),
            lastLogin: null,
            isActive: true,
            permissions: ['read', 'write', 'delete', 'admin'],
            profile: {
              avatar: null,
              phone: '+1-555-0001',
              department: 'Administration',
              bio: 'System Administrator'
            }
          },
          {
            id: 'usr_student_001',
            email: 'student@test.com',
            name: 'Student User',
            role: 'student',
            password: 'student123',
            createdAt: new Date('2024-02-01').toISOString(),
            lastLogin: null,
            isActive: true,
            permissions: ['read'],
            profile: {
              avatar: null,
              phone: '+1-555-0002',
              studentId: 'STU2024001',
              university: 'Tech University'
            }
          },
          {
            id: 'usr_institution_001',
            email: 'institution@test.com',
            name: 'Institution User',
            role: 'institution',
            password: 'inst123',
            createdAt: new Date('2024-02-15').toISOString(),
            lastLogin: null,
            isActive: true,
            permissions: ['read', 'write'],
            profile: {
              avatar: null,
              phone: '+1-555-0003',
              institutionName: 'AI Institute',
              website: 'https://aiinstitute.edu',
              accreditation: 'NAAC Grade A+'
            }
          },
          {
            id: 'usr_verifier_001',
            email: 'verifier@test.com',
            name: 'Verifier User',
            role: 'verifier',
            password: 'verify123',
            createdAt: new Date('2024-03-01').toISOString(),
            lastLogin: null,
            isActive: true,
            permissions: ['read', 'verify'],
            profile: {
              avatar: null,
              phone: '+1-555-0004',
              organization: 'Verification Services LLC',
              license: 'VER-2024-001'
            }
          }
        ];
        
        this.setUsers(defaultUsers);
      }

      // Initialize certificates if not exists
      if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
        const defaultCertificates = [
          {
            id: 'CERT_001',
            studentName: 'John Doe',
            studentEmail: 'john.doe@student.edu',
            courseName: 'Bachelor of Computer Science',
            institutionName: 'Tech University',
            institutionId: 'usr_institution_001',
            issueDate: '2024-06-15',
            grade: 'First Class Honours',
            cgpa: '8.5',
            status: 'valid',
            hash: 'sha256_abc123def456',
            qrCodeUrl: '/mock-qr-code.png',
            uploadTimestamp: '2024-06-15T10:30:00Z',
            verificationCount: 15,
            lastVerified: '2024-12-01T14:22:00Z',
            blockchain: {
              txHash: '0x1234567890abcdef',
              blockNumber: 12345678,
              confirmations: 150
            },
            metadata: {
              certificateType: 'degree',
              duration: '4 years',
              specialization: 'Artificial Intelligence',
              honors: true
            }
          },
          {
            id: 'CERT_002',
            studentName: 'Jane Smith',
            studentEmail: 'jane.smith@student.edu',
            courseName: 'Master of Data Science',
            institutionName: 'AI Institute',
            institutionId: 'usr_institution_001',
            issueDate: '2024-07-20',
            grade: 'Distinction',
            cgpa: '9.2',
            status: 'valid',
            hash: 'sha256_def456ghi789',
            qrCodeUrl: '/mock-qr-code.png',
            uploadTimestamp: '2024-07-20T14:15:00Z',
            verificationCount: 8,
            lastVerified: '2024-11-28T09:45:00Z',
            blockchain: {
              txHash: '0xabcdef1234567890',
              blockNumber: 12345700,
              confirmations: 120
            },
            metadata: {
              certificateType: 'master',
              duration: '2 years',
              specialization: 'Machine Learning',
              thesis: 'Deep Learning Applications in Healthcare'
            }
          },
          {
            id: 'CERT_INV_001',
            studentName: 'Invalid Student 1',
            studentEmail: 'invalid@fake.edu',
            courseName: 'Fake Course',
            institutionName: 'Unknown Institution',
            institutionId: null,
            issueDate: '2024-08-01',
            grade: 'N/A',
            status: 'invalid',
            hash: 'invalid_hash_123',
            reason: 'Hash mismatch - potential tampering detected',
            uploadTimestamp: new Date(Date.now() - 86400000).toISOString(),
            verificationCount: 3,
            lastVerified: new Date().toISOString(),
            blockchain: null,
            metadata: {
              certificateType: 'unknown',
              flagged: true,
              suspiciousActivity: ['hash_mismatch', 'unknown_issuer']
            }
          }
        ];
        
        this.setCertificates(defaultCertificates);
      }

      // Initialize history if not exists
      if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
        this.setHistory([]);
      }

      // Initialize sessions if not exists
      if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
        this.setSessions([]);
      }

    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  // Generic storage methods
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return false;
    }
  }

  // User Management
  getUsers() {
    return this.get(STORAGE_KEYS.USERS) || [];
  }

  setUsers(users) {
    return this.set(STORAGE_KEYS.USERS, users);
  }

  getUserById(userId) {
    const users = this.getUsers();
    return users.find(user => user.id === userId);
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    try {
      const users = this.getUsers();
      
      // Check if email already exists
      if (this.getUserByEmail(userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser = {
        id: `usr_${userData.role}_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: userData.password, // In production, hash this
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        permissions: this.getDefaultPermissions(userData.role),
        profile: {
          avatar: null,
          phone: null,
          ...userData.profile
        }
      };

      users.push(newUser);
      this.setUsers(users);
      
      // Log activity
      this.logActivity({
        userId: newUser.id,
        action: 'user_created',
        details: `New user account created: ${newUser.email}`,
        metadata: { role: newUser.role }
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  updateUser(userId, updates) {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.setUsers(users);
      
      // Log activity
      this.logActivity({
        userId,
        action: 'user_updated',
        details: `User profile updated`,
        metadata: { fields: Object.keys(updates) }
      });

      return users[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Certificate Management
  getCertificates() {
    return this.get(STORAGE_KEYS.CERTIFICATES) || [];
  }

  setCertificates(certificates) {
    return this.set(STORAGE_KEYS.CERTIFICATES, certificates);
  }

  getCertificateById(certificateId) {
    const certificates = this.getCertificates();
    return certificates.find(cert => cert.id === certificateId);
  }

  getCertificatesByUser(userId) {
    const certificates = this.getCertificates();
    return certificates.filter(cert => cert.institutionId === userId);
  }

  getCertificatesByStatus(status) {
    const certificates = this.getCertificates();
    return certificates.filter(cert => cert.status === status);
  }

  createCertificate(certificateData) {
    try {
      const certificates = this.getCertificates();
      
      const newCertificate = {
        id: certificateData.id || `CERT_${Date.now()}`,
        ...certificateData,
        uploadTimestamp: new Date().toISOString(),
        verificationCount: 0,
        lastVerified: null,
        status: certificateData.status || 'valid',
        metadata: {
          certificateType: 'degree',
          ...certificateData.metadata
        }
      };

      certificates.push(newCertificate);
      this.setCertificates(certificates);
      
      // Log activity
      this.logActivity({
        userId: certificateData.institutionId,
        action: 'certificate_created',
        details: `Certificate created: ${newCertificate.id}`,
        metadata: { 
          certificateId: newCertificate.id,
          studentName: newCertificate.studentName 
        }
      });

      return newCertificate;
    } catch (error) {
      console.error('Error creating certificate:', error);
      throw error;
    }
  }

  updateCertificate(certificateId, updates) {
    try {
      const certificates = this.getCertificates();
      const certIndex = certificates.findIndex(cert => cert.id === certificateId);
      
      if (certIndex === -1) {
        throw new Error('Certificate not found');
      }

      certificates[certIndex] = {
        ...certificates[certIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.setCertificates(certificates);
      
      // Log activity
      this.logActivity({
        userId: certificates[certIndex].institutionId,
        action: 'certificate_updated',
        details: `Certificate updated: ${certificateId}`,
        metadata: { fields: Object.keys(updates) }
      });

      return certificates[certIndex];
    } catch (error) {
      console.error('Error updating certificate:', error);
      throw error;
    }
  }

  verifyCertificate(certificateId, verifierId = null) {
    try {
      const certificate = this.getCertificateById(certificateId);
      
      if (!certificate) {
        return {
          isValid: false,
          certificate: null,
          message: 'Certificate not found'
        };
      }

      // Update verification count and timestamp
      const updatedCert = {
        ...certificate,
        verificationCount: (certificate.verificationCount || 0) + 1,
        lastVerified: new Date().toISOString()
      };

      this.updateCertificate(certificateId, {
        verificationCount: updatedCert.verificationCount,
        lastVerified: updatedCert.lastVerified
      });

      // Log verification activity
      this.logActivity({
        userId: verifierId,
        action: 'certificate_verified',
        details: `Certificate verification: ${certificateId}`,
        metadata: { 
          certificateId,
          result: certificate.status,
          studentName: certificate.studentName 
        }
      });

      return {
        isValid: certificate.status === 'valid',
        certificate: updatedCert,
        message: certificate.status === 'valid' 
          ? 'Certificate is valid and authentic' 
          : certificate.reason || 'Certificate is invalid'
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  }

  // History/Activity Management
  getHistory() {
    return this.get(STORAGE_KEYS.HISTORY) || [];
  }

  setHistory(history) {
    return this.set(STORAGE_KEYS.HISTORY, history);
  }

  logActivity(activityData) {
    try {
      const history = this.getHistory();
      
      const activity = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: activityData.userId,
        action: activityData.action,
        details: activityData.details,
        metadata: activityData.metadata || {},
        ipAddress: '127.0.0.1', // Mock IP
        userAgent: navigator.userAgent
      };

      history.unshift(activity); // Add to beginning
      
      // Keep only last 1000 activities
      if (history.length > 1000) {
        history.splice(1000);
      }

      this.setHistory(history);
      return activity;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  getHistoryByUser(userId, limit = 100) {
    const history = this.getHistory();
    return history
      .filter(activity => activity.userId === userId)
      .slice(0, limit);
  }

  getHistoryByAction(action, limit = 100) {
    const history = this.getHistory();
    return history
      .filter(activity => activity.action === action)
      .slice(0, limit);
  }

  // Analytics
  getAnalytics() {
    try {
      const users = this.getUsers();
      const certificates = this.getCertificates();
      const history = this.getHistory();

      const validCertificates = certificates.filter(cert => cert.status === 'valid');
      const invalidCertificates = certificates.filter(cert => cert.status === 'invalid');
      
      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentActivity = history.filter(activity => 
        new Date(activity.timestamp) >= sevenDaysAgo
      );

      const recentCertificates = certificates.filter(cert => 
        new Date(cert.uploadTimestamp) >= sevenDaysAgo
      );

      const verificationActivity = history.filter(activity => 
        activity.action === 'certificate_verified'
      );

      return {
        users: {
          total: users.length,
          active: users.filter(user => user.isActive).length,
          byRole: {
            admin: users.filter(user => user.role === 'admin').length,
            student: users.filter(user => user.role === 'student').length,
            institution: users.filter(user => user.role === 'institution').length,
            verifier: users.filter(user => user.role === 'verifier').length
          }
        },
        certificates: {
          total: certificates.length,
          valid: validCertificates.length,
          invalid: invalidCertificates.length,
          recent: recentCertificates.length,
          verificationRate: certificates.length > 0 
            ? ((validCertificates.length / certificates.length) * 100).toFixed(2)
            : 0,
          totalVerifications: verificationActivity.length
        },
        activity: {
          total: history.length,
          recent: recentActivity.length,
          topActions: this.getTopActions(history, 5),
          dailyActivity: this.getDailyActivity(history, 7)
        },
        system: {
          lastUpdate: new Date().toISOString(),
          databaseSize: this.getDatabaseSize()
        }
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }

  // Helper methods
  getDefaultPermissions(role) {
    const permissions = {
      admin: ['read', 'write', 'delete', 'admin'],
      institution: ['read', 'write'],
      verifier: ['read', 'verify'],
      student: ['read']
    };
    return permissions[role] || ['read'];
  }

  getTopActions(history, limit = 5) {
    const actionCounts = {};
    history.forEach(activity => {
      actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
    });
    
    return Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([action, count]) => ({ action, count }));
  }

  getDailyActivity(history, days = 7) {
    const daily = {};
    const now = new Date();
    
    // Initialize days
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      daily[dateStr] = 0;
    }
    
    // Count activities by day
    history.forEach(activity => {
      const dateStr = activity.timestamp.split('T')[0];
      if (daily.hasOwnProperty(dateStr)) {
        daily[dateStr]++;
      }
    });
    
    return Object.entries(daily)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, count]) => ({ date, count }));
  }

  getDatabaseSize() {
    try {
      let totalSize = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      });
      return `${(totalSize / 1024).toFixed(2)} KB`;
    } catch (error) {
      return 'Unknown';
    }
  }

  // Backup and restore
  exportDatabase() {
    try {
      const data = {};
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        data[name] = this.get(key);
      });
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting database:', error);
      throw error;
    }
  }

  importDatabase(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        if (data[name]) {
          this.set(key, data[name]);
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      throw error;
    }
  }

  // Clear all data (use with caution)
  clearDatabase() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.initializeDatabase(); // Reinitialize with defaults
      return true;
    } catch (error) {
      console.error('Error clearing database:', error);
      return false;
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;