import { useState, useMemo } from 'react';
import {
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  Users,
  MapPin,
  Video,
  Layers,
  FileText,
  CheckSquare,
  Square,
  ArrowLeft,
  Save,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from 'lucide-react';

type DeliveryMode = 'In-Person' | 'Virtual' | 'Blended';
type DeliveryStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

interface Attendee {
  id: string;
  name: string;
  department: string;
  attended: boolean;
}

interface Programme {
  id: string;
  name: string;
  deliveryDate: string;
  deliveryTime: string;
  facilitator: string;
  department: string;
  mode: DeliveryMode;
  status: DeliveryStatus;
  enrolled: number;
  confirmed: number;
  attendees: Attendee[];
  facilitatorNotes: string;
  location: string;
}

const MOCK_DATA: Programme[] = [
  {
    id: 'DLV-001',
    name: 'IFRS 17 Implementation for Finance Teams',
    deliveryDate: '2026-04-15',
    deliveryTime: '09:00',
    facilitator: 'Roshan Dissanayake',
    department: 'Finance',
    mode: 'In-Person',
    status: 'Scheduled',
    enrolled: 12,
    confirmed: 10,
    location: 'HNB Assurance Training Centre, Colombo 03',
    facilitatorNotes: '',
    attendees: [
      { id: 'a1', name: 'Kasun Rajapaksha', department: 'Finance', attended: false },
      { id: 'a2', name: 'Thilanka Nanayakkara', department: 'Finance', attended: false },
      { id: 'a3', name: 'Sachini Perera', department: 'Finance', attended: false },
      { id: 'a4', name: 'Dinesh Wijesinghe', department: 'Finance', attended: false },
      { id: 'a5', name: 'Malini Gunawardena', department: 'Legal & Compliance', attended: false },
      { id: 'a6', name: 'Amali Jayawardena', department: 'Finance', attended: false },
      { id: 'a7', name: 'Nuwan Pathirana', department: 'Finance', attended: false },
      { id: 'a8', name: 'Chathura Seneviratne', department: 'Finance', attended: false },
      { id: 'a9', name: 'Hiruni Fernando', department: 'Actuarial', attended: false },
      { id: 'a10', name: 'Lasantha De Silva', department: 'Finance', attended: false },
    ],
  },
  {
    id: 'DLV-002',
    name: 'AML/CFT Compliance Certification',
    deliveryDate: '2026-04-10',
    deliveryTime: '08:30',
    facilitator: 'Pradeep Kumara',
    department: 'Legal & Compliance',
    mode: 'Virtual',
    status: 'In Progress',
    enrolled: 35,
    confirmed: 29,
    location: 'MS Teams – Link shared via email',
    facilitatorNotes: 'Participants are engaged. Breakout rooms working well. Recording enabled for absentees.',
    attendees: [
      { id: 'b1', name: 'Malini Gunawardena', department: 'Legal & Compliance', attended: true },
      { id: 'b2', name: 'Nimal Perera', department: 'Bancassurance Retail', attended: true },
      { id: 'b3', name: 'Chamari Silva', department: 'Claims', attended: true },
      { id: 'b4', name: 'Asanka Bandara', department: 'IT & Digital', attended: false },
      { id: 'b5', name: 'Ishara Dissanayake', department: 'Customer Experience', attended: true },
      { id: 'b6', name: 'Ruwan Jayasinghe', department: 'Underwriting', attended: true },
      { id: 'b7', name: 'Dilani Fernando', department: 'HR & Talent', attended: false },
      { id: 'b8', name: 'Sanduni Amarasinghe', department: 'HR & Talent', attended: true },
      { id: 'b9', name: 'Kasun Rajapaksha', department: 'Finance', attended: true },
    ],
  },
  {
    id: 'DLV-003',
    name: 'Sales Excellence Workshop – Q2 Campaign',
    deliveryDate: '2026-04-03',
    deliveryTime: '09:30',
    facilitator: 'Sanjaya Wickramaratne',
    department: 'Bancassurance Retail',
    mode: 'In-Person',
    status: 'Completed',
    enrolled: 18,
    confirmed: 18,
    location: 'SL Institute of Marketing, Colombo 07',
    facilitatorNotes: 'Excellent participation. Role-play exercises were highly effective. Recommend follow-up session in Q3. Pre-work completion rate was 85%.',
    attendees: [
      { id: 'c1', name: 'Nimal Perera', department: 'Bancassurance Retail', attended: true },
      { id: 'c2', name: 'Tharaka Senanayake', department: 'Bancassurance Retail', attended: true },
      { id: 'c3', name: 'Vimukthi Ranatunga', department: 'Agency Distribution', attended: true },
      { id: 'c4', name: 'Priya Wickramasinghe', department: 'Bancassurance Retail', attended: false },
      { id: 'c5', name: 'Amara Jayasuriya', department: 'Bancassurance Retail', attended: true },
      { id: 'c6', name: 'Gayan Rathnayake', department: 'Bancassurance Retail', attended: true },
      { id: 'c7', name: 'Nadeesha Koswatte', department: 'Bancassurance Retail', attended: true },
      { id: 'c8', name: 'Lahiru Mendis', department: 'Agency Distribution', attended: true },
    ],
  },
  {
    id: 'DLV-004',
    name: 'Agile & Scrum Certification – Digital Team',
    deliveryDate: '2026-04-22',
    deliveryTime: '09:00',
    facilitator: 'Dileepa Abeywickrama',
    department: 'IT & Digital',
    mode: 'Blended',
    status: 'Scheduled',
    enrolled: 10,
    confirmed: 8,
    location: 'PMI Sri Lanka Chapter + Virtual Lab',
    facilitatorNotes: '',
    attendees: [
      { id: 'd1', name: 'Asanka Bandara', department: 'IT & Digital', attended: false },
      { id: 'd2', name: 'Lasith Maduwantha', department: 'IT & Digital', attended: false },
      { id: 'd3', name: 'Chanaka Gunasekara', department: 'IT & Digital', attended: false },
      { id: 'd4', name: 'Thushari Weerasinghe', department: 'IT & Digital', attended: false },
      { id: 'd5', name: 'Rukmal Perera', department: 'IT & Digital', attended: false },
      { id: 'd6', name: 'Amali Jayawardena', department: 'Finance', attended: false },
      { id: 'd7', name: 'Hiruni Fernando', department: 'Actuarial', attended: false },
      { id: 'd8', name: 'Nuwan Pathirana', department: 'Finance', attended: false },
    ],
  },
  {
    id: 'DLV-005',
    name: 'Leadership Development – Mid-Level Managers',
    deliveryDate: '2026-03-28',
    deliveryTime: '08:00',
    facilitator: 'Dr. Chaminda Rathnayake',
    department: 'HR & Talent',
    mode: 'In-Person',
    status: 'Completed',
    enrolled: 24,
    confirmed: 22,
    location: 'Cinnamon Grand Colombo – Sapphire Room',
    facilitatorNotes: 'Strong cohort. 360-degree feedback results incorporated into Day 2 sessions. All participants completed post-programme survey. Overall satisfaction: 4.6/5.',
    attendees: [
      { id: 'e1', name: 'Dilani Fernando', department: 'HR & Talent', attended: true },
      { id: 'e2', name: 'Kasun Rajapaksha', department: 'Finance', attended: true },
      { id: 'e3', name: 'Malini Gunawardena', department: 'Legal & Compliance', attended: true },
      { id: 'e4', name: 'Asanka Bandara', department: 'IT & Digital', attended: false },
      { id: 'e5', name: 'Ishara Dissanayake', department: 'Customer Experience', attended: true },
      { id: 'e6', name: 'Pradeep Kumara', department: 'Legal & Compliance', attended: true },
      { id: 'e7', name: 'Sanjaya Wickramaratne', department: 'Bancassurance Retail', attended: true },
      { id: 'e8', name: 'Ruwan Jayasinghe', department: 'Underwriting', attended: true },
    ],
  },
  {
    id: 'DLV-006',
    name: 'Claims Processing SOP – Regulatory Update',
    deliveryDate: '2026-04-08',
    deliveryTime: '14:00',
    facilitator: 'Chathuri Samarasinghe',
    department: 'Claims',
    mode: 'Virtual',
    status: 'Completed',
    enrolled: 20,
    confirmed: 19,
    location: 'Zoom Webinar',
    facilitatorNotes: 'E-learning module pre-work completion was 90%. Live Q&A was productive. Recommend a refresher in 6 months post-IRCSL audit.',
    attendees: [
      { id: 'f1', name: 'Chamari Silva', department: 'Claims', attended: true },
      { id: 'f2', name: 'Dulanjana Pathirana', department: 'Claims', attended: true },
      { id: 'f3', name: 'Sampath Weerakoon', department: 'Claims', attended: true },
      { id: 'f4', name: 'Anusha Jayasinghe', department: 'Claims', attended: false },
      { id: 'f5', name: 'Buddhika Rathnasiri', department: 'Claims', attended: true },
      { id: 'f6', name: 'Nadeeka Gunawardena', department: 'Claims', attended: true },
    ],
  },
  {
    id: 'DLV-007',
    name: 'Customer Empathy & Service Recovery',
    deliveryDate: '2026-04-29',
    deliveryTime: '13:30',
    facilitator: 'Anoja Perera',
    department: 'Customer Experience',
    mode: 'In-Person',
    status: 'Scheduled',
    enrolled: 8,
    confirmed: 6,
    location: 'HNB Assurance Training Centre, Colombo 03',
    facilitatorNotes: '',
    attendees: [
      { id: 'g1', name: 'Ishara Dissanayake', department: 'Customer Experience', attended: false },
      { id: 'g2', name: 'Amara Jayasuriya', department: 'Customer Experience', attended: false },
      { id: 'g3', name: 'Gayan Rathnayake', department: 'Customer Experience', attended: false },
      { id: 'g4', name: 'Nadeesha Koswatte', department: 'Customer Experience', attended: false },
      { id: 'g5', name: 'Lahiru Mendis', department: 'Customer Experience', attended: false },
      { id: 'g6', name: 'Hiruni Fernando', department: 'Customer Experience', attended: false },
    ],
  },
  {
    id: 'DLV-008',
    name: 'Agency Onboarding – Southern Province Cohort',
    deliveryDate: '2026-04-14',
    deliveryTime: '08:30',
    facilitator: 'Vimukthi Ranatunga',
    department: 'Agency Distribution',
    mode: 'In-Person',
    status: 'Cancelled',
    enrolled: 20,
    confirmed: 14,
    location: 'Galle Face Hotel Annex, Colombo 03',
    facilitatorNotes: 'Cancelled due to facilitator unavailability. Rescheduled for May 2026. All confirmed participants notified.',
    attendees: [
      { id: 'h1', name: 'Lahiru Mendis', department: 'Agency Distribution', attended: false },
      { id: 'h2', name: 'Chathura Seneviratne', department: 'Agency Distribution', attended: false },
      { id: 'h3', name: 'Amara Jayasuriya', department: 'Agency Distribution', attended: false },
      { id: 'h4', name: 'Gayan Rathnayake', department: 'Agency Distribution', attended: false },
    ],
  },
  {
    id: 'DLV-009',
    name: 'Actuarial Examination Prep – CT Series Coaching',
    deliveryDate: '2026-05-05',
    deliveryTime: '17:00',
    facilitator: 'Roshan Dissanayake',
    department: 'Actuarial',
    mode: 'Blended',
    status: 'Scheduled',
    enrolled: 3,
    confirmed: 3,
    location: 'Hybrid – HNB HQ & Teams',
    facilitatorNotes: '',
    attendees: [
      { id: 'i1', name: 'Priya Wickramasinghe', department: 'Actuarial', attended: false },
      { id: 'i2', name: 'Hiruni Fernando', department: 'Actuarial', attended: false },
      { id: 'i3', name: 'Nadeesha Koswatte', department: 'Actuarial', attended: false },
    ],
  },
  {
    id: 'DLV-010',
    name: 'Performance Management Refresh – 2026 KPI Framework',
    deliveryDate: '2026-04-01',
    deliveryTime: '10:00',
    facilitator: 'Sanduni Amarasinghe',
    department: 'HR & Talent',
    mode: 'Virtual',
    status: 'Completed',
    enrolled: 42,
    confirmed: 38,
    location: 'MS Teams Webinar',
    facilitatorNotes: 'High attendance. Poll results show 78% felt confident applying new KPI framework. Slides and recording shared to all staff via LMS.',
    attendees: [
      { id: 'j1', name: 'Dilani Fernando', department: 'HR & Talent', attended: true },
      { id: 'j2', name: 'Kasun Rajapaksha', department: 'Finance', attended: true },
      { id: 'j3', name: 'Nimal Perera', department: 'Bancassurance Retail', attended: true },
      { id: 'j4', name: 'Chamari Silva', department: 'Claims', attended: false },
      { id: 'j5', name: 'Asanka Bandara', department: 'IT & Digital', attended: true },
      { id: 'j6', name: 'Malini Gunawardena', department: 'Legal & Compliance', attended: true },
      { id: 'j7', name: 'Ishara Dissanayake', department: 'Customer Experience', attended: true },
      { id: 'j8', name: 'Ruwan Jayasinghe', department: 'Underwriting', attended: true },
      { id: 'j9', name: 'Vimukthi Ranatunga', department: 'Agency Distribution', attended: true },
      { id: 'j10', name: 'Priya Wickramasinghe', department: 'Actuarial', attended: true },
    ],
  },
];

const DEPARTMENTS = [...new Set(MOCK_DATA.map((p) => p.department))].sort();

const MODE_STYLES: Record<DeliveryMode, { bg: string; text: string; icon: React.ReactNode }> = {
  'In-Person': {
    bg: 'rgba(14,165,233,0.08)',
    text: '#0369A1',
    icon: <MapPin className="w-3 h-3" />,
  },
  Virtual: {
    bg: 'rgba(124,58,237,0.08)',
    text: '#6D28D9',
    icon: <Video className="w-3 h-3" />,
  },
  Blended: {
    bg: 'rgba(5,150,105,0.08)',
    text: '#047857',
    icon: <Layers className="w-3 h-3" />,
  },
};

const STATUS_STYLES: Record<DeliveryStatus, { bg: string; text: string; dot: string }> = {
  Scheduled: { bg: 'rgba(107,114,128,0.08)', text: '#374151', dot: '#9CA3AF' },
  'In Progress': { bg: 'rgba(59,130,246,0.08)', text: '#1D4ED8', dot: '#3B82F6' },
  Completed: { bg: 'rgba(5,150,105,0.08)', text: '#047857', dot: '#10B981' },
  Cancelled: { bg: 'rgba(239,68,68,0.08)', text: '#B91C1C', dot: '#EF4444' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(t: string) {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

function Badge({ children, bg, text }: { children: React.ReactNode; bg: string; text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}

function AttendanceBar({ enrolled, confirmed }: { enrolled: number; confirmed: number }) {
  const pct = enrolled > 0 ? Math.round((confirmed / enrolled) * 100) : 0;
  const barColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]" style={{ color: 'rgba(10,22,40,0.45)' }}>
        <span>{confirmed}/{enrolled} confirmed</span>
        <span style={{ color: barColor }} className="font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(10,22,40,0.07)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

interface DetailPanelProps {
  programme: Programme;
  onClose: () => void;
  onUpdate: (updated: Programme) => void;
}

function DetailPanel({ programme, onClose, onUpdate }: DetailPanelProps) {
  const [attendees, setAttendees] = useState<Attendee[]>(programme.attendees);
  const [notes, setNotes] = useState(programme.facilitatorNotes);
  const [saved, setSaved] = useState(false);

  const toggleAttendance = (id: string) => {
    setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, attended: !a.attended } : a));
    setSaved(false);
  };

  const handleSave = () => {
    onUpdate({ ...programme, attendees, facilitatorNotes: notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleMarkComplete = () => {
    onUpdate({ ...programme, attendees, facilitatorNotes: notes, status: 'Completed' });
    onClose();
  };

  const attendedCount = attendees.filter((a) => a.attended).length;
  const modeStyle = MODE_STYLES[programme.mode];
  const statusStyle = STATUS_STYLES[programme.status];
  const canComplete = programme.status === 'Scheduled' || programme.status === 'In Progress';

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(10,22,40,0.55)' }}>
      <div className="ml-auto h-full w-full max-w-2xl bg-white flex flex-col shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b flex items-start justify-between gap-4" style={{ borderColor: 'rgba(10,22,40,0.08)', backgroundColor: '#F7F5F0' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(10,22,40,0.08)', color: 'rgba(10,22,40,0.45)' }}>
                {programme.id}
              </span>
              <Badge bg={statusStyle.bg} text={statusStyle.text}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                {programme.status}
              </Badge>
              <Badge bg={modeStyle.bg} text={modeStyle.text}>
                {modeStyle.icon}
                {programme.mode}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold leading-snug" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
              {programme.name}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: 'rgba(10,22,40,0.45)' }}>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(programme.deliveryDate)} at {formatTime(programme.deliveryTime)}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {programme.facilitator}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {programme.location}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
            <X className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.4)' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>
                Attendee List
              </h3>
              <span className="text-xs font-semibold" style={{ color: '#047857' }}>
                {attendedCount} attended
              </span>
            </div>
            <div className="space-y-1.5">
              {attendees.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleAttendance(a.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left hover:border-[#C9A227]"
                  style={{
                    borderColor: a.attended ? 'rgba(5,150,105,0.3)' : 'rgba(10,22,40,0.08)',
                    backgroundColor: a.attended ? 'rgba(5,150,105,0.04)' : 'white',
                  }}
                >
                  {a.attended
                    ? <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: '#047857' }} />
                    : <Square className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(10,22,40,0.2)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: '#0A1628' }}>{a.name}</div>
                    <div className="text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>{a.department}</div>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: a.attended ? 'rgba(5,150,105,0.1)' : 'rgba(107,114,128,0.08)',
                      color: a.attended ? '#047857' : 'rgba(10,22,40,0.35)',
                    }}
                  >
                    {a.attended ? 'Attended' : 'Absent'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(10,22,40,0.4)' }}>
              Facilitator Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
              rows={5}
              placeholder="Add notes about this delivery session — participant feedback, observations, follow-up actions..."
              className="w-full px-3.5 py-3 rounded-xl border text-sm resize-none outline-none transition-all focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227]"
              style={{
                borderColor: 'rgba(10,22,40,0.12)',
                color: '#0A1628',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.6',
              }}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between gap-3" style={{ borderColor: 'rgba(10,22,40,0.08)', backgroundColor: '#FAFAF8' }}>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs flex items-center gap-1" style={{ color: '#047857' }}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
            {canComplete && (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#0A1628' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type SortField = 'name' | 'deliveryDate' | 'department' | 'status';
interface SortState { field: SortField | null; dir: 'asc' | 'desc' | null }

function SortIcon({ field, sort }: { field: SortField; sort: SortState }) {
  if (sort.field !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />;
  return sort.dir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5" style={{ color: '#C9A227' }} />
    : <ChevronDown className="w-3.5 h-3.5" style={{ color: '#C9A227' }} />;
}

export default function DeliveryTracker() {
  const [programmes, setProgrammes] = useState<Programme[]>(MOCK_DATA);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | ''>('');
  const [filterMode, setFilterMode] = useState<DeliveryMode | ''>('');
  const [filterDept, setFilterDept] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({ field: 'deliveryDate', dir: 'asc' });
  const [page, setPage] = useState(1);

  const PAGE_SIZE = view === 'table' ? 10 : 9;

  const filtered = useMemo(() => {
    let data = programmes.filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.facilitator.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (filterMode && p.mode !== filterMode) return false;
      if (filterDept && p.department !== filterDept) return false;
      if (filterFrom && p.deliveryDate < filterFrom) return false;
      if (filterTo && p.deliveryDate > filterTo) return false;
      return true;
    });
    if (sort.field && sort.dir) {
      data = [...data].sort((a, b) => {
        const dir = sort.dir === 'asc' ? 1 : -1;
        return dir * String(a[sort.field!]).localeCompare(String(b[sort.field!]));
      });
    }
    return data;
  }, [programmes, search, filterStatus, filterMode, filterDept, filterFrom, filterTo, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFiltersCount = [filterStatus, filterMode, filterDept, filterFrom, filterTo].filter(Boolean).length;

  const clearFilters = () => {
    setFilterStatus(''); setFilterMode(''); setFilterDept(''); setFilterFrom(''); setFilterTo('');
    setPage(1);
  };

  const handleUpdate = (updated: Programme) => {
    setProgrammes((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  };

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      dir: prev.field === field ? (prev.dir === 'asc' ? 'desc' : prev.dir === 'desc' ? null : 'asc') : 'asc',
    }));
    setPage(1);
  };

  const selectedProgramme = programmes.find((p) => p.id === selectedId) ?? null;

  const statusCounts = useMemo(() => {
    const counts: Record<DeliveryStatus, number> = { Scheduled: 0, 'In Progress': 0, Completed: 0, Cancelled: 0 };
    programmes.forEach((p) => counts[p.status]++);
    return counts;
  }, [programmes]);

  const TH = ({ label, field, className = '' }: { label: string; field?: SortField; className?: string }) => (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider select-none ${field ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''} ${className}`}
      style={{ color: 'rgba(10,22,40,0.45)', backgroundColor: '#F7F5F0' }}
      onClick={field ? () => handleSort(field) : undefined}
    >
      <span className="flex items-center gap-1">
        {label}
        {field && <SortIcon field={field} sort={sort} />}
      </span>
    </th>
  );

  return (
    <>
      {selectedProgramme && (
        <DetailPanel
          programme={selectedProgramme}
          onClose={() => setSelectedId(null)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="space-y-5">
        <div className="rounded-2xl px-6 py-5" style={{ backgroundColor: '#0A1628' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Delivery Tracker
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>
                6Ds Framework — D3: Deliver for Performance
              </p>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
              <button
                onClick={() => { setView('grid'); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: view === 'grid' ? 'white' : 'transparent',
                  color: view === 'grid' ? '#0A1628' : 'rgba(255,255,255,0.5)',
                }}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Cards
              </button>
              <button
                onClick={() => { setView('table'); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: view === 'table' ? 'white' : 'transparent',
                  color: view === 'table' ? '#0A1628' : 'rgba(255,255,255,0.5)',
                }}
              >
                <List className="w-3.5 h-3.5" /> Table
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {(Object.entries(statusCounts) as [DeliveryStatus, number][]).map(([status, count]) => {
              const s = STATUS_STYLES[status];
              return (
                <button
                  key={status}
                  onClick={() => { setFilterStatus(filterStatus === status ? '' : status); setPage(1); }}
                  className="rounded-xl px-4 py-3 text-left transition-all hover:opacity-80"
                  style={{
                    backgroundColor: filterStatus === status ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.06)',
                    border: filterStatus === status ? '1px solid rgba(201,162,39,0.4)' : '1px solid transparent',
                  }}
                >
                  <div className="text-xl font-bold text-white">{count}</div>
                  <div className="text-[11px] mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search programme, facilitator, or ID..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227]"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50"
            style={{
              borderColor: activeFiltersCount > 0 ? '#C9A227' : 'rgba(10,22,40,0.12)',
              color: activeFiltersCount > 0 ? '#A07D18' : 'rgba(10,22,40,0.5)',
              backgroundColor: activeFiltersCount > 0 ? 'rgba(201,162,39,0.06)' : 'white',
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#C9A227', color: '#0A1628' }}>
                {activeFiltersCount}
              </span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: 'rgba(10,22,40,0.4)' }}>
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl border p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Status</label>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as DeliveryStatus | ''); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}>
                <option value="">All</option>
                {(['Scheduled', 'In Progress', 'Completed', 'Cancelled'] as DeliveryStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Mode</label>
              <select value={filterMode} onChange={(e) => { setFilterMode(e.target.value as DeliveryMode | ''); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}>
                <option value="">All</option>
                {(['In-Person', 'Virtual', 'Blended'] as DeliveryMode[]).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Department</label>
              <select value={filterDept} onChange={(e) => { setFilterDept(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}>
                <option value="">All</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>From</label>
              <input type="date" value={filterFrom} onChange={(e) => { setFilterFrom(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>To</label>
              <input type="date" value={filterTo} onChange={(e) => { setFilterTo(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }} />
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border py-20 text-center" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(10,22,40,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>No programmes match your filters.</p>
          </div>
        ) : view === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginated.map((prog) => {
                const modeStyle = MODE_STYLES[prog.mode];
                const statusStyle = STATUS_STYLES[prog.status];
                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-md"
                    style={{ borderColor: 'rgba(10,22,40,0.08)' }}
                  >
                    <div className="px-5 pt-5 pb-4 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge bg={statusStyle.bg} text={statusStyle.text}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                            {prog.status}
                          </Badge>
                          <Badge bg={modeStyle.bg} text={modeStyle.text}>
                            {modeStyle.icon}
                            {prog.mode}
                          </Badge>
                        </div>
                        <span className="font-mono text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(10,22,40,0.3)' }}>{prog.id}</span>
                      </div>

                      <h3 className="text-base font-semibold leading-snug mb-3" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
                        {prog.name}
                      </h3>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(10,22,40,0.5)' }}>
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formatDate(prog.deliveryDate)} · {formatTime(prog.deliveryTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(10,22,40,0.5)' }}>
                          <User className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{prog.facilitator}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(10,22,40,0.5)' }}>
                          <Users className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{prog.department}</span>
                        </div>
                      </div>

                      <AttendanceBar enrolled={prog.enrolled} confirmed={prog.confirmed} />
                    </div>

                    <div className="px-5 py-3.5 border-t" style={{ borderColor: 'rgba(10,22,40,0.06)', backgroundColor: '#FAFAF8' }}>
                      <button
                        onClick={() => setSelectedId(prog.id)}
                        className="w-full py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                        style={{ backgroundColor: '#0A1628', color: 'white' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors bg-white border" style={{ borderColor: 'rgba(10,22,40,0.1)' }}>
                    <ChevronLeft className="w-4 h-4" style={{ color: '#0A1628' }} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: page === n ? '#0A1628' : 'white', color: page === n ? 'white' : 'rgba(10,22,40,0.5)', border: '1px solid', borderColor: page === n ? '#0A1628' : 'rgba(10,22,40,0.1)' }}>
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors bg-white border" style={{ borderColor: 'rgba(10,22,40,0.1)' }}>
                    <ChevronRight className="w-4 h-4" style={{ color: '#0A1628' }} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <thead>
                  <tr>
                    <TH label="ID" />
                    <TH label="Programme" field="name" />
                    <TH label="Date" field="deliveryDate" />
                    <TH label="Facilitator" />
                    <TH label="Department" field="department" />
                    <TH label="Mode" />
                    <TH label="Status" field="status" />
                    <TH label="Attendance" />
                    <TH label="" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((prog) => {
                    const modeStyle = MODE_STYLES[prog.mode];
                    const statusStyle = STATUS_STYLES[prog.status];
                    const pct = Math.round((prog.confirmed / prog.enrolled) * 100);
                    return (
                      <tr key={prog.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold" style={{ color: 'rgba(10,22,40,0.35)' }}>{prog.id}</span>
                        </td>
                        <td className="px-4 py-3.5 max-w-56">
                          <span className="font-medium text-sm leading-snug" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{prog.name}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="text-xs" style={{ color: '#0A1628' }}>{formatDate(prog.deliveryDate)}</div>
                          <div className="text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>{formatTime(prog.deliveryTime)}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.6)' }}>{prog.facilitator}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.6)' }}>{prog.department}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge bg={modeStyle.bg} text={modeStyle.text}>
                            {modeStyle.icon}
                            {prog.mode}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge bg={statusStyle.bg} text={statusStyle.text}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                            {prog.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 min-w-32">
                          <div className="text-xs mb-1" style={{ color: 'rgba(10,22,40,0.5)' }}>{prog.confirmed}/{prog.enrolled} <span className="font-semibold" style={{ color: pct >= 80 ? '#047857' : pct >= 50 ? '#B45309' : '#B91C1C' }}>{pct}%</span></div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(10,22,40,0.07)' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }} />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedId(prog.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-gray-50"
                            style={{ borderColor: 'rgba(10,22,40,0.1)', color: '#0A1628' }}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: '#FAFAF8' }}>
              <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-4 h-4" style={{ color: '#0A1628' }} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: page === n ? '#0A1628' : 'transparent', color: page === n ? 'white' : 'rgba(10,22,40,0.5)' }}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-4 h-4" style={{ color: '#0A1628' }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
