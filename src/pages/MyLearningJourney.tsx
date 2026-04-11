import { useState } from 'react';
import { BookOpen, Clock, CheckCircle2, User, Building2, Zap, Calendar } from 'lucide-react';

type Status = 'Active' | 'Completed' | 'Pending' | 'Rejected';
type Urgency = 'High' | 'Medium' | 'Low';

interface JourneyRequest {
  id: string;
  status: Status;
  summary: string;
  division: string;
  urgency: Urgency;
  dateSubmitted: string;
  currentStage: number;
}

const STAGES = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
const STAGE_LABELS: Record<string, string> = {
  D1: 'Discovery',
  D2: 'Analysis',
  D3: 'Design',
  D4: 'Development',
  D5: 'Delivery',
  D6: 'Evaluation',
};

const SAMPLE_REQUESTS: JourneyRequest[] = [
  {
    id: 'REQ-0041',
    status: 'Active',
    summary: 'Sales conversion rates have dropped 18% over Q1 — agents struggling with objection handling at point of close.',
    division: 'Direct Sales',
    urgency: 'High',
    dateSubmitted: '2026-04-08',
    currentStage: 2,
  },
  {
    id: 'REQ-0036',
    status: 'Active',
    summary: 'Bancassurance frontline staff need a refresher on life product features ahead of the mid-year campaign.',
    division: 'Bancassurance',
    urgency: 'Medium',
    dateSubmitted: '2026-03-21',
    currentStage: 4,
  },
  {
    id: 'REQ-0029',
    status: 'Completed',
    summary: 'Leadership communication skills programme for branch managers across the Southern region.',
    division: 'HR & Talent',
    urgency: 'Low',
    dateSubmitted: '2026-01-14',
    currentStage: 6,
  },
  {
    id: 'REQ-0044',
    status: 'Pending',
    summary: 'Compliance refresher on IRDAI guidelines and updated product disclosure requirements for all advisors.',
    division: 'Compliance',
    urgency: 'High',
    dateSubmitted: '2026-04-10',
    currentStage: 0,
  },
];

const STATUS_CONFIG: Record<Status, { bg: string; text: string; dot: string; label: string }> = {
  Active:    { bg: 'rgba(37,99,235,0.1)',   text: '#1E3A8A', dot: '#2563EB', label: 'Active' },
  Completed: { bg: 'rgba(5,150,105,0.1)',   text: '#064E3B', dot: '#059669', label: 'Completed' },
  Pending:   { bg: 'rgba(217,119,6,0.1)',   text: '#92400E', dot: '#D97706', label: 'Pending Review' },
  Rejected:  { bg: 'rgba(220,38,38,0.08)',  text: '#7F1D1D', dot: '#DC2626', label: 'Rejected' },
};

const URGENCY_CONFIG: Record<Urgency, { color: string; bg: string }> = {
  High:   { color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  Medium: { color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  Low:    { color: '#059669', bg: 'rgba(5,150,105,0.08)' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

type FilterType = 'All' | Status;
const FILTERS: FilterType[] = ['All', 'Active', 'Completed', 'Pending'];

function PipelineBar({ currentStage }: { currentStage: number }) {
  return (
    <div className="mt-3">
      <div className="flex items-center gap-0">
        {STAGES.map((stage, i) => {
          const completed = i < currentStage;
          const active = i === currentStage - 1 && currentStage < 6;
          const isFinal = currentStage === 6;
          const isActive = isFinal ? true : active;
          const isCompleted = isFinal ? i < 6 : completed && !active;
          const isPending = !isCompleted && !isActive;

          return (
            <div key={stage} className="flex items-center" style={{ flex: 1 }}>
              <div className="flex flex-col items-center" style={{ flex: 'none', width: 40 }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    backgroundColor: isCompleted
                      ? '#C9A227'
                      : isActive
                      ? '#C9A227'
                      : 'rgba(10,22,40,0.07)',
                    color: isCompleted || isActive ? '#0A1628' : 'rgba(10,22,40,0.3)',
                    boxShadow: isActive && !isFinal ? '0 0 0 3px rgba(201,162,39,0.25)' : undefined,
                    transform: isActive && !isFinal ? 'scale(1.08)' : undefined,
                  }}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    stage
                  )}
                </div>
                <span
                  className="text-[9px] font-medium mt-0.5 text-center leading-tight whitespace-nowrap"
                  style={{
                    color: isCompleted || isActive ? '#C9A227' : 'rgba(10,22,40,0.3)',
                  }}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className="h-0.5 flex-1"
                  style={{
                    backgroundColor: i < currentStage - 1 || isFinal
                      ? '#C9A227'
                      : 'rgba(10,22,40,0.08)',
                    marginBottom: 14,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RequestCard({ req }: { req: JourneyRequest }) {
  const statusCfg = STATUS_CONFIG[req.status];
  const urgencyCfg = URGENCY_CONFIG[req.urgency];

  return (
    <div
      className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow"
      style={{ borderColor: 'rgba(10,22,40,0.08)' }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        <span className="font-mono text-sm font-semibold" style={{ color: '#C9A227' }}>
          {req.id}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.dot }} />
          {statusCfg.label}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: urgencyCfg.bg, color: urgencyCfg.color }}
        >
          <Zap className="w-3 h-3" />
          {req.urgency} Urgency
        </span>
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: '#0A1628' }}>
        {req.summary}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(10,22,40,0.5)' }}>
          <Building2 className="w-3.5 h-3.5" />
          {req.division}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(10,22,40,0.5)' }}>
          <Calendar className="w-3.5 h-3.5" />
          Submitted {formatDate(req.dateSubmitted)}
        </span>
      </div>

      <PipelineBar currentStage={req.currentStage} />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border p-5 flex items-center gap-4"
      style={{ borderColor: 'rgba(10,22,40,0.08)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accent}14` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: '#0A1628' }}>
          {value}
        </p>
        <p className="text-xs font-medium" style={{ color: 'rgba(10,22,40,0.45)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function MyLearningJourney() {
  const [filter, setFilter] = useState<FilterType>('All');

  const total = SAMPLE_REQUESTS.length;
  const inProgress = SAMPLE_REQUESTS.filter((r) => r.status === 'Active').length;
  const completed = SAMPLE_REQUESTS.filter((r) => r.status === 'Completed').length;

  const visible =
    filter === 'All' ? SAMPLE_REQUESTS : SAMPLE_REQUESTS.filter((r) => r.status === filter);

  const filterCounts: Record<FilterType, number> = {
    All: total,
    Active: inProgress,
    Completed: completed,
    Pending: SAMPLE_REQUESTS.filter((r) => r.status === 'Pending').length,
    Rejected: SAMPLE_REQUESTS.filter((r) => r.status === 'Rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: '#0A1628' }}>
          My Learning Journey
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
          Track the progress of your submitted learning requests through the D1–D6 pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total Requests"
          value={total}
          icon={<BookOpen className="w-5 h-5" />}
          accent="#C9A227"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          icon={<Clock className="w-5 h-5" />}
          accent="#2563EB"
        />
        <StatCard
          label="Completed"
          value={completed}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accent="#059669"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          const cfg = f !== 'All' ? STATUS_CONFIG[f as Status] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{
                backgroundColor: active
                  ? cfg
                    ? cfg.bg
                    : 'rgba(10,22,40,0.08)'
                  : 'white',
                color: active ? (cfg ? cfg.text : '#0A1628') : 'rgba(10,22,40,0.5)',
                borderColor: active
                  ? cfg
                    ? cfg.dot
                    : 'rgba(10,22,40,0.2)'
                  : 'rgba(10,22,40,0.1)',
              }}
            >
              {cfg && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cfg.dot }}
                />
              )}
              {f}
              <span
                className="ml-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: active ? 'rgba(0,0,0,0.08)' : 'rgba(10,22,40,0.06)',
                  color: active ? 'inherit' : 'rgba(10,22,40,0.5)',
                }}
              >
                {filterCounts[f] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-xl border bg-white"
            style={{ borderColor: 'rgba(10,22,40,0.07)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}
            >
              <User className="w-6 h-6" style={{ color: '#C9A227' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#0A1628' }}>
              No requests found
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(10,22,40,0.4)' }}>
              There are no learning requests matching this filter.
            </p>
          </div>
        ) : (
          visible.map((req) => <RequestCard key={req.id} req={req} />)
        )}
      </div>
    </div>
  );
}
