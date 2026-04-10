export interface NeedsAssessment {
  businessContext: string;
  currentChallenge: string;
  desiredOutcome: string;
  timeframe: string;
  successMetrics: string;
}

export interface DisaProfile {
  drive: number;
  influence: number;
  stability: number;
  accuracy: number;
}

export interface TeamMember {
  id: string;
  name: string;
  scores: DisaProfile;
}

export interface OutcomeData {
  context: string;
  reality: string;
  target: string;
  timeline: string;
  metric: string;
  smartStatement?: string;
  interventions?: Intervention[];
}

export interface Intervention {
  rank: number;
  title: string;
  description: string;
  impact: string;
}

export interface D1Package {
  id: string;
  needsAssessment: NeedsAssessment;
  disaProfile: DisaProfile;
  outcomeData: OutcomeData;
  managerSignature?: {
    name: string;
    timestamp: string;
  };
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
}

export interface TeamDisa {
  dimension: 'Drive' | 'Influence' | 'Stability' | 'Accuracy';
  members: { name: string; score: number }[];
}
