import { useState, useMemo } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown as ExpandIcon,
  ChevronUp as CollapseIcon,
  SlidersHorizontal,
  X,
} from 'lucide-react';

type ProgrammeType = 'Workshop' | 'E-Learning' | 'Coaching';
type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Pending' | 'In Review' | 'Approved' | 'Rejected';
type SortDir = 'asc' | 'desc' | null;

interface Request {
  id: string;
  requestorName: string;
  department: string;
  programmeType: ProgrammeType;
  submittedDate: string;
  priority: Priority;
  status: Status;
  aiClassified: boolean;
  summary: string;
  aiRecommendation?: string;
}

const MOCK_DATA: Request[] = [
  {
    id: 'REQ-0041',
    requestorName: 'Nimal Perera',
    department: 'Bancassurance Retail',
    programmeType: 'Workshop',
    submittedDate: '2026-03-28',
    priority: 'High',
    status: 'In Review',
    aiClassified: true,
    summary: 'Requesting a two-day sales excellence workshop for the Colombo retail team ahead of the Q2 campaign season. 18 staff members identified for participation.',
    aiRecommendation: 'High alignment with Q2 sales targets. Recommend approval. Suggested facilitator: external SL Institute of Marketing.',
  },
  {
    id: 'REQ-0040',
    requestorName: 'Chamari Silva',
    department: 'Claims',
    programmeType: 'E-Learning',
    submittedDate: '2026-03-25',
    priority: 'Medium',
    status: 'Approved',
    aiClassified: true,
    summary: 'E-learning module on claims processing SOP updates following the new regulatory guidelines issued in February 2026. Applies to all claims officers.',
    aiRecommendation: 'Compliance-critical. Strongly recommend approval and completion within 30 days.',
  },
  {
    id: 'REQ-0039',
    requestorName: 'Ruwan Jayasinghe',
    department: 'Underwriting',
    programmeType: 'Coaching',
    submittedDate: '2026-03-22',
    priority: 'Low',
    status: 'Pending',
    aiClassified: false,
    summary: 'One-on-one coaching for two senior underwriters on complex risk assessment for large commercial accounts.',
    aiRecommendation: undefined,
  },
  {
    id: 'REQ-0038',
    requestorName: 'Dilani Fernando',
    department: 'HR & Talent',
    programmeType: 'Workshop',
    submittedDate: '2026-03-20',
    priority: 'High',
    status: 'Approved',
    aiClassified: true,
    summary: 'Leadership development workshop for mid-level managers across all business units. 24 participants nominated.',
    aiRecommendation: 'Strong strategic fit. Supports succession planning initiative. Recommend approval.',
  },
  {
    id: 'REQ-0037',
    requestorName: 'Asanka Bandara',
    department: 'IT & Digital',
    programmeType: 'E-Learning',
    submittedDate: '2026-03-18',
    priority: 'Medium',
    status: 'Rejected',
    aiClassified: true,
    summary: 'Cybersecurity awareness programme for all IT staff and users with system access. Vendor: ISACA Sri Lanka chapter.',
    aiRecommendation: 'Deferred — existing vendor contract covers this scope through June 2026.',
  },
  {
    id: 'REQ-0036',
    requestorName: 'Priya Wickramasinghe',
    department: 'Actuarial',
    programmeType: 'Coaching',
    submittedDate: '2026-03-15',
    priority: 'Medium',
    status: 'In Review',
    aiClassified: false,
    summary: 'Mentoring and coaching sessions for actuarial trainees preparing for professional examinations (CT series). Three staff members.',
    aiRecommendation: undefined,
  },
  {
    id: 'REQ-0035',
    requestorName: 'Kasun Rajapaksha',
    department: 'Finance',
    programmeType: 'Workshop',
    submittedDate: '2026-03-12',
    priority: 'High',
    status: 'Approved',
    aiClassified: true,
    summary: 'IFRS 17 implementation training for finance team. Critical for year-end reporting compliance. 12 participants.',
    aiRecommendation: 'Regulatory requirement. Urgent approval recommended. External facilitator from ICASL.',
  },
  {
    id: 'REQ-0034',
    requestorName: 'Tharaka Senanayake',
    department: 'Bancassurance Retail',
    programmeType: 'E-Learning',
    submittedDate: '2026-03-10',
    priority: 'Low',
    status: 'Pending',
    aiClassified: false,
    summary: 'Product knowledge refresh module for retail agents on the new LifeSecure Plus policy launched in March 2026.',
    aiRecommendation: undefined,
  },
  {
    id: 'REQ-0033',
    requestorName: 'Malini Gunawardena',
    department: 'Legal & Compliance',
    programmeType: 'Workshop',
    submittedDate: '2026-03-08',
    priority: 'High',
    status: 'In Review',
    aiClassified: true,
    summary: 'AML/CFT compliance training mandatory for customer-facing and finance roles per IRCSL directive. 35 staff across 5 departments.',
    aiRecommendation: 'Regulatory mandate. Recommend immediate scheduling. Aligns with IRCSL annual compliance calendar.',
  },
  {
    id: 'REQ-0032',
    requestorName: 'Ishara Dissanayake',
    department: 'Customer Experience',
    programmeType: 'Coaching',
    submittedDate: '2026-03-05',
    priority: 'Medium',
    status: 'Approved',
    aiClassified: true,
    summary: 'Customer empathy and service recovery coaching for CX frontline staff. 8 team leaders nominated following NPS review.',
    aiRecommendation: 'Directly addresses NPS decline in Q4 2025. High ROI potential. Recommend approval.',
  },
  {
    id: 'REQ-0031',
    requestorName: 'Vimukthi Ranatunga',
    department: 'Agency Distribution',
    programmeType: 'Workshop',
    submittedDate: '2026-03-02',
    priority: 'Medium',
    status: 'Pending',
    aiClassified: false,
    summary: 'Agency onboarding workshop for 20 newly contracted agents in the Southern Province. Three-day induction programme.',
    aiRecommendation: undefined,
  },
  {
    id: 'REQ-0030',
    requestorName: 'Sanduni Amarasinghe',
    department: 'HR & Talent',
    programmeType: 'E-Learning',
    submittedDate: '2026-02-28',
    priority: 'Low',
    status: 'Approved',
    aiClassified: true,
    summary: 'Annual performance management refresher for all people managers. Updated to reflect new KPI framework for 2026.',
    aiRecommendation: 'Supports HR transformation roadmap. Low cost, high reach. Recommend approval.',
  },
  {
    id: 'REQ-0029',
    requestorName: 'Lasith Maduwantha',
    department: 'IT & Digital',
    programmeType: 'Workshop',
    submittedDate: '2026-02-25',
    priority: 'High',
    status: 'In Review',
    aiClassified: true,
    summary: 'Agile and Scrum certification workshop for digital transformation project team. 10 staff, external trainer from PMI Sri Lanka.',
    aiRecommendation: 'Aligns with digital transformation OKRs. Prioritise — project kick-off is in May.',
  },
  {
    id: 'REQ-0028',
    requestorName: 'Nadeesha Koswatte',
    department: 'Actuarial',
    programmeType: 'E-Learning',
    submittedDate: '2026-02-20',
    priority: 'Medium',
    status: 'Rejected',
    aiClassified: false,
    summary: 'Excel and data visualisation course for actuarial support staff. Requested vendor: Coursera Business.',
    aiRecommendation: undefined,
  },
  {
    id: 'REQ-0027',
    requestorName: 'Dulanjana Pathirana',
    department: 'Claims',
    programmeType: 'Coaching',
    submittedDate: '2026-02-18',
    priority: 'Low',
    status: 'Approved',
    aiClassified: true,
    summary: 'Structured coaching programme for two claims investigators on complex medical insurance fraud detection techniques.',
    aiRecommendation: 'Contributes to fraud loss reduction goal. Recommend approval with 60-day timeline.',
  },
  {
    id: 'REQ-0026',
    requestorName: 'Thilanka Nanayakkara',
    department: 'Finance',
    programmeType: 'Workshop',
    submittedDate: '2026-02-14',
    priority: 'Medium',
    status: 'Pending',
    aiClassified: false,
    summary: 'Tax planning and SLFRS updates workshop for finance and accounting staff. Facilitator from KPMG Sri Lanka.',
    aiRecommendation: undefined,
  },
];

const DEPARTMENTS = [...new Set(MOCK_DATA.map((r) => r.department))].sort();

const PROGRAMME_TYPE_STYLES: Record<ProgrammeType, { bg: string; text: string }> = {
  Workshop: { bg: 'rgba(14,165,233,0.1)', text: '#0284C7' },
  'E-Learning': { bg: 'rgba(5,150,105,0.1)', text: '#047857' },
  Coaching: { bg: 'rgba(245,158,11,0.1)', text: '#B45309' },
};

const PRIORITY_STYLES: Record<Priority, { bg: string; text: string; dot: string }> = {
  High: { bg: 'rgba(239,68,68,0.08)', text: '#B91C1C', dot: '#EF4444' },
  Medium: { bg: 'rgba(245,158,11,0.08)', text: '#B45309', dot: '#F59E0B' },
  Low: { bg: 'rgba(5,150,105,0.08)', text: '#047857', dot: '#10B981' },
};

const STATUS_STYLES: Record<Status, { bg: string; text: string }> = {
  Pending: { bg: 'rgba(107,114,128,0.08)', text: '#374151' },
  'In Review': { bg: 'rgba(59,130,246,0.08)', text: '#1D4ED8' },
  Approved: { bg: 'rgba(5,150,105,0.08)', text: '#047857' },
  Rejected: { bg: 'rgba(239,68,68,0.08)', text: '#B91C1C' },
};

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

function StatusDot({ color }: { color: string }) {
  return <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />;
}

function formatDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

type SortField = keyof Pick<Request, 'id' | 'requestorName' | 'department' | 'submittedDate' | 'priority' | 'status'>;

interface SortState {
  field: SortField | null;
  dir: SortDir;
}

function SortIcon({ field, sort }: { field: SortField; sort: SortState }) {
  if (sort.field !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />;
  return sort.dir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5" style={{ color: '#C9A227' }} />
    : <ChevronDown className="w-3.5 h-3.5" style={{ color: '#C9A227' }} />;
}

const PRIORITY_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
const STATUS_ORDER: Record<Status, number> = { 'In Review': 0, Pending: 1, Approved: 2, Rejected: 3 };

function sortData(data: Request[], sort: SortState): Request[] {
  if (!sort.field || !sort.dir) return data;
  return [...data].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    if (sort.field === 'priority') return dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sort.field === 'status') return dir * (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    const va = a[sort.field as SortField] as string;
    const vb = b[sort.field as SortField] as string;
    return dir * va.localeCompare(vb);
  });
}

interface ExpandedRowProps {
  request: Request;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

function ExpandedRow({ request, onApprove, onReject, onClose }: ExpandedRowProps) {
  const canAction = request.status === 'Pending' || request.status === 'In Review';
  return (
    <div
      className="border-t px-6 py-5"
      style={{ backgroundColor: '#FAFAF8', borderColor: 'rgba(10,22,40,0.07)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>
          Request Summary
        </h4>
        <button onClick={onClose} className="text-xs flex items-center gap-1 hover:opacity-60 transition-opacity" style={{ color: 'rgba(10,22,40,0.4)' }}>
          <CollapseIcon className="w-3.5 h-3.5" /> Collapse
        </button>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: '#0A1628' }}>{request.summary}</p>

      {request.aiRecommendation && (
        <div
          className="rounded-xl p-4 mb-4 border"
          style={{ backgroundColor: 'rgba(201,162,39,0.05)', borderColor: 'rgba(201,162,39,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              AI
            </span>
            <span className="text-xs font-semibold" style={{ color: '#A07D18' }}>AI Recommendation</span>
          </div>
          <p className="text-sm" style={{ color: '#6B5A1F' }}>{request.aiRecommendation}</p>
        </div>
      )}

      {canAction && (
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onApprove}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#047857' }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#B91C1C' }}
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 10;

export default function AllRequests() {
  const [requests, setRequests] = useState<Request[]>(MOCK_DATA);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | ''>('');
  const [filterDept, setFilterDept] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [sort, setSort] = useState<SortState>({ field: 'submittedDate', dir: 'desc' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let data = requests.filter((r) => {
      const q = search.toLowerCase();
      if (q && !r.requestorName.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterDept && r.department !== filterDept) return false;
      if (filterPriority && r.priority !== filterPriority) return false;
      if (filterFrom && r.submittedDate < filterFrom) return false;
      if (filterTo && r.submittedDate > filterTo) return false;
      return true;
    });
    return sortData(data, sort);
  }, [requests, search, filterStatus, filterDept, filterPriority, filterFrom, filterTo, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      dir: prev.field === field ? (prev.dir === 'asc' ? 'desc' : prev.dir === 'desc' ? null : 'asc') : 'asc',
    }));
    setPage(1);
  };

  const handleAction = (id: string, newStatus: Status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setExpandedId(null);
  };

  const activeFiltersCount = [filterStatus, filterDept, filterPriority, filterFrom, filterTo].filter(Boolean).length;

  const clearFilters = () => {
    setFilterStatus('');
    setFilterDept('');
    setFilterPriority('');
    setFilterFrom('');
    setFilterTo('');
    setPage(1);
  };

  const TH = ({
    label,
    field,
    className = '',
  }: {
    label: string;
    field?: SortField;
    className?: string;
  }) => (
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
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}
          >
            All Requests
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)', fontFamily: 'Inter, sans-serif' }}>
            {filtered.length} request{filtered.length !== 1 ? 's' : ''} across the organisation
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or request ID..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#C9A22730] focus:border-[#C9A227]"
            style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50 relative"
          style={{
            borderColor: activeFiltersCount > 0 ? '#C9A227' : 'rgba(10,22,40,0.12)',
            color: activeFiltersCount > 0 ? '#A07D18' : 'rgba(10,22,40,0.5)',
            backgroundColor: activeFiltersCount > 0 ? 'rgba(201,162,39,0.06)' : 'white',
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(10,22,40,0.4)' }}
          >
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {showFilters && (
        <div
          className="bg-white rounded-2xl border p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3"
          style={{ borderColor: 'rgba(10,22,40,0.08)' }}
        >
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as Status | ''); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            >
              <option value="">All</option>
              {(['Pending', 'In Review', 'Approved', 'Rejected'] as Status[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Department</label>
            <select
              value={filterDept}
              onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            >
              <option value="">All</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => { setFilterPriority(e.target.value as Priority | ''); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            >
              <option value="">All</option>
              {(['High', 'Medium', 'Low'] as Priority[]).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>From</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => { setFilterFrom(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(10,22,40,0.4)' }}>To</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => { setFilterTo(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr>
                <TH label="Request ID" field="id" />
                <TH label="Requestor" field="requestorName" />
                <TH label="Department" field="department" />
                <TH label="Programme Type" />
                <TH label="Submitted" field="submittedDate" />
                <TH label="Priority" field="priority" />
                <TH label="Status" field="status" />
                <TH label="AI" />
                <TH label="Actions" className="text-right" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-sm" style={{ color: 'rgba(10,22,40,0.35)' }}>
                    No requests match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((req) => {
                  const isExpanded = expandedId === req.id;
                  const typeStyle = PROGRAMME_TYPE_STYLES[req.programmeType];
                  const priorityStyle = PRIORITY_STYLES[req.priority];
                  const statusStyle = STATUS_STYLES[req.status];
                  return (
                    <>
                      <tr
                        key={req.id}
                        className="border-t transition-colors"
                        style={{
                          borderColor: 'rgba(10,22,40,0.06)',
                          backgroundColor: isExpanded ? 'rgba(201,162,39,0.03)' : 'white',
                        }}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold" style={{ color: '#0A1628' }}>{req.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-sm" style={{ color: '#0A1628' }}>{req.requestorName}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>{req.department}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge bg={typeStyle.bg} text={typeStyle.text}>{req.programmeType}</Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.55)' }}>{formatDate(req.submittedDate)}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge bg={priorityStyle.bg} text={priorityStyle.text}>
                            <StatusDot color={priorityStyle.dot} />
                            {req.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge bg={statusStyle.bg} text={statusStyle.text}>{req.status}</Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          {req.aiClassified && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
                            >
                              AI
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : req.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-gray-50"
                            style={{ borderColor: 'rgba(10,22,40,0.1)', color: '#0A1628' }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                            {isExpanded
                              ? <CollapseIcon className="w-3 h-3" />
                              : <ExpandIcon className="w-3 h-3" />
                            }
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${req.id}-expanded`} style={{ backgroundColor: '#FAFAF8' }}>
                          <td colSpan={9} className="p-0">
                            <ExpandedRow
                              request={req}
                              onApprove={() => handleAction(req.id, 'Approved')}
                              onReject={() => handleAction(req.id, 'Rejected')}
                              onClose={() => setExpandedId(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: '#FAFAF8' }}
        >
          <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)', fontFamily: 'Inter, sans-serif' }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#0A1628' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | '...')[]>((acc, n, i, arr) => {
                if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((item, i) =>
                item === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-xs" style={{ color: 'rgba(10,22,40,0.3)' }}>…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: page === item ? '#0A1628' : 'transparent',
                      color: page === item ? 'white' : 'rgba(10,22,40,0.5)',
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" style={{ color: '#0A1628' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
