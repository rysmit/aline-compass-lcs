import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Building, Users, DollarSign } from "lucide-react";
import { SegmentData } from "@/types/segments";
import { cn } from "@/lib/utils";

interface PortfolioSegmentCardProps {
  segment: SegmentData;
  onClick?: (segment: SegmentData) => void;
  className?: string;
}

export function PortfolioSegmentCard({ segment, onClick, className }: PortfolioSegmentCardProps) {
  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: "bg-green-100 text-green-800 border-green-200",
      good: "bg-blue-100 text-blue-800 border-blue-200", 
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      critical: "bg-red-100 text-red-800 border-red-200"
    };
    
    return variants[performance as keyof typeof variants] || variants.good;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer group",
        className
      )}
      onClick={() => onClick?.(segment)}
    >
      <div 
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: segment.color }}
      />
      
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm">{segment.displayName}</h4>
            <p className="text-xs text-muted-foreground">
              {segment.occupiedUnits.toLocaleString()} / {segment.totalUnits.toLocaleString()} units
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs", getPerformanceBadge(segment.performance))}
          >
            {segment.performance}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Census</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatPercentage(segment.census)}</span>
              <div className="flex items-center gap-1">
                {segment.trend.census > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  segment.trend.census > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(segment.trend.census)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatPercentage(segment.revenue)}</span>
              <div className="flex items-center gap-1">
                {segment.trend.revenue > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  segment.trend.revenue > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(segment.trend.revenue)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Occupancy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatPercentage(segment.occupancyRate)}</span>
              <div className="flex items-center gap-1">
                {segment.trend.occupancy > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  segment.trend.occupancy > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(segment.trend.occupancy)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Avg Rent</span>
            <span className="font-semibold text-sm">{formatCurrency(segment.averageRent)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Monthly Revenue</span>
            <span className="font-medium">{formatCurrency(segment.monthlyRevenue)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${segment.occupancyRate}%`,
                backgroundColor: segment.color
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}