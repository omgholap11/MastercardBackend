import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
