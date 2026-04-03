import { useEffect, useState } from 'react';
import { supabase, Request } from '../lib/supabase';
import Layout from '../components/Layout';
import { Clock, AlertCircle, ExternalLink } from 'lucide-react';

export default function PendingReview() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'D1 Received')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
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
      <Layout currentPage="/pending">
        <div className="flex items-center justify-center h-64">
          <div className="text-navy/60">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="/pending">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Pending Review</h1>
          <p className="text-navy/60">
            Requests awaiting initial triage and assessment
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <p className="text-2xl font-serif text-navy">{requests.length}</p>
                <p className="text-sm text-navy/60">Requests awaiting review</p>
              </div>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-navy/20 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-navy mb-2">All caught up!</h3>
              <p className="text-navy/60">
                There are no requests pending review at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-navy/10 rounded-lg p-6 hover:border-gold transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-navy/60">
                        {request.request_id}
                      </span>
                      {getUrgencyBadge(request.urgency)}
                    </div>
                    <a
                      href={`/request/${request.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/90 text-navy text-sm font-medium rounded-lg transition-colors"
                    >
                      Triage
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Requestor
                      </label>
                      <p className="text-navy font-medium">{request.requestor_name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Division
                      </label>
                      <p className="text-navy font-medium">{request.division}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Contact
                      </label>
                      <p className="text-navy">{request.contact}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Urgency
                      </label>
                      <p className="text-navy">{request.urgency}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Target Audience
                      </label>
                      <p className="text-navy">{request.audience}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Submitted
                      </label>
                      <p className="text-navy">
                        {new Date(request.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Business Problem / Learning Need
                      </label>
                      <p className="text-navy">{request.business_problem}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-navy/60 block mb-1">
                        Manager Commitment
                      </label>
                      <p className="text-navy">
                        {request.manager_commitment ? (
                          <span className="inline-flex items-center gap-1 text-green-700">
                            <AlertCircle className="w-4 h-4" />
                            Confirmed
                          </span>
                        ) : (
                          'Not confirmed'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
