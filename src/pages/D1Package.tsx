import { useState } from 'react';
import { Download, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useD1 } from '../contexts/D1Context';

interface D1PackageProps {
  onNavigate: (page: string) => void;
}

export default function D1Package({ onNavigate }: D1PackageProps) {
  const { currentPackage, needsAssessment, disaProfile, outcomeData, setManagerSignature } = useD1();
  const [managerName, setManagerName] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [hasSignedOff, setHasSignedOff] = useState(false);

  const handleSignOff = () => {
    if (!managerName.trim()) return;
    setManagerSignature(managerName);
    setHasSignedOff(true);
    setShowSignatureModal(false);
  };

  const handleDownloadPDF = () => {
    const content = `
LEARNA D1 PACKAGE - COMPLETE LEARNING PLAN
Generated: ${new Date().toLocaleDateString()}

=== BUSINESS CONTEXT & NEEDS ===
${needsAssessment?.businessContext || 'Not provided'}

Current Challenge: ${needsAssessment?.currentChallenge || 'Not provided'}
Desired Outcome: ${needsAssessment?.desiredOutcome || 'Not provided'}
Timeframe: ${needsAssessment?.timeframe || 'Not provided'}
Success Metrics: ${needsAssessment?.successMetrics || 'Not provided'}

=== CAPABILITY PROFILE (DISA) ===
Drive: ${disaProfile?.drive || 0}/5
Influence: ${disaProfile?.influence || 0}/5
Stability: ${disaProfile?.stability || 0}/5
Accuracy: ${disaProfile?.accuracy || 0}/5

=== OUTCOME STATEMENT ===
${outcomeData?.smartStatement || 'Not provided'}

=== INTERVENTIONS ===
${outcomeData?.interventions?.map((i) => `${i.rank}. ${i.title}\n${i.description}\n`).join('\n') || 'Not provided'}

=== MANAGER SIGN-OFF ===
${currentPackage?.managerSignature ? `Manager: ${currentPackage.managerSignature.name}\nDate: ${new Date(currentPackage.managerSignature.timestamp).toLocaleDateString()}` : 'Not signed off'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `D1-Package-${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const completionPercentage = Math.round(
    ((needsAssessment ? 25 : 0) +
      (disaProfile && disaProfile.drive > 0 ? 25 : 0) +
      (outcomeData?.context ? 25 : 0) +
      (hasSignedOff ? 25 : 0)) /
      1
  );

  const sections = [
    {
      title: 'AI Needs Assessment',
      icon: '📋',
      complete: !!needsAssessment,
      content: needsAssessment ? (
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Challenge:</span> {needsAssessment.currentChallenge}
          </p>
          <p>
            <span className="font-semibold">Outcome:</span> {needsAssessment.desiredOutcome}
          </p>
          <p>
            <span className="font-semibold">Timeframe:</span> {needsAssessment.timeframe}
          </p>
        </div>
      ) : null,
    },
    {
      title: 'LearnaDNA Profile',
      icon: '🧬',
      complete: !!disaProfile && disaProfile.drive > 0,
      content: disaProfile && disaProfile.drive > 0 ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Drive</span>
            <span className="font-bold text-gold">{disaProfile.drive}/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Influence</span>
            <span className="font-bold text-gold">{disaProfile.influence}/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Stability</span>
            <span className="font-bold text-gold">{disaProfile.stability}/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Accuracy</span>
            <span className="font-bold text-gold">{disaProfile.accuracy}/5</span>
          </div>
        </div>
      ) : null,
    },
    {
      title: 'Outcome Plan',
      icon: '🎯',
      complete: !!outcomeData?.context,
      content: outcomeData?.smartStatement ? (
        <div className="space-y-2 text-sm">
          <p className="text-navy/80 italic">{outcomeData.smartStatement}</p>
          {outcomeData.interventions && outcomeData.interventions.length > 0 && (
            <div>
              <p className="font-semibold">Key Interventions:</p>
              <ul className="list-disc list-inside text-xs">
                {outcomeData.interventions.slice(0, 2).map((i) => (
                  <li key={i.rank}>{i.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null,
    },
    {
      title: 'Manager Sign-Off',
      icon: '✍️',
      complete: hasSignedOff,
      content: hasSignedOff ? (
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Manager:</span> {currentPackage?.managerSignature?.name}
          </p>
          <p className="text-navy/70">
            {new Date(currentPackage?.managerSignature?.timestamp || '').toLocaleDateString()}
          </p>
        </div>
      ) : null,
    },
  ];

  if (!currentPackage) {
    return (
        <div className="max-w-4xl mx-auto pb-24">
          <div className="bg-white rounded-lg shadow-lg p-12 border border-navy/10 text-center">
            <AlertCircle className="w-16 h-16 text-navy/40 mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-navy mb-2">D1 Package Empty</h2>
            <p className="text-navy/70 mb-6">
              Complete the three assessment tools to build your D1 Package
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gold hover:bg-gold/90 text-navy font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Start D1 Process
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto pb-24">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-navy mb-4">D1 Complete Package</h1>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-navy/10 mb-8">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-navy">Package Completion</span>
                <span className="text-2xl font-bold text-gold">{completionPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-navy/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className={`rounded-lg shadow-lg p-6 border-2 transition-all ${
                section.complete
                  ? 'bg-white border-gold'
                  : 'bg-navy/5 border-navy/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-lg font-serif text-navy">{section.title}</h3>
                </div>
                {section.complete && <CheckCircle className="w-5 h-5 text-gold" />}
              </div>
              {section.content ? (
                section.content
              ) : (
                <p className="text-sm text-navy/50 italic">Not completed yet</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gold/10 rounded-lg p-8 border border-gold mb-8">
          <h3 className="text-2xl font-serif text-navy mb-4">Manager Commitment</h3>
          <p className="text-navy/70 mb-6">
            Manager sign-off confirms commitment to support the implementation of this learning and
            development plan.
          </p>
          {!hasSignedOff && (
            <button
              onClick={() => setShowSignatureModal(true)}
              className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <span>Add Manager Sign-Off</span>
            </button>
          )}
          {hasSignedOff && (
            <div className="p-4 bg-white rounded-lg border border-gold">
              <p className="text-sm text-navy/70">Signed by:</p>
              <p className="font-semibold text-navy text-lg">
                {currentPackage.managerSignature?.name}
              </p>
              <p className="text-sm text-navy/60">
                {new Date(currentPackage.managerSignature?.timestamp || '').toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Package
          </button>
          {completionPercentage === 100 && (
            <button
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-semibold py-3 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              Submit to L&D Team
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 bg-navy/10 hover:bg-navy/20 text-navy font-semibold py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
          {completionPercentage < 100 && (
            <button
              onClick={() => onNavigate('ai-advisor')}
              className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold py-3 rounded-lg transition-colors"
            >
              Complete Assessment
            </button>
          )}
        </div>
      </div>

      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-serif text-navy mb-4">Manager Sign-Off</h3>
            <p className="text-navy/70 mb-6">
              Enter your name to confirm commitment to this learning plan.
            </p>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Manager Name"
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleSignOff()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 bg-navy/10 hover:bg-navy/20 text-navy font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOff}
                disabled={!managerName.trim()}
                className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-navy font-semibold py-2 rounded-lg transition-colors"
              >
                Confirm Sign-Off
              </button>
            </div>
          </div>
        </div>
      )}
  );
}
