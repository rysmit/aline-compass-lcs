import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Download, Calendar, TrendingUp, Percent, Target } from "lucide-react";
import { useState } from "react";

// Sample data for NOI Margin analysis
const marginTrendData = [
  { month: "Jul", portfolioMargin: 67.2, industryBenchmark: 65.8, target: 68.0 },
  { month: "Aug", portfolioMargin: 68.1, industryBenchmark: 66.1, target: 68.0 },
  { month: "Sep", portfolioMargin: 68.8, industryBenchmark: 66.2, target: 68.0 },
  { month: "Oct", portfolioMargin: 69.1, industryBenchmark: 66.5, target: 68.0 },
  { month: "Nov", portfolioMargin: 69.5, industryBenchmark: 66.8, target: 68.0 },
  { month: "Dec", portfolioMargin: 68.4, industryBenchmark: 66.9, target: 68.0 },
];

const operatorMarginData = [
  { operator: "Senior Living Partners", margin: 71.2, revenue: 89.2, expenses: 25.7, efficiency: 92.3 },
  { operator: "Heritage Care Group", margin: 65.8, revenue: 67.8, expenses: 23.2, efficiency: 87.1 },
  { operator: "Sunrise Communities", margin: 69.4, revenue: 91.5, expenses: 28.0, efficiency: 90.8 },
  { operator: "Regional Senior Living", margin: 62.1, revenue: 45.3, expenses: 17.2, efficiency: 84.2 },
];

const marginDrivers = [
  { factor: "Labor Efficiency", impact: 2.8, trend: "positive", description: "Reduced overtime costs through better scheduling" },
  { factor: "Utilities Management", impact: 1.2, trend: "positive", description: "Energy-efficient upgrades and usage optimization" },
  { factor: "Food Service Costs", impact: -0.8, trend: "negative", description: "Inflation impact on food and supplies" },
  { factor: "Insurance Premiums", impact: -1.1, trend: "negative", description: "Market-wide premium increases" },
  { factor: "Technology Investments", impact: 0.9, trend: "positive", description: "Automation reducing administrative costs" },
];

export default function NOIMarginDetail() {
  const [selectedPeriod, setSelectedPeriod] = useState("12m");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "REIT Portfolio", href: "/dashboard" },
    { label: "NOI Margin" },
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
                  <Percent className="h-6 w-6 text-chart-2" />
                  NOI Margin Analysis
                  <Badge variant="secondary" className="text-sm font-normal">68.4%</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +2.1% vs last quarter
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>Above target of 68.0%</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="12m">12 Months</SelectItem>
                    <SelectItem value="24m">24 Months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Margin Improvement"
            value="+2.1%"
            change={{ value: "+0.8%", type: "positive", period: "vs prior quarter" }}
            subtitle="Quarterly growth"
            calculation="Percentage point increase in NOI margin compared to previous quarter"
          />
          <KPICard
            title="Vs Industry Benchmark"
            value="+1.5%"
            change={{ value: "+0.3%", type: "positive", period: "above benchmark" }}
            subtitle="Outperforming market"
            calculation="Portfolio NOI margin compared to industry average for similar properties"
          />
          <KPICard
            title="Best Performing Operator"
            value="71.2%"
            change={{ value: "Senior Living Partners", type: "positive", period: "margin leader" }}
            subtitle="Operational excellence"
            calculation="Highest NOI margin achieved by any operator in the portfolio"
          />
          <KPICard
            title="Margin Consistency"
            value="1.8%"
            change={{ value: "-0.4%", type: "positive", period: "volatility" }}
            subtitle="Standard deviation"
            calculation="Monthly margin volatility - lower is better for predictable cash flows"
          />
        </div>

        {/* Margin Trend and Driver Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="NOI Margin Trend vs Benchmarks"
            description="Portfolio performance compared to industry and targets"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marginTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 72]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
                <Line type="monotone" dataKey="portfolioMargin" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Portfolio" />
                <Line type="monotone" dataKey="industryBenchmark" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Industry" />
                <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="3 3" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Margin Impact Drivers"
            description="Factors contributing to margin changes"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marginDrivers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="factor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`${(value as number) > 0 ? '+' : ''}${value}%`, 'Impact']}
                />
                <Bar 
                  dataKey="impact" 
                  fill="hsl(var(--chart-1))"
                  name="Margin Impact (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Operator Margin Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Margin Performance by Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator</TableHead>
                  <TableHead className="text-right">NOI Margin</TableHead>
                  <TableHead className="text-right">Revenue ($M)</TableHead>
                  <TableHead className="text-right">Expenses ($M)</TableHead>
                  <TableHead className="text-right">Efficiency Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatorMarginData.map((operator, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{operator.operator}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        operator.margin >= 70 ? 'text-green-600' : 
                        operator.margin >= 65 ? 'text-blue-600' : 
                        'text-red-600'
                      }`}>
                        {operator.margin}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${operator.revenue}M</TableCell>
                    <TableCell className="text-right">${operator.expenses}M</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          operator.efficiency >= 90 ? "outline" : 
                          operator.efficiency >= 85 ? "secondary" : 
                          "destructive"
                        }
                      >
                        {operator.efficiency}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Margin Driver Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Margin Enhancement Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marginDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{driver.factor}</h4>
                      <Badge 
                        variant={driver.trend === "positive" ? "outline" : "destructive"}
                        className="text-xs"
                      >
                        {driver.impact > 0 ? '+' : ''}{driver.impact}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{driver.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      driver.impact > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {driver.impact > 0 ? '+' : ''}{driver.impact}%
                    </div>
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