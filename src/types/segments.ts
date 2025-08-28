export interface SegmentData {
  id: string;
  name: string;
  displayName: string;
  census: number;
  revenue: number;
  occupancyRate: number;
  averageRent: number;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  color: string;
  trend: {
    census: number;
    revenue: number;
    occupancy: number;
  };
  performance: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface SegmentMetrics {
  totalCensus: number;
  totalRevenue: number;
  averageOccupancy: number;
  totalUnits: number;
  segments: SegmentData[];
}

export interface SegmentTrendData {
  month: string;
  rental: number;
  lifePlan: number;
  managed: number;
}