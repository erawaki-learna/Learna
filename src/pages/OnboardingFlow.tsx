import { useState } from 'react';
import {
  BookOpen,
  Users,
  Shield,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Layers,
  BarChart2,
  Target,
  Zap,
  RefreshCw,
  Award,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface Props {
  onComplete: () => void;
}

type Role = 'sales' | 'admin' | null;

interface StepState {
  role: Role;
  division: string;
  branch: string;
}

const DIVISIONS = [
  'Bancassurance Retail',
  'Direct Sales',
  'Agency',
  'Corporate Bancassurance',
  'Claims',
  'Underwriting',
  'HR & Talent',
  'IT & Digital',
];

const SIX_DS = [
  { icon: Target, label: 'Define', desc: 'Define business outcomes' },
  { icon: Layers, label: 'Design', desc: 'Design the learning experience' },
  { icon: Zap, label: 'Deliver', desc: 'Deliver the programme' },
  { icon: RefreshCw, label: 'Drive', desc: 'Drive learning transfer' },
  { icon: BarChart2, label: 'Deploy', desc: 'Deploy performance support' },
  { icon: Award, label: 'Document', desc: 'Document business results' },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="transition-all duration-300"
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '99px',
              backgroundColor: i < current ? '#C9A227' : i === current ? '#C9A227' : 'rgba(255,255,255,0.25)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
        style={{ backgroundColor: '#C9A227' }}
      >
        <BookOpen className="w-8 h-8" style={{ color: '#0A1628' }} />
      </div>

      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
        HNB Assurance PLC
      </p>
      <h1
        className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
        style={{ color: 'white', fontFamily: 'Georgia, serif' }}
      >
        Welcome to Learna
      </h1>
      <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
        Your intelligent Learning &amp; Development platform. Learna connects your growth goals to measurable
        business outcomes using the proven 6Ds framework.
      </p>

      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
        <p className="text-xs font-bold uppercase tracking-wider mb-4 text-left" style={{ color: 'rgba(255,255,255,0.4)' }}>
          The 6Ds Framework
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SIX_DS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'rgba(201,162,39,0.15)' }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: '#C9A227' }} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold" style={{ color: 'white' }}>{label}</p>
                <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
        style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
      >
        Get Started <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Step2({ state, setState, onNext, onBack }: {
  state: StepState;
  setState: (s: Partial<StepState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const cards = [
    {
      value: 'sales' as Role,
      icon: Users,
      title: 'Sales / Bancassurance Staff',
      description:
        'I work in a sales, branch, or bancassurance role and want to request training, track my learning journey, and develop my skills.',
      tag: 'Requestor',
    },
    {
      value: 'admin' as Role,
      icon: Shield,
      title: 'L&D Administrator',
      description:
        'I manage the Learning & Development function, review training requests, design programmes, and track organisational impact.',
      tag: 'Admin / L&D Officer',
    },
  ];

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 w-full">
      <h2
        className="text-2xl sm:text-3xl font-bold mb-2 text-center"
        style={{ color: 'white', fontFamily: 'Georgia, serif' }}
      >
        What describes you best?
      </h2>
      <p className="text-sm mb-8 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        This helps us personalise your Learna experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          const selected = state.role === card.value;
          return (
            <button
              key={card.value}
              onClick={() => setState({ role: card.value })}
              className="text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-3"
              style={{
                borderColor: selected ? '#C9A227' : 'rgba(255,255,255,0.12)',
                backgroundColor: selected ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.04)',
                boxShadow: selected ? '0 0 0 4px rgba(201,162,39,0.15)' : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: selected ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: selected ? '#C9A227' : 'rgba(255,255,255,0.5)' }} />
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: selected ? '#C9A227' : 'rgba(255,255,255,0.2)', backgroundColor: selected ? '#C9A227' : 'transparent' }}
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'white', fontFamily: 'Georgia, serif' }}>{card.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{card.description}</p>
              </div>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full w-fit"
                style={{
                  backgroundColor: selected ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.07)',
                  color: selected ? '#C9A227' : 'rgba(255,255,255,0.35)',
                }}
              >
                {card.tag}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 w-full justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!state.role}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step3({ state, setState, onNext, onBack }: {
  state: StepState;
  setState: (s: Partial<StepState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto px-4 w-full">
      <h2
        className="text-2xl sm:text-3xl font-bold mb-2 text-center"
        style={{ color: 'white', fontFamily: 'Georgia, serif' }}
      >
        Where do you work?
      </h2>
      <p className="text-sm mb-8 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        This helps route your requests to the right L&amp;D team.
      </p>

      <div className="w-full space-y-4 mb-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Division
          </label>
          <div className="relative">
            <select
              value={state.division}
              onChange={(e) => setState({ division: e.target.value })}
              className="w-full appearance-none px-4 pr-10 py-3.5 rounded-xl border text-sm outline-none transition-all"
              style={{
                borderColor: state.division ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: state.division ? 'white' : 'rgba(255,255,255,0.35)',
              }}
            >
              <option value="" disabled>Select your division…</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d} style={{ color: '#0A1628', backgroundColor: 'white' }}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Branch / Location <span style={{ color: 'rgba(255,255,255,0.25)' }}>(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Colombo 03, Kandy, Galle…"
            value={state.branch}
            onChange={(e) => setState({ branch: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
            style={{
              borderColor: state.branch ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'white',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 w-full justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!state.division}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step4({ state, onComplete, onBack }: {
  state: StepState;
  onComplete: () => void;
  onBack: () => void;
}) {
  const roleLabel = state.role === 'admin' ? 'L&D Administrator' : 'Sales / Bancassurance Staff';

  const capabilities = state.role === 'admin'
    ? [
        'Review and manage incoming training requests',
        'Design programmes using the 6Ds framework',
        'Track ROI and generate impact reports',
        'Manage users, schedules, and integrations',
      ]
    : [
        'Submit training requests and track their status',
        'Browse your personalised learning journey',
        'Complete transfer check-ins after training',
        'Access your certificates and achievements',
      ];

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto px-4 w-full">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: 'rgba(201,162,39,0.15)', border: '2px solid rgba(201,162,39,0.4)' }}
      >
        <CheckCircle className="w-8 h-8" style={{ color: '#C9A227' }} />
      </div>

      <h2
        className="text-2xl sm:text-3xl font-bold mb-2 text-center"
        style={{ color: 'white', fontFamily: 'Georgia, serif' }}
      >
        You're all set!
      </h2>
      <p className="text-sm mb-6 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Here's a summary of your Learna profile.
      </p>

      <div
        className="w-full rounded-2xl border p-5 mb-5"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Role', value: roleLabel },
            { label: 'Division', value: state.division },
            ...(state.branch ? [{ label: 'Branch', value: state.branch }] : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: 'white' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-full rounded-2xl border p-5 mb-8"
        style={{ backgroundColor: 'rgba(201,162,39,0.06)', borderColor: 'rgba(201,162,39,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: '#C9A227' }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>What you can do in Learna</p>
        </div>
        <ul className="space-y-2">
          {capabilities.map((cap) => (
            <li key={cap} className="flex items-start gap-2.5">
              <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#C9A227' }} />
              <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{cap}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 w-full justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
        >
          Enter Learna <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<StepState>({ role: null, division: '', branch: '' });

  function patch(s: Partial<StepState>) {
    setState((prev) => ({ ...prev, ...s }));
  }

  const TOTAL = 4;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0F2040 50%, #0A1628 100%)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,162,39,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#C9A227' }}
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: '#0A1628' }} />
            </div>
            <span className="text-sm font-bold" style={{ color: 'white', fontFamily: 'Georgia, serif' }}>Learna</span>
          </div>
          {step > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Step {step} of {TOTAL - 1}</span>
              <StepIndicator current={step} total={TOTAL} />
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-2xl">
            {step === 0 && <Step1 onNext={() => setStep(1)} />}
            {step === 1 && <Step2 state={state} setState={patch} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <Step3 state={state} setState={patch} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <Step4 state={state} onComplete={onComplete} onBack={() => setStep(2)} />}
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            HNB Assurance PLC &mdash; Learna Learning &amp; Development Platform
          </p>
        </div>
      </div>
    </div>
  );
}
