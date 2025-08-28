import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer as BaseChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  occupancy: {
    label: "Occupancy %",
    color: "hsl(var(--chart-1))",
  },
  forecast: {
    label: "Forecast %",
    color: "hsl(var(--chart-2))",
  },
};

// Mock data for demonstration
const regionData = {
  "northeast": {
    name: "Northeast Region",
    communities: ["Sunrise Manor", "Oak Valley", "Maple Heights", "Pine Ridge"],
    metrics: {
      totalCensus: "2,847",
      occupancyRate: "92.3%",
      avgRPOU: "$6,247",
      churnRate: "2.1%"
    }
  },
  "southeast": {
    name: "Southeast Region", 
    communities: ["Magnolia Gardens", "Peach Tree", "Azalea Court", "Dogwood Place"],
    metrics: {
      totalCensus: "3,156",
      occupancyRate: "89.7%",
      avgRPOU: "$5,891",
      churnRate: "2.8%"
    }
  },
  "midwest": {
    name: "Midwest Region",
    communities: ["Prairie View", "Heartland Manor", "Cornfield Commons", "River Bend"],
    metrics: {
      totalCensus: "2,234",
      occupancyRate: "94.1%",
      avgRPOU: "$5,234",
      churnRate: "1.9%"
    }
  }
};

const occupancyTrendData = [
  { month: "Jan", occupancy: 91.2, forecast: 90.5 },
  { month: "Feb", occupancy: 89.8, forecast: 91.0 },
  { month: "Mar", occupancy: 92.1, forecast: 91.8 },
  { month: "Apr", occupancy: 93.4, forecast: 92.2 },
  { month: "May", occupancy: 92.8, forecast: 92.8 },
  { month: "Jun", occupancy: 92.3, forecast: 93.1 },
];

export function RegionDashboard() {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  
  const region = regionData[regionId as keyof typeof regionData];
  
  if (!region) {
    return <div>Region not found</div>;
  }

  const breadcrumbItems = [
    { label: "Portfolio Overview", href: "/dashboard" },
    { label: selectedSegment === 'all' ? "All Segments" : `${selectedSegment.replace('-', ' ')} Segment`, href: `/segment/${selectedSegment}` },
    { label: region.name }
  ];

  const handleCommunityClick = (communityName: string) => {
    const communityId = communityName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/region/${regionId}/community/${communityId}`);
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {region.name}
          </h1>
          <p className="text-muted-foreground">
            Regional performance overview and community breakdown
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
          <KPICard
            title="Total Census"
            value={region.metrics.totalCensus}
            change={{ value: "+2.3%", type: "positive", period: "vs last month" }}
            calculation="Sum of all occupied units across communities in this region as of today's date."
          />
          <KPICard
            title="Occupancy Rate"
            value={region.metrics.occupancyRate}
            change={{ value: "-0.4%", type: "negative", period: "vs last month" }}
            calculation="Total occupied units divided by total available units in this region. Excludes units out of service."
          />
          <KPICard
            title="Avg RPOU"
            value={region.metrics.avgRPOU}
            change={{ value: "+1.2%", type: "positive", period: "vs last month" }}
            calculation="Average revenue per occupied unit across all communities in this region, weighted by occupancy."
          />
          <KPICard
            title="Churn Rate"
            value={region.metrics.churnRate}
            change={{ value: "-0.3%", type: "positive", period: "vs last month" }}
            calculation="Percentage of residents who moved out in the last 30 days. Calculated as move-outs divided by average census."
          />
        </div>

        {/* Occupancy Trend Chart */}
        <ChartContainer
          title="Regional Occupancy Trend"
          description="6-month occupancy performance vs forecast"
        >
          <BaseChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stackId="1"
                  stroke="var(--color-forecast)"
                  fill="var(--color-forecast)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  stackId="2"
                  stroke="var(--color-occupancy)"
                  fill="var(--color-occupancy)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </BaseChartContainer>
        </ChartContainer>

        {/* Communities Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Communities in {region.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {region.communities.map((community, index) => (
                <Card
                  key={community}
                  className="cursor-pointer hover:scale-[1.02] transition-smooth border border-border/50 hover:border-primary/30"
                  onClick={() => handleCommunityClick(community)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{community}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occupancy:</span>
                          <Badge variant="secondary">{88 + index * 2}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Census:</span>
                          <span>{180 + index * 25}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}