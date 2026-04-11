import { Calendar, Plus, MessageSquare, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SAMPLE_REQUESTS = [
  { id: 'REQ-0041', summary: 'Sales objection handling for corporate segment renewals', status: 'in_review', stage: 2 },
  { id: 'REQ-0038', summary: 'Onboarding programme for new direct sales recruits', status: 'approved', stage: 4 },
  { id: 'REQ-0031', summary: 'Cross-sell techniques for bancassurance partners', status: 'completed', stage: 6 },
];

const SAMPLE_PROGRAMMES = [
  { date: 'Apr 18, 2026', day: 'Fri', title: 'Consultative Selling Masterclass', type: 'Workshop', typeColor: 'bg-blue-50 text-blue-700' },
  { date: 'May 6, 2026', day: 'Wed', title: 'Digital Tools for Field Sales', type: 'e-Learning', typeColor: 'bg-emerald-50 text-emerald-700' },
];

const STAGES = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  in_review: { label: 'In Review', bg: 'bg-amber-50', text: 'text-amber-700' },
  approved: { label: 'Approved', bg: 'bg-blue-50', text: 'text-blue-700' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending: { label: 'Pending', bg: 'bg-gray-100', text: 'text-gray-600' },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function PipelineDots({ activeStage }: { activeStage: number }) {
  return (
    <div className="flex items-center gap-1 mt-3">
      {STAGES.map((stage, i) => {
        const filled = i < activeStage;
        const active = i === activeStage - 1;
        return (
          <div key={stage} className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors"
              style={active ? { backgroundColor: '#C9A227', color: '#0A1628' } : filled ? { backgroundColor: '#0A1628', color: '#ffffff' } : { backgroundColor: '#E5E1D8', color: '#9CA3AF' }}>
              {filled && !active ? <CheckCircle2 className="w-3 h-3" /> : stage}
            </div>
            {i < STAGES.length - 1 && (
              <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: i < activeStage - 1 ? '#0A1628' : '#E5E1D8' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SalesDashboard() {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0A1628' }}>{getGreeting()}, {firstName}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.5)' }}>{formatDate()}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full self-start sm:self-auto"
          style={{ backgroundColor: 'rgba(201,162,39,0.12)', color: '#C9A227' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          HNB Assurance PLC
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Active Requests', value: '3', sub: '2 awaiting review' },
          { label: 'Upcoming Programmes', value: '2', sub: 'Next: Apr 18' },
          { label: 'Team Members Profiled', value: '8', sub: 'of 12 in my team' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'rgba(10,22,40,0.4)' }}>{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: '#0A1628' }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(10,22,40,0.45)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: '#0A1628' }}>My Recent Requests</h2>
              <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: '#C9A227' }}>
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {SAMPLE_REQUESTS.map((req) => {
                const status = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
                return (
                  <div key={req.id} className="bg-white rounded-xl p-5 border hover:shadow-sm cursor-pointer" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-medium" style={{ color: '#C9A227' }}>{req.id}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
                        </div>
                        <p className="text-sm leading-snug" style={{ color: '#0A1628' }}>{req.summary}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(10,22,40,0.25)' }} />
                    </div>
                    <PipelineDots activeStage={req.stage} />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#0A1628' }}>Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#C9A227', color: '#0A1628' }}>
                <Plus className="w-4 h-4" />Request a Programme
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.15)' }}>
                <MessageSquare className="w-4 h-4" />Talk to Learning AI
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.15)' }}>
                <Calendar className="w-4 h-4" />View Calendar
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#0A1628' }}>Upcoming Programmes</h2>
            <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: '#C9A227' }}>
              All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {SAMPLE_PROGRAMMES.map((prog) => (
              <div key={prog.title} className="bg-white rounded-xl p-4 border hover:shadow-sm cursor-pointer" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}>
                    <span className="text-[10px] font-medium uppercase" style={{ color: 'rgba(10,22,40,0.45)' }}>{prog.day}</span>
                    <span className="text-base font-bold leading-none" style={{ color: '#0A1628' }}>{prog.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug mb-1.5" style={{ color: '#0A1628' }}>{prog.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${prog.typeColor}`}>{prog.type}</span>
                      <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{prog.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-xl p-4 border border-dashed flex items-center justify-center gap-2 cursor-pointer" style={{ borderColor: 'rgba(10,22,40,0.15)', color: 'rgba(10,22,40,0.4)' }}>
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Open full calendar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
