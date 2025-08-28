import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Building, Users, DollarSign, Percent, Home, Calendar } from "lucide-react";
import { SegmentData } from "@/types/segments";
import { cn } from "@/lib/utils";

interface SegmentKPIGridProps {
  segment: SegmentData;
  className?: string;
}

// Mock detailed KPI data for segments
const getSegmentKPIs = (segmentId: string) => {
  const kpiData = {
    rental: {
      avgLengthOfStay: { value: 18, trend: 2.1, unit: 'months' },
      moveInVelocity: { value: 45, trend: -3.2, unit: 'days' },
      churnRate: { value: 12.3, trend: -1.8, unit: '%' },
      revenuePerUnit: { value: 3200, trend: 4.5, unit: '$' },
      inquiryConversionRate: { value: 28.5, trend: 3.1, unit: '%' },
      netOperatingIncome: { value: 1850000, trend: 6.2, unit: '$' }
    },
    'life-plan': {
      avgLengthOfStay: { value: 8.2, trend: 1.4, unit: 'years' },
      moveInVelocity: { value: 62, trend: -1.8, unit: 'days' },
      churnRate: { value: 8.7, trend: -2.3, unit: '%' },
      revenuePerUnit: { value: 4500, trend: 5.8, unit: '$' },
      inquiryConversionRate: { value: 35.2, trend: 4.2, unit: '%' },
      netOperatingIncome: { value: 2100000, trend: 7.1, unit: '$' }
    },
    managed: {
      avgLengthOfStay: { value: 14, trend: -2.1, unit: 'months' },
      moveInVelocity: { value: 52, trend: -4.1, unit: 'days' },
      churnRate: { value: 16.8, trend: 2.3, unit: '%' },
      revenuePerUnit: { value: 2800, trend: 1.2, unit: '$' },
      inquiryConversionRate: { value: 22.1, trend: -1.5, unit: '%' },
      netOperatingIncome: { value: 750000, trend: 2.8, unit: '$' }
    }
  };

  return kpiData[segmentId as keyof typeof kpiData] || kpiData.rental;
};

export function SegmentKPIGrid({ segment, className }: SegmentKPIGridProps) {
  const kpis = getSegmentKPIs(segment.id);

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(value);
    }
    if (unit === '%') {
      return `${value}%`;
    }
    if (unit === 'years' || unit === 'months' || unit === 'days') {
      return `${value} ${unit}`;
    }
    return `${value}`;
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: number, isGoodWhenUp: boolean = true) => {
    const isPositive = trend > 0;
    const isGood = isGoodWhenUp ? isPositive : !isPositive;
    return isGood ? "text-green-600" : "text-red-600";
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {/* Average Length of Stay */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Avg Length of Stay
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {segment.displayName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatValue(kpis.avgLengthOfStay.value, kpis.avgLengthOfStay.unit)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(kpis.avgLengthOfStay.trend);
                return (
                  <>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(kpis.avgLengthOfStay.trend))} />
                    <span className={getTrendColor(kpis.avgLengthOfStay.trend)}>
                      {Math.abs(kpis.avgLengthOfStay.trend)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Move-In Velocity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              Move-In Velocity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatValue(kpis.moveInVelocity.value, kpis.moveInVelocity.unit)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(kpis.moveInVelocity.trend);
                return (
                  <>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(kpis.moveInVelocity.trend, false))} />
                    <span className={getTrendColor(kpis.moveInVelocity.trend, false)}>
                      {Math.abs(kpis.moveInVelocity.trend)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Churn Rate */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Churn Rate
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatValue(kpis.churnRate.value, kpis.churnRate.unit)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(kpis.churnRate.trend);
                return (
                  <>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(kpis.churnRate.trend, false))} />
                    <span className={getTrendColor(kpis.churnRate.trend, false)}>
                      {Math.abs(kpis.churnRate.trend)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Per Unit */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Revenue Per Unit
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatValue(kpis.revenuePerUnit.value, kpis.revenuePerUnit.unit)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(kpis.revenuePerUnit.trend);
                return (
                  <>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(kpis.revenuePerUnit.trend))} />
                    <span className={getTrendColor(kpis.revenuePerUnit.trend)}>
                      {Math.abs(kpis.revenuePerUnit.trend)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Conversion Rate */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              Conversion Rate
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatValue(kpis.inquiryConversionRate.value, kpis.inquiryConversionRate.unit)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(kpis.inquiryConversionRate.trend);
                return (
                  <>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(kpis.inquiryConversionRate.trend))} />
                    <span className={getTrendColor(kpis.inquiryConversionRate.trend)}>
                      {Math.abs(kpis.inquiryConversionRate.trend)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Operating Income */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              Net Operating Income
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatValue(kpis.netOperatingIncome.value, kpis.netOperatingIncome.unit)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(kpis.netOperatingIncome.trend);
                return (
                  <>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(kpis.netOperatingIncome.trend))} />
                    <span className={getTrendColor(kpis.netOperatingIncome.trend)}>
                      {Math.abs(kpis.netOperatingIncome.trend)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}