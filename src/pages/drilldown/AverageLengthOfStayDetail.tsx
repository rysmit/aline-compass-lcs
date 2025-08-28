import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, Clock, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Census & Occupancy", href: "/dashboard" },
  { label: "Average Length of Stay", href: "/metric/average-length-of-stay" }
];

const losTrendData = [
  { month: 'Jul', avgLOS: 18.4, median: 16.2, target: 20.0, independent: 22.1, assisted: 16.8, memory: 14.2, skilled: 8.7 },
  { month: 'Aug', avgLOS: 18.7, median: 16.5, target: 20.0, independent: 22.4, assisted: 17.1, memory: 14.5, skilled: 8.9 },
  { month: 'Sep', avgLOS: 19.2, median: 17.1, target: 20.0, independent: 23.1, assisted: 17.6, memory: 14.8, skilled: 9.2 },
  { month: 'Oct', avgLOS: 18.9, median: 16.8, target: 20.0, independent: 22.7, assisted: 17.2, memory: 14.6, skilled: 9.0 },
  { month: 'Nov', avgLOS: 19.5, median: 17.4, target: 20.0, independent: 23.4, assisted: 17.9, memory: 15.1, skilled: 9.3 },
  { month: 'Dec', avgLOS: 19.8, median: 17.7, target: 20.0, independent: 23.8, assisted: 18.2, memory: 15.4, skilled: 9.5 },
];

const exitReasonData = [
  { reason: 'Higher Level Care', count: 156, avgLOS: 14.2, percentage: 35.2 },
  { reason: 'Family Decision', count: 89, avgLOS: 22.1, percentage: 20.1 },
  { reason: 'Financial', count: 67, avgLOS: 16.8, percentage: 15.1 },
  { reason: 'Health Decline', count: 54, avgLOS: 12.4, percentage: 12.2 },
  { reason: 'Deceased', count: 43, avgLOS: 28.7, percentage: 9.7 },
  { reason: 'Dissatisfaction', count: 34, avgLOS: 8.3, percentage: 7.7 },
];

const losDistribution = [
  { range: '0-6 months', count: 234, percentage: 23.4, careLevel: 'All Levels' },
  { range: '6-12 months', count: 189, percentage: 18.9, careLevel: 'All Levels' },
  { range: '12-18 months', count: 167, percentage: 16.7, careLevel: 'All Levels' },
  { range: '18-24 months', count: 145, percentage: 14.5, careLevel: 'All Levels' },
  { range: '24-36 months', count: 123, percentage: 12.3, careLevel: 'All Levels' },
  { range: '36+ months', count: 142, percentage: 14.2, careLevel: 'All Levels' },
];

const benchmarkData = [
  { careLevel: 'Independent Living', ourLOS: 23.8, industryLOS: 24.5, variance: -0.7, residents: 1847 },
  { careLevel: 'Assisted Living', ourLOS: 18.2, industryLOS: 17.8, variance: 0.4, residents: 1432 },
  { careLevel: 'Memory Care', ourLOS: 15.4, industryLOS: 14.9, variance: 0.5, residents: 876 },
  { careLevel: 'Skilled Nursing', ourLOS: 9.5, industryLOS: 8.2, variance: 1.3, residents: 234 },
];

const adlCorrelationData = [
  { adlLevel: 'Independent (0-1)', avgLOS: 26.4, count: 1245, churnRate: 8.2 },
  { adlLevel: 'Light Assist (2-3)', avgLOS: 21.7, count: 1678, churnRate: 11.5 },
  { adlLevel: 'Moderate (4-5)', avgLOS: 17.3, count: 1234, churnRate: 15.8 },
  { adlLevel: 'Heavy Assist (6+)', avgLOS: 12.1, count: 789, churnRate: 22.4 },
];

const communityLOSData = [
  { region: 'Southeast', community: 'Sunrise Manor', avgLOS: 21.4, median: 18.7, target: 20.0, residents: 156, benchmark: 'Above', trend: 'up' },
  { region: 'Texas', community: 'Heritage Hills', avgLOS: 18.9, median: 16.2, target: 20.0, residents: 203, benchmark: 'Below', trend: 'stable' },
  { region: 'Midwest', community: 'Prairie View', avgLOS: 22.8, median: 20.1, target: 20.0, residents: 134, benchmark: 'Above', trend: 'up' },
  { region: 'Southeast', community: 'Golden Years', avgLOS: 17.2, median: 15.4, target: 20.0, residents: 142, benchmark: 'Below', trend: 'down' },
  { region: 'Texas', community: 'Oak Grove', avgLOS: 19.6, median: 17.8, target: 20.0, residents: 178, benchmark: 'Target', trend: 'stable' },
  { region: 'Midwest', community: 'Meadowbrook', avgLOS: 20.5, median: 18.9, target: 20.0, residents: 167, benchmark: 'Target', trend: 'up' },
];

export function AverageLengthOfStayDetail() {
  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        <DrillDownBreadcrumb items={breadcrumbItems} />
        
        {/* Primary Metric Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  Average Length of Stay
                  <Badge variant="default" className="text-sm font-normal">19.8 months</Badge>
                  <Clock className="h-5 w-5 text-blue-600" />
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="text-green-600">+1.4 months vs last year</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calculation: Average tenure from move-in to move-out<br/>
                      Source: Property Management & Care Systems<br/>
                      Updated daily</p>
                    </TooltipContent>
                  </UITooltip>
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
            title="Median LOS"
            value="17.7 mo"
            change={{
              value: "+1.2 months",
              type: "positive",
              period: "vs last year"
            }}
            subtitle="50th percentile"
            calculation="Middle value of all length of stay durations when arranged in order. Less affected by outliers than average."
          />
          
          <KPICard
            title="LOS by Care Level"
            value="15.4 mo"
            change={{
              value: "Memory Care avg",
              type: "neutral",
              period: "shortest tenure"
            }}
            subtitle="Care progression impact"
            calculation="Average LOS varies by care acuity level. Memory Care typically shorter due to health progression needs."
          />
          
          <KPICard
            title="MoM Change"
            value="+0.3 mo"
            change={{
              value: "+1.5%",
              type: "positive",
              period: "vs last month"
            }}
            subtitle="Improving retention"
            calculation="Month-over-month change in average LOS. Positive trend indicates improved resident satisfaction and retention."
          />
          
          <KPICard
            title="Exit Reason Impact"
            value="35.2%"
            change={{
              value: "Higher care need",
              type: "neutral",
              period: "top exit reason"
            }}
            subtitle="Natural progression"
            calculation="Distribution of exit reasons affecting LOS. Higher care needs are natural progression, not retention failures."
          />
        </div>

        {/* Detailed Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Community LOS Performance</CardTitle>
                <CardDescription>Length of stay analysis by community and care level</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Care Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="independent">Independent</SelectItem>
                    <SelectItem value="assisted">Assisted Living</SelectItem>
                    <SelectItem value="memory">Memory Care</SelectItem>
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
                  <TableHead>Avg LOS</TableHead>
                  <TableHead>Median LOS</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Residents</TableHead>
                  <TableHead>vs Benchmark</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityLOSData.map((community, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{community.region}</TableCell>
                    <TableCell>{community.community}</TableCell>
                    <TableCell className="font-medium">{community.avgLOS} mo</TableCell>
                    <TableCell>{community.median} mo</TableCell>
                    <TableCell>{community.target} mo</TableCell>
                    <TableCell>{community.residents}</TableCell>
                    <TableCell>
                      <Badge variant={
                        community.benchmark === 'Above' ? 'default' :
                        community.benchmark === 'Target' ? 'secondary' :
                        'destructive'
                      }>
                        {community.benchmark}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={
                        community.trend === 'up' ? 'text-green-600' :
                        community.trend === 'down' ? 'text-red-600' :
                        'text-muted-foreground'
                      }>
                        {community.trend === 'up' ? '↗' : community.trend === 'down' ? '↘' : '→'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="source" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="source">LOS by Source</TabsTrigger>
            <TabsTrigger value="retention">Churn Retention View</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmark Comparison</TabsTrigger>
            <TabsTrigger value="correlation">ADL Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="source">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="LOS by Care Level Trend"
                description="Average length of stay trends across care types"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={losTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="independent" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Independent" />
                    <Line type="monotone" dataKey="assisted" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Assisted" />
                    <Line type="monotone" dataKey="memory" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Memory Care" />
                    <Line type="monotone" dataKey="skilled" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Skilled" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Exit Reason Analysis</CardTitle>
                  <CardDescription>LOS impact by departure reason</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exitReasonData.map((reason, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{reason.reason}</span>
                          <Badge variant="outline" className="text-xs">
                            {reason.count} exits
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{reason.avgLOS} mo</div>
                          <div className="text-xs text-muted-foreground">{reason.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="retention">
            <ChartContainer
              title="LOS Distribution Analysis"
              description="Resident tenure distribution across portfolio"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={losDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Residents" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="benchmark">
            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmark Comparison</CardTitle>
                <CardDescription>Portfolio LOS performance vs industry standards</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Care Level</TableHead>
                      <TableHead>Our LOS</TableHead>
                      <TableHead>Industry Avg</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Residents</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benchmarkData.map((benchmark, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{benchmark.careLevel}</TableCell>
                        <TableCell>{benchmark.ourLOS} mo</TableCell>
                        <TableCell>{benchmark.industryLOS} mo</TableCell>
                        <TableCell className={benchmark.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {benchmark.variance >= 0 ? '+' : ''}{benchmark.variance} mo
                        </TableCell>
                        <TableCell>{benchmark.residents.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={benchmark.variance >= 0 ? 'default' : 'destructive'}>
                            {benchmark.variance >= 0 ? 'Above Avg' : 'Below Avg'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="LOS vs ADL Level Correlation"
                description="Length of stay by care acuity requirements"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adlCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="adlLevel" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="avgLOS" fill="hsl(var(--chart-1))" name="Avg LOS (months)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer
                title="Average vs Median LOS Trend"
                description="Comparison showing distribution skew"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={losTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgLOS" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Average LOS" />
                    <Line type="monotone" dataKey="median" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Median LOS" />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="3 3" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}