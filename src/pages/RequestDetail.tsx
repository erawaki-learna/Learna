import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Request } from '../lib/supabase';
import Layout from '../components/Layout';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [managementData, setManagementData] = useState({
    status: '',
    assigned_to: '',
    triage_decision: '',
    priority: '',
    triage_notes: '',
  });

  const requestId = window.location.pathname.split('/').pop();

  useEffect(() => {
    if (requestId) {
      loadRequest();
    }
  }, [requestId]);

  const loadRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Request not found');

      setRequest(data);
      setManagementData({
        status: data.status,
        assigned_to: data.assigned_to || '',
        triage_decision: data.triage_decision || '',
        priority: data.priority,
        triage_notes: data.triage_notes || '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('requests')
        .update(managementData)
        .eq('id', requestId);

      if (updateError) throw updateError;

      setSuccess('Changes saved successfully');
      await loadRequest();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const getCurrentStageIndex = () => {
    return pipeline.findIndex((p) => p.stage === request?.status);
  };

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

  const getNextStepsMessage = (status: string) => {
    const messages: Record<string, { title: string; description: string }> = {
      'D1 Received': {
        title: 'What happens next?',
        description:
          "Our L&D team will review your request within 2-3 business days. We'll assess the learning need, identify the target audience, and determine the best approach to address your business problem.",
      },
      'D1 Triage': {
        title: 'Triage in Progress',
        description:
          "We're currently analyzing your request to determine the most effective learning solution. You'll be notified once we've completed our assessment and are ready to proceed to the design phase.",
      },
      'D2 Design': {
        title: 'Solution Design',
        description:
          "We're designing a customized learning solution tailored to your needs. This includes developing content, selecting delivery methods, and creating materials that will effectively address your business challenge.",
      },
      'D3 Delivery': {
        title: 'Programme Delivery',
        description:
          "Your learning programme is now being delivered to the target audience. We're actively facilitating sessions, monitoring engagement, and ensuring the content resonates with participants.",
      },
      'D4 Transfer': {
        title: 'Knowledge Transfer & Evaluation',
        description:
          "We're working on ensuring knowledge transfer and conducting post-programme evaluation. This includes gathering feedback, measuring impact, and documenting lessons learned for continuous improvement.",
      },
      Completed: {
        title: 'Programme Completed',
        description:
          "Your learning programme has been successfully completed. All materials, feedback, and evaluation results have been documented. Thank you for partnering with us to develop your team's capabilities.",
      },
    };
    return (
      messages[status] || {
        title: 'Processing',
        description: 'Your request is being processed.',
      }
    );
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

  if (!request) {
    return (
      <Layout currentPage="/">
        <div className="text-center py-12">
          <p className="text-navy/60">Request not found</p>
          <a href="/" className="text-gold hover:text-gold/80 mt-4 inline-block">
            Go back
          </a>
        </div>
      </Layout>
    );
  }

  const currentStageIndex = getCurrentStageIndex();
  const nextSteps = getNextStepsMessage(request.status);

  return (
    <Layout currentPage="/">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <a
            href={profile?.role === 'admin' ? '/' : '/'}
            className="inline-flex items-center gap-2 text-navy/60 hover:text-navy mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </a>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif text-navy mb-2">Request Details</h1>
              <p className="text-sm font-mono text-navy/60">{request.request_id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10 overflow-x-auto">
          <h2 className="text-lg font-serif text-navy mb-6">Progress Timeline</h2>
          <div className="flex items-center justify-between min-w-max">
            {pipeline.map((step, index) => {
              const isPast = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isFuture = index > currentStageIndex;

              return (
                <div key={step.stage} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'bg-gold border-gold text-navy'
                          : isPast
                          ? 'bg-navy border-navy text-white'
                          : 'bg-white border-navy/20 text-navy/40'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 font-medium ${
                        isCurrent || isPast ? 'text-navy' : 'text-navy/40'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < pipeline.length - 1 && (
                    <div
                      className={`h-0.5 w-16 mx-2 ${
                        isPast ? 'bg-navy' : 'bg-navy/20'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-navy rounded-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              {getStatusIcon(request.status)}
            </div>
            <div>
              <h3 className="text-lg font-serif mb-1">{request.status}</h3>
              <p className="text-cream/80 text-sm">
                {
                  [
                    'Your request has been received and is awaiting review.',
                    'Request is being triaged by our L&D team.',
                    'Learning solution is being designed.',
                    'Programme is being delivered to participants.',
                    'Knowledge transfer and evaluation in progress.',
                    'Programme completed successfully.',
                  ][currentStageIndex] || 'Processing your request.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cream/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-lg font-serif text-navy mb-2">{nextSteps.title}</h3>
          <p className="text-navy/70">{nextSteps.description}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
          <h2 className="text-lg font-serif text-navy mb-4">Request Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Requestor
              </label>
              <p className="text-navy">{request.requestor_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Division
              </label>
              <p className="text-navy">{request.division}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Contact
              </label>
              <p className="text-navy">{request.contact}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Urgency
              </label>
              <p className="text-navy">{request.urgency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Target Audience
              </label>
              <p className="text-navy">{request.audience}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Priority
              </label>
              <p className="text-navy">{request.priority}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Business Problem / Learning Need
              </label>
              <p className="text-navy">{request.business_problem}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-navy/60 block mb-1">
                Manager Commitment
              </label>
              <p className="text-navy">
                {request.manager_commitment ? 'Confirmed' : 'Not confirmed'}
              </p>
            </div>
          </div>
        </div>

        {profile?.role === 'admin' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-navy/10">
            <h2 className="text-lg font-serif text-navy mb-4">Management Panel</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Status</label>
                <select
                  value={managementData.status}
                  onChange={(e) =>
                    setManagementData({ ...managementData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={managementData.assigned_to}
                  onChange={(e) =>
                    setManagementData({ ...managementData, assigned_to: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="L&D team member name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Triage Decision
                </label>
                <select
                  value={managementData.triage_decision}
                  onChange={(e) =>
                    setManagementData({
                      ...managementData,
                      triage_decision: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select decision</option>
                  {triageDecisions.map((decision) => (
                    <option key={decision} value={decision}>
                      {decision}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Priority</label>
                <select
                  value={managementData.priority}
                  onChange={(e) =>
                    setManagementData({ ...managementData, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy mb-2">
                  Triage Notes
                </label>
                <textarea
                  value={managementData.triage_notes}
                  onChange={(e) =>
                    setManagementData({ ...managementData, triage_notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Add notes about triage decision and next steps..."
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
