import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Search, Filter, Calendar, Package, User, MapPin } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getHistory();
      const historyData = response.data.data;
      
      // Combine completed donations and fulfilled requests into a single array
      const combinedHistory = [];
      
      // Add completed donations
      if (historyData.completedDonations) {
        historyData.completedDonations.forEach(donation => {
          combinedHistory.push({
            ...donation,
            type: 'donation',
            donorName: donation.donorId?.name || 'Unknown',
            receiverName: donation.requestId?.requestorId?.name || 'Unknown',
            receiverAddress: donation.requestId?.requestorId?.address || 'No address',
            items: donation.items || {}
          });
        });
      }
      
      // Add fulfilled requests
      if (historyData.fulfilledRequests) {
        historyData.fulfilledRequests.forEach(request => {
          combinedHistory.push({
            ...request,
            type: 'request',
            donorName: null,
            receiverName: request.requestorId?.name || 'Unknown',
            receiverAddress: request.requestorId?.address || 'No address',
            items: request.items || {}
          });
        });
      }
      
      // Sort by creation date (newest first)
      combinedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setHistory(combinedHistory);
      setError(null);
    } catch (err) {
      setError('Failed to load history');
      console.error('History error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'matched':
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending_pickup':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatItems = (items) => {
    if (!items || typeof items !== 'object') {
      return 'No items';
    }
    
    const itemList = [];
    Object.entries(items).forEach(([category, categoryItems]) => {
      if (categoryItems && typeof categoryItems === 'object') {
        Object.entries(categoryItems).forEach(([item, details]) => {
          if (details && details.count > 0) {
            itemList.push(`${details.count} ${item}`);
          }
        });
      }
    });
    return itemList.length > 0 ? itemList.join(', ') : 'No items';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete history of donations and requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="donation">Donations</option>
            <option value="request">Requests</option>
          </select>
          
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="matched">Matched</option>
            <option value="approved">Approved</option>
            <option value="pending_pickup">Pending Pickup</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredHistory.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No history found matching your criteria
            </li>
          ) : (
            filteredHistory.map((item) => (
              <li key={item._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{item.receiverName}</span>
                        {item.donorName && (
                          <>
                            <span className="mx-2 text-gray-400">←</span>
                            <span>{item.donorName}</span>
                          </>
                        )}
                      </div>
                      
                      {item.receiverAddress && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{item.receiverAddress}</span>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Items:</span> {formatItems(item.items)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    {item.updatedAt && item.updatedAt !== item.createdAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        Updated: {formatDate(item.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredHistory.length} of {history.length} records
      </div>
    </div>
  );
};

export default History;
