import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Brain,
  User,
  Building2,
  Calendar,
  Target,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Info,
  Zap,
} from 'lucide-react';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Pending Info';

interface AIAnalysis {
  rootCause: string;
  targetAudience: string;
  businessImpact: string;
  successMetric: string;
  urgency: string;
  recommendation: string;
}

interface Request {
  id: string;
  status: Status;
  priority: Priority;
  requestor: string;
  division: string;
  summary: string;
  fullProblem: string;
  dateSubmitted: string;
  ai?: AIAnalysis;
}

const REQUESTS: Request[] = [
  {
    id: 'REQ-0041',
    status: 'Pending Review',
    priority: 'High',
    requestor: 'Saman Perera',
    division: 'Direct Sales',
    summary: 'Sales conversion rates have dropped 18% over Q1 — agents struggling with objection handling at point of close.',
    fullProblem:
      'Over the past quarter, the Direct Sales division has seen a measurable decline in conversion rates across all product lines. Exit interviews with prospects and call recordings indicate that agents are unable to effectively respond to late-stage objections around premium pricing and policy complexity. The issue is most pronounced among agents with under 2 years of experience. Management has tried ad hoc coaching but results have not been sustained.',
    dateSubmitted: '2026-04-08',
    ai: {
      rootCause: 'Lack of structured objection-handling frameworks and insufficient practice with realistic prospect scenarios during onboarding.',
      targetAudience: 'Direct Sales agents with less than 24 months tenure — approximately 38 individuals across 4 regional branches.',
      businessImpact: 'An 18% conversion drop on current pipeline volume equates to an estimated LKR 4.2M in missed premium revenue per quarter.',
      successMetric: 'Increase close rate from 31% to at least 38% within 60 days post-training. Measured via CRM stage data.',
      urgency: 'High — Q2 targets are at risk. Intervention should begin within 2–3 weeks.',
      recommendation: 'Deploy a 2-day Consultative Selling & Objection Mastery workshop, supplemented with role-play recordings and a 30-day coaching cadence via team leads.',
    },
  },
  {
    id: 'REQ-0039',
    status: 'Under Review',
    priority: 'Medium',
    requestor: 'Nadeeka Fernando',
    division: 'Bancassurance',
    summary: 'Bank partner staff lack confidence in cross-selling insurance products — referral numbers are stagnant despite incentive programme.',
    fullProblem:
      'The Bancassurance channel has an active incentive structure with 12 partner bank branches. Despite this, referral volumes have not grown in 6 months. Mystery shopping audits show that frontline bank staff feel uncomfortable initiating insurance conversations, often citing fear of customer pushback and lack of product knowledge. The training last delivered was over 14 months ago and did not address conversational techniques.',
    dateSubmitted: '2026-04-05',
    ai: {
      rootCause: 'Outdated product knowledge combined with no practical training on conversation initiation — staff default to passive selling.',
      targetAudience: 'Frontline bank staff across 12 partner branches — estimated 85 individuals (tellers, relationship officers, branch managers).',
      businessImpact: 'Current referral rate of 0.4 per staff per month vs. industry benchmark of 1.2. Closing this gap could generate LKR 7M+ in incremental GWP annually.',
      successMetric: 'Lift referral rate to 0.9 per staff per month within 90 days. Tracked via the bancassurance referral management system.',
      urgency: 'Medium — strategic channel with long-term relationship implications. Begin within 4–6 weeks.',
      recommendation: 'Deliver a half-day product refresher + conversation skills workshop for each branch cluster. Provide leave-behind reference cards and a 2-week follow-up quiz module.',
    },
  },
  {
    id: 'REQ-0037',
    status: 'Pending Info',
    priority: 'Low',
    requestor: 'Dilhara Mendis',
    division: 'Customer Service',
    summary: 'New recruits in the call centre are taking longer than expected to reach full productivity — onboarding feels disjointed.',
    fullProblem:
      'The Customer Service division onboards approximately 10–15 new agents per quarter. Recently, team leads have flagged that new recruits are taking 8–10 weeks to reach independent handling capability, compared to a previous benchmark of 5–6 weeks. The onboarding material has not been reviewed since 2023 and does not reflect current systems or complaint-handling procedures. There is no structured buddy programme.',
    dateSubmitted: '2026-04-02',
  },
  {
    id: 'REQ-0034',
    status: 'Approved',
    priority: 'High',
    requestor: 'Eranda Wickramasinghe',
    division: 'Corporate',
    summary: 'Senior relationship managers need negotiation and proposal presentation skills ahead of Q2 corporate renewal season.',
    fullProblem:
      'The Corporate division manages large group accounts with renewal windows clustered in Q2 (April–June). Relationship managers are reporting that they lose deals at final presentation stage, particularly against aggressive competitor pricing. Leadership wants to upskill the team in structured negotiation, value-based storytelling, and executive presentation techniques before the renewal cycle peaks.',
    dateSubmitted: '2026-03-28',
  },
];

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  'Pending Review': { label: 'Pending Review', bg: 'rgba(217,119,6,0.1)', text: '#92400E', dot: '#D97706' },
  'Under Review':  { label: 'Under Review',  bg: 'rgba(37,99,235,0.1)',  text: '#1E3A8A', dot: '#2563EB' },
  'Approved':      { label: 'Approved',       bg: 'rgba(5,150,105,0.1)', text: '#064E3B', dot: '#059669' },
  'Rejected':      { label: 'Rejected',       bg: 'rgba(220,38,38,0.1)', text: '#7F1D1D', dot: '#DC2626' },
  'Pending Info':  { label: 'Pending Info',   bg: 'rgba(107,114,128,0.1)', text: '#1F2937', dot: '#6B7280' },
};

const PRIORITY_DOT: Record<Priority, string> = {
  High: '#DC2626',
  Medium: '#D97706',
  Low: '#059669',
};

const AI_FIELDS: { key: keyof AIAnalysis; label: string; icon: React.ReactNode }[] = [
  { key: 'rootCause',      label: 'Root Cause',       icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { key: 'targetAudience', label: 'Target Audience',   icon: <Target className="w-3.5 h-3.5" /> },
  { key: 'businessImpact', label: 'Business Impact',   icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { key: 'successMetric',  label: 'Success Metric',    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { key: 'urgency',        label: 'Urgency',           icon: <Zap className="w-3.5 h-3.5" /> },
  { key: 'recommendation', label: 'Recommendation',    icon: <Brain className="w-3.5 h-3.5" /> },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ActionDef {
  label: string;
  bg: string;
  text: string;
  border?: string;
  icon: React.ReactNode;
}

const ACTIONS: ActionDef[] = [
  { label: 'Approve',      bg: '#C9A227', text: '#0A1628', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { label: 'Schedule',     bg: 'rgba(37,99,235,0.1)', text: '#1E3A8A', border: 'rgba(37,99,235,0.2)', icon: <Calendar className="w-3.5 h-3.5" /> },
  { label: 'Reroute',      bg: 'rgba(10,22,40,0.06)', text: '#0A1628', border: 'rgba(10,22,40,0.12)', icon: <RotateCcw className="w-3.5 h-3.5" /> },
  { label: 'Pending Info', bg: 'rgba(107,114,128,0.1)', text: '#374151', border: 'rgba(107,114,128,0.2)', icon: <Info className="w-3.5 h-3.5" /> },
  { label: 'Reject',       bg: 'rgba(220,38,38,0.08)', text: '#B91C1C', border: 'rgba(220,38,38,0.2)', icon: <XCircle className="w-3.5 h-3.5" /> },
];

function RequestCard({ req }: { req: Request }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const statusCfg = STATUS_CONFIG[req.status];

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden transition-shadow"
      style={{ borderColor: expanded ? 'rgba(10,22,40,0.14)' : 'rgba(10,22,40,0.07)', boxShadow: expanded ? '0 2px 16px rgba(10,22,40,0.06)' : undefined }}
    >
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-sm font-semibold" style={{ color: '#C9A227' }}>{req.id}</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: statusCfg.dot, verticalAlign: 'middle' }} />
              {statusCfg.label}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'rgba(10,22,40,0.5)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PRIORITY_DOT[req.priority] }} />
              {req.priority} Priority
            </span>
            {req.ai && (
              <span
                className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#92400E' }}
              >
                <Brain className="w-3 h-3" />
                AI Analysis
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>
              <User className="w-3.5 h-3.5" />
              {req.requestor}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>
              <Building2 className="w-3.5 h-3.5" />
              {req.division}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>
              <Clock className="w-3.5 h-3.5" />
              {formatDate(req.dateSubmitted)}
            </span>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>{req.summary}</p>
        </div>

        <div className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t px-5 py-5 space-y-5" style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: '#FAFAF8' }}>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(10,22,40,0.4)' }}>Full Business Problem</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#0A1628' }}>{req.fullProblem}</p>
          </div>

          {req.ai && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(201,162,39,0.25)' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: 'rgba(201,162,39,0.08)' }}>
                <Brain className="w-4 h-4" style={{ color: '#C9A227' }} />
                <span className="text-sm font-semibold" style={{ color: '#0A1628' }}>AI Analysis</span>
                <span className="text-xs ml-1" style={{ color: 'rgba(10,22,40,0.4)' }}>— Generated by Learna AI Advisor</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AI_FIELDS.map(({ key, label, icon }) => (
                  <div key={key}>
                    <div className="flex items-center gap-1.5 mb-1" style={{ color: '#C9A227' }}>
                      {icon}
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.45)' }}>{label}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#0A1628' }}>{req.ai![key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'rgba(10,22,40,0.4)' }}>
              Admin Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add an internal note for this request…"
              className="w-full text-sm rounded-lg border px-3 py-2.5 resize-none outline-none transition-colors"
              style={{
                borderColor: 'rgba(10,22,40,0.15)',
                color: '#0A1628',
                backgroundColor: 'white',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A227')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(10,22,40,0.15)')}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-105 active:scale-95 border"
                style={{
                  backgroundColor: action.bg,
                  color: action.text,
                  borderColor: action.border ?? 'transparent',
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STATUS_FILTERS: (Status | 'All')[] = ['All', 'Pending Review', 'Under Review', 'Approved', 'Pending Info', 'Rejected'];

export default function IncomingRequests() {
  const [filter, setFilter] = useState<Status | 'All'>('All');

  const visible = filter === 'All' ? REQUESTS : REQUESTS.filter((r) => r.status === filter);

  const counts: Record<string, number> = { All: REQUESTS.length };
  REQUESTS.forEach((r) => {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: '#0A1628' }}>Incoming Requests</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>{REQUESTS.length} requests total — review, analyse and action each submission</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = filter === f;
          const cfg = f !== 'All' ? STATUS_CONFIG[f as Status] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{
                backgroundColor: active ? (cfg ? cfg.bg : 'rgba(10,22,40,0.08)') : 'white',
                color: active ? (cfg ? cfg.text : '#0A1628') : 'rgba(10,22,40,0.5)',
                borderColor: active ? (cfg ? cfg.dot : 'rgba(10,22,40,0.2)') : 'rgba(10,22,40,0.1)',
              }}
            >
              {cfg && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />}
              {f}
              <span
                className="ml-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: active ? 'rgba(0,0,0,0.08)' : 'rgba(10,22,40,0.06)', color: active ? 'inherit' : 'rgba(10,22,40,0.5)' }}
              >
                {counts[f] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="text-center py-12" style={{ color: 'rgba(10,22,40,0.35)' }}>
            No requests match this filter.
          </div>
        )}
        {visible.map((req) => (
          <RequestCard key={req.id} req={req} />
        ))}
      </div>
    </div>
  );
}
