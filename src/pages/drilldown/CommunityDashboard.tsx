import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartContainer as BaseChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Eye, AlertTriangle, TrendingUp } from "lucide-react";
import { RecordStitchingBanner } from "@/components/data-lineage/RecordStitchingBanner";

const chartConfig = {
  census: {
    label: "Census",
    color: "hsl(var(--chart-1))",
  },
  moveIns: {
    label: "Move-ins",
    color: "hsl(var(--chart-2))",
  },
  moveOuts: {
    label: "Move-outs",
    color: "hsl(var(--chart-3))",
  },
};

// Mock data
const communityData = {
  "sunrise-manor": {
    name: "Sunrise Manor",
    region: "Northeast Region",
    address: "123 Sunrise Ave, Boston, MA",
    manager: "Sarah Johnson",
    metrics: {
      currentCensus: "187",
      capacity: "210",
      occupancyRate: "89.0%",
      avgLOS: "847 days",
      monthlyRevenue: "$1.2M"
    }
  }
};

const censusData = [
  { week: "W1", census: 182 },
  { week: "W2", census: 185 },
  { week: "W3", census: 183 },
  { week: "W4", census: 187 },
  { week: "W5", census: 189 },
  { week: "W6", census: 187 },
];

const moveInOutData = [
  { month: "Jan", moveIns: 12, moveOuts: 8 },
  { month: "Feb", moveIns: 10, moveOuts: 11 },
  { month: "Mar", moveIns: 15, moveOuts: 9 },
  { month: "Apr", moveIns: 11, moveOuts: 7 },
  { month: "May", moveIns: 13, moveOuts: 10 },
  { month: "Jun", moveIns: 9, moveOuts: 12 },
];

const mockResidents = [
  { id: 1, name: "Robert Thompson", unit: "A-205", careLevel: "Independent", riskScore: 85, daysToChurn: 30 },
  { id: 2, name: "Maria Garcia", unit: "B-118", careLevel: "Assisted", riskScore: 72, daysToChurn: 45 },
  { id: 3, name: "James Wilson", unit: "C-301", careLevel: "Memory Care", riskScore: 91, daysToChurn: 15 },
  { id: 4, name: "Linda Davis", unit: "A-156", careLevel: "Independent", riskScore: 68, daysToChurn: 60 },
];

export function CommunityDashboard() {
  const { regionId, communityId } = useParams<{ regionId: string; communityId: string }>();
  const navigate = useNavigate();
  
  // Sample resident record stitching data
  const residentRecords = [
    { systemName: 'CRM', id: 'CRM-2847', label: 'CRM ID' },
    { systemName: 'ECP', id: 'ECP-9384', label: 'ECP ID' },
    { systemName: 'Vitals', id: 'VTL-1923', label: 'Vitals ID' }
  ];
  
  const community = communityData[communityId as keyof typeof communityData];
  
  if (!community) {
    return <div>Community not found</div>;
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: community.region, href: `/region/${regionId}` },
    { label: community.name }
  ];

  const handleResidentClick = (residentId: number) => {
    navigate(`/region/${regionId}/community/${communityId}/resident/${residentId}`);
  };

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 80) return "destructive";
    if (score >= 60) return "secondary";
    return "default";
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        <RecordStitchingBanner 
          records={residentRecords} 
          className="mb-6"
        />
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {community.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{community.address}</span>
            <span>•</span>
            <span>Manager: {community.manager}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard
            title="Current Census"
            value={community.metrics.currentCensus}
            subtitle={`of ${community.metrics.capacity} capacity`}
            change={{ value: "+2", type: "positive", period: "this week" }}
            calculation="Current number of occupied units in this community as of today."
          />
          <KPICard
            title="Occupancy Rate"
            value={community.metrics.occupancyRate}
            change={{ value: "-1.2%", type: "negative", period: "vs last month" }}
            calculation="Current occupied units divided by total available units in this community."
          />
          <KPICard
            title="Avg Length of Stay"
            value={community.metrics.avgLOS}
            change={{ value: "+12 days", type: "positive", period: "vs last month" }}
            calculation="Average number of days residents stay, calculated from move-in to move-out for all residents who departed in the selected period."
          />
          <KPICard
            title="Monthly Revenue"
            value={community.metrics.monthlyRevenue}
            change={{ value: "+3.4%", type: "positive", period: "vs last month" }}
            calculation="Total monthly revenue from all occupied units, including base rent, care fees, and ancillary services."
          />
          <KPICard
            title="High Risk Residents"
            value="4"
            change={{ value: "+1", type: "negative", period: "this week" }}
            clickable={true}
            onClick={() => console.log("Navigate to risk residents")}
            calculation="Number of residents with churn risk score above 80%, based on our predictive analytics model considering payment history, health status, and satisfaction indicators."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Census Trend */}
          <ChartContainer
            title="Weekly Census Trend"
            description="Last 6 weeks performance"
          >
            <BaseChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={censusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="census"
                    stroke="var(--color-census)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </BaseChartContainer>
          </ChartContainer>

          {/* Move-ins vs Move-outs */}
          <ChartContainer
            title="Move-ins vs Move-outs"
            description="Monthly activity comparison"
          >
            <BaseChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moveInOutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="moveIns" fill="var(--color-moveIns)" />
                  <Bar dataKey="moveOuts" fill="var(--color-moveOuts)" />
                </BarChart>
              </ResponsiveContainer>
            </BaseChartContainer>
          </ChartContainer>
        </div>

        {/* High Risk Residents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  High Risk Residents
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Residents with elevated churn risk scores
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => window.open('#', '_blank')}
              >
                Open Property Management →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockResidents.map((resident) => (
                <div
                  key={resident.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 cursor-pointer transition-smooth"
                  onClick={() => handleResidentClick(resident.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground">{resident.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Unit {resident.unit} • {resident.careLevel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge variant={getRiskBadgeVariant(resident.riskScore)} className="mb-1">
                        Risk: {resident.riskScore}%
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {resident.daysToChurn} days
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open('#', '_blank')}
                      className="border border-blue-200 hover:bg-blue-50"
                    >
                      Open in CRM →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}