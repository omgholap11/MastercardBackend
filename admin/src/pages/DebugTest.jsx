import { useState } from 'react';
import { adminAPI } from '../services/api';

const DebugTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpointName, apiCall) => {
    setLoading(true);
    try {
      const response = await apiCall();
      setTestResult({
        endpoint: endpointName,
        success: true,
        data: response.data,
        status: response.status
      });
    } catch (error) {
      setTestResult({
        endpoint: endpointName,
        success: false,
        error: {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          code: error.code
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Debug Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={() => testEndpoint('Dashboard Stats', adminAPI.getDashboardStats)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          disabled={loading}
        >
          Test Dashboard
        </button>
        
        <button
          onClick={() => testEndpoint('History', adminAPI.getHistory)}
          className="bg-green-500 text-white px-4 py-2 rounded mr-4"
          disabled={loading}
        >
          Test History
        </button>
        
        <button
          onClick={() => testEndpoint('Matched Donations', adminAPI.getMatchedDonations)}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-4"
          disabled={loading}
        >
          Test Matched Donations
        </button>
        
        <button
          onClick={() => testEndpoint('Requests', adminAPI.getAllRequests)}
          className="bg-orange-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Test Requests
        </button>
      </div>

      {loading && (
        <div className="text-blue-600">Testing...</div>
      )}

      {testResult && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold text-lg mb-2">
            {testResult.endpoint} - {testResult.success ? 'SUCCESS' : 'ERROR'}
          </h3>
          
          {testResult.success ? (
            <div>
              <p className="text-green-600">Status: {testResult.status}</p>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-96">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p className="text-red-600">Error: {testResult.error.message}</p>
              {testResult.error.status && (
                <p className="text-red-600">Status: {testResult.error.status}</p>
              )}
              {testResult.error.code && (
                <p className="text-red-600">Code: {testResult.error.code}</p>
              )}
              {testResult.error.response && (
                <pre className="bg-red-50 p-4 rounded mt-2 overflow-auto max-h-96 text-red-800">
                  {JSON.stringify(testResult.error.response, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugTest;
