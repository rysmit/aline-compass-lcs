import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, Target } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", tourConversion: 68.2, qualityScore: 8.2, salesCycle: 14.5, leadAging: 6.2, threshold: "good" },
  { region: "North", community: "Golden Years", tourConversion: 72.5, qualityScore: 8.7, salesCycle: 12.3, leadAging: 4.8, threshold: "excellent" },
  { region: "South", community: "Peaceful Gardens", tourConversion: 58.9, qualityScore: 7.4, salesCycle: 18.2, leadAging: 8.5, threshold: "warning" },
  { region: "South", community: "Heritage Place", tourConversion: 65.1, qualityScore: 8.0, salesCycle: 15.7, leadAging: 6.9, threshold: "good" },
  { region: "East", community: "Meadowbrook", tourConversion: 70.3, qualityScore: 8.4, salesCycle: 13.8, leadAging: 5.5, threshold: "excellent" },
];

// Sample data for Rep-Level Conversion
const repData = [
  { rep: "Sarah Johnson", conversions: 24, tours: 38, rate: 63.2, avgCycle: 12.5 },
  { rep: "Mike Chen", conversions: 31, tours: 42, rate: 73.8, avgCycle: 11.2 },
  { rep: "Lisa Williams", conversions: 19, tours: 35, rate: 54.3, avgCycle: 16.8 },
  { rep: "David Brown", conversions: 28, tours: 41, rate: 68.3, avgCycle: 13.7 },
  { rep: "Emily Davis", conversions: 22, tours: 33, rate: 66.7, avgCycle: 14.1 },
];

// Sample data for Care-Level Influence
const careLevelData = [
  { careLevel: "Independent Living", conversion: 75.2, avgTours: 1.8, timeToDecision: 8.5 },
  { careLevel: "Assisted Living", conversion: 68.9, avgTours: 2.1, timeToDecision: 12.3 },
  { careLevel: "Memory Care", conversion: 58.4, avgTours: 2.8, timeToDecision: 18.7 },
  { careLevel: "Skilled Nursing", conversion: 45.6, avgTours: 3.2, timeToDecision: 25.1 },
];

// Sample data for Lead Timeline
const timelineData = [
  { week: "Week 1", newLeads: 45, converted: 8, aged: 3 },
  { week: "Week 2", newLeads: 52, converted: 12, aged: 5 },
  { week: "Week 3", newLeads: 38, converted: 15, aged: 8 },
  { week: "Week 4", newLeads: 41, converted: 18, aged: 12 },
  { week: "Week 5", newLeads: 47, converted: 22, aged: 15 },
  { week: "Week 6", newLeads: 35, converted: 19, aged: 18 },
];

export default function ConversionRateDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Sales & Pipeline", href: "/?tab=sales-pipeline" },
    { label: "Conversion Rate" },
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
                  <Target className="h-6 w-6 text-chart-2" />
                  Conversion Rate Analysis
                  <Badge variant="secondary" className="text-sm font-normal">67.8%</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +2.4% vs last month
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
            Comprehensive analysis of tour conversion rates, quality scores, and sales cycle performance across all communities
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Tour Conversion %"
            value="67.8%"
            change={{ value: "+2.4%", type: "positive", period: "vs last month" }}
            subtitle="Tours to applications"
            calculation="Percentage of completed tours that result in submitted applications. Calculated from all tours in the last 90 days."
          />
          <KPICard
            title="Tour Quality Score"
            value="8.2"
            change={{ value: "+0.3", type: "positive", period: "out of 10" }}
            subtitle="Engagement assessment"
            calculation="Average tour quality based on duration, questions asked, follow-up engagement, and prospect feedback scores."
          />
          <KPICard
            title="Sales Cycle Duration"
            value="14.2"
            change={{ value: "-1.8", type: "positive", period: "days" }}
            subtitle="Inquiry to move-in"
            calculation="Average number of days from first inquiry to move-in date for all successful conversions in the trailing 12 months."
          />
          <KPICard
            title="Lead Aging Score"
            value="6.4"
            change={{ value: "+0.7", type: "negative", period: "days avg" }}
            subtitle="Time without contact"
            calculation="Average days since last meaningful contact for all active leads in the pipeline."
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Tour Conversion</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quality Score</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Sales Cycle</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Lead Aging</th>
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
                          {row.tourConversion}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{row.qualityScore}</td>
                      <td className="text-right py-3 px-4">{row.salesCycle} days</td>
                      <td className="text-right py-3 px-4">{row.leadAging} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="rep-conversion" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rep-conversion">Rep-Level Conversion</TabsTrigger>
            <TabsTrigger value="care-influence">Care-Level Influence</TabsTrigger>
            <TabsTrigger value="conversion-source">Conversion by Source</TabsTrigger>
            <TabsTrigger value="lead-timeline">Lead Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="rep-conversion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Rep Performance Comparison"
                description="Conversion rates by sales representative"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={repData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="rep" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="rate" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Representative Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {repData.map((rep, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{rep.rep}</div>
                          <div className="text-sm text-muted-foreground">{rep.conversions}/{rep.tours} conversions</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{rep.rate}%</div>
                          <div className="text-sm text-muted-foreground">{rep.avgCycle}d cycle</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="care-influence" className="space-y-6">
            <ChartContainer
              title="Conversion by Care Level"
              description="How care needs affect conversion rates and timelines"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={careLevelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="careLevel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="conversion" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="conversion-source" className="space-y-6">
            <ChartContainer
              title="Conversion Rate by Lead Source"
              description="Which sources convert best"
            >
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={repData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="tours" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="rate" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Scatter dataKey="conversions" fill="hsl(var(--chart-3))" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="lead-timeline" className="space-y-6">
            <ChartContainer
              title="Lead Progression Timeline"
              description="Weekly view of lead flow and aging"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
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
                  <Line type="monotone" dataKey="newLeads" stroke="hsl(var(--chart-1))" strokeWidth={3} />
                  <Line type="monotone" dataKey="converted" stroke="hsl(var(--chart-2))" strokeWidth={3} />
                  <Line type="monotone" dataKey="aged" stroke="hsl(var(--chart-3))" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}