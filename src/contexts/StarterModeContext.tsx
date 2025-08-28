import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StarterModeContextType {
  isStarterMode: boolean;
  toggleStarterMode: () => void;
  availableIntegrations: string[];
  getFeatureStatus: (feature: string) => { 
    available: boolean; 
    lockReason?: string; 
    requiredIntegration?: string;
  };
}

const StarterModeContext = createContext<StarterModeContextType | undefined>(undefined);

// Define what's available in starter mode (only Aline CRM)
const STARTER_MODE_INTEGRATIONS = ['aline-crm'];

const FEATURE_REQUIREMENTS = {
  // Financial KPIs
  'monthly-revenue': { integration: 'rent-roll', lockReason: 'Requires Billing Integration' },
  'revenue-per-unit': { integration: 'rent-roll', lockReason: 'Requires Billing Integration' },
  'noi-per-unit': { integration: 'rent-roll', lockReason: 'Requires Billing Integration' },
  'collection-rate': { integration: 'rent-roll', lockReason: 'Requires Billing Integration' },
  'accounts-receivable': { integration: 'rent-roll', lockReason: 'Requires Billing Integration' },
  
  // Staffing/Payroll KPIs
  'staff-time-per-resident': { integration: 'payroll', lockReason: 'Unlock by Adding Payroll Data' },
  'labor-cost-ratio': { integration: 'payroll', lockReason: 'Unlock by Adding Payroll Data' },
  
  // Advanced Clinical KPIs
  'medication-adherence': { integration: 'emar', lockReason: 'Requires eMar Integration' },
  'care-plan-compliance': { integration: 'emar', lockReason: 'Requires eMar Integration' },
  
  // Predictive Analytics
  'churn-risk-score': { integration: 'multiple', lockReason: 'Unlock Forecasting by Adding Payroll Data' },
  'occupancy-forecast': { integration: 'multiple', lockReason: 'Unlock Forecasting by Adding Billing & Payroll Data' },
  'revenue-forecast': { integration: 'multiple', lockReason: 'Unlock Forecasting by Adding Billing & Payroll Data' },
  
  // Full dashboard sections
  'financial-health': { integration: 'rent-roll', lockReason: 'Requires Billing Integration' },
  'predictive-analytics': { integration: 'multiple', lockReason: 'Unlock Forecasting by Adding Additional Data Sources' }
};

export function StarterModeProvider({ children }: { children: ReactNode }) {
  const [isStarterMode, setIsStarterMode] = useState(false);

  const toggleStarterMode = () => {
    setIsStarterMode(!isStarterMode);
  };

  const getFeatureStatus = (feature: string) => {
    if (!isStarterMode) {
      return { available: true };
    }

    const requirement = FEATURE_REQUIREMENTS[feature as keyof typeof FEATURE_REQUIREMENTS];
    
    if (!requirement) {
      // If no requirement specified, assume it's available in starter mode
      return { available: true };
    }

    // In starter mode, only features that don't require additional integrations are available
    return {
      available: false,
      lockReason: requirement.lockReason,
      requiredIntegration: requirement.integration
    };
  };

  return (
    <StarterModeContext.Provider value={{
      isStarterMode,
      toggleStarterMode,
      availableIntegrations: isStarterMode ? STARTER_MODE_INTEGRATIONS : [],
      getFeatureStatus
    }}>
      {children}
    </StarterModeContext.Provider>
  );
}

export function useStarterMode() {
  const context = useContext(StarterModeContext);
  if (context === undefined) {
    throw new Error('useStarterMode must be used within a StarterModeProvider');
  }
  return context;
}