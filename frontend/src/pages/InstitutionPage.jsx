import React from 'react';
import { motion } from 'framer-motion';
import { Building, Upload, QrCode, Shield } from 'lucide-react';

const InstitutionPage = () => {
  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <Building className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Institution Portal</h1>
          <p className="text-xl text-white/80">
            Issue certificates with blockchain anchoring and QR code generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8">
            <Upload className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Upload Certificate</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Institution Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter your institution name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Issuer Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter issuer email"
                />
              </div>
              <div className="upload-area">
                <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white/70 mb-2">Upload Certificate</p>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-sm transition-colors">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <QrCode className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Generated Assets</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-medium mb-2">QR Code</h4>
                <p className="text-sm text-white/70">Generated after successful upload</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-medium mb-2">Digital Signature</h4>
                <p className="text-sm text-white/70">Cryptographic proof of authenticity</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-medium mb-2">Blockchain Hash</h4>
                <p className="text-sm text-white/70">Immutable record on blockchain</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center">
            <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Secure Storage</h3>
            <p className="text-sm text-white/70">Certificate hashes stored on blockchain</p>
          </div>
          <div className="glass-card p-6 text-center">
            <QrCode className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">QR Generation</h3>
            <p className="text-sm text-white/70">Automatic QR code for easy verification</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Upload className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Bulk Upload</h3>
            <p className="text-sm text-white/70">Process multiple certificates at once</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstitutionPage;