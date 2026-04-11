import { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  X,
  BarChart2,
  AlertCircle,
} from 'lucide-react';

const STAGES = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] as const;
type Stage = typeof STAGES[number];

const STAGE_COLORS: Record<Stage, { bg: string; text: string }> = {
  D1: { bg: 'rgba(29,78,216,0.1)', text: '#1D4ED8' },
  D2: { bg: 'rgba(6,95,70,0.1)', text: '#065F46' },
  D3: { bg: 'rgba(201,162,39,0.13)', text: '#92710F' },
  D4: { bg: 'rgba(124,58,237,0.1)', text: '#6D28D9' },
  D5: { bg: 'rgba(220,38,38,0.08)', text: '#B91C1C' },
  D6: { bg: 'rgba(10,22,40,0.08)', text: '#0A1628' },
};

interface Member {
  id: number;
  name: string;
  role: string;
  programme: string;
  stage: Stage;
  lastActivity: string;
  completionRate: number;
  trainingHours: number;
}

interface PendingRequest {
  id: number;
  memberId: number;
  member: string;
  programme: string;
  submittedDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const MEMBERS: Member[] = [
  { id: 1, name: 'Dilshan Perera', role: 'Branch Executive', programme: 'Product Knowledge Bootcamp', stage: 'D3', lastActivity: '2 hours ago', completionRate: 72, trainingHours: 18 },
  { id: 2, name: 'Nimasha Fernando', role: 'Senior BDE', programme: 'Advanced Sales Techniques', stage: 'D5', lastActivity: 'Yesterday', completionRate: 91, trainingHours: 24 },
  { id: 3, name: 'Kasun Jayawardena', role: 'BDE', programme: 'Compliance & Ethics 2025', stage: 'D1', lastActivity: '3 days ago', completionRate: 38, trainingHours: 8 },
  { id: 4, name: 'Thilini Wickramasinghe', role: 'Branch Manager', programme: 'Leadership Essentials', stage: 'D4', lastActivity: 'Today', completionRate: 85, trainingHours: 31 },
  { id: 5, name: 'Ruwan Silva', role: 'BDE', programme: 'Digital Tools for Sales', stage: 'D2', lastActivity: '1 week ago', completionRate: 55, trainingHours: 12 },
  { id: 6, name: 'Sandali Rathnayake', role: 'Senior BDE', programme: 'Customer Experience Mastery', stage: 'D6', lastActivity: 'Today', completionRate: 100, trainingHours: 28 },
];

const PENDING: PendingRequest[] = [
  { id: 1, memberId: 3, member: 'Kasun Jayawardena', programme: 'Advanced Underwriting Concepts', submittedDate: '08 Apr 2026', priority: 'High' },
  { id: 2, memberId: 5, member: 'Ruwan Silva', programme: 'NLP for Sales Professionals', submittedDate: '09 Apr 2026', priority: 'Medium' },
  { id: 3, memberId: 1, member: 'Dilshan Perera', programme: 'Coaching & Mentoring Skills', submittedDate: '10 Apr 2026', priority: 'Low' },
];

const PRIORITY_STYLE: Record<string, { bg: string; text: string }> = {
  High: { bg: 'rgba(220,38,38,0.08)', text: '#B91C1C' },
  Medium: { bg: 'rgba(201,162,39,0.12)', text: '#92710F' },
  Low: { bg: 'rgba(6,95,70,0.1)', text: '#065F46' },
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.4)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  const { bg, text } = STAGE_COLORS[stage];
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: bg, color: text }}>
      {stage}
    </span>
  );
}

function ProgressBar({ value, color = '#C9A227' }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(10,22,40,0.07)' }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: value === 100 ? '#065F46' : color }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color: value === 100 ? '#065F46' : 'rgba(10,22,40,0.6)' }}>
        {value}%
      </span>
    </div>
  );
}

export default function TeamView() {
  const [sortField, setSortField] = useState<'name' | 'completionRate' | 'stage'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [pendingList, setPendingList] = useState(PENDING);
  const [dismissed, setDismissed] = useState<number[]>([]);

  const activeLearners = MEMBERS.filter((m) => m.completionRate < 100 && m.completionRate > 0).length;
  const completedThisMonth = MEMBERS.filter((m) => m.completionRate === 100).length;
  const avgCompletion = Math.round(MEMBERS.reduce((acc, m) => acc + m.completionRate, 0) / MEMBERS.length);

  const sorted = [...MEMBERS].sort((a, b) => {
    const mul = sortAsc ? 1 : -1;
    if (sortField === 'name') return mul * a.name.localeCompare(b.name);
    if (sortField === 'completionRate') return mul * (a.completionRate - b.completionRate);
    if (sortField === 'stage') return mul * STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
    return 0;
  });

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(true); }
  }

  function SortIcon({ field }: { field: typeof sortField }) {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortAsc ? <ChevronUp className="w-3 h-3" style={{ color: '#C9A227' }} /> : <ChevronDown className="w-3 h-3" style={{ color: '#C9A227' }} />;
  }

  const maxHours = Math.max(...MEMBERS.map((m) => m.trainingHours));

  function handleApprove(id: number) {
    setPendingList((prev) => prev.filter((p) => p.id !== id));
    setDismissed((prev) => [...prev, id]);
  }
  function handleDecline(id: number) {
    setPendingList((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 pt-2">

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4" style={{ color: '#C9A227' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(10,22,40,0.4)' }}>Manager View</p>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>My Team</h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.5)' }}>
                Bancassurance Retail &mdash; {MEMBERS.length} members
              </p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(201,162,39,0.12)', color: '#92710F' }}
            >
              Bancassurance Retail
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard icon={TrendingUp} label="Active Learners" value={activeLearners} sub="Currently enrolled" color="#1D4ED8" />
          <StatCard icon={CheckCircle} label="Completed This Month" value={completedThisMonth} sub="Programmes finished" color="#065F46" />
          <StatCard icon={Clock} label="Pending Requests" value={pendingList.length} sub="Awaiting sign-off" color="#C9A227" />
          <StatCard icon={BarChart2} label="Avg Completion Rate" value={`${avgCompletion}%`} sub="Across all members" color="#0A1628" />
        </div>

        <div className="bg-white rounded-2xl border mb-6 overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
            <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Team Members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'rgba(247,245,240,0.8)' }}>
                  {[
                    { label: 'Name', field: 'name' as const },
                    { label: 'Role', field: null },
                    { label: 'Current Programme', field: null },
                    { label: 'Stage', field: 'stage' as const },
                    { label: 'Last Activity', field: null },
                    { label: 'Completion', field: 'completionRate' as const },
                    { label: 'Actions', field: null },
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      className={`px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${field ? 'cursor-pointer select-none' : ''}`}
                      style={{ color: 'rgba(10,22,40,0.4)' }}
                      onClick={() => field && toggleSort(field)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((m, i) => (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-amber-50/30"
                    style={{ borderTop: i > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: 'rgba(10,22,40,0.07)', color: '#0A1628' }}
                        >
                          {m.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-semibold" style={{ color: '#0A1628' }}>{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: 'rgba(10,22,40,0.55)' }}>{m.role}</td>
                    <td className="px-5 py-3.5 max-w-[180px]">
                      <p className="truncate text-xs font-medium" style={{ color: '#0A1628' }}>{m.programme}</p>
                    </td>
                    <td className="px-5 py-3.5"><StageBadge stage={m.stage} /></td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'rgba(10,22,40,0.45)' }}>{m.lastActivity}</td>
                    <td className="px-5 py-3.5 min-w-[140px]"><ProgressBar value={m.completionRate} /></td>
                    <td className="px-5 py-3.5">
                      <button
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Training Hours by Member
            </h2>
            <div className="space-y-3">
              {[...MEMBERS].sort((a, b) => b.trainingHours - a.trainingHours).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-semibold truncate" style={{ color: '#0A1628' }}>
                    {m.name.split(' ')[0]}
                  </div>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}>
                    <div
                      className="h-full rounded-lg flex items-center px-2.5 transition-all"
                      style={{
                        width: `${(m.trainingHours / maxHours) * 100}%`,
                        backgroundColor: m.trainingHours === maxHours ? '#C9A227' : 'rgba(10,22,40,0.12)',
                        minWidth: '2rem',
                      }}
                    >
                      <span className="text-[11px] font-bold" style={{ color: m.trainingHours === maxHours ? '#0A1628' : 'rgba(10,22,40,0.55)' }}>
                        {m.trainingHours}h
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-4" style={{ color: 'rgba(10,22,40,0.3)' }}>
              Total: {MEMBERS.reduce((s, m) => s + m.trainingHours, 0)} training hours this quarter
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
                Pending Approvals
              </h2>
              {pendingList.length > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(201,162,39,0.12)', color: '#92710F' }}
                >
                  {pendingList.length} pending
                </span>
              )}
            </div>

            {pendingList.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="w-8 h-8 mb-2" style={{ color: 'rgba(6,95,70,0.4)' }} />
                <p className="text-sm font-semibold" style={{ color: 'rgba(10,22,40,0.4)' }}>All caught up!</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.3)' }}>No pending approvals at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingList.map((req) => {
                  const ps = PRIORITY_STYLE[req.priority];
                  return (
                    <div
                      key={req.id}
                      className="rounded-xl border p-3.5 flex flex-col gap-2"
                      style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: 'rgba(247,245,240,0.5)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#0A1628' }}>{req.member}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.5)' }}>{req.programme}</p>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: ps.bg, color: ps.text }}>
                          {req.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px]" style={{ color: 'rgba(10,22,40,0.35)' }}>Submitted {req.submittedDate}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecline(req.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                            style={{ backgroundColor: 'rgba(220,38,38,0.07)', color: '#B91C1C' }}
                          >
                            <X className="w-3 h-3" /> Decline
                          </button>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                            style={{ backgroundColor: 'rgba(6,95,70,0.1)', color: '#065F46' }}
                          >
                            <ThumbsUp className="w-3 h-3" /> Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
