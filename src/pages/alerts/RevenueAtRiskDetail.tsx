import { useParams } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { ChartContainer as BaseChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  DollarSign, 
  TrendingDown, 
  AlertTriangle,
  User,
  Calendar,
  Target,
  Phone,
  Mail
} from "lucide-react";

const chartConfig = {
  revenue: {
    label: "Monthly Revenue",
    color: "hsl(var(--chart-1))",
  },
  risk: {
    label: "Churn Risk %",
    color: "hsl(var(--chart-3))",
  },
  ltv: {
    label: "Lifetime Value",
    color: "hsl(var(--chart-2))",
  },
};

// Mock at-risk residents data
const atRiskResidents = [
  {
    id: 1,
    name: "Helen Rodriguez",
    unit: "B-312",
    careLevel: "Assisted Living",
    monthlyRate: 4850,
    ltv: 127400,
    churnRisk: 89,
    daysToChurn: 21,
    revenueAtRisk: 89320,
    riskFactors: ["Payment delays", "Family dissatisfaction", "Health decline"],
    lastPayment: "2024-01-05",
    contact: {
      name: "Carlos Rodriguez",
      relationship: "Son",
      phone: "(555) 234-5678",
      email: "carlos.rodriguez@email.com"
    }
  },
  {
    id: 2,
    name: "William Foster",
    unit: "A-208",
    careLevel: "Memory Care",
    monthlyRate: 6200,
    ltv: 173600,
    churnRisk: 76,
    daysToChurn: 35,
    revenueAtRisk: 124000,
    riskFactors: ["Social isolation", "Care concerns", "Cost sensitivity"],
    lastPayment: "2024-01-01",
    contact: {
      name: "Susan Foster",
      relationship: "Daughter",
      phone: "(555) 345-6789",
      email: "susan.foster@email.com"
    }
  },
  {
    id: 3,
    name: "Dorothy Kim",
    unit: "C-156",
    careLevel: "Independent",
    monthlyRate: 3400,
    ltv: 95200,
    churnRisk: 71,
    daysToChurn: 42,
    revenueAtRisk: 61200,
    riskFactors: ["Financial constraints", "Location preference"],
    lastPayment: "2024-01-03",
    contact: {
      name: "Michael Kim",
      relationship: "Son",
      phone: "(555) 456-7890",
      email: "michael.kim@email.com"
    }
  },
  {
    id: 4,
    name: "Robert Chen",
    unit: "A-445",
    careLevel: "Assisted Living",
    monthlyRate: 5100,
    ltv: 142800,
    churnRisk: 68,
    daysToChurn: 48,
    revenueAtRisk: 81600,
    riskFactors: ["Service complaints", "Pricing concerns"],
    lastPayment: "2023-12-28",
    contact: {
      name: "Lisa Chen",
      relationship: "Daughter",
      phone: "(555) 567-8901",
      email: "lisa.chen@email.com"
    }
  }
];

const riskBySegment = [
  { segment: "Independent", residents: 12, avgRisk: 64, totalRevenue: 408000 },
  { segment: "Assisted Living", residents: 18, avgRisk: 72, totalRevenue: 918000 },
  { segment: "Memory Care", residents: 8, avgRisk: 81, totalRevenue: 496000 },
  { segment: "Skilled Nursing", residents: 5, avgRisk: 69, totalRevenue: 385000 },
];

export function RevenueAtRiskDetail() {
  const { alertType } = useParams<{ alertType: string }>();
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Revenue at Risk Alert" }
  ];

  const getRiskBadgeVariant = (risk: number) => {
    if (risk >= 80) return "destructive";
    if (risk >= 60) return "secondary";
    return "default";
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "text-destructive";
    if (risk >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  const totalRevenueAtRisk = atRiskResidents.reduce((sum, resident) => sum + resident.revenueAtRisk, 0);
  const avgChurnRisk = Math.round(atRiskResidents.reduce((sum, resident) => sum + resident.churnRisk, 0) / atRiskResidents.length);

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Revenue at Risk Alert
              </h1>
              <p className="text-muted-foreground">
                High-value residents with elevated churn probability requiring retention intervention
              </p>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Critical
            </Badge>
          </div>
          
          {/* Alert Summary */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <TrendingDown className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">High Revenue at Risk Detected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    43 residents with combined annual revenue of $2.2M showing elevated churn risk (avg 72%). 
                    Immediate retention efforts could prevent ${(totalRevenueAtRisk / 1000).toFixed(0)}K in lost revenue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Revenue at Risk"
            value={`$${(totalRevenueAtRisk / 1000).toFixed(0)}K`}
            subtitle="potential annual loss"
            change={{ value: "+$89K", type: "negative", period: "vs last month" }}
            calculation="Sum of annualized revenue for all residents with churn risk scores above 60%, weighted by probability of departure."
          />
          <KPICard
            title="High-Risk Residents"
            value="43"
            subtitle="churn risk >60%"
            change={{ value: "+7", type: "negative", period: "vs last month" }}
            calculation="Count of residents with churn risk scores above 60%, based on our predictive model analyzing payment history, satisfaction, and health indicators."
          />
          <KPICard
            title="Average Risk Score"
            value={`${avgChurnRisk}%`}
            subtitle="across all segments"
            change={{ value: "+5%", type: "negative", period: "vs last month" }}
            calculation="Average churn risk percentage across all high-risk residents, weighted by revenue contribution."
          />
          <KPICard
            title="Intervention Success"
            value="73%"
            subtitle="retention rate with action"
            change={{ value: "+8%", type: "positive", period: "vs last quarter" }}
            calculation="Percentage of high-risk residents successfully retained through intervention programs, measured over the past 12 months."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk by Care Level */}
          <ChartContainer
            title="Risk by Care Level"
            description="Revenue at risk breakdown by resident segment"
          >
            <BaseChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskBySegment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalRevenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </BaseChartContainer>
          </ChartContainer>

          {/* Retention Strategy Success */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Retention Strategy Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Early Intervention</span>
                    <span className="text-sm font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-3" />
                  <p className="text-xs text-muted-foreground">Success rate for risk score 60-75%</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High-Risk Intervention</span>
                    <span className="text-sm font-semibold">63%</span>
                  </div>
                  <Progress value={63} className="h-3" />
                  <p className="text-xs text-muted-foreground">Success rate for risk score 75-90%</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Critical Intervention</span>
                    <span className="text-sm font-semibold">41%</span>
                  </div>
                  <Progress value={41} className="h-3" />
                  <p className="text-xs text-muted-foreground">Success rate for risk score &gt;90%</p>
                </div>
              </div>

              <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Recommended Actions</h4>
                  <div className="space-y-2">
                    <Button variant="destructive" size="sm" className="w-full">
                      Contact Critical Risk (8)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Schedule Family Meetings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={() => window.open('#', '_blank')}
                    >
                      Manage in CRM System →
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Review Service Plans
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* At-Risk Residents Detail */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-destructive" />
                  High-Value At-Risk Residents
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Residents requiring immediate retention intervention
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export Contact List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atRiskResidents.map((resident) => (
                <Card key={resident.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{resident.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Unit {resident.unit}</span>
                            <span>•</span>
                            <span>{resident.careLevel}</span>
                            <span>•</span>
                            <span>${resident.monthlyRate.toLocaleString()}/month</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={getRiskBadgeVariant(resident.churnRisk)} className="mb-1">
                          {resident.churnRisk}% Risk
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          ~{resident.daysToChurn} days to churn
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Lifetime Value</p>
                        <p className="font-semibold">${resident.ltv.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Revenue at Risk</p>
                        <p className="font-semibold text-destructive">${resident.revenueAtRisk.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Last Payment</p>
                        <p className="font-semibold">{new Date(resident.lastPayment).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Risk Factors:</h5>
                        <div className="flex flex-wrap gap-2">
                          {resident.riskFactors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Emergency Contact:</h5>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">{resident.contact.name}</span>
                          <span>({resident.contact.relationship})</span>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{resident.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{resident.contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Full Profile
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => window.open('#', '_blank')}
                      >
                        Open in CRM →
                      </Button>
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