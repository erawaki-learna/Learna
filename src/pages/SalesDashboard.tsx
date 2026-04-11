import { useState } from 'react';
import {
  BookOpen,
  Clock,
  CalendarDays,
  FileText,
  Plus,
  Bot,
  Calendar,
  ChevronRight,
  Video,
  Users,
  Eye,
  TrendingUp,
  Award,
} from 'lucide-react';
import NotificationsDrawer from '../components/NotificationsDrawer';

const MOCK_USER = {
  name: 'Saman Perera',
  firstName: 'Saman',
  role: 'Bancassurance Retail Officer',
  branch: 'Colombo 07 — HNB Kollupitiya',
  division: 'Bancassurance Retail',
};

const STATS = [
  { label: 'Active Requests', value: '3', icon: FileText, delta: '+1 this month' },
  { label: 'Programmes Completed', value: '7', icon: Award, delta: '2 this quarter' },
  { label: 'Learning Hours This Month', value: '14.5', icon: Clock, delta: '↑ 3h vs last month' },
  { label: 'Next Session', value: '22 Apr', icon: CalendarDays, delta: 'Unit-Linked Workshop' },
];

type D6Stage = { id: string; label: string; fullLabel: string };
const D6_STAGES: D6Stage[] = [
  { id: 'D1', label: 'D1', fullLabel: 'Define Outcomes' },
  { id: 'D2', label: 'D2', fullLabel: 'Design Experience' },
  { id: 'D3', label: 'D3', fullLabel: 'Deliver Training' },
  { id: 'D4', label: 'D4', fullLabel: 'Drive Transfer' },
  { id: 'D5', label: 'D5', fullLabel: 'Deploy Support' },
  { id: 'D6', label: 'D6', fullLabel: 'Document Results' },
];
const CURRENT_STAGE_IDX = 2;

type Mode = 'In-Person' | 'Virtual';
interface Session {
  id: number;
  programme: string;
  date: string;
  time: string;
  mode: Mode;
  facilitator: string;
}
const UPCOMING_SESSIONS: Session[] = [
  { id: 1, programme: 'Unit-Linked Products Workshop', date: '22 Apr 2026', time: '09:00 – 17:00', mode: 'In-Person', facilitator: 'Nishantha Jayasinghe' },
  { id: 2, programme: 'LAER Objection Handling Practicum', date: '23 Apr 2026', time: '09:00 – 13:00', mode: 'In-Person', facilitator: 'Nishantha Jayasinghe' },
  { id: 3, programme: 'Regulatory Disclosure Obligations', date: '05 May 2026', time: '14:00 – 15:30', mode: 'Virtual', facilitator: 'Eranda Wakista' },
];

type ReqStatus = 'Under Review' | 'Approved' | 'Submitted' | 'Scheduled' | 'Completed';
interface RecentRequest {
  id: string;
  programme: string;
  submitted: string;
  status: ReqStatus;
}
const RECENT_REQUESTS: RecentRequest[] = [
  { id: 'REQ-2026-0047', programme: 'Sales Capability Development', submitted: '03 Apr 2026', status: 'Under Review' },
  { id: 'REQ-2026-0031', programme: 'Digital Banking Products Overview', submitted: '14 Mar 2026', status: 'Scheduled' },
  { id: 'REQ-2026-0019', programme: 'Compliance & AML Refresher', submitted: '20 Feb 2026', status: 'Completed' },
  { id: 'REQ-2026-0008', programme: 'HNB Premier Client Experience', submitted: '08 Jan 2026', status: 'Completed' },
];

const STATUS_STYLES: Record<ReqStatus, { bg: string; color: string }> = {
  Submitted: { bg: 'rgba(59,130,246,0.1)', color: '#1D4ED8' },
  'Under Review': { bg: 'rgba(245,158,11,0.1)', color: '#92400E' },
  Approved: { bg: 'rgba(16,185,129,0.1)', color: '#065F46' },
  Scheduled: { bg: 'rgba(99,102,241,0.1)', color: '#3730A3' },
  Completed: { bg: 'rgba(10,22,40,0.07)', color: 'rgba(10,22,40,0.5)' },
};

function StatusBadge({ status }: { status: ReqStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {status}
    </span>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{
        backgroundColor: mode === 'Virtual' ? 'rgba(59,130,246,0.08)' : 'rgba(16,185,129,0.08)',
        color: mode === 'Virtual' ? '#1D4ED8' : '#065F46',
      }}
    >
      {mode === 'Virtual' ? <Video className="w-3 h-3" /> : <Users className="w-3 h-3" />}
      {mode}
    </span>
  );
}

export default function SalesDashboard() {
  const [notifOpen, setNotifOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <NotificationsDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

      <div className="max-w-6xl mx-auto px-4 pt-2 pb-12">

        <div
          className="rounded-2xl px-7 py-6 mb-6 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg, #0A1628 0%, #152947 100%)' }}
        >
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: '#C9A227' }}>{greeting}</p>
            <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>
              {MOCK_USER.firstName} {MOCK_USER.name.split(' ')[1]}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {MOCK_USER.role} &middot; {MOCK_USER.branch}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{today}</p>
            <button
              onClick={() => setNotifOpen(true)}
              className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.25)' }}
            >
              Notifications
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#C9A227', color: '#0A1628' }}>3</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border p-5 flex flex-col gap-3"
                style={{ borderColor: 'rgba(10,22,40,0.09)' }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#C9A227' }} />
                  </div>
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: 'rgba(10,22,40,0.2)' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{s.value}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(10,22,40,0.5)' }}>{s.label}</p>
                  <p className="text-[11px] mt-1" style={{ color: '#C9A227' }}>{s.delta}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4" style={{ color: '#C9A227' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>My Learning Journey</h2>
          </div>
          <p className="text-xs mb-6" style={{ color: 'rgba(10,22,40,0.4)' }}>Current programme: Unit-Linked Products &amp; Sales Mastery</p>

          <div className="relative flex items-start justify-between">
            {D6_STAGES.map((stage, idx) => {
              const done = idx < CURRENT_STAGE_IDX;
              const current = idx === CURRENT_STAGE_IDX;
              const upcoming = idx > CURRENT_STAGE_IDX;
              return (
                <div key={stage.id} className="flex flex-col items-center flex-1 relative">
                  {idx > 0 && (
                    <div
                      className="absolute top-5 right-1/2 w-full h-0.5"
                      style={{ backgroundColor: done ? '#C9A227' : 'rgba(10,22,40,0.1)' }}
                    />
                  )}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-bold transition-all"
                    style={{
                      backgroundColor: current ? '#C9A227' : done ? '#0A1628' : 'rgba(10,22,40,0.06)',
                      color: current ? '#0A1628' : done ? '#C9A227' : 'rgba(10,22,40,0.3)',
                      border: current ? '2px solid #C9A227' : done ? 'none' : '2px solid rgba(10,22,40,0.1)',
                      boxShadow: current ? '0 0 0 4px rgba(201,162,39,0.2)' : 'none',
                    }}
                  >
                    {stage.label}
                  </div>
                  <span
                    className="text-[10px] font-semibold text-center leading-tight"
                    style={{
                      color: current ? '#0A1628' : done ? '#C9A227' : 'rgba(10,22,40,0.3)',
                      maxWidth: '64px',
                    }}
                  >
                    {stage.fullLabel}
                  </span>
                  {current && (
                    <span
                      className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#7A5B0A' }}
                    >
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" style={{ color: '#C9A227' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Upcoming Sessions</h2>
              </div>
              <button
                className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: '#C9A227' }}
              >
                View calendar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {UPCOMING_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: '#F7F5F0' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: '#0A1628' }}
                  >
                    <span className="text-[10px] font-semibold leading-none">{session.date.split(' ')[1]}</span>
                    <span className="text-base font-bold leading-tight">{session.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#0A1628' }}>{session.programme}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                      {session.time} &middot; {session.facilitator}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <ModeBadge mode={session.mode} />
                    </div>
                  </div>
                  <button
                    className="flex-shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: '#C9A227' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>My Recent Requests</h2>
              </div>
              <button
                className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: '#C9A227' }}
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.35)' }}>ID</th>
                    <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.35)' }}>Programme</th>
                    <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'rgba(10,22,40,0.35)' }}>Submitted</th>
                    <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.35)' }}>Status</th>
                    <th className="pb-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.35)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_REQUESTS.map((req, i) => (
                    <tr
                      key={req.id}
                      style={{ borderTop: i > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none' }}
                    >
                      <td className="py-2.5 pr-2">
                        <span className="text-xs font-mono font-semibold" style={{ color: 'rgba(10,22,40,0.5)' }}>{req.id}</span>
                      </td>
                      <td className="py-2.5 pr-2">
                        <span className="text-xs font-medium" style={{ color: '#0A1628' }}>{req.programme}</span>
                      </td>
                      <td className="py-2.5 pr-2 hidden sm:table-cell">
                        <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{req.submitted}</span>
                      </td>
                      <td className="py-2.5 pr-2">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all hover:opacity-70"
                          style={{ color: '#C9A227' }}
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
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Quick Actions</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              <Plus className="w-4 h-4" /> Request a Programme
            </button>
            <button
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#0A1628', color: '#C9A227' }}
            >
              <Bot className="w-4 h-4" /> Talk to AI Advisor
            </button>
            <button
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(10,22,40,0.15)', color: '#0A1628', backgroundColor: 'transparent' }}
            >
              <Calendar className="w-4 h-4" style={{ color: '#C9A227' }} /> View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
