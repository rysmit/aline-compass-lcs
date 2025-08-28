import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, DollarSign, TrendingUp } from "lucide-react";
import { SegmentMetrics } from "@/types/segments";

interface SegmentMetricsGridProps {
  metrics: SegmentMetrics;
  className?: string;
}

export function SegmentMetricsGrid({ metrics, className }: SegmentMetricsGridProps) {
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

  const totalRevenue = metrics.segments.reduce((sum, segment) => sum + segment.monthlyRevenue, 0);
  const totalOccupiedUnits = metrics.segments.reduce((sum, segment) => sum + segment.occupiedUnits, 0);

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className || ''}`}>
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Units</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {metrics.totalUnits.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {totalOccupiedUnits.toLocaleString()} occupied
              </p>
            </div>
            <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg Occupancy</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatPercentage(metrics.averageOccupancy)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Across all segments
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                All segments combined
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Segments</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {metrics.segments.length}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Portfolio types
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}