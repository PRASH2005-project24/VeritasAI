import React from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, CheckCircle } from 'lucide-react';

const StudentVerifierPage = () => {
  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <Search className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Certificate Verification</h1>
          <p className="text-xl text-white/80">
            Upload your certificate to verify its authenticity instantly
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <div className="upload-area">
            <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Certificate</h3>
            <p className="text-white/70 mb-4">
              Drag and drop your certificate here or click to browse
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              Select File
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Instant Results</h3>
            <p className="text-sm text-white/70">Get verification results in seconds</p>
          </div>
          <div className="glass-card p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Tamper Detection</h3>
            <p className="text-sm text-white/70">Advanced algorithms detect any modifications</p>
          </div>
          <div className="glass-card p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Blockchain Verified</h3>
            <p className="text-sm text-white/70">Certificates verified against blockchain records</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentVerifierPage;