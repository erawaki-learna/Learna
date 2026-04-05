import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Request } from '../lib/supabase';
import Layout from '../components/Layout';
import { FileText, TrendingUp, CheckCircle, Plus } from 'lucide-react';

export default function MyRequests() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadRequests();
    }
  }, [profile]);

  const loadRequests = async () => {
    try {
const { data, error } = await supabase
  .from('requests')
  .select('*')
  .eq('user_id', profile?.id);

      if (error) throw error;
      setRequests(data ?? []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeRequests = requests.filter((r) => r.status !== 'Completed');
  const completedRequests = requests.filter((r) => r.status === 'Completed');
  const inProgressRequests = requests.filter((r) =>
    ['D1 Triage', 'D2 Design', 'D3 Delivery', 'D4 Transfer'].includes(r.status)
  );

  const stats = [
    {
      label: 'Total Requests',
      value: requests.length,
      icon: FileText,
      color: 'bg-navy',
    },
    {
      label: 'In Progress',
      value: inProgressRequests.length,
      icon: TrendingUp,
      color: 'bg-gold',
    },
    {
      label: 'Completed',
      value: completedRequests.length,
      icon: CheckCircle,
      color: 'bg-green-700',
    },
  ];

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

  const getProgressPercentage = (status: string) => {
    const stages: Record<string, number> = {
      'D1 Received': 10,
      'D1 Triage': 25,
      'D2 Design': 50,
      'D3 Delivery': 75,
      'D4 Transfer': 90,
      Completed: 100,
    };
    return stages[status] || 0;
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      'D1 Received': 'Your request has been received and is awaiting initial review.',
      'D1 Triage': 'Your request is being triaged by our L&D team.',
      'D2 Design': 'Learning solution is being designed for your needs.',
      'D3 Delivery': 'Your learning programme is currently being delivered.',
      'D4 Transfer': 'Knowledge transfer and evaluation in progress.',
      Completed: 'Your learning programme has been completed successfully.',
    };
    return messages[status] || 'Processing your request.';
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
            <h1 className="text-3xl font-serif text-navy mb-2">My Requests</h1>
            <p className="text-navy/60">Track your L&D requests and their progress</p>
          </div>
          <a
            href="/new-request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Request
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg p-6 shadow-sm border border-navy/10"
              >
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

        {activeRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">Active Requests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeRequests.map((request) => (
                <a
                  key={request.id}
                  href={`/request/${request.id}`}
                  className="bg-white rounded-lg p-6 shadow-sm border border-navy/10 hover:border-gold transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-navy/60">
                      {request.request_id}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <p className="text-navy font-medium mb-3 line-clamp-2">
                    {request.business_problem}
                  </p>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-navy/60 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(request.status)}%</span>
                    </div>
                    <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold transition-all duration-500"
                        style={{ width: `${getProgressPercentage(request.status)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-navy/70 bg-cream/50 rounded-lg p-3">
                    {getStatusMessage(request.status)}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-navy/60">
                    <span>Audience: {request.audience}</span>
                    <span>{request.urgency}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {completedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">Completed Requests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedRequests.map((request) => (
                <a
                  key={request.id}
                  href={`/request/${request.id}`}
                  className="bg-white rounded-lg p-6 shadow-sm border border-navy/10 hover:border-gold transition-all opacity-75 hover:opacity-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-navy/60">
                      {request.request_id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  </div>

                  <p className="text-navy font-medium mb-3 line-clamp-2">
                    {request.business_problem}
                  </p>

                  <div className="text-xs text-navy/60">
                    Completed on{' '}
                    {new Date(request.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-navy/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-navy mb-2">No requests yet</h3>
            <p className="text-navy/60 mb-6">
              You haven't submitted any L&D requests yet. Get started by creating your first
              request.
            </p>
            <a
              href="/new-request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Request
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
