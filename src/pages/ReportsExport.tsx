import { useState } from 'react';
import {
  BarChart2,
  BookOpen,
  TrendingUp,
  ArrowRightLeft,
  Download,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Calendar,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

type Format = 'PDF' | 'Excel' | 'CSV';
type ExportStatus = 'Ready' | 'Processing' | 'Failed';

interface ReportCard {
  id: string;
  icon: typeof BarChart2;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

const REPORT_CARDS: ReportCard[] = [
  {
    id: 'completion',
    icon: BookOpen,
    title: 'Training Completion Report',
    description: 'Programme completion rates, attendance, and assessment scores by department and period.',
    iconColor: '#065F46',
    iconBg: 'rgba(16,185,129,0.1)',
  },
  {
    id: 'needs',
    icon: BarChart2,
    title: 'Learning Needs Summary',
    description: 'Aggregated training requests, skill gaps identified, and priority themes across divisions.',
    iconColor: '#1D4ED8',
    iconBg: 'rgba(59,130,246,0.1)',
  },
  {
    id: 'roi',
    icon: TrendingUp,
    title: 'ROI & Impact Report',
    description: 'Training investment vs performance lift, KPIs improved, and productivity metrics post-training.',
    iconColor: '#C9A227',
    iconBg: 'rgba(201,162,39,0.1)',
  },
  {
    id: 'transfer',
    icon: ArrowRightLeft,
    title: 'Transfer Monitor Export',
    description: 'On-the-job transfer check-in data, manager observations, and behaviour change indicators.',
    iconColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.1)',
  },
];

interface RecentExport {
  id: number;
  name: string;
  generatedBy: string;
  date: string;
  format: Format;
  status: ExportStatus;
}

const RECENT_EXPORTS: RecentExport[] = [
  { id: 1, name: 'Training Completion — Q1 2026', generatedBy: 'Eranda Wakista', date: '09 Apr 2026', format: 'PDF', status: 'Ready' },
  { id: 2, name: 'Learning Needs Summary — Mar 2026', generatedBy: 'Nishantha Jayasinghe', date: '05 Apr 2026', format: 'Excel', status: 'Ready' },
  { id: 3, name: 'ROI & Impact — H2 2025', generatedBy: 'Eranda Wakista', date: '03 Apr 2026', format: 'PDF', status: 'Ready' },
  { id: 4, name: 'Transfer Monitor Export — Q1 2026', generatedBy: 'System', date: '01 Apr 2026', format: 'CSV', status: 'Processing' },
  { id: 5, name: 'Training Completion — Feb 2026', generatedBy: 'Eranda Wakista', date: '04 Mar 2026', format: 'Excel', status: 'Ready' },
  { id: 6, name: 'Learning Needs Summary — Jan 2026', generatedBy: 'Nishantha Jayasinghe', date: '03 Feb 2026', format: 'CSV', status: 'Failed' },
];

interface ScheduledReport {
  id: number;
  name: string;
  frequency: 'Weekly' | 'Monthly';
  nextRun: string;
  recipients: string;
  enabled: boolean;
}

const INITIAL_SCHEDULED: ScheduledReport[] = [
  { id: 1, name: 'Training Completion Report', frequency: 'Monthly', nextRun: '01 May 2026', recipients: 'L&D Team, HR Director', enabled: true },
  { id: 2, name: 'Learning Needs Summary', frequency: 'Weekly', nextRun: '14 Apr 2026', recipients: 'L&D Team', enabled: false },
];

const FORMAT_STYLES: Record<Format, { bg: string; color: string }> = {
  PDF: { bg: 'rgba(220,38,38,0.1)', color: '#991B1B' },
  Excel: { bg: 'rgba(16,185,129,0.1)', color: '#065F46' },
  CSV: { bg: 'rgba(10,22,40,0.07)', color: 'rgba(10,22,40,0.55)' },
};

const STATUS_STYLES: Record<ExportStatus, { bg: string; color: string; icon: typeof CheckCircle }> = {
  Ready: { bg: 'rgba(16,185,129,0.1)', color: '#065F46', icon: CheckCircle },
  Processing: { bg: 'rgba(201,162,39,0.1)', color: '#7A5B0A', icon: RefreshCw },
  Failed: { bg: 'rgba(220,38,38,0.1)', color: '#991B1B', icon: AlertCircle },
};

function FormatBadge({ format }: { format: Format }) {
  const s = FORMAT_STYLES[format];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {format}
    </span>
  );
}

function StatusBadge({ status }: { status: ExportStatus }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

interface CardFormState {
  dateFrom: string;
  dateTo: string;
  format: Format;
  generating: boolean;
}

function ReportCardItem({ card }: { card: ReportCard }) {
  const Icon = card.icon;
  const [form, setForm] = useState<CardFormState>({
    dateFrom: '2026-01-01',
    dateTo: '2026-03-31',
    format: 'PDF',
    generating: false,
  });

  function handleGenerate() {
    setForm((f) => ({ ...f, generating: true }));
    setTimeout(() => setForm((f) => ({ ...f, generating: false })), 2000);
  }

  return (
    <div
      className="bg-white rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: 'rgba(10,22,40,0.09)' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: card.iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{card.title}</h3>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(10,22,40,0.5)' }}>{card.description}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(10,22,40,0.4)' }}>
            Date Range
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
              <input
                type="date"
                value={form.dateFrom}
                onChange={(e) => setForm((f) => ({ ...f, dateFrom: e.target.value }))}
                className="w-full pl-7 pr-2 py-2 rounded-xl text-xs border outline-none"
                style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
              />
            </div>
            <span className="flex items-center text-xs" style={{ color: 'rgba(10,22,40,0.3)' }}>–</span>
            <div className="relative flex-1">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
              <input
                type="date"
                value={form.dateTo}
                onChange={(e) => setForm((f) => ({ ...f, dateTo: e.target.value }))}
                className="w-full pl-7 pr-2 py-2 rounded-xl text-xs border outline-none"
                style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(10,22,40,0.4)' }}>
            Format
          </label>
          <div className="relative">
            <select
              value={form.format}
              onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as Format }))}
              className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl text-xs border outline-none font-semibold"
              style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
            >
              <option value="PDF">PDF</option>
              <option value="Excel">Excel (.xlsx)</option>
              <option value="CSV">CSV</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={form.generating}
        className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        style={{
          backgroundColor: form.generating ? 'rgba(201,162,39,0.5)' : '#C9A227',
          color: '#0A1628',
          cursor: form.generating ? 'not-allowed' : 'pointer',
        }}
      >
        {form.generating ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating…
          </>
        ) : (
          <>
            <FileText className="w-3.5 h-3.5" /> Generate Report
          </>
        )}
      </button>
    </div>
  );
}

export default function ReportsExport() {
  const [scheduled, setScheduled] = useState<ScheduledReport[]>(INITIAL_SCHEDULED);

  function toggleScheduled(id: number) {
    setScheduled((s) => s.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 pt-2 pb-12">

        <div className="mb-7">
          <h1 className="text-xl font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Reports &amp; Export</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>Generate and download L&amp;D data reports</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {REPORT_CARDS.map((card) => <ReportCardItem key={card.id} card={card} />)}
        </div>

        <div className="bg-white rounded-2xl border mb-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#C9A227' }} />
              <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Recent Exports</h2>
            </div>
            <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>{RECENT_EXPORTS.length} exports</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(10,22,40,0.06)' }}>
                  {['Report Name', 'Generated By', 'Date', 'Format', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(10,22,40,0.35)', background: '#FAFAF9' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_EXPORTS.map((row, i) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-50"
                    style={{ borderBottom: i < RECENT_EXPORTS.length - 1 ? '1px solid rgba(10,22,40,0.05)' : 'none' }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium" style={{ color: '#0A1628' }}>{row.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: 'rgba(10,22,40,0.55)' }}>{row.generatedBy}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: 'rgba(10,22,40,0.45)' }}>{row.date}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <FormatBadge format={row.format} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {row.status === 'Ready' && (
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      )}
                      {row.status === 'Processing' && (
                        <span className="text-xs" style={{ color: 'rgba(10,22,40,0.3)' }}>In progress…</span>
                      )}
                      {row.status === 'Failed' && (
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#991B1B' }}
                        >
                          <RefreshCw className="w-3 h-3" /> Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(10,22,40,0.07)' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#C9A227' }} />
              <h2 className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Scheduled Reports</h2>
            </div>
            <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>Auto-generated &amp; emailed to recipients</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(10,22,40,0.05)' }}>
            {scheduled.map((s) => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: s.enabled ? 'rgba(201,162,39,0.1)' : 'rgba(10,22,40,0.05)' }}
                  >
                    <RefreshCw className="w-4 h-4" style={{ color: s.enabled ? '#C9A227' : 'rgba(10,22,40,0.25)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: s.enabled ? '#0A1628' : 'rgba(10,22,40,0.4)' }}>{s.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.4)' }}>
                      {s.frequency} &middot; Next run: {s.nextRun} &middot; {s.recipients}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: s.enabled ? 'rgba(16,185,129,0.1)' : 'rgba(10,22,40,0.06)',
                      color: s.enabled ? '#065F46' : 'rgba(10,22,40,0.4)',
                    }}
                  >
                    {s.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button onClick={() => toggleScheduled(s.id)}>
                    {s.enabled
                      ? <ToggleRight className="w-8 h-8" style={{ color: '#C9A227' }} />
                      : <ToggleLeft className="w-8 h-8" style={{ color: 'rgba(10,22,40,0.2)' }} />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
