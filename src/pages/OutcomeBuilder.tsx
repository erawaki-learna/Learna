import { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { useD1 } from '../contexts/D1Context';
import { OutcomeData, Intervention } from '../types/d1';

interface OutcomeBuilderProps {
  onNavigate: (page: string) => void;
}

const steps = ['Context', 'Reality', 'Target', 'Timeline', 'Metric'];

const interventions: Intervention[] = [
  {
    rank: 1,
    title: 'Executive Coaching',
    description: 'One-on-one coaching sessions with an executive coach focused on specific capability development',
    impact: 'High impact, personalized approach',
  },
  {
    rank: 2,
    title: 'Blended Learning Program',
    description: 'Combination of online modules, workshops, and peer learning activities',
    impact: 'Medium-high impact, scalable approach',
  },
  {
    rank: 3,
    title: 'On-the-Job Application',
    description: 'Structured projects and assignments to practice new skills in real work environment',
    impact: 'Medium impact, practical reinforcement',
  },
];

export default function OutcomeBuilder({ onNavigate }: OutcomeBuilderProps) {
  const { setOutcomeData } = useD1();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    context: '',
    reality: '',
    target: '',
    timeline: '',
    metric: '',
  });
  const [showGrow, setShowGrow] = useState(false);

  const prompts = {
    context: 'What is the business context or background for this learning outcome?',
    reality: 'What is the current state or reality regarding this capability?',
    target: 'What is your target state - where do you want to be?',
    timeline: 'What is your realistic timeline for achieving this outcome?',
    metric: 'How will you measure success? Define specific, quantifiable metrics.',
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const smartStatement = `In ${formData.timeline}, we will develop the capability to ${formData.target.toLowerCase()}. Success will be measured by ${formData.metric.toLowerCase()}. Current state: ${formData.reality.toLowerCase()}. Business context: ${formData.context.toLowerCase()}.`;

    setOutcomeData({
      context: formData.context,
      reality: formData.reality,
      target: formData.target,
      timeline: formData.timeline,
      metric: formData.metric,
      smartStatement,
      interventions,
    });

    setShowGrow(true);
  };

  const stepKey = steps[currentStep].toLowerCase() as keyof typeof formData;

  if (showGrow) {
    return (
        <div className="max-w-4xl mx-auto pb-24">
          <h1 className="text-4xl font-serif text-navy mb-8">Your Outcome Plan</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-navy/10 mb-8">
            <h3 className="text-2xl font-serif text-navy mb-4">SMART Statement</h3>
            <p className="text-lg text-navy leading-relaxed bg-gold/10 p-6 rounded-lg border-l-4 border-gold">
              {formData.smartStatement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-navy/10">
              <h4 className="text-xl font-serif text-navy mb-4">GROW Framework</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gold mb-1">GOAL</p>
                  <p className="text-navy text-sm">{formData.target}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gold mb-1">REALITY</p>
                  <p className="text-navy text-sm">{formData.reality}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gold mb-1">OPTIONS</p>
                  <p className="text-navy text-sm">See recommended interventions below</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gold mb-1">WAY FORWARD</p>
                  <p className="text-navy text-sm">Timeline: {formData.timeline}</p>
                </div>
              </div>
            </div>

            <div className="bg-navy rounded-lg shadow-lg p-6 text-white">
              <h4 className="text-xl font-serif mb-4">Success Criteria</h4>
              <p className="text-white/80 text-sm mb-4">{formData.metric}</p>
              <div className="space-y-2 text-sm">
                <p className="flex gap-2">
                  <span>✓</span>
                  <span>Measurable and specific</span>
                </p>
                <p className="flex gap-2">
                  <span>✓</span>
                  <span>Achievable within timeline</span>
                </p>
                <p className="flex gap-2">
                  <span>✓</span>
                  <span>Aligned to business context</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-navy/10 mb-8">
            <h3 className="text-2xl font-serif text-navy mb-6">Recommended Interventions</h3>
            <div className="space-y-4">
              {interventions.map((intervention) => (
                <div
                  key={intervention.rank}
                  className="border-l-4 border-gold p-4 bg-gold/5 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-semibold text-navy flex items-center gap-2">
                      <span className="w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center text-sm font-bold">
                        {intervention.rank}
                      </span>
                      {intervention.title}
                    </h4>
                    <span className="text-xs font-semibold text-gold bg-gold/20 px-3 py-1 rounded-full">
                      {intervention.impact}
                    </span>
                  </div>
                  <p className="text-navy/70">{intervention.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setOutcomeData({
                  context: formData.context,
                  reality: formData.reality,
                  target: formData.target,
                  timeline: formData.timeline,
                  metric: formData.metric,
                  smartStatement: formData.smartStatement || '',
                  interventions,
                });
                onNavigate('package');
              }}
              className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold py-3 rounded-lg transition-colors"
            >
              Save & View D1 Package
            </button>
            <button
              onClick={() => setShowGrow(false)}
              className="bg-navy hover:bg-navy-light text-gold font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Edit Outcome
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto pb-24">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-navy mb-2">Outcome Builder</h1>
          <p className="text-navy/70 mb-6">
            Follow this 5-step process to define your SMART outcome
          </p>

          <div className="flex gap-2 mb-8">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex-1 h-2 rounded-full transition-all ${
                    idx <= currentStep ? 'bg-gold' : 'bg-navy/10'
                  }`}
                />
                {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-navy/40" />}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto">
            {steps.map((step, idx) => (
              <button
                key={step}
                onClick={() => setCurrentStep(idx)}
                disabled={idx > currentStep}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  idx === currentStep
                    ? 'bg-gold text-navy shadow-lg'
                    : idx < currentStep
                      ? 'bg-gold/30 text-navy'
                      : 'bg-navy/10 text-navy/50 cursor-not-allowed'
                }`}
              >
                {idx < currentStep ? <CheckCircle className="w-4 h-4 inline mr-1" /> : ''}
                {step}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-navy/10">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-navy mb-2">Step {currentStep + 1}</h2>
            <p className="text-lg text-gold font-semibold">{steps[currentStep]}</p>
          </div>

          <div className="mb-8">
            <p className="text-navy/70 mb-4">{prompts[stepKey]}</p>
            <textarea
              value={formData[stepKey]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [stepKey]: e.target.value,
                })
              }
              placeholder="Enter your response..."
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold min-h-[120px] resize-none"
            />
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="bg-navy hover:bg-navy-light text-gold font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!formData[stepKey]}
                className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-navy font-semibold py-3 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!formData[stepKey]}
                className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-navy font-semibold py-3 rounded-lg transition-colors"
              >
                Generate Outcome Plan
              </button>
            )}
          </div>
        </div>
      </div>
  );
}
