import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Filter, Calendar, Info, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

// Sample data for the detailed report table
const communityData = [
  { region: "North", community: "Sunrise Manor", inquiries: 45, touchpoints: 3.2, followUpRate: 87, avgRepActivity: 12, threshold: "good" },
  { region: "North", community: "Golden Years", inquiries: 38, touchpoints: 2.8, followUpRate: 92, avgRepActivity: 15, threshold: "excellent" },
  { region: "South", community: "Peaceful Gardens", inquiries: 52, touchpoints: 3.5, followUpRate: 79, avgRepActivity: 10, threshold: "warning" },
  { region: "South", community: "Heritage Place", inquiries: 41, touchpoints: 3.1, followUpRate: 85, avgRepActivity: 13, threshold: "good" },
  { region: "East", community: "Meadowbrook", inquiries: 33, touchpoints: 2.9, followUpRate: 88, avgRepActivity: 11, threshold: "good" },
];

// Sample data for Campaign Attribution
const campaignData = [
  { campaign: "Google Search", inquiries: 124, cost: 8500, cpi: 68.5, quality: 85 },
  { campaign: "Facebook Ads", inquiries: 89, cost: 5200, cpi: 58.4, quality: 78 },
  { campaign: "Care.com", inquiries: 67, cost: 4100, cpi: 61.2, quality: 92 },
  { campaign: "Direct Mail", inquiries: 45, cost: 3200, cpi: 71.1, quality: 74 },
];

// Sample data for Digital Source Funnel
const digitalFunnelData = [
  { stage: "Website Visits", value: 3450, conversion: 100 },
  { stage: "Form Submissions", value: 485, conversion: 14.1 },
  { stage: "Phone Calls", value: 287, conversion: 59.2 },
  { stage: "Scheduled Tours", value: 156, conversion: 54.4 },
  { stage: "Completed Tours", value: 124, conversion: 79.5 },
];

// Sample data for Timing Trends
const timingData = [
  { hour: "9 AM", inquiries: 12, quality: 78 },
  { hour: "10 AM", inquiries: 18, quality: 82 },
  { hour: "11 AM", inquiries: 24, quality: 85 },
  { hour: "12 PM", inquiries: 22, quality: 79 },
  { hour: "1 PM", inquiries: 19, quality: 76 },
  { hour: "2 PM", inquiries: 28, quality: 88 },
  { hour: "3 PM", inquiries: 31, quality: 91 },
  { hour: "4 PM", inquiries: 26, quality: 84 },
  { hour: "5 PM", inquiries: 15, quality: 72 },
];

export default function MonthlyInquiriesDetail() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Sales & Pipeline", href: "/?tab=sales-pipeline" },
    { label: "Monthly Inquiries" },
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
                  <Users className="h-6 w-6 text-chart-1" />
                  Monthly Inquiries Analysis
                  <Badge variant="secondary" className="text-sm font-normal">485 inquiries</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +12.3% vs last month
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
            Comprehensive analysis of inquiry volume, sources, and engagement patterns across all marketing channels
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Inquiry Source Quality"
            value="82.4"
            change={{ value: "+3.2", type: "positive", period: "vs last month" }}
            subtitle="Average lead score"
            calculation="Weighted average quality score across all inquiry sources based on conversion probability and engagement metrics."
          />
          <KPICard
            title="Average Touchpoints"
            value="3.1"
            change={{ value: "-0.2", type: "negative", period: "per inquiry" }}
            subtitle="Before first response"
            calculation="Average number of marketing touchpoints a prospect has before making their first inquiry. Lower numbers indicate more efficient targeting."
          />
          <KPICard
            title="Rep Activity Score"
            value="12.6"
            change={{ value: "+1.8", type: "positive", period: "actions/day" }}
            subtitle="Daily engagement actions"
            calculation="Average number of sales activities (calls, emails, follow-ups) per representative per day across all active inquiries."
          />
          <KPICard
            title="Follow-Up Rate"
            value="86.3%"
            change={{ value: "+2.1%", type: "positive", period: "within 24h" }}
            subtitle="Timely responses"
            calculation="Percentage of inquiries that receive follow-up contact within 24 hours of initial inquiry submission."
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Inquiries</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Touchpoints</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Follow-Up Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Rep Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {communityData.map((row, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                      <td className="py-3 px-4">{row.region}</td>
                      <td className="py-3 px-4 font-medium">{row.community}</td>
                      <td className="text-right py-3 px-4">{row.inquiries}</td>
                      <td className="text-right py-3 px-4">{row.touchpoints}</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium px-2 py-1 rounded-md text-xs ${
                          row.threshold === "excellent" ? "bg-success/20 text-success" :
                          row.threshold === "good" ? "bg-primary/20 text-primary" :
                          row.threshold === "warning" ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                        }`}>
                          {row.followUpRate}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{row.avgRepActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="campaign-attribution" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaign-attribution">Campaign Attribution</TabsTrigger>
            <TabsTrigger value="inquiry-quality">Inquiry Quality Score</TabsTrigger>
            <TabsTrigger value="digital-funnel">Digital Source Funnel</TabsTrigger>
            <TabsTrigger value="timing-trends">Timing Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="campaign-attribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Campaign Performance"
                description="Inquiries and cost efficiency by campaign"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="campaign" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="inquiries" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaignData.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{campaign.campaign}</div>
                          <div className="text-sm text-muted-foreground">{campaign.inquiries} inquiries</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${campaign.cpi}</div>
                          <div className="text-sm text-muted-foreground">cost per inquiry</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inquiry-quality" className="space-y-6">
            <ChartContainer
              title="Inquiry Quality Distribution"
              description="Quality scores across all sources"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="campaign" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="quality" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="digital-funnel" className="space-y-6">
            <ChartContainer
              title="Digital Source Conversion Funnel"
              description="Step-by-step conversion through digital channels"
            >
              <div className="space-y-4">
                {digitalFunnelData.map((item, index) => (
                  <div key={item.stage} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-muted-foreground text-right">
                      {item.stage}
                    </div>
                    <div className="flex-1 bg-muted/20 rounded-lg overflow-hidden">
                      <div 
                        className="h-8 rounded-lg flex items-center justify-between px-3 text-sm font-medium text-foreground transition-all duration-500"
                        style={{ 
                          width: `${(item.value / digitalFunnelData[0].value) * 100}%`,
                          backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` 
                        }}
                      >
                        <span>{item.value.toLocaleString()}</span>
                        {index > 0 && <span>{item.conversion}%</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="timing-trends" className="space-y-6">
            <ChartContainer
              title="Inquiry Timing Patterns"
              description="Volume and quality by time of day"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}