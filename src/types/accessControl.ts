// Access control types and definitions

export interface AccessControlConfig {
  communityAccess: string[]; // Community IDs
  dataCategories: DataCategoryAccess;
  metricAccess: Record<string, boolean>; // Metric ID -> allowed
}

export interface DataCategoryAccess {
  occupancyMoveIns: boolean;
  financials: boolean;
  salesFunnel: boolean;
  staffing: boolean;
  careOutcomes: boolean;
  alertsCompliance: boolean;
}

export interface AccessTemplate {
  id: string;
  name: string;
  description: string;
  config: AccessControlConfig;
}

export interface UserAccessConfig {
  userId: string;
  templateId?: string;
  customConfig?: AccessControlConfig;
}

// Data categories with their metrics
export const DATA_CATEGORIES = {
  occupancyMoveIns: {
    label: "Occupancy & Move-Ins",
    metrics: [
      { id: "occupancy_rate", label: "Occupancy Rate" },
      { id: "move_in_velocity", label: "Move-in Velocity" },
      { id: "average_daily_census", label: "Average Daily Census" },
      { id: "census_stability", label: "Census Stability" },
      { id: "projected_occupancy", label: "Projected Occupancy" }
    ]
  },
  financials: {
    label: "Financials",
    metrics: [
      { id: "noi", label: "NOI" },
      { id: "labor_cost", label: "Labor Cost" },
      { id: "revpau", label: "RevPAU" },
      { id: "operating_margin", label: "Operating Margin" },
      { id: "collection_rate", label: "Collection Rate" },
      { id: "revenue_per_unit", label: "Revenue Per Unit" }
    ]
  },
  salesFunnel: {
    label: "Sales Funnel",
    metrics: [
      { id: "monthly_inquiries", label: "Monthly Inquiries" },
      { id: "conversion_rate", label: "Conversion Rate" },
      { id: "lead_response_time", label: "Lead Response Time" },
      { id: "pipeline_value", label: "Pipeline Value" },
      { id: "churn_rate", label: "Churn Rate" }
    ]
  },
  staffing: {
    label: "Staffing",
    metrics: [
      { id: "staff_time_per_resident", label: "Staff Time Per Resident" },
      { id: "staffing_ratio", label: "Staffing Ratio" },
      { id: "labor_efficiency", label: "Labor Efficiency" },
      { id: "overtime_hours", label: "Overtime Hours" }
    ]
  },
  careOutcomes: {
    label: "Care Outcomes",
    metrics: [
      { id: "incident_rate", label: "Incident Rate" },
      { id: "average_acuity", label: "Average Acuity" },
      { id: "readmission_rate", label: "Readmission Rate" },
      { id: "medication_adherence", label: "Medication Adherence" },
      { id: "care_plan_compliance", label: "Care Plan Compliance" },
      { id: "high_risk_residents", label: "High Risk Residents" }
    ]
  },
  alertsCompliance: {
    label: "Alerts & Compliance",
    metrics: [
      { id: "compliance_score", label: "Compliance Score" },
      { id: "alert_frequency", label: "Alert Frequency" },
      { id: "incident_report_rate", label: "Incident Report Rate" },
      { id: "regulatory_violations", label: "Regulatory Violations" }
    ]
  }
} as const;

// Pre-defined access templates
export const ACCESS_TEMPLATES: AccessTemplate[] = [
  {
    id: "standard_investor",
    name: "Standard Investor",
    description: "Basic occupancy and financial metrics",
    config: {
      communityAccess: [], // Will be set per user
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
        noi: true,
        revpau: true,
        labor_cost: false,
        operating_margin: false
      }
    }
  },
  {
    id: "financial_only",
    name: "Financial-Only",
    description: "Financial metrics and NOI focus",
    config: {
      communityAccess: [],
      dataCategories: {
        occupancyMoveIns: false,
        financials: true,
        salesFunnel: false,
        staffing: false,
        careOutcomes: false,
        alertsCompliance: false
      },
      metricAccess: {
        noi: true,
        operating_margin: true,
        revpau: true,
        collection_rate: true,
        revenue_per_unit: true
      }
    }
  },
  {
    id: "operational_partner",
    name: "Operational Partner",
    description: "Financials and sales, no care outcomes",
    config: {
      communityAccess: [],
      dataCategories: {
        occupancyMoveIns: true,
        financials: true,
        salesFunnel: true,
        staffing: false,
        careOutcomes: false,
        alertsCompliance: false
      },
      metricAccess: {
        occupancy_rate: true,
        move_in_velocity: true,
        noi: true,
        revpau: true,
        monthly_inquiries: true,
        conversion_rate: true,
        lead_response_time: true
      }
    }
  }
];

// Mock communities data
export const MOCK_COMMUNITIES = [
  { id: "comm1", name: "Sunset Manor", operator: "Senior Living Partners", region: "Southeast", state: "FL" },
  { id: "comm2", name: "Oak Ridge", operator: "Senior Living Partners", region: "Southeast", state: "GA" },
  { id: "comm3", name: "Pine Valley", operator: "Heritage Care Group", region: "Northeast", state: "NY" },
  { id: "comm4", name: "Maple Gardens", operator: "Heritage Care Group", region: "Northeast", state: "MA" },
  { id: "comm5", name: "Cedar Heights", operator: "Sunrise Communities", region: "West", state: "CA" },
  { id: "comm6", name: "Willowbrook", operator: "Sunrise Communities", region: "West", state: "WA" },
  { id: "comm7", name: "Heritage Manor", operator: "Senior Living Partners", region: "Southeast", state: "NC" },
  { id: "comm8", name: "Golden Years", operator: "Heritage Care Group", region: "Northeast", state: "CT" },
  { id: "comm9", name: "Riverside Gardens", operator: "Sunrise Communities", region: "West", state: "OR" },
  { id: "comm10", name: "Peaceful Pines", operator: "Senior Living Partners", region: "Southeast", state: "SC" },
  { id: "comm11", name: "Autumn Leaves", operator: "Heritage Care Group", region: "Northeast", state: "ME" },
  { id: "comm12", name: "Mountain View", operator: "Sunrise Communities", region: "West", state: "CO" },
  { id: "comm13", name: "Seaside Manor", operator: "Senior Living Partners", region: "Southeast", state: "FL" },
  { id: "comm14", name: "Country Club", operator: "Heritage Care Group", region: "Northeast", state: "NH" },
  { id: "comm15", name: "Desert Springs", operator: "Sunrise Communities", region: "West", state: "AZ" },
  { id: "comm16", name: "Lakeside Villa", operator: "Senior Living Partners", region: "Southeast", state: "TN" },
  { id: "comm17", name: "Forest Glen", operator: "Heritage Care Group", region: "Northeast", state: "VT" },
  { id: "comm18", name: "Sunset Hills", operator: "Sunrise Communities", region: "West", state: "NV" },
  { id: "comm19", name: "Garden Terrace", operator: "Senior Living Partners", region: "Southeast", state: "AL" },
  { id: "comm20", name: "Valley View", operator: "Heritage Care Group", region: "Northeast", state: "RI" },
  { id: "comm21", name: "Hilltop Manor", operator: "Sunrise Communities", region: "West", state: "UT" },
  { id: "comm22", name: "Meadowbrook", operator: "Senior Living Partners", region: "Southeast", state: "KY" },
  { id: "comm23", name: "Brookstone", operator: "Heritage Care Group", region: "Northeast", state: "PA" },
  { id: "comm24", name: "Sunrise Villa", operator: "Sunrise Communities", region: "West", state: "ID" },
  { id: "comm25", name: "Oakwood", operator: "Senior Living Partners", region: "Southeast", state: "VA" },
  { id: "comm26", name: "Pineview", operator: "Heritage Care Group", region: "Northeast", state: "NJ" },
  { id: "comm27", name: "Crystal Lake", operator: "Sunrise Communities", region: "West", state: "WY" },
  { id: "comm28", name: "Fairview Manor", operator: "Senior Living Partners", region: "Southeast", state: "WV" }
];