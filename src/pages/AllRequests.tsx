import { useEffect, useState } from 'react';
import { supabase, Request } from '../lib/supabase';
import Layout from '../components/Layout';
import { Filter, AlertCircle } from 'lucide-react';

const statuses = [
  'D1 Received',
  'D1 Triage',
  'D2 Design',
  'D3 Delivery',
  'D4 Transfer',
  'Completed',
  'Redirected',
];

export default function AllRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  // ✅ FIXED FUNCTION
  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*') // ✅ FIXED (important)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data ?? []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = selectedStatus
    ? requests.filter((r) => r.status === selectedStatus)
    : requests;

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

  // ✅ SAFER VERSION
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
      <Layout currentPage="/requests">
        <div className="flex items-center justify-center h-64">
          <div className="text-navy/60">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="/requests">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">All Requests</h1>
          <p className="text-navy/60">
            Complete view of all L&D requests across the organization
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-navy/60" />
            <span className="text-sm text-navy/60">Filter by status:</span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedStatus === null
                    ? 'bg-navy text-white'
                    : 'bg-cream text-navy hover:bg-navy/10'
                }`}
              >
                All ({requests.length})
              </button>

              {statuses.map((status) => {
                const count = requests.filter((r) => r.status === status).length;

                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedStatus === status
                        ? 'bg-navy text-white'
                        : 'bg-cream text-navy hover:bg-navy/10'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-navy/60">
                No requests found with the selected filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy/10">
                    <th className="text-left py-3 px-4 text-sm text-navy/60">
                      Request ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-navy/60">
                      Problem Summary
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-navy/60">
                      Requestor
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-navy/60">
                      Division
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-navy/60">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-navy/60">
                      Urgency
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-navy/5 hover:bg-cream/50 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/request/${request.id}`)
                      }
                    >
                      <td className="py-3 px-4 text-sm font-mono text-navy">
                        {request.request_id}
                      </td>

                      <td className="py-3 px-4 text-sm text-navy">
                        {request.business_problem}
                      </td>

                      <td className="py-3 px-4 text-sm text-navy/80">
                        {request.requestor_name}
                      </td>

                      <td className="py-3 px-4 text-sm text-navy/80">
                        {request.division}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {getUrgencyBadge(request.urgency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}