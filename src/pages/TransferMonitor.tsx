import { useState, useMemo } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Users,
  Star,
  TrendingUp,
  BarChart2,
  Search,
  SlidersHorizontal,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

type CheckInStatus = 'Pending' | 'Responded' | 'Overdue';
type ObservationStatus = 'Submitted' | 'Pending';

interface TransferResponse {
  applied: string;
  changed: string;
  support: string;
}

interface CheckIn {
  id: string;
  participant: string;
  department: string;
  programme: string;
  completionDate: string;
  daysSince: number;
  milestone: 30 | 60 | 90;
  status: CheckInStatus;
  response: TransferResponse | null;
}

interface Observation {
  id: string;
  employee: string;
  manager: string;
  department: string;
  programme: string;
  observationDate: string;
  rating: number;
  keyObservation: string;
  status: ObservationStatus;
}

const CHECKINS: CheckIn[] = [
  {
    id: 'TC-001',
    participant: 'Nimal Perera',
    department: 'Bancassurance Retail',
    programme: 'Sales Excellence Workshop – Q2 Campaign',
    completionDate: '2026-03-03',
    daysSince: 39,
    milestone: 30,
    status: 'Responded',
    response: {
      applied: 'I have been using the structured discovery questioning technique in every client meeting. I now map the customer\'s life stage before recommending a product.',
      changed: 'My conversion rate on endowment plans improved from 28% to 41% over four weeks. Customers have commented that conversations feel more personalised.',
      support: 'I would benefit from a refresher on objection handling for the senior segment, as they require a different approach.',
    },
  },
  {
    id: 'TC-002',
    participant: 'Chamari Silva',
    department: 'Claims',
    programme: 'Claims Processing SOP – Regulatory Update',
    completionDate: '2026-02-08',
    daysSince: 62,
    milestone: 60,
    status: 'Responded',
    response: {
      applied: 'I now follow the updated IRCSL reporting checklist for every third-party motor claim and have introduced a daily reconciliation log.',
      changed: 'Error rate in claim documentation dropped noticeably. My supervisor flagged only two minor corrections in the last two months compared to nine previously.',
      support: 'Access to the revised IRCSL circular archive within the internal DMS would speed up my reference checks significantly.',
    },
  },
  {
    id: 'TC-003',
    participant: 'Asanka Bandara',
    department: 'IT & Digital',
    programme: 'Agile & Scrum Certification – Digital Team',
    completionDate: '2026-01-10',
    daysSince: 91,
    milestone: 90,
    status: 'Overdue',
    response: null,
  },
  {
    id: 'TC-004',
    participant: 'Malini Gunawardena',
    department: 'Legal & Compliance',
    programme: 'AML/CFT Compliance Certification',
    completionDate: '2026-03-10',
    daysSince: 32,
    milestone: 30,
    status: 'Responded',
    response: {
      applied: 'I have embedded the revised CDD checklist into our new business onboarding workflow and trained two junior compliance officers on the updated thresholds.',
      changed: 'The department\'s escalation log is now 100% complete for the first time in two quarters. We also identified two previously unreported suspicious transactions during a retrospective review.',
      support: 'An updated internal policy document on PEP screening aligned with the latest FATF guidance would be very helpful.',
    },
  },
  {
    id: 'TC-005',
    participant: 'Dilani Fernando',
    department: 'HR & Talent',
    programme: 'Leadership Development – Mid-Level Managers',
    completionDate: '2026-03-28',
    daysSince: 14,
    milestone: 30,
    status: 'Pending',
    response: null,
  },
  {
    id: 'TC-006',
    participant: 'Ruwan Jayasinghe',
    department: 'Underwriting',
    programme: 'Leadership Development – Mid-Level Managers',
    completionDate: '2026-03-28',
    daysSince: 14,
    milestone: 30,
    status: 'Pending',
    response: null,
  },
  {
    id: 'TC-007',
    participant: 'Kasun Rajapaksha',
    department: 'Finance',
    programme: 'IFRS 17 Implementation for Finance Teams',
    completionDate: '2026-01-15',
    daysSince: 86,
    milestone: 90,
    status: 'Responded',
    response: {
      applied: 'I have restructured our liability measurement model to align with the VFA approach for our participating products and trained the reporting team on the new disclosure requirements.',
      changed: 'Our Q1 statutory accounts were filed without any actuary-raised queries for the first time since IFRS 17 went live. The CFO commended the improved transparency of the reconciliation schedules.',
      support: 'Hands-on guidance on the CSM roll-forward model for reinsurance contracts would be the next area where external coaching would add value.',
    },
  },
  {
    id: 'TC-008',
    participant: 'Tharaka Senanayake',
    department: 'Bancassurance Retail',
    programme: 'Sales Excellence Workshop – Q2 Campaign',
    completionDate: '2026-03-03',
    daysSince: 39,
    milestone: 30,
    status: 'Overdue',
    response: null,
  },
  {
    id: 'TC-009',
    participant: 'Ishara Dissanayake',
    department: 'Customer Experience',
    programme: 'Performance Management Refresh – 2026 KPI Framework',
    completionDate: '2026-02-01',
    daysSince: 69,
    milestone: 60,
    status: 'Responded',
    response: {
      applied: 'I restructured my team\'s monthly review against the four KPI dimensions introduced in the programme. Each team member now has a one-page KPI dashboard.',
      changed: 'Team NPS scores improved from 62 to 74 over the period. Staff report greater clarity on what "excellent" looks like in their roles.',
      support: 'A Learna module on coaching conversations tied to KPI reviews would complement what we covered in the classroom.',
    },
  },
];

const OBSERVATIONS: Observation[] = [
  {
    id: 'OB-001',
    employee: 'Nimal Perera',
    manager: 'Sanjaya Wickramaratne',
    department: 'Bancassurance Retail',
    programme: 'Sales Excellence Workshop – Q2 Campaign',
    observationDate: '2026-04-02',
    rating: 5,
    keyObservation: 'Nimal consistently applies the needs-based selling framework in joint customer visits. His pre-call planning has visibly improved and he now documents client life-stage notes in the CRM before every meeting. Conversion metrics confirm sustainable behavioural change.',
    status: 'Submitted',
  },
  {
    id: 'OB-002',
    employee: 'Chamari Silva',
    manager: 'Pradeep Kumara',
    department: 'Claims',
    programme: 'Claims Processing SOP – Regulatory Update',
    observationDate: '2026-03-25',
    rating: 4,
    keyObservation: 'Chamari has adopted the revised IRCSL checklist without prompting. Documentation quality has noticeably improved. Minor gaps remain in complex marine cargo claims which require further coaching.',
    status: 'Submitted',
  },
  {
    id: 'OB-003',
    employee: 'Malini Gunawardena',
    manager: 'Roshan Dissanayake',
    department: 'Legal & Compliance',
    programme: 'AML/CFT Compliance Certification',
    observationDate: '2026-04-01',
    rating: 5,
    keyObservation: 'Malini has become the internal reference point for CDD and PEP screening queries. She proactively cascaded the new thresholds to the wider compliance team and drafted an internal knowledge note referenced by the EXCO compliance sub-committee.',
    status: 'Submitted',
  },
  {
    id: 'OB-004',
    employee: 'Kasun Rajapaksha',
    manager: 'Thilanka Nanayakkara',
    department: 'Finance',
    programme: 'IFRS 17 Implementation for Finance Teams',
    observationDate: '2026-04-03',
    rating: 5,
    keyObservation: 'Kasun led the Q1 IFRS 17 disclosure preparation with minimal external actuary intervention. He restructured the CSM roll-forward model and mentored two junior finance officers. The CFO audit committee presentation was the highest-rated in four quarters.',
    status: 'Submitted',
  },
  {
    id: 'OB-005',
    employee: 'Asanka Bandara',
    manager: 'Lasith Maduwantha',
    department: 'IT & Digital',
    programme: 'Agile & Scrum Certification – Digital Team',
    observationDate: '',
    rating: 0,
    keyObservation: '',
    status: 'Pending',
  },
  {
    id: 'OB-006',
    employee: 'Tharaka Senanayake',
    manager: 'Sanjaya Wickramaratne',
    department: 'Bancassurance Retail',
    programme: 'Sales Excellence Workshop – Q2 Campaign',
    observationDate: '2026-04-02',
    rating: 3,
    keyObservation: 'Tharaka applies the product suitability matrix when prompted during branch reviews, but does not yet do so independently in field calls. Requires more deliberate practice and peer coaching support to embed the habit consistently.',
    status: 'Submitted',
  },
  {
    id: 'OB-007',
    employee: 'Ruwan Jayasinghe',
    manager: 'Dilani Fernando',
    department: 'Underwriting',
    programme: 'Leadership Development – Mid-Level Managers',
    observationDate: '',
    rating: 0,
    keyObservation: '',
    status: 'Pending',
  },
  {
    id: 'OB-008',
    employee: 'Ishara Dissanayake',
    manager: 'Sanduni Amarasinghe',
    department: 'Customer Experience',
    programme: 'Performance Management Refresh – 2026 KPI Framework',
    observationDate: '2026-03-28',
    rating: 4,
    keyObservation: 'Ishara restructured team KPI reviews within two weeks of training. Staff engagement in monthly reviews has improved significantly. She still defaults to outcomes-focused metrics over leading indicators but this is improving with coaching prompts.',
    status: 'Submitted',
  },
  {
    id: 'OB-009',
    employee: 'Dilani Fernando',
    manager: 'Pradeep Kumara',
    department: 'HR & Talent',
    programme: 'Leadership Development – Mid-Level Managers',
    observationDate: '',
    rating: 0,
    keyObservation: '',
    status: 'Pending',
  },
];

const CHECK_IN_STATUS: Record<CheckInStatus, { bg: string; text: string; dot: string; label: string }> = {
  Pending: { bg: 'rgba(107,114,128,0.08)', text: '#374151', dot: '#9CA3AF', label: 'Pending' },
  Responded: { bg: 'rgba(5,150,105,0.08)', text: '#047857', dot: '#10B981', label: 'Responded' },
  Overdue: { bg: 'rgba(239,68,68,0.08)', text: '#B91C1C', dot: '#EF4444', label: 'Overdue' },
};

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{
            fill: i < rating ? '#C9A227' : 'transparent',
            color: i < rating ? '#C9A227' : 'rgba(10,22,40,0.15)',
          }}
        />
      ))}
      {rating > 0 && (
        <span className="ml-1.5 text-xs font-semibold" style={{ color: '#A07D18' }}>{rating}/5</span>
      )}
    </div>
  );
}

function Badge({ children, bg, text }: { children: React.ReactNode; bg: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: bg, color: text }}>
      {children}
    </span>
  );
}

function MilestonePip({ milestone }: { milestone: 30 | 60 | 90 }) {
  const color = milestone === 30 ? '#3B82F6' : milestone === 60 ? '#F59E0B' : '#8B5CF6';
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: `${color}15`, color }}>
      {milestone}-day
    </span>
  );
}

interface CheckInCardProps {
  item: CheckIn;
  onSendReminder: (id: string) => void;
  reminderSent: boolean;
}

function CheckInCard({ item, onSendReminder, reminderSent }: CheckInCardProps) {
  const [expanded, setExpanded] = useState(false);
  const s = CHECK_IN_STATUS[item.status];
  const showReminder = item.status === 'Pending' || item.status === 'Overdue';

  return (
    <div className="bg-white rounded-2xl border overflow-hidden transition-all" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
      <div className="px-5 py-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}>
            <User className="w-5 h-5" style={{ color: '#0A1628' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-sm" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{item.participant}</span>
              <span className="text-xs" style={{ color: 'rgba(10,22,40,0.35)' }}>·</span>
              <span className="text-xs" style={{ color: 'rgba(10,22,40,0.45)' }}>{item.department}</span>
              <MilestonePip milestone={item.milestone} />
            </div>
            <div className="flex items-center gap-1.5 mb-2 text-xs" style={{ color: 'rgba(10,22,40,0.45)' }}>
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{item.programme}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>
                <Calendar className="w-3 h-3" />
                Completed {formatDate(item.completionDate)}
              </span>
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>
                <Clock className="w-3 h-3" />
                {item.daysSince} days ago
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            <Badge bg={s.bg} text={s.text}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
              {s.label}
            </Badge>
            {showReminder && (
              <button
                onClick={() => onSendReminder(item.id)}
                disabled={reminderSent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: reminderSent ? 'rgba(10,22,40,0.1)' : '#C9A227',
                  color: reminderSent ? 'rgba(10,22,40,0.4)' : '#A07D18',
                  backgroundColor: reminderSent ? 'transparent' : 'rgba(201,162,39,0.07)',
                }}
              >
                <Bell className="w-3.5 h-3.5" />
                {reminderSent ? 'Reminder Sent' : 'Send Reminder'}
              </button>
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-gray-50"
              style={{ borderColor: 'rgba(10,22,40,0.1)', color: 'rgba(10,22,40,0.5)' }}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Hide' : 'View Response'}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: '#F7F5F0' }}>
          {item.response ? (
            <>
              <TransferQuestion
                number={1}
                question="What have you applied from this programme in your day-to-day work?"
                answer={item.response.applied}
              />
              <TransferQuestion
                number={2}
                question="What has changed in the way you work as a result of this programme?"
                answer={item.response.changed}
              />
              <TransferQuestion
                number={3}
                question="What support do you still need to fully apply your learning?"
                answer={item.response.support}
              />
            </>
          ) : (
            <div className="flex items-center gap-2 py-3 text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>
              <MessageSquare className="w-4 h-4" />
              No response yet — check-in not submitted.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TransferQuestion({ number, question, answer }: { number: number; question: string; answer: string }) {
  return (
    <div>
      <div className="flex items-start gap-2 mb-1.5">
        <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#0A1628', color: '#C9A227' }}>
          {number}
        </span>
        <p className="text-xs font-semibold leading-snug" style={{ color: '#0A1628' }}>{question}</p>
      </div>
      <div className="ml-7 text-sm leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)', fontFamily: 'Inter, sans-serif' }}>
        {answer}
      </div>
    </div>
  );
}

function Tab1() {
  const [remindersSet, setRemindersSet] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<CheckInStatus | ''>('');
  const [filterDept, setFilterDept] = useState('');
  const [search, setSearch] = useState('');

  const departments = [...new Set(CHECKINS.map((c) => c.department))].sort();

  const filtered = useMemo(() => {
    return CHECKINS.filter((c) => {
      if (filterStatus && c.status !== filterStatus) return false;
      if (filterDept && c.department !== filterDept) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.participant.toLowerCase().includes(q) && !c.programme.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filterStatus, filterDept, search]);

  const counts = useMemo(() => ({
    Pending: CHECKINS.filter((c) => c.status === 'Pending').length,
    Responded: CHECKINS.filter((c) => c.status === 'Responded').length,
    Overdue: CHECKINS.filter((c) => c.status === 'Overdue').length,
  }), []);

  const handleReminder = (id: string) => {
    setRemindersSet((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: 'Responded', key: 'Responded', color: '#10B981', bg: 'rgba(5,150,105,0.07)' },
          { label: 'Pending', key: 'Pending', color: '#9CA3AF', bg: 'rgba(107,114,128,0.07)' },
          { label: 'Overdue', key: 'Overdue', color: '#EF4444', bg: 'rgba(239,68,68,0.07)' },
        ] as const).map(({ label, key, color, bg }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
            className="rounded-xl px-4 py-3 text-left transition-all hover:opacity-80 border"
            style={{
              backgroundColor: filterStatus === key ? bg : 'white',
              borderColor: filterStatus === key ? color : 'rgba(10,22,40,0.08)',
            }}
          >
            <div className="text-xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{counts[key]}</div>
            <div className="text-[11px] mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span style={{ color: 'rgba(10,22,40,0.5)' }}>{label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant or programme..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-white text-sm outline-none focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227]"
            style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2.5 rounded-xl border bg-white text-xs outline-none"
          style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {(filterStatus || filterDept || search) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterDept(''); setSearch(''); }}
            className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(10,22,40,0.4)' }}
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border py-16 text-center" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <AlertCircle className="w-7 h-7 mx-auto mb-2" style={{ color: 'rgba(10,22,40,0.2)' }} />
          <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>No check-ins match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <CheckInCard
              key={item.id}
              item={item}
              onSendReminder={handleReminder}
              reminderSent={remindersSet.has(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Tab2() {
  const [filterDept, setFilterDept] = useState('');
  const [filterProg, setFilterProg] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const departments = [...new Set(OBSERVATIONS.map((o) => o.department))].sort();
  const programmes = [...new Set(OBSERVATIONS.map((o) => o.programme))].sort();

  const filtered = useMemo(() => {
    return OBSERVATIONS.filter((o) => {
      if (filterDept && o.department !== filterDept) return false;
      if (filterProg && o.programme !== filterProg) return false;
      return true;
    });
  }, [filterDept, filterProg]);

  const submitted = filtered.filter((o) => o.status === 'Submitted');
  const avgRating = submitted.length > 0 ? (submitted.reduce((sum, o) => sum + o.rating, 0) / submitted.length).toFixed(1) : '—';
  const pctImprovement = submitted.length > 0 ? Math.round((submitted.filter((o) => o.rating >= 4).length / submitted.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border px-4 py-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="text-xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{submitted.length}</div>
          <div className="text-[11px] mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.4)' }} />
            <span style={{ color: 'rgba(10,22,40,0.5)' }}>Total Observed</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border px-4 py-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="text-xl font-bold flex items-center gap-1.5" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
            {avgRating}
            {avgRating !== '—' && <Star className="w-4 h-4" style={{ fill: '#C9A227', color: '#C9A227' }} />}
          </div>
          <div className="text-[11px] mt-0.5 flex items-center gap-1">
            <BarChart2 className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.4)' }} />
            <span style={{ color: 'rgba(10,22,40,0.5)' }}>Avg. Behaviour Change</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border px-4 py-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="text-xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{submitted.length > 0 ? `${pctImprovement}%` : '—'}</div>
          <div className="text-[11px] mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.4)' }} />
            <span style={{ color: 'rgba(10,22,40,0.5)' }}>Showing Improvement</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2.5 rounded-xl border bg-white text-xs outline-none"
          style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filterProg}
          onChange={(e) => setFilterProg(e.target.value)}
          className="px-3 py-2.5 rounded-xl border bg-white text-xs outline-none max-w-72"
          style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
        >
          <option value="">All Programmes</option>
          {programmes.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {(filterDept || filterProg) && (
          <button
            onClick={() => { setFilterDept(''); setFilterProg(''); }}
            className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(10,22,40,0.4)' }}
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr>
                {['Employee', 'Manager', 'Programme', 'Obs. Date', 'Behaviour Change', 'Key Observation', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'rgba(10,22,40,0.45)', backgroundColor: '#F7F5F0', borderBottom: '1px solid rgba(10,22,40,0.07)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((obs) => {
                const isExpanded = expandedId === obs.id;
                const isPending = obs.status === 'Pending';
                return (
                  <>
                    <tr key={obs.id} className="border-b hover:bg-[#FAFAF8] transition-colors" style={{ borderColor: 'rgba(10,22,40,0.05)' }}>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-sm" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{obs.employee}</div>
                        <div className="text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>{obs.department}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs" style={{ color: 'rgba(10,22,40,0.6)' }}>{obs.manager}</span>
                      </td>
                      <td className="px-4 py-3.5 max-w-44">
                        <span className="text-xs leading-snug" style={{ color: 'rgba(10,22,40,0.55)' }}>{obs.programme}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>{formatDate(obs.observationDate)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {isPending || obs.rating === 0
                          ? <span className="text-xs" style={{ color: 'rgba(10,22,40,0.3)' }}>Not submitted</span>
                          : <StarRating rating={obs.rating} />
                        }
                      </td>
                      <td className="px-4 py-3.5 max-w-52">
                        {isPending || !obs.keyObservation ? (
                          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.3)' }}>—</span>
                        ) : (
                          <div>
                            <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)', display: isExpanded ? 'block' : '-webkit-box', WebkitLineClamp: isExpanded ? undefined : 2, WebkitBoxOrient: 'vertical', overflow: isExpanded ? 'visible' : 'hidden' }}>
                              {obs.keyObservation}
                            </p>
                            {obs.keyObservation.length > 120 && (
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : obs.id)}
                                className="mt-1 text-[11px] font-semibold flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                                style={{ color: '#A07D18' }}
                              >
                                {isExpanded ? (
                                  <><ChevronUp className="w-3 h-3" /> Show less</>
                                ) : (
                                  <><ChevronRight className="w-3 h-3" /> Read more</>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          bg={isPending ? 'rgba(107,114,128,0.08)' : 'rgba(5,150,105,0.08)'}
                          text={isPending ? '#374151' : '#047857'}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isPending ? '#9CA3AF' : '#10B981' }} />
                          {obs.status}
                        </Badge>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <AlertCircle className="w-7 h-7 mx-auto mb-2" style={{ color: 'rgba(10,22,40,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>No observations match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TransferMonitor() {
  const [activeTab, setActiveTab] = useState<'checkins' | 'observations'>('checkins');

  const tabs = [
    { key: 'checkins' as const, label: 'Transfer Check-ins', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'observations' as const, label: 'Manager Observations', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl px-6 py-5" style={{ backgroundColor: '#0A1628' }}>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>
          Transfer Monitor
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>
          6Ds Framework — D5: Deploy Active Support for Transfer
        </p>

        <div className="flex items-center gap-1 mt-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg relative"
              style={{
                color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.45)',
                backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderBottom: activeTab === tab.key ? `2px solid #C9A227` : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'checkins' ? <Tab1 /> : <Tab2 />}
      </div>
    </div>
  );
}
