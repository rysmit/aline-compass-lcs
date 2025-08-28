import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CalculationMethod {
  id: string;
  label: string;
  description: string;
  formula?: string;
}

export interface MetricConfig {
  metricId: string;
  availableMethods: CalculationMethod[];
  defaultMethodId: string;
}

interface CalculationMethodContextType {
  selectedMethods: Record<string, string>;
  setCalculationMethod: (metricId: string, methodId: string) => void;
  getSelectedMethod: (metricId: string, availableMethods: CalculationMethod[]) => CalculationMethod | undefined;
  getMetricValue: (metricId: string, methodId: string, baseValue: string) => string;
}

const CalculationMethodContext = createContext<CalculationMethodContextType | undefined>(undefined);

export function useCalculationMethod() {
  const context = useContext(CalculationMethodContext);
  if (!context) {
    throw new Error('useCalculationMethod must be used within a CalculationMethodProvider');
  }
  return context;
}

// Define predefined calculation methods for different metrics
export const METRIC_CONFIGS: Record<string, CalculationMethod[]> = {
  'churn-rate': [
    {
      id: 'avg-census',
      label: 'Based on Avg Census',
      description: 'Calculate churn rate using average census as denominator',
      formula: '(Move-outs / Average Census) × 100'
    },
    {
      id: 'total-admissions',
      label: 'Based on Total Admissions',
      description: 'Calculate churn rate using total admissions as denominator',
      formula: '(Move-outs / Total Admissions) × 100'
    }
  ],
  'ar-risk': [
    {
      id: 'payment-history',
      label: 'Payment History Based',
      description: 'Risk calculation based on payment patterns and arrears',
      formula: 'Weighted score of payment delays, arrears amount, and collection history'
    },
    {
      id: 'predictive-model',
      label: 'Predictive Model',
      description: 'AI-driven risk assessment using multiple data points',
      formula: 'Machine learning model incorporating demographics, health, and financial factors'
    }
  ],
  'avg-length-stay': [
    {
      id: 'current-residents',
      label: 'Current Residents Only',
      description: 'Average stay length for currently active residents',
      formula: 'Sum of current resident stay lengths / Number of current residents'
    },
    {
      id: 'all-residents',
      label: 'All Historical Residents',
      description: 'Average stay length including discharged residents',
      formula: 'Sum of all resident stay lengths / Total number of residents (current + discharged)'
    }
  ],
  'occupancy-rate': [
    {
      id: 'physical-capacity',
      label: 'Physical Capacity',
      description: 'Based on total physical unit count',
      formula: '(Occupied Units / Total Physical Units) × 100'
    },
    {
      id: 'licensed-capacity',
      label: 'Licensed Capacity',
      description: 'Based on licensed bed count',
      formula: '(Occupied Units / Licensed Bed Count) × 100'
    }
  ]
};

interface CalculationMethodProviderProps {
  children: ReactNode;
}

export function CalculationMethodProvider({ children }: CalculationMethodProviderProps) {
  const [selectedMethods, setSelectedMethods] = useState<Record<string, string>>({});

  const setCalculationMethod = (metricId: string, methodId: string) => {
    setSelectedMethods(prev => ({
      ...prev,
      [metricId]: methodId
    }));
    
    // Here you would typically persist this to local storage or backend
    localStorage.setItem(`calculation-method-${metricId}`, methodId);
  };

  const getSelectedMethod = (metricId: string, availableMethods: CalculationMethod[]) => {
    // Try to get from state first, then localStorage, then default to first method
    const selectedId = selectedMethods[metricId] || 
                      localStorage.getItem(`calculation-method-${metricId}`) ||
                      availableMethods[0]?.id;
    
    return availableMethods.find(method => method.id === selectedId) || availableMethods[0];
  };

  const getMetricValue = (metricId: string, methodId: string, baseValue: string) => {
    // This is where you would implement different calculation logic
    // For demo purposes, we'll just modify the base value slightly based on method
    switch (methodId) {
      case 'avg-census':
        return baseValue; // Keep original value
      case 'total-admissions':
        // Simulate different calculation result
        const numValue = parseFloat(baseValue.replace(/[^\d.-]/g, ''));
        if (!isNaN(numValue)) {
          const adjusted = numValue * 0.85; // Example adjustment
          return baseValue.includes('%') ? `${adjusted.toFixed(1)}%` : 
                 baseValue.includes('$') ? `$${adjusted.toLocaleString()}` :
                 adjusted.toLocaleString();
        }
        return baseValue;
      case 'payment-history':
        return baseValue; // Keep original for payment history
      case 'predictive-model':
        // Simulate AI model result
        const aiValue = parseFloat(baseValue.replace(/[^\d.-]/g, ''));
        if (!isNaN(aiValue)) {
          const aiAdjusted = aiValue * 1.12; // Example AI adjustment
          return baseValue.includes('%') ? `${aiAdjusted.toFixed(1)}%` : 
                 baseValue.includes('$') ? `$${aiAdjusted.toLocaleString()}` :
                 aiAdjusted.toLocaleString();
        }
        return baseValue;
      default:
        return baseValue;
    }
  };

  return (
    <CalculationMethodContext.Provider 
      value={{ 
        selectedMethods, 
        setCalculationMethod, 
        getSelectedMethod, 
        getMetricValue 
      }}
    >
      {children}
    </CalculationMethodContext.Provider>
  );
}