import { useState } from 'react';
import { BarChart3, Users } from 'lucide-react';
import { useD1 } from '../contexts/D1Context';
import Layout from '../components/Layout';

interface LearnaDNAProps {
  onNavigate: (page: string) => void;
}

const behaviours = {
  Drive: [
    'Sets ambitious goals and targets',
    'Takes initiative and drives action',
    'Persists through obstacles',
    'Motivates self and others',
    'Shows competitive spirit',
  ],
  Influence: [
    'Communicates persuasively',
    'Builds strong relationships',
    'Adapts communication style',
    'Gains buy-in from others',
    'Leads through example',
  ],
  Stability: [
    'Remains calm under pressure',
    'Shows consistency in delivery',
    'Supports colleagues emotionally',
    'Demonstrates reliability',
    'Maintains composure',
  ],
  Accuracy: [
    'Focuses on detail and quality',
    'Analyzes information thoroughly',
    'Plans methodically',
    'Follows processes precisely',
    'Ensures accuracy in work',
  ],
};

const teamMembers = [
  { name: 'Sarah Johnson', drive: 4, influence: 5, stability: 4, accuracy: 3 },
  { name: 'Michael Chen', drive: 3, influence: 3, stability: 4, accuracy: 5 },
  { name: 'Emma Wilson', drive: 4, influence: 4, stability: 3, accuracy: 4 },
  { name: 'James Brown', drive: 5, influence: 3, stability: 3, accuracy: 4 },
  { name: 'Lisa Kumar', drive: 3, influence: 4, stability: 5, accuracy: 3 },
];

export default function LearnaDNA({ onNavigate }: LearnaDNAProps) {
  const { setDisaProfile } = useD1();
  const [mode, setMode] = useState<'individual' | 'team'>('individual');
  const [scores, setScores] = useState({
    Drive: Array(5).fill(3),
    Influence: Array(5).fill(3),
    Stability: Array(5).fill(3),
    Accuracy: Array(5).fill(3),
  });
  const [showProfile, setShowProfile] = useState(false);

  const handleScoreChange = (dimension: keyof typeof scores, index: number, value: number) => {
    setScores({
      ...scores,
      [dimension]: scores[dimension].map((s, i) => (i === index ? value : s)),
    });
  };

  const calculateAverage = (dimension: keyof typeof scores) => {
    const values = scores[dimension];
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const handleSubmit = () => {
    const profile = {
      drive: parseFloat(calculateAverage('Drive')),
      influence: parseFloat(calculateAverage('Influence')),
      stability: parseFloat(calculateAverage('Stability')),
      accuracy: parseFloat(calculateAverage('Accuracy')),
    };
    setDisaProfile(profile);
    onNavigate('package');
  };

  if (showProfile && mode === 'individual') {
    return (
      <Layout currentPage="/d1/dna">
        <div className="max-w-4xl mx-auto pb-24">
          <h1 className="text-4xl font-serif text-navy mb-2">Your DISA Profile</h1>
          <p className="text-navy/70 mb-8">Based on your 20 observable behaviours assessment</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {(Object.keys(scores) as Array<keyof typeof scores>).map((dimension) => (
              <div key={dimension} className="bg-white rounded-lg shadow-lg p-6 border border-navy/10">
                <h3 className="text-xl font-serif text-navy mb-4">{dimension}</h3>
                <div className="flex items-end gap-2 h-32">
                  <div
                    className="bg-gold rounded-t-lg flex-1"
                    style={{
                      height: `${(parseFloat(calculateAverage(dimension)) / 5) * 100}%`,
                    }}
                  />
                  <div className="text-center">
                    <p className="text-3xl font-serif text-navy">
                      {calculateAverage(dimension)}
                    </p>
                    <p className="text-xs text-navy/60">/5.0</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-navy/10 mb-8">
            <h3 className="text-2xl font-serif text-navy mb-6">L&D Recommendations</h3>
            <ul className="space-y-4">
              {calculateAverage('Drive') < 3 && (
                <li className="flex gap-3 p-4 bg-navy/5 rounded-lg">
                  <span className="text-gold">▸</span>
                  <div>
                    <p className="font-semibold text-navy">Drive Development</p>
                    <p className="text-sm text-navy/70">
                      Goal-setting and motivation workshops to build assertiveness and initiative
                    </p>
                  </div>
                </li>
              )}
              {calculateAverage('Influence') < 3 && (
                <li className="flex gap-3 p-4 bg-navy/5 rounded-lg">
                  <span className="text-gold">▸</span>
                  <div>
                    <p className="font-semibold text-navy">Influence Enhancement</p>
                    <p className="text-sm text-navy/70">
                      Communication and stakeholder management skills development
                    </p>
                  </div>
                </li>
              )}
              {calculateAverage('Stability') < 3 && (
                <li className="flex gap-3 p-4 bg-navy/5 rounded-lg">
                  <span className="text-gold">▸</span>
                  <div>
                    <p className="font-semibold text-navy">Resilience Building</p>
                    <p className="text-sm text-navy/70">
                      Stress management and emotional intelligence coaching
                    </p>
                  </div>
                </li>
              )}
              {calculateAverage('Accuracy') < 3 && (
                <li className="flex gap-3 p-4 bg-navy/5 rounded-lg">
                  <span className="text-gold">▸</span>
                  <div>
                    <p className="font-semibold text-navy">Precision & Process</p>
                    <p className="text-sm text-navy/70">
                      Quality assurance and methodical planning training
                    </p>
                  </div>
                </li>
              )}
              <li className="flex gap-3 p-4 bg-gold/10 border border-gold rounded-lg">
                <span className="text-gold">✓</span>
                <div>
                  <p className="font-semibold text-navy">Strengths Reinforcement</p>
                  <p className="text-sm text-navy/70">
                    Continue leveraging your highest-scoring dimensions in daily work
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold py-3 rounded-lg transition-colors"
            >
              Save Profile & Continue
            </button>
            <button
              onClick={() => setShowProfile(false)}
              className="bg-navy/10 hover:bg-navy/20 text-navy font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Edit Responses
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="/d1/dna">
      <div className="max-w-6xl mx-auto pb-24">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setMode('individual')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'individual'
                ? 'bg-gold text-navy shadow-lg'
                : 'bg-white text-navy/70 border border-navy/20 hover:border-gold'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Individual Profile
          </button>
          <button
            onClick={() => setMode('team')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'team'
                ? 'bg-gold text-navy shadow-lg'
                : 'bg-white text-navy/70 border border-navy/20 hover:border-gold'
            }`}
          >
            <Users className="w-5 h-5" />
            Team Analysis
          </button>
        </div>

        {mode === 'individual' ? (
          <div>
            <h1 className="text-4xl font-serif text-navy mb-2">LearnaDNA Assessment</h1>
            <p className="text-navy/70 mb-8">
              Rate 20 observable behaviours across 4 dimensions on a scale of 1-5
            </p>

            <div className="space-y-8">
              {(Object.keys(behaviours) as Array<keyof typeof behaviours>).map((dimension) => (
                <div key={dimension} className="bg-white rounded-lg shadow-lg p-8 border border-navy/10">
                  <h3 className="text-2xl font-serif text-navy mb-6 pb-4 border-b-2 border-gold">
                    {dimension}
                  </h3>
                  <div className="space-y-4">
                    {behaviours[dimension].map((behaviour, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-6">
                        <label className="text-navy flex-1">{behaviour}</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() =>
                                handleScoreChange(
                                  dimension as keyof typeof scores,
                                  idx,
                                  rating
                                )
                              }
                              className={`w-10 h-10 rounded font-semibold transition-all ${
                                scores[dimension][idx] === rating
                                  ? 'bg-gold text-navy shadow-lg'
                                  : 'bg-navy/10 text-navy hover:bg-navy/20'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowProfile(true)}
                className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold py-3 rounded-lg transition-colors"
              >
                View My DISA Profile
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-serif text-navy mb-2">Team DISA Analysis</h1>
            <p className="text-navy/70 mb-8">Comparative analysis of team member profiles</p>

            <div className="space-y-8">
              {['Drive', 'Influence', 'Stability', 'Accuracy'].map((dimension) => (
                <div key={dimension} className="bg-white rounded-lg shadow-lg p-8 border border-navy/10">
                  <h3 className="text-2xl font-serif text-navy mb-6 pb-4 border-b-2 border-gold">
                    {dimension}
                  </h3>
                  <div className="space-y-3">
                    {teamMembers.map((member) => {
                      const score =
                        member[dimension.toLowerCase() as keyof typeof member] || 0;
                      return (
                        <div key={member.name} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-navy">{member.name}</div>
                          <div className="flex-1 h-8 bg-navy/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold transition-all"
                              style={{ width: `${(score / 5) * 100}%` }}
                            />
                          </div>
                          <div className="w-12 text-right font-bold text-navy">{score}/5</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={() => onNavigate('home')}
                className="bg-navy/10 hover:bg-navy/20 text-navy font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
