import { useParams } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartContainer as BaseChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  Target,
  ArrowDown,
  ArrowUp
} from "lucide-react";

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  forecast: {
    label: "Forecast",
    color: "hsl(var(--chart-2))",
  },
  variance: {
    label: "Variance %",
    color: "hsl(var(--chart-3))",
  },
};

// Mock variance data
const varianceData = [
  { month: "Oct", actual: 89.2, forecast: 92.1, variance: -3.2 },
  { month: "Nov", actual: 87.8, forecast: 91.8, variance: -4.4 },
  { month: "Dec", actual: 86.3, forecast: 91.2, variance: -5.4 },
  { month: "Jan", actual: 85.1, forecast: 90.8, variance: -6.3 },
  { month: "Feb", actual: 84.7, forecast: 90.5, variance: -6.4 },
  { month: "Mar", actual: 83.9, forecast: 90.2, variance: -7.0 },
];

const communityImpact = [
  { 
    name: "Magnolia Gardens", 
    actualOccupancy: 78.2, 
    forecastOccupancy: 89.5, 
    variance: -11.3,
    revenueImpact: 245000,
    region: "Southeast"
  },
  { 
    name: "Peach Tree Manor", 
    actualOccupancy: 81.7, 
    forecastOccupancy: 88.2, 
    variance: -6.5,
    revenueImpact: 178000,
    region: "Southeast"
  },
  { 
    name: "Azalea Court", 
    actualOccupancy: 85.3, 
    forecastOccupancy: 90.1, 
    variance: -4.8,
    revenueImpact: 134000,
    region: "Southeast"
  },
  { 
    name: "Dogwood Place", 
    actualOccupancy: 88.1, 
    forecastOccupancy: 91.3, 
    variance: -3.2,
    revenueImpact: 89000,
    region: "Southeast"
  }
];

export function ForecastVarianceDetail() {
  const { alertType } = useParams<{ alertType: string }>();
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Forecast Variance Alert" }
  ];

  const getVarianceColor = (variance: number) => {
    if (variance <= -5) return "text-destructive";
    if (variance <= -3) return "text-warning";
    return "text-muted-foreground";
  };

  const getVarianceBadge = (variance: number) => {
    if (variance <= -5) return "destructive";
    if (variance <= -3) return "secondary";
    return "default";
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Forecast Variance Alert
              </h1>
              <p className="text-muted-foreground">
                Southeast Division showing significant occupancy variance vs forecast
              </p>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Critical
            </Badge>
          </div>
          
          {/* Alert Summary */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">Significant Forecast Variance Detected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Southeast Division actual occupancy is 7.0% below forecast for March, 
                    representing $646K in lost revenue across 23 communities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Current Variance"
            value="-7.0%"
            subtitle="vs forecast occupancy"
            change={{ value: "-0.6%", type: "negative", period: "vs last month" }}
            calculation="Difference between actual occupancy and forecasted occupancy for the current period, expressed as a percentage."
          />
          <KPICard
            title="Revenue Impact"
            value="$646K"
            subtitle="lost monthly revenue"
            change={{ value: "+$89K", type: "negative", period: "vs last month" }}
            calculation="Estimated monthly revenue loss due to occupancy variance, calculated as variance percentage × average monthly revenue per unit × total capacity."
          />
          <KPICard
            title="Communities Affected"
            value="23"
            subtitle="of 34 total communities"
            change={{ value: "+4", type: "negative", period: "vs last month" }}
            calculation="Number of communities with occupancy variance greater than -3% compared to forecast."
          />
          <KPICard
            title="Forecast Accuracy"
            value="73.2%"
            subtitle="rolling 6-month average"
            change={{ value: "-12.8%", type: "negative", period: "vs last quarter" }}
            calculation="Percentage of forecasts within 5% of actual performance, calculated over a rolling 6-month period."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variance Trend */}
          <ChartContainer
            title="6-Month Variance Trend"
            description="Actual vs forecast occupancy performance"
          >
            <BaseChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={varianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="var(--color-forecast)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </BaseChartContainer>
          </ChartContainer>

          {/* Variance by Month */}
          <ChartContainer
            title="Monthly Variance (%)"
            description="Percentage difference actual vs forecast"
          >
            <BaseChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={varianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="variance" fill="var(--color-variance)" />
                </BarChart>
              </ResponsiveContainer>
            </BaseChartContainer>
          </ChartContainer>
        </div>

        {/* Community Impact Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Community Impact Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Communities with largest variance vs forecast
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => window.open('#', '_blank')}
              >
                Open Finance System →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communityImpact.map((community, index) => (
                <div
                  key={community.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 cursor-pointer transition-smooth"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[40px]">
                      <div className="text-xl font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{community.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {community.region} Region
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Actual</p>
                      <p className="font-semibold">{community.actualOccupancy}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Forecast</p>
                      <p className="font-semibold">{community.forecastOccupancy}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Variance</p>
                      <Badge variant={getVarianceBadge(community.variance)}>
                        {community.variance}%
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Revenue Impact</p>
                      <p className="font-semibold text-destructive">
                        -${(community.revenueImpact / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Recommended Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-warning/20 bg-warning/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-warning mb-2">Immediate Actions (1-2 weeks)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Review pricing strategy for underperforming communities</li>
                      <li>• Increase marketing spend in Southeast region</li>
                      <li>• Analyze competitor activity in affected markets</li>
                      <li>• Schedule community manager meetings</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-primary mb-2">Medium-term Actions (1-3 months)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Improve forecast accuracy models</li>
                      <li>• Implement dynamic pricing strategies</li>
                      <li>• Enhance lead generation processes</li>
                      <li>• Review and adjust capacity planning</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}