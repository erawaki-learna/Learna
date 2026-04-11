import { Lightbulb, Zap, Target } from 'lucide-react';

interface D1HomeProps {
  onNavigate: (page: string) => void;
}

export default function D1Home({ onNavigate }: D1HomeProps) {
  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-serif text-navy mb-4">D1: Define Outcomes</h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {['Define', 'Design', 'Deliver', 'Deploy', 'Demonstrate'].map((d, i) => (
                <div key={i} className="w-12 h-12 bg-gold/20 border border-gold rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-navy">{d.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-lg text-navy/70 max-w-2xl leading-relaxed">
            The first step in the 6Ds framework. Clearly define what success looks like through a structured
            combination of needs assessment, capability profiling, and outcome design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div
            onClick={() => onNavigate('ai-advisor')}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg p-8 cursor-pointer transition-all duration-300 border border-navy/10 hover:border-gold/50"
          >
            <div className="w-14 h-14 bg-gold/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
              <Lightbulb className="w-7 h-7 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif text-navy mb-3">AI Needs Advisor</h3>
            <p className="text-navy/70 mb-6 leading-relaxed">
              Chat-based assessment that uncovers your true learning needs through intelligent questioning.
            </p>
            <div className="flex items-center gap-2 text-gold font-semibold group-hover:gap-3 transition-all">
              <span>Start Assessment</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('dna')}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg p-8 cursor-pointer transition-all duration-300 border border-navy/10 hover:border-gold/50"
          >
            <div className="w-14 h-14 bg-gold/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
              <Zap className="w-7 h-7 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif text-navy mb-3">LearnaDNA</h3>
            <p className="text-navy/70 mb-6 leading-relaxed">
              Behavioural profiling tool that maps your Drive, Influence, Stability & Accuracy dimensions.
            </p>
            <div className="flex items-center gap-2 text-gold font-semibold group-hover:gap-3 transition-all">
              <span>Build Profile</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('outcomes')}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg p-8 cursor-pointer transition-all duration-300 border border-navy/10 hover:border-gold/50"
          >
            <div className="w-14 h-14 bg-gold/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
              <Target className="w-7 h-7 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif text-navy mb-3">Outcome Builder</h3>
            <p className="text-navy/70 mb-6 leading-relaxed">
              5-step guided process to define SMART outcomes and develop GROW framework strategies.
            </p>
            <div className="flex items-center gap-2 text-gold font-semibold group-hover:gap-3 transition-all">
              <span>Design Outcome</span>
              <span>→</span>
            </div>
          </div>
        </div>

        <div className="bg-navy rounded-lg p-10 text-center text-white mb-12">
          <p className="text-lg mb-6 leading-relaxed">
            Complete all three assessments to unlock your D1 Package - a comprehensive learning and development
            plan with AI-powered recommendations and interventions.
          </p>
          <button
            onClick={() => onNavigate('package')}
            className="bg-gold hover:bg-gold/90 text-navy font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            View D1 Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 border border-navy/10">
            <h4 className="text-xl font-serif text-navy mb-4">About the 6Ds Framework</h4>
            <ul className="space-y-3 text-navy/70">
              <li className="flex gap-3">
                <span className="text-gold font-bold">D1</span>
                <span><strong>Define:</strong> Establish clear outcomes and requirements</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">D2</span>
                <span><strong>Design:</strong> Create learning experiences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">D3</span>
                <span><strong>Deliver:</strong> Execute the program</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">D4</span>
                <span><strong>Deploy:</strong> Support workplace application</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 border border-navy/10">
            <h4 className="text-xl font-serif text-navy mb-4">Key Benefits</h4>
            <ul className="space-y-3 text-navy/70">
              <li className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>Structured approach to L&D planning</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>Evidence-based outcome definition</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>AI-powered recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>Manager accountability & commitment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
