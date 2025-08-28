import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, ComposedChart } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, Building, Calculator } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", noiPerUnit: 1950, revenue: 468000, expenses: 234000, occupancy: 92.3, threshold: "excellent" },
  { region: "North", community: "Golden Years", noiPerUnit: 1875, revenue: 390000, expenses: 195000, occupancy: 89.8, threshold: "good" },
  { region: "South", community: "Peaceful Gardens", noiPerUnit: 1720, revenue: 516000, expenses: 275000, occupancy: 87.5, threshold: "warning" },
  { region: "South", community: "Heritage Place", noiPerUnit: 1825, revenue: 420000, expenses: 210000, occupancy: 91.2, threshold: "good" },
  { region: "East", community: "Meadowbrook", noiPerUnit: 2050, revenue: 350000, expenses: 165000, occupancy: 94.1, threshold: "excellent" },
];

// Sample data for NOI Components
const noiComponentsData = [
  { month: "Jul", totalRevenue: 5625000, operatingExpenses: 3890000, noi: 1735000 },
  { month: "Aug", totalRevenue: 5680000, operatingExpenses: 3920000, noi: 1760000 },
  { month: "Sep", totalRevenue: 5720000, operatingExpenses: 3945000, noi: 1775000 },
  { month: "Oct", totalRevenue: 5780000, operatingExpenses: 3980000, noi: 1800000 },
  { month: "Nov", totalRevenue: 5825000, operatingExpenses: 4010000, noi: 1815000 },
  { month: "Dec", totalRevenue: 5870000, operatingExpenses: 4035000, noi: 1835000 },
];

// Sample data for Expense Breakdown
const expenseBreakdownData = [
  { category: "Salaries & Benefits", amount: 2150000, percentage: 53.3, perUnit: 975 },
  { category: "Utilities", amount: 485000, percentage: 12.0, perUnit: 220 },
  { category: "Maintenance & Repairs", amount: 390000, percentage: 9.7, perUnit: 177 },
  { category: "Food & Beverage", amount: 365000, percentage: 9.0, perUnit: 166 },
  { category: "Insurance", amount: 285000, percentage: 7.1, perUnit: 129 },
  { category: "Marketing", amount: 180000, percentage: 4.5, perUnit: 82 },
  { category: "Administrative", amount: 175000, percentage: 4.3, perUnit: 79 },
];

// Sample data for Efficiency Metrics
const efficiencyData = [
  { community: "Sunrise Manor", noiMargin: 41.2, revenuePerUnit: 5200, expenseRatio: 58.8, benchmark: 38.5 },
  { community: "Golden Years", noiMargin: 39.8, revenuePerUnit: 4875, expenseRatio: 60.2, benchmark: 38.5 },
  { community: "Peaceful Gardens", noiMargin: 36.4, revenuePerUnit: 4920, expenseRatio: 63.6, benchmark: 38.5 },
  { community: "Heritage Place", noiMargin: 38.9, revenuePerUnit: 4680, expenseRatio: 61.1, benchmark: 38.5 },
  { community: "Meadowbrook", noiMargin: 43.1, revenuePerUnit: 4750, expenseRatio: 56.9, benchmark: 38.5 },
];

// Sample data for Benchmarking
const benchmarkData = [
  { metric: "NOI per Unit", ourPerformance: 1847, industryAverage: 1650, topQuartile: 2100, percentile: 75 },
  { metric: "NOI Margin", ourPerformance: 39.5, industryAverage: 35.2, topQuartile: 42.8, percentile: 68 },
  { metric: "Revenue per Unit", ourPerformance: 4980, industryAverage: 4620, topQuartile: 5350, percentile: 72 },
  { metric: "Expense Ratio", ourPerformance: 60.5, industryAverage: 64.8, topQuartile: 57.2, percentile: 78 },
];

export default function NOIPerUnitDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Financial Health", href: "/?tab=financial-health" },
    { label: "NOI per Unit" },
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
                  <Calculator className="h-6 w-6 text-chart-3" />
                  NOI per Unit Analysis
                  <Badge variant="secondary" className="text-sm font-normal">$1,847</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +3.2% vs last quarter
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
            Comprehensive analysis of net operating income efficiency, expense management, and profitability drivers
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="NOI Margin"
            value="39.5%"
            change={{ value: "+1.2%", type: "positive", period: "efficiency" }}
            subtitle="Operating profit margin"
            calculation="Net Operating Income divided by Total Revenue. Measures operational efficiency and profitability."
          />
          <KPICard
            title="Expense Ratio"
            value="60.5%"
            change={{ value: "-1.2%", type: "positive", period: "cost control" }}
            subtitle="Operating expenses / revenue"
            calculation="Total operating expenses divided by total revenue. Lower ratios indicate better cost management."
          />
          <KPICard
            title="Revenue per Unit"
            value="$4,980"
            change={{ value: "+125", type: "positive", period: "per unit/month" }}
            subtitle="Monthly revenue efficiency"
            calculation="Total monthly revenue divided by total available units across the portfolio."
          />
          <KPICard
            title="EBITDA per Unit"
            value="$2,150"
            change={{ value: "+87", type: "positive", period: "cash flow" }}
            subtitle="Cash generation per unit"
            calculation="Earnings before interest, taxes, depreciation, and amortization divided by total units."
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
                  <Building className="h-4 w-4 mr-2" />
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">NOI per Unit</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Expenses</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Occupancy</th>
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
                          ${row.noiPerUnit.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">${row.revenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">${row.expenses.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.occupancy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="noi-components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="noi-components">NOI Components</TabsTrigger>
            <TabsTrigger value="expense-breakdown">Expense Breakdown</TabsTrigger>
            <TabsTrigger value="efficiency-metrics">Efficiency Metrics</TabsTrigger>
            <TabsTrigger value="benchmarking">Industry Benchmarking</TabsTrigger>
          </TabsList>

          <TabsContent value="noi-components" className="space-y-6">
            <ChartContainer
              title="NOI Components Trend"
              description="Revenue, expenses, and net operating income over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={noiComponentsData}>
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
                  <Bar dataKey="totalRevenue" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="operatingExpenses" fill="hsl(var(--chart-2))" />
                  <Line type="monotone" dataKey="noi" stroke="hsl(var(--chart-3))" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="expense-breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Operating Expense Categories"
                description="Monthly expense breakdown by category"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Per Unit Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenseBreakdownData.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{expense.category}</div>
                          <div className="text-sm text-muted-foreground">{expense.percentage}% of total</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${expense.perUnit}/unit</div>
                          <div className="text-sm text-muted-foreground">${expense.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="efficiency-metrics" className="space-y-6">
            <ChartContainer
              title="Community Efficiency Comparison"
              description="NOI margin vs revenue per unit performance"
            >
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="revenuePerUnit" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="noiMargin" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value, name) => [
                      name === 'noiMargin' ? `${value}%` : `$${value}`,
                      name === 'noiMargin' ? 'NOI Margin' : 'Revenue per Unit'
                    ]}
                  />
                  <Scatter dataKey="noiMargin" fill="hsl(var(--chart-1))" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="benchmarking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmark Comparison</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Performance compared to industry averages and top quartile
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {benchmarkData.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.metric}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {item.metric.includes('per Unit') || item.metric.includes('Revenue') ? 
                              `$${item.ourPerformance.toLocaleString()}` : 
                              `${item.ourPerformance}%`}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.percentile}th percentile</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Industry Avg: {item.metric.includes('per Unit') || item.metric.includes('Revenue') ? 
                            `$${item.industryAverage.toLocaleString()}` : 
                            `${item.industryAverage}%`}</span>
                          <span>Top 25%: {item.metric.includes('per Unit') || item.metric.includes('Revenue') ? 
                            `$${item.topQuartile.toLocaleString()}` : 
                            `${item.topQuartile}%`}</span>
                        </div>
                        <div className="w-full bg-muted/20 rounded-full h-2 relative">
                          <div 
                            className="h-2 bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${(item.percentile / 100) * 100}%` }}
                          />
                          <div 
                            className="absolute top-0 w-1 h-2 bg-muted-foreground rounded-full"
                            style={{ left: `${((item.industryAverage / item.topQuartile) * 100)}%` }}
                          />
                        </div>
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