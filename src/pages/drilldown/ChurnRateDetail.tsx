import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Executive Overview", href: "/dashboard" },
  { label: "Churn Rate", href: "/metric/churn-rate" }
];

const churnTrendData = [
  { month: 'Jul', churnRate: 12.4, industry: 11.8, target: 10.0 },
  { month: 'Aug', churnRate: 13.1, industry: 11.8, target: 10.0 },
  { month: 'Sep', churnRate: 11.7, industry: 11.8, target: 10.0 },
  { month: 'Oct', churnRate: 12.8, industry: 11.8, target: 10.0 },
  { month: 'Nov', churnRate: 14.2, industry: 11.8, target: 10.0 },
  { month: 'Dec', churnRate: 13.6, industry: 11.8, target: 10.0 },
];

const moveOutReasons = [
  { reason: 'Higher Level of Care', count: 45, percentage: 32.1, color: 'hsl(var(--chart-1))' },
  { reason: 'Financial Constraints', count: 28, percentage: 20.0, color: 'hsl(var(--chart-2))' },
  { reason: 'Family Preference', count: 22, percentage: 15.7, color: 'hsl(var(--chart-3))' },
  { reason: 'Dissatisfaction', count: 18, percentage: 12.9, color: 'hsl(var(--chart-4))' },
  { reason: 'Deceased', count: 15, percentage: 10.7, color: 'hsl(var(--chart-5))' },
  { reason: 'Other', count: 12, percentage: 8.6, color: 'hsl(var(--muted))' }
];

const satisfactionTrend = [
  { month: 'Jul', satisfaction: 4.2, churn: 12.4 },
  { month: 'Aug', satisfaction: 4.1, churn: 13.1 },
  { month: 'Sep', satisfaction: 4.3, churn: 11.7 },
  { month: 'Oct', satisfaction: 4.0, churn: 12.8 },
  { month: 'Nov', satisfaction: 3.9, churn: 14.2 },
  { month: 'Dec', satisfaction: 4.1, churn: 13.6 },
];

const cohortData = [
  { cohort: 'Q1 2024', month1: 5.2, month3: 8.7, month6: 12.4, month12: 18.6 },
  { cohort: 'Q2 2024', month1: 4.8, month3: 9.1, month6: 13.2, month12: null },
  { cohort: 'Q3 2024', month1: 6.1, month3: 10.4, month6: null, month12: null },
  { cohort: 'Q4 2024', month1: 5.7, month3: null, month6: null, month12: null },
];

const communityChurnData = [
  { region: 'Texas', community: 'Heritage Hills', residents: 203, moveOuts: 18, churnRate: '8.9%', avgLOS: '18 months', readmissions: 2, status: 'Critical' },
  { region: 'Southeast', community: 'Golden Years', residents: 142, moveOuts: 21, churnRate: '14.8%', avgLOS: '14 months', readmissions: 1, status: 'High' },
  { region: 'Midwest', community: 'Prairie View', residents: 134, moveOuts: 8, churnRate: '6.0%', avgLOS: '24 months', readmissions: 3, status: 'Good' },
  { region: 'Southeast', community: 'Sunrise Manor', residents: 156, moveOuts: 15, churnRate: '9.6%', avgLOS: '16 months', readmissions: 2, status: 'Watch' },
];

export function ChurnRateDetail() {
  return (
    <div className="space-y-6 p-6">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      {/* Primary Metric Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Churn Rate
                <Badge variant="destructive" className="text-sm font-normal">13.6%</Badge>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                <span className="text-destructive">+1.8% above industry average</span>
                <span className="text-muted-foreground">•</span>
                <span>Last updated: Dec 15, 2024 6:00 AM</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Filter Period
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Top 4 Supporting Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Move-Outs"
          value="140"
          change={{
            value: "+18 residents",
            type: "negative",
            period: "vs last month"
          }}
          subtitle="Across 127 communities"
          calculation="Total number of residents who moved out in the reporting period, including voluntary departures, transfers to higher care, and other reasons."
        />
        
        <KPICard
          title="Move-Out Reasons"
          value="32.1%"
          change={{
            value: "Higher level care",
            type: "neutral",
            period: "top reason"
          }}
          subtitle="Care progression primary"
          calculation="Distribution of move-out reasons categorized by voluntary departure, care level progression, financial factors, and satisfaction issues."
        />
        
        <KPICard
          title="LOS Before Exit"
          value="16.2 mo"
          change={{
            value: "-2.1 months",
            type: "negative",
            period: "vs last year"
          }}
          subtitle="Average tenure"
          calculation="Average length of stay for residents who moved out during the reporting period. Calculated from move-in date to move-out date."
        />
        
        <KPICard
          title="Readmissions"
          value="8"
          change={{
            value: "+3 residents",
            type: "positive",
            period: "within 90 days"
          }}
          subtitle="5.7% of move-outs"
          calculation="Number of former residents who returned within 90 days of their departure, indicating potential retention opportunities or service gaps."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Community Churn Analysis</CardTitle>
              <CardDescription>Detailed churn metrics by community and region</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="southeast">Southeast</SelectItem>
                  <SelectItem value="texas">Texas</SelectItem>
                  <SelectItem value="midwest">Midwest</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Current Residents</TableHead>
                <TableHead>Move-Outs (30d)</TableHead>
                <TableHead>Churn Rate</TableHead>
                <TableHead>Avg LOS</TableHead>
                <TableHead>Readmissions</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communityChurnData.map((community, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{community.region}</TableCell>
                  <TableCell>{community.community}</TableCell>
                  <TableCell>{community.residents}</TableCell>
                  <TableCell>{community.moveOuts}</TableCell>
                  <TableCell className="font-medium">{community.churnRate}</TableCell>
                  <TableCell>{community.avgLOS}</TableCell>
                  <TableCell>{community.readmissions}</TableCell>
                  <TableCell>
                    <Badge variant={
                      community.status === 'Critical' ? 'destructive' :
                      community.status === 'High' ? 'destructive' :
                      community.status === 'Watch' ? 'secondary' :
                      'default'
                    }>
                      {community.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="cohort" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cohort">Cohort Churn Over Time</TabsTrigger>
          <TabsTrigger value="destinations">Exit Destinations</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cohort">
          <ChartContainer
            title="Churn by Move-In Cohort"
            description="Retention curves for resident cohorts by move-in quarter"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="cohort" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="month1" stroke="hsl(var(--chart-1))" strokeWidth={2} name="1 Month" />
                <Line type="monotone" dataKey="month3" stroke="hsl(var(--chart-2))" strokeWidth={2} name="3 Months" />
                <Line type="monotone" dataKey="month6" stroke="hsl(var(--chart-3))" strokeWidth={2} name="6 Months" />
                <Line type="monotone" dataKey="month12" stroke="hsl(var(--chart-4))" strokeWidth={2} name="12 Months" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="destinations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Move-Out Reasons Distribution"
              description="Breakdown of departure reasons"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moveOutReasons}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                  >
                    {moveOutReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Reason Analysis</CardTitle>
                <CardDescription>Detailed breakdown of move-out reasons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moveOutReasons.map((reason, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: reason.color }} />
                        <span className="text-sm">{reason.reason}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{reason.count}</div>
                        <div className="text-xs text-muted-foreground">{reason.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction">
          <ChartContainer
            title="Satisfaction vs Churn Correlation"
            description="Family satisfaction scores correlated with churn rates"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" domain={[3.5, 4.5]} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" domain={[10, 16]} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="satisfaction" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Satisfaction" />
                <Line yAxisId="right" type="monotone" dataKey="churn" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Churn Rate" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="revenue">
          <ChartContainer
            title="Churn Rate vs Industry Benchmark"
            description="Portfolio churn performance vs industry standards"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={churnTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="churnRate" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Actual Churn" />
                <Line type="monotone" dataKey="industry" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Industry Avg" />
                <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="3 3" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}