import { useState, useRef } from 'react';
import {
  FileText,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  User,
  Mail,
  Users,
  AlertTriangle,
  MessageSquare,
  Briefcase,
} from 'lucide-react';

type Mode = 'select' | 'quick-form' | 'ai' | 'success';

const DIVISIONS = [
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
];

const URGENCY_OPTIONS = [
  'Within 2 weeks',
  'Within 1 month',
  'Within 3 months',
  'Flexible',
];

const MIN_PROBLEM_CHARS = 20;

interface FormState {
  name: string;
  division: string;
  email: string;
  businessProblem: string;
  audience: string;
  urgency: string;
  managerCommitment: boolean;
}

const INITIAL_FORM: FormState = {
  name: 'Alex Johnson',
  division: '',
  email: 'alex.johnson@learna.com',
  businessProblem: '',
  audience: '',
  urgency: '',
  managerCommitment: false,
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: 'rgba(10,22,40,0.5)' }}>
      {children}
      {required && <span className="ml-0.5" style={{ color: '#C9A227' }}>*</span>}
    </label>
  );
}

function inputClass(error?: boolean) {
  return [
    'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all',
    'focus:ring-2',
    error
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A22720]',
  ].join(' ');
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(error)}
        style={{ color: value ? '#0A1628' : 'rgba(10,22,40,0.35)', appearance: 'none' }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ color: '#0A1628' }}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.35)' }} />
    </div>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: 'rgba(5,150,105,0.1)' }}
      >
        <CheckCircle2 className="w-10 h-10" style={{ color: '#059669' }} />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: '#0A1628' }}>
        Request Submitted!
      </h2>
      <p className="text-sm max-w-sm mb-8" style={{ color: 'rgba(10,22,40,0.5)' }}>
        Your learning request has been received. A Learna consultant will review it and reach out within 2 business days.
      </p>
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border mb-3"
        style={{ borderColor: 'rgba(10,22,40,0.1)', color: 'rgba(10,22,40,0.5)', backgroundColor: 'rgba(10,22,40,0.02)' }}
      >
        <span className="font-mono font-semibold" style={{ color: '#C9A227' }}>REQ-0045</span>
        <span>— Track in My Learning Journey</span>
      </div>
      <button
        onClick={onReset}
        className="text-sm font-medium mt-4 underline underline-offset-2"
        style={{ color: '#C9A227' }}
      >
        Submit another request
      </button>
    </div>
  );
}

function QuickForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.division) e.division = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (form.businessProblem.trim().length < MIN_PROBLEM_CHARS) e.businessProblem = `Minimum ${MIN_PROBLEM_CHARS} characters`;
    if (!form.audience.trim()) e.audience = 'Required';
    if (!form.urgency) e.urgency = 'Required';
    if (!form.managerCommitment) e.managerCommitment = 'Manager commitment is required to proceed';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    onSuccess();
  };

  const charCount = form.businessProblem.length;
  const charOk = charCount >= MIN_PROBLEM_CHARS;

  return (
    <form onSubmit={handleSubmit} noValidate ref={topRef} className="space-y-5 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Requestor Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass(submitted && !!errors.name)}
              style={{ paddingLeft: '2.25rem', color: '#0A1628' }}
              placeholder="Your full name"
            />
          </div>
          {submitted && errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label required>Division</Label>
          <SelectField
            value={form.division}
            onChange={(v) => set('division', v)}
            options={DIVISIONS}
            placeholder="Select your division"
            error={submitted && !!errors.division}
          />
          {submitted && errors.division && <p className="text-xs mt-1 text-red-500">{errors.division}</p>}
        </div>
      </div>

      <div>
        <Label required>Contact Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={inputClass(submitted && !!errors.email)}
            style={{ paddingLeft: '2.25rem', color: '#0A1628' }}
            placeholder="you@company.com"
          />
        </div>
        {submitted && errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
      </div>

      <div>
        <Label required>Business Problem</Label>
        <p className="text-xs mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>
          Describe the performance gap or business challenge this training should solve.
        </p>
        <textarea
          value={form.businessProblem}
          onChange={(e) => set('businessProblem', e.target.value)}
          rows={4}
          className={inputClass(submitted && !!errors.businessProblem)}
          style={{ color: '#0A1628', resize: 'vertical' }}
          placeholder="e.g. Our sales agents are struggling to handle objections at close, leading to an 18% drop in Q1 conversion rates..."
        />
        <div className="flex justify-between items-center mt-1">
          {submitted && errors.businessProblem
            ? <p className="text-xs text-red-500">{errors.businessProblem}</p>
            : <span className="text-xs" style={{ color: 'rgba(10,22,40,0.35)' }}>Minimum {MIN_PROBLEM_CHARS} characters</span>
          }
          <span
            className="text-xs font-medium ml-auto"
            style={{ color: charOk ? '#059669' : charCount > 0 ? '#D97706' : 'rgba(10,22,40,0.3)' }}
          >
            {charCount} chars
          </span>
        </div>
      </div>

      <div>
        <Label required>Who needs this training?</Label>
        <p className="text-xs mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>
          Describe the target audience and approximate headcount.
        </p>
        <div className="relative">
          <Users className="absolute left-3 top-3 w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <textarea
            value={form.audience}
            onChange={(e) => set('audience', e.target.value)}
            rows={2}
            className={inputClass(submitted && !!errors.audience)}
            style={{ color: '#0A1628', paddingLeft: '2.25rem', resize: 'none' }}
            placeholder="e.g. 45 direct sales agents across the Southern and Eastern regions"
          />
        </div>
        {submitted && errors.audience && <p className="text-xs mt-1 text-red-500">{errors.audience}</p>}
      </div>

      <div>
        <Label required>Urgency</Label>
        <div className="relative">
          <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <select
            value={form.urgency}
            onChange={(e) => set('urgency', e.target.value)}
            className={inputClass(submitted && !!errors.urgency)}
            style={{ color: form.urgency ? '#0A1628' : 'rgba(10,22,40,0.35)', paddingLeft: '2.25rem', appearance: 'none' }}
          >
            <option value="" disabled>When is this needed?</option>
            {URGENCY_OPTIONS.map((o) => (
              <option key={o} value={o} style={{ color: '#0A1628' }}>{o}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.35)' }} />
        </div>
        {submitted && errors.urgency && <p className="text-xs mt-1 text-red-500">{errors.urgency}</p>}
      </div>

      <div
        className="rounded-xl border p-4"
        style={{ borderColor: submitted && errors.managerCommitment ? '#FCA5A5' : 'rgba(10,22,40,0.08)', backgroundColor: submitted && errors.managerCommitment ? 'rgba(220,38,38,0.03)' : 'rgba(10,22,40,0.02)' }}
      >
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={form.managerCommitment}
              onChange={(e) => set('managerCommitment', e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
              style={{
                backgroundColor: form.managerCommitment ? '#C9A227' : 'white',
                borderColor: form.managerCommitment ? '#C9A227' : 'rgba(10,22,40,0.2)',
              }}
            >
              {form.managerCommitment && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 10">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#0A1628' }}>Manager Commitment</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
              I confirm that my manager is aware of and supports this learning request, and that learners will be released to attend during business hours if required.
            </p>
          </div>
        </label>
        {submitted && errors.managerCommitment && (
          <p className="text-xs mt-2 ml-8 text-red-500">{errors.managerCommitment}</p>
        )}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
        >
          Submit Request
        </button>
        <p className="text-center text-xs mt-2" style={{ color: 'rgba(10,22,40,0.35)' }}>
          Your request will be reviewed by the Learna team within 2 business days.
        </p>
      </div>
    </form>
  );
}

function ModeCard({
  highlighted,
  badge,
  icon,
  title,
  description,
  ctaText,
  onClick,
}: {
  highlighted?: boolean;
  badge?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl border p-6 bg-white transition-all hover:shadow-md group"
      style={{
        borderColor: highlighted ? '#C9A227' : 'rgba(10,22,40,0.09)',
        boxShadow: highlighted ? '0 0 0 1px #C9A22740' : undefined,
      }}
    >
      {badge && (
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3"
          style={{ backgroundColor: 'rgba(201,162,39,0.12)', color: '#A07D18' }}
        >
          <Sparkles className="w-2.5 h-2.5" />
          {badge}
        </span>
      )}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{ backgroundColor: highlighted ? 'rgba(201,162,39,0.1)' : 'rgba(10,22,40,0.05)' }}
      >
        <span style={{ color: highlighted ? '#C9A227' : 'rgba(10,22,40,0.4)' }}>{icon}</span>
      </div>
      <h3 className="font-semibold text-base mb-1" style={{ color: '#0A1628' }}>{title}</h3>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(10,22,40,0.5)' }}>{description}</p>
      <span
        className="inline-flex items-center gap-1 text-sm font-semibold transition-gap group-hover:gap-2"
        style={{ color: '#C9A227' }}
      >
        {ctaText}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

export default function RequestProgramme() {
  const [mode, setMode] = useState<Mode>('select');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: '#0A1628' }}>
          Request a Programme
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
          Tell us about your team's learning need and we'll design the right solution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ModeCard
          icon={<FileText className="w-6 h-6" />}
          title="Quick Form"
          description="Fill out a simple structured form to describe your learning need. Best for straightforward requests."
          ctaText="Get Started"
          onClick={() => setMode('quick-form')}
        />
        <ModeCard
          highlighted
          badge="AI Powered"
          icon={<Bot className="w-6 h-6" />}
          title="Talk to Learning AI"
          description="Have a guided conversation with our AI to uncover the right learning solution for your business challenge."
          ctaText="Start AI Consultation"
          onClick={() => setMode('ai')}
        />
      </div>

      {mode === 'quick-form' && (
        <div
          className="rounded-2xl border bg-white p-6"
          style={{ borderColor: 'rgba(10,22,40,0.09)' }}
        >
          <div className="flex items-center gap-2 mb-5 pb-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}
            >
              <Briefcase className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.45)' }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: '#0A1628' }}>Learning Request Form</h2>
              <p className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>All fields marked with * are required</p>
            </div>
          </div>
          <QuickForm onSuccess={() => setMode('success')} />
        </div>
      )}

      {mode === 'ai' && (
        <div
          className="rounded-2xl border bg-white p-10 flex flex-col items-center text-center"
          style={{ borderColor: '#C9A22740', boxShadow: '0 0 0 1px #C9A22730' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}
          >
            <MessageSquare className="w-8 h-8" style={{ color: '#C9A227' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#0A1628' }}>AI Consultation</h2>
          <p className="text-sm max-w-sm mb-1" style={{ color: 'rgba(10,22,40,0.5)' }}>
            The AI consultation interface will launch here. It will guide you through a structured diagnostic conversation to surface the right learning solution.
          </p>
          <p className="text-xs mt-3" style={{ color: 'rgba(10,22,40,0.3)' }}>
            Coming soon — use Quick Form in the meantime.
          </p>
          <button
            onClick={() => setMode('quick-form')}
            className="mt-5 text-sm font-medium underline underline-offset-2"
            style={{ color: '#C9A227' }}
          >
            Switch to Quick Form instead
          </button>
        </div>
      )}

      {mode === 'success' && (
        <div
          className="rounded-2xl border bg-white p-6"
          style={{ borderColor: 'rgba(10,22,40,0.09)' }}
        >
          <SuccessScreen onReset={() => setMode('select')} />
        </div>
      )}
    </div>
  );
}
