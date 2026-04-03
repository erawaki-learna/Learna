import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import { FileText, Sparkles, CheckCircle } from 'lucide-react';
import AIAdvisor from './AIAdvisor';

const divisions = [
  'ATC',
  'Bancassurance Retail',
  'Bancassurance Corporate',
  'Head Office Operations',
  'Claims',
  'Underwriting',
  'IT',
  'Finance',
  'HR & Admin',
  'Marketing',
  'Other',
];

const urgencyOptions = [
  'Within 2 weeks urgent',
  'Within 1 month',
  'Within 3 months',
  'Flexible',
];

export default function NewRequest() {
  const { profile } = useAuth();
  const [mode, setMode] = useState<'choose' | 'form' | 'ai'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    requestor_name: profile?.full_name || '',
    division: profile?.division || '',
    contact: '',
    business_problem: '',
    audience: '',
    urgency: 'Within 1 month',
    manager_commitment: false,
  });

  const generateRequestId = async (division: string) => {
    const divPrefix = division.slice(0, 4).toUpperCase().replace(/\s/g, '');
    const year = '2026';

    const { count, error } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .ilike('request_id', `QR-${divPrefix}-${year}-%`);

    if (error) {
      console.error('Error counting requests:', error);
      return `QR-${divPrefix}-${year}-001`;
    }

    const nextNum = ((count || 0) + 1).toString().padStart(3, '0');
    return `QR-${divPrefix}-${year}-${nextNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!profile) throw new Error('Profile not found');

      const requestId = await generateRequestId(formData.division);

      const { error: insertError } = await supabase.from('requests').insert({
        user_id: profile.id,
        request_id: requestId,
        requestor_name: formData.requestor_name,
        division: formData.division,
        contact: formData.contact,
        business_problem: formData.business_problem,
        audience: formData.audience,
        urgency: formData.urgency,
        manager_commitment: formData.manager_commitment,
        status: 'D1 Received',
        priority: 'Medium',
      });

      if (insertError) throw insertError;

      window.location.href = '/';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // AI ADVISOR MODE
  if (mode === 'ai') {
    return (
      <Layout currentPage="/new-request">
        <AIAdvisor onBack={() => setMode('choose')} />
      </Layout>
    );
  }

  // CHOOSE MODE
  if (mode === 'choose') {
    return (
      <Layout currentPage="/new-request">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-navy mb-2">Submit New Request</h1>
            <p className="text-navy/60">Choose how you'd like to submit your L&D request</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('form')}
              className="bg-white rounded-lg p-8 shadow-sm border border-navy/10 hover:border-gold transition-all hover:shadow-md text-left group"
            >
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-xl font-serif text-navy mb-2">Quick Form</h2>
              <p className="text-navy/60 mb-4">
                Fill out a simple form with your learning need and we'll take care of the rest.
              </p>
              <span className="inline-flex items-center text-gold font-medium group-hover:gap-2 transition-all">
                Get Started
                <span className="ml-2 group-hover:ml-0">→</span>
              </span>
            </button>

            <button
              onClick={() => setMode('ai')}
              className="bg-white rounded-lg p-8 shadow-sm border-2 border-gold hover:shadow-lg transition-all text-left group relative"
            >
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full">
                  <Sparkles className="w-3 h-3" />
                  AI POWERED
                </span>
              </div>
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-xl font-serif text-navy mb-2">AI Learning Advisor</h2>
              <p className="text-navy/60 mb-4">
                Have a conversation with our AI advisor. Speak or type — it guides you through a structured needs analysis.
              </p>
              <span className="inline-flex items-center text-gold font-medium group-hover:gap-2 transition-all">
                Start AI Consultation
                <span className="ml-2 group-hover:ml-0">→</span>
              </span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // QUICK FORM MODE
  return (
    <Layout currentPage="/new-request">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setMode('choose')}
            className="text-navy/60 hover:text-navy mb-4 text-sm"
          >
            ← Back to options
          </button>
          <h1 className="text-3xl font-serif text-navy mb-2">Quick Form</h1>
          <p className="text-navy/60">Submit your L&D request in just a few steps</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm border border-navy/10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="requestor_name"
              value={formData.requestor_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            >
              <option value="">Select division</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Contact Number or Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Business problem or learning need <span className="text-red-500">*</span>
            </label>
            <textarea
              name="business_problem"
              value={formData.business_problem}
              onChange={handleChange}
              rows={5}
              minLength={20}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            />
            <p className="text-xs text-navy/60 mt-1">
              {formData.business_problem.length} characters (minimum 20)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Who needs this and how many <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              placeholder="e.g., Sales team, 25 people"
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Urgency <span className="text-red-500">*</span>
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            >
              {urgencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-cream/50 border border-gold/20 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="manager_commitment"
                checked={formData.manager_commitment}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-gold focus:ring-gold border-navy/20 rounded"
                required
                disabled={loading}
              />
              <div>
                <p className="text-sm text-navy font-medium flex items-center gap-2">
                  Manager Commitment <span className="text-red-500">*</span>
                </p>
                <p className="text-sm text-navy/70 mt-1">
                  I commit to supporting my team before, during, and after this learning programme.
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setMode('choose')}
              className="flex-1 px-6 py-3 border border-navy/20 text-navy rounded-lg hover:bg-cream transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.manager_commitment}
              className="flex-1 px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
