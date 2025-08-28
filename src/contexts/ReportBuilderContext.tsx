import { createContext, useContext, useState, ReactNode } from 'react';

// Report Types
export interface ReportComponent {
  id: string;
  type: 'chart' | 'table' | 'kpi' | 'text';
  position: { x: number; y: number; width: number; height: number };
  config: ComponentConfig;
  dataSource: DataSourceConfig;
}

export interface ComponentConfig {
  title?: string;
  description?: string;
  content?: string; // For text components
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'gauge' | 'scatter';
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  groupBy?: string[];
  format?: 'number' | 'currency' | 'percentage';
  fontSize?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
  showLegend?: boolean;
  showGrid?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  min?: number;
  max?: number;
  styling?: {
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
  };
}

export interface DataSourceConfig {
  metricId?: string;
  fields?: string[];
  filters?: ReportFilter[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  layout: ReportLayout;
  permissions: ReportPermissions;
  isTemplate?: boolean;
}

export interface ReportLayout {
  components: ReportComponent[];
  filters: ReportFilter[];
  dimensions: string[];
}

export interface ReportPermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  isPublic: boolean;
}

// Context Types
interface ReportBuilderContextType {
  // Current report state
  currentReport: CustomReport | null;
  
  // Report management
  createReport: (name: string, description?: string) => void;
  loadReport: (reportId: string) => void;
  saveReport: () => void;
  deleteReport: (reportId: string) => void;
  updateReportDetails: (name: string, description: string) => void;
  
  // Component management
  addComponent: (component: Omit<ReportComponent, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<ReportComponent>) => void;
  removeComponent: (id: string) => void;
  
  // Layout and canvas
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
  
  // Data source helpers
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
  selectedFields: string[];
  setSelectedFields: (fields: string[]) => void;
  
  // Report library
  savedReports: CustomReport[];
  templates: CustomReport[];
  
  // UI state
  isBuilderMode: boolean;
  setIsBuilderMode: (mode: boolean) => void;
  isViewMode: boolean;
  setIsViewMode: (mode: boolean) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
}

const ReportBuilderContext = createContext<ReportBuilderContextType | undefined>(undefined);

export function ReportBuilderProvider({ children }: { children: ReactNode }) {
  const [currentReport, setCurrentReport] = useState<CustomReport | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  
  // Mock data - in real app would come from API/database
  const [savedReports, setSavedReports] = useState<CustomReport[]>([
    {
      id: 'sample-dashboard-001',
      name: 'Top Portfolio Metrics',
      description: 'Essential KPIs and performance indicators for portfolio management including occupancy, revenue, and compliance metrics',
      createdBy: 'Demo User',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-02-01'),
      layout: {
        components: [
          {
            id: 'kpi-occupancy',
            type: 'kpi',
            position: { x: 20, y: 20, width: 280, height: 120 },
            config: {
              title: 'Average Occupancy Rate',
              format: 'percentage',
              primaryColor: '#22c55e'
            },
            dataSource: {
              metricId: 'occupancy-rate',
              fields: ['community_id', 'date']
            }
          },
          {
            id: 'kpi-revenue',
            type: 'kpi',
            position: { x: 320, y: 20, width: 280, height: 120 },
            config: {
              title: 'Monthly Revenue',
              format: 'currency',
              primaryColor: '#3b82f6'
            },
            dataSource: {
              metricId: 'revenue-per-unit',
              fields: ['community_id', 'date']
            }
          },
          {
            id: 'chart-trends',
            type: 'chart',
            position: { x: 20, y: 160, width: 580, height: 300 },
            config: {
              title: 'Occupancy & Revenue Trends',
              chartType: 'line',
              showLegend: true,
              showGrid: true,
              primaryColor: '#22c55e',
              secondaryColor: '#3b82f6'
            },
            dataSource: {
              metricId: 'occupancy-rate',
              fields: ['date', 'community_id']
            }
          },
          {
            id: 'kpi-compliance',
            type: 'kpi',
            position: { x: 620, y: 20, width: 280, height: 120 },
            config: {
              title: 'Care Plan Compliance',
              format: 'percentage',
              primaryColor: '#8b5cf6'
            },
            dataSource: {
              metricId: 'care-plan-compliance',
              fields: ['community_id', 'care_level']
            }
          },
          {
            id: 'chart-breakdown',
            type: 'chart',
            position: { x: 620, y: 160, width: 380, height: 300 },
            config: {
              title: 'Revenue by Community',
              chartType: 'bar',
              showLegend: false,
              showGrid: true,
              primaryColor: '#f59e0b'
            },
            dataSource: {
              metricId: 'revenue-per-unit',
              fields: ['community_id', 'region']
            }
          },
          {
            id: 'table-summary',
            type: 'table',
            position: { x: 20, y: 480, width: 980, height: 250 },
            config: {
              title: 'Community Performance Summary'
            },
            dataSource: {
              metricId: 'occupancy-rate',
              fields: ['community_id', 'region', 'care_level']
            }
          }
        ],
        filters: [
          {
            field: 'date',
            operator: 'between',
            value: { start: '2024-01-01', end: '2024-02-28' }
          }
        ],
        dimensions: ['community_id', 'region', 'care_level', 'date']
      },
      permissions: {
        owner: 'demo-user',
        viewers: ['manager1', 'analyst1'],
        editors: ['admin1'],
        isPublic: false
      }
    }
  ]);
  const [templates] = useState<CustomReport[]>([
    {
      id: 'template-executive',
      name: 'Executive Dashboard',
      description: 'High-level KPIs and trends for leadership',
      createdBy: 'system',
      createdAt: new Date(),
      lastModified: new Date(),
      isTemplate: true,
      layout: {
        components: [],
        filters: [],
        dimensions: []
      },
      permissions: {
        owner: 'system',
        viewers: [],
        editors: [],
        isPublic: true
      }
    }
  ]);

  const createReport = (name: string, description?: string) => {
    const newReport: CustomReport = {
      id: `report-${Date.now()}`,
      name,
      description: description || '',
      createdBy: 'current-user', // Would come from auth context
      createdAt: new Date(),
      lastModified: new Date(),
      layout: {
        components: [],
        filters: [],
        dimensions: []
      },
      permissions: {
        owner: 'current-user',
        viewers: [],
        editors: [],
        isPublic: false
      }
    };
    
    setCurrentReport(newReport);
    setIsBuilderMode(true); // Start in edit mode
    setSelectedComponentId(null); // Clear any selected component
  };

  const loadReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId) || 
                   templates.find(r => r.id === reportId);
    if (report) {
      setCurrentReport(report);
      // Don't automatically set builder mode - let the caller decide
    }
  };

  const saveReport = () => {
    if (currentReport) {
      const updatedReport = {
        ...currentReport,
        lastModified: new Date()
      };
      
      setSavedReports(prev => {
        const existing = prev.findIndex(r => r.id === currentReport.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = updatedReport;
          return updated;
        } else {
          return [...prev, updatedReport];
        }
      });
      
      setCurrentReport(updatedReport);
    }
  };

  const deleteReport = (reportId: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== reportId));
    if (currentReport?.id === reportId) {
      setCurrentReport(null);
      setIsBuilderMode(false);
    }
  };

  const addComponent = (component: Omit<ReportComponent, 'id'>) => {
    if (!currentReport) return;
    
    const newComponent: ReportComponent = {
      ...component,
      id: `component-${Date.now()}`
    };
    
    setCurrentReport(prev => prev ? {
      ...prev,
      layout: {
        ...prev.layout,
        components: [...prev.layout.components, newComponent]
      }
    } : null);
  };

  const updateComponent = (id: string, updates: Partial<ReportComponent>) => {
    if (!currentReport) return;
    
    setCurrentReport(prev => prev ? {
      ...prev,
      layout: {
        ...prev.layout,
        components: prev.layout.components.map(comp =>
          comp.id === id ? { ...comp, ...updates } : comp
        )
      }
    } : null);
  };

  const removeComponent = (id: string) => {
    if (!currentReport) return;
    
    setCurrentReport(prev => prev ? {
      ...prev,
      layout: {
        ...prev.layout,
        components: prev.layout.components.filter(comp => comp.id !== id)
      }
    } : null);
    
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const updateReportDetails = (name: string, description: string) => {
    if (!currentReport) return;
    
    setCurrentReport(prev => prev ? {
      ...prev,
      name,
      description,
      lastModified: new Date()
    } : null);
  };

  const value: ReportBuilderContextType = {
    currentReport,
    createReport,
    loadReport,
    saveReport,
    deleteReport,
    updateReportDetails,
    addComponent,
    updateComponent,
    removeComponent,
    canvasSize,
    setCanvasSize,
    selectedMetrics,
    setSelectedMetrics,
    selectedFields,
    setSelectedFields,
    savedReports,
    templates,
    isBuilderMode,
    setIsBuilderMode,
    isViewMode,
    setIsViewMode,
    selectedComponentId,
    setSelectedComponentId
  };

  return (
    <ReportBuilderContext.Provider value={value}>
      {children}
    </ReportBuilderContext.Provider>
  );
}

export function useReportBuilder() {
  const context = useContext(ReportBuilderContext);
  if (context === undefined) {
    throw new Error('useReportBuilder must be used within a ReportBuilderProvider');
  }
  return context;
}