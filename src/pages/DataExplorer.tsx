import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Database, Library, Star, Plus, BarChart3, Users, DollarSign, TrendingUp, Heart, Building, ArrowRight, Clock, User, Stethoscope, FileText, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportBuilderProvider, useReportBuilder } from "@/contexts/ReportBuilderContext";
import { OptimizedReportCanvas } from "@/components/reports/ReportBuilder/OptimizedReportCanvas";
import { SavedReports } from "@/components/reports/Management/SavedReports";

// Comprehensive data schema representing all fields needed for the prototype
const schemaData = {
  resident: [
    {
      id: 'resident_id',
      name: 'resident_id',
      displayName: 'Resident ID',
      definition: 'Unique identifier for each resident across all systems',
      dataType: 'Text',
      sourceSystems: ['CRM', 'Billing', 'eMar'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'move_in_date',
      name: 'move_in_date',
      displayName: 'Move-in Date',
      definition: 'Date when the resident officially moved into the community',
      dataType: 'Date',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:25:00Z'
    },
    {
      id: 'move_out_date',
      name: 'move_out_date',
      displayName: 'Move-out Date',
      definition: 'Date when the resident moved out of the community',
      dataType: 'Date',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: false,
      isCalculated: false,
      lastSynced: '2025-01-05T14:25:00Z'
    },
    {
      id: 'care_level',
      name: 'care_level',
      displayName: 'Care Level',
      definition: 'Current level of care required (Independent, Assisted, Memory Care, Skilled)',
      dataType: 'Enum',
      sourceSystems: ['eMar', 'CRM'],
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T13:15:00Z'
    },
    {
      id: 'payment_status',
      name: 'payment_status',
      displayName: 'Payment Status',
      definition: 'Current payment status (Current, 30-day past due, 60-day past due, etc.)',
      dataType: 'Enum',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'churn_risk_score',
      name: 'churn_risk_score',
      displayName: 'Churn Risk Score',
      definition: 'AI-calculated probability (0-100) of resident leaving within 90 days',
      dataType: 'Number',
      sourceSystems: ['CRM', 'eMar', 'Billing'],
      calculationMethod: 'ML model analyzing care satisfaction, payment history, family engagement',
      primaryOwner: 'Analytics Engine',
      updateFrequency: 'Weekly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['care_satisfaction', 'payment_history', 'family_visits', 'incident_reports'],
      lastSynced: '2025-01-05T12:00:00Z'
    },
    {
      id: 'length_of_stay',
      name: 'length_of_stay',
      displayName: 'Length of Stay',
      definition: 'Number of months resident has been in the community',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      calculationMethod: 'Current Date - Move-in Date (in months)',
      primaryOwner: 'CRM',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['move_in_date', 'current_date'],
      lastSynced: '2025-01-05T14:25:00Z'
    }
  ],
  community: [
    {
      id: 'community_id',
      name: 'community_id',
      displayName: 'Community ID',
      definition: 'Unique identifier for each senior living community',
      dataType: 'Text',
      sourceSystems: ['CRM', 'PMS'],
      primaryOwner: 'CRM',
      updateFrequency: 'Static',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'total_units',
      name: 'total_units',
      displayName: 'Total Units',
      definition: 'Total number of available units in the community',
      dataType: 'Number',
      sourceSystems: ['PMS'],
      primaryOwner: 'PMS',
      updateFrequency: 'Monthly',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'occupied_units',
      name: 'occupied_units',
      displayName: 'Occupied Units',
      definition: 'Number of currently occupied units',
      dataType: 'Number',
      sourceSystems: ['CRM', 'PMS'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'occupancy_rate',
      name: 'occupancy_rate',
      displayName: 'Occupancy Rate',
      definition: 'Percentage of units currently occupied',
      dataType: 'Number',
      sourceSystems: ['CRM', 'PMS'],
      calculationMethod: 'Occupied Units / Total Units * 100',
      primaryOwner: 'Analytics Engine',
      updateFrequency: 'Real-time',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['occupied_units', 'total_units'],
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'break_even_occupancy',
      name: 'break_even_occupancy',
      displayName: 'Break-even Occupancy',
      definition: 'Minimum occupancy percentage required to cover operating expenses',
      dataType: 'Number',
      sourceSystems: ['Financial Planning'],
      primaryOwner: 'Finance',
      updateFrequency: 'Quarterly',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T10:00:00Z'
    }
  ],
  sales: [
    {
      id: 'inquiry_id',
      name: 'inquiry_id',
      displayName: 'Inquiry ID',
      definition: 'Unique identifier for each sales inquiry or lead',
      dataType: 'Text',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:12:00Z'
    },
    {
      id: 'inquiry_date',
      name: 'inquiry_date',
      displayName: 'Inquiry Date',
      definition: 'Date when the initial inquiry was received',
      dataType: 'Date',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:12:00Z'
    },
    {
      id: 'lead_source',
      name: 'lead_source',
      displayName: 'Lead Source',
      definition: 'Channel or method through which the inquiry was generated',
      dataType: 'Enum',
      sourceSystems: ['CRM', 'Marketing'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:12:00Z'
    },
    {
      id: 'first_response_time',
      name: 'first_response_time',
      displayName: 'First Response Time',
      definition: 'Time elapsed from inquiry to first meaningful contact',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      calculationMethod: 'First Contact Time - Inquiry Time (in hours)',
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['inquiry_date', 'first_contact_date'],
      lastSynced: '2025-01-05T14:12:00Z'
    },
    {
      id: 'tour_completed',
      name: 'tour_completed',
      displayName: 'Tour Completed',
      definition: 'Whether a tour of the facility was completed',
      dataType: 'Boolean',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: false,
      isCalculated: false,
      lastSynced: '2025-01-05T14:12:00Z'
    },
    {
      id: 'conversion_probability',
      name: 'conversion_probability',
      displayName: 'Conversion Probability',
      definition: 'AI-predicted likelihood of inquiry converting to move-in',
      dataType: 'Number',
      sourceSystems: ['CRM', 'Analytics'],
      calculationMethod: 'ML model based on lead characteristics and historical patterns',
      primaryOwner: 'Analytics Engine',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['lead_source', 'response_time', 'tour_completed', 'demographic_data'],
      lastSynced: '2025-01-05T12:00:00Z'
    }
  ],
  financial: [
    {
      id: 'monthly_revenue',
      name: 'monthly_revenue',
      displayName: 'Monthly Revenue',
      definition: 'Total revenue collected from all residents for a given month',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:02:00Z'
    },
    {
      id: 'billed_amount',
      name: 'billed_amount',
      displayName: 'Billed Amount',
      definition: 'Total amount billed to residents for services',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:02:00Z'
    },
    {
      id: 'collected_amount',
      name: 'collected_amount',
      displayName: 'Collected Amount',
      definition: 'Total amount actually collected from residents',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:02:00Z'
    },
    {
      id: 'collection_rate',
      name: 'collection_rate',
      displayName: 'Collection Rate',
      definition: 'Percentage of billed amount successfully collected',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      calculationMethod: 'Collected Amount / Billed Amount * 100',
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['collected_amount', 'billed_amount'],
      lastSynced: '2025-01-05T13:58:00Z'
    },
    {
      id: 'revenue_per_unit',
      name: 'revenue_per_unit',
      displayName: 'Revenue Per Unit',
      definition: 'Average monthly revenue per occupied unit',
      dataType: 'Number',
      sourceSystems: ['Billing', 'CRM'],
      calculationMethod: 'Monthly Revenue / Occupied Units',
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['monthly_revenue', 'occupied_units'],
      lastSynced: '2025-01-05T13:55:00Z'
    },
    {
      id: 'operating_expenses',
      name: 'operating_expenses',
      displayName: 'Operating Expenses',
      definition: 'Total monthly operating expenses excluding debt service and capital expenditures',
      dataType: 'Number',
      sourceSystems: ['ERP', 'Payroll'],
      primaryOwner: 'Finance',
      updateFrequency: 'Monthly',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T09:00:00Z'
    },
    {
      id: 'noi_per_unit',
      name: 'noi_per_unit',
      displayName: 'NOI Per Unit',
      definition: 'Net Operating Income divided by total available units',
      dataType: 'Number',
      sourceSystems: ['Billing', 'ERP'],
      calculationMethod: '(Revenue - Operating Expenses) / Total Units',
      primaryOwner: 'Finance',
      updateFrequency: 'Monthly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['monthly_revenue', 'operating_expenses', 'total_units'],
      lastSynced: '2025-01-05T09:30:00Z'
    },
    {
      id: 'ar_amount',
      name: 'ar_amount',
      displayName: 'Accounts Receivable Amount',
      definition: 'Total outstanding receivables across all aging buckets',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:02:00Z'
    },
    {
      id: 'ar_over_60_days',
      name: 'ar_over_60_days',
      displayName: 'AR Over 60 Days',
      definition: 'Accounts receivable amount over 60 days past due',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:02:00Z'
    },
    {
      id: 'ar_risk_index',
      name: 'ar_risk_index',
      displayName: 'AR Risk Index',
      definition: 'Percentage of accounts receivable over 60 days past due',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      calculationMethod: 'AR over 60 days / Total AR * 100, weighted by collection probability',
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['ar_over_60_days', 'ar_amount', 'collection_probability'],
      lastSynced: '2025-01-05T14:02:00Z'
    }
  ],
  care: [
    {
      id: 'medication_order_id',
      name: 'medication_order_id',
      displayName: 'Medication Order ID',
      definition: 'Unique identifier for each medication order',
      dataType: 'Text',
      sourceSystems: ['eMar'],
      primaryOwner: 'eMar',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'doses_prescribed',
      name: 'doses_prescribed',
      displayName: 'Doses Prescribed',
      definition: 'Total number of medication doses prescribed for a period',
      dataType: 'Number',
      sourceSystems: ['eMar'],
      primaryOwner: 'eMar',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'doses_administered',
      name: 'doses_administered',
      displayName: 'Doses Administered',
      definition: 'Number of medication doses actually given to residents',
      dataType: 'Number',
      sourceSystems: ['eMar'],
      primaryOwner: 'eMar',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'medication_adherence',
      name: 'medication_adherence',
      displayName: 'Medication Adherence',
      definition: 'Percentage of prescribed medications administered within required timeframes',
      dataType: 'Number',
      sourceSystems: ['eMar'],
      calculationMethod: 'Doses Administered / Doses Prescribed * 100',
      primaryOwner: 'eMar',
      updateFrequency: 'Hourly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['doses_administered', 'doses_prescribed'],
      lastSynced: '2025-01-05T13:50:00Z'
    },
    {
      id: 'care_tasks_scheduled',
      name: 'care_tasks_scheduled',
      displayName: 'Care Tasks Scheduled',
      definition: 'Total number of care plan activities scheduled for completion',
      dataType: 'Number',
      sourceSystems: ['eMar', 'Care Planning'],
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'care_tasks_completed',
      name: 'care_tasks_completed',
      displayName: 'Care Tasks Completed',
      definition: 'Number of care plan activities completed on time',
      dataType: 'Number',
      sourceSystems: ['eMar', 'Care Planning'],
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'care_plan_compliance',
      name: 'care_plan_compliance',
      displayName: 'Care Plan Compliance',
      definition: 'Percentage of care plan activities completed within required timeframes',
      dataType: 'Number',
      sourceSystems: ['eMar', 'Care Planning'],
      calculationMethod: 'Care Tasks Completed / Care Tasks Scheduled * 100',
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['care_tasks_completed', 'care_tasks_scheduled'],
      lastSynced: '2025-01-05T13:48:00Z'
    },
    {
      id: 'incident_reports',
      name: 'incident_reports',
      displayName: 'Incident Reports',
      definition: 'Number of reportable care incidents per period',
      dataType: 'Number',
      sourceSystems: ['eMar', 'Incident Reporting'],
      primaryOwner: 'eMar',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'incident_report_rate',
      name: 'incident_report_rate',
      displayName: 'Incident Report Rate',
      definition: 'Number of reportable care incidents per 100 residents per month',
      dataType: 'Number',
      sourceSystems: ['eMar', 'Incident Reporting'],
      calculationMethod: 'Monthly Incidents / Resident Count * 100',
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['incident_reports', 'resident_count', 'days_in_period'],
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'staff_hours_direct_care',
      name: 'staff_hours_direct_care',
      displayName: 'Staff Hours - Direct Care',
      definition: 'Total hours of direct resident care provided by staff',
      dataType: 'Number',
      sourceSystems: ['Payroll', 'Staffing'],
      primaryOwner: 'HR',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T13:00:00Z'
    },
    {
      id: 'staff_time_per_resident',
      name: 'staff_time_per_resident',
      displayName: 'Staff Time per Resident',
      definition: 'Average direct care hours per resident per day',
      dataType: 'Number',
      sourceSystems: ['Payroll', 'Staffing'],
      calculationMethod: 'Total Direct Care Hours / Total Residents / Days in Period',
      primaryOwner: 'HR',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['staff_hours_direct_care', 'resident_count', 'days_in_period'],
      lastSynced: '2025-01-05T13:00:00Z'
    },
    {
      id: 'readmissions_30_day',
      name: 'readmissions_30_day',
      displayName: '30-Day Readmissions',
      definition: 'Number of residents who returned within 30 days of moving out',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:25:00Z'
    },
    {
      id: 'total_move_outs',
      name: 'total_move_outs',
      displayName: 'Total Move-outs',
      definition: 'Total number of residents who moved out in the period',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:25:00Z'
    },
    {
      id: 'readmission_rate',
      name: 'readmission_rate',
      displayName: '30-Day Readmission Rate',
      definition: 'Percentage of residents who return within 30 days of moving out',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      calculationMethod: 'Readmissions within 30 days / Total Move-outs * 100',
      primaryOwner: 'CRM',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['readmissions_30_day', 'total_move_outs'],
      lastSynced: '2025-01-05T14:25:00Z'
    }
  ],
  forecast: [
    {
      id: 'forecast_id',
      name: 'forecast_id',
      displayName: 'Forecast ID',
      definition: 'Unique identifier for forecast predictions',
      dataType: 'Text',
      sourceSystems: ['Analytics Engine'],
      primaryOwner: 'Analytics',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T12:00:00Z'
    },
    {
      id: 'predicted_occupancy',
      name: 'predicted_occupancy',
      displayName: 'Predicted Occupancy',
      definition: 'Machine learning prediction of future occupancy rates',
      dataType: 'Number',
      sourceSystems: ['Analytics Engine'],
      calculationMethod: 'ML model: historical trends + pipeline data + seasonality',
      primaryOwner: 'Analytics',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['historical_occupancy', 'pipeline_data', 'seasonal_factors', 'market_conditions'],
      lastSynced: '2025-01-05T12:00:00Z'
    },
    {
      id: 'forecast_confidence',
      name: 'forecast_confidence',
      displayName: 'Forecast Confidence',
      definition: 'Statistical confidence level of occupancy predictions',
      dataType: 'Number',
      sourceSystems: ['Analytics Engine'],
      calculationMethod: 'Statistical confidence interval based on historical accuracy',
      primaryOwner: 'Analytics',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['prediction_variance', 'historical_accuracy'],
      lastSynced: '2025-01-05T12:00:00Z'
    },
    {
      id: 'revenue_at_risk',
      name: 'revenue_at_risk',
      displayName: 'Revenue at Risk',
      definition: 'Sum of monthly revenue from residents with high churn probability',
      dataType: 'Number',
      sourceSystems: ['Analytics Engine', 'Billing'],
      calculationMethod: 'Sum of revenue from residents with >80% churn probability',
      primaryOwner: 'Analytics',
      updateFrequency: 'Weekly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['resident_revenue', 'churn_risk_score'],
      lastSynced: '2025-01-05T12:00:00Z'
    },
    {
      id: 'high_risk_residents_count',
      name: 'high_risk_residents_count',
      displayName: 'High-Risk Residents Count',
      definition: 'Number of residents with AI-calculated churn risk score above 80%',
      dataType: 'Number',
      sourceSystems: ['Analytics Engine'],
      calculationMethod: 'Count of residents with churn risk score >80%',
      primaryOwner: 'Analytics',
      updateFrequency: 'Weekly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['churn_risk_score'],
      lastSynced: '2025-01-05T12:00:00Z'
    },
    {
      id: 'forecast_accuracy',
      name: 'forecast_accuracy',
      displayName: 'Forecast Accuracy',
      definition: 'Percentage accuracy of 30-day occupancy forecasts vs actual results',
      dataType: 'Number',
      sourceSystems: ['Analytics Engine'],
      calculationMethod: 'Accurate predictions / Total predictions * 100 over last 12 months',
      primaryOwner: 'Analytics',
      updateFrequency: 'Monthly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['forecast_predictions', 'actual_occupancy'],
      lastSynced: '2025-01-05T12:00:00Z'
    }
  ]
};

// Key metrics from all dashboard sections and drilldown pages
const keyMetrics = [
  // Executive Overview Metrics
  {
    id: 'average-daily-census',
    name: 'Average Daily Census',
    definition: 'Average number of residents per day over a given period',
    category: 'census',
    visualization: 'Bar Chart with Historical Comparison',
    linkedDashboards: ['Executive Overview', 'Census & Occupancy'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Sum of Daily Census / Number of Days'
  },
  {
    id: 'portfolio-occupancy-rate',
    name: 'Portfolio Occupancy Rate',
    definition: 'Percentage of occupied units compared to total available units',
    category: 'occupancy',
    visualization: 'Line Chart with Trend',
    linkedDashboards: ['Executive Overview', 'Census & Occupancy', 'REIT Portfolio'],
    isFavorite: true,
    isAvailable: true,
    calculation: 'Occupied Units / Total Units * 100'
  },
  {
    id: 'revenue-per-occupied-unit',
    name: 'Revenue Per Occupied Unit',
    definition: 'Total monthly revenue divided by number of occupied units',
    category: 'financial',
    visualization: 'KPI Card with Trend Indicator',
    linkedDashboards: ['Executive Overview', 'Financial Health'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Monthly Revenue / Occupied Units'
  },
  {
    id: '30-day-forecast',
    name: '30-Day Forecast',
    definition: 'Predictive model using historical trends to forecast census',
    category: 'forecast',
    visualization: 'Forecast Chart with Confidence Bands',
    linkedDashboards: ['Executive Overview', 'Forecast & Risk'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'ML Model: Historical trends + Move-ins + Move-outs + Seasonality'
  },

  // Financial Health Metrics
  {
    id: 'monthly-revenue',
    name: 'Monthly Revenue',
    definition: 'Sum of all resident revenue including rent, care fees, and ancillary services',
    category: 'financial',
    visualization: 'Line Chart with Budget Comparison',
    linkedDashboards: ['Financial Health', 'Executive Overview'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Sum of all resident revenue across all communities for current month'
  },
  {
    id: 'collection-rate',
    name: 'Collection Rate',
    definition: 'Percentage of billed amount successfully collected',
    category: 'financial',
    visualization: 'KPI Card with Trend',
    linkedDashboards: ['Financial Health'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Collected Amount / Billed Amount * 100'
  },
  {
    id: 'noi-per-unit',
    name: 'NOI Per Unit',
    definition: 'Net Operating Income divided by total available units',
    category: 'financial',
    visualization: 'KPI Card with Trend',
    linkedDashboards: ['Financial Health', 'REIT Portfolio'],
    isFavorite: false,
    isAvailable: true,
    calculation: '(Revenue - Operating Expenses) / Total Units'
  },
  {
    id: 'ar-risk-index',
    name: 'AR Risk Index',
    definition: 'Percentage of accounts receivable over 60 days past due',
    category: 'financial',
    visualization: 'Risk Indicator',
    linkedDashboards: ['Financial Health'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'AR over 60 days / Total AR * 100, weighted by collection probability'
  },

  // Census & Occupancy Metrics
  {
    id: 'census-occupancy-rate',
    name: 'Census Occupancy Rate',
    definition: 'Current percentage of occupied units across portfolio',
    category: 'occupancy',
    visualization: 'Gauge Chart with Target',
    linkedDashboards: ['Census & Occupancy'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Total occupied units / Total available units * 100'
  },
  {
    id: 'census-daily-census',
    name: 'Census Daily Census',
    definition: 'Rolling 30-day average of daily resident count',
    category: 'census',
    visualization: 'Time Series Chart',
    linkedDashboards: ['Census & Occupancy'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Sum of daily census counts over 30 days / 30'
  },
  {
    id: 'average-length-of-stay',
    name: 'Average Length of Stay',
    definition: 'Average duration residents stay from move-in to move-out',
    category: 'census',
    visualization: 'Bar Chart by Community',
    linkedDashboards: ['Census & Occupancy'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Average duration across all completed stays in last 12 months'
  },
  {
    id: 'readmission-rate',
    name: '30-Day Readmission Rate',
    definition: 'Percentage of residents who return within 30 days of moving out',
    category: 'care',
    visualization: 'Trend Line with Benchmarks',
    linkedDashboards: ['Census & Occupancy', 'Care & Compliance'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Readmissions within 30 days / Total move-outs * 100'
  },
  {
    id: 'move-in-velocity',
    name: 'Move-in Velocity',
    definition: 'Rate at which new residents move into communities',
    category: 'sales',
    visualization: 'Velocity Chart',
    linkedDashboards: ['Census & Occupancy', 'Sales Pipeline'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Net move-ins per period across all communities'
  },

  // Care & Compliance Metrics
  {
    id: 'medication-adherence',
    name: 'Medication Adherence Rate',
    definition: 'Percentage of medications administered within prescribed timeframes',
    category: 'care',
    visualization: 'Progress Ring with Details',
    linkedDashboards: ['Care & Compliance'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'On-time administrations / Total scheduled administrations * 100'
  },
  {
    id: 'care-plan-compliance',
    name: 'Care Plan Compliance',
    definition: 'Percentage of care tasks completed within required timeframes',
    category: 'care',
    visualization: 'Progress Bar',
    linkedDashboards: ['Care & Compliance'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Completed care tasks / Scheduled care tasks * 100'
  },
  {
    id: 'incident-report-rate',
    name: 'Incident Report Rate',
    definition: 'Number of reportable care incidents per 100 residents per month',
    category: 'care',
    visualization: 'Bar Chart by Incident Type',
    linkedDashboards: ['Care & Compliance'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Monthly incidents / Resident count * 100'
  },
  {
    id: 'staff-time-per-resident',
    name: 'Staff Time per Resident',
    definition: 'Average direct care hours per resident per day',
    category: 'care',
    visualization: 'Trend Chart with Targets',
    linkedDashboards: ['Care & Compliance'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Total direct care hours / Total residents / Days in period'
  },

  // Sales Pipeline Metrics
  {
    id: 'monthly-inquiries',
    name: 'Monthly Inquiries',
    definition: 'Total number of new inquiries received across all channels',
    category: 'sales',
    visualization: 'Bar Chart by Source',
    linkedDashboards: ['Sales Pipeline'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Count of new inquiries in current month'
  },
  {
    id: 'conversion-rate',
    name: 'Lead Conversion Rate',
    definition: 'Number of completed move-ins divided by total inquiries',
    category: 'sales',
    visualization: 'Funnel Chart',
    linkedDashboards: ['Sales Pipeline'],
    isFavorite: true,
    isAvailable: true,
    calculation: 'Move-ins / Total Inquiries * 100'
  },
  {
    id: 'lead-response-time',
    name: 'Lead Response Time',
    definition: 'Average time from inquiry submission to first meaningful contact',
    category: 'sales',
    visualization: 'Distribution Chart',
    linkedDashboards: ['Sales Pipeline'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Sum of response times / Number of inquiries'
  },
  {
    id: 'pipeline-value',
    name: 'Pipeline Value',
    definition: 'Sum of potential monthly revenue from prospects, weighted by probability',
    category: 'sales',
    visualization: 'Card with Breakdown',
    linkedDashboards: ['Sales Pipeline'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Sum of (Prospect Revenue × Conversion Probability)'
  },

  // Forecast & Risk Metrics
  {
    id: 'occupancy-forecast',
    name: '30-Day Occupancy Forecast',
    definition: 'Machine learning model prediction of future occupancy rates',
    category: 'forecast',
    visualization: 'Forecast Chart with Confidence Bands',
    linkedDashboards: ['Forecast & Risk'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'ML model: historical trends + pipeline data + seasonality'
  },
  {
    id: 'revenue-at-risk',
    name: 'Revenue at Risk',
    definition: 'Sum of monthly revenue from residents with high churn probability',
    category: 'forecast',
    visualization: 'Risk Matrix',
    linkedDashboards: ['Forecast & Risk'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Sum of revenue from residents with >80% churn probability'
  },
  {
    id: 'high-risk-residents',
    name: 'High-Risk Residents',
    definition: 'Number of residents with AI-calculated churn risk score above 80%',
    category: 'forecast',
    visualization: 'Alert List',
    linkedDashboards: ['Forecast & Risk'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Count of residents with churn risk score >80%'
  },
  {
    id: 'forecast-accuracy',
    name: 'Forecast Accuracy',
    definition: 'Percentage accuracy of 30-day occupancy forecasts vs actual results',
    category: 'forecast',
    visualization: 'Accuracy Chart',
    linkedDashboards: ['Forecast & Risk'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Accurate predictions / Total predictions * 100 over last 12 months'
  },
  {
    id: 'projected-occupancy',
    name: 'Projected Occupancy',
    definition: 'Expected occupancy rates for next 90 days based on current trends',
    category: 'forecast',
    visualization: 'Multi-period Forecast',
    linkedDashboards: ['Forecast & Risk'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'ML projection model with confidence intervals'
  },

  // Additional Drilldown Metrics
  {
    id: 'churn-rate',
    name: 'Churn Rate',
    definition: 'Percentage of residents who moved out over a period',
    category: 'census',
    visualization: 'Line Chart with Trend',
    linkedDashboards: ['Executive Overview', 'Census & Occupancy'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'Move-outs / Beginning Census * 100'
  },
  {
    id: 'churn-risk-score',
    name: 'Churn Risk Score',
    definition: 'AI-calculated probability of resident leaving within 90 days',
    category: 'forecast',
    visualization: 'Risk Score Distribution',
    linkedDashboards: ['Forecast & Risk', 'Census & Occupancy'],
    isFavorite: false,
    isAvailable: true,
    calculation: 'ML model analyzing care satisfaction, payment history, family engagement'
  }
];

const METRIC_CATEGORIES = [
  { id: 'all', label: 'All Metrics', icon: BarChart3 },
  { id: 'occupancy', label: 'Occupancy', icon: Building },
  { id: 'census', label: 'Census', icon: Users },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'sales', label: 'Sales', icon: TrendingUp },
  { id: 'care', label: 'Care & Clinical', icon: Heart },
  { id: 'forecast', label: 'Forecast & Risk', icon: BarChart3 }
];

const domainIcons = {
  resident: User,
  sales: Building,
  billing: DollarSign,
  care: Stethoscope,
  // Fallback for any missing domains
  default: BarChart3
};

function DataExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['occupancy-rate', 'lead-conversion-rate']));
  const [activeTab, setActiveTab] = useState("metrics");
  const { createReport, setSelectedMetrics, setSelectedFields, currentReport, setIsBuilderMode, setIsViewMode } = useReportBuilder();

  // Handle URL parameters to auto-switch to report builder tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    const mode = searchParams.get('mode');
    
    if (tab === 'reports' && currentReport) {
      setActiveTab('reports');
      
      // Set the appropriate mode
      if (mode === 'view') {
        setIsViewMode(true);
        setIsBuilderMode(false);
      } else if (mode === 'edit') {
        setIsViewMode(false);
        setIsBuilderMode(true);
      }
    }
  }, [searchParams, currentReport, setIsBuilderMode, setIsViewMode]);

const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Data Explorer" }
  ];

  const filteredMetrics = keyMetrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         metric.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (metricId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(metricId)) {
      newFavorites.delete(metricId);
    } else {
      newFavorites.add(metricId);
    }
    setFavorites(newFavorites);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = METRIC_CATEGORIES.find(cat => cat.id === categoryId);
    const Icon = category?.icon || BarChart3;
    return <Icon className="h-4 w-4" />;
  };

  const filterSchemaFields = (fields: any[]) => {
    if (!searchTerm) return fields;
    return fields.filter(field => 
      field.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreateReportFromMetric = (metricId: string) => {
    const metric = keyMetrics.find(m => m.id === metricId);
    if (metric) {
      setSelectedMetrics([metricId]);
      createReport(`${metric.name} Report`, `Custom report for ${metric.name} analysis`);
    }
  };

  const handleUseFieldInReport = (fieldId: string, domain: string) => {
    setSelectedFields([fieldId]);
    createReport(`${domain} Field Report`, `Custom report using ${fieldId} field`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="border-b border-border bg-card shadow-card">
        <div className="aline-page-margin py-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Data Explorer</h1>
                <p className="text-muted-foreground">
                  Explore metrics library and data schema used in Compass
                </p>
              </div>
              
              {/* Compass Gold Callout Banner */}
              <div 
                onClick={() => navigate('/compass-gold')}
                className="flex-shrink-0 cursor-pointer group"
              >
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 max-w-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white group-hover:text-white transition-colors">
                        🔓 Access Compass Gold
                      </span>
                    </div>
                    <p className="text-xs text-white/80">
                      Unified export-ready model for enterprise reporting
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search metrics or data fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aline-page-margin py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Metrics Library
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Schema
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report Builder
            </TabsTrigger>
          </TabsList>

          {/* Metrics Library Tab */}
          <TabsContent value="metrics" className="space-y-6">
            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-7">
                {METRIC_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {METRIC_CATEGORIES.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMetrics.map((metric) => (
                      <Card 
                        key={metric.id} 
                        className="transition-all hover:shadow-md hover:scale-[1.02]"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(metric.category)}
                              <CardTitle className="text-sm">{metric.name}</CardTitle>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(metric.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Star 
                                  className={cn(
                                    "h-3 w-3",
                                    favorites.has(metric.id) ? "fill-primary text-primary" : "text-muted-foreground"
                                  )} 
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCreateReportFromMetric(metric.id)}
                                title="Create report with this metric"
                              >
                                <Wrench className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0 space-y-3">
                          <p className="text-xs text-muted-foreground">
                            {metric.definition}
                          </p>
                          
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Calculation</p>
                            <p className="text-xs font-mono bg-muted p-2 rounded">{metric.calculation}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Visualization</p>
                            <p className="text-xs">{metric.visualization}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Used In</p>
                            <div className="flex flex-wrap gap-1">
                              {metric.linkedDashboards.map((dashboard) => (
                                <Badge key={dashboard} variant="outline" className="text-xs">
                                  {dashboard}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* Schema Explorer Tab */}
          <TabsContent value="schema" className="space-y-6">
            <Tabs defaultValue="resident" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resident" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Resident
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Sales
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="care" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Care
                </TabsTrigger>
              </TabsList>

              {Object.entries(schemaData).map(([domain, fields]) => {
                const Icon = domainIcons[domain as keyof typeof domainIcons] || domainIcons.default;
                const filteredFields = filterSchemaFields(fields);
                
                return (
                  <TabsContent key={domain} value={domain} className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold capitalize">{domain} Data Fields</h2>
                      <Badge variant="outline">{filteredFields.length} fields</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredFields.map((field) => (
                        <Card key={field.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Database className="h-4 w-4" />
                                  {field.displayName}
                                </CardTitle>
                                <p className="text-xs font-mono text-muted-foreground">{field.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleUseFieldInReport(field.id, domain)}
                                  title="Use field in report"
                                >
                                  <Wrench className="h-3 w-3" />
                                </Button>
                                <Badge variant="outline" className="text-xs">{field.dataType}</Badge>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0 space-y-3">
                            <p className="text-xs text-muted-foreground">{field.definition}</p>
                            
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{field.updateFrequency}</span>
                              </div>
                              <Badge variant={field.isRequired ? "default" : "secondary"} className="text-xs">
                                {field.isRequired ? "Required" : "Optional"}
                              </Badge>
                              {field.isCalculated && (
                                <Badge variant="outline" className="text-xs">
                                  Calculated
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Source Systems</p>
                              <div className="flex flex-wrap gap-1">
                                {field.sourceSystems.map((system) => (
                                  <Badge key={system} variant="secondary" className="text-xs">
                                    {system}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {field.calculationMethod && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Calculation</p>
                                <p className="text-xs font-mono bg-muted p-2 rounded">{field.calculationMethod}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          {/* Report Builder Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Tabs defaultValue="builder" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="builder" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Report Builder
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Saved Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="builder">
                <OptimizedReportCanvas />
              </TabsContent>

              <TabsContent value="saved">
                <SavedReports />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DataExplorer;