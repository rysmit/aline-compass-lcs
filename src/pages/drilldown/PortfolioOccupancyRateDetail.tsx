import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NormalizedComparisonToggle } from "@/components/trust-layer";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Executive Overview", href: "/dashboard" },
  { label: "Portfolio Occupancy Rate", href: "/metric/portfolio-occupancy-rate" }
];

const occupancyTrendData = [
  { month: 'Jul', occupancy: 89.2, target: 90.0, industry: 87.5, capacity: 11120, occupied: 9917 },
  { month: 'Aug', occupancy: 90.1, target: 90.0, industry: 87.5, capacity: 11135, occupied: 10033 },
  { month: 'Sep', occupancy: 91.8, target: 90.0, industry: 87.5, capacity: 11150, occupied: 10240 },
  { month: 'Oct', occupancy: 90.3, target: 90.0, industry: 87.5, capacity: 11165, occupied: 10084 },
  { month: 'Nov', occupancy: 91.4, target: 90.0, industry: 87.5, capacity: 11165, occupied: 10204 },
  { month: 'Dec', occupancy: 88.2, target: 90.0, industry: 87.5, capacity: 11165, occupied: 9847 },
];

const careTypeOccupancy = [
  { careType: 'Independent Living', occupied: 4450, capacity: 5020, occupancy: 88.6, color: 'hsl(var(--chart-1))' },
  { careType: 'Assisted Living', occupied: 3230, capacity: 3655, occupancy: 88.4, color: 'hsl(var(--chart-2))' },
  { careType: 'Memory Care', occupied: 1487, capacity: 1690, occupancy: 88.0, color: 'hsl(var(--chart-3))' },
  { careType: 'Skilled Nursing', occupied: 680, capacity: 800, occupancy: 85.0, color: 'hsl(var(--chart-4))' }
];

const waitlistData = [
  { month: 'Jul', waitlist: 234, conversions: 89, conversionRate: 38.0 },
  { month: 'Aug', waitlist: 267, conversions: 102, conversionRate: 38.2 },
  { month: 'Sep', waitlist: 298, conversions: 134, conversionRate: 45.0 },
  { month: 'Oct', waitlist: 245, conversions: 89, conversionRate: 36.3 },
  { month: 'Nov', waitlist: 278, conversions: 112, conversionRate: 40.3 },
  { month: 'Dec', waitlist: 312, conversions: 98, conversionRate: 31.4 },
];

const moveInDelayReasons = [
  { reason: 'Financial Approval', count: 34, percentage: 28.6, avgDays: 12.3 },
  { reason: 'Care Assessment', count: 28, percentage: 23.5, avgDays: 8.7 },
  { reason: 'Unit Preparation', count: 22, percentage: 18.5, avgDays: 5.4 },
  { reason: 'Family Coordination', count: 18, percentage: 15.1, avgDays: 14.2 },
  { reason: 'Medical Clearance', count: 12, percentage: 10.1, avgDays: 6.8 },
  { reason: 'Other', count: 5, percentage: 4.2, avgDays: 9.1 },
];

const communityOccupancyData = [
  { region: 'Southeast', community: 'Sunrise Manor', occupied: 156, capacity: 180, occupancy: 86.7, target: 88.0, variance: '-1.3%', waitlist: 23, status: 'Watch' },
  { region: 'Texas', community: 'Heritage Hills', occupied: 203, capacity: 240, occupancy: 84.6, target: 88.0, variance: '-3.4%', waitlist: 34, status: 'Critical' },
  { region: 'Midwest', community: 'Prairie View', occupied: 134, capacity: 150, occupancy: 89.3, target: 88.0, variance: '+1.3%', waitlist: 18, status: 'Good' },
  { region: 'Southeast', community: 'Golden Years', occupied: 142, capacity: 165, occupancy: 86.1, target: 88.0, variance: '-1.9%', waitlist: 28, status: 'Watch' },
  { region: 'Midwest', community: 'Meadowbrook', occupied: 167, capacity: 190, occupancy: 87.9, target: 88.0, variance: '-0.1%', waitlist: 31, status: 'Good' },
  { region: 'Texas', community: 'Oak Grove', occupied: 178, capacity: 210, occupancy: 84.8, target: 88.0, variance: '-3.2%', waitlist: 42, status: 'Critical' },
];

const normalizedPortfolioData = [
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
    name: 'Meadowbrook',
    occupancy: 87.9,
    census: 167,
    capacity: 190,
    revenue: 917000,
    avgDailyRate: 165,
    avgLengthOfStay: 19,
    retentionRate: 93,
    residentDays: 5010
  },
  {
    id: '6',
    name: 'Oak Grove',
    occupancy: 84.8,
    census: 178,
    capacity: 210,
    revenue: 979000,
    avgDailyRate: 165,
    avgLengthOfStay: 19,
    retentionRate: 87,
    residentDays: 5340
  }
];

const occupancyByRegion = [
  { region: 'Southeast', occupancy: 86.4, target: 88.0, communities: 34, totalUnits: 3420, occupiedUnits: 2955 },
  { region: 'Texas', occupancy: 84.7, target: 88.0, communities: 28, totalUnits: 2890, occupiedUnits: 2448 },
  { region: 'Midwest', occupancy: 88.6, target: 88.0, communities: 24, totalUnits: 2345, occupiedUnits: 2078 },
  { region: 'Northeast', occupancy: 89.2, target: 88.0, communities: 22, totalUnits: 1890, occupiedUnits: 1686 },
  { region: 'West', occupancy: 87.1, target: 88.0, communities: 19, totalUnits: 1620, occupiedUnits: 1411 },
];

export function PortfolioOccupancyRateDetail() {
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
                    <p>Calculation: (Occupied Units / Total Available Units) × 100<br/>
                    Source: Property Management System<br/>
                    Synced every 6 hours</p>
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
          title="Occupied Units"
          value="9,847"
          change={{
            value: "+287 units",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Total portfolio occupied"
          calculation="Current count of occupied units across all communities and care levels. Updated in real-time from property management systems."
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
          calculation="Total licensed/certified units available for occupancy across all care levels. Includes units temporarily offline for maintenance."
        />
        
        <KPICard
          title="Waitlist Status"
          value="312"
          change={{
            value: "+34 prospects",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Active prospects"
          calculation="Total prospects in sales pipeline across all communities. Includes qualified leads and pending move-in decisions."
        />
        
        <KPICard
          title="Move-in Delay Avg"
          value="9.7 days"
          change={{
            value: "+2.1 days",
            type: "negative",
            period: "vs target"
          }}
          subtitle="From decision to move-in"
          calculation="Average days from move-in decision to actual occupancy. Includes administrative processing, unit preparation, and coordination delays."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Community Occupancy Performance</CardTitle>
              <CardDescription>Detailed occupancy metrics by community and region</CardDescription>
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
                <TableHead>Occupied</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupancy %</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Waitlist</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communityOccupancyData.map((community, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{community.region}</TableCell>
                  <TableCell>{community.community}</TableCell>
                  <TableCell>{community.occupied}</TableCell>
                  <TableCell>{community.capacity}</TableCell>
                  <TableCell className="font-medium">{community.occupancy}%</TableCell>
                  <TableCell>{community.target}%</TableCell>
                  <TableCell className={community.variance.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {community.variance}
                  </TableCell>
                  <TableCell>{community.waitlist}</TableCell>
                  <TableCell>
                    <Badge variant={
                      community.status === 'Good' ? 'default' :
                      community.status === 'Watch' ? 'secondary' :
                      'destructive'
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

      {/* Normalized Community Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Community Performance Analysis</CardTitle>
          <CardDescription>Compare community performance with normalized metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <NormalizedComparisonToggle 
            data={normalizedPortfolioData}
            title="Portfolio Occupancy - Community Comparison"
          />
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="snapshots" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="snapshots">Daily Snapshots</TabsTrigger>
          <TabsTrigger value="budget">Budget vs. Actual</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist Pipeline</TabsTrigger>
          <TabsTrigger value="targets">Occupancy Targets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="snapshots">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Occupancy Trend vs Target"
              description="6-month portfolio occupancy performance"
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
              <CardTitle>Regional Occupancy Performance</CardTitle>
              <CardDescription>Performance vs targets by region</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Occupancy %</TableHead>
                    <TableHead>Target %</TableHead>
                    <TableHead>Communities</TableHead>
                    <TableHead>Total Units</TableHead>
                    <TableHead>Occupied Units</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {occupancyByRegion.map((region, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{region.region}</TableCell>
                      <TableCell className="font-medium">{region.occupancy}%</TableCell>
                      <TableCell>{region.target}%</TableCell>
                      <TableCell>{region.communities}</TableCell>
                      <TableCell>{region.totalUnits.toLocaleString()}</TableCell>
                      <TableCell>{region.occupiedUnits.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={region.occupancy >= region.target ? 'default' : 'destructive'}>
                          {region.occupancy >= region.target ? 'On Target' : 'Below Target'}
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
              title="Waitlist Conversion Trends"
              description="Monthly waitlist volume and conversion rates"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={waitlistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="waitlist" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Waitlist Count" />
                  <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Conversion %" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Move-In Delay Analysis</CardTitle>
                <CardDescription>Reasons for delays and average impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moveInDelayReasons.map((reason, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{reason.reason}</span>
                        <Badge variant="outline" className="text-xs">
                          {reason.count} cases
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{reason.avgDays} days</div>
                        <div className="text-xs text-muted-foreground">{reason.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="targets">
          <ChartContainer
            title="Regional Occupancy Comparison"
            description="Current occupancy vs targets by region"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 92]} />
                <Tooltip />
                <Bar dataKey="occupancy" fill="hsl(var(--chart-1))" name="Actual" />
                <Bar dataKey="target" fill="hsl(var(--chart-2))" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}