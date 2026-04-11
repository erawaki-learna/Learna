import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Award,
  BarChart2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  X,
  Target,
  Lightbulb,
  CheckCircle,
  Star,
} from 'lucide-react';

interface ProgrammeImpact {
  id: string;
  name: string;
  department: string;
  deliveryDate: string;
  learnerCount: number;
  satisfactionScore: number;
  knowledgeGain: number;
  behaviourTransferRate: number;
  businessImpactRating: number;
  summary: string;
  achievements: string[];
  recommendations: string[];
  trainingCost: number;
  estimatedBenefit: number;
  paybackMonths: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

const PROGRAMMES: ProgrammeImpact[] = [
  {
    id: 'P-001',
    name: 'Sales Excellence Workshop – Q2 Campaign',
    department: 'Bancassurance Retail',
    deliveryDate: '2026-02-15',
    learnerCount: 38,
    satisfactionScore: 92,
    knowledgeGain: 34,
    behaviourTransferRate: 78,
    businessImpactRating: 5,
    summary: 'A high-impact sales capability programme delivered to the bancassurance retail force ahead of the Q2 endowment campaign. The programme focused on needs-based selling, life-stage mapping, and objection handling for the senior customer segment. Post-programme performance data confirms a significant uplift in both activity metrics and conversion.',
    achievements: [
      'Average branch conversion rate increased from 29% to 43% across 12 participating branches.',
      'New business premium income from endowment products grew by LKR 18.4M in the 8 weeks following training.',
      'Net Promoter Score for bancassurance interactions rose from 61 to 76 within the period.',
    ],
    recommendations: [
      'Commission a 90-day coaching follow-up module targeting the senior customer segment.',
      'Develop a branch-level KPI dashboard integrating post-training performance metrics.',
      'Extend the programme to the Corporate Bancassurance team in Q3.',
    ],
    trainingCost: 1850000,
    estimatedBenefit: 18400000,
    paybackMonths: 1,
    confidenceLevel: 'High',
  },
  {
    id: 'P-002',
    name: 'Claims Processing SOP – Regulatory Update',
    department: 'Claims',
    deliveryDate: '2025-12-10',
    learnerCount: 22,
    satisfactionScore: 84,
    knowledgeGain: 41,
    behaviourTransferRate: 85,
    businessImpactRating: 4,
    summary: 'A compliance-driven capability update aligned to the revised IRCSL motor claims circular. The programme addressed documentation standards, escalation protocols, and the new third-party injury assessment framework. Measurable reductions in documentation errors and regulatory queries have been observed post-training.',
    achievements: [
      'Claims documentation error rate dropped from 11.4% to 3.2% within six weeks.',
      'Average claim settlement cycle time reduced by 2.1 days through better first-submission accuracy.',
      'Zero regulatory queries from IRCSL on motor claims in the two months following training.',
    ],
    recommendations: [
      'Develop a microlearning refresher for new joiners covering the IRCSL marine claims chapter.',
      'Embed the updated SOP checklist into the claims management system as a guided workflow.',
    ],
    trainingCost: 920000,
    estimatedBenefit: 5800000,
    paybackMonths: 2,
    confidenceLevel: 'High',
  },
  {
    id: 'P-003',
    name: 'AML/CFT Compliance Certification',
    department: 'Legal & Compliance',
    deliveryDate: '2026-01-20',
    learnerCount: 15,
    satisfactionScore: 88,
    knowledgeGain: 38,
    behaviourTransferRate: 80,
    businessImpactRating: 4,
    summary: 'A formal certification programme aligned to FATF recommendations and the revised FIAU guidelines effective January 2026. Participants completed CDD, PEP screening, and transaction monitoring modules with a proctored assessment. The programme has demonstrably strengthened the first line of defence across compliance-sensitive business units.',
    achievements: [
      'Departmental escalation log compliance reached 100% for the first time in four quarters.',
      'Two previously unreported suspicious transactions identified during retrospective review by trained staff.',
      'Internal audit finding on CDD documentation closed without recurrence in the Q1 review.',
    ],
    recommendations: [
      'Introduce an annual recertification pathway with scenario-based assessment.',
      'Extend PEP screening module to branch operations managers handling corporate accounts.',
    ],
    trainingCost: 680000,
    estimatedBenefit: 3200000,
    paybackMonths: 3,
    confidenceLevel: 'Medium',
  },
  {
    id: 'P-004',
    name: 'IFRS 17 Implementation for Finance Teams',
    department: 'Finance',
    deliveryDate: '2025-11-05',
    learnerCount: 11,
    satisfactionScore: 79,
    knowledgeGain: 44,
    behaviourTransferRate: 72,
    businessImpactRating: 5,
    summary: 'A deep-dive technical programme preparing the finance and actuarial reporting teams for full IFRS 17 live operations. Modules covered the Variable Fee Approach, CSM roll-forward mechanics, reinsurance contract modifications, and disclosure requirements. The programme directly contributed to a clean Q1 statutory filing.',
    achievements: [
      'Q1 IFRS 17 statutory accounts filed without actuary-raised queries for the first time since adoption.',
      'CSM roll-forward model rebuilt in-house, reducing external advisory spend by LKR 4.2M.',
      'CFO audit committee presentation rated highest in four quarters by board members.',
    ],
    recommendations: [
      'Commission a reinsurance-specific IFRS 17 module to address identified knowledge gap.',
      'Create an internal IFRS 17 knowledge base with annotated worked examples for junior staff.',
    ],
    trainingCost: 1420000,
    estimatedBenefit: 7600000,
    paybackMonths: 3,
    confidenceLevel: 'High',
  },
  {
    id: 'P-005',
    name: 'Leadership Development – Mid-Level Managers',
    department: 'HR & Talent',
    deliveryDate: '2026-03-01',
    learnerCount: 24,
    satisfactionScore: 91,
    knowledgeGain: 29,
    behaviourTransferRate: 61,
    businessImpactRating: 3,
    summary: 'A blended leadership development programme targeting 24 mid-level managers across six departments. Modules addressed coaching conversations, performance management, change leadership, and cross-functional collaboration. Transfer data is still maturing at the 30-day mark and a full impact assessment is planned at 90 days.',
    achievements: [
      'Staff engagement pulse scores across participant teams improved by an average of 8 points.',
      'Time-to-fill for internal promotions reduced by 18% as managers proactively developed successors.',
      'Two participants have already been shortlisted for Senior Manager roles in Q3.',
    ],
    recommendations: [
      'Conduct 90-day transfer check-ins and consolidate manager observations before final ROI assessment.',
      'Introduce peer coaching circles to sustain behavioural change beyond the formal programme.',
      'Develop a bespoke module on leading hybrid teams for the IT and Operations cohort.',
    ],
    trainingCost: 2650000,
    estimatedBenefit: 4100000,
    paybackMonths: 8,
    confidenceLevel: 'Low',
  },
  {
    id: 'P-006',
    name: 'Underwriting Fundamentals – Property & Casualty',
    department: 'Underwriting',
    deliveryDate: '2025-10-15',
    learnerCount: 16,
    satisfactionScore: 86,
    knowledgeGain: 37,
    behaviourTransferRate: 74,
    businessImpactRating: 4,
    summary: 'A structured technical programme for the P&C underwriting team covering risk assessment methodologies, pricing model inputs, and portfolio exposure management. The programme was designed in partnership with a Sri Lanka Insurance Institute master trainer and included case studies drawn from the HNB Assurance book of business.',
    achievements: [
      'Loss ratio on newly underwritten P&C policies improved by 3.8 percentage points year-on-year.',
      'Decline rate on non-standard risks increased appropriately from 6% to 9.4%, reflecting better risk selection.',
      'Reinsurance treaty compliance audit passed with zero findings for the first time.',
    ],
    recommendations: [
      'Extend the programme to include a marine and engineering risk module for the commercial team.',
      'Introduce quarterly portfolio review workshops to keep underwriting decisions calibrated to market data.',
    ],
    trainingCost: 1100000,
    estimatedBenefit: 6900000,
    paybackMonths: 2,
    confidenceLevel: 'High',
  },
  {
    id: 'P-007',
    name: 'Digital Onboarding & CX Excellence',
    department: 'Customer Experience',
    deliveryDate: '2025-12-20',
    learnerCount: 31,
    satisfactionScore: 88,
    knowledgeGain: 31,
    behaviourTransferRate: 69,
    businessImpactRating: 4,
    summary: 'A customer experience programme equipping front-line and mid-office staff with digital journey mapping skills and CX frameworks aligned to the HNB Assurance 2026 Digital Ambition. Participants redesigned four high-volume customer touchpoints as part of the capstone activity.',
    achievements: [
      'Customer onboarding satisfaction score improved from 64% to 79% post-implementation.',
      'Digital policy servicing uptake increased from 31% to 52% within three months.',
      'Average handling time for policy changes reduced by 4.2 minutes per interaction.',
    ],
    recommendations: [
      'Scale the digital journey mapping methodology to the claims and renewal teams.',
      'Link CX excellence metrics to the performance management KPI framework introduced in Q1.',
    ],
    trainingCost: 1380000,
    estimatedBenefit: 5200000,
    paybackMonths: 4,
    confidenceLevel: 'Medium',
  },
];

function formatLKR(n: number) {
  if (n >= 1000000) return `LKR ${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `LKR ${(n / 1000).toFixed(0)}K`;
  return `LKR ${n.toLocaleString()}`;
}

function calcROI(cost: number, benefit: number) {
  return Math.round(((benefit - cost) / cost) * 100);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function HorizontalBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(10,22,40,0.08)' }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5" style={{ fill: i < rating ? '#C9A227' : 'transparent', color: i < rating ? '#C9A227' : 'rgba(10,22,40,0.15)' }} />
      ))}
    </div>
  );
}

function ConfidenceBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const map = {
    High: { bg: 'rgba(5,150,105,0.09)', text: '#047857', dot: '#10B981' },
    Medium: { bg: 'rgba(245,158,11,0.09)', text: '#92400E', dot: '#F59E0B' },
    Low: { bg: 'rgba(239,68,68,0.09)', text: '#B91C1C', dot: '#EF4444' },
  };
  const s = map[level];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {level}
    </span>
  );
}

function KpiCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-start gap-4" style={{ backgroundColor: '#0A1628' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,162,39,0.15)' }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: '#C9A227', fontFamily: 'Georgia, serif' }}>{value}</div>
        <div className="text-xs font-semibold mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}>{label}</div>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>{sub}</div>}
      </div>
    </div>
  );
}

function ProgrammeCard({ p }: { p: ProgrammeImpact }) {
  const [open, setOpen] = useState(false);
  const roi = calcROI(p.trainingCost, p.estimatedBenefit);

  const metrics = [
    { label: 'Satisfaction', value: p.satisfactionScore, display: `${p.satisfactionScore}%`, max: 100, color: '#3B82F6' },
    { label: 'Knowledge Gain', value: p.knowledgeGain, display: `+${p.knowledgeGain}%`, max: 60, color: '#10B981' },
    { label: 'Behaviour Transfer', value: p.behaviourTransferRate, display: `${p.behaviourTransferRate}%`, max: 100, color: '#C9A227' },
  ];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.09)', backgroundColor: 'white' }}>
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold leading-snug mb-1" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{p.name}</h3>
            <div className="flex items-center gap-2 flex-wrap text-[11px]" style={{ color: 'rgba(10,22,40,0.45)' }}>
              <span>{p.department}</span>
              <span style={{ color: 'rgba(10,22,40,0.2)' }}>·</span>
              <span>{formatDate(p.deliveryDate)}</span>
              <span style={{ color: 'rgba(10,22,40,0.2)' }}>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {p.learnerCount} learners
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold" style={{ color: roi >= 0 ? '#10B981' : '#EF4444', fontFamily: 'Georgia, serif' }}>
              {roi >= 0 ? '+' : ''}{roi}%
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(10,22,40,0.4)' }}>ROI</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium" style={{ color: 'rgba(10,22,40,0.45)' }}>{m.label}</span>
                <span className="text-[11px] font-bold" style={{ color: '#0A1628' }}>{m.display}</span>
              </div>
              <HorizontalBar value={m.value} max={m.max} color={m.color} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium" style={{ color: 'rgba(10,22,40,0.45)' }}>Business Impact</span>
            <StarRow rating={p.businessImpactRating} />
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: '#C9A227', color: '#A07D18', backgroundColor: 'rgba(201,162,39,0.06)' }}
          >
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {open ? 'Close Report' : 'View Full Report'}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: '#F7F5F0' }}>
          <div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)', fontFamily: 'Inter, sans-serif' }}>{p.summary}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
              <span className="text-xs font-semibold" style={{ color: '#0A1628' }}>Key Achievements</span>
            </div>
            <ul className="space-y-1.5">
              {p.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)', fontFamily: 'Inter, sans-serif' }}>
                  <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#C9A227' }} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5" style={{ color: '#C9A227' }} />
              <span className="text-xs font-semibold" style={{ color: '#0A1628' }}>Recommendations for Next Cycle</span>
            </div>
            <ul className="space-y-1.5">
              {p.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)', fontFamily: 'Inter, sans-serif' }}>
                  <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#3B82F6' }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

type SortKey = 'name' | 'trainingCost' | 'estimatedBenefit' | 'roi' | 'paybackMonths';
type SortDir = 'asc' | 'desc';
type ROIFilter = 'all' | 'positive' | 'over100';

function ROITable() {
  const [sortKey, setSortKey] = useState<SortKey>('roi');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterDept, setFilterDept] = useState('');
  const [filterROI, setFilterROI] = useState<ROIFilter>('all');

  const departments = [...new Set(PROGRAMMES.map((p) => p.department))].sort();

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" style={{ color: '#C9A227' }} /> : <ArrowDown className="w-3 h-3" style={{ color: '#C9A227' }} />;
  }

  const rows = useMemo(() => {
    let data = PROGRAMMES.map((p) => ({ ...p, roi: calcROI(p.trainingCost, p.estimatedBenefit) }));
    if (filterDept) data = data.filter((p) => p.department === filterDept);
    if (filterROI === 'positive') data = data.filter((p) => p.roi > 0);
    if (filterROI === 'over100') data = data.filter((p) => p.roi > 100);
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return data;
  }, [filterDept, filterROI, sortKey, sortDir]);

  const totals = useMemo(() => ({
    cost: rows.reduce((s, r) => s + r.trainingCost, 0),
    benefit: rows.reduce((s, r) => s + r.estimatedBenefit, 0),
  }), [rows]);
  const totalROI = calcROI(totals.cost, totals.benefit);

  const colTh = (label: string, key: SortKey) => (
    <th
      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hover:opacity-70 transition-opacity"
      style={{ color: 'rgba(10,22,40,0.45)', backgroundColor: '#F7F5F0', borderBottom: '1px solid rgba(10,22,40,0.07)', whiteSpace: 'nowrap' }}
      onClick={() => handleSort(key)}
    >
      <span className="flex items-center gap-1">{label} <SortIcon col={key} /></span>
    </th>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <SlidersHorizontal className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-white text-xs outline-none"
          style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filterROI}
          onChange={(e) => setFilterROI(e.target.value as ROIFilter)}
          className="px-3 py-2 rounded-xl border bg-white text-xs outline-none"
          style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
        >
          <option value="all">All ROI</option>
          <option value="positive">Positive ROI Only</option>
          <option value="over100">ROI &gt; 100%</option>
        </select>
        {(filterDept || filterROI !== 'all') && (
          <button
            onClick={() => { setFilterDept(''); setFilterROI('all'); }}
            className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(10,22,40,0.4)' }}
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr>
                {colTh('Programme', 'name')}
                {colTh('Training Cost', 'trainingCost')}
                {colTh('Est. Benefit', 'estimatedBenefit')}
                {colTh('ROI %', 'roi')}
                {colTh('Payback', 'paybackMonths')}
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.45)', backgroundColor: '#F7F5F0', borderBottom: '1px solid rgba(10,22,40,0.07)', whiteSpace: 'nowrap' }}>
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b hover:bg-[#FAFAF8] transition-colors" style={{ borderColor: 'rgba(10,22,40,0.05)' }}>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-xs leading-snug" style={{ color: '#0A1628', fontFamily: 'Georgia, serif', maxWidth: '220px' }}>{r.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'rgba(10,22,40,0.4)' }}>{r.department}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-medium" style={{ color: 'rgba(10,22,40,0.65)' }}>{formatLKR(r.trainingCost)}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-semibold" style={{ color: '#047857' }}>{formatLKR(r.estimatedBenefit)}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-bold" style={{ color: r.roi >= 100 ? '#047857' : r.roi >= 0 ? '#0A1628' : '#B91C1C', fontFamily: 'Georgia, serif' }}>
                      {r.roi >= 0 ? '+' : ''}{r.roi}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>{r.paybackMonths} {r.paybackMonths === 1 ? 'month' : 'months'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <ConfidenceBadge level={r.confidenceLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: '#0A1628' }}>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Totals — {rows.length} Programmes</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{formatLKR(totals.cost)}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-bold" style={{ color: '#C9A227' }}>{formatLKR(totals.benefit)}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-bold" style={{ color: '#C9A227', fontFamily: 'Georgia, serif' }}>+{totalROI}%</span>
                  </td>
                  <td className="px-4 py-3.5" colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {rows.length === 0 && (
          <div className="py-14 text-center">
            <Target className="w-7 h-7 mx-auto mb-2" style={{ color: 'rgba(10,22,40,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>No programmes match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImpactReports() {
  const totalProgrammes = PROGRAMMES.length;
  const avgSatisfaction = Math.round(PROGRAMMES.reduce((s, p) => s + p.satisfactionScore, 0) / totalProgrammes);
  const avgKnowledgeGain = Math.round(PROGRAMMES.reduce((s, p) => s + p.knowledgeGain, 0) / totalProgrammes);
  const totalCost = PROGRAMMES.reduce((s, p) => s + p.trainingCost, 0);
  const totalBenefit = PROGRAMMES.reduce((s, p) => s + p.estimatedBenefit, 0);
  const portfolioROI = calcROI(totalCost, totalBenefit);

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="rounded-2xl px-6 py-5" style={{ backgroundColor: '#0A1628' }}>
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>Impact Reports</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>6Ds Framework — D6: Document Results and Demonstrate Value</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: 'rgba(201,162,39,0.12)', color: '#C9A227' }}>
            <BarChart2 className="w-4 h-4" />
            <span className="text-xs font-semibold">FY 2025–2026</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Programmes Evaluated"
          value={String(totalProgrammes)}
          sub="Current financial year"
          icon={<Award className="w-5 h-5" style={{ color: '#C9A227' }} />}
        />
        <KpiCard
          label="Avg. Learner Satisfaction"
          value={`${avgSatisfaction}%`}
          sub="Post-programme survey"
          icon={<Users className="w-5 h-5" style={{ color: '#C9A227' }} />}
        />
        <KpiCard
          label="Avg. Knowledge Gain"
          value={`+${avgKnowledgeGain}%`}
          sub="Pre vs. post assessment"
          icon={<TrendingUp className="w-5 h-5" style={{ color: '#C9A227' }} />}
        />
        <KpiCard
          label="Portfolio ROI"
          value={`+${portfolioROI}%`}
          sub="Across all programmes"
          icon={<BarChart2 className="w-5 h-5" style={{ color: '#C9A227' }} />}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Programme Impact</h2>
          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{totalProgrammes} evaluated programmes</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROGRAMMES.map((p) => <ProgrammeCard key={p.id} p={p} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>ROI Summary</h2>
          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>Sortable · Click column headers</span>
        </div>
        <ROITable />
      </div>
    </div>
  );
}
