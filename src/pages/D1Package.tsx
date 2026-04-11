import { useState } from 'react';
import { useD1 } from '../contexts/D1Context';

interface D1PackageProps {
  onNavigate: (page: string) => void;
}

const SECTIONS = [
  { id: 'needs', title: 'AI Needs Analysis', icon: '🧠', status: 'complete' },
  { id: 'disa', title: 'LearnaDNA Profile', icon: '🧬', status: 'complete' },
  { id: 'outcome', title: 'SMART + GROW Outcome', icon: '📐', status: 'complete' },
  { id: 'commitment', title: 'Manager Commitment', icon: '✍️', status: 'pending' },
];

export default function D1Package({ onNavigate }: D1PackageProps) {
  const { needsAssessment } = useD1();
  const [committed, setCommitted] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSignOff = () => {
    if (managerName.trim()) {
      setCommitted(true);
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-navy mb-2">D1 Package</h1>
        <p className="text-navy/60">Complete submission ready for L&D</p>
      </div>

      {/* Package Header */}
      <div className="bg-navy rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2">D1 Package Reference</p>
            <h2 className="text-2xl font-serif mb-1">QR-AI-2026-0021</h2>
            <p className="text-white/60 text-sm">Corporate Sales — Closing & Value Articulation</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${committed ? 'bg-gold text-navy' : 'bg-white/10 text-white/60'}`}>
            {committed ? '✓ Ready to Submit' : '⏳ Pending Signature'}
          </span>
        </div>
      </div>

      {/* Section Status */}
      <div className="grid grid-cols-2 gap-4">
        {SECTIONS.map(s => (
          <div key={s.id} className="bg-white rounded-xl p-4 border border-navy/10 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-sm font-semibold text-navy">{s.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                s.id === 'commitment' && committed ? 'bg-green-100 text-green-700' :
                s.id === 'commitment' ? 'bg-red-100 text-red-600' :
                'bg-green-100 text-green-700'
              }`}>
                {s.id === 'commitment' ? (committed ? 'Signed ✓' : 'Pending') : 'Complete'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-navy/10 p-6">
        <h3 className="font-serif font-bold text-navy text-lg mb-4">Package Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Business Problem', needsAssessment?.currentChallenge || 'Corporate sales closing gaps'],
            ['Target Audience', '8 Corporate Sales Executives'],
            ['Root Cause', 'Skill gap — value-based selling'],
            ['Business Impact', 'LKR 12M pipeline at risk'],
            ['SMART Outcome', '35% close rate by Apr 30, 2026'],
            ['Urgency', 'Within 2 weeks'],
            ['Recommendation', 'Workshop + Coaching + Role Play'],
            ['Priority', '🔴 High'],
          ].map(([k, v]) => (
            <div key={k} className="bg-cream rounded-lg p-3">
              <p className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">{k}</p>
              <p className="text-sm font-medium text-navy">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manager Commitment */}
      {!committed ? (
        <div className="bg-white rounded-xl border-2 border-gold/40 p-6">
          <h3 className="font-serif font-bold text-navy text-lg mb-2">Manager Commitment Declaration</h3>
          <p className="text-navy/60 text-sm mb-4">
            By signing, I confirm I will brief my team before the programme and conduct a 30-day follow-up review.
          </p>
          <button onClick={() => setShowModal(true)}
            className="w-full bg-gold text-navy font-bold py-3 rounded-lg hover:bg-gold/90 transition-colors">
            ✍️ Sign & Confirm Manager Commitment
          </button>
        </div>
      ) : (
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-800">Commitment Signed — {managerName}</p>
            <p className="text-green-600 text-sm">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-navy text-gold font-bold py-3 rounded-lg hover:bg-navy/90 transition-colors">
          📤 Submit to L&D Pipeline
        </button>
        <button className="bg-cream text-navy border border-navy/20 font-semibold px-6 py-3 rounded-lg hover:bg-navy/5 transition-colors">
          📄 Download PDF
        </button>
      </div>

      {/* Signature Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-serif text-navy mb-4">Manager Sign-Off</h3>
            <p className="text-navy/60 mb-4">Enter your name to confirm commitment.</p>
            <input type="text" value={managerName} onChange={e => setManagerName(e.target.value)}
              placeholder="Your full name" autoFocus
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 bg-navy/10 text-navy font-semibold py-2 rounded-lg">Cancel</button>
              <button onClick={handleSignOff} disabled={!managerName.trim()}
                className="flex-1 bg-gold disabled:opacity-50 text-navy font-bold py-2 rounded-lg">
                Confirm Sign-Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
