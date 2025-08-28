import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, Home, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NormalizedComparisonToggle } from "@/components/trust-layer";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Census & Occupancy", href: "/dashboard" },
  { label: "Occupancy Rate", href: "/metric/census-occupancy-rate" }
];

const occupancyTrendData = [
  { month: 'Jul', occupancy: 89.2, target: 90.0, industry: 87.5, moveIns: 78, moveOuts: 65, netChange: 13 },
  { month: 'Aug', occupancy: 90.1, target: 90.0, industry: 87.5, moveIns: 89, moveOuts: 67, netChange: 22 },
  { month: 'Sep', occupancy: 91.8, target: 90.0, industry: 87.5, moveIns: 95, moveOuts: 54, netChange: 41 },
  { month: 'Oct', occupancy: 90.3, target: 90.0, industry: 87.5, moveIns: 82, moveOuts: 76, netChange: 6 },
  { month: 'Nov', occupancy: 91.4, target: 90.0, industry: 87.5, moveIns: 87, moveOuts: 58, netChange: 29 },
  { month: 'Dec', occupancy: 88.2, target: 90.0, industry: 87.5, moveIns: 74, moveOuts: 89, netChange: -15 },
];

const unitTypeOccupancy = [
  { unitType: 'Studio', total: 2847, occupied: 2456, occupancy: 86.3, waitlist: 34, avgRate: 4200 },
  { unitType: '1 Bedroom', total: 4567, occupied: 4123, occupancy: 90.3, waitlist: 67, avgRate: 5400 },
  { unitType: '2 Bedroom', total: 2234, occupied: 1987, occupancy: 88.9, waitlist: 45, avgRate: 6800 },
  { unitType: 'Companion Suite', total: 1517, occupied: 1281, occupancy: 84.4, waitlist: 23, avgRate: 7200 },
];

const careTypeOccupancy = [
  { careType: 'Independent Living', total: 5020, occupied: 4450, occupancy: 88.6, revenue: 26070000, color: 'hsl(var(--chart-1))' },
  { careType: 'Assisted Living', total: 3655, occupied: 3230, occupancy: 88.4, revenue: 17445000, color: 'hsl(var(--chart-2))' },
  { careType: 'Memory Care', total: 1690, occupied: 1487, occupancy: 88.0, revenue: 10708000, color: 'hsl(var(--chart-3))' },
  { careType: 'Skilled Nursing', total: 800, occupied: 680, occupancy: 85.0, revenue: 4896000, color: 'hsl(var(--chart-4))' }
];

const dailyOccupancyData = [
  { date: 'Dec 9', occupancy: 88.4, moveIns: 3, moveOuts: 5, maintenance: 2 },
  { date: 'Dec 10', occupancy: 88.2, moveIns: 2, moveOuts: 3, maintenance: 1 },
  { date: 'Dec 11', occupancy: 88.3, moveIns: 4, moveOuts: 2, maintenance: 0 },
  { date: 'Dec 12', occupancy: 88.1, moveIns: 1, moveOuts: 4, maintenance: 3 },
  { date: 'Dec 13', occupancy: 88.0, moveIns: 2, moveOuts: 3, maintenance: 1 },
  { date: 'Dec 14', occupancy: 88.2, moveIns: 5, moveOuts: 2, maintenance: 0 },
  { date: 'Dec 15', occupancy: 88.2, moveIns: 3, moveOuts: 3, maintenance: 2 },
];

const occupancyTargetData = [
  { region: 'Southeast', target: 88.0, actual: 86.4, variance: -1.6, communities: 34, performance: 'Below' },
  { region: 'Texas', target: 88.0, actual: 84.7, variance: -3.3, communities: 28, performance: 'Critical' },
  { region: 'Midwest', target: 88.0, actual: 88.6, variance: 0.6, communities: 24, performance: 'Above' },
  { region: 'Northeast', target: 88.0, actual: 89.2, variance: 1.2, communities: 22, performance: 'Above' },
  { region: 'West', target: 88.0, actual: 87.1, variance: -0.9, communities: 19, performance: 'Below' },
];

const occupancyDriverData = [
  { driver: 'Move-In Velocity', impact: 'High', correlation: 0.82, monthlyChange: '+12%' },
  { driver: 'Marketing ROI', impact: 'Medium', correlation: 0.64, monthlyChange: '+8%' },
  { driver: 'Competitive Pricing', impact: 'Medium', correlation: 0.58, monthlyChange: '-3%' },
  { driver: 'Referral Network', impact: 'High', correlation: 0.76, monthlyChange: '+15%' },
  { driver: 'Unit Readiness', impact: 'Low', correlation: 0.34, monthlyChange: '+2%' },
];

const communityOccupancyData = [
  { region: 'Southeast', community: 'Sunrise Manor', total: 180, occupied: 156, occupancy: 86.7, target: 88.0, waitlist: 23, trend: 'stable', alerts: 1 },
  { region: 'Texas', community: 'Heritage Hills', total: 240, occupied: 203, occupancy: 84.6, target: 88.0, waitlist: 34, trend: 'down', alerts: 2 },
  { region: 'Midwest', community: 'Prairie View', total: 150, occupied: 134, occupancy: 89.3, target: 88.0, waitlist: 18, trend: 'up', alerts: 0 },
  { region: 'Southeast', community: 'Golden Years', total: 165, occupied: 142, occupancy: 86.1, target: 88.0, waitlist: 28, trend: 'stable', alerts: 1 },
  { region: 'Texas', community: 'Oak Grove', total: 210, occupied: 178, occupancy: 84.8, target: 88.0, waitlist: 42, trend: 'down', alerts: 2 },
  { region: 'Midwest', community: 'Meadowbrook', total: 190, occupied: 167, occupancy: 87.9, target: 88.0, waitlist: 31, trend: 'up', alerts: 0 },
];

const normalizedOccupancyData = [
  {
    id: '1',
    name: 'Sunrise Manor',
    occupancy: 86.7,
    census: 156,
    capacity: 180,
    revenue: 962000,
    avgDailyRate: 185,
    avgLengthOfStay: 18,
    retentionRate: 92,
    residentDays: 4680
  },
  {
    id: '2',
    name: 'Heritage Hills',
    occupancy: 84.6,
    census: 203,
    capacity: 240,
    revenue: 1218000,
    avgDailyRate: 180,
    avgLengthOfStay: 20,
    retentionRate: 89,
    residentDays: 6090
  },
  {
    id: '3',
    name: 'Prairie View',
    occupancy: 89.3,
    census: 134,
    capacity: 150,
    revenue: 756000,
    avgDailyRate: 170,
    avgLengthOfStay: 22,
    retentionRate: 95,
    residentDays: 4020
  },
  {
    id: '4',
    name: 'Golden Years',
    occupancy: 86.1,
    census: 142,
    capacity: 165,
    revenue: 781000,
    avgDailyRate: 165,
    avgLengthOfStay: 17,
    retentionRate: 88,
    residentDays: 4260
  },
  {
    id: '5',
    name: 'Oak Grove',
    occupancy: 84.8,
    census: 178,
    capacity: 210,
    revenue: 979000,
    avgDailyRate: 165,
    avgLengthOfStay: 19,
    retentionRate: 87,
    residentDays: 5340
  },
  {
    id: '6',
    name: 'Meadowbrook',
    occupancy: 87.9,
    census: 167,
    capacity: 190,
    revenue: 917000,
    avgDailyRate: 165,
    avgLengthOfStay: 19,
    retentionRate: 93,
    residentDays: 5010
  }
];

export function CensusOccupancyRateDetail() {
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
                  Portfolio Occupancy Rate
                  <Badge variant="secondary" className="text-sm font-normal">88.2%</Badge>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="text-orange-600">-1.8% below target (90.0%)</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calculation: (Occupied Units ÷ Total Available Units) × 100<br/>
                      Source: Property Management Systems<br/>
                      Updated every 6 hours</p>
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
            title="Occupied Unit %"
            value="88.2%"
            change={{
              value: "-1.3%",
              type: "negative",
              period: "vs last month"
            }}
            subtitle="9,847 occupied units"
            calculation="Percentage of total available units currently occupied. Excludes units offline for maintenance or renovation."
          />
          
          <KPICard
            title="Licensed Units"
            value="11,165"
            change={{
              value: "+0 units",
              type: "neutral",
              period: "no change"
            }}
            subtitle="Total portfolio capacity"
            calculation="Total licensed/certified units available for occupancy across all care levels and unit types."
          />
          
          <KPICard
            title="Waitlist Status"
            value="312"
            change={{
              value: "+34 prospects",
              type: "positive",
              period: "vs last month"
            }}
            subtitle="Qualified pipeline"
            calculation="Total qualified prospects in sales pipeline across all communities, including those with deposits and pending move-ins."
          />
          
          <KPICard
            title="Move-in Plan Gaps"
            value="23"
            change={{
              value: "-8 fewer gaps",
              type: "positive",
              period: "vs last month"
            }}
            subtitle="Coordination delays"
            calculation="Number of confirmed move-ins delayed due to unit preparation, care assessment, or administrative processing issues."
          />
        </div>

        {/* Detailed Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Community Occupancy Performance</CardTitle>
                <CardDescription>Occupancy rates with targets and trend analysis</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Unit Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="one-bed">1 Bedroom</SelectItem>
                    <SelectItem value="two-bed">2 Bedroom</SelectItem>
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
                  <TableHead>Occupied</TableHead>
                  <TableHead>Total Units</TableHead>
                  <TableHead>Occupancy %</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Waitlist</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityOccupancyData.map((community, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{community.region}</TableCell>
                    <TableCell>{community.community}</TableCell>
                    <TableCell className="font-medium">{community.occupied}</TableCell>
                    <TableCell>{community.total}</TableCell>
                    <TableCell>
                      <Badge variant={community.occupancy >= community.target ? 'default' : 'secondary'}>
                        {community.occupancy}%
                      </Badge>
                    </TableCell>
                    <TableCell>{community.target}%</TableCell>
                    <TableCell>{community.waitlist}</TableCell>
                    <TableCell>
                      <span className={
                        community.trend === 'up' ? 'text-green-600' :
                        community.trend === 'down' ? 'text-red-600' :
                        'text-muted-foreground'
                      }>
                        {community.trend === 'up' ? '↗' : community.trend === 'down' ? '↘' : '→'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {community.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {community.alerts}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Normalized Community Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Community Performance Analysis</CardTitle>
            <CardDescription>Compare community performance with normalized metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <NormalizedComparisonToggle 
              data={normalizedOccupancyData}
              title="Occupancy Rate - Community Comparison"
            />
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="snapshots" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="snapshots">Daily Snapshots</TabsTrigger>
            <TabsTrigger value="budget">Budget vs. Actual</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist Pipeline</TabsTrigger>
            <TabsTrigger value="rollup">Occupancy Rollup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="snapshots">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Daily Occupancy Trend"
                description="7-day occupancy rate with move-in/out activity"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyOccupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[87.5, 88.5]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Occupancy %" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer
                title="Occupancy by Care Type"
                description="Current occupancy rates across care levels"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={careTypeOccupancy}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="occupied"
                      label={({ careType, occupancy }) => `${careType}: ${occupancy}%`}
                    >
                      {careTypeOccupancy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Occupied']} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle>Regional Target Performance</CardTitle>
                <CardDescription>Occupancy performance vs budget targets by region</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Target %</TableHead>
                      <TableHead>Actual %</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Communities</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occupancyTargetData.map((region, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{region.region}</TableCell>
                        <TableCell>{region.target}%</TableCell>
                        <TableCell className="font-medium">{region.actual}%</TableCell>
                        <TableCell className={region.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {region.variance >= 0 ? '+' : ''}{region.variance}%
                        </TableCell>
                        <TableCell>{region.communities}</TableCell>
                        <TableCell>
                          <Badge variant={
                            region.performance === 'Above' ? 'default' :
                            region.performance === 'Below' ? 'secondary' :
                            'destructive'
                          }>
                            {region.performance}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Unit Type Occupancy Analysis"
                description="Occupancy rates by unit configuration"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={unitTypeOccupancy}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="unitType" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 95]} />
                    <Tooltip />
                    <Bar dataKey="occupancy" fill="hsl(var(--chart-1))" name="Occupancy %" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Drivers</CardTitle>
                  <CardDescription>Key factors influencing occupancy performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {occupancyDriverData.map((driver, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{driver.driver}</span>
                          <Badge variant={driver.impact === 'High' ? 'default' : driver.impact === 'Medium' ? 'secondary' : 'outline'} className="text-xs">
                            {driver.impact}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{driver.monthlyChange}</div>
                          <div className="text-xs text-muted-foreground">{driver.correlation} correlation</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rollup">
            <ChartContainer
              title="Occupancy vs Target Trend"
              description="6-month portfolio occupancy performance against targets"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[85, 95]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  <Line type="monotone" dataKey="industry" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="3 3" name="Industry Avg" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}