import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { SegmentKPIGrid } from "@/components/dashboard/segments/SegmentKPIGrid";
import { SegmentCommunityList } from "@/components/dashboard/segments/SegmentCommunityList";
import { SegmentPerformanceChart } from "@/components/dashboard/segments/SegmentPerformanceChart";
import { ArrowLeft, TrendingUp, Users, Building, DollarSign, Download, Share2 } from "lucide-react";
import { SegmentData } from "@/types/segments";

// Default segment data if not passed through state
const getDefaultSegmentData = (segmentId: string): SegmentData => {
  const defaultSegments = {
    rental: {
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
      performance: 'good' as const
    },
    'life-plan': {
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
      performance: 'excellent' as const
    },
    managed: {
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
      performance: 'warning' as const
    }
  };

  return defaultSegments[segmentId as keyof typeof defaultSegments] || defaultSegments.rental;
};

export default function SegmentDetail() {
  const { segmentId } = useParams<{ segmentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [segment, setSegment] = useState<SegmentData | null>(null);
  const [filters, setFilters] = useState<any>(null);

  useEffect(() => {
    if (location.state?.segment) {
      setSegment(location.state.segment);
      setFilters(location.state.filters || {});
    } else if (segmentId) {
      // Fallback to default data if no state passed
      setSegment(getDefaultSegmentData(segmentId));
      setFilters({});
    }
  }, [location.state, segmentId]);

  if (!segment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Segment not found</h2>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4"
            variant="outline"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Portfolio Segments', href: '/dashboard' },
    { label: segment.displayName, segment: segment.name }
  ];

  const getPerformanceBadgeStyle = (performance: string) => {
    const styles = {
      excellent: "bg-green-100 text-green-800 border-green-200",
      good: "bg-blue-100 text-blue-800 border-blue-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      critical: "bg-red-100 text-red-800 border-red-200"
    };
    return styles[performance as keyof typeof styles] || styles.good;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <DrillDownBreadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  {segment.displayName}
                  <Badge 
                    variant="outline" 
                    className={getPerformanceBadgeStyle(segment.performance)}
                  >
                    {segment.performance}
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Comprehensive analysis and performance metrics for {segment.displayName.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Share</p>
                <p className="font-semibold">{segment.census}% Census</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="font-semibold">{segment.totalUnits.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="font-semibold">{segment.occupancyRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="font-semibold">{formatCurrency(segment.monthlyRevenue)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
        <SegmentKPIGrid segment={segment} />
      </div>

      {/* Performance Analytics */}
      <SegmentPerformanceChart 
        segmentId={segment.id} 
        segmentName={segment.displayName}
      />

      {/* Community Breakdown */}
      <SegmentCommunityList 
        segmentId={segment.id}
        segmentName={segment.displayName}
      />
    </div>
  );
}