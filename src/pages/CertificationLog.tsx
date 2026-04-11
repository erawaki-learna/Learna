import { useState, useMemo } from 'react';
import {
  Award,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Download,
  Search,
  Filter,
  FileDown,
  ChevronDown,
  Calendar,
} from 'lucide-react';

type CertType = 'Internal' | 'External' | 'Regulatory';
type CertStatus = 'Valid' | 'Expiring' | 'Expired';

interface Cert {
  id: number;
  name: string;
  department: string;
  programme: string;
  certType: CertType;
  issueDate: string;
  expiryDate: string;
  status: CertStatus;
}

const DATA: Cert[] = [
  { id: 1, name: 'Thilini Wickramasinghe', department: 'Bancassurance Retail', programme: 'AML/CFT Foundation Programme', certType: 'Regulatory', issueDate: '15 Jan 2025', expiryDate: '14 Jan 2026', status: 'Expiring' },
  { id: 2, name: 'Nimasha Fernando', department: 'Direct Sales', programme: 'IRCSL General Insurance Exam', certType: 'Regulatory', issueDate: '10 Mar 2024', expiryDate: '09 Mar 2026', status: 'Valid' },
  { id: 3, name: 'Kasun Jayawardena', department: 'Bancassurance Retail', programme: 'Product Knowledge Bootcamp', certType: 'Internal', issueDate: '22 Jun 2025', expiryDate: 'N/A', status: 'Valid' },
  { id: 4, name: 'Sandali Rathnayake', department: 'Bancassurance Retail', programme: 'Customer Experience Mastery', certType: 'Internal', issueDate: '03 Apr 2026', expiryDate: 'N/A', status: 'Valid' },
  { id: 5, name: 'Ruwan Silva', department: 'Agency', programme: 'CII Certificate in Insurance', certType: 'External', issueDate: '18 Aug 2023', expiryDate: '17 Aug 2025', status: 'Expired' },
  { id: 6, name: 'Dilshan Perera', department: 'Bancassurance Retail', programme: 'AML/CFT Foundation Programme', certType: 'Regulatory', issueDate: '20 Feb 2025', expiryDate: '19 Feb 2026', status: 'Expiring' },
  { id: 7, name: 'Priyanka Dissanayake', department: 'HR & Talent', programme: 'CIPM Practitioner Certificate', certType: 'External', issueDate: '05 Nov 2024', expiryDate: '04 Nov 2027', status: 'Valid' },
  { id: 8, name: 'Asitha Bandara', department: 'Direct Sales', programme: 'Data Privacy & PDPA 2022', certType: 'Regulatory', issueDate: '12 Sep 2023', expiryDate: '11 Sep 2025', status: 'Expired' },
  { id: 9, name: 'Thilini Wickramasinghe', department: 'Bancassurance Retail', programme: 'Leadership Essentials', certType: 'Internal', issueDate: '28 Jan 2026', expiryDate: 'N/A', status: 'Valid' },
  { id: 10, name: 'Roshan Mendis', department: 'Corporate Bancassurance', programme: 'IRCSL Life Insurance Licence', certType: 'Regulatory', issueDate: '01 Apr 2025', expiryDate: '31 Mar 2026', status: 'Expiring' },
  { id: 11, name: 'Chamari Senanayake', department: 'Claims', programme: 'Advanced Claims Handling', certType: 'Internal', issueDate: '17 Mar 2026', expiryDate: 'N/A', status: 'Valid' },
  { id: 12, name: 'Nimal Gunaratne', department: 'Underwriting', programme: 'CII Diploma in Insurance', certType: 'External', issueDate: '09 Jul 2024', expiryDate: '08 Jul 2027', status: 'Valid' },
];

const DEPARTMENTS = ['All Departments', ...Array.from(new Set(DATA.map((d) => d.department)))];
const STATUSES: CertStatus[] = ['Valid', 'Expiring', 'Expired'];
const CERT_TYPES: CertType[] = ['Internal', 'External', 'Regulatory'];

const STATUS_STYLE: Record<CertStatus, { bg: string; text: string; icon: typeof CheckCircle }> = {
  Valid: { bg: 'rgba(6,95,70,0.1)', text: '#065F46', icon: CheckCircle },
  Expiring: { bg: 'rgba(201,162,39,0.12)', text: '#92710F', icon: AlertTriangle },
  Expired: { bg: 'rgba(220,38,38,0.08)', text: '#B91C1C', icon: XCircle },
};

const TYPE_STYLE: Record<CertType, { bg: string; text: string }> = {
  Internal: { bg: 'rgba(10,22,40,0.07)', text: '#0A1628' },
  External: { bg: 'rgba(29,78,216,0.09)', text: '#1D4ED8' },
  Regulatory: { bg: 'rgba(124,58,237,0.09)', text: '#6D28D9' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: typeof Award;
  label: string;
  value: number | string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
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

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-lg border text-xs font-medium outline-none bg-white transition"
        style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', minWidth: '150px' }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
    </div>
  );
}

export default function CertificationLog() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const total = DATA.length;
  const expiring = DATA.filter((d) => d.status === 'Expiring').length;
  const expired = DATA.filter((d) => d.status === 'Expired').length;
  const thisMonth = DATA.filter((d) => d.issueDate.includes('2026')).length;

  const filtered = useMemo(() => {
    return DATA.filter((d) => {
      const q = search.toLowerCase().trim();
      if (q && !d.name.toLowerCase().includes(q) && !d.programme.toLowerCase().includes(q)) return false;
      if (deptFilter !== 'All Departments' && d.department !== deptFilter) return false;
      if (statusFilter !== 'All Statuses' && d.status !== statusFilter) return false;
      if (typeFilter !== 'All Types' && d.certType !== typeFilter) return false;
      return true;
    });
  }, [search, deptFilter, statusFilter, typeFilter]);

  function toggleAll() {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((d) => d.id)));
  }

  function toggleOne(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allChecked = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 pt-2">

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4" style={{ color: '#C9A227' }} />
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(10,22,40,0.4)' }}>L&D Administration</p>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Certification Log</h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>Track, verify, and export staff certifications across all divisions.</p>
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#0A1628', color: 'white' }}
            >
              <FileDown className="w-4 h-4" />
              Bulk Export {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Award} label="Total Issued" value={total} color="#0A1628" sub="All time" />
          <StatCard icon={AlertTriangle} label="Expiring in 30 Days" value={expiring} color="#C9A227" sub="Action required" />
          <StatCard icon={XCircle} label="Expired" value={expired} color="#B91C1C" sub="Renewal overdue" />
          <StatCard icon={CheckCircle} label="Issued This Year" value={thisMonth} color="#065F46" sub="2026 to date" />
        </div>

        <div className="bg-white rounded-2xl border mb-2 overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
              <input
                type="text"
                placeholder="Search name or programme…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none"
                style={{ borderColor: 'rgba(10,22,40,0.1)', color: '#0A1628' }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(10,22,40,0.35)' }} />
              <SelectFilter value={deptFilter} onChange={setDeptFilter} options={DEPARTMENTS} />
              <SelectFilter
                value={statusFilter}
                onChange={setStatusFilter}
                options={['All Statuses', ...STATUSES]}
              />
              <SelectFilter
                value={typeFilter}
                onChange={setTypeFilter}
                options={['All Types', ...CERT_TYPES]}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'rgba(247,245,240,0.8)' }}>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded accent-amber-600 cursor-pointer"
                    />
                  </th>
                  {['Name & Department', 'Programme', 'Type', 'Issue Date', 'Expiry Date', 'Status', ''].map((h) => (
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
                {filtered.map((d, i) => {
                  const ss = STATUS_STYLE[d.status];
                  const SIcon = ss.icon;
                  const ts = TYPE_STYLE[d.certType];
                  const isSelected = selectedIds.has(d.id);
                  return (
                    <tr
                      key={d.id}
                      className="transition-colors hover:bg-amber-50/25"
                      style={{
                        borderTop: i > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none',
                        backgroundColor: isSelected ? 'rgba(201,162,39,0.04)' : 'transparent',
                      }}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(d.id)}
                          className="w-3.5 h-3.5 rounded accent-amber-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-xs" style={{ color: '#0A1628' }}>{d.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>{d.department}</p>
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="text-xs font-medium truncate" style={{ color: '#0A1628' }}>{d.programme}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex text-[11px] font-bold px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: ts.bg, color: ts.text }}
                        >
                          {d.certType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: 'rgba(10,22,40,0.55)' }}>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.25)' }} />
                          {d.issueDate}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: d.expiryDate === 'N/A' ? 'rgba(10,22,40,0.3)' : 'rgba(10,22,40,0.55)' }}>
                        {d.expiryDate !== 'N/A' ? (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" style={{ color: 'rgba(10,22,40,0.25)' }} />
                            {d.expiryDate}
                          </span>
                        ) : (
                          <span className="italic text-[11px]">No expiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: ss.bg, color: ss.text }}
                        >
                          <SIcon className="w-3 h-3" />
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}
                        >
                          <Download className="w-3 h-3" />
                          Certificate
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: 'rgba(10,22,40,0.3)' }}>
                      No certifications match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
            <p className="text-xs" style={{ color: 'rgba(10,22,40,0.35)' }}>
              Showing {filtered.length} of {total} certifications
              {selectedIds.size > 0 && <span className="ml-2 font-semibold" style={{ color: '#C9A227' }}>{selectedIds.size} selected</span>}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
