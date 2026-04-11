import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  X,
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Layers,
  Eye,
  Save,
  Send,
  Tag,
} from 'lucide-react';

type Status = 'Draft' | 'In Review' | 'Approved';
type Modality = 'Workshop' | 'E-Learning' | 'Blended';

interface Blueprint {
  id: string;
  title: string;
  department: string;
  duration: string;
  modality: Modality;
  status: Status;
  updatedAt: string;
  targetAudience: string;
  objectives: string[];
  prerequisites: string;
  assessmentMethod: string;
  resources: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 'BP-001',
    title: 'Bancassurance Sales Mastery',
    department: 'Bancassurance Retail',
    duration: '3 days',
    modality: 'Blended',
    status: 'Approved',
    updatedAt: '2026-03-18',
    targetAudience: 'Bancassurance officers and relationship managers across partner bank branches',
    objectives: [
      'Apply needs-based selling techniques to identify insurance gaps for retail customers',
      'Demonstrate product knowledge across the endowment, term, and health portfolio',
      'Handle objections confidently using the LAER framework',
    ],
    prerequisites: 'Completion of D1 Needs Assessment and minimum 6 months in bancassurance role',
    assessmentMethod: 'Role-play assessment (40%) + written product knowledge test (60%)',
    resources: 'Sales playbook, HNBA product brochures, objection-handling flashcards, LMS modules',
  },
  {
    id: 'BP-002',
    title: 'Claims Excellence Programme',
    department: 'Claims',
    duration: '2 days',
    modality: 'Workshop',
    status: 'Approved',
    updatedAt: '2026-02-05',
    targetAudience: 'Claims assessors, senior claims officers, and branch claims coordinators',
    objectives: [
      'Apply the revised IRCSL motor claims circular requirements to daily case management',
      'Complete documentation accurately to achieve first-submission acceptance rates above 95%',
      'Manage customer communication throughout the claims lifecycle professionally',
    ],
    prerequisites: 'Active claims handling experience of at least 12 months',
    assessmentMethod: 'Case study assessment using three scenario-based claims files',
    resources: 'IRCSL motor claims circular, claims system walkthrough guide, documentation SOP manual',
  },
  {
    id: 'BP-003',
    title: 'AML & CFT Certification',
    department: 'Legal & Compliance',
    duration: '1.5 days',
    modality: 'Blended',
    status: 'Approved',
    updatedAt: '2026-01-12',
    targetAudience: 'All customer-facing staff and compliance team members',
    objectives: [
      'Identify red flags for money laundering and terrorist financing in insurance transactions',
      'Apply CDD and enhanced due diligence processes to new business and claims',
      'Complete STR filing within the regulatory timeframe using correct FIAU templates',
    ],
    prerequisites: 'None — mandatory for all staff',
    assessmentMethod: 'Online proctored assessment (pass mark 75%) + annual recertification',
    resources: 'FIAU guidelines, CDD checklist, STR filing template, LMS e-learning modules',
  },
  {
    id: 'BP-004',
    title: 'IFRS 17 Technical Mastery',
    department: 'Finance',
    duration: '4 days',
    modality: 'Workshop',
    status: 'In Review',
    updatedAt: '2026-03-29',
    targetAudience: 'Finance managers, actuarial staff, and financial controllers',
    objectives: [
      'Apply the Variable Fee Approach and Building Block Approach to policy groups',
      'Prepare and reconcile the CSM roll-forward schedule for statutory reporting',
      'Interpret IFRS 17 disclosure requirements for the board audit committee',
    ],
    prerequisites: 'IFRS 4 or finance degree-level qualification; minimum 3 years in insurance finance',
    assessmentMethod: 'Worked case study submission with peer review and facilitator marking',
    resources: 'IFRS 17 standard text, actuarial model templates, worked examples library',
  },
  {
    id: 'BP-005',
    title: 'Leadership for Mid-Level Managers',
    department: 'HR & Talent',
    duration: '5 days (modular)',
    modality: 'Blended',
    status: 'Draft',
    updatedAt: '2026-04-02',
    targetAudience: 'Grade 4–6 managers across all business units',
    objectives: [
      'Apply the GROW coaching model in weekly one-to-one conversations with direct reports',
      'Facilitate performance review conversations that are constructive and motivating',
      'Lead change communications using the ADKAR framework',
    ],
    prerequisites: 'Minimum 12 months in a people-management role',
    assessmentMethod: '360-degree feedback at programme entry and 90 days post-completion',
    resources: 'Leadership toolkit, GROW conversation guide, HNB Assurance competency framework',
  },
  {
    id: 'BP-006',
    title: 'Underwriting Fundamentals – P&C',
    department: 'Underwriting',
    duration: '3 days',
    modality: 'Workshop',
    status: 'In Review',
    updatedAt: '2026-03-10',
    targetAudience: 'Junior and mid-level underwriters in the property and casualty division',
    objectives: [
      'Assess property risk using the HNB Assurance risk scoring matrix',
      'Price standard P&C policies within authority limits using approved rate tables',
      'Apply treaty reinsurance rules and exclusion clauses correctly to policy wordings',
    ],
    prerequisites: 'SLII Foundation Certificate or equivalent; minimum 6 months in underwriting',
    assessmentMethod: 'Written paper (50%) + underwriting case file review (50%)',
    resources: 'P&C rate manual, SLII study materials, treaty reinsurance slip, risk scoring matrix',
  },
];

const DEPARTMENTS = [...new Set(BLUEPRINTS.map((b) => b.department))].sort();
const STATUSES: Status[] = ['Draft', 'In Review', 'Approved'];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: Status }) {
  const map = {
    Draft: { bg: 'rgba(245,158,11,0.09)', text: '#92400E', dot: '#F59E0B' },
    'In Review': { bg: 'rgba(59,130,246,0.09)', text: '#1D4ED8', dot: '#3B82F6' },
    Approved: { bg: 'rgba(16,185,129,0.09)', text: '#065F46', dot: '#10B981' },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

function ModalityBadge({ modality }: { modality: Modality }) {
  const map = {
    Workshop: { bg: 'rgba(10,22,40,0.07)', text: '#0A1628' },
    'E-Learning': { bg: 'rgba(201,162,39,0.1)', text: '#7A5B0A' },
    Blended: { bg: 'rgba(99,102,241,0.08)', text: '#3730A3' },
  };
  const s = map[modality];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.text }}>
      <Layers className="w-3 h-3" />
      {modality}
    </span>
  );
}

interface WorkspaceForm {
  title: string;
  targetAudience: string;
  objectives: string[];
  modality: Modality | '';
  duration: string;
  prerequisites: string;
  assessmentMethod: string;
  resources: string;
  department: string;
}

const emptyForm: WorkspaceForm = {
  title: '',
  targetAudience: '',
  objectives: [''],
  modality: '',
  duration: '',
  prerequisites: '',
  assessmentMethod: '',
  resources: '',
  department: '',
};

function LivePreview({ form }: { form: WorkspaceForm }) {
  const filled = form.title || form.targetAudience || form.objectives.some((o) => o.trim());
  if (!filled) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
        <Eye className="w-10 h-10 mb-3" style={{ color: 'rgba(10,22,40,0.15)' }} />
        <p className="text-sm font-medium" style={{ color: 'rgba(10,22,40,0.3)' }}>Fill in the form to see a live preview of the blueprint.</p>
      </div>
    );
  }
  return (
    <div className="p-5 space-y-4">
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.1)' }}>
        <div className="px-5 py-4" style={{ backgroundColor: '#0A1628' }}>
          <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>{form.title || 'Untitled Blueprint'}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {form.department && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(201,162,39,0.18)', color: '#C9A227' }}>{form.department}</span>
            )}
            {form.modality && <ModalityBadge modality={form.modality as Modality} />}
            {form.duration && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <Clock className="w-3 h-3" /> {form.duration}
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-4 space-y-3" style={{ backgroundColor: 'white' }}>
          {form.targetAudience && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3 h-3" style={{ color: '#C9A227' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>Target Audience</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>{form.targetAudience}</p>
            </div>
          )}

          {form.objectives.some((o) => o.trim()) && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3 h-3" style={{ color: '#C9A227' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>Learning Objectives</span>
              </div>
              <ul className="space-y-1">
                {form.objectives.filter((o) => o.trim()).map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#A07D18' }}>{i + 1}</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {form.assessmentMethod && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <FileText className="w-3 h-3" style={{ color: '#C9A227' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>Assessment</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>{form.assessmentMethod}</p>
            </div>
          )}

          {form.prerequisites && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3 h-3" style={{ color: '#C9A227' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>Prerequisites</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>{form.prerequisites}</p>
            </div>
          )}

          {form.resources && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3 h-3" style={{ color: '#C9A227' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.4)' }}>Resources</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.65)' }}>{form.resources}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#F7F5F0', borderTop: '1px solid rgba(10,22,40,0.07)' }}>
          <StatusBadge status="Draft" />
          <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.35)' }}>Preview — Draft</span>
        </div>
      </div>
    </div>
  );
}

export default function ProgrammeDesign() {
  const [activeTab, setActiveTab] = useState<'library' | 'workspace'>('library');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | ''>('');
  const [search, setSearch] = useState('');
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [form, setForm] = useState<WorkspaceForm>(emptyForm);
  const [savedDraft, setSavedDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    return BLUEPRINTS.filter((b) => {
      if (filterDept && b.department !== filterDept) return false;
      if (filterStatus && b.status !== filterStatus) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.department.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterDept, filterStatus, search]);

  function addObjective() {
    setForm((f) => ({ ...f, objectives: [...f.objectives, ''] }));
  }

  function updateObjective(i: number, val: string) {
    setForm((f) => {
      const objs = [...f.objectives];
      objs[i] = val;
      return { ...f, objectives: objs };
    });
  }

  function removeObjective(i: number) {
    setForm((f) => ({ ...f, objectives: f.objectives.filter((_, idx) => idx !== i) }));
  }

  function handleSaveDraft() {
    setSavedDraft(true);
    setSubmitted(false);
    setTimeout(() => setSavedDraft(false), 3000);
  }

  function handleSubmit() {
    setSubmitted(true);
    setSavedDraft(false);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handleOpenBlueprint(b: Blueprint) {
    setForm({
      title: b.title,
      targetAudience: b.targetAudience,
      objectives: b.objectives,
      modality: b.modality,
      duration: b.duration,
      prerequisites: b.prerequisites,
      assessmentMethod: b.assessmentMethod,
      resources: b.resources,
      department: b.department,
    });
    setActiveTab('workspace');
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-offset-0";
  const inputStyle = { borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontFamily: 'Inter, sans-serif' };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="rounded-2xl px-6 py-5" style={{ backgroundColor: '#0A1628' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>Programme Design</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>6Ds Framework — D2: Design the Complete Experience</p>
          </div>
          {activeTab === 'library' && (
            <button
              onClick={() => { setForm(emptyForm); setActiveTab('workspace'); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              <Plus className="w-4 h-4" /> New Blueprint
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-2xl w-fit" style={{ backgroundColor: 'rgba(10,22,40,0.06)' }}>
        {(['library', 'workspace'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab ? '#0A1628' : 'transparent',
              color: activeTab === tab ? 'white' : 'rgba(10,22,40,0.5)',
            }}
          >
            {tab === 'library' ? 'Blueprint Library' : 'Design Workspace'}
          </button>
        ))}
      </div>

      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white flex-1 min-w-[200px]" style={{ borderColor: 'rgba(10,22,40,0.12)' }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(10,22,40,0.3)' }} />
              <input
                type="text"
                placeholder="Search blueprints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm outline-none flex-1 bg-transparent"
                style={{ color: '#0A1628' }}
              />
              {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5" style={{ color: 'rgba(10,22,40,0.3)' }} /></button>}
            </div>
            <Filter className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.3)' }} />
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-3 py-2 rounded-xl border bg-white text-sm outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | '')} className="px-3 py-2 rounded-xl border bg-white text-sm outline-none" style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628' }}>
              <option value="">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {(filterDept || filterStatus || search) && (
              <button onClick={() => { setFilterDept(''); setFilterStatus(''); setSearch(''); }} className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70" style={{ color: 'rgba(10,22,40,0.4)' }}>
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(10,22,40,0.15)' }} />
              <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>No blueprints match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-semibold leading-snug" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{b.title}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#7A5B0A' }}>
                        <Tag className="w-3 h-3" /> {b.department}
                      </span>
                      <ModalityBadge modality={b.modality} />
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(10,22,40,0.4)' }}>
                        <Clock className="w-3 h-3" /> {b.duration}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'rgba(10,22,40,0.35)' }}>Updated {formatDate(b.updatedAt)}</p>
                  </div>

                  {openCard === b.id && (
                    <div className="px-5 pb-4 space-y-2.5 border-t" style={{ borderColor: 'rgba(10,22,40,0.06)', backgroundColor: '#FAFAF8' }}>
                      <div className="pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(10,22,40,0.35)' }}>Target Audience</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)' }}>{b.targetAudience}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(10,22,40,0.35)' }}>Objectives</p>
                        <ul className="space-y-1">
                          {b.objectives.map((o, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)' }}>
                              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#A07D18' }}>{i + 1}</span>
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(10,22,40,0.35)' }}>Assessment</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.6)' }}>{b.assessmentMethod}</p>
                      </div>
                    </div>
                  )}

                  <div className="px-5 py-3 flex items-center gap-2 border-t" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
                    <button
                      onClick={() => setOpenCard(openCard === b.id ? null : b.id)}
                      className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: 'rgba(10,22,40,0.4)' }}
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openCard === b.id ? 'rotate-180' : ''}`} />
                      {openCard === b.id ? 'Hide' : 'Preview'}
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleOpenBlueprint(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor: '#C9A227', color: '#A07D18', backgroundColor: 'rgba(201,162,39,0.06)' }}
                    >
                      Open Blueprint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Blueprint Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Programme Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Bancassurance Sales Mastery" className={inputCls} style={{ ...inputStyle, borderColor: 'rgba(10,22,40,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Department</label>
                  <div className="relative">
                    <select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className={inputCls + ' appearance-none pr-8'} style={inputStyle}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Modality</label>
                  <div className="relative">
                    <select value={form.modality} onChange={(e) => setForm((f) => ({ ...f, modality: e.target.value as Modality }))} className={inputCls + ' appearance-none pr-8'} style={inputStyle}>
                      <option value="">Select modality</option>
                      {(['Workshop', 'E-Learning', 'Blended'] as Modality[]).map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Duration</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3 days" className={inputCls} style={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Target Audience</label>
                  <textarea value={form.targetAudience} onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))} placeholder="Describe the intended participants..." className={inputCls} style={{ ...inputStyle, minHeight: '72px', resize: 'none' }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Learning Objectives</label>
                <button onClick={addObjective} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#7A5B0A' }}>
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-2" style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#A07D18' }}>{i + 1}</span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(i, e.target.value)}
                      placeholder={`Objective ${i + 1}`}
                      className={inputCls + ' flex-1'}
                      style={inputStyle}
                    />
                    {form.objectives.length > 1 && (
                      <button onClick={() => removeObjective(i)} className="mt-2 p-1 rounded-lg hover:opacity-70 transition-opacity flex-shrink-0" style={{ color: 'rgba(10,22,40,0.3)' }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Additional Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Prerequisites</label>
                  <textarea value={form.prerequisites} onChange={(e) => setForm((f) => ({ ...f, prerequisites: e.target.value }))} placeholder="Required knowledge, experience, or prior courses..." className={inputCls} style={{ ...inputStyle, minHeight: '68px', resize: 'none' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Assessment Method</label>
                  <textarea value={form.assessmentMethod} onChange={(e) => setForm((f) => ({ ...f, assessmentMethod: e.target.value }))} placeholder="Describe how learning will be assessed..." className={inputCls} style={{ ...inputStyle, minHeight: '68px', resize: 'none' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Resources Required</label>
                  <textarea value={form.resources} onChange={(e) => setForm((f) => ({ ...f, resources: e.target.value }))} placeholder="Materials, tools, facilitators, venues..." className={inputCls} style={{ ...inputStyle, minHeight: '68px', resize: 'none' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: '#0A1628', color: '#0A1628', backgroundColor: 'white' }}
              >
                <Save className="w-4 h-4" />
                {savedDraft ? 'Saved!' : 'Save as Draft'}
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
              >
                <Send className="w-4 h-4" />
                {submitted ? 'Submitted for Review!' : 'Submit for Review'}
              </button>
              {(savedDraft || submitted) && (
                <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#047857' }}>
                  <CheckCircle className="w-4 h-4" />
                  {savedDraft ? 'Draft saved successfully' : 'Submitted to L&D team'}
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="sticky top-4 rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.09)', backgroundColor: 'white' }}>
              <div className="px-5 py-3.5 border-b flex items-center gap-2" style={{ borderColor: 'rgba(10,22,40,0.07)', backgroundColor: '#F7F5F0' }}>
                <Eye className="w-4 h-4" style={{ color: 'rgba(10,22,40,0.4)' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(10,22,40,0.5)' }}>Live Preview</span>
              </div>
              <LivePreview form={form} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
