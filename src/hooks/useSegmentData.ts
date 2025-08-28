import { useState, useEffect } from 'react';
import { SegmentData, SegmentMetrics, SegmentTrendData } from '@/types/segments';

// Mock data - In real app, this would come from API
const mockSegmentData: SegmentData[] = [
  {
    id: 'rental',
    name: 'rental',
    displayName: 'Rental Communities',
    census: 55,
    revenue: 52,
    occupancyRate: 87.5,
    averageRent: 3200,
    totalUnits: 1250,
    occupiedUnits: 1094,
    monthlyRevenue: 3500000,
    color: 'hsl(var(--chart-1))',
    trend: { census: 2.3, revenue: 1.8, occupancy: -0.5 },
    performance: 'good'
  },
  {
    id: 'life-plan',
    name: 'life-plan',
    displayName: 'Life Plan Communities',
    census: 35,
    revenue: 38,
    occupancyRate: 92.1,
    averageRent: 4500,
    totalUnits: 800,
    occupiedUnits: 737,
    monthlyRevenue: 2850000,
    color: 'hsl(var(--chart-2))',
    trend: { census: 4.2, revenue: 5.1, occupancy: 1.2 },
    performance: 'excellent'
  },
  {
    id: 'managed',
    name: 'managed',
    displayName: 'Managed Communities',
    census: 10,
    revenue: 10,
    occupancyRate: 78.3,
    averageRent: 2800,
    totalUnits: 450,
    occupiedUnits: 352,
    monthlyRevenue: 985000,
    color: 'hsl(var(--chart-3))',
    trend: { census: -1.2, revenue: -2.1, occupancy: -3.8 },
    performance: 'warning'
  }
];

const mockTrendData: SegmentTrendData[] = [
  { month: 'Jan', rental: 53, lifePlan: 33, managed: 12 },
  { month: 'Feb', rental: 54, lifePlan: 34, managed: 11 },
  { month: 'Mar', rental: 54.5, lifePlan: 34.5, managed: 10.5 },
  { month: 'Apr', rental: 55, lifePlan: 35, managed: 10 },
  { month: 'May', rental: 55.2, lifePlan: 35.2, managed: 9.8 },
  { month: 'Jun', rental: 55, lifePlan: 35, managed: 10 }
];

export function useSegmentData(filters?: any) {
  const [segmentData, setSegmentData] = useState<SegmentData[]>(mockSegmentData);
  const [trendData, setTrendData] = useState<SegmentTrendData[]>(mockTrendData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In real app, fetch data based on filters
    setIsLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      let filteredData = [...mockSegmentData];
      
      // Apply portfolio segment filter if provided
      if (filters?.portfolioSegment && filters.portfolioSegment !== 'all') {
        filteredData = filteredData.filter(segment => segment.name === filters.portfolioSegment);
      }
      
      setSegmentData(filteredData);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const metrics: SegmentMetrics = {
    totalCensus: segmentData.reduce((sum, segment) => sum + segment.census, 0),
    totalRevenue: segmentData.reduce((sum, segment) => sum + segment.revenue, 0),
    averageOccupancy: segmentData.reduce((sum, segment) => sum + segment.occupancyRate, 0) / segmentData.length,
    totalUnits: segmentData.reduce((sum, segment) => sum + segment.totalUnits, 0),
    segments: segmentData
  };

  return {
    segmentData,
    trendData,
    metrics,
    isLoading
  };
}