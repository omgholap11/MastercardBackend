import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Check, 
  X, 
  Clock,
  Truck,
  AlertCircle
} from 'lucide-react';

const MatchedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchMatchedDonations();
  }, []);

  const fetchMatchedDonations = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMatchedDonations();
      const data = response.data.data;
      
      // Ensure we have an array - handle different response structures
      let donationsArray = [];
      if (Array.isArray(data)) {
        donationsArray = data;
      } else if (data && Array.isArray(data.donations)) {
        donationsArray = data.donations;
      } else if (data && Array.isArray(data.matchedDonations)) {
        donationsArray = data.matchedDonations;
      }
      
      setDonations(donationsArray);
      setError(null);
    } catch (err) {
      setError('Failed to load matched donations');
      console.error('Matched donations error:', err);
      setDonations([]); // Ensure it's always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId, newStatus) => {
    try {
      setUpdatingStatus(donationId);
      await adminAPI.updateDonationStatus(donationId, newStatus);
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        donation._id === donationId 
          ? { ...donation, status: newStatus }
          : donation
      ));
      
      // If status is delivered, remove from list after a short delay
      if (newStatus === 'delivered') {
        setTimeout(() => {
          setDonations(prev => prev.filter(donation => donation._id !== donationId));
        }, 1000);
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update donation status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'matched':
        return 'bg-blue-100 text-blue-800';
      case 'pending_pickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'matched':
        return 'pending_pickup';
      case 'pending_pickup':
        return 'in_transit';
      case 'in_transit':
        return 'delivered';
      default:
        return null;
    }
  };

  const getStatusAction = (status) => {
    switch (status) {
      case 'matched':
        return 'Mark as Pending Pickup';
      case 'pending_pickup':
        return 'Mark as In Transit';
      case 'in_transit':
        return 'Mark as Delivered';
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'matched':
        return <Check className="h-4 w-4" />;
      case 'pending_pickup':
        return <Clock className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Check className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Matched Donations</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and track matched donations through delivery
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['matched', 'pending_pickup', 'in_transit', 'delivered'].map(status => {
          const count = Array.isArray(donations) ? donations.filter(d => d.status === status).length : 0;
          return (
            <div key={status} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(status)}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                        {status.replace('_', ' ')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{count}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donations List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {!Array.isArray(donations) || donations.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No matched donations found
            </li>
          ) : (
            donations.map((donation) => (
              <li key={donation._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusIcon(donation.status)}
                          <span className="ml-1 capitalize">{donation.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-900 mb-1">
                            <User className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium">Donor:</span>
                            <span className="ml-1">{donation.donor?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-900 mb-1">
                            <User className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium">Receiver:</span>
                            <span className="ml-1">{donation.receiver?.name || 'Unknown'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{donation.receiver?.address || 'No address'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{formatDate(donation.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Items:</span> {formatItems(donation.items)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {getNextStatus(donation.status) && (
                      <button
                        onClick={() => updateDonationStatus(donation._id, getNextStatus(donation.status))}
                        disabled={updatingStatus === donation._id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === donation._id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        ) : (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        {getStatusAction(donation.status)}
                      </button>
                    )}
                    
                    {donation.status !== 'cancelled' && donation.status !== 'delivered' && (
                      <button
                        onClick={() => updateDonationStatus(donation._id, 'cancelled')}
                        disabled={updatingStatus === donation._id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </button>
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
        Total {Array.isArray(donations) ? donations.length : 0} matched donations
      </div>
    </div>
  );
};

export default MatchedDonations;
