import { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Info,
  User,
  Building2,
  Calendar,
  Layers,
  AlertTriangle,
} from 'lucide-react';

type StatusKey = 'Submitted' | 'Under Review' | 'Approved' | 'Scheduled' | 'Completed';
type Priority = 'High' | 'Medium' | 'Low';

const TIMELINE_STEPS: StatusKey[] = ['Submitted', 'Under Review', 'Approved', 'Scheduled', 'Completed'];

interface Comment {
  id: number;
  author: string;
  initials: string;
  role: string;
  timestamp: string;
  text: string;
}

const MOCK_REQUEST = {
  id: 'REQ-2026-0047',
  status: 'Under Review' as StatusKey,
  submittedDate: '2026-04-03',
  requestor: {
    name: 'Chamari Perera',
    department: 'Bancassurance Retail',
    role: 'Senior Bancassurance Officer',
    branch: 'Colombo 03 — HNB Nawam Mawatha',
  },
  programme: {
    type: 'Sales Capability Development',
    priority: 'High' as Priority,
    aiClassified: true,
  },
  businessContext: `Our bancassurance team at HNB Nawam Mawatha has been consistently underperforming against the Q1 2026 unit-linked endowment sales target by approximately 23%. Root-cause analysis conducted by the branch manager identified that officers lack confidence in explaining the investment component of endowment products to high-net-worth clients. Specifically, the team struggles with translating fund performance data into client-friendly narratives and handling objections around market volatility.\n\nWe are requesting a focused capability development programme that addresses both product technical knowledge (fund mechanisms, NAV, risk classification) and advanced consultative selling techniques. The programme should incorporate role-play practice with realistic client scenarios modelled on HNB Premier clients. Completion is required before the Q2 campaign launch on 1 June 2026.`,
  aiRecommendation: {
    text: `Based on the business context provided, I recommend a 2-day Blended Learning Programme structured as follows: Day 1 (Workshop) focusing on unit-linked product mechanics, NAV calculations, fund performance interpretation, and regulatory disclosure obligations. Day 2 (Practicum) delivering facilitated role-play scenarios using the LAER objection-handling framework with debrief by a senior L&D facilitator. Pre-work should include the existing LMS module "Investment-Linked Products Fundamentals" (90 mins). Post-programme, a 30-day transfer support plan with weekly check-ins from the line manager is strongly recommended to consolidate learning. This aligns with the D3 Delivery and D4 Deploy phases of the 6Ds framework.`,
    confidence: 92,
    tags: ['Blended Learning', 'Sales Enablement', 'Product Knowledge', 'LAER Framework'],
  },
  comments: [
    {
      id: 1,
      author: 'Eranda Wakista',
      initials: 'EW',
      role: 'Lead Learning Manager',
      timestamp: '2026-04-04T09:15:00',
      text: "Reviewed the request. The AI recommendation aligns well with the learner profile. I've cross-referenced the Q1 performance data from the bancassurance MIS — the 23% shortfall is confirmed. Forwarding to programme design team for blueprint confirmation.",
    },
    {
      id: 2,
      author: 'Nishantha Jayasinghe',
      initials: 'NJ',
      role: 'Programme Design Lead',
      timestamp: '2026-04-05T14:30:00',
      text: "Blueprint BP-001 (Bancassurance Sales Mastery) can be adapted for this cohort. I'll need to customise the Day 2 role-play scenarios to reflect the unit-linked product range specifically. Estimated turnaround for the customised version: 5 working days. Venue availability at the Colombo Training Centre needs to be confirmed for mid-May.",
    },
    {
      id: 3,
      author: 'Dilanka Rathnayake',
      initials: 'DR',
      role: 'L&D Coordinator',
      timestamp: '2026-04-07T11:00:00',
      text: 'Colombo Training Centre has availability on 19–20 May 2026. HNB Nawam Mawatha branch manager has confirmed participant availability for those dates (cohort of 8). Awaiting formal approval to proceed with scheduling.',
    },
  ] as Comment[],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status }: { status: StatusKey }) {
  const map: Record<StatusKey, { bg: string; color: string }> = {
    Submitted: { bg: 'rgba(59,130,246,0.1)', color: '#1D4ED8' },
    'Under Review': { bg: 'rgba(245,158,11,0.1)', color: '#92400E' },
    Approved: { bg: 'rgba(16,185,129,0.1)', color: '#065F46' },
    Scheduled: { bg: 'rgba(99,102,241,0.1)', color: '#3730A3' },
    Completed: { bg: 'rgba(10,22,40,0.08)', color: '#0A1628' },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { bg: string; color: string }> = {
    High: { bg: 'rgba(239,68,68,0.08)', color: '#B91C1C' },
    Medium: { bg: 'rgba(245,158,11,0.08)', color: '#92400E' },
    Low: { bg: 'rgba(10,22,40,0.06)', color: 'rgba(10,22,40,0.5)' },
  };
  const s = map[priority];
  const Icon = priority === 'High' ? AlertTriangle : Clock;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <Icon className="w-3 h-3" /> {priority} Priority
    </span>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 85 ? '#065F46' : score >= 70 ? '#92400E' : '#B91C1C';
  const bg = score >= 85 ? 'rgba(16,185,129,0.1)' : score >= 70 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.08)';
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {score}% confidence
    </span>
  );
}

export default function RequestDetail() {
  const req = MOCK_REQUEST;
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(req.comments);

  const currentStepIdx = TIMELINE_STEPS.indexOf(req.status);

  function handleSubmitComment() {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: 'Eranda Wakista',
        initials: 'EW',
        role: 'Lead Learning Manager',
        timestamp: new Date().toISOString(),
        text: newComment.trim(),
      },
    ]);
    setNewComment('');
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-5xl mx-auto pb-32 pt-2">

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-75"
            style={{ color: 'rgba(10,22,40,0.5)', backgroundColor: 'white', border: '1px solid rgba(10,22,40,0.1)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-sm" style={{ color: 'rgba(10,22,40,0.3)' }}>/</span>
          <span className="text-sm" style={{ color: 'rgba(10,22,40,0.45)' }}>Learning Requests</span>
          <span className="text-sm" style={{ color: 'rgba(10,22,40,0.3)' }}>/</span>
          <span className="text-sm font-semibold" style={{ color: '#0A1628' }}>{req.id}</span>
        </div>

        <div className="bg-white rounded-2xl border px-6 py-5 mb-5" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <h1 className="text-xl font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{req.id}</h1>
                <StatusBadge status={req.status} />
                <PriorityBadge priority={req.programme.priority} />
                {req.programme.aiClassified && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#7A5B0A' }}
                  >
                    <Bot className="w-3 h-3" /> AI Classified
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>
                Submitted {formatDate(req.submittedDate)} &middot; {req.programme.type}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Request Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A227' }} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>Requestor</p>
                  <p className="text-sm font-medium" style={{ color: '#0A1628' }}>{req.requestor.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.5)' }}>{req.requestor.role}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A227' }} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>Department</p>
                  <p className="text-sm font-medium" style={{ color: '#0A1628' }}>{req.requestor.department}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.5)' }}>{req.requestor.branch}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Layers className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A227' }} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>Programme Type</p>
                  <p className="text-sm font-medium" style={{ color: '#0A1628' }}>{req.programme.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A227' }} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>Submitted</p>
                  <p className="text-sm font-medium" style={{ color: '#0A1628' }}>{formatDate(req.submittedDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Business Context</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(10,22,40,0.65)' }}>{req.businessContext}</p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl border p-5 mb-5"
          style={{ borderColor: 'rgba(10,22,40,0.09)', borderLeft: '4px solid #C9A227' }}
        >
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" style={{ color: '#C9A227' }} />
              <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>AI Recommendation</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <ConfidenceBadge score={req.aiRecommendation.confidence} />
              {req.aiRecommendation.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ backgroundColor: 'rgba(10,22,40,0.05)', color: 'rgba(10,22,40,0.45)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>{req.aiRecommendation.text}</p>
        </div>

        <div className="bg-white rounded-2xl border p-5 mb-5" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <h2 className="text-sm font-semibold mb-6" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Status Timeline</h2>
          <div className="relative flex items-start justify-between">
            {TIMELINE_STEPS.map((step, idx) => {
              const done = idx < currentStepIdx;
              const current = idx === currentStepIdx;
              return (
                <div key={step} className="flex flex-col items-center flex-1 relative">
                  {idx > 0 && (
                    <div
                      className="absolute top-4 right-1/2 w-full h-0.5"
                      style={{ backgroundColor: done || current ? '#C9A227' : 'rgba(10,22,40,0.1)' }}
                    />
                  )}
                  <div
                    className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: current ? '#C9A227' : done ? 'rgba(201,162,39,0.12)' : 'rgba(10,22,40,0.05)',
                      border: `2px solid ${current ? '#C9A227' : done ? 'rgba(201,162,39,0.4)' : 'rgba(10,22,40,0.1)'}`,
                    }}
                  >
                    {done ? (
                      <CheckCircle className="w-4 h-4" style={{ color: '#C9A227' }} />
                    ) : current ? (
                      <Clock className="w-4 h-4" style={{ color: '#0A1628' }} />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(10,22,40,0.15)' }} />
                    )}
                  </div>
                  <span
                    className="text-[11px] font-semibold text-center leading-tight"
                    style={{
                      color: current ? '#0A1628' : done ? '#A07D18' : 'rgba(10,22,40,0.3)',
                      maxWidth: '72px',
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="w-4 h-4" style={{ color: '#C9A227' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Comments
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold ml-1"
              style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: 'rgba(10,22,40,0.45)' }}
            >
              {comments.length}
            </span>
          </div>

          <div className="space-y-5 mb-5">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ backgroundColor: '#0A1628' }}
                >
                  {c.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: '#0A1628' }}>{c.author}</span>
                    <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.35)' }}>{c.role}</span>
                    <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.3)' }}>{formatDatetime(c.timestamp)}</span>
                  </div>
                  <div
                    className="px-4 py-3 rounded-xl text-sm leading-relaxed"
                    style={{ backgroundColor: '#F7F5F0', color: 'rgba(10,22,40,0.65)' }}
                  >
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ backgroundColor: '#0A1628' }}
              >
                EW
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none transition-all"
                  style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontFamily: 'Inter, sans-serif', backgroundColor: 'white' }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                    style={{ backgroundColor: '#0A1628', color: '#C9A227' }}
                  >
                    <Send className="w-3.5 h-3.5" /> Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 border-t px-6 py-4 flex items-center justify-between gap-3 flex-wrap"
        style={{ backgroundColor: 'white', borderColor: 'rgba(10,22,40,0.1)', boxShadow: '0 -4px 24px rgba(10,22,40,0.07)' }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>
          <span className="font-semibold text-sm" style={{ color: '#0A1628' }}>Admin Actions</span>
          <span>&middot;</span>
          <span>{req.id}</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: 'rgba(10,22,40,0.15)', color: '#0A1628', backgroundColor: 'white' }}
          >
            <Info className="w-4 h-4" /> Request More Info
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#B91C1C' }}
          >
            <ThumbsDown className="w-4 h-4" /> Reject
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#065F46' }}
          >
            <ThumbsUp className="w-4 h-4" /> Approve
          </button>
        </div>
      </div>
    </div>
  );
}
