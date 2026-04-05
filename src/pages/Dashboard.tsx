import { useEffect, useState } from 'react';
import { supabase, Request } from '../lib/supabase';
import Layout from '../components/Layout';
import { FileText, Clock, TrendingUp, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function Dashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
const { data, error } = await supabase
  .from('requests')
  .select('*');

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Requests',
      value: requests.length,
      icon: FileText,
      color: 'bg-navy',
    },
    {
      label: 'Awaiting Review',
      value: requests.filter((r) => r.status === 'D1 Received').length,
      icon: Clock,
      color: 'bg-gold',
    },
    {
      label: 'In Progress',
      value: requests.filter((r) =>
        ['D1 Triage', 'D2 Design', 'D3 Delivery', 'D4 Transfer'].includes(r.status)
      ).length,
      icon: TrendingUp,
      color: 'bg-navy-mid',
    },
    {
      label: 'Completed',
      value: requests.filter((r) => r.status === 'Completed').length,
      icon: CheckCircle,
      color: 'bg-green-700',
    },
  ];

  const pendingRequests = requests.filter((r) => r.status === 'D1 Received');
  const activeRequests = requests.filter((r) => r.status !== 'Completed');
  const completedCount = requests.filter((r) => r.status === 'Completed').length;
  const completionRate =
    requests.length > 0 ? Math.round((completedCount / requests.length) * 100) : 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'D1 Received': 'bg-amber-100 text-amber-800 border-amber-200',
      'D1 Triage': 'bg-purple-100 text-purple-800 border-purple-200',
      'D2 Design': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'D3 Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
      'D4 Transfer': 'bg-violet-100 text-violet-800 border-violet-200',
      Completed: 'bg-green-100 text-green-800 border-green-200',
      Redirected: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

const getUrgencyBadge = (urgency?: string) => {
  if (!urgency) return null;

  if (urgency.toLowerCase().includes('2 weeks')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
        <AlertCircle className="w-3 h-3" />
        Urgent
      </span>
    );
  }
  return null;
};

  if (loading) {
    return (
      <Layout currentPage="/">
        <div className="flex items-center justify-center h-64">
          <div className="text-navy/60">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="/">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-navy mb-2">Dashboard</h1>
            <p className="text-navy/60">Overview of all L&D requests</p>
          </div>
          <a
            href="/new-request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Submit New Request
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-navy/60 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif text-navy">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif text-navy">Pending Review</h2>
              <a
                href="/pending"
                className="text-gold hover:text-gold/80 text-sm font-medium"
              >
                View all →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.slice(0, 4).map((request) => (
                <a
                  key={request.id}
                  href={`/request/${request.id}`}
                  className="p-4 border border-navy/10 rounded-lg hover:border-gold transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-navy/60">
                      {request.request_id}
                    </span>
                    {getUrgencyBadge(request.urgency)}
                  </div>
                  <p className="text-navy font-medium mb-2 line-clamp-2">
                    {request.business_problem}
                  </p>
                  <div className="flex items-center justify-between text-sm text-navy/60">
                    <span>{request.requestor_name}</span>
                    <span>{request.division}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-navy">Active Pipeline</h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#F7F5F0"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#C9A227"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${completionRate * 2.26} 226`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-serif text-navy">{completionRate}%</span>
                  </div>
                </div>
                <p className="text-xs text-navy/60 mt-2">Completion Rate</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-navy/60">
                    Request ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-navy/60">
                    Problem Summary
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-navy/60">
                    Requestor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-navy/60">
                    Division
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-navy/60">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-navy/60">
                    Urgency
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeRequests.slice(0, 10).map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-navy/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <a
                        href={`/request/${request.id}`}
                        className="text-sm font-mono text-navy hover:text-gold"
                      >
                        {request.request_id}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-navy line-clamp-1">
                        {request.business_problem}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-navy/80">
                      {request.requestor_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-navy/80">{request.division}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getUrgencyBadge(request.urgency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
