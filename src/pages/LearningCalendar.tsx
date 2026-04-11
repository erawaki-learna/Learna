import { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
  BookOpen,
} from 'lucide-react';

type Role = 'admin' | 'user';
type Filter = 'upcoming' | 'all' | 'nominations';
type Status = 'Confirmed' | 'Draft' | 'Cancelled';
type ProgrammeType = 'Workshop' | 'E-Learning' | 'Coaching' | 'Blended';

interface Programme {
  id: string;
  title: string;
  type: ProgrammeType;
  division: string;
  date: string;
  endDate?: string;
  enrolled: number;
  capacity: number;
  status: Status;
  openForNominations: boolean;
  month: number;
  year: number;
}

const SAMPLE_PROGRAMMES: Programme[] = [
  {
    id: '1',
    title: 'Sales Excellence Masterclass',
    type: 'Workshop',
    division: 'Bancassurance Retail',
    date: '2026-04-14',
    endDate: '2026-04-15',
    enrolled: 18,
    capacity: 24,
    status: 'Confirmed',
    openForNominations: true,
    month: 4,
    year: 2026,
  },
  {
    id: '2',
    title: 'Claims Processing Fundamentals',
    type: 'E-Learning',
    division: 'Claims',
    date: '2026-04-22',
    enrolled: 42,
    capacity: 100,
    status: 'Confirmed',
    openForNominations: true,
    month: 4,
    year: 2026,
  },
  {
    id: '3',
    title: 'Leadership Accelerator Programme',
    type: 'Blended',
    division: 'Head Office Operations',
    date: '2026-05-05',
    endDate: '2026-06-27',
    enrolled: 12,
    capacity: 15,
    status: 'Confirmed',
    openForNominations: false,
    month: 5,
    year: 2026,
  },
  {
    id: '4',
    title: 'Underwriting Risk Assessment',
    type: 'Coaching',
    division: 'Underwriting',
    date: '2026-05-19',
    enrolled: 0,
    capacity: 10,
    status: 'Draft',
    openForNominations: false,
    month: 5,
    year: 2026,
  },
];

const TYPE_COLORS: Record<ProgrammeType, { bg: string; text: string }> = {
  Workshop: { bg: 'rgba(14,165,233,0.1)', text: '#0284C7' },
  'E-Learning': { bg: 'rgba(5,150,105,0.1)', text: '#047857' },
  Coaching: { bg: 'rgba(245,158,11,0.1)', text: '#B45309' },
  Blended: { bg: 'rgba(99,102,241,0.1)', text: '#4338CA' },
};

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string }> = {
  Confirmed: { bg: 'rgba(5,150,105,0.08)', text: '#047857', dot: '#10B981' },
  Draft: { bg: 'rgba(107,114,128,0.08)', text: '#4B5563', dot: '#9CA3AF' },
  Cancelled: { bg: 'rgba(239,68,68,0.08)', text: '#B91C1C', dot: '#EF4444' },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(dateStr: string, endStr?: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const mon = MONTHS[d.getMonth()].slice(0, 3);
  if (!endStr) return `${day} ${mon}`;
  const e = new Date(endStr);
  if (d.getMonth() === e.getMonth()) return `${day}–${e.getDate()} ${mon}`;
  return `${day} ${mon} – ${e.getDate()} ${MONTHS[e.getMonth()].slice(0, 3)}`;
}

function DateBadge({ date, endDate }: { date: string; endDate?: string }) {
  const d = new Date(date);
  const day = d.getDate();
  const mon = MONTHS[d.getMonth()].slice(0, 3).toUpperCase();
  return (
    <div
      className="flex-shrink-0 w-14 rounded-xl flex flex-col items-center justify-center py-2.5 border"
      style={{ borderColor: 'rgba(10,22,40,0.08)', backgroundColor: '#F7F5F0' }}
    >
      <span className="text-[10px] font-bold tracking-widest" style={{ color: '#C9A227' }}>{mon}</span>
      <span className="text-xl font-bold leading-none mt-0.5" style={{ color: '#0A1628' }}>{day}</span>
      {endDate && <span className="text-[9px] mt-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>multi-day</span>}
    </div>
  );
}

interface NominationModalProps {
  programme: Programme;
  onClose: () => void;
  onSubmit: () => void;
}

function NominationModal({ programme, onClose }: NominationModalProps) {
  const [staffName, setStaffName] = useState('');
  const [count, setCount] = useState('1');
  const [justification, setJustification] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!staffName.trim()) e.staffName = 'Required';
    if (!count || isNaN(Number(count)) || Number(count) < 1) e.count = 'Enter a valid number';
    if (justification.trim().length < 10) e.justification = 'Please provide more detail (min 10 chars)';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(2px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(10,22,40,0.07)' }}
        >
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#0A1628' }}>Nominate Staff</h3>
            <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{programme.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.4)' }} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-12 px-6 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(5,150,105,0.1)' }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: '#059669' }} />
            </div>
            <p className="font-semibold text-sm" style={{ color: '#0A1628' }}>Nomination Submitted!</p>
            <p className="text-xs mt-1 mb-6" style={{ color: 'rgba(10,22,40,0.45)' }}>
              The Learna team will follow up shortly.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'rgba(10,22,40,0.45)' }}
              >
                Staff Name(s) <span style={{ color: '#C9A227' }}>*</span>
              </label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => { setStaffName(e.target.value); setErrors((r) => ({ ...r, staffName: '' })); }}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227]"
                style={{ borderColor: errors.staffName ? '#FCA5A5' : 'rgba(10,22,40,0.12)', color: '#0A1628' }}
                placeholder="e.g. Maria Santos, John Reyes"
              />
              {errors.staffName && <p className="text-xs mt-1 text-red-500">{errors.staffName}</p>}
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'rgba(10,22,40,0.45)' }}
              >
                Number of Staff <span style={{ color: '#C9A227' }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => { setCount(e.target.value); setErrors((r) => ({ ...r, count: '' })); }}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227]"
                style={{ borderColor: errors.count ? '#FCA5A5' : 'rgba(10,22,40,0.12)', color: '#0A1628' }}
              />
              {errors.count && <p className="text-xs mt-1 text-red-500">{errors.count}</p>}
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'rgba(10,22,40,0.45)' }}
              >
                Justification <span style={{ color: '#C9A227' }}>*</span>
              </label>
              <textarea
                value={justification}
                onChange={(e) => { setJustification(e.target.value); setErrors((r) => ({ ...r, justification: '' })); }}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227] resize-none"
                style={{ borderColor: errors.justification ? '#FCA5A5' : 'rgba(10,22,40,0.12)', color: '#0A1628' }}
                placeholder="Why do these staff members need this programme?"
              />
              {errors.justification && <p className="text-xs mt-1 text-red-500">{errors.justification}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              Submit Nomination
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface ProgrammeCardProps {
  programme: Programme;
  role: Role;
  onNominate: (p: Programme) => void;
  onDelete: (id: string) => void;
}

function ProgrammeCard({ programme, role, onNominate, onDelete }: ProgrammeCardProps) {
  const typeStyle = TYPE_COLORS[programme.type];
  const statusStyle = STATUS_STYLES[programme.status];
  const fillPct = Math.round((programme.enrolled / programme.capacity) * 100);
  const spotsLeft = programme.capacity - programme.enrolled;

  return (
    <div
      className="bg-white rounded-2xl border p-5 flex gap-4 transition-shadow hover:shadow-sm"
      style={{ borderColor: 'rgba(10,22,40,0.08)' }}
    >
      <DateBadge date={programme.date} endDate={programme.endDate} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
            >
              {programme.type}
            </span>
            {role === 'admin' && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: statusStyle.dot }}
                />
                {programme.status}
              </span>
            )}
            {programme.openForNominations && (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#A07D18' }}
              >
                Open for Nominations
              </span>
            )}
          </div>

          {role === 'admin' && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" style={{ color: 'rgba(10,22,40,0.4)' }} />
              </button>
              <button
                onClick={() => onDelete(programme.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
              </button>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm mt-2 mb-2" style={{ color: '#0A1628' }}>{programme.title}</h3>

        <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: 'rgba(10,22,40,0.45)' }}>
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {programme.division}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(programme.date, programme.endDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {programme.enrolled} / {programme.capacity} enrolled
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(10,22,40,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${fillPct}%`,
                backgroundColor: fillPct >= 90 ? '#EF4444' : fillPct >= 70 ? '#F59E0B' : '#10B981',
              }}
            />
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: 'rgba(10,22,40,0.4)' }}>
            {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
          </span>
        </div>

        {role === 'user' && programme.openForNominations && spotsLeft > 0 && (
          <button
            onClick={() => onNominate(programme)}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: 'rgba(201,162,39,0.12)', color: '#A07D18' }}
          >
            <Users className="w-3.5 h-3.5" />
            Nominate Staff
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {
  role?: Role;
}

export default function LearningCalendar({ role: roleProp }: Props) {
  const [role, setRole] = useState<Role>(roleProp ?? 'user');
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2026);
  const [programmes, setProgrammes] = useState<Programme[]>(SAMPLE_PROGRAMMES);
  const [nominatingFor, setNominatingFor] = useState<Programme | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = programmes.filter((p) => {
    const pDate = new Date(p.date);
    const inMonth = p.month === month && p.year === year;
    if (filter === 'upcoming') return inMonth && pDate >= today;
    if (filter === 'all') return inMonth;
    if (filter === 'nominations') return inMonth && p.openForNominations;
    return true;
  });

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const handleDelete = (id: string) => setProgrammes((prev) => prev.filter((p) => p.id !== id));

  const FILTER_LABELS: Record<Filter, string> = {
    upcoming: 'Upcoming',
    all: 'All',
    nominations: 'Open for Nominations',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-0.5">
            <h1 className="text-2xl font-semibold" style={{ color: '#0A1628' }}>Learning Calendar</h1>
            {!roleProp && (
              <button
                onClick={() => setRole((r) => r === 'admin' ? 'user' : 'admin')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors hover:bg-gray-50"
                style={{ borderColor: 'rgba(10,22,40,0.12)', color: 'rgba(10,22,40,0.5)' }}
              >
                View as: {role === 'admin' ? 'Admin' : 'User'}
              </button>
            )}
          </div>
          <p className="text-sm" style={{ color: 'rgba(10,22,40,0.45)' }}>
            Browse and manage scheduled learning programmes.
          </p>
        </div>
        {role === 'admin' && (
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
          >
            <Plus className="w-4 h-4" />
            Add Programme
          </button>
        )}
      </div>

      <div
        className="bg-white rounded-2xl border p-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(10,22,40,0.08)' }}
      >
        <button
          onClick={handlePrevMonth}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#0A1628' }} />
        </button>
        <div className="text-center">
          <p className="font-semibold text-sm" style={{ color: '#0A1628' }}>{MONTHS[month - 1]} {year}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.4)' }}>
            {filtered.length} programme{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleNextMonth}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" style={{ color: '#0A1628' }} />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: filter === f ? '#0A1628' : 'white',
              color: filter === f ? 'white' : 'rgba(10,22,40,0.5)',
              border: `1.5px solid ${filter === f ? '#0A1628' : 'rgba(10,22,40,0.1)'}`,
            }}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((p) => (
            <ProgrammeCard
              key={p.id}
              programme={p}
              role={role}
              onNominate={setNominatingFor}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl border flex flex-col items-center justify-center py-16 text-center"
          style={{ borderColor: 'rgba(10,22,40,0.08)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(10,22,40,0.04)' }}
          >
            <BookOpen className="w-7 h-7" style={{ color: 'rgba(10,22,40,0.2)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'rgba(10,22,40,0.4)' }}>No programmes found</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(10,22,40,0.3)' }}>
            Try changing the filter or navigating to another month.
          </p>
        </div>
      )}

      {nominatingFor && (
        <NominationModal
          programme={nominatingFor}
          onClose={() => setNominatingFor(null)}
          onSubmit={() => setNominatingFor(null)}
        />
      )}
    </div>
  );
}
