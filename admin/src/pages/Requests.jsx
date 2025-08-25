import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  Filter,
  Search,
  Check,
  X,
  Eye,
  Clock
} from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRequests();
      setRequests(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.receiver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.receiver?.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
    const itemList = [];
    Object.entries(items).forEach(([category, categoryItems]) => {
      Object.entries(categoryItems).forEach(([item, details]) => {
        if (details.count > 0) {
          itemList.push(`${details.count} ${item}`);
        }
      });
    });
    return itemList.join(', ');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'fulfilled':
        return <Check className="h-4 w-4" />;
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const RequestModal = ({ request, onClose }) => {
    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Request Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Receiver Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{request.receiver?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{request.receiver?.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                <div className="text-sm">
                  <p><span className="font-medium">Purpose:</span> {request.purpose}</p>
                  {request.description && (
                    <p className="mt-1"><span className="font-medium">Description:</span> {request.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Requested Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(request.items).map(([category, categoryItems]) => (
                  <div key={category} className="border rounded-lg p-3">
                    <h5 className="font-medium text-gray-800 capitalize mb-2">{category}</h5>
                    <div className="space-y-1">
                      {Object.entries(categoryItems).map(([item, details]) => (
                        details.count > 0 && (
                          <div key={item} className="flex justify-between text-sm">
                            <span className="capitalize">{item}</span>
                            <span className="text-gray-600">{details.count}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all donation requests
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['pending', 'approved', 'fulfilled', 'rejected'].map(status => {
          const count = requests.filter(r => r.status === status).length;
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
                        {status}
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

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by receiver name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRequests.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No requests found matching your criteria
            </li>
          ) : (
            filteredRequests.map((request) => (
              <li key={request._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-900 mb-1">
                            <User className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium">{request.receiver?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{request.receiver?.address || 'No address'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Purpose:</span> {request.purpose}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Items:</span> {formatItems(request.items)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredRequests.length} of {requests.length} requests
      </div>

      {/* Request Modal */}
      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default Requests;
