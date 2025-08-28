import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControlConfig, UserAccessConfig, ACCESS_TEMPLATES, MOCK_COMMUNITIES } from '@/types/accessControl';

interface AccessControlContextType {
  userAccess: AccessControlConfig | null;
  hasAccessToCommunity: (communityId: string) => boolean;
  hasAccessToDataCategory: (category: string) => boolean;
  hasAccessToMetric: (metricId: string) => boolean;
  getAccessibleCommunities: () => typeof MOCK_COMMUNITIES;
  getAccessSummary: () => {
    communitiesCount: number;
    totalCommunities: number;
    categoriesCount: number;
    totalCategories: number;
  };
  isAccessRestricted: (resource: 'community' | 'metric' | 'category', identifier: string) => boolean;
  updateUserAccess: (config: AccessControlConfig) => void;
}

const AccessControlContext = createContext<AccessControlContextType | undefined>(undefined);

// Mock user access configurations
const mockUserAccessConfigs: Record<string, UserAccessConfig> = {
  '7': { // REIT investor user
    userId: '7',
    templateId: 'standard_investor',
    customConfig: {
      communityAccess: ['comm1', 'comm2', 'comm5', 'comm7', 'comm10', 'comm13', 'comm16', 'comm19', 'comm22', 'comm25'], // 10 of 28 communities
      dataCategories: {
        occupancyMoveIns: true,
        financials: true,
        salesFunnel: false,
        staffing: false,
        careOutcomes: false,
        alertsCompliance: false
      },
      metricAccess: {
        occupancy_rate: true,
        move_in_velocity: true,
        average_daily_census: true,
        noi: true,
        revpau: true,
        labor_cost: false,
        operating_margin: false,
        collection_rate: true
      }
    }
  }
};

export function AccessControlProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userAccess, setUserAccess] = useState<AccessControlConfig | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'reit-investor') {
      setUserAccess(null);
      return;
    }

    // Load user access configuration
    const userConfig = mockUserAccessConfigs[user.id];
    if (userConfig) {
      if (userConfig.customConfig) {
        setUserAccess(userConfig.customConfig);
      } else if (userConfig.templateId) {
        const template = ACCESS_TEMPLATES.find(t => t.id === userConfig.templateId);
        if (template) {
          setUserAccess(template.config);
        }
      }
    }
  }, [user]);

  const hasAccessToCommunity = (communityId: string): boolean => {
    if (!user || user.role !== 'reit-investor' || !userAccess) return true;
    return userAccess.communityAccess.includes(communityId);
  };

  const hasAccessToDataCategory = (category: string): boolean => {
    if (!user || user.role !== 'reit-investor' || !userAccess) return true;
    return userAccess.dataCategories[category as keyof typeof userAccess.dataCategories] || false;
  };

  const hasAccessToMetric = (metricId: string): boolean => {
    if (!user || user.role !== 'reit-investor' || !userAccess) return true;
    return userAccess.metricAccess[metricId] || false;
  };

  const getAccessibleCommunities = () => {
    if (!user || user.role !== 'reit-investor' || !userAccess) return MOCK_COMMUNITIES;
    return MOCK_COMMUNITIES.filter(community => userAccess.communityAccess.includes(community.id));
  };

  const getAccessSummary = () => {
    if (!user || user.role !== 'reit-investor' || !userAccess) {
      return {
        communitiesCount: MOCK_COMMUNITIES.length,
        totalCommunities: MOCK_COMMUNITIES.length,
        categoriesCount: 6,
        totalCategories: 6
      };
    }

    const accessibleCategories = Object.values(userAccess.dataCategories).filter(Boolean).length;

    return {
      communitiesCount: userAccess.communityAccess.length,
      totalCommunities: MOCK_COMMUNITIES.length,
      categoriesCount: accessibleCategories,
      totalCategories: 6
    };
  };

  const isAccessRestricted = (resource: 'community' | 'metric' | 'category', identifier: string): boolean => {
    if (!user || user.role !== 'reit-investor') return false;

    switch (resource) {
      case 'community':
        return !hasAccessToCommunity(identifier);
      case 'category':
        return !hasAccessToDataCategory(identifier);
      case 'metric':
        return !hasAccessToMetric(identifier);
      default:
        return false;
    }
  };

  const updateUserAccess = (config: AccessControlConfig) => {
    setUserAccess(config);
    // In a real app, this would persist to backend
    if (user) {
      mockUserAccessConfigs[user.id] = {
        userId: user.id,
        customConfig: config
      };
    }
  };

  return (
    <AccessControlContext.Provider value={{
      userAccess,
      hasAccessToCommunity,
      hasAccessToDataCategory,
      hasAccessToMetric,
      getAccessibleCommunities,
      getAccessSummary,
      isAccessRestricted,
      updateUserAccess
    }}>
      {children}
    </AccessControlContext.Provider>
  );
}

export function useAccessControl() {
  const context = useContext(AccessControlContext);
  if (context === undefined) {
    throw new Error('useAccessControl must be used within an AccessControlProvider');
  }
  return context;
}