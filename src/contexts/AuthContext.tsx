import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'c-level' | 'regional-ops' | 'sales' | 'clinical' | 'finance' | 'reit-investor' | 'starter-demo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  assignedRegions?: string[];
  assignedCommunities?: string[];
  accessConfig?: {
    communityAccess: string[];
    dataCategories: Record<string, boolean>;
    metricAccess: Record<string, boolean>;
  };
}

export interface Permission {
  resource: string;
  action: 'view' | 'edit' | 'delete' | 'create';
  scope?: 'all' | 'region' | 'community' | 'own';
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (resource: string, action: string, scope?: string) => boolean;
  canViewResource: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission definitions by role
const rolePermissions: Record<UserRole, string[]> = {
  'admin': [
    '*',
    'admin:view',
    'admin:edit',
    'admin:configure',
    'thresholds:manage',
    'roles:configure',
    'alerts:manage',
    'notifications:manage',
    'drilldown:view'
  ],
  'c-level': [
    'executive-overview:view',
    'census-occupancy:view',
    'sales-pipeline:view',
    'financial-health:view',
    'care-compliance:view',
    'forecast-risk:view',
    'alerts:view',
    'notifications:view',
    'drilldown:view'
  ],
  'regional-ops': [
    'executive-overview:view:regional',
    'census-occupancy:view',
    'financial-health:view:regional',
    'care-compliance:view',
    'alerts:view:regional',
    'notifications:view',
    'drilldown:view:regional'
  ],
  'sales': [
    'sales-pipeline:view',
    'census-occupancy:view:sales-relevant',
    'alerts:view:sales',
    'notifications:view',
    'drilldown:view:sales'
  ],
  'clinical': [
    'care-compliance:view',
    'census-occupancy:view:clinical',
    'alerts:view:clinical',
    'notifications:view',
    'drilldown:view:clinical'
  ],
  'finance': [
    'financial-health:view',
    'executive-overview:view:financial',
    'forecast-risk:view',
    'alerts:view:financial',
    'notifications:view',
    'drilldown:view:financial'
  ],
  'reit-investor': [
    'reit-portfolio:view',
    'portfolio-performance:view',
    'operator-comparison:view',
    'asset-alerts:view',
    'benchmarks:view',
    'noi-metrics:view',
    'occupancy-analysis:view',
    'risk-assessment:view',
    'drilldown:view:reit'
  ],
  'starter-demo': [
    'executive-overview:view',
    'census-occupancy:view',
    'sales-pipeline:view',
    'alerts:view',
    'notifications:view',
    'drilldown:view'
  ]
};

// Mock user data
const mockUsers: Record<string, User> = {
  'admin': {
    id: '1',
    name: 'Sarah Admin',
    email: 'sarah@alinecompass.com',
    role: 'admin',
    permissions: ['*']
  },
  'c-level': {
    id: '2', 
    name: 'John Executive',
    email: 'john.exec@alinecompass.com',
    role: 'c-level',
    permissions: rolePermissions['c-level']
  },
  'regional-ops': {
    id: '3',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@alinecompass.com', 
    role: 'regional-ops',
    permissions: rolePermissions['regional-ops'],
    assignedRegions: ['northeast', 'southeast']
  },
  'sales': {
    id: '4',
    name: 'David Sales',
    email: 'david.sales@alinecompass.com',
    role: 'sales',
    permissions: rolePermissions['sales']
  },
  'clinical': {
    id: '5',
    name: 'Lisa Nurse',
    email: 'lisa.nurse@alinecompass.com',
    role: 'clinical',
    permissions: rolePermissions['clinical']
  },
  'finance': {
    id: '6',
    name: 'Robert Finance',
    email: 'robert.finance@alinecompass.com',
    role: 'finance',
    permissions: rolePermissions['finance']
  },
  'reit-investor': {
    id: '7',
    name: 'Jennifer Stevens',
    email: 'jennifer.stevens@reitinvestor.com',
    role: 'reit-investor',
    permissions: rolePermissions['reit-investor'],
    accessConfig: {
      communityAccess: ['comm1', 'comm2', 'comm5', 'comm7', 'comm10', 'comm13', 'comm16', 'comm19', 'comm22', 'comm25'],
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
  },
  'starter-demo': {
    id: '8',
    name: 'Demo User (Starter Mode)',
    email: 'demo.starter@alinecompass.com',
    role: 'starter-demo',
    permissions: rolePermissions['starter-demo'],
    accessConfig: {
      communityAccess: ['comm1', 'comm2', 'comm3', 'comm4', 'comm5'],
      dataCategories: {
        occupancyMoveIns: true,
        clinicalMetrics: false,
        salesFunnel: true,
        financials: false,
        staffing: false,
        careOutcomes: false,
        alertsCompliance: false
      },
      metricAccess: {
        occupancy_rate: true,
        move_in_velocity: true,
        average_daily_census: true,
        churn_rate: true,
        lead_response_time: true,
        conversion_rate: true,
        care_plan_compliance: false,
        readmission_rate: false,
        incident_report_rate: false,
        noi: false,
        revpau: false,
        labor_cost: false,
        operating_margin: false,
        collection_rate: false,
        medication_adherence: false,
        staff_time_per_resident: false
      }
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Set default admin user - no authentication required
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@alinecompass.com',
    role: 'admin',
    permissions: ['*']
  });

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (resource: string, action: string, scope?: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.permissions.includes('*')) return true;
    
    // Check specific permission
    const permissionKey = scope ? `${resource}:${action}:${scope}` : `${resource}:${action}`;
    return user.permissions.includes(permissionKey);
  };

  const canViewResource = (resource: string): boolean => {
    return hasPermission(resource, 'view') || hasPermission(resource, 'view', 'summary');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      canViewResource
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { mockUsers };