import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/mockApi.js';

const QRCodeScanner = ({ isOpen, onClose, onResult }) => {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setError('Camera access denied. Please allow camera permission and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const startScanning = () => {
    setIsScanning(true);
    setResult(null);
    setError('');
    
    // Simulate QR code scanning
    const scanInterval = setInterval(() => {
      const frameData = captureFrame();
      if (frameData) {
        // Simulate QR code detection
        simulateQRDetection(frameData);
      }
    }, 1000);

    // Stop scanning after 30 seconds
    setTimeout(() => {
      clearInterval(scanInterval);
      if (isScanning && !result) {
        setIsScanning(false);
        setError('No QR code detected. Please ensure the QR code is clearly visible.');
      }
    }, 30000);
  };

  const simulateQRDetection = async (frameData) => {
    // Simulate QR code detection with random success
    const mockQRCodes = [
      'CERT_001',
      'CERT_002',
      'CERT_INV_001',
      'CERT_INV_002'
    ];

    // 30% chance of detecting a QR code
    if (Math.random() < 0.3) {
      const randomCertId = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
      await processQRCode(randomCertId);
    }
  };

  const processQRCode = async (qrData) => {
    try {
      setIsScanning(false);
      setIsProcessing(true);
      setError('');

      // Extract certificate ID from QR data
      let certificateId = qrData;
      
      // If QR data is JSON, parse it
      try {
        const parsed = JSON.parse(qrData);
        certificateId = parsed.certificateId || parsed.id || qrData;
      } catch {
        // QR data is plain text, use as-is
      }

      // Verify certificate by ID
      const verificationResult = await apiService.verifyCertificateById(certificateId);
      
      setResult({
        certificateId,
        ...verificationResult
      });

      if (onResult) {
        onResult(verificationResult);
      }
    } catch (error) {
      console.error('QR processing error:', error);
      setError('Failed to verify certificate. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualInput = () => {
    const input = prompt('Enter Certificate ID manually:');
    if (input) {
      processQRCode(input.trim());
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Simulate QR code extraction from image
        setTimeout(() => {
          const mockCertId = 'CERT_' + Math.floor(Math.random() * 1000);
          processQRCode(mockCertId);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('scanQR')}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-1">Scan certificate QR code</p>
          </div>

          <div className="p-6">
            {/* Camera Permission */}
            {hasPermission === false && (
              <div className="text-center py-8">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Camera permission is required to scan QR codes</p>
                <button
                  onClick={startCamera}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enable Camera
                </button>
              </div>
            )}

            {/* Camera View */}
            {hasPermission && !result && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                    
                    {isScanning && (
                      <motion.div
                        initial={{ y: -50 }}
                        animate={{ y: 150 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-1 bg-blue-500 opacity-50"
                      />
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                <div className="absolute bottom-4 left-4 right-4">
                  {isProcessing && (
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing QR code...
                      </div>
                    </div>
                  )}
                  
                  {isScanning && !isProcessing && (
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-center">
                      Scanning for QR code...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="text-center py-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  result.isValid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {result.isValid ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <X className="h-8 w-8 text-red-600" />
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${
                  result.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.isValid ? 'Certificate Valid' : 'Certificate Invalid'}
                </h3>
                
                {result.certificate && (
                  <div className="text-left bg-gray-50 p-4 rounded-lg mt-4">
                    <p><strong>Certificate ID:</strong> {result.certificate.id}</p>
                    <p><strong>Student:</strong> {result.certificate.studentName}</p>
                    <p><strong>Course:</strong> {result.certificate.courseName}</p>
                    <p><strong>Institution:</strong> {result.certificate.institutionName}</p>
                    {result.certificate.issueDate && (
                      <p><strong>Issue Date:</strong> {result.certificate.issueDate}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Control Buttons */}
            {hasPermission && !result && (
              <div className="flex gap-3 mt-6">
                {!isScanning && !isProcessing && (
                  <button
                    onClick={startScanning}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Scanning
                  </button>
                )}
                
                {isScanning && (
                  <button
                    onClick={() => setIsScanning(false)}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Stop Scanning
                  </button>
                )}
              </div>
            )}

            {/* Alternative Options */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleManualInput}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Enter ID Manually
              </button>
              
              <label className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm cursor-pointer text-center">
                <Upload className="h-4 w-4 inline mr-1" />
                Upload QR Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* New Scan Button */}
            {result && (
              <button
                onClick={() => {
                  setResult(null);
                  setError('');
                  startCamera();
                }}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Scan Another QR Code
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeScanner;