import React from 'react';
import { motion } from 'framer-motion';
import { Settings, BarChart3, Shield, Users, Database, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Certificates', value: '10', icon: Database, color: 'text-blue-400' },
    { label: 'Valid Certificates', value: '10', icon: Shield, color: 'text-green-400' },
    { label: 'Fraud Attempts', value: '0', icon: Activity, color: 'text-red-400' },
    { label: 'Active Institutions', value: '5', icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <Settings className="h-16 w-16 text-orange-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl text-white/80">
            Monitor system analytics and blockchain transactions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <h3 className="font-semibold text-white/90">{stat.label}</h3>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Analytics Chart Placeholder */}
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold">Verification Analytics</h2>
            </div>
            <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-white/70">Chart visualization will be implemented</p>
                <p className="text-sm text-white/50 mt-2">Showing verification trends and fraud detection</p>
              </div>
            </div>
          </div>

          {/* Blockchain Dashboard */}
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold">Blockchain Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="font-medium">Network Status</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="font-medium">Latest Block</span>
                <span className="text-blue-400">#12,345</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="font-medium">Gas Price</span>
                <span className="text-yellow-400">20 gwei</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="font-medium">Contract Address</span>
                <span className="text-purple-400 text-sm">0x1234...5678</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Certificates Table */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Certificates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">Certificate ID</th>
                  <th className="text-left py-3 px-4">Student Name</th>
                  <th className="text-left py-3 px-4">Institution</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-blue-400">CERT_001</td>
                  <td className="py-3 px-4">John Doe</td>
                  <td className="py-3 px-4">MIT University</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-600 rounded-full text-xs">Valid</span>
                  </td>
                  <td className="py-3 px-4">2024-01-15</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-blue-400">CERT_002</td>
                  <td className="py-3 px-4">Jane Smith</td>
                  <td className="py-3 px-4">Stanford University</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-600 rounded-full text-xs">Valid</span>
                  </td>
                  <td className="py-3 px-4">2024-01-16</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-blue-400">CERT_003</td>
                  <td className="py-3 px-4">Bob Johnson</td>
                  <td className="py-3 px-4">IIT Delhi</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-600 rounded-full text-xs">Valid</span>
                  </td>
                  <td className="py-3 px-4">2024-01-17</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;