import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Download, Filter, Calendar, Info, TrendingDown, Clock } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", avgResponse: 3.2, firstContact: 89, unanswered: 7, weekendLag: 5.8, threshold: "good" },
  { region: "North", community: "Golden Years", avgResponse: 2.1, firstContact: 94, unanswered: 4, weekendLag: 4.2, threshold: "excellent" },
  { region: "South", community: "Peaceful Gardens", avgResponse: 6.8, firstContact: 76, unanswered: 15, weekendLag: 8.9, threshold: "warning" },
  { region: "South", community: "Heritage Place", avgResponse: 4.5, firstContact: 82, unanswered: 11, weekendLag: 6.7, threshold: "good" },
  { region: "East", community: "Meadowbrook", avgResponse: 2.8, firstContact: 91, unanswered: 6, weekendLag: 4.8, threshold: "excellent" },
];

// Sample data for Variability by Source
const sourceVariabilityData = [
  { source: "Google Ads", avgResponse: 2.4, variance: 1.8, volume: 142 },
  { source: "Caring.com", avgResponse: 3.1, variance: 2.2, volume: 98 },
  { source: "Facebook", avgResponse: 4.6, variance: 3.5, volume: 76 },
  { source: "Referrals", avgResponse: 1.8, variance: 1.2, volume: 89 },
  { source: "Website", avgResponse: 2.9, variance: 2.1, volume: 54 },
];

// Sample data for After-Hours Gaps
const afterHoursData = [
  { timeSlot: "5PM-7PM", inquiries: 28, avgResponse: 12.4, missedCalls: 8 },
  { timeSlot: "7PM-9PM", inquiries: 22, avgResponse: 18.7, missedCalls: 12 },
  { timeSlot: "9PM-11PM", inquiries: 15, avgResponse: 24.3, missedCalls: 10 },
  { timeSlot: "11PM-6AM", inquiries: 31, avgResponse: 8.2, missedCalls: 3 },
  { timeSlot: "Weekend", inquiries: 67, avgResponse: 15.6, missedCalls: 18 },
];

// Sample data for Day-of-Week Response
const weeklyData = [
  { day: "Monday", avgResponse: 2.8, inquiries: 45, firstContact: 92 },
  { day: "Tuesday", avgResponse: 2.3, inquiries: 52, firstContact: 94 },
  { day: "Wednesday", avgResponse: 2.1, inquiries: 48, firstContact: 96 },
  { day: "Thursday", avgResponse: 2.5, inquiries: 44, firstContact: 91 },
  { day: "Friday", avgResponse: 3.2, inquiries: 38, firstContact: 87 },
  { day: "Saturday", avgResponse: 5.8, inquiries: 29, firstContact: 78 },
  { day: "Sunday", avgResponse: 6.4, inquiries: 25, firstContact: 74 },
];

export default function LeadResponseTimeDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Sales & Pipeline", href: "/?tab=sales-pipeline" },
    { label: "Lead Response Time" },
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
                  <Clock className="h-6 w-6 text-chart-3" />
                  Lead Response Time Analysis
                  <Badge variant="secondary" className="text-sm font-normal">3.4 hours</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-success" />
                    -0.8h improvement vs last month
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
            Comprehensive analysis of response times, contact rates, and communication gaps across all inquiry sources
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Avg Response Time"
            value="3.4"
            change={{ value: "-0.8", type: "positive", period: "hours" }}
            subtitle="From inquiry to first contact"
            calculation="Average time from inquiry submission to first meaningful contact attempt. Includes phone calls, emails, and text messages."
          />
          <KPICard
            title="First Contact %"
            value="87.2%"
            change={{ value: "+3.1%", type: "positive", period: "successful reach" }}
            subtitle="Reached on first attempt"
            calculation="Percentage of inquiries where prospect is successfully reached on the first contact attempt within 24 hours."
          />
          <KPICard
            title="Unanswered Inquiries"
            value="8.6%"
            change={{ value: "-1.4%", type: "positive", period: "never contacted" }}
            subtitle="No response in 72h"
            calculation="Percentage of inquiries that receive no contact attempt within 72 hours of submission."
          />
          <KPICard
            title="Weekend Lag"
            value="6.2"
            change={{ value: "+1.1", type: "negative", period: "hours avg" }}
            subtitle="Weekend response delay"
            calculation="Average additional response time for inquiries received during weekends compared to weekday inquiries."
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Response</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">First Contact %</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Unanswered %</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Weekend Lag</th>
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
                          {row.avgResponse}h
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{row.firstContact}%</td>
                      <td className="text-right py-3 px-4">{row.unanswered}%</td>
                      <td className="text-right py-3 px-4">{row.weekendLag}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="source-variability" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="source-variability">Variability by Source</TabsTrigger>
            <TabsTrigger value="after-hours">After-Hours Gaps</TabsTrigger>
            <TabsTrigger value="median-response">Median Response</TabsTrigger>
            <TabsTrigger value="day-response">Day-of-Week Response</TabsTrigger>
          </TabsList>

          <TabsContent value="source-variability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Response Time by Source"
                description="Average response times across lead sources"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceVariabilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="avgResponse" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Source Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sourceVariabilityData.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{source.source}</div>
                          <div className="text-sm text-muted-foreground">{source.volume} inquiries</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{source.avgResponse}h</div>
                          <div className="text-sm text-muted-foreground">±{source.variance}h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="after-hours" className="space-y-6">
            <ChartContainer
              title="After-Hours Response Patterns"
              description="Response times and missed opportunities outside business hours"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={afterHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="timeSlot" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="avgResponse" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missedCalls" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="median-response" className="space-y-6">
            <ChartContainer
              title="Response Time Distribution"
              description="Median vs average response times showing distribution patterns"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sourceVariabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area type="monotone" dataKey="avgResponse" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="variance" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="day-response" className="space-y-6">
            <ChartContainer
              title="Weekly Response Patterns"
              description="Response times and contact success by day of week"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line type="monotone" dataKey="avgResponse" stroke="hsl(var(--chart-1))" strokeWidth={3} />
                  <Line type="monotone" dataKey="firstContact" stroke="hsl(var(--chart-2))" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}