import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Request } from '../lib/supabase';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Save,
} from 'lucide-react';

const statuses = [
  'D1 Received',
  'D1 Triage',
  'D2 Design',
  'D3 Delivery',
  'D4 Transfer',
  'Completed',
  'Redirected',
];

const priorities = ['Low', 'Medium', 'High', 'Urgent'];

const triageDecisions = [
  'Proceed to D2',
  'Needs investigation',
  'Recommend alternative',
  'Reject',
];

const pipeline = [
  { stage: 'D1 Received', label: 'Received' },
  { stage: 'D1 Triage', label: 'Triage' },
  { stage: 'D2 Design', label: 'Design' },
  { stage: 'D3 Delivery', label: 'Delivery' },
  { stage: 'D4 Transfer', label: 'Transfer' },
  { stage: 'Completed', label: 'Completed' },
];

export default function RequestDetail() {
  const { profile } = useAuth();

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState('');

  const [managementData, setManagementData] = useState({
    status: '',
    assigned_to: '',
    triage_decision: '',
    priority: '',
    triage_notes: '',
  });

  const requestId = window.location.pathname.split('/').pop();

  // ✅ FIXED FUNCTION
  const loadRequest = async () => {
    if (!requestId) return;

    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) throw error;

      setRequest(data);

      setManagementData({
        status: data.status,
        assigned_to: data.assigned_to || '',
        triage_decision: data.triage_decision || '',
        priority: data.priority || '',
        triage_notes: data.triage_notes || '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const handleSave = async () => {
    if (!requestId) return;

    setErrorMsg('');
    setSuccess('');
    setSaving(true);

    try {
      const { error } = await supabase
        .from('requests')
        .update(managementData)
        .eq('id', requestId);

      if (error) throw error;

      setSuccess('Changes saved successfully');
      await loadRequest();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const getCurrentStageIndex = () =>
    pipeline.findIndex((p) => p.stage === request?.status);

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      'D1 Received': <Clock className="w-5 h-5" />,
      'D1 Triage': <AlertCircle className="w-5 h-5" />,
      'D2 Design': <TrendingUp className="w-5 h-5" />,
      'D3 Delivery': <TrendingUp className="w-5 h-5" />,
      'D4 Transfer': <TrendingUp className="w-5 h-5" />,
      Completed: <CheckCircle className="w-5 h-5" />,
    };
    return icons[status] || <Clock className="w-5 h-5" />;
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-navy/60">Loading...</div>
        </div>
    );
  }

  if (!request) {
    return (
        <div className="text-center py-12">
          <p className="text-navy/60">Request not found</p>
        </div>
    );
  }

  const currentStageIndex = getCurrentStageIndex();

  return (
      <div className="max-w-5xl mx-auto space-y-6">

        <a href="/" className="inline-flex items-center gap-2 text-navy/60 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </a>

        <h1 className="text-3xl font-serif text-navy">
          Request Details
        </h1>

        {/* Status */}
        <div className="bg-navy text-white p-6 rounded-lg flex items-center gap-4">
          {getStatusIcon(request.status)}
          <div>
            <p className="text-lg">{request.status}</p>
            <p className="text-sm opacity-80">
              Current stage of the request
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white p-6 rounded-lg border">
          <p><strong>Requestor:</strong> {request.requestor_name}</p>
          <p><strong>Division:</strong> {request.division}</p>
          <p><strong>Urgency:</strong> {request.urgency}</p>
          <p><strong>Problem:</strong> {request.business_problem}</p>
        </div>

        {/* Admin Panel */}
        {profile?.role === 'admin' && (
          <div className="bg-white p-6 rounded-lg border">
            {errorMsg && <p className="text-red-600">{errorMsg}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gold px-4 py-2 rounded"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
  );
}