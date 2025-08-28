import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, CreditCard, AlertTriangle } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", collectionRate: 97.8, arBalance: 25000, agingDays: 18.5, riskScore: 12, threshold: "excellent" },
  { region: "North", community: "Golden Years", collectionRate: 96.5, arBalance: 32000, agingDays: 22.3, riskScore: 18, threshold: "good" },
  { region: "South", community: "Peaceful Gardens", collectionRate: 94.2, arBalance: 48000, agingDays: 31.8, riskScore: 28, threshold: "warning" },
  { region: "South", community: "Heritage Place", collectionRate: 95.8, arBalance: 29000, agingDays: 24.7, riskScore: 16, threshold: "good" },
  { region: "East", community: "Meadowbrook", collectionRate: 98.1, arBalance: 18000, agingDays: 15.2, riskScore: 8, threshold: "excellent" },
];

// Sample data for Payment Method Analysis
const paymentMethodData = [
  { method: "Auto-Pay", percentage: 42.5, volume: 2387500, avgDays: 0 },
  { method: "Online Portal", percentage: 28.3, volume: 1589250, avgDays: 2.1 },
  { method: "Check", percentage: 18.2, volume: 1021750, avgDays: 5.8 },
  { method: "Phone Payment", percentage: 7.8, volume: 438750, avgDays: 3.2 },
  { method: "In-Person", percentage: 3.2, volume: 179750, avgDays: 1.5 },
];

// Sample data for Aging Trends
const agingTrendsData = [
  { month: "Jul", current: 68.5, days30: 19.2, days60: 8.1, days90plus: 4.2 },
  { month: "Aug", current: 69.8, days30: 18.7, days60: 7.8, days90plus: 3.7 },
  { month: "Sep", current: 70.2, days30: 18.9, days60: 7.2, days90plus: 3.7 },
  { month: "Oct", current: 71.5, days30: 17.8, days60: 7.1, days90plus: 3.6 },
  { month: "Nov", current: 68.2, days30: 19.1, days60: 8.5, days90plus: 4.2 },
  { month: "Dec", current: 67.8, days30: 19.3, days60: 8.7, days90plus: 4.2 },
];

// Sample data for Risk Factors
const riskFactorData = [
  { factor: "Late Payment History", weight: 35, impact: "High", communities: 8 },
  { factor: "Care Level Changes", weight: 25, impact: "Medium", communities: 12 },
  { factor: "Family Financial Stress", weight: 20, impact: "Medium", communities: 15 },
  { factor: "Insurance Delays", weight: 15, impact: "Low", communities: 22 },
  { factor: "Disputed Charges", weight: 5, impact: "Low", communities: 6 },
];

// Sample data for Collection Efficiency
const collectionEfficiencyData = [
  { week: "Week 1", target: 85, actual: 87.2, volume: 1250000 },
  { week: "Week 2", target: 92, actual: 89.8, volume: 980000 },
  { week: "Week 3", target: 95, actual: 96.1, volume: 750000 },
  { week: "Week 4", target: 97, actual: 96.8, volume: 420000 },
  { week: "Week 5", target: 98, actual: 97.5, volume: 280000 },
  { week: "Week 6", target: 98.5, actual: 98.1, volume: 180000 },
];

export default function CollectionRateDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Financial Health", href: "/?tab=financial-health" },
    { label: "Collection Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Primary Metric Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-chart-2" />
                  Collection Rate Analysis
                  <Badge variant="secondary" className="text-sm font-normal">96.2%</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    -0.3% vs last month
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="12m">12 Months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Comprehensive analysis of collection performance, accounts receivable aging, and payment method efficiency
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Days Sales Outstanding"
            value="28.4"
            change={{ value: "+1.2", type: "negative", period: "days" }}
            subtitle="Average collection period"
            calculation="Average number of days to collect accounts receivable. Calculated as (AR Balance / Daily Sales)."
          />
          <KPICard
            title="Bad Debt Rate"
            value="0.8%"
            change={{ value: "-0.1%", type: "positive", period: "of revenue" }}
            subtitle="Uncollectible accounts"
            calculation="Percentage of revenue written off as uncollectible. Lower values indicate better collection processes."
          />
          <KPICard
            title="First Contact Resolution"
            value="78.5%"
            change={{ value: "+2.3%", type: "positive", period: "resolved immediately" }}
            subtitle="Payment issue resolution"
            calculation="Percentage of payment inquiries resolved on first contact, indicating collection team efficiency."
          />
          <KPICard
            title="Auto-Pay Adoption"
            value="42.5%"
            change={{ value: "+1.8%", type: "positive", period: "of residents" }}
            subtitle="Automated payment usage"
            calculation="Percentage of residents using automatic payment methods, which improves collection reliability."
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Report</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Region</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Community</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Collection Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">AR Balance</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Days</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {communityData.map((row, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                      <td className="py-3 px-4">{row.region}</td>
                      <td className="py-3 px-4 font-medium">{row.community}</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium px-2 py-1 rounded-md text-xs ${
                          row.threshold === "excellent" ? "bg-success/20 text-success" :
                          row.threshold === "good" ? "bg-primary/20 text-primary" :
                          row.threshold === "warning" ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                        }`}>
                          {row.collectionRate}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">${row.arBalance.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.agingDays} days</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium ${
                          row.riskScore <= 15 ? 'text-success' : 
                          row.riskScore <= 25 ? 'text-warning' : 
                          'text-destructive'
                        }`}>
                          {row.riskScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="payment-methods" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payment-methods">Payment Method Analysis</TabsTrigger>
            <TabsTrigger value="aging-trends">Aging Trends</TabsTrigger>
            <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="collection-efficiency">Collection Efficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Payment Method Distribution"
                description="Volume and efficiency by payment type"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="volume"
                      label={({ method, percentage }) => `${method}: ${percentage}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Volume']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethodData.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{method.method}</div>
                          <div className="text-sm text-muted-foreground">{method.percentage}% of payments</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${method.volume.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{method.avgDays} avg days</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="aging-trends" className="space-y-6">
            <ChartContainer
              title="AR Aging Distribution Trends"
              description="Accounts receivable aging categories over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={agingTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area type="monotone" dataKey="current" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" />
                  <Area type="monotone" dataKey="days30" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" />
                  <Area type="monotone" dataKey="days60" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" />
                  <Area type="monotone" dataKey="days90plus" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="risk-factors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Risk Factor Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Key factors contributing to collection challenges
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskFactorData.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{factor.factor}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Affects {factor.communities} communities
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{factor.weight}%</div>
                          <div className="text-xs text-muted-foreground">Weight</div>
                        </div>
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            factor.impact === "High" ? "bg-destructive/20 text-destructive" :
                            factor.impact === "Medium" ? "bg-warning/20 text-warning" :
                            "bg-success/20 text-success"
                          }`}>
                            {factor.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collection-efficiency" className="space-y-6">
            <ChartContainer
              title="Collection Performance by Week"
              description="Target vs actual collection rates over collection cycle"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={collectionEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-1))" strokeWidth={3} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-2))" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}