# VeritasAI - Certificate Authenticity Validator 🎓🔒

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%3E%3D18.0.0-blue.svg)](https://reactjs.org/)

🚀 **Smart India Hackathon 2025 MVP** - A blockchain-powered certificate verification system with AI-driven OCR processing that ensures document authenticity and prevents fraud.

## 🎯 Project Overview

VeritasAI is a comprehensive certificate authenticity validator designed for academic institutions, students, verifiers (employers/government), and administrators. The system uses blockchain technology, OCR processing, and AI to ensure certificate authenticity and detect tampering.

## ✅ Completed Features

### Phase 1 - Core MVP (COMPLETED)
- ✅ **Project Setup & Structure**: Full folder structure with frontend, backend, blockchain, and data directories
- ✅ **Backend Core APIs**: Express server with complete certificate upload, verification, OCR, and analytics endpoints
- ✅ **Blockchain Integration**: Smart contract for certificate anchoring with deployment scripts
- ✅ **Frontend Foundation**: React app with routing, Navbar, and Landing page

### Key Components Built:

#### Backend (`/backend/`)
- Complete Express server with all required APIs
- OCR integration using Tesseract.js
- SHA-256 hashing for certificate fingerprinting
- QR code generation for verified certificates
- Mock database with 10 sample certificates
- File upload handling with validation
- Analytics and admin endpoints
- Bulk verification support

#### Blockchain (`/blockchain/`)
- Solidity smart contract for certificate storage and verification
- Web3.js integration for blockchain interactions
- Deployment scripts for Ganache/testnet
- Contract methods for certificate anchoring and verification

#### Frontend (`/frontend/`)
- React app with React Router setup
- Modern UI with Tailwind CSS and Framer Motion
- Responsive navigation with glassmorphism design
- Landing page with role-based navigation

#### Data (`/data/`)
- Mock database with 10 realistic sample certificates
- Sample data for testing different scenarios

## 📂 Project Structure

```
Veritasai 2.5/
├── backend/           # Express.js API server
│   ├── server.js     # Main server file with all APIs
│   ├── package.json  # Dependencies and scripts
│   └── .env          # Environment configuration
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── App.jsx           # Main App component
│   │   ├── components/       # Reusable components
│   │   │   └── Navbar.jsx   # Navigation bar
│   │   ├── pages/           # Page components
│   │   │   └── LandingPage.jsx
│   │   └── utils/           # Utility functions
│   ├── index.html    # HTML template
│   └── package.json  # Frontend dependencies
├── blockchain/       # Smart contracts and deployment
│   ├── contracts/
│   │   └── CertificateVerification.sol
│   ├── deploy.js     # Deployment and interaction script
│   └── package.json  # Blockchain dependencies
└── data/
    └── mock_db.json  # Sample certificate data
```

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **Tesseract.js** for OCR processing
- **crypto-js** for SHA-256 hashing
- **qrcode** for QR code generation
- **multer** for file uploads
- **web3** for blockchain interaction

### Frontend
- **React 18** with React Router
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls

### Blockchain
- **Solidity** smart contracts
- **Web3.js** for blockchain interaction
- **Ganache** for local development

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/PRASH2005-project24/VeritasAI.git
cd VeritasAI

# Start backend server
cd backend
npm install
npm start

# Start frontend server (in new terminal)
cd frontend
npm install
npm run dev

# Visit http://localhost:5173 to use the application
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Ganache** (for blockchain development) - [Download here](https://trufflesuite.com/ganache/)

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/PRASH2005-project24/VeritasAI.git
cd VeritasAI
```

2. **Backend Setup**
```bash
cd backend
npm install
npm start  # Server runs on http://localhost:3001
```

3. **Frontend Setup** (New Terminal)
```bash
cd frontend
npm install
npm run dev  # App runs on http://localhost:5173
```

4. **Blockchain Setup** (Optional)
```bash
cd blockchain
npm install
node deploy.js  # After starting Ganache
```

### Environment Setup

Create `.env` files in respective directories:

**Backend (.env)**:
```env
PORT=3001
NODE_ENV=development
BLOCKCHAIN_NETWORK=http://127.0.0.1:7545
CORS_ORIGIN=http://localhost:5173
```

## 📋 Remaining Tasks (Next Development Phase)

### Phase 1 Completion (Priority)
- [ ] Complete Student/Verifier page with file upload and verification results
- [ ] Complete Institution page with certificate upload and QR generation
- [ ] Complete Admin dashboard with analytics and certificate management

### Phase 2 - Enhanced Features
- [ ] MCP Agent chatbot with natural language queries
- [ ] Bulk verification system with CSV processing
- [ ] Advanced fraud detection and reporting

### Phase 3 - Polish & Testing
- [ ] Dark/light mode implementation
- [ ] Comprehensive testing (unit + integration)
- [ ] Demo script and presentation materials
- [ ] Performance optimization

## 🎯 API Endpoints

### Certificate Operations
- `POST /api/upload-certificate` - Upload and process certificate (Institution)
- `POST /api/verify-certificate` - Verify certificate authenticity
- `GET /api/verify/:certificateId` - Verify by certificate ID

### Admin Operations
- `GET /api/admin/certificates` - Get all certificates
- `GET /api/admin/analytics` - Get system analytics
- `POST /api/bulk-verify` - Bulk certificate verification

### System
- `GET /health` - Health check endpoint

## 🔒 Security Features

- **Blockchain Anchoring**: Certificate hashes stored immutably on blockchain
- **Hash Verification**: SHA-256 fingerprinting detects tampering
- **File Validation**: Secure file upload with type and size restrictions
- **QR Code Security**: Tamper-proof QR codes for verification

## 🎮 Demo Workflow

1. **Institution uploads certificate** → OCR extracts text → Hash generated → Stored on blockchain → QR code created
2. **Student/Verifier uploads certificate** → Hash generated → Blockchain verification → Result displayed
3. **Admin monitors** → Dashboard shows analytics → Fraud detection reports
4. **AI Agent helps** → Natural language queries → Instant responses

## 🏆 Hackathon Features Checklist

- ✅ Certificate upload and processing
- ✅ OCR text extraction
- ✅ Blockchain hash storage
- ✅ QR code generation
- ✅ Verification with tamper detection
- ✅ Multi-role user interface
- ✅ Modern responsive design
- ✅ Mock data for demonstration
- ✅ RESTful API architecture
- ✅ Real-time verification results

## 👥 User Roles

1. **Student/Verifier**: Upload and verify certificates
2. **Institution**: Issue certificates with blockchain anchoring
3. **Admin**: Monitor system and view analytics
4. **AI Agent**: Assist with queries and provide insights

## 📊 Demo Data

The system includes 10 sample certificates from prestigious institutions like MIT, Stanford, Harvard, etc., for demonstration purposes.

## 🎬 Demo

### Live Demo
- **🌐 Frontend**: [Visit VeritasAI Live](https://prash2005-project24.github.io/VeritasAI/) - *Deployed on GitHub Pages*
- **🔧 Backend API**: [Health Check](https://project-u5k3s-p9zaoezd3-binarybits-projects.vercel.app/health) - *Deployed on Vercel*
- **📊 Local Development**: [localhost:5173](http://localhost:5173) & [localhost:3001](http://localhost:3001/health)

### Demo Credentials
- The system includes 17 sample certificates for testing
- Upload any image file to test OCR functionality
- Use the admin panel to view analytics and manage certificates

## 🚀 Deployment

### Production Deployment
- **Frontend**: Automatically deployed to GitHub Pages on every push to `main`
- **Backend**: Deploy to Render.com or Vercel for free hosting
- **Full Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

### Quick Deploy
```bash
# Frontend (GitHub Pages)
# Push to main branch - auto-deploys via GitHub Actions

# Backend (Render.com)
# 1. Create account at render.com
# 2. Connect GitHub repo
# 3. Select 'backend' folder
# 4. Set start command: npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **PRASH2005-project24** - *Lead Developer* - [GitHub](https://github.com/PRASH2005-project24)

## 📞 Support

If you have any questions or issues:

- 📧 Email: chandrasheelprasheek24@gmail.com
- 🐛 [Report Issues](https://github.com/PRASH2005-project24/VeritasAI/issues)
- 💬 [Discussions](https://github.com/PRASH2005-project24/VeritasAI/discussions)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Built for Smart India Hackathon 2025** 🇮🇳

**Team: VeritasAI** | **Status: Core MVP Complete - Ready for Phase 2 Development**

<div align="center">
  Made with ❤️ for a more secure and trustworthy certificate verification system
</div>
