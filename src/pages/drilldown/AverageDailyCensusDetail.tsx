import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NormalizedComparisonToggle } from "@/components/trust-layer";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Executive Overview", href: "/dashboard" },
  { label: "Average Daily Census", href: "/metric/average-daily-census" }
];

const trendData = [
  { month: 'Jul', census: 9847, target: 10200, variance: -353 },
  { month: 'Aug', census: 9756, target: 10200, variance: -444 },
  { month: 'Sep', census: 9892, target: 10200, variance: -308 },
  { month: 'Oct', census: 9945, target: 10200, variance: -255 },
  { month: 'Nov', census: 10103, target: 10200, variance: -97 },
  { month: 'Dec', census: 9847, target: 10200, variance: -353 },
];

const occupancyData = [
  { name: 'Independent Living', value: 45.2, color: 'hsl(var(--chart-1))' },
  { name: 'Assisted Living', value: 32.8, color: 'hsl(var(--chart-2))' },
  { name: 'Memory Care', value: 15.1, color: 'hsl(var(--chart-3))' },
  { name: 'Skilled Nursing', value: 6.9, color: 'hsl(var(--chart-4))' }
];

const payorData = [
  { month: 'Jul', private: 4200, insurance: 3100, medicaid: 2547 },
  { month: 'Aug', private: 4180, insurance: 3076, medicaid: 2500 },
  { month: 'Sep', private: 4210, insurance: 3182, medicaid: 2500 },
  { month: 'Oct', private: 4245, insurance: 3200, medicaid: 2500 },
  { month: 'Nov', private: 4303, insurance: 3300, medicaid: 2500 },
  { month: 'Dec', private: 4200, insurance: 3147, medicaid: 2500 },
];

const communityData = [
  { region: 'Southeast', community: 'Sunrise Manor', census: 156, capacity: 180, occupancy: '86.7%', change: '+3', status: 'Good' },
  { region: 'Southeast', community: 'Golden Years', census: 142, capacity: 165, occupancy: '86.1%', change: '-2', status: 'Watch' },
  { region: 'Texas', community: 'Heritage Hills', census: 203, capacity: 240, occupancy: '84.6%', change: '+8', status: 'Good' },
  { region: 'Texas', community: 'Oak Grove', census: 178, capacity: 210, occupancy: '84.8%', change: '-5', status: 'Watch' },
  { region: 'Midwest', community: 'Prairie View', census: 134, capacity: 150, occupancy: '89.3%', change: '+12', status: 'Excellent' },
  { region: 'Midwest', community: 'Meadowbrook', census: 167, capacity: 190, occupancy: '87.9%', change: '+6', status: 'Good' },
];

const normalizedCommunityData = [
  {
    id: '1',
    name: 'Sunrise Manor',
    occupancy: 86.7,
    census: 156,
    capacity: 180,
    revenue: 285000,
    avgDailyRate: 165,
    avgLengthOfStay: 18,
    retentionRate: 92,
    residentDays: 4680
  },
  {
    id: '2',
    name: 'Golden Years',
    occupancy: 86.1,
    census: 142,
    capacity: 165,
    revenue: 248000,
    avgDailyRate: 158,
    avgLengthOfStay: 16,
    retentionRate: 88,
    residentDays: 4260
  },
  {
    id: '3',
    name: 'Heritage Hills',
    occupancy: 84.6,
    census: 203,
    capacity: 240,
    revenue: 365000,
    avgDailyRate: 172,
    avgLengthOfStay: 20,
    retentionRate: 94,
    residentDays: 6090
  },
  {
    id: '4',
    name: 'Oak Grove',
    occupancy: 84.8,
    census: 178,
    capacity: 210,
    revenue: 298000,
    avgDailyRate: 160,
    avgLengthOfStay: 17,
    retentionRate: 90,
    residentDays: 5340
  },
  {
    id: '5',
    name: 'Prairie View',
    occupancy: 89.3,
    census: 134,
    capacity: 150,
    revenue: 245000,
    avgDailyRate: 175,
    avgLengthOfStay: 22,
    retentionRate: 96,
    residentDays: 4020
  },
  {
    id: '6',
    name: 'Meadowbrook',
    occupancy: 87.9,
    census: 167,
    capacity: 190,
    revenue: 312000,
    avgDailyRate: 168,
    avgLengthOfStay: 19,
    retentionRate: 93,
    residentDays: 5010
  }
];

export function AverageDailyCensusDetail() {
  return (
    <div className="space-y-6 p-6">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      {/* Primary Metric Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Average Daily Census
                <Badge variant="secondary" className="text-sm font-normal">9,847.0</Badge>
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                <span>+287.0 units vs last 30 days</span>
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
          title="Total Licensed Units"
          value="11,165"
          change={{
            value: "+45 units",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Across 127 communities"
          calculation="Sum of all licensed/certified units across the portfolio, including independent living, assisted living, memory care, and skilled nursing beds."
        />
        
        <KPICard
          title="Occupied Units"
          value="9,847.0"
          change={{
            value: "+287.0 units",
            type: "positive",
            period: "vs last 30 days"
          }}
          subtitle="88.2% occupancy rate"
          calculation="Current count of occupied units across all care levels. Includes temporary absences but excludes units held for maintenance or renovation."
        />
        
        <KPICard
          title="MoM Census Change"
          value="+287.0"
          change={{
            value: "+127 vs forecast",
            type: "positive",
            period: "vs projection"
          }}
          subtitle="2.9% growth rate"
          calculation="Month-over-month change in average daily census. Calculated as (current month ADC - previous month ADC) with net move-ins and move-outs factored."
        />
        
        <KPICard
          title="Target Variance"
          value="-353.0"
          change={{
            value: "Improved +91",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="96.5% of target"
          calculation="Variance from budgeted census targets. Calculated as (actual ADC - target ADC) with variance trending and forecast accuracy metrics."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regional & Community Performance</CardTitle>
              <CardDescription>Detailed census breakdown by region and community</CardDescription>
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
                <TableHead>Current Census</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupancy %</TableHead>
                <TableHead>30-Day Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communityData.map((community, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{community.region}</TableCell>
                  <TableCell>{community.community}</TableCell>
                  <TableCell>{community.census}</TableCell>
                  <TableCell>{community.capacity}</TableCell>
                  <TableCell>{community.occupancy}</TableCell>
                  <TableCell className={community.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {community.change}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      community.status === 'Excellent' ? 'default' :
                      community.status === 'Good' ? 'secondary' :
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
            data={normalizedCommunityData}
            title="Average Daily Census - Community Comparison"
          />
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="occupancy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="occupancy">Occupancy Rate</TabsTrigger>
          <TabsTrigger value="move-ins">Net Move-Ins</TabsTrigger>
          <TabsTrigger value="los">Length of Stay</TabsTrigger>
          <TabsTrigger value="payor">Payor Mix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="occupancy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Census Trend vs Target"
              description="6-month census performance against targets"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
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
                  <Line type="monotone" dataKey="census" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer
              title="Occupancy by Care Level"
              description="Distribution across care types"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="move-ins">
          <ChartContainer
            title="Net Move-Ins Trend"
            description="Monthly move-ins vs move-outs"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="variance" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="los">
          <ChartContainer
            title="Average Length of Stay"
            description="LOS trends across care levels"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="census" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="payor">
          <ChartContainer
            title="Payor Mix Breakdown"
            description="Census distribution by payment source"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={payorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="private" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="insurance" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="medicaid" stackId="a" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}