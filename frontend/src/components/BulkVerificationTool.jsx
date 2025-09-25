import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle, XCircle, AlertTriangle, 
  Download, RefreshCw, Filter, BarChart3 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/mockApi.js';

const BulkVerificationTool = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  
  // Mock CSV data template
  const csvTemplate = `Certificate ID,Student Name,Expected Institution
CERT_001,John Doe,Tech University
CERT_002,Jane Smith,AI Institute
CERT_INV_001,Invalid Student,Unknown College`;

  const handleFileSelect = (file) => {
    if (!file) return;
    
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV or Excel file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }
    
    setUploadedFile(file);
    setError('');
    setResults(null);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const processCSV = (csvContent) => {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least one data row');
      }
      
      const certificates = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 2 && values[0]) {
          certificates.push({
            certificateId: values[0],
            studentName: values[1] || '',
            expectedInstitution: values[2] || ''
          });
        }
      }
      
      if (certificates.length === 0) {
        throw new Error('No valid certificate data found in CSV');
      }
      
      return certificates;
    } catch (error) {
      throw new Error(`CSV parsing error: ${error.message}`);
    }
  };

  const startBulkVerification = async () => {
    if (!uploadedFile) {
      setError('Please select a file first');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      
      // Read file content
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(uploadedFile);
      });
      
      // Parse CSV data
      const certificates = processCSV(fileContent);
      
      // Create FormData for API call
      const formData = new FormData();
      formData.append('csvFile', uploadedFile);
      formData.append('certificateCount', certificates.length.toString());
      
      // Process bulk verification
      const bulkResult = await apiService.bulkVerification(formData);
      
      // Enhance results with detailed verification
      const enhancedResults = await Promise.all(
        certificates.map(async (cert, index) => {
          try {
            // Simulate individual verification
            const verifyResult = await apiService.verifyCertificateById(cert.certificateId);
            
            return {
              ...cert,
              index: index + 1,
              status: verifyResult.isValid ? 'valid' : 'invalid',
              verified: verifyResult.isValid,
              details: verifyResult.certificate || null,
              reason: !verifyResult.isValid ? 'Certificate not found or invalid' : null,
              verificationTime: new Date().toISOString()
            };
          } catch (error) {
            return {
              ...cert,
              index: index + 1,
              status: 'error',
              verified: false,
              details: null,
              reason: 'Verification failed',
              verificationTime: new Date().toISOString()
            };
          }
        })
      );
      
      const summary = {
        total: enhancedResults.length,
        valid: enhancedResults.filter(r => r.status === 'valid').length,
        invalid: enhancedResults.filter(r => r.status === 'invalid').length,
        errors: enhancedResults.filter(r => r.status === 'error').length,
        processedAt: new Date().toISOString()
      };
      
      setResults({
        summary,
        certificates: enhancedResults,
        fileName: uploadedFile.name
      });
      
    } catch (error) {
      console.error('Bulk verification error:', error);
      setError(error.message || 'Failed to process bulk verification');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;
    
    // Create CSV content
    const headers = [
      'Index',
      'Certificate ID', 
      'Student Name',
      'Expected Institution',
      'Status',
      'Verified Institution',
      'Course',
      'Issue Date',
      'Reason'
    ];
    
    const csvContent = [
      headers.join(','),
      ...results.certificates.map(cert => [
        cert.index,
        cert.certificateId,
        cert.studentName || '',
        cert.expectedInstitution || '',
        cert.status,
        cert.details?.institutionName || '',
        cert.details?.courseName || '',
        cert.details?.issueDate || '',
        cert.reason || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_verification_results_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_verification_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setResults(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('bulkVerification')}</h1>
          <p className="text-gray-600">{t('processMultiple')}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500">Welcome, {user?.name} ({user?.role})</span>
          </div>
        </div>

        {/* Upload Section */}
        {!results && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Upload Certificate List</h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : uploadedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />
              
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-green-800">{uploadedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for processing
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={startBulkVerification}
                      disabled={isProcessing}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Start Verification
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetUpload}
                      disabled={isProcessing}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="h-5 w-5 mr-2 inline" />
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drag & drop your CSV file here
                    </p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Select File
                  </button>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                    <p>Maximum file size: 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">CSV Format Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• First column: Certificate ID (required)</li>
                <li>• Second column: Student Name (optional)</li>
                <li>• Third column: Expected Institution (optional)</li>
                <li>• Use comma-separated values</li>
                <li>• Include header row in your CSV file</li>
              </ul>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Processed</p>
                    <p className="text-3xl font-bold text-gray-800">{results.summary.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valid Certificates</p>
                    <p className="text-3xl font-bold text-green-600">{results.summary.valid}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Invalid Certificates</p>
                    <p className="text-3xl font-bold text-red-600">{results.summary.invalid}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {Math.round((results.summary.valid / results.summary.total) * 100)}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Verification Results</h2>
                  <p className="text-sm text-gray-500">File: {results.fileName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadResults}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </button>
                  <button
                    onClick={resetUpload}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Upload
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institution</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.certificates.map((cert, index) => (
                      <motion.tr
                        key={cert.certificateId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cert.index}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {cert.certificateId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cert.studentName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cert.status === 'valid'
                              ? 'bg-green-100 text-green-800'
                              : cert.status === 'invalid'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cert.status === 'valid' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : cert.status === 'invalid' ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {cert.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cert.details?.institutionName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cert.details?.courseName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {cert.reason || 'Verified successfully'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkVerificationTool;