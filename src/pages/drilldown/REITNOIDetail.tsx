import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, DollarSign, Building2, Target } from "lucide-react";
import { useState } from "react";

// Sample data for NOI analysis
const noiData = [
  { month: "Jul", noi: 20.1, margin: 67.2, revenue: 29.9 },
  { month: "Aug", noi: 20.8, margin: 68.1, revenue: 30.5 },
  { month: "Sep", noi: 21.2, margin: 68.8, revenue: 30.8 },
  { month: "Oct", noi: 21.6, margin: 69.1, revenue: 31.3 },
  { month: "Nov", noi: 22.1, margin: 69.5, revenue: 31.8 },
  { month: "Dec", noi: 22.4, margin: 68.9, revenue: 32.5 },
];

const operatorNOIData = [
  { operator: "Senior Living Partners", noi: 89.2, margin: 71.2, communities: 42, riskLevel: "Low" },
  { operator: "Heritage Care Group", noi: 67.8, margin: 65.8, communities: 28, riskLevel: "Medium" },
  { operator: "Sunrise Communities", noi: 91.5, margin: 69.4, communities: 35, riskLevel: "Low" },
  { operator: "Regional Senior Living", noi: 45.3, margin: 62.1, communities: 18, riskLevel: "High" },
];

const expenseBreakdown = [
  { category: "Labor", amount: 28.5, percentage: 42.8, growth: 3.2 },
  { category: "Utilities", amount: 8.9, percentage: 13.4, growth: 1.8 },
  { category: "Food Service", amount: 7.2, percentage: 10.8, growth: 2.1 },
  { category: "Maintenance", amount: 5.8, percentage: 8.7, growth: 0.9 },
  { category: "Insurance", amount: 4.1, percentage: 6.2, growth: 4.5 },
  { category: "Other", amount: 12.1, percentage: 18.1, growth: 1.5 },
];

export default function NOIDetail() {
  const [selectedPeriod, setSelectedPeriod] = useState("12m");
  const [selectedOperator, setSelectedOperator] = useState("all");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "REIT Portfolio", href: "/dashboard" },
    { label: "Net Operating Income" },
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
                  Net Operating Income Analysis
                  <Badge variant="secondary" className="text-sm font-normal">$248.5M T12M</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +8.2% year-over-year
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>NOI Margin: 68.4%</span>
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
            title="NOI Growth Rate"
            value="8.2%"
            change={{ value: "+1.8%", type: "positive", period: "vs prior year" }}
            subtitle="Year-over-year growth"
            calculation="Percentage increase in Net Operating Income compared to the same period last year"
          />
          <KPICard
            title="NOI per Unit"
            value="$22,265"
            change={{ value: "+$1,235", type: "positive", period: "per unit annually" }}
            subtitle="Per available unit"
            calculation="Total NOI divided by total available units across portfolio"
          />
          <KPICard
            title="Expense Ratio"
            value="31.6%"
            change={{ value: "-1.2%", type: "positive", period: "vs budget" }}
            subtitle="Operating efficiency"
            calculation="Total operating expenses divided by total revenue, excluding debt service"
          />
          <KPICard
            title="Margin Stability"
            value="2.3%"
            change={{ value: "+0.5%", type: "positive", period: "variance" }}
            subtitle="Monthly variance"
            calculation="Standard deviation of monthly NOI margins over the past 12 months"
          />
        </div>

        {/* NOI Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="NOI Performance Trend"
            description="Monthly NOI and margin progression"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={noiData}>
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
                <Line type="monotone" dataKey="noi" stroke="hsl(var(--chart-1))" strokeWidth={3} name="NOI ($M)" />
                <Line type="monotone" dataKey="margin" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Margin %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Operating Expense Breakdown"
            description="Current month expense composition"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  {expenseBreakdown.map((entry, index) => (
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
                  formatter={(value) => [`$${value}M`, 'Expense']}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Operator Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>NOI Performance by Operator</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Operators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Operators</SelectItem>
                    <SelectItem value="slp">Senior Living Partners</SelectItem>
                    <SelectItem value="heritage">Heritage Care Group</SelectItem>
                    <SelectItem value="sunrise">Sunrise Communities</SelectItem>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator</TableHead>
                  <TableHead className="text-right">NOI ($M)</TableHead>
                  <TableHead className="text-right">NOI Margin</TableHead>
                  <TableHead className="text-right">Communities</TableHead>
                  <TableHead className="text-right">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatorNOIData.map((operator, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{operator.operator}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ${operator.noi.toFixed(1)}M
                    </TableCell>
                    <TableCell className="text-right">{operator.margin}%</TableCell>
                    <TableCell className="text-right">{operator.communities}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          operator.riskLevel === "Low" ? "outline" : 
                          operator.riskLevel === "Medium" ? "secondary" : 
                          "destructive"
                        }
                      >
                        {operator.riskLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Strong Performance</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Portfolio NOI has grown 8.2% year-over-year, outpacing industry benchmark of 5.8%. 
                  Margin expansion driven by operational efficiencies and selective rent increases.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Areas for Improvement</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Heritage Care Group showing margin compression. Labor costs increased 3.2% faster than revenue growth. 
                  Recommend operational review and potential management changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}