import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Shield, AlertTriangle, CheckCircle, XCircle, 
  Eye, Filter, Search, Calendar, Download, RefreshCw, Info,
  TrendingUp, Clock, ExclamationTriangle, Award
} from 'lucide-react';
import apiService from '../services/mockApi.js';

// Simple Admin Dashboard that works with existing context
const SimpleAdminDashboard = () => {
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
    const pending = 1; // Mock pending count
    const fraud = 8; // Mock fraud count
    return { valid, invalid, pending, fraud, total: certificates.length };
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor certificate verification activities and system analytics.</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500">Welcome back, Admin</span>
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
              <p className="text-sm text-gray-600">Total Certificates</p>
              <p className="text-3xl font-bold text-gray-800">{statusCounts.total}</p>
            </div>
          </motion.div>

          {/* Valid Certificates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
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
              <p className="text-sm text-gray-600">Valid Certificates</p>
              <p className="text-3xl font-bold text-green-600">{statusCounts.valid}</p>
            </div>
          </motion.div>

          {/* Invalid Certificates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
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
              <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
          </motion.div>

          {/* Fraud Attempts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
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
              <p className="text-3xl font-bold text-red-600">{statusCounts.fraud}</p>
            </div>
          </motion.div>

          {/* Verification Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
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
              <p className="text-sm text-gray-600">Verification Rate</p>
              <p className="text-3xl font-bold text-purple-600">
                {statusCounts.total > 0 ? Math.round((statusCounts.valid / statusCounts.total) * 100) : 0}%
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Required Alert */}
        {statusCounts.invalid > 0 && (
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">Action Required</h3>
                <p className="text-yellow-700">{statusCounts.invalid} certificate(s) require admin attention</p>
              </div>
              <button 
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                onClick={() => setFilters(prev => ({ ...prev, status: 'invalid' }))}
              >
                Review Invalid Certificates
              </button>
            </div>
          </div>
        )}

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
              <option value="all">All Certificates</option>
              <option value="valid">Valid Certificates</option>
              <option value="invalid">Invalid Certificates</option>
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
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredCertificates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No certificates found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Details Modal */}
      {showModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Certificate Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Certificate ID</label>
                    <p className="text-lg font-mono bg-gray-50 p-2 rounded">{selectedCertificate.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {selectedCertificate.status === 'valid' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCertificate.status === 'valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCertificate.status === 'valid' ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-lg">{selectedCertificate.studentName || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Course Name</label>
                  <p className="text-lg">{selectedCertificate.courseName || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Institution</label>
                  <p className="text-lg">{selectedCertificate.institutionName || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issue Date</label>
                    <p className="text-lg">{selectedCertificate.issueDate || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Grade</label>
                    <p className="text-lg">{selectedCertificate.grade || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Hash</label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">{selectedCertificate.hash}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Upload Date</label>
                  <p className="text-lg">{new Date(selectedCertificate.uploadTimestamp).toLocaleString()}</p>
                </div>

                {selectedCertificate.reason && (
                  <div>
                    <label className="text-sm font-medium text-red-600">Invalid Reason</label>
                    <p className="text-lg text-red-700 bg-red-50 p-2 rounded">{selectedCertificate.reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAdminDashboard;