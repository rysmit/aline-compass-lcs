import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from "recharts";
import { Download, Filter, Calendar, Info, AlertTriangle, TrendingDown, Activity } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", arRisk: 8.5, totalAR: 45000, highRisk: 3800, avgDays: 18.2, threshold: "excellent" },
  { region: "North", community: "Golden Years", arRisk: 11.2, totalAR: 38000, highRisk: 4300, avgDays: 22.5, threshold: "good" },
  { region: "South", community: "Peaceful Gardens", arRisk: 18.7, totalAR: 62000, highRisk: 11600, avgDays: 35.8, threshold: "warning" },
  { region: "South", community: "Heritage Place", arRisk: 14.3, totalAR: 51000, highRisk: 7300, avgDays: 28.1, threshold: "warning" },
  { region: "East", community: "Meadowbrook", arRisk: 7.2, totalAR: 32000, highRisk: 2300, avgDays: 16.4, threshold: "excellent" },
];

// Sample data for Risk Categories
const riskCategoryData = [
  { category: "60-90 Days Past Due", amount: 245000, count: 67, riskScore: 65, recovery: 78.5 },
  { category: "90+ Days Past Due", amount: 187000, count: 45, riskScore: 85, recovery: 45.2 },
  { category: "Disputed Charges", amount: 89000, count: 23, riskScore: 55, recovery: 92.1 },
  { category: "Insurance Delays", amount: 156000, count: 38, riskScore: 40, recovery: 88.7 },
  { category: "Family Financial Issues", amount: 112000, count: 28, riskScore: 75, recovery: 62.3 },
];

// Sample data for Recovery Trends
const recoveryTrendsData = [
  { month: "Jul", recovered: 187000, written: 23000, rate: 89.1, newRisk: 145000 },
  { month: "Aug", recovered: 198000, written: 28000, rate: 87.6, newRisk: 162000 },
  { month: "Sep", recovered: 205000, written: 31000, rate: 86.9, newRisk: 178000 },
  { month: "Oct", recovered: 212000, written: 25000, rate: 89.5, newRisk: 156000 },
  { month: "Nov", recovered: 178000, written: 35000, rate: 83.6, newRisk: 189000 },
  { month: "Dec", recovered: 195000, written: 29000, rate: 87.1, newRisk: 172000 },
];

// Sample data for Predictive Model
const predictiveModelData = [
  { riskFactor: "Payment History", weight: 35, accuracy: 87.2, impact: "High" },
  { riskFactor: "Care Level Transitions", weight: 25, accuracy: 82.5, impact: "Medium" },
  { riskFactor: "Family Contact Frequency", weight: 20, accuracy: 78.9, impact: "Medium" },
  { riskFactor: "Account Age", weight: 15, accuracy: 91.3, impact: "Low" },
  { riskFactor: "Seasonal Patterns", weight: 5, accuracy: 73.8, impact: "Low" },
];

// Sample data for Early Warning System
const earlyWarningData = [
  { alert: "High-Risk Account", community: "Peaceful Gardens", resident: "Johnson, M.", amount: 12500, probability: 78, action: "Contact family" },
  { alert: "Payment Pattern Change", community: "Heritage Place", resident: "Smith, R.", amount: 8900, probability: 65, action: "Payment plan" },
  { alert: "Insurance Verification", community: "Sunrise Manor", resident: "Davis, L.", amount: 15200, probability: 45, action: "Insurance follow-up" },
  { alert: "Disputed Service", community: "Golden Years", resident: "Wilson, K.", amount: 6800, probability: 55, action: "Service review" },
  { alert: "Family Financial Stress", community: "Meadowbrook", resident: "Brown, J.", amount: 9300, probability: 72, action: "Financial counseling" },
];

export default function ARRiskDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Financial Health", href: "/?tab=financial-health" },
    { label: "AR Risk Index" },
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
                  <Activity className="h-6 w-6 text-chart-4" />
                  AR Risk Index Analysis
                  <Badge variant="secondary" className="text-sm font-normal">12.4%</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    +1.8% vs last month
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
            Comprehensive analysis of accounts receivable risk factors, recovery rates, and predictive indicators
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Recovery Rate"
            value="87.1%"
            change={{ value: "+2.4%", type: "positive", period: "30-day recovery" }}
            subtitle="Collection success rate"
            calculation="Percentage of high-risk accounts successfully collected within 30 days of identification."
          />
          <KPICard
            title="Write-off Rate"
            value="1.2%"
            change={{ value: "+0.3%", type: "negative", period: "bad debt ratio" }}
            subtitle="Uncollectible accounts"
            calculation="Percentage of total receivables written off as uncollectible in the last 12 months."
          />
          <KPICard
            title="Prediction Accuracy"
            value="84.7%"
            change={{ value: "+1.5%", type: "positive", period: "model accuracy" }}
            subtitle="Risk model performance"
            calculation="Accuracy of the predictive model in identifying accounts that will become 60+ days past due."
          />
          <KPICard
            title="Early Warning Alerts"
            value="23"
            change={{ value: "+5", type: "negative", period: "active alerts" }}
            subtitle="Proactive interventions"
            calculation="Number of accounts flagged by the early warning system requiring immediate attention."
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">AR Risk %</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total AR</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">High Risk</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Days</th>
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
                          {row.arRisk}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">${row.totalAR.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">${row.highRisk.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.avgDays} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="risk-categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="risk-categories">Risk Categories</TabsTrigger>
            <TabsTrigger value="recovery-trends">Recovery Trends</TabsTrigger>
            <TabsTrigger value="predictive-model">Predictive Model</TabsTrigger>
            <TabsTrigger value="early-warning">Early Warning System</TabsTrigger>
          </TabsList>

          <TabsContent value="risk-categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Risk Categories Breakdown"
                description="High-risk accounts by category and amount"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskCategoryData}>
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
                  <CardTitle>Category Risk Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskCategoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground">{category.count} accounts</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{category.recovery}%</div>
                          <div className="text-sm text-muted-foreground">recovery rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recovery-trends" className="space-y-6">
            <ChartContainer
              title="Recovery Performance Trends"
              description="Monthly recovery rates and amounts"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={recoveryTrendsData}>
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
                  <Area type="monotone" dataKey="recovered" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" />
                  <Area type="monotone" dataKey="newRisk" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-3))" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="predictive-model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Prediction Model Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Machine learning model factors and accuracy metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveModelData.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{factor.riskFactor}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {factor.weight}% weight in model
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{factor.accuracy}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
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

          <TabsContent value="early-warning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Early Warning Alerts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Accounts requiring immediate attention to prevent collection issues
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Alert Type</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Community</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resident</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Risk %</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earlyWarningData.map((alert, index) => (
                        <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              alert.probability >= 70 ? "bg-destructive/20 text-destructive" :
                              alert.probability >= 50 ? "bg-warning/20 text-warning" :
                              "bg-success/20 text-success"
                            }`}>
                              {alert.alert}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">{alert.community}</td>
                          <td className="py-3 px-4">{alert.resident}</td>
                          <td className="text-right py-3 px-4">${alert.amount.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{alert.probability}%</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{alert.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}