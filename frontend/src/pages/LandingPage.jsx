import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Building, 
  Settings, 
  Bot,
  CheckCircle,
  Zap,
  Lock,
  Users
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Certificates are anchored on blockchain for immutable verification',
      color: 'text-blue-400'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Get verification results in seconds with our AI-powered OCR',
      color: 'text-yellow-400'
    },
    {
      icon: Lock,
      title: 'Tamper Detection',
      description: 'Advanced hash comparison detects any document modifications',
      color: 'text-red-400'
    },
    {
      icon: Users,
      title: 'Multi-Role Access',
      description: 'Designed for students, institutions, verifiers, and administrators',
      color: 'text-green-400'
    }
  ];

  const userRoles = [
    {
      icon: Search,
      title: 'Students & Verifiers',
      description: 'Upload and verify certificate authenticity instantly',
      link: '/verify',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Building,
      title: 'Institutions',
      description: 'Issue certificates with blockchain anchoring and QR codes',
      link: '/institution',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Settings,
      title: 'Administrators',
      description: 'Monitor system analytics and blockchain transactions',
      link: '/admin',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get help with natural language queries about certificates',
      link: '/agent',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const stats = [
    { value: '10+', label: 'Sample Certificates' },
    { value: '100%', label: 'Accuracy Rate' },
    { value: '<2s', label: 'Verification Time' },
    { value: '24/7', label: 'Availability' }
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 px-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Shield className="h-20 w-20 text-white mx-auto mb-6 animate-pulse-glow" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            VeritasAI
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Revolutionary certificate authenticity validator powered by blockchain technology and AI
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            to="/verify"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-700 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Search className="mr-2" size={20} />
            Start Verification
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose VeritasAI?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Advanced technology meets user-friendly design for the most secure certificate verification
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-card p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <Icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* User Roles Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              VeritasAI is designed for everyone in the education ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userRoles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                >
                  <Link
                    to={role.link}
                    className={`block glass-card p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group`}
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${role.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-white/70 group-hover:text-white/80 transition-colors">
                      {role.description}
                    </p>
                    <div className="mt-4 text-blue-200 font-semibold group-hover:text-white transition-colors">
                      Get Started →
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-white/80">
              Simple 3-step process for bulletproof certificate verification
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Upload your certificate image or PDF' },
              { step: '02', title: 'Process', desc: 'AI extracts text and generates digital fingerprint' },
              { step: '03', title: 'Verify', desc: 'Blockchain verification confirms authenticity' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <div className="glass-card p-8">
                  <div className="text-4xl font-bold text-blue-200 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-white/30"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Certificates?</h2>
          <p className="text-xl text-white/80 mb-8">
            Join institutions and verifiers worldwide who trust VeritasAI for certificate authenticity
          </p>
          <div className="space-x-4">
            <Link
              to="/verify"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-700 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Search className="mr-2" size={20} />
              Verify Certificate
            </Link>
            <Link
              to="/institution"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300"
            >
              <Building className="mr-2" size={20} />
              Institution Portal
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default LandingPage;