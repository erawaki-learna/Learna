import { useState, useMemo } from 'react';
import { ChevronDown, Search, CalendarDays, MapPin, User as User2, Users, CheckCircle, AlertTriangle, Clock, XCircle, Send, Award, X } from 'lucide-react';

interface Programme {
  id: number;
  name: string;
  date: string;
  mode: 'In-Person' | 'Virtual' | 'Blended';
  facilitator: string;
  spotsTotal: number;
  spotsLeft: number;
  location: string;
  description: string;
}

interface StaffMember {
  id: number;
  name: string;
  department: string;
  role: string;
  lastTrainingDate: string;
  eligibility: 'Eligible' | 'Recently Trained' | 'Pending Transfer';
}

const PROGRAMMES: Programme[] = [
  {
    id: 1,
    name: 'Advanced Sales Techniques for Bancassurance',
    date: '22 Apr 2026',
    mode: 'In-Person',
    facilitator: 'Mr. Pradeep Weerasinghe',
    spotsTotal: 20,
    spotsLeft: 7,
    location: 'HNB Tower, Colombo 01',
    description:
      'A two-day intensive workshop on consultative selling, needs analysis, and closing techniques tailored for the bancassurance context. Participants will practise real-world scenarios and receive individual coaching feedback.',
  },
  {
    id: 2,
    name: 'Compliance & Regulatory Updates 2026',
    date: '05 May 2026',
    mode: 'Virtual',
    facilitator: 'Ms. Dilini Amarasekara',
    spotsTotal: 50,
    spotsLeft: 31,
    location: 'Microsoft Teams',
    description:
      'A mandatory half-day session covering regulatory changes from the Insurance Regulatory Commission of Sri Lanka (IRCSL) and HNB Assurance internal policy updates for 2026. All bancassurance staff are encouraged to attend.',
  },
  {
    id: 3,
    name: 'Coaching & Mentoring for Team Leaders',
    date: '18 May 2026',
    mode: 'Blended',
    facilitator: 'Ms. Sachini Gunawardena',
    spotsTotal: 15,
    spotsLeft: 4,
    location: 'HNB Training Centre, Rajagiriya',
    description:
      'A practical programme on coaching conversations, performance feedback, and mentoring frameworks for team leaders and branch managers. Includes two virtual follow-up sessions and a coaching practice log.',
  },
];

const STAFF: StaffMember[] = [
  { id: 1, name: 'Dilshan Perera', department: 'Bancassurance Retail', role: 'Branch Executive', lastTrainingDate: '12 Jan 2026', eligibility: 'Eligible' },
  { id: 2, name: 'Nimasha Fernando', department: 'Direct Sales', role: 'Senior BDE', lastTrainingDate: '28 Feb 2026', eligibility: 'Recently Trained' },
  { id: 3, name: 'Kasun Jayawardena', department: 'Bancassurance Retail', role: 'BDE', lastTrainingDate: '05 Mar 2026', eligibility: 'Pending Transfer' },
  { id: 4, name: 'Thilini Wickramasinghe', department: 'Corporate Bancassurance', role: 'Branch Manager', lastTrainingDate: '20 Nov 2025', eligibility: 'Eligible' },
  { id: 5, name: 'Ruwan Silva', department: 'Agency', role: 'BDE', lastTrainingDate: '14 Dec 2025', eligibility: 'Eligible' },
  { id: 6, name: 'Sandali Rathnayake', department: 'Bancassurance Retail', role: 'Senior BDE', lastTrainingDate: '03 Apr 2026', eligibility: 'Recently Trained' },
  { id: 7, name: 'Asitha Bandara', department: 'Direct Sales', role: 'Sales Executive', lastTrainingDate: '18 Feb 2026', eligibility: 'Eligible' },
  { id: 8, name: 'Priyanka Dissanayake', department: 'HR & Talent', role: 'HR Officer', lastTrainingDate: '07 Oct 2025', eligibility: 'Eligible' },
];

const ELIGIBILITY_STYLE: Record<StaffMember['eligibility'], { bg: string; text: string; icon: typeof CheckCircle }> = {
  'Eligible': { bg: 'rgba(6,95,70,0.1)', text: '#065F46', icon: CheckCircle },
  'Recently Trained': { bg: 'rgba(201,162,39,0.12)', text: '#92710F', icon: Clock },
  'Pending Transfer': { bg: 'rgba(220,38,38,0.08)', text: '#B91C1C', icon: XCircle },
};

const MODE_STYLE: Record<Programme['mode'], { bg: string; text: string }> = {
  'In-Person': { bg: 'rgba(10,22,40,0.07)', text: '#0A1628' },
  'Virtual': { bg: 'rgba(29,78,216,0.1)', text: '#1D4ED8' },
  'Blended': { bg: 'rgba(124,58,237,0.1)', text: '#6D28D9' },
};

export default function NominateStaff() {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<number>(PROGRAMMES[0].id);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const programme = PROGRAMMES.find((p) => p.id === selectedProgrammeId)!;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return STAFF;
    return STAFF.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q),
    );
  }, [search]);

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeNominee(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  const selectedStaff = STAFF.filter((s) => selected.has(s.id));
  const overNominated = selected.size > programme.spotsLeft;
  const canSubmit = selected.size > 0 && !overNominated;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F5F0' }}>
        <div className="bg-white rounded-3xl border shadow-sm p-10 max-w-sm w-full text-center" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(6,95,70,0.1)' }}>
            <Award className="w-7 h-7" style={{ color: '#065F46' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
            Nominations Submitted
          </h2>
          <p className="text-sm mb-1" style={{ color: 'rgba(10,22,40,0.55)' }}>
            <span className="font-semibold">{selected.size} staff member{selected.size !== 1 ? 's' : ''}</span> nominated for
          </p>
          <p className="text-sm font-semibold mb-6" style={{ color: '#0A1628' }}>{programme.name}</p>
          <div className="space-y-1.5 mb-6 text-left bg-amber-50/50 rounded-xl p-3">
            {selectedStaff.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#065F46' }} />
                <span className="text-xs font-medium" style={{ color: '#0A1628' }}>{s.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setSelected(new Set()); }}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: '#0A1628', color: 'white' }}
          >
            Nominate for Another Programme
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 pt-2">

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4" style={{ color: '#C9A227' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(10,22,40,0.4)' }}>L&D Administration</p>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Nominate Staff</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
            Select a programme and choose eligible staff to nominate for enrolment.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(10,22,40,0.4)' }}>
            Select Programme
          </label>
          <div className="relative max-w-lg">
            <select
              value={selectedProgrammeId}
              onChange={(e) => { setSelectedProgrammeId(Number(e.target.value)); setSelected(new Set()); }}
              className="w-full appearance-none px-4 pr-10 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white font-semibold"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            >
              {PROGRAMMES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.date} ({p.spotsLeft} spots left)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
          </div>
        </div>

        <div
          className="rounded-2xl border p-5 mb-6"
          style={{
            background: 'linear-gradient(135deg, #0A1628 0%, #0F2040 100%)',
            borderColor: 'rgba(10,22,40,0.15)',
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Selected Programme</p>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'white', fontFamily: 'Georgia, serif' }}>
                {programme.name}
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {programme.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: CalendarDays, label: programme.date },
                  { icon: MapPin, label: programme.location },
                  { icon: User2, label: programme.facilitator },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.35)' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: MODE_STYLE[programme.mode].bg, color: MODE_STYLE[programme.mode].text }}
              >
                {programme.mode}
              </span>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: '#C9A227', fontFamily: 'Georgia, serif' }}>
                  {programme.spotsLeft}
                  <span className="text-sm font-normal" style={{ color: 'rgba(201,162,39,0.6)' }}>/{programme.spotsTotal}</span>
                </p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>spots remaining</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
              <div className="px-5 py-4 border-b flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
                <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
                  Eligible Staff
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
                  <input
                    type="text"
                    placeholder="Search name, department, role…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg border text-xs outline-none"
                    style={{ borderColor: 'rgba(10,22,40,0.1)', color: '#0A1628', width: '220px' }}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(247,245,240,0.8)' }}>
                      {['', 'Name', 'Department', 'Role', 'Last Training', 'Eligibility'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                          style={{ color: 'rgba(10,22,40,0.4)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => {
                      const es = ELIGIBILITY_STYLE[s.eligibility];
                      const EIcon = es.icon;
                      const isSelected = selected.has(s.id);
                      return (
                        <tr
                          key={s.id}
                          onClick={() => toggleSelect(s.id)}
                          className="cursor-pointer transition-colors hover:bg-amber-50/40"
                          style={{
                            borderTop: i > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none',
                            backgroundColor: isSelected ? 'rgba(201,162,39,0.05)' : 'transparent',
                          }}
                        >
                          <td className="px-4 py-3.5">
                            <div
                              className="w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all"
                              style={{
                                borderColor: isSelected ? '#C9A227' : 'rgba(10,22,40,0.2)',
                                backgroundColor: isSelected ? '#C9A227' : 'transparent',
                                width: '18px',
                                height: '18px',
                              }}
                            >
                              {isSelected && <CheckCircle className="w-3 h-3" style={{ color: '#0A1628' }} />}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                                style={{ backgroundColor: 'rgba(10,22,40,0.07)', color: '#0A1628' }}
                              >
                                {s.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="font-semibold text-xs" style={{ color: '#0A1628' }}>{s.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>{s.department}</td>
                          <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>{s.role}</td>
                          <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: 'rgba(10,22,40,0.45)' }}>{s.lastTrainingDate}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
                              style={{ backgroundColor: es.bg, color: es.text }}
                            >
                              <EIcon className="w-3 h-3" />
                              {s.eligibility}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: 'rgba(10,22,40,0.35)' }}>
                          No staff match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border overflow-hidden sticky top-4" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)', backgroundColor: 'rgba(247,245,240,0.6)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
                    Selected Nominees
                  </h3>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: selected.size > 0 ? 'rgba(201,162,39,0.15)' : 'rgba(10,22,40,0.07)', color: selected.size > 0 ? '#92710F' : 'rgba(10,22,40,0.3)' }}
                  >
                    {selected.size}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    {selected.size} of {programme.spotsLeft} available spots used
                  </p>
                </div>

                <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(10,22,40,0.07)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((selected.size / programme.spotsLeft) * 100, 100)}%`,
                      backgroundColor: overNominated ? '#B91C1C' : '#C9A227',
                    }}
                  />
                </div>

                {overNominated && (
                  <div
                    className="flex items-start gap-2 rounded-xl p-3 mb-3"
                    style={{ backgroundColor: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.15)' }}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#B91C1C' }}>
                      You have selected {selected.size - programme.spotsLeft} more than the available spots. Please deselect some staff.
                    </p>
                  </div>
                )}

                {selected.size === 0 ? (
                  <div className="py-6 text-center">
                    <Users className="w-7 h-7 mx-auto mb-2" style={{ color: 'rgba(10,22,40,0.15)' }} />
                    <p className="text-xs" style={{ color: 'rgba(10,22,40,0.3)' }}>No staff selected yet.</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(10,22,40,0.25)' }}>Click a row in the table to select.</p>
                  </div>
                ) : (
                  <ul className="space-y-2 mb-4">
                    {selectedStaff.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                        style={{ backgroundColor: 'rgba(247,245,240,0.8)' }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ backgroundColor: 'rgba(10,22,40,0.08)', color: '#0A1628' }}
                          >
                            {s.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: '#0A1628' }}>{s.name}</p>
                            <p className="text-[10px] truncate" style={{ color: 'rgba(10,22,40,0.4)' }}>{s.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeNominee(s.id); }}
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                          style={{ backgroundColor: 'rgba(10,22,40,0.07)' }}
                        >
                          <X className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.4)' }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
                >
                  <Send className="w-4 h-4" />
                  Submit Nominations
                </button>

                {selected.size === 0 && (
                  <p className="text-center text-[11px] mt-2" style={{ color: 'rgba(10,22,40,0.3)' }}>
                    Select at least one staff member to submit.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
