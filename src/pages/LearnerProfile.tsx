import { useMemo } from 'react';
import { Award, Clock, Flame, BookOpen, TrendingUp, TrendingDown, Minus, CheckCircle2, Calendar } from 'lucide-react';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const LEARNER = {
  name: 'Dilshan Perera',
  initials: 'DP',
  role: 'Branch Executive',
  department: 'Bancassurance Retail',
  branch: 'Kandy City Branch',
  joined: 'March 2022',
  stats: {
    programmesCompleted: 7,
    learningHours: 94,
    currentStreak: 12,
  },
};

const COMPETENCIES = [
  { id: 'resilience', name: 'Resilience', group: 'Mindset', self: 7, leader: 6 },
  { id: 'commitment', name: 'Commitment & Discipline', group: 'Mindset', self: 6, leader: 4 },
  { id: 'empathy', name: 'Active Empathy', group: 'People', self: 7, leader: 7 },
  { id: 'networking', name: 'Networking Intelligence', group: 'People', self: 5, leader: 4 },
  { id: 'complexity', name: 'Complexity Simplification', group: 'Capability', self: 6, leader: 6 },
] as const;

const HISTORY = [
  {
    id: 1,
    programme: 'Advanced Bancassurance Selling',
    start: 'Jan 2025',
    end: 'Mar 2025',
    stage: 'D4',
    completed: true,
  },
  {
    id: 2,
    programme: 'Needs-Based Financial Advisory',
    start: 'Aug 2024',
    end: 'Nov 2024',
    stage: 'D3',
    completed: true,
  },
  {
    id: 3,
    programme: 'Foundations of Insurance',
    start: 'Mar 2024',
    end: 'Jun 2024',
    stage: 'D2',
    completed: true,
  },
  {
    id: 4,
    programme: 'Customer Engagement Essentials',
    start: 'Sep 2023',
    end: 'Dec 2023',
    stage: 'D1',
    completed: true,
  },
  {
    id: 5,
    programme: 'New Employee Orientation',
    start: 'Apr 2022',
    end: 'May 2022',
    stage: 'D1',
    completed: true,
  },
];

const CERTIFICATES = [
  { id: 1, programme: 'Advanced Bancassurance Selling', issued: 'March 2025', type: 'Distinction' },
  { id: 2, programme: 'Needs-Based Financial Advisory', issued: 'November 2024', type: 'Pass' },
  { id: 3, programme: 'Foundations of Insurance', issued: 'June 2024', type: 'Merit' },
  { id: 4, programme: 'Customer Engagement Essentials', issued: 'December 2023', type: 'Pass' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcTrust(c: typeof COMPETENCIES) {
  const selfI = (c.find((x) => x.id === 'empathy')!.self + c.find((x) => x.id === 'networking')!.self) / 2;
  const selfC1 = c.find((x) => x.id === 'complexity')!.self;
  const selfC2 = (c.find((x) => x.id === 'resilience')!.self + c.find((x) => x.id === 'commitment')!.self) / 2;
  const leaderI = (c.find((x) => x.id === 'empathy')!.leader + c.find((x) => x.id === 'networking')!.leader) / 2;
  const leaderC1 = c.find((x) => x.id === 'complexity')!.leader;
  const leaderC2 = (c.find((x) => x.id === 'resilience')!.leader + c.find((x) => x.id === 'commitment')!.leader) / 2;
  return {
    self: (selfI + selfC1 + selfC2) / 3,
    leader: (leaderI + leaderC1 + leaderC2) / 3,
  };
}

function gapColor(gap: number) {
  const abs = Math.abs(gap);
  if (abs > 2) return '#dc2626';
  if (abs >= 1) return '#d97706';
  return '#16a34a';
}

function TrendIcon({ gap }: { gap: number }) {
  if (gap > 0.5) return <TrendingUp size={14} style={{ color: '#16a34a' }} />;
  if (gap < -0.5) return <TrendingDown size={14} style={{ color: '#dc2626' }} />;
  return <Minus size={14} style={{ color: '#9ca3af' }} />;
}

// ── Pentagon Radar ────────────────────────────────────────────────────────────

function pentagonPoint(index: number, total: number, radius: number, cx: number, cy: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function polyPoints(values: number[], maxVal: number, outerR: number, cx: number, cy: number) {
  return values
    .map((v, i) => {
      const r = (v / maxVal) * outerR;
      const p = pentagonPoint(i, values.length, r, cx, cy);
      return `${p.x},${p.y}`;
    })
    .join(' ');
}

function RadarChart({ selfScores, leaderScores, labels, trustScore }: {
  selfScores: number[];
  leaderScores: number[];
  labels: string[];
  trustScore: { self: number; leader: number };
}) {
  const cx = 200;
  const cy = 200;
  const outerR = 130;
  const maxVal = 10;
  const rings = [2, 4, 6, 8, 10];

  const labelPositions = labels.map((_, i) => {
    const p = pentagonPoint(i, labels.length, outerR + 30, cx, cy);
    return p;
  });

  const shortLabels = [
    'Resilience',
    'Commitment\n& Discipline',
    'Active\nEmpathy',
    'Networking\nIntelligence',
    'Complexity\nSimplification',
  ];

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 400 400" className="w-full max-w-sm">
        {/* Ring grid */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={[0, 1, 2, 3, 4]
              .map((i) => {
                const p = pentagonPoint(i, 5, (r / maxVal) * outerR, cx, cy);
                return `${p.x},${p.y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Spoke lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const outer = pentagonPoint(i, 5, outerR, cx, cy);
          return (
            <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth="1" />
          );
        })}

        {/* Leader polygon */}
        <polygon
          points={polyPoints(leaderScores, maxVal, outerR, cx, cy)}
          fill="rgba(10,22,40,0.18)"
          stroke="#0A1628"
          strokeWidth="2"
        />

        {/* Self polygon */}
        <polygon
          points={polyPoints(selfScores, maxVal, outerR, cx, cy)}
          fill="rgba(201,162,39,0.22)"
          stroke="#C9A227"
          strokeWidth="2"
        />

        {/* Data points */}
        {selfScores.map((v, i) => {
          const p = pentagonPoint(i, 5, (v / maxVal) * outerR, cx, cy);
          return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#C9A227" stroke="#fff" strokeWidth="1.5" />;
        })}
        {leaderScores.map((v, i) => {
          const p = pentagonPoint(i, 5, (v / maxVal) * outerR, cx, cy);
          return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0A1628" stroke="#fff" strokeWidth="1.5" />;
        })}

        {/* Labels */}
        {labelPositions.map((pos, i) => {
          const lines = shortLabels[i].split('\n');
          const lineH = 14;
          const totalH = lines.length * lineH;
          const startY = pos.y - totalH / 2 + lineH / 2;
          const anchor = pos.x < cx - 5 ? 'end' : pos.x > cx + 5 ? 'start' : 'middle';
          return (
            <text key={i} textAnchor={anchor} fontSize="11" fontFamily="Inter, sans-serif" fill="#374151">
              {lines.map((line, li) => (
                <tspan key={li} x={pos.x} y={startY + li * lineH}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}

        {/* Centre Trust Score */}
        <circle cx={cx} cy={cy} r={28} fill="#0A1628" />
        <text textAnchor="middle" x={cx} y={cy - 4} fontSize="16" fontWeight="bold" fontFamily="Georgia, serif" fill="#C9A227">
          {trustScore.self.toFixed(1)}
        </text>
        <text textAnchor="middle" x={cx} y={cy + 12} fontSize="9" fontFamily="Inter, sans-serif" fill="#94a3b8">
          Trust
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5" style={{ backgroundColor: '#C9A227' }} />
          <span className="text-xs" style={{ color: '#6b7280' }}>Self</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5" style={{ backgroundColor: '#0A1628' }} />
          <span className="text-xs" style={{ color: '#6b7280' }}>Leader</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LearnerProfile() {
  const trust = useMemo(() => calcTrust(COMPETENCIES), []);

  const trustColor = trust.leader < 5 ? '#dc2626' : trust.leader <= 7 ? '#d97706' : '#16a34a';

  const selfScores = COMPETENCIES.map((c) => c.self);
  const leaderScores = COMPETENCIES.map((c) => c.leader);
  const labels = COMPETENCIES.map((c) => c.name);

  const certBadgeStyle = (type: string) => {
    if (type === 'Distinction') return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
    if (type === 'Merit') return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
    return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{ backgroundColor: '#0A1628' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C9A227' }}>
            HNB Assurance · Learna
          </span>
          <h1 className="text-xl font-semibold mt-0.5" style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}>
            Learner Profile
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header Card */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="h-2" style={{ backgroundColor: '#C9A227' }} />
          <div className="p-6">
            <div className="flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                style={{ backgroundColor: '#0A1628', color: '#C9A227', fontFamily: 'Georgia, serif' }}
              >
                {LEARNER.initials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
                  {LEARNER.name}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                  {LEARNER.role} &nbsp;·&nbsp; {LEARNER.department}
                </p>
                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                  {LEARNER.branch} &nbsp;·&nbsp; Joined {LEARNER.joined}
                </p>
              </div>
              {/* Stats */}
              <div className="flex gap-4 flex-wrap">
                {[
                  { icon: BookOpen, label: 'Programmes', value: LEARNER.stats.programmesCompleted },
                  { icon: Clock, label: 'Learning Hours', value: LEARNER.stats.learningHours },
                  { icon: Flame, label: 'Day Streak', value: LEARNER.stats.currentStreak },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="text-center px-4 py-3 rounded-xl"
                    style={{ backgroundColor: '#F7F5F0', minWidth: 80 }}
                  >
                    <Icon size={16} className="mx-auto mb-1" style={{ color: '#C9A227' }} />
                    <div className="text-lg font-bold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
                      {value}
                    </div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Radar + Score Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
              Competency Radar
            </h3>
            <RadarChart
              selfScores={selfScores}
              leaderScores={leaderScores}
              labels={labels}
              trustScore={trust}
            />
          </div>

          {/* Score Table */}
          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="px-6 pt-6 pb-3">
              <h3 className="text-base font-semibold" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
                Competency Scores
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#F7F5F0' }}>
                    {['Competency', 'Group', 'Self', 'Leader', 'Gap', 'Trend'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide"
                        style={{ color: '#6b7280' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPETENCIES.map((c) => {
                    const gap = c.self - c.leader;
                    return (
                      <tr key={c.id} className="border-t" style={{ borderColor: '#f3f4f6' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: '#0A1628' }}>
                          {c.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: '#0A162810', color: '#0A1628' }}
                          >
                            {c.group}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#C9A227' }}>
                          {c.self}
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#0A1628' }}>
                          {c.leader}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="font-semibold"
                            style={{ color: gapColor(gap) }}
                          >
                            {gap > 0 ? '+' : ''}{gap}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <TrendIcon gap={gap} />
                        </td>
                      </tr>
                    );
                  })}
                  {/* Trust Score row */}
                  <tr className="border-t-2" style={{ borderColor: '#C9A22730', backgroundColor: '#fefce8' }}>
                    <td className="px-4 py-3 font-bold" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }} colSpan={2}>
                      Level of Trust
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#C9A227' }}>
                      {trust.self.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: trustColor }}>
                      {trust.leader.toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: gapColor(trust.self - trust.leader) }}>
                        {(trust.self - trust.leader) > 0 ? '+' : ''}{(trust.self - trust.leader).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <TrendIcon gap={trust.self - trust.leader} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 pb-4 pt-3">
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                Gap = Self − Leader &nbsp;|&nbsp;{' '}
                <span style={{ color: '#16a34a' }}>green &lt;1</span> &nbsp;
                <span style={{ color: '#d97706' }}>amber 1–2</span> &nbsp;
                <span style={{ color: '#dc2626' }}>red &gt;2</span>
              </p>
            </div>
          </div>
        </div>

        {/* Learning History */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <h3 className="text-base font-semibold mb-6" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
            Learning History
          </h3>
          <div className="relative">
            <div
              className="absolute left-5 top-0 bottom-0 w-px"
              style={{ backgroundColor: '#e5e7eb' }}
            />
            <div className="space-y-6">
              {HISTORY.map((item, idx) => (
                <div key={item.id} className="flex gap-4 relative pl-12">
                  <div
                    className="absolute left-3 w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: item.completed ? '#C9A227' : '#e5e7eb', zIndex: 1 }}
                  >
                    {item.completed && <CheckCircle2 size={10} style={{ color: '#0A1628' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#0A1628' }}>{item.programme}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={12} style={{ color: '#9ca3af' }} />
                          <span className="text-xs" style={{ color: '#9ca3af' }}>
                            {item.start} — {item.end}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: '#0A162818', color: '#0A1628' }}
                        >
                          {item.stage}
                        </span>
                        {item.completed && (
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                          >
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    {idx < HISTORY.length - 1 && (
                      <div className="mt-3 h-px" style={{ backgroundColor: '#f3f4f6' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} style={{ color: '#C9A227' }} />
            <h3 className="text-base font-semibold" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
              Certificates
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CERTIFICATES.map((cert) => {
              const style = certBadgeStyle(cert.type);
              return (
                <div
                  key={cert.id}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ backgroundColor: '#F7F5F0', border: '1px solid #e5e7eb' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#0A162812' }}
                  >
                    <Award size={18} style={{ color: '#C9A227' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight" style={{ color: '#0A1628' }}>
                      {cert.programme}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      Issued {cert.issued}
                    </p>
                    <span
                      className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                    >
                      {cert.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Score summary footer */}
        <div
          className="rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4 flex-wrap"
          style={{ backgroundColor: '#0A1628', border: '1px solid #0A1628' }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#C9A22790' }}>
              Calculated Outcome
            </p>
            <h3 className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}>
              Level of Trust
            </h3>
            <p className="text-xs mt-1" style={{ color: '#64748b' }}>
              T = (I + C₁ + C₂) / 3 &nbsp;·&nbsp; Based on leader assessment
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#C9A227' }}>
                {trust.self.toFixed(1)}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>Self</div>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: '#ffffff18' }} />
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: trustColor }}>
                {trust.leader.toFixed(1)}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>Leader</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
