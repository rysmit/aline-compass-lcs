import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, DollarSign, Building2 } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", monthlyRevenue: 1200000, collections: 97.8, growth: 3.2, budget: 1150000, threshold: "excellent" },
  { region: "North", community: "Golden Years", monthlyRevenue: 950000, collections: 96.5, growth: 2.8, budget: 920000, threshold: "good" },
  { region: "South", community: "Peaceful Gardens", monthlyRevenue: 1350000, collections: 94.2, growth: 1.5, budget: 1400000, threshold: "warning" },
  { region: "South", community: "Heritage Place", monthlyRevenue: 1100000, collections: 95.8, growth: 2.1, budget: 1080000, threshold: "good" },
  { region: "East", community: "Meadowbrook", monthlyRevenue: 875000, collections: 98.1, growth: 4.1, budget: 840000, threshold: "excellent" },
];

// Sample data for Revenue Sources
const revenueSourceData = [
  { source: "Base Rent", amount: 3200000, percentage: 56.8, growth: 2.1 },
  { source: "Care Fees", amount: 1800000, percentage: 32.0, growth: 3.8 },
  { source: "Dining", amount: 385000, percentage: 6.8, growth: 1.5 },
  { source: "Ancillary Services", amount: 245000, percentage: 4.4, growth: 5.2 },
];

// Sample data for Budget Performance
const budgetPerformanceData = [
  { month: "Jul", actual: 5420000, budget: 5300000, variance: 2.3 },
  { month: "Aug", actual: 5485000, budget: 5350000, variance: 2.5 },
  { month: "Sep", actual: 5540000, budget: 5400000, variance: 2.6 },
  { month: "Oct", actual: 5590000, budget: 5450000, variance: 2.6 },
  { month: "Nov", actual: 5610000, budget: 5500000, variance: 2.0 },
  { month: "Dec", actual: 5625000, budget: 5550000, variance: 1.4 },
];

// Sample data for Seasonal Trends
const seasonalData = [
  { month: "Jan", revenue: 5350000, seasonalIndex: 0.95, occupancy: 89.2 },
  { month: "Feb", revenue: 5400000, seasonalIndex: 0.96, occupancy: 90.1 },
  { month: "Mar", revenue: 5520000, seasonalIndex: 0.98, occupancy: 91.5 },
  { month: "Apr", revenue: 5630000, seasonalIndex: 1.00, occupancy: 92.8 },
  { month: "May", revenue: 5680000, seasonalIndex: 1.01, occupancy: 93.2 },
  { month: "Jun", revenue: 5720000, seasonalIndex: 1.02, occupancy: 93.8 },
  { month: "Jul", revenue: 5750000, seasonalIndex: 1.02, occupancy: 94.1 },
  { month: "Aug", revenue: 5725000, seasonalIndex: 1.02, occupancy: 93.9 },
  { month: "Sep", revenue: 5690000, seasonalIndex: 1.01, occupancy: 93.5 },
  { month: "Oct", revenue: 5620000, seasonalIndex: 1.00, occupancy: 92.8 },
  { month: "Nov", revenue: 5580000, seasonalIndex: 0.99, occupancy: 92.1 },
  { month: "Dec", revenue: 5625000, seasonalIndex: 1.00, occupancy: 92.5 },
];

// Sample data for Revenue Quality
const revenueQualityData = [
  { metric: "Recurring Revenue", value: 88.5, target: 85.0, status: "excellent" },
  { metric: "Revenue Predictability", value: 92.3, target: 90.0, status: "excellent" },
  { metric: "Pricing Power", value: 73.2, target: 75.0, status: "warning" },
  { metric: "Revenue Diversification", value: 67.8, target: 70.0, status: "warning" },
];

export default function MonthlyRevenueDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Financial Health", href: "/?tab=financial-health" },
    { label: "Monthly Revenue" },
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
                  <DollarSign className="h-6 w-6 text-chart-1" />
                  Monthly Revenue Analysis
                  <Badge variant="secondary" className="text-sm font-normal">$5.63M</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +2.3% vs budget
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
            Comprehensive analysis of revenue performance, growth trends, and budget compliance across all revenue streams
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Revenue Growth Rate"
            value="3.2%"
            change={{ value: "+0.4%", type: "positive", period: "vs last quarter" }}
            subtitle="Year-over-year growth"
            calculation="Percentage increase in monthly revenue compared to the same period last year, adjusted for occupancy changes."
            whyMatters="Consistent revenue growth indicates successful pricing strategies and market positioning, essential for long-term financial sustainability and investor confidence."
          />
          <KPICard
            title="Revenue per Sq Ft"
            value="$4.85"
            change={{ value: "+0.18", type: "positive", period: "per sq ft" }}
            subtitle="Space efficiency metric"
            calculation="Total monthly revenue divided by total usable square footage across all communities."
            whyMatters="Revenue per square foot measures space utilization efficiency and pricing effectiveness, critical for maximizing return on real estate investment."
          />
          <KPICard
            title="Budget Variance"
            value="+2.3%"
            change={{ value: "+0.8%", type: "positive", period: "vs forecast" }}
            subtitle="Above budget performance"
            calculation="Percentage difference between actual and budgeted revenue for the current month."
          />
          <KPICard
            title="Revenue Quality Score"
            value="84.2"
            change={{ value: "+1.5", type: "positive", period: "quality index" }}
            subtitle="Revenue sustainability"
            calculation="Composite score based on revenue predictability, diversification, pricing power, and collection efficiency."
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
                  <Building2 className="h-4 w-4 mr-2" />
                  Community Filter
                </Button>
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Monthly Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Collection Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Growth Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">vs Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {communityData.map((row, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                      <td className="py-3 px-4">{row.region}</td>
                      <td className="py-3 px-4 font-medium">{row.community}</td>
                      <td className="text-right py-3 px-4">${row.monthlyRevenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.collections}%</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium ${row.growth >= 3 ? 'text-success' : row.growth >= 2 ? 'text-primary' : 'text-warning'}`}>
                          +{row.growth}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium px-2 py-1 rounded-md text-xs ${
                          row.threshold === "excellent" ? "bg-success/20 text-success" :
                          row.threshold === "good" ? "bg-primary/20 text-primary" :
                          row.threshold === "warning" ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                        }`}>
                          {((row.monthlyRevenue - row.budget) / row.budget * 100).toFixed(1)}%
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
        <Tabs defaultValue="revenue-sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue-sources">Revenue Sources</TabsTrigger>
            <TabsTrigger value="budget-performance">Budget Performance</TabsTrigger>
            <TabsTrigger value="seasonal-trends">Seasonal Trends</TabsTrigger>
            <TabsTrigger value="revenue-quality">Revenue Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue-sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Revenue Breakdown by Source"
                description="Monthly revenue composition"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueSourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {revenueSourceData.map((entry, index) => (
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
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Source Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueSourceData.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{source.source}</div>
                          <div className="text-sm text-muted-foreground">{source.percentage}% of total</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${source.amount.toLocaleString()}</div>
                          <div className="text-sm text-success">+{source.growth}% growth</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget-performance" className="space-y-6">
            <ChartContainer
              title="Actual vs Budget Performance"
              description="Monthly revenue compared to budget targets"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={budgetPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-1))" strokeWidth={3} />
                  <Line type="monotone" dataKey="budget" stroke="hsl(var(--chart-2))" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="seasonal-trends" className="space-y-6">
            <ChartContainer
              title="12-Month Seasonal Revenue Patterns"
              description="Revenue trends and seasonal impact analysis"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="revenue-quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Quality Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Key indicators of revenue sustainability and predictability
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {revenueQualityData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.metric}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.value}%</div>
                          <div className="text-xs text-muted-foreground">Target: {item.target}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-muted/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            item.status === "excellent" ? "bg-success" :
                            item.status === "good" ? "bg-primary" :
                            item.status === "warning" ? "bg-warning" :
                            "bg-destructive"
                          }`}
                          style={{ width: `${(item.value / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}