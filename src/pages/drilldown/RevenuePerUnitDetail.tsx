import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NormalizedComparisonToggle } from "@/components/trust-layer";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Executive Overview", href: "/dashboard" },
  { label: "Revenue per Unit", href: "/metric/revenue-per-unit" }
];

const revenueTrendData = [
  { month: 'Jul', revenue: 5715, target: 5800, unitMix: 4.2, occupancy: 89.2 },
  { month: 'Aug', revenue: 5742, target: 5800, unitMix: 4.1, occupancy: 90.1 },
  { month: 'Sep', revenue: 5798, target: 5800, unitMix: 4.3, occupancy: 91.8 },
  { month: 'Oct', revenue: 5823, target: 5800, unitMix: 4.4, occupancy: 90.3 },
  { month: 'Nov', revenue: 5856, target: 5800, unitMix: 4.5, occupancy: 91.4 },
  { month: 'Dec', revenue: 5842, target: 5800, unitMix: 4.4, occupancy: 91.4 },
];

const payorMixData = [
  { payor: 'Private Pay', revenue: 3510, percentage: 60.1, color: 'hsl(var(--chart-1))' },
  { payor: 'Long-term Insurance', revenue: 1401, percentage: 24.0, color: 'hsl(var(--chart-2))' },
  { payor: 'Medicaid', revenue: 643, percentage: 11.0, color: 'hsl(var(--chart-3))' },
  { payor: 'Medicare/Rehab', revenue: 288, percentage: 4.9, color: 'hsl(var(--chart-4))' }
];

const unitMixData = [
  { type: 'Studio', avgRevenue: 4200, count: 1847, totalRevenue: 7757400 },
  { type: '1 Bedroom', avgRevenue: 5400, count: 3892, totalRevenue: 21016800 },
  { type: '2 Bedroom', avgRevenue: 6800, count: 2108, totalRevenue: 14334400 },
  { type: 'Memory Care', avgRevenue: 7200, count: 1998, totalRevenue: 14385600 },
];

const arData = [
  { month: 'Jul', current: 234000, aging30: 89000, aging60: 45000, aging90: 23000 },
  { month: 'Aug', current: 241000, aging30: 92000, aging60: 48000, aging90: 25000 },
  { month: 'Sep', current: 228000, aging30: 86000, aging60: 42000, aging90: 21000 },
  { month: 'Oct', current: 245000, aging30: 94000, aging60: 49000, aging90: 27000 },
  { month: 'Nov', current: 252000, aging30: 98000, aging60: 52000, aging90: 29000 },
  { month: 'Dec', current: 238000, aging30: 91000, aging60: 46000, aging90: 24000 },
];

const communityRevenueData = [
  { region: 'Southeast', community: 'Sunrise Manor', units: 156, revenue: 6200, target: 5900, variance: '+$300', margin: '18.4%', status: 'Excellent' },
  { region: 'Texas', community: 'Heritage Hills', units: 203, revenue: 5950, target: 5800, variance: '+$150', margin: '16.2%', status: 'Good' },
  { region: 'Midwest', community: 'Prairie View', units: 134, revenue: 5650, target: 5800, variance: '-$150', margin: '14.8%', status: 'Watch' },
  { region: 'Southeast', community: 'Golden Years', units: 142, revenue: 5420, target: 5800, variance: '-$380', margin: '12.3%', status: 'Critical' },
];

const normalizedRevenueData = [
  {
    id: '1',
    name: 'Sunrise Manor',
    occupancy: 86.7,
    census: 156,
    capacity: 180,
    revenue: 967200,
    avgDailyRate: 186,
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
    revenue: 1207850,
    avgDailyRate: 179,
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
    revenue: 757100,
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
    revenue: 769640,
    avgDailyRate: 163,
    avgLengthOfStay: 17,
    retentionRate: 88,
    residentDays: 4260
  }
];

export function RevenuePerUnitDetail() {
  return (
    <div className="space-y-6 p-6">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      {/* Primary Metric Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Revenue per Occupied Unit
                <Badge variant="default" className="text-sm font-normal">$5,842</Badge>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                <span className="text-green-600">+$127 vs monthly average</span>
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
          title="Monthly Revenue"
          value="$57.5M"
          change={{
            value: "+$2.3M",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Portfolio total"
          calculation="Total monthly revenue across all communities and care levels, including base rent, ancillary services, and care fees."
          whyMatters="Total revenue growth indicates overall business health and expansion success. It's the foundation for all profitability and operational investment decisions."
        />
        
        <KPICard
          title="Unit Mix Impact"
          value="$4.4K"
          change={{
            value: "Weighted average",
            type: "neutral",
            period: "care premium"
          }}
          subtitle="Premium over base"
          calculation="Revenue impact from unit type and care level mix, showing premium pricing for larger units and higher care levels."
          whyMatters="Unit mix optimization drives higher revenue per unit by balancing high-value units with market demand, directly impacting community profitability."
        />
        
        <KPICard
          title="Occupancy Impact"
          value="91.4%"
          change={{
            value: "+1.2%",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Revenue efficiency"
          calculation="Current occupancy rate impact on per-unit revenue efficiency. Higher occupancy spreads fixed costs across more units."
        />
        
        <KPICard
          title="Discounts/Adjustments"
          value="$287"
          change={{
            value: "-$42",
            type: "positive",
            period: "per unit reduction"
          }}
          subtitle="3.9% of gross revenue"
          calculation="Average discount and adjustment per occupied unit, including move-in specials, family discounts, and rate adjustments."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Performance by Community</CardTitle>
              <CardDescription>Per-unit revenue analysis across portfolio</CardDescription>
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
                <TableHead>Occupied Units</TableHead>
                <TableHead>Revenue/Unit</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Margin %</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communityRevenueData.map((community, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{community.region}</TableCell>
                  <TableCell>{community.community}</TableCell>
                  <TableCell>{community.units}</TableCell>
                  <TableCell className="font-medium">${community.revenue.toLocaleString()}</TableCell>
                  <TableCell>${community.target.toLocaleString()}</TableCell>
                  <TableCell className={community.variance.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {community.variance}
                  </TableCell>
                  <TableCell>{community.margin}</TableCell>
                  <TableCell>
                    <Badge variant={
                      community.status === 'Excellent' ? 'default' :
                      community.status === 'Good' ? 'secondary' :
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
            data={normalizedRevenueData}
            title="Revenue Per Unit - Community Comparison"
          />
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="payor" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payor">Revenue by Payor</TabsTrigger>
          <TabsTrigger value="ar">Accounts Receivable</TabsTrigger>
          <TabsTrigger value="margin">Net Margin</TabsTrigger>
          <TabsTrigger value="contracts">Payer Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Revenue by Payor Mix"
              description="Distribution of revenue across payment sources"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={payorMixData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="revenue"
                    label={({ payor, percentage }) => `${payor}: ${percentage}%`}
                  >
                    {payorMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Payor Analysis</CardTitle>
                <CardDescription>Revenue breakdown by payment source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payorMixData.map((payor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payor.color }} />
                        <span className="text-sm">{payor.payor}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${payor.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{payor.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ar">
          <ChartContainer
            title="Accounts Receivable Aging"
            description="Outstanding receivables by aging period"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={arData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Amount']} />
                <Bar dataKey="current" stackId="a" fill="hsl(var(--chart-1))" name="Current" />
                <Bar dataKey="aging30" stackId="a" fill="hsl(var(--chart-2))" name="30-60 Days" />
                <Bar dataKey="aging60" stackId="a" fill="hsl(var(--chart-3))" name="60-90 Days" />
                <Bar dataKey="aging90" stackId="a" fill="hsl(var(--chart-4))" name="90+ Days" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="margin">
          <ChartContainer
            title="Revenue vs Target Performance"
            description="Monthly revenue performance against targets"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
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
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Actual Revenue" />
                <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Unit Type Revenue Analysis</CardTitle>
              <CardDescription>Revenue performance by unit type and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead>Avg Revenue</TableHead>
                    <TableHead>Unit Count</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unitMixData.map((unit, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{unit.type}</TableCell>
                      <TableCell>${unit.avgRevenue.toLocaleString()}</TableCell>
                      <TableCell>{unit.count}</TableCell>
                      <TableCell>${unit.totalRevenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {((unit.totalRevenue / 57500000) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}