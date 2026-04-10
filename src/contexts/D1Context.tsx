import { createContext, useContext, useState, ReactNode } from 'react';

interface NeedsAssessment {
  businessContext: string;
  currentChallenge: string;
  desiredOutcome: string;
  timeframe: string;
  successMetrics: string;
}

interface D1ContextType {
  needsAssessment: NeedsAssessment | null;
  setNeedsAssessment: (data: NeedsAssessment) => void;
}

const D1Context = createContext<D1ContextType | undefined>(undefined);

export function D1Provider({ children }: { children: ReactNode }) {
  const [needsAssessment, setNeedsAssessment] = useState<NeedsAssessment | null>(null);

  return (
    <D1Context.Provider value={{ needsAssessment, setNeedsAssessment }}>
      {children}
    </D1Context.Provider>
  );
}

export function useD1() {
  const context = useContext(D1Context);
  if (context === undefined) throw new Error('useD1 must be used within a D1Provider');
  return context;
}
