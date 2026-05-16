import { useState, useMemo } from 'react';
import { ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  mode: 'self' | 'leader';
  memberName?: string;
  onComplete: () => void;
}

interface CompetencyScore {
  score: number | null;
  evidence: string;
  confidence: 'Low' | 'Medium' | 'High' | null;
}

const COMPETENCIES = [
  {
    id: 'resilience',
    name: 'Resilience',
    description: 'Sustains performance through rejection, pressure and change',
    group: 'Mindset',
  },
  {
    id: 'commitment',
    name: 'Commitment & Discipline',
    description: 'Drives consistent activity and execution standards',
    group: 'Mindset',
  },
  {
    id: 'empathy',
    name: 'Active Empathy',
    description: 'Engages clients in emotionally intelligent advisory conversations',
    group: 'People',
  },
  {
    id: 'networking',
    name: 'Networking Intelligence',
    description: 'Builds and leverages structured stakeholder ecosystems',
    group: 'People',
  },
  {
    id: 'complexity',
    name: 'Complexity Simplification',
    description: 'Translates complex products into customer-understandable language',
    group: 'Capability',
  },
] as const;

type CompetencyId = (typeof COMPETENCIES)[number]['id'];

const SCORE_LABELS: { range: [number, number]; label: string; color: string }[] = [
  { range: [1, 2], label: 'Not Demonstrated', color: '#dc2626' },
  { range: [3, 4], label: 'Developing', color: '#ea580c' },
  { range: [5, 6], label: 'Competent', color: '#ca8a04' },
  { range: [7, 8], label: 'Proficient', color: '#16a34a' },
  { range: [9, 10], label: 'Expert', color: '#15803d' },
];

function getScoreLabel(score: number) {
  return SCORE_LABELS.find(({ range }) => score >= range[0] && score <= range[1]);
}

function ScoreSlider({
  score,
  onChange,
}: {
  score: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <span key={n} className="w-7 text-center">{n}</span>
        ))}
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={score ?? 5}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: score
            ? `linear-gradient(to right, #C9A227 0%, #C9A227 ${((score - 1) / 9) * 100}%, #d1d5db ${((score - 1) / 9) * 100}%, #d1d5db 100%)`
            : '#d1d5db',
        }}
      />
      <div className="flex justify-between text-xs mt-2" style={{ color: '#9ca3af' }}>
        <span>Not Demonstrated</span>
        <span>Developing</span>
        <span>Competent</span>
        <span>Proficient</span>
        <span>Expert</span>
      </div>
      {score !== null && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className="text-sm font-semibold px-2 py-0.5 rounded"
            style={{ backgroundColor: '#C9A22720', color: '#C9A227', border: '1px solid #C9A22760' }}
          >
            {score}
          </span>
          <span className="text-sm font-medium" style={{ color: getScoreLabel(score)?.color }}>
            {getScoreLabel(score)?.label}
          </span>
        </div>
      )}
    </div>
  );
}

function TrustScoreCard({ I, C1, C2 }: { I: number; C1: number; C2: number }) {
  const T = (I + C1 + C2) / 3;
  const color = T < 5 ? '#dc2626' : T <= 7 ? '#d97706' : '#16a34a';
  const bg = T < 5 ? '#fef2f2' : T <= 7 ? '#fffbeb' : '#f0fdf4';
  const border = T < 5 ? '#fca5a5' : T <= 7 ? '#fcd34d' : '#86efac';

  return (
    <div
      className="mt-8 rounded-xl p-6 border-2"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#0A1628' }}>
            Level of Trust
          </h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Cumulative outcome of all competencies
          </p>
          <p className="text-xs mt-1 font-mono" style={{ color: '#9ca3af' }}>
            T = (I + C₁ + C₂) / 3 &nbsp;|&nbsp; I = avg(Empathy, Networking) &nbsp;|&nbsp; C₁ = Complexity &nbsp;|&nbsp; C₂ = avg(Resilience, Commitment)
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-5xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color }}
          >
            {T.toFixed(1)}
          </div>
          <div className="text-xs mt-1 font-semibold uppercase tracking-wide" style={{ color }}>
            {T < 5 ? 'Needs Attention' : T <= 7 ? 'Developing' : 'Strong'}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Integrity (I)', value: I, sub: 'Empathy + Networking' },
          { label: 'Competence (C₁)', value: C1, sub: 'Complexity Simplification' },
          { label: 'Capability (C₂)', value: C2, sub: 'Resilience + Commitment' },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-lg p-3 text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="text-xl font-bold" style={{ color: '#0A1628' }}>{value.toFixed(1)}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: '#0A1628' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompetencyAssessment({ mode, memberName, onComplete }: Props) {
  const [cycle, setCycle] = useState<'Pre-Training' | 'Post-Training'>('Pre-Training');
  const [scores, setScores] = useState<Record<CompetencyId, CompetencyScore>>({
    resilience: { score: null, evidence: '', confidence: null },
    commitment: { score: null, evidence: '', confidence: null },
    empathy: { score: null, evidence: '', confidence: null },
    networking: { score: null, evidence: '', confidence: null },
    complexity: { score: null, evidence: '', confidence: null },
  });
  const [activeGroup, setActiveGroup] = useState<string | null>('Mindset');

  const rated = useMemo(
    () => Object.values(scores).filter((s) => s.score !== null).length,
    [scores]
  );
  const allRated = rated === 5;

  const trustComponents = useMemo(() => {
    const s = scores;
    if (!allRated) return null;
    const I = ((s.empathy.score ?? 0) + (s.networking.score ?? 0)) / 2;
    const C1 = s.complexity.score ?? 0;
    const C2 = ((s.resilience.score ?? 0) + (s.commitment.score ?? 0)) / 2;
    return { I, C1, C2 };
  }, [scores, allRated]);

  const groups = useMemo(() => {
    const map: Record<string, typeof COMPETENCIES[number][]> = {};
    COMPETENCIES.forEach((c) => {
      if (!map[c.group]) map[c.group] = [];
      map[c.group].push(c);
    });
    return map;
  }, []);

  function updateScore(id: CompetencyId, field: keyof CompetencyScore, value: unknown) {
    setScores((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{ backgroundColor: '#0A1628' }} className="px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C9A227' }}>
                HNB Assurance · Learna
              </span>
            </div>
            <h1 className="text-xl font-semibold mt-0.5" style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}>
              Competency Assessment
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
              {mode === 'self'
                ? 'Self Assessment'
                : `Leader Assessment${memberName ? ` — ${memberName}` : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="relative"
              style={{ minWidth: 160 }}
            >
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value as typeof cycle)}
                className="w-full appearance-none rounded-lg px-3 py-2 pr-8 text-sm font-medium border focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(201,162,39,0.4)',
                  color: '#C9A227',
                }}
              >
                <option value="Pre-Training" style={{ backgroundColor: '#0A1628' }}>Pre-Training</option>
                <option value="Post-Training" style={{ backgroundColor: '#0A1628' }}>Post-Training</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C9A227' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ backgroundColor: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="px-6 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: '#94a3b8' }}>
              {rated} of 5 competencies rated
            </span>
            <span className="text-xs font-semibold" style={{ color: '#C9A227' }}>
              {Math.round((rated / 5) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(rated / 5) * 100}%`, backgroundColor: '#C9A227' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Intro */}
        <div
          className="rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
          style={{ backgroundColor: '#0A162808', border: '1px solid #0A162818' }}
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: '#C9A227' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
            {mode === 'self'
              ? 'Rate yourself honestly based on actual behaviour, not aspirations. Select a score from 1–10 for each competency and optionally provide supporting evidence.'
              : 'Rate based on direct observation only. Your assessment is confidential and will be used to support development planning.'}
          </p>
        </div>

        {/* Competency Groups */}
        {Object.entries(groups).map(([group, competencies]) => (
          <div key={group} className="mb-4">
            <button
              className="w-full flex items-center justify-between px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: activeGroup === group ? '#0A1628' : '#0A162812',
                color: activeGroup === group ? '#ffffff' : '#0A1628',
                fontFamily: 'Georgia, serif',
              }}
              onClick={() => setActiveGroup(activeGroup === group ? null : group)}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeGroup === group ? '#C9A227' : '#0A162840' }}
                />
                {group}
                <span
                  className="ml-1 text-xs font-normal px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: activeGroup === group ? 'rgba(201,162,39,0.2)' : 'rgba(10,22,40,0.08)',
                    color: activeGroup === group ? '#C9A227' : '#6b7280',
                  }}
                >
                  {competencies.filter((c) => scores[c.id as CompetencyId].score !== null).length}/{competencies.length}
                </span>
              </span>
              <ChevronDown
                size={16}
                className="transition-transform"
                style={{ transform: activeGroup === group ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {activeGroup === group && (
              <div className="mt-2 space-y-3">
                {competencies.map((comp) => {
                  const id = comp.id as CompetencyId;
                  const data = scores[id];
                  const isRated = data.score !== null;
                  return (
                    <div
                      key={id}
                      className="rounded-xl p-5 border transition-shadow"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: isRated ? '#C9A22730' : '#e5e7eb',
                        boxShadow: isRated ? '0 0 0 1px #C9A22718' : 'none',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: isRated ? '#C9A22720' : '#f3f4f6' }}
                        >
                          {isRated ? (
                            <CheckCircle2 size={14} style={{ color: '#C9A227' }} />
                          ) : (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d1d5db' }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
                            {comp.name}
                          </h3>
                          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6b7280' }}>
                            {comp.description}
                          </p>

                          <ScoreSlider
                            score={data.score}
                            onChange={(v) => updateScore(id, 'score', v)}
                          />

                          {data.score === null && (
                            <button
                              className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                              style={{ backgroundColor: '#0A162808', color: '#0A1628', border: '1px solid #0A162818' }}
                              onClick={() => updateScore(id, 'score', 5)}
                            >
                              Start rating →
                            </button>
                          )}

                          {data.score !== null && (
                            <>
                              <div className="mt-4">
                                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>
                                  Evidence (optional)
                                </label>
                                <textarea
                                  rows={2}
                                  value={data.evidence}
                                  onChange={(e) => updateScore(id, 'evidence', e.target.value)}
                                  placeholder="Describe a specific example or observation..."
                                  className="w-full text-sm rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2"
                                  style={{
                                    border: '1px solid #e5e7eb',
                                    color: '#374151',
                                    backgroundColor: '#fafafa',
                                    '--tw-ring-color': '#C9A22740',
                                  } as React.CSSProperties}
                                />
                              </div>

                              {mode === 'leader' && (
                                <div className="mt-3">
                                  <label className="block text-xs font-medium mb-2" style={{ color: '#6b7280' }}>
                                    Assessment Confidence
                                  </label>
                                  <div className="flex gap-2">
                                    {(['Low', 'Medium', 'High'] as const).map((level) => (
                                      <button
                                        key={level}
                                        onClick={() => updateScore(id, 'confidence', level)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                        style={{
                                          backgroundColor: data.confidence === level ? '#0A1628' : '#f3f4f6',
                                          color: data.confidence === level ? '#C9A227' : '#6b7280',
                                          border: data.confidence === level ? '1px solid #C9A22740' : '1px solid transparent',
                                        }}
                                      >
                                        {level}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Trust Score */}
        {allRated && trustComponents && (
          <TrustScoreCard I={trustComponents.I} C1={trustComponents.C1} C2={trustComponents.C2} />
        )}

        {!allRated && (
          <div
            className="mt-6 rounded-xl p-5 border text-center"
            style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff', color: '#9ca3af' }}
          >
            <p className="text-sm">
              Complete all 5 competency ratings to see the calculated{' '}
              <span className="font-semibold" style={{ color: '#0A1628' }}>Level of Trust</span> score.
            </p>
            <p className="text-xs mt-1 font-mono" style={{ color: '#d1d5db' }}>
              T = (I + C₁ + C₂) / 3
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-8 flex items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: '#e5e7eb' }}
        >
          <button
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border"
            style={{ borderColor: '#0A162830', color: '#0A1628', backgroundColor: 'transparent' }}
          >
            Save Progress
          </button>
          <button
            disabled={!allRated}
            onClick={onComplete}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: allRated ? '#C9A227' : '#e5e7eb',
              color: allRated ? '#0A1628' : '#9ca3af',
              cursor: allRated ? 'pointer' : 'not-allowed',
            }}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
