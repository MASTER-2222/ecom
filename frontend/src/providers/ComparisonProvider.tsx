import React from 'react';
import { ComparisonContext, useComparisonLogic } from '@/hooks/useComparison';

interface ComparisonProviderProps {
  children: React.ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const comparisonLogic = useComparisonLogic();

  return (
    <ComparisonContext.Provider value={comparisonLogic}>
      {children}
    </ComparisonContext.Provider>
  );
};