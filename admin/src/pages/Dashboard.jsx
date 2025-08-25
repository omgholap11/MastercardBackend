import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  Users, 
  Gift, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
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
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
        {trend && (
          <div className="mt-2">
            <span className="text-sm text-gray-600">Last 7 days: {trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const StatusBreakdown = ({ title, data, type }) => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => {
          let color = 'gray';
          let icon = Clock;
          
          if (type === 'donation') {
            switch (item._id) {
              case 'delivered': color = 'green'; icon = CheckCircle; break;
              case 'matched': color = 'blue'; icon = CheckCircle; break;
              case 'pending_pickup': color = 'yellow'; icon = Clock; break;
              case 'cancelled': color = 'red'; icon = XCircle; break;
            }
          } else {
            switch (item._id) {
              case 'fulfilled': color = 'green'; icon = CheckCircle; break;
              case 'approved': color = 'blue'; icon = CheckCircle; break;
              case 'pending': color = 'yellow'; icon = Clock; break;
              case 'rejected': color = 'red'; icon = XCircle; break;
            }
          }
          
          const IconComponent = icon;
          
          return (
            <div key={item._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <IconComponent className={`h-4 w-4 text-${color}-500 mr-2`} />
                <span className="text-sm text-gray-700 capitalize">
                  {item._id.replace('_', ' ')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of donation management system
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Donations"
          value={stats?.totals?.donations || 0}
          icon={Gift}
          color="blue"
          trend={stats?.recentActivity?.donationsLast7Days || 0}
        />
        <StatCard
          title="Total Requests"
          value={stats?.totals?.requests || 0}
          icon={FileText}
          color="green"
          trend={stats?.recentActivity?.requestsLast7Days || 0}
        />
        <StatCard
          title="Active Requests"
          value={stats?.requestStatusBreakdown?.filter(s => s._id !== 'fulfilled').reduce((sum, s) => sum + s.count, 0) || 0}
          icon={TrendingUp}
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={stats?.requestStatusBreakdown?.find(s => s._id === 'fulfilled')?.count || 0}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusBreakdown
          title="Donation Status Breakdown"
          data={stats?.donationStatusBreakdown || []}
          type="donation"
        />
        <StatusBreakdown
          title="Request Status Breakdown"
          data={stats?.requestStatusBreakdown || []}
          type="request"
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity (Last 7 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats?.recentActivity?.donationsLast7Days || 0}
              </div>
              <div className="text-sm text-gray-600">New Donations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats?.recentActivity?.requestsLast7Days || 0}
              </div>
              <div className="text-sm text-gray-600">New Requests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
