import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", stageVolume: 42, dropOffRate: 18.5, revenuePotential: 285000, forecastedMoveIns: 12, threshold: "good" },
  { region: "North", community: "Golden Years", stageVolume: 38, dropOffRate: 14.2, revenuePotential: 320000, forecastedMoveIns: 15, threshold: "excellent" },
  { region: "South", community: "Peaceful Gardens", stageVolume: 56, dropOffRate: 28.9, revenuePotential: 245000, forecastedMoveIns: 8, threshold: "warning" },
  { region: "South", community: "Heritage Place", stageVolume: 45, dropOffRate: 22.1, revenuePotential: 278000, forecastedMoveIns: 11, threshold: "good" },
  { region: "East", community: "Meadowbrook", stageVolume: 33, dropOffRate: 16.7, revenuePotential: 295000, forecastedMoveIns: 13, threshold: "excellent" },
];

// Sample data for Stage Forecast Accuracy
const forecastAccuracyData = [
  { stage: "Inquiry", forecasted: 485, actual: 467, accuracy: 96.3 },
  { stage: "Tour Scheduled", forecasted: 285, actual: 298, accuracy: 95.4 },
  { stage: "Tour Completed", forecasted: 215, actual: 203, accuracy: 94.4 },
  { stage: "Application", forecasted: 145, actual: 156, accuracy: 92.4 },
  { stage: "Move-in", forecasted: 89, actual: 93, accuracy: 95.5 },
];

// Sample data for Cohort Analysis
const cohortData = [
  { month: "Jan", week1: 100, week2: 85, week3: 72, week4: 65, week5: 58, week6: 52 },
  { month: "Feb", week1: 100, week2: 88, week3: 76, week4: 68, week5: 61, week6: 55 },
  { month: "Mar", week1: 100, week2: 91, week3: 79, week4: 71, week5: 64, week6: 58 },
  { month: "Apr", week1: 100, week2: 87, week3: 74, week4: 66, week5: 59, week6: 53 },
];

// Sample data for Pipeline by Source
const pipelineSourceData = [
  { name: "Google Ads", value: 285000, percentage: 32.5, color: "hsl(var(--chart-1))" },
  { name: "Referrals", value: 225000, percentage: 25.7, color: "hsl(var(--chart-2))" },
  { name: "Caring.com", value: 185000, percentage: 21.1, color: "hsl(var(--chart-3))" },
  { name: "Facebook", value: 125000, percentage: 14.3, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 55000, percentage: 6.3, color: "hsl(var(--chart-5))" },
];

// Sample data for Deal Risk
const dealRiskData = [
  { deal: "Sunrise Manor - Unit 204", value: 4500, probability: 85, daysInStage: 8, riskScore: 12 },
  { deal: "Golden Years - Unit 107", value: 5200, probability: 92, daysInStage: 4, riskScore: 8 },
  { deal: "Peaceful Gardens - Unit 301", value: 3800, probability: 45, daysInStage: 23, riskScore: 38 },
  { deal: "Heritage Place - Unit 155", value: 4200, probability: 78, daysInStage: 12, riskScore: 18 },
  { deal: "Meadowbrook - Unit 88", value: 4800, probability: 88, daysInStage: 6, riskScore: 10 },
];

export default function PipelineValueDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Sales & Pipeline", href: "/?tab=sales-pipeline" },
    { label: "Pipeline Value" },
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
                  <DollarSign className="h-6 w-6 text-chart-4" />
                  Pipeline Value Analysis
                  <Badge variant="secondary" className="text-sm font-normal">$1.42M</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +8.5% vs last month
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
            Comprehensive analysis of pipeline stages, drop-off rates, revenue potential, and forecasting accuracy across all sales processes
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Stage Volume"
            value="214"
            change={{ value: "+12", type: "positive", period: "active prospects" }}
            subtitle="Across all pipeline stages"
            calculation="Total number of active prospects across all pipeline stages. Includes qualified leads through application submitted."
          />
          <KPICard
            title="Drop-off Rate"
            value="19.8%"
            change={{ value: "-2.3%", type: "positive", period: "stage exits" }}
            subtitle="Between major stages"
            calculation="Percentage of prospects who exit the pipeline without progressing to the next major stage (tour to application)."
          />
          <KPICard
            title="Revenue Potential"
            value="$1.42M"
            change={{ value: "+8.5%", type: "positive", period: "weighted value" }}
            subtitle="Next 90 days"
            calculation="Total potential revenue from all pipeline prospects, weighted by stage probability and estimated monthly rates."
          />
          <KPICard
            title="Forecasted Move-Ins"
            value="59"
            change={{ value: "+4", type: "positive", period: "next 90 days" }}
            subtitle="Probability-weighted"
            calculation="Predicted number of move-ins based on current pipeline stage volumes and historical conversion rates."
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
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
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
                  More Filters
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Stage Volume</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Drop-off Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue Potential</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Forecasted</th>
                  </tr>
                </thead>
                <tbody>
                  {communityData.map((row, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                      <td className="py-3 px-4">{row.region}</td>
                      <td className="py-3 px-4 font-medium">{row.community}</td>
                      <td className="text-right py-3 px-4">{row.stageVolume}</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium px-2 py-1 rounded-md text-xs ${
                          row.threshold === "excellent" ? "bg-success/20 text-success" :
                          row.threshold === "good" ? "bg-primary/20 text-primary" :
                          row.threshold === "warning" ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                        }`}>
                          {row.dropOffRate}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">${row.revenuePotential.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.forecastedMoveIns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="forecast-accuracy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forecast-accuracy">Stage Forecast Accuracy</TabsTrigger>
            <TabsTrigger value="cohort-analysis">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="pipeline-source">Pipeline by Source</TabsTrigger>
            <TabsTrigger value="deal-risk">Deal Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast-accuracy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Forecast vs Actual Performance"
                description="Accuracy of stage volume predictions"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={forecastAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="forecasted" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Accuracy Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {forecastAccuracyData.map((stage, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{stage.stage}</div>
                          <div className="text-sm text-muted-foreground">{stage.forecasted} → {stage.actual}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${stage.accuracy >= 95 ? 'text-success' : stage.accuracy >= 90 ? 'text-primary' : 'text-warning'}`}>
                            {stage.accuracy}%
                          </div>
                          <div className="text-sm text-muted-foreground">accuracy</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cohort-analysis" className="space-y-6">
            <ChartContainer
              title="Pipeline Progression Cohorts"
              description="How prospects progress through pipeline stages over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cohortData}>
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
                  <Line type="monotone" dataKey="week1" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="week2" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="week3" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  <Line type="monotone" dataKey="week4" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                  <Line type="monotone" dataKey="week6" stroke="hsl(var(--chart-5))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="pipeline-source" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Revenue Potential by Source"
                description="Pipeline value breakdown by lead source"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pipelineSourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {pipelineSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Pipeline Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Source Value Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pipelineSourceData.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <div className="text-sm text-muted-foreground">{source.percentage}% of total</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${source.value.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">potential value</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deal-risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>High-Value Deal Risk Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Deals with elevated risk of dropping from pipeline
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Deal</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Monthly Value</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Probability</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Days in Stage</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealRiskData.map((deal, index) => (
                        <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                          <td className="py-3 px-4 font-medium">{deal.deal}</td>
                          <td className="text-right py-3 px-4">${deal.value.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{deal.probability}%</td>
                          <td className="text-right py-3 px-4">{deal.daysInStage}</td>
                          <td className="text-right py-3 px-4">
                            <span className={`font-medium px-2 py-1 rounded-md text-xs ${
                              deal.riskScore <= 15 ? "bg-success/20 text-success" :
                              deal.riskScore <= 25 ? "bg-warning/20 text-warning" :
                              "bg-destructive/20 text-destructive"
                            }`}>
                              {deal.riskScore}
                            </span>
                          </td>
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