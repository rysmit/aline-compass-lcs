import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, BarChart3, Grid3X3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PortfolioSegmentCard } from "./PortfolioSegmentCard";
import { SegmentMetricsGrid } from "./SegmentMetricsGrid";
import { SegmentTrendsChart } from "./SegmentTrendsChart";
import { useSegmentData } from "@/hooks/useSegmentData";
import { SegmentData } from "@/types/segments";
import { Skeleton } from "@/components/ui/skeleton";

interface EnhancedSegmentBreakdownProps {
  className?: string;
  filters?: any;
}

export function EnhancedSegmentBreakdown({ className, filters }: EnhancedSegmentBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'trends'>('cards');
  const navigate = useNavigate();
  
  const { segmentData, trendData, metrics, isLoading } = useSegmentData(filters);

  const handleSegmentClick = (segment: SegmentData) => {
    // Navigate to segment-specific dashboard or drill-down view
    navigate(`/dashboard/segment/${segment.id}`, { 
      state: { segment, filters } 
    });
  };

  const handleViewAllSegments = () => {
    navigate('/dashboard/segments', { state: { filters } });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Portfolio Segment Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of census, revenue, and occupancy across portfolio segments
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isOpen && (
                  <>
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('cards');
                      }}
                      className="h-7 px-2"
                    >
                      <Grid3X3 className="h-3 w-3 mr-1" />
                      Cards
                    </Button>
                    <Button
                      variant={viewMode === 'trends' ? 'default' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('trends');
                      }}
                      className="h-7 px-2"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trends
                    </Button>
                  </>
                )}
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Segment Details */}
            {viewMode === 'cards' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {segmentData.map((segment) => (
                    <PortfolioSegmentCard
                      key={segment.id}
                      segment={segment}
                      onClick={handleSegmentClick}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <SegmentTrendsChart data={trendData} />
                
                {/* Quick Stats Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Segment</th>
                        <th className="text-right py-2 font-medium">Census %</th>
                        <th className="text-right py-2 font-medium">Revenue %</th>
                        <th className="text-right py-2 font-medium">Occupancy</th>
                        <th className="text-right py-2 font-medium">Avg Rent</th>
                        <th className="text-right py-2 font-medium">Monthly Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentData.map((segment) => (
                        <tr 
                          key={segment.id} 
                          className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleSegmentClick(segment)}
                        >
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: segment.color }}
                              />
                              {segment.displayName}
                            </div>
                          </td>
                          <td className="text-right py-2 font-medium">{segment.census}%</td>
                          <td className="text-right py-2 font-medium">{segment.revenue}%</td>
                          <td className="text-right py-2">{segment.occupancyRate.toFixed(1)}%</td>
                          <td className="text-right py-2">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0
                            }).format(segment.averageRent)}
                          </td>
                          <td className="text-right py-2">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0
                            }).format(segment.monthlyRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}