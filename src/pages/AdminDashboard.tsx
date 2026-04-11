import { CheckCircle2, FileText, Inbox, Plus, Search, Users, Calendar, ChevronRight, ArrowRight } from 'lucide-react';

const STATS = [
  { label: 'Total Requests This Month', value: '24', delta: '+4 vs last month', positive: true },
  { label: 'Pending Review', value: '6', delta: '2 overdue', positive: false },
  { label: 'In Progress', value: '9', delta: 'Across 3 divisions', positive: true },
  { label: 'Completed', value: '7', delta: 'This month', positive: true },
];

const PIPELINE_STAGES = [
  { label: 'D1 Received', count: 6 },
  { label: 'Under Review', count: 4 },
  { label: 'Approved', count: 3 },
  { label: 'Scheduled', count: 5 },
  { label: 'In Progress', count: 4 },
  { label: 'Completed', count: 7 },
];

const DIVISIONS = [
  { name: 'Direct Sales', value: 9 },
  { name: 'Bancassurance', value: 6 },
  { name: 'Corporate', value: 5 },
  { name: 'Customer Service', value: 3 },
  { name: 'Agency', value: 7 },
];

const ACTIVITY = [
  { icon: 'approved', description: 'REQ-0041 approved by L&D Manager', time: '12 min ago', user: 'Eranda W.' },
  { icon: 'new', description: 'New request submitted — Bancassurance coaching module', time: '1 hr ago', user: 'Saman P.' },
  { icon: 'scheduled', description: 'Consultative Selling Masterclass scheduled for Apr 18', time: '3 hrs ago', user: 'L&D Team' },
  { icon: 'completed', description: 'REQ-0029 marked as completed', time: 'Yesterday', user: 'Nadeeka F.' },
  { icon: 'new', description: 'New request submitted — Onboarding for direct recruits', time: 'Yesterday', user: 'Dilhara M.' },
];

const UPCOMING = [
  { date: 'Apr 15', day: 'Tue', title: 'Objection Handling Workshop', division: 'Direct Sales', enrolled: 14, type: 'Workshop' },
  { date: 'Apr 18', day: 'Fri', title: 'Consultative Selling Masterclass', division: 'Corporate', enrolled: 9, type: 'Masterclass' },
];

const maxVal = Math.max(...DIVISIONS.map(d => d.value));

function ActivityIcon({ type }: { type: string }) {
  if (type === 'approved') return <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-50"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>;
  if (type === 'new') return <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-50"><Inbox className="w-4 h-4 text-blue-600" /></div>;
  if (type === 'scheduled') return <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}><Calendar className="w-4 h-4" style={{ color: '#C9A227' }} /></div>;
  return <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(10,22,40,0.06)' }}><FileText className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.4)' }} /></div>;
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0A1628' }}>L&D Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A227' }} />Admin View
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'rgba(10,22,40,0.4)' }}>{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: '#0A1628' }}>{stat.value}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: stat.positive ? '#059669' : '#DC2626' }}>{stat.delta}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
        <h2 className="text-base font-semibold mb-5" style={{ color: '#0A1628' }}>Request Pipeline</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center px-4 py-3 rounded-lg gap-1.5 min-w-[100px]"
                style={{ backgroundColor: i === 0 ? '#0A1628' : i === PIPELINE_STAGES.length - 1 ? 'rgba(5,150,105,0.08)' : 'rgba(10,22,40,0.04)' }}>
                <span className="text-xs font-medium text-center leading-tight"
                  style={{ color: i === 0 ? 'rgba(255,255,255,0.8)' : i === PIPELINE_STAGES.length - 1 ? '#059669' : 'rgba(10,22,40,0.55)' }}>
                  {stage.label}
                </span>
                <span className="text-xl font-bold"
                  style={{ color: i === 0 ? '#C9A227' : i === PIPELINE_STAGES.length - 1 ? '#059669' : '#0A1628' }}>
                  {stage.count}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(10,22,40,0.2)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ color: '#0A1628' }}>Requests by Division</h2>
              <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>This month</span>
            </div>
            <div className="space-y-3">
              {DIVISIONS.sort((a, b) => b.value - a.value).map(div => (
                <div key={div.name} className="flex items-center gap-3">
                  <span className="text-sm w-32 flex-shrink-0" style={{ color: '#0A1628' }}>{div.name}</span>
                  <div className="flex-1 h-7 rounded-md overflow-hidden" style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}>
                    <div className="h-full rounded-md flex items-center px-2.5"
                      style={{ width: `${(div.value / maxVal) * 100}%`, backgroundColor: '#0A1628', minWidth: '2rem' }}>
                      <span className="text-xs font-semibold text-white">{div.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#0A1628' }}>Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#C9A227', color: '#0A1628' }}>
                <Search className="w-4 h-4" />Review Pending
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.15)' }}>
                <Plus className="w-4 h-4" />Add Programme
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.15)' }}>
                <FileText className="w-4 h-4" />View All Requests
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: '#0A1628' }}>Recent Activity</h2>
              <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: '#C9A227' }}>All <ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-3">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <ActivityIcon type={item.icon} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug" style={{ color: '#0A1628' }}>{item.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>{item.user}</span>
                      <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.25)' }}>·</span>
                      <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-3" style={{ color: '#0A1628' }}>Upcoming This Week</h2>
            <div className="space-y-3">
              {UPCOMING.map(prog => (
                <div key={prog.title} className="bg-white rounded-xl border p-4 hover:shadow-sm cursor-pointer" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}>
                      <span className="text-[10px] font-medium uppercase" style={{ color: 'rgba(10,22,40,0.45)' }}>{prog.day}</span>
                      <span className="text-base font-bold leading-none" style={{ color: '#0A1628' }}>{prog.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#0A1628' }}>{prog.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700">{prog.type}</span>
                        <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{prog.division}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Users className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.35)' }} />
                        <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{prog.enrolled} enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
