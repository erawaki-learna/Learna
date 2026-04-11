import { useState } from 'react';
import {
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  Inbox,
  Star,
  ChevronUp,
  ChevronDown,
  BarChart2,
} from 'lucide-react';

type DateRange = 'This Month' | 'This Quarter' | 'This Year';

const RANGE_OPTIONS: DateRange[] = ['This Month', 'This Quarter', 'This Year'];

const KPI_DATA: Record<DateRange, {
  learners: number;
  hours: number;
  completion: number;
  programmes: number;
  requests: number;
  nps: number;
}> = {
  'This Month': { learners: 142, hours: 418, completion: 74, programmes: 6, requests: 87, nps: 68 },
  'This Quarter': { learners: 389, hours: 1247, completion: 71, programmes: 18, requests: 241, nps: 71 },
  'This Year': { learners: 761, hours: 4830, completion: 69, programmes: 47, requests: 892, nps: 73 },
};

const DIVISIONS = [
  { name: 'Bancassurance Retail', completion: 81 },
  { name: 'Direct Sales', completion: 73 },
  { name: 'Corporate Bancassurance', completion: 68 },
  { name: 'Agency', completion: 62 },
  { name: 'Underwriting', completion: 77 },
  { name: 'Claims', completion: 70 },
  { name: 'HR & Talent', completion: 88 },
  { name: 'Finance & Actuarial', completion: 65 },
];

const MONTHLY_TREND = [
  { month: 'Nov', submitted: 38, completed: 29 },
  { month: 'Dec', submitted: 45, completed: 31 },
  { month: 'Jan', submitted: 52, completed: 41 },
  { month: 'Feb', submitted: 61, completed: 48 },
  { month: 'Mar', submitted: 74, completed: 59 },
  { month: 'Apr', submitted: 87, completed: 68 },
];

interface TopProgramme {
  name: string;
  completions: number;
  satisfaction: number;
  knowledgeGain: number;
  transferRate: number;
}

const TOP_PROGRAMMES: TopProgramme[] = [
  { name: 'Advanced Sales Techniques', completions: 48, satisfaction: 4.6, knowledgeGain: 82, transferRate: 74 },
  { name: 'AML/CFT Foundation', completions: 201, satisfaction: 4.1, knowledgeGain: 76, transferRate: 69 },
  { name: 'Customer Experience Mastery', completions: 63, satisfaction: 4.8, knowledgeGain: 88, transferRate: 81 },
  { name: 'IRCSL Life Insurance Licence', completions: 34, satisfaction: 3.9, knowledgeGain: 71, transferRate: 65 },
  { name: 'Coaching & Mentoring', completions: 22, satisfaction: 4.7, knowledgeGain: 85, transferRate: 78 },
  { name: 'Digital Tools for Sales', completions: 57, satisfaction: 4.3, knowledgeGain: 79, transferRate: 72 },
];

type SortKey = keyof TopProgramme;

const SKILL_AREAS = ['Sales Skills', 'Compliance', 'Digital Literacy', 'Leadership', 'Product Knowledge', 'Customer Service'];

type GapLevel = 'Low' | 'Medium' | 'High';

const GAP_GRID: Record<string, GapLevel[]> = {
  'Bancassurance Retail': ['Low', 'Medium', 'Low', 'High', 'Low', 'Low'],
  'Direct Sales': ['Low', 'Medium', 'Medium', 'High', 'Medium', 'Low'],
  'Corporate Bancassurance': ['Medium', 'Low', 'Low', 'Medium', 'Low', 'Low'],
  'Agency': ['Medium', 'High', 'High', 'High', 'Medium', 'Medium'],
  'Underwriting': ['High', 'Low', 'Medium', 'Medium', 'Low', 'High'],
  'Claims': ['High', 'Low', 'Medium', 'Medium', 'Medium', 'Low'],
};

const GAP_STYLE: Record<GapLevel, { bg: string; text: string; label: string }> = {
  Low: { bg: 'rgba(6,95,70,0.1)', text: '#065F46', label: 'Low' },
  Medium: { bg: 'rgba(201,162,39,0.14)', text: '#92710F', label: 'Medium' },
  High: { bg: 'rgba(220,38,38,0.1)', text: '#B91C1C', label: 'High' },
};

function KpiCard({ icon: Icon, label, value, color, suffix = '' }: {
  icon: typeof Users;
  label: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
        {value.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

function DivisionBars() {
  const max = Math.max(...DIVISIONS.map((d) => d.completion));
  return (
    <div className="space-y-2.5">
      {DIVISIONS.sort((a, b) => b.completion - a.completion).map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <div className="w-44 text-xs font-medium truncate flex-shrink-0" style={{ color: '#0A1628' }}>{d.name}</div>
          <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}>
            <div
              className="h-full rounded-lg flex items-center px-3 transition-all"
              style={{
                width: `${(d.completion / max) * 100}%`,
                background: d.completion === max
                  ? 'linear-gradient(90deg, #C9A227, #E6BB3F)'
                  : d.completion >= 75
                  ? 'rgba(10,22,40,0.15)'
                  : 'rgba(10,22,40,0.09)',
                minWidth: '2.5rem',
              }}
            >
              <span className="text-xs font-bold" style={{ color: d.completion === max ? '#0A1628' : 'rgba(10,22,40,0.55)' }}>
                {d.completion}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendChart() {
  const maxVal = Math.max(...MONTHLY_TREND.flatMap((m) => [m.submitted, m.completed]));
  const W = 480;
  const H = 160;
  const PAD = { top: 16, bottom: 28, left: 24, right: 16 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = MONTHLY_TREND.length;

  function x(i: number) {
    return PAD.left + (i / (n - 1)) * chartW;
  }
  function y(val: number) {
    return PAD.top + chartH - (val / maxVal) * chartH;
  }

  function polyline(key: 'submitted' | 'completed') {
    return MONTHLY_TREND.map((m, i) => `${x(i)},${y(m[key])}`).join(' ');
  }

  function area(key: 'submitted' | 'completed') {
    const pts = MONTHLY_TREND.map((m, i) => `${x(i)},${y(m[key])}`).join(' ');
    const last = `${x(n - 1)},${PAD.top + chartH}`;
    const first = `${x(0)},${PAD.top + chartH}`;
    return `${x(0)},${y(MONTHLY_TREND[0][key])} ${pts} ${last} ${first}`;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: '300px' }}>
        <defs>
          <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#065F46" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + t * chartH}
            y2={PAD.top + t * chartH}
            stroke="rgba(10,22,40,0.06)"
            strokeWidth="1"
          />
        ))}

        <polygon points={area('submitted')} fill="url(#gradSubmitted)" />
        <polygon points={area('completed')} fill="url(#gradCompleted)" />

        <polyline points={polyline('submitted')} fill="none" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={polyline('completed')} fill="none" stroke="#065F46" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {MONTHLY_TREND.map((m, i) => (
          <g key={m.month}>
            <circle cx={x(i)} cy={y(m.submitted)} r="3.5" fill="#C9A227" />
            <circle cx={x(i)} cy={y(m.completed)} r="3.5" fill="#065F46" />
            <text
              x={x(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(10,22,40,0.35)"
              fontFamily="Inter, sans-serif"
            >
              {m.month}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex items-center gap-5 mt-1 px-1">
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(10,22,40,0.5)' }}>
          <span className="w-4 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#C9A227' }} />
          Requests Submitted
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(10,22,40,0.5)' }}>
          <span className="w-4 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#065F46' }} />
          Completed
        </span>
      </div>
    </div>
  );
}

function TopProgrammesTable() {
  const [sortKey, setSortKey] = useState<SortKey>('completions');
  const [sortAsc, setSortAsc] = useState(false);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortAsc((v) => !v);
    else { setSortKey(k); setSortAsc(false); }
  }

  const sorted = [...TOP_PROGRAMMES].sort((a, b) => {
    const mul = sortAsc ? 1 : -1;
    return mul * ((a[sortKey] as number) - (b[sortKey] as number));
  });

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown className="w-3 h-3 opacity-20" />;
    return sortAsc
      ? <ChevronUp className="w-3 h-3" style={{ color: '#C9A227' }} />
      : <ChevronDown className="w-3 h-3" style={{ color: '#C9A227' }} />;
  }

  function Stars({ val }: { val: number }) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold" style={{ color: '#0A1628' }}>{val.toFixed(1)}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: s <= Math.round(val) ? '#C9A227' : 'rgba(10,22,40,0.1)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  function PctBar({ val, color }: { val: number; color: string }) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(10,22,40,0.07)' }}>
          <div className="h-1.5 rounded-full" style={{ width: `${val}%`, backgroundColor: color }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: 'rgba(10,22,40,0.55)' }}>{val}%</span>
      </div>
    );
  }

  const cols: { label: string; key: SortKey; render: (p: TopProgramme) => React.ReactNode }[] = [
    { label: 'Programme', key: 'name', render: (p) => <span className="font-semibold text-xs" style={{ color: '#0A1628' }}>{p.name}</span> },
    { label: 'Completions', key: 'completions', render: (p) => <span className="text-xs font-bold" style={{ color: '#0A1628' }}>{p.completions}</span> },
    { label: 'Satisfaction', key: 'satisfaction', render: (p) => <Stars val={p.satisfaction} /> },
    { label: 'Knowledge Gain', key: 'knowledgeGain', render: (p) => <PctBar val={p.knowledgeGain} color="#1D4ED8" /> },
    { label: 'Transfer Rate', key: 'transferRate', render: (p) => <PctBar val={p.transferRate} color="#065F46" /> },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'rgba(247,245,240,0.8)' }}>
            {cols.map(({ label, key }) => (
              <th
                key={key}
                onClick={() => toggleSort(key)}
                className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
                style={{ color: 'rgba(10,22,40,0.4)' }}
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  <SortIcon k={key} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr
              key={p.name}
              className="transition-colors hover:bg-amber-50/25"
              style={{ borderTop: i > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none' }}
            >
              {cols.map(({ key, render }) => (
                <td key={key} className="px-5 py-3.5">{render(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SkillGapHeatmap() {
  const divisions = Object.keys(GAP_GRID);
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '560px' }}>
        <div className="grid mb-1" style={{ gridTemplateColumns: `160px repeat(${SKILL_AREAS.length}, 1fr)`, gap: '3px' }}>
          <div />
          {SKILL_AREAS.map((s) => (
            <div key={s} className="text-center text-[10px] font-bold uppercase tracking-wide px-1" style={{ color: 'rgba(10,22,40,0.4)' }}>
              {s}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {divisions.map((div) => (
            <div
              key={div}
              className="grid items-center"
              style={{ gridTemplateColumns: `160px repeat(${SKILL_AREAS.length}, 1fr)`, gap: '3px' }}
            >
              <div className="text-xs font-semibold pr-2 truncate" style={{ color: '#0A1628' }}>{div}</div>
              {GAP_GRID[div].map((level, idx) => {
                const gs = GAP_STYLE[level];
                return (
                  <div
                    key={idx}
                    className="rounded-lg flex items-center justify-center text-[10px] font-bold py-2.5 transition-all hover:opacity-80"
                    style={{ backgroundColor: gs.bg, color: gs.text }}
                  >
                    {level}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
          {(['Low', 'Medium', 'High'] as GapLevel[]).map((l) => {
            const gs = GAP_STYLE[l];
            return (
              <span key={l} className="inline-flex items-center gap-1.5 text-xs">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: gs.bg, border: `1px solid ${gs.text}30` }} />
                <span style={{ color: 'rgba(10,22,40,0.55)' }}>{l} Gap</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LearningAnalytics() {
  const [range, setRange] = useState<DateRange>('This Quarter');
  const kpi = KPI_DATA[range];

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 pt-2">

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4" style={{ color: '#C9A227' }} />
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(10,22,40,0.4)' }}>Executive View</p>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Learning Analytics</h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>HNB Assurance PLC — L&D Performance Intelligence</p>
            </div>
            <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(10,22,40,0.12)' }}>
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: range === r ? '#0A1628' : 'white',
                    color: range === r ? 'white' : 'rgba(10,22,40,0.5)',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <KpiCard icon={Users} label="Total Learners" value={kpi.learners} color="#1D4ED8" />
          <KpiCard icon={Clock} label="Training Hours Delivered" value={kpi.hours} color="#065F46" suffix="h" />
          <KpiCard icon={TrendingUp} label="Avg Completion Rate" value={kpi.completion} color="#C9A227" suffix="%" />
          <KpiCard icon={BookOpen} label="Programmes Launched" value={kpi.programmes} color="#0A1628" />
          <KpiCard icon={Inbox} label="Requests Processed" value={kpi.requests} color="#6D28D9" />
          <KpiCard icon={Star} label="NPS Score" value={kpi.nps} color="#065F46" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Learning by Division
            </h2>
            <DivisionBars />
          </div>

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <h2 className="text-base font-semibold mb-1" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Monthly Trend
            </h2>
            <p className="text-xs mb-4" style={{ color: 'rgba(10,22,40,0.4)' }}>Requests submitted vs completed — last 6 months</p>
            <TrendChart />
          </div>
        </div>

        <div className="bg-white rounded-2xl border mb-4 overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
            <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Top Performing Programmes
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Click column headers to sort</p>
          </div>
          <TopProgrammesTable />
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
            Skill Gap Heatmap
          </h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(10,22,40,0.4)' }}>Gap severity by division and skill area — based on assessment data</p>
          <SkillGapHeatmap />
        </div>

      </div>
    </div>
  );
}
