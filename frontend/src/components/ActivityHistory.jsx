import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, User, FileText, CheckCircle, XCircle, Upload, 
  Filter, Calendar, Search, RefreshCw, Download, Eye 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import databaseService from '../services/databaseService';

const ActivityHistory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: 'all',
    dateRange: 'week',
    search: '',
    userId: user?.role === 'admin' ? 'all' : user?.id
  });
  
  const actionTypes = [
    { value: 'all', label: 'All Activities', icon: Clock },
    { value: 'user_created', label: 'User Registration', icon: User },
    { value: 'user_updated', label: 'Profile Updates', icon: User },
    { value: 'certificate_created', label: 'Certificate Upload', icon: Upload },
    { value: 'certificate_verified', label: 'Verification', icon: CheckCircle },
    { value: 'certificate_updated', label: 'Certificate Updates', icon: FileText },
    { value: 'login', label: 'Login Activity', icon: CheckCircle },
    { value: 'logout', label: 'Logout Activity', icon: XCircle }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  useEffect(() => {
    loadActivityHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const loadActivityHistory = async () => {
    try {
      setIsLoading(true);
      
      let history;
      if (user?.role === 'admin') {
        // Admin can see all activities
        history = databaseService.getHistory();
      } else {
        // Users see only their activities
        history = databaseService.getHistoryByUser(user?.id);
      }
      
      setActivities(history);
    } catch (error) {
      console.error('Error loading activity history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Action filter
    if (filters.action !== 'all') {
      filtered = filtered.filter(activity => activity.action === filters.action);
    }

    // User filter (admin only)
    if (user?.role === 'admin' && filters.userId !== 'all') {
      filtered = filtered.filter(activity => activity.userId === filters.userId);
    }

    // Date range filter
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
        filtered = filtered.filter(activity => 
          new Date(activity.timestamp) >= cutoffDate
        );
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.details.toLowerCase().includes(searchLower) ||
        activity.action.toLowerCase().includes(searchLower) ||
        (activity.metadata?.studentName && 
         activity.metadata.studentName.toLowerCase().includes(searchLower)) ||
        (activity.metadata?.certificateId && 
         activity.metadata.certificateId.toLowerCase().includes(searchLower))
      );
    }

    setFilteredActivities(filtered);
  };

  const getActionIcon = (action) => {
    const actionType = actionTypes.find(type => type.value === action);
    if (actionType) {
      const IconComponent = actionType.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return <Clock className="h-5 w-5" />;
  };

  const getActionColor = (action) => {
    const colors = {
      user_created: 'bg-blue-100 text-blue-600',
      user_updated: 'bg-purple-100 text-purple-600',
      certificate_created: 'bg-green-100 text-green-600',
      certificate_verified: 'bg-orange-100 text-orange-600',
      certificate_updated: 'bg-yellow-100 text-yellow-600',
      login: 'bg-green-100 text-green-600',
      logout: 'bg-gray-100 text-gray-600'
    };
    return colors[action] || 'bg-gray-100 text-gray-600';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const exportHistory = () => {
    const csvHeaders = ['Timestamp', 'Action', 'Details', 'User ID', 'IP Address'];
    const csvContent = [
      csvHeaders.join(','),
      ...filteredActivities.map(activity => [
        activity.timestamp,
        activity.action,
        `"${activity.details}"`,
        activity.userId || 'N/A',
        activity.ipAddress || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_history_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUserName = (userId) => {
    const userData = databaseService.getUserById(userId);
    return userData ? userData.name : 'Unknown User';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Activity History</h1>
          <p className="text-gray-600">Track all system activities and user interactions</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500">
              {user?.role === 'admin' ? 'System-wide view' : 'Your personal activity'}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            {/* Action Filter */}
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={loadActivityHistory}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              <button
                onClick={exportHistory}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No activities found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Activity Icon */}
                    <div className={`p-3 rounded-lg ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {activity.details}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {getUserName(activity.userId)}
                            </span>
                            
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTimestamp(activity.timestamp)}
                            </span>

                            {activity.ipAddress && (
                              <span>IP: {activity.ipAddress}</span>
                            )}
                          </div>

                          {/* Metadata */}
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-2">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Details:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                {Object.entries(activity.metadata).map(([key, value]) => (
                                  <div key={key} className="flex">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                    <span className="ml-2">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Badge */}
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                            {activity.action.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredActivities.length >= 50 && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                // In a real app, this would load more activities
                console.log('Load more activities');
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;