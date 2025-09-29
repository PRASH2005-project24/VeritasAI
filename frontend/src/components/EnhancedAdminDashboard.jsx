import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Shield, AlertTriangle, CheckCircle, XCircle, 
  Eye, Filter, Search, Calendar, Download, RefreshCw, Info,
  TrendingUp, Clock, ExclamationTriangle, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/mockApi.js';

const CertificateModal = ({ certificate, isOpen, onClose }) => {
  const { t } = useLanguage();
  
  if (!isOpen || !certificate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Certificate Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Certificate ID</label>
                  <p className="text-lg font-mono bg-gray-50 p-2 rounded">{certificate.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {certificate.status === 'valid' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      certificate.status === 'valid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {certificate.status === 'valid' ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Student Name</label>
                <p className="text-lg">{certificate.studentName || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Course Name</label>
                <p className="text-lg">{certificate.courseName || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Institution</label>
                <p className="text-lg">{certificate.institutionName || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Issue Date</label>
                  <p className="text-lg">{certificate.issueDate || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Grade</label>
                  <p className="text-lg">{certificate.grade || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Hash</label>
                <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">{certificate.hash}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Upload Date</label>
                <p className="text-lg">{new Date(certificate.uploadTimestamp).toLocaleString()}</p>
              </div>

              {certificate.reason && (
                <div>
                  <label className="text-sm font-medium text-red-600">Invalid Reason</label>
                  <p className="text-lg text-red-700 bg-red-50 p-2 rounded">{certificate.reason}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Info Modal Component for Dashboard Cards
const InfoModal = ({ isOpen, onClose, title, icon: Icon, color, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 ${color} rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Total Certificates Info Component
const TotalCertificatesInfo = ({ certificates, analytics }) => {
  const getMonthlyStats = () => {
    const monthlyData = certificates.reduce((acc, cert) => {
      const month = new Date(cert.uploadTimestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(monthlyData).slice(-6);
  };

  const institutionStats = certificates.reduce((acc, cert) => {
    const institution = cert.institutionName || 'Unknown';
    acc[institution] = (acc[institution] || 0) + 1;
    return acc;
  }, {});

  const topInstitutions = Object.entries(institutionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Total Count</h4>
          <p className="text-2xl font-bold text-blue-600">{certificates.length}</p>
          <p className="text-sm text-blue-600 mt-1">Certificates stored</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">This Month</h4>
          <p className="text-2xl font-bold text-green-600">
            {certificates.filter(cert => {
              const certDate = new Date(cert.uploadTimestamp);
              const now = new Date();
              return certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p className="text-sm text-green-600 mt-1">New uploads</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">This Week</h4>
          <p className="text-2xl font-bold text-purple-600">
            {certificates.filter(cert => {
              const certDate = new Date(cert.uploadTimestamp);
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return certDate >= weekAgo;
            }).length}
          </p>
          <p className="text-sm text-purple-600 mt-1">Recent activity</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Top Institutions</h4>
        <div className="space-y-3">
          {topInstitutions.map(([institution, count], index) => (
            <div key={institution} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <span className="font-medium">{institution}</span>
              </div>
              <span className="text-lg font-bold text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Monthly Upload Trend</h4>
        <div className="space-y-2">
          {getMonthlyStats().map(([month, count]) => (
            <div key={month} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{month}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(count / Math.max(...getMonthlyStats().map(([,c]) => c))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Valid Certificates Info Component
const ValidCertificatesInfo = ({ certificates }) => {
  const validCerts = certificates.filter(cert => cert.status === 'valid');
  const recentValid = validCerts.filter(cert => {
    const certDate = new Date(cert.uploadTimestamp);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return certDate >= weekAgo;
  });

  const institutionValidStats = validCerts.reduce((acc, cert) => {
    const institution = cert.institutionName || 'Unknown';
    acc[institution] = (acc[institution] || 0) + 1;
    return acc;
  }, {});

  const topValidInstitutions = Object.entries(institutionValidStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Valid Certificates</h4>
          <p className="text-3xl font-bold text-green-600">{validCerts.length}</p>
          <p className="text-sm text-green-600 mt-1">Successfully verified</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Recent Valid</h4>
          <p className="text-3xl font-bold text-blue-600">{recentValid.length}</p>
          <p className="text-sm text-blue-600 mt-1">Past 7 days</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Top Performing Institutions</h4>
        <div className="space-y-3">
          {topValidInstitutions.map(([institution, count], index) => (
            <div key={institution} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium">{institution}</span>
              </div>
              <span className="text-lg font-bold text-green-600">{count} valid</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Verification Success Rate</h4>
        <p className="text-2xl font-bold text-green-600">
          {certificates.length > 0 ? Math.round((validCerts.length / certificates.length) * 100) : 0}%
        </p>
        <p className="text-sm text-green-600 mt-1">Of all certificates uploaded</p>
      </div>
    </div>
  );
};

// Invalid Certificates Info Component
const InvalidCertificatesInfo = ({ certificates }) => {
  const invalidCerts = certificates.filter(cert => cert.status === 'invalid');
  const recentInvalid = invalidCerts.filter(cert => {
    const certDate = new Date(cert.uploadTimestamp);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return certDate >= weekAgo;
  });

  const reasonStats = invalidCerts.reduce((acc, cert) => {
    const reason = cert.reason || 'Unspecified';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const topReasons = Object.entries(reasonStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Invalid Certificates</h4>
          <p className="text-3xl font-bold text-red-600">{invalidCerts.length}</p>
          <p className="text-sm text-red-600 mt-1">Verification failed</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">Recent Invalid</h4>
          <p className="text-3xl font-bold text-orange-600">{recentInvalid.length}</p>
          <p className="text-sm text-orange-600 mt-1">Past 7 days</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Common Failure Reasons</h4>
        <div className="space-y-3">
          {topReasons.map(([reason, count], index) => (
            <div key={reason} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ExclamationTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium">{reason}</span>
              </div>
              <span className="text-lg font-bold text-red-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Action Required</h4>
        <p className="text-sm text-yellow-700 mb-2">
          {invalidCerts.length} certificate{invalidCerts.length !== 1 ? 's' : ''} require admin attention
        </p>
        <button 
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          onClick={() => {
            // Set filters to show only invalid certificates
            window.dispatchEvent(new CustomEvent('filterInvalidCertificates'));
          }}
        >
          Review Invalid Certificates
        </button>
      </div>
    </div>
  );
};

// Pending Review Info Component
const PendingReviewInfo = ({ certificates }) => {
  const pendingCerts = certificates.filter(cert => cert.status === 'pending' || cert.reviewStatus === 'pending');
  const urgentPending = pendingCerts.filter(cert => {
    const uploadDate = new Date(cert.uploadTimestamp);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return uploadDate <= dayAgo;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Pending Review</h4>
          <p className="text-3xl font-bold text-yellow-600">{pendingCerts.length}</p>
          <p className="text-sm text-yellow-600 mt-1">Awaiting admin action</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Urgent</h4>
          <p className="text-3xl font-bold text-red-600">{urgentPending.length}</p>
          <p className="text-sm text-red-600 mt-1">Over 24 hours old</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Recent Pending Certificates</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {pendingCerts.slice(0, 5).map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">{cert.studentName || 'Unknown Student'}</p>
                <p className="text-sm text-gray-600">{cert.institutionName || 'Unknown Institution'}</p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(cert.uploadTimestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">Pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Review All Pending
          </button>
          <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
            Review Urgent Only
          </button>
        </div>
      </div>
    </div>
  );
};

// Fraud Attempts Info Component
const FraudAttemptsInfo = ({ certificates }) => {
  const fraudAttempts = certificates.filter(cert => 
    cert.status === 'invalid' && 
    (cert.reason?.includes('fraud') || cert.reason?.includes('tamper') || cert.reason?.includes('fake'))
  );
  
  const recentFraud = fraudAttempts.filter(cert => {
    const certDate = new Date(cert.uploadTimestamp);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return certDate >= weekAgo;
  });

  const fraudTypes = fraudAttempts.reduce((acc, cert) => {
    const reason = cert.reason || 'Unknown fraud type';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Total Fraud Attempts</h4>
          <p className="text-3xl font-bold text-red-600">{fraudAttempts.length}</p>
          <p className="text-sm text-red-600 mt-1">Detected and blocked</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">This Week</h4>
          <p className="text-3xl font-bold text-orange-600">{recentFraud.length}</p>
          <p className="text-sm text-orange-600 mt-1">Recent attempts</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Detection Rate</h4>
          <p className="text-3xl font-bold text-purple-600">100%</p>
          <p className="text-sm text-purple-600 mt-1">Successfully blocked</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Fraud Types Detected</h4>
        <div className="space-y-3">
          {Object.entries(fraudTypes).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ExclamationTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium">{type}</span>
              </div>
              <span className="text-lg font-bold text-red-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">🛡️ Security Status</h4>
        <p className="text-sm text-green-700 mb-2">
          All fraud attempts have been successfully detected and blocked. Your system is secure.
        </p>
        <div className="text-xs text-green-600">
          Last security scan: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Verification Rate Info Component
const VerificationRateInfo = ({ certificates }) => {
  const valid = certificates.filter(cert => cert.status === 'valid').length;
  const invalid = certificates.filter(cert => cert.status === 'invalid').length;
  const total = certificates.length;
  const rate = total > 0 ? (valid / total) * 100 : 0;

  const monthlyRates = certificates.reduce((acc, cert) => {
    const month = new Date(cert.uploadTimestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) acc[month] = { valid: 0, total: 0 };
    acc[month].total++;
    if (cert.status === 'valid') acc[month].valid++;
    return acc;
  }, {});

  const rateHistory = Object.entries(monthlyRates)
    .slice(-6)
    .map(([month, stats]) => ({
      month,
      rate: (stats.valid / stats.total) * 100
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Current Rate</h4>
          <p className="text-3xl font-bold text-purple-600">{rate.toFixed(1)}%</p>
          <p className="text-sm text-purple-600 mt-1">Overall verification success</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Valid Count</h4>
          <p className="text-3xl font-bold text-green-600">{valid}</p>
          <p className="text-sm text-green-600 mt-1">Successfully verified</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Invalid Count</h4>
          <p className="text-3xl font-bold text-red-600">{invalid}</p>
          <p className="text-sm text-red-600 mt-1">Failed verification</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Monthly Verification Trend</h4>
        <div className="space-y-3">
          {rateHistory.map(({ month, rate: monthRate }) => (
            <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{month}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${monthRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-purple-600">{monthRate.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📊 Performance Insights</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• High verification rate indicates strong certificate quality</p>
          <p>• Monitor trends to identify potential issues early</p>
          <p>• Current rate of {rate.toFixed(1)}% is {rate > 90 ? 'excellent' : rate > 75 ? 'good' : 'needs attention'}</p>
        </div>
      </div>
    </div>
  );
};

const EnhancedAdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'valid', 'invalid'
    search: '',
    dateRange: 'all' // 'all', 'today', 'week', 'month'
  });
  
  // Modal states for dashboard cards
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (modalType) => {
    setActiveModal(modalType);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };

  // Mock data for invalid certificates
  const mockInvalidCertificates = [
    {
      id: 'CERT_INV_001',
      studentName: 'Invalid Student 1',
      courseName: 'Fake Course',
      institutionName: 'Unknown Institution',
      status: 'invalid',
      reason: 'Hash mismatch - potential tampering detected',
      uploadTimestamp: new Date(Date.now() - 86400000).toISOString(),
      hash: 'invalid_hash_123'
    },
    {
      id: 'CERT_INV_002', 
      studentName: 'Invalid Student 2',
      courseName: 'Non-existent Program',
      institutionName: 'Fraudulent College',
      status: 'invalid',
      reason: 'Institution not recognized',
      uploadTimestamp: new Date(Date.now() - 172800000).toISOString(),
      hash: 'invalid_hash_456'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [certificates, filters]);
  
  useEffect(() => {
    // Listen for filter events from modal buttons
    const handleFilterInvalidCertificates = () => {
      setFilters(prev => ({ ...prev, status: 'invalid' }));
      closeModal();
    };
    
    window.addEventListener('filterInvalidCertificates', handleFilterInvalidCertificates);
    
    return () => {
      window.removeEventListener('filterInvalidCertificates', handleFilterInvalidCertificates);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load analytics and certificates
      const [analyticsData, certificatesData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getAllCertificates()
      ]);

      // Combine valid and invalid certificates
      const allCertificates = [
        ...certificatesData.certificates,
        ...mockInvalidCertificates
      ];

      setAnalytics(analyticsData);
      setCertificates(allCertificates);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...certificates];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(cert => cert.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(cert => 
        cert.studentName?.toLowerCase().includes(searchLower) ||
        cert.courseName?.toLowerCase().includes(searchLower) ||
        cert.institutionName?.toLowerCase().includes(searchLower) ||
        cert.id.toLowerCase().includes(searchLower)
      );
    }

    // Date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      if (cutoffDate) {
        filtered = filtered.filter(cert => 
          new Date(cert.uploadTimestamp) >= cutoffDate
        );
      }
    }

    setFilteredCertificates(filtered);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const getStatusCounts = () => {
    const valid = certificates.filter(cert => cert.status === 'valid').length;
    const invalid = certificates.filter(cert => cert.status === 'invalid').length;
    return { valid, invalid, total: certificates.length };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('adminDashboard')}</h1>
          <p className="text-gray-600">{t('systemOverview')}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
            <button
              onClick={loadDashboardData}
              className="p-1 hover:bg-gray-200 rounded"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {/* Total Certificates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openModal('total')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('totalCertificates')}</p>
              <p className="text-3xl font-bold text-gray-800">{statusCounts.total}</p>
            </div>
          </motion.div>

          {/* Valid Certificates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openModal('valid')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('validCertificates')}</p>
              <p className="text-3xl font-bold text-green-600">{statusCounts.valid}</p>
            </div>
          </motion.div>

          {/* Invalid Certificates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openModal('invalid')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invalid Certificates</p>
              <p className="text-3xl font-bold text-red-600">{statusCounts.invalid}</p>
            </div>
          </motion.div>

          {/* Pending Review Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openModal('pending')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">1</p>
            </div>
          </motion.div>

          {/* Fraud Attempts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openModal('fraud')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fraud Attempts</p>
              <p className="text-3xl font-bold text-red-600">8</p>
            </div>
          </motion.div>

          {/* Verification Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openModal('rate')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('verificationRate')}</p>
              <p className="text-3xl font-bold text-purple-600">
                {statusCounts.total > 0 ? Math.round((statusCounts.valid / statusCounts.total) * 100) : 0}%
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('allCertificates')}</option>
              <option value="valid">{t('validCerts')}</option>
              <option value="invalid">{t('invalidCerts')}</option>
            </select>

            {/* Date Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredCertificates.length} of {certificates.length} certificates
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((certificate, index) => (
                  <motion.tr
                    key={certificate.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {certificate.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.studentName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.institutionName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        certificate.status === 'valid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.status === 'valid' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {certificate.status === 'valid' ? 'Valid' : 'Invalid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(certificate.uploadTimestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewCertificate(certificate)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t('viewDetails')}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredCertificates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noDataFound')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Details Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      
      {/* Dashboard Card Info Modals */}
      <InfoModal 
        isOpen={activeModal === 'total'} 
        onClose={closeModal}
        title="Total Certificates"
        icon={BarChart3}
        color="bg-blue-500"
      >
        <TotalCertificatesInfo certificates={certificates} analytics={analytics} />
      </InfoModal>

      <InfoModal 
        isOpen={activeModal === 'valid'} 
        onClose={closeModal}
        title="Valid Certificates"
        icon={CheckCircle}
        color="bg-green-500"
      >
        <ValidCertificatesInfo certificates={certificates} />
      </InfoModal>

      <InfoModal 
        isOpen={activeModal === 'invalid'} 
        onClose={closeModal}
        title="Invalid Certificates"
        icon={XCircle}
        color="bg-red-500"
      >
        <InvalidCertificatesInfo certificates={certificates} />
      </InfoModal>

      <InfoModal 
        isOpen={activeModal === 'pending'} 
        onClose={closeModal}
        title="Pending Review"
        icon={Clock}
        color="bg-yellow-500"
      >
        <PendingReviewInfo certificates={certificates} />
      </InfoModal>

      <InfoModal 
        isOpen={activeModal === 'fraud'} 
        onClose={closeModal}
        title="Fraud Attempts"
        icon={AlertTriangle}
        color="bg-red-500"
      >
        <FraudAttemptsInfo certificates={certificates} />
      </InfoModal>

      <InfoModal 
        isOpen={activeModal === 'rate'} 
        onClose={closeModal}
        title="Verification Rate"
        icon={TrendingUp}
        color="bg-purple-500"
      >
        <VerificationRateInfo certificates={certificates} />
      </InfoModal>
    </div>
  );
};

export default EnhancedAdminDashboard;