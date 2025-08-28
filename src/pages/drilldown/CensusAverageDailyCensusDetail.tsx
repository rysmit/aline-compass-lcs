import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, Users, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Census & Occupancy", href: "/dashboard" },
  { label: "Average Daily Census", href: "/metric/census-daily-census" }
];

const censusTrendData = [
  { month: 'Jul', census: 9847, variance: 287, payor: { private: 4200, insurance: 3100, medicaid: 2547 }, occupancy: 89.2 },
  { month: 'Aug', census: 9756, variance: 198, payor: { private: 4180, insurance: 3076, medicaid: 2500 }, occupancy: 90.1 },
  { month: 'Sep', census: 9892, variance: 334, payor: { private: 4210, insurance: 3182, medicaid: 2500 }, occupancy: 91.8 },
  { month: 'Oct', census: 9945, variance: 387, payor: { private: 4245, insurance: 3200, medicaid: 2500 }, occupancy: 90.3 },
  { month: 'Nov', census: 10103, variance: 545, payor: { private: 4303, insurance: 3300, medicaid: 2500 }, occupancy: 91.4 },
  { month: 'Dec', census: 9847, variance: 289, payor: { private: 4200, insurance: 3147, medicaid: 2500 }, occupancy: 88.2 },
];

const payorMixData = [
  { payor: 'Private Pay', count: 4200, percentage: 42.7, revenue: 24570000, avgRate: 5850 },
  { payor: 'Long-term Insurance', count: 3147, percentage: 32.0, revenue: 15423000, avgRate: 4900 },
  { payor: 'Medicaid', count: 2500, percentage: 25.4, revenue: 8750000, avgRate: 3500 },
];

const adlMixData = [
  { level: 'Independent (0-1 ADL)', count: 2847, percentage: 28.9, avgCost: 4200 },
  { level: 'Light Assist (2-3 ADL)', count: 3456, percentage: 35.1, avgCost: 5400 },
  { level: 'Moderate (4-5 ADL)', count: 2234, percentage: 22.7, avgCost: 6800 },
  { level: 'Heavy Assist (6+ ADL)', count: 1310, percentage: 13.3, avgCost: 8200 },
];

const weekendVarianceData = [
  { day: 'Monday', census: 9875, variance: 28 },
  { day: 'Tuesday', census: 9847, variance: 0 },
  { day: 'Wednesday', census: 9851, variance: 4 },
  { day: 'Thursday', census: 9842, variance: -5 },
  { day: 'Friday', census: 9839, variance: -8 },
  { day: 'Saturday', census: 9834, variance: -13 },
  { day: 'Sunday', census: 9831, variance: -16 },
];

const censusInfluenceData = [
  { factor: 'Seasonal Admissions', impact: 'High', correlation: 0.78, description: 'Winter months show 15% increase' },
  { factor: 'Marketing Campaigns', impact: 'Medium', correlation: 0.62, description: 'Direct mail drives 12% lift' },
  { factor: 'Referral Network', impact: 'High', correlation: 0.84, description: 'Hospital partnerships key driver' },
  { factor: 'Economic Conditions', impact: 'Medium', correlation: 0.45, description: 'Local unemployment affects private pay' },
  { factor: 'Competitive Activity', impact: 'Low', correlation: 0.23, description: 'New facilities minimal impact' },
];

const communityCensusData = [
  { region: 'Southeast', community: 'Sunrise Manor', census: 156, capacity: 180, adlMix: { light: 67, moderate: 52, heavy: 37 }, payorMix: { private: 89, insurance: 45, medicaid: 22 } },
  { region: 'Texas', community: 'Heritage Hills', census: 203, capacity: 240, adlMix: { light: 98, moderate: 67, heavy: 38 }, payorMix: { private: 123, insurance: 56, medicaid: 24 } },
  { region: 'Midwest', community: 'Prairie View', census: 134, capacity: 150, adlMix: { light: 58, moderate: 45, heavy: 31 }, payorMix: { private: 78, insurance: 38, medicaid: 18 } },
  { region: 'Southeast', community: 'Golden Years', census: 142, capacity: 165, adlMix: { light: 62, moderate: 48, heavy: 32 }, payorMix: { private: 84, insurance: 41, medicaid: 17 } },
];

export function CensusAverageDailyCensusDetail() {
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
                  Average Daily Census
                  <Badge variant="default" className="text-sm font-normal">9,847</Badge>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="text-green-600">+287 units vs last 30 days (+3.0%)</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calculation: Sum of occupied units across portfolio ÷ days in period<br/>
                      Source: Property Management Systems<br/>
                      Updated daily at 6:00 AM</p>
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
            title="Census Variance"
            value="+289"
            change={{
              value: "+102 vs forecast",
              type: "positive",
              period: "vs projection"
            }}
            subtitle="Above expected"
            calculation="Difference between actual and forecasted daily census. Positive variance indicates outperformance of predictions."
          />
          
          <KPICard
            title="Occupancy %"
            value="88.2%"
            change={{
              value: "-1.8%",
              type: "negative",
              period: "vs last month"
            }}
            subtitle="Portfolio wide"
            calculation="Current occupancy rate across all communities. Calculated as occupied units divided by total available units."
            metricId="occupancy-rate"
            hasAlternateCalculations={true}
          />
          
          <KPICard
            title="Census by Payor"
            value="42.7%"
            change={{
              value: "Private pay",
              type: "neutral",
              period: "largest segment"
            }}
            subtitle="Payment mix"
            calculation="Distribution of census by primary payment source. Private pay residents provide highest revenue per unit."
          />
          
          <KPICard
            title="ADL Mix"
            value="35.1%"
            change={{
              value: "Light assist",
              type: "neutral",
              period: "most common"
            }}
            subtitle="Care level distribution"
            calculation="Breakdown of residents by Activities of Daily Living support needs. Impacts staffing and revenue patterns."
          />
        </div>

        {/* Detailed Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Community Census Breakdown</CardTitle>
                <CardDescription>Detailed census analysis by community with payor and ADL mix</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">30 Days</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
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
                  <TableHead>ADL Distribution</TableHead>
                  <TableHead>Primary Payor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityCensusData.map((community, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{community.region}</TableCell>
                    <TableCell>{community.community}</TableCell>
                    <TableCell className="font-medium">{community.census}</TableCell>
                    <TableCell>{community.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={((community.census / community.capacity) * 100) >= 88 ? 'default' : 'secondary'}>
                        {(((community.census / community.capacity) * 100)).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        L:{community.adlMix.light} M:{community.adlMix.moderate} H:{community.adlMix.heavy}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        Pvt:{community.payorMix.private} Ins:{community.payorMix.insurance} Med:{community.payorMix.medicaid}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="payor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payor">Payor Breakdown</TabsTrigger>
            <TabsTrigger value="los">LOS Influence</TabsTrigger>
            <TabsTrigger value="variance">Variance Trends</TabsTrigger>
            <TabsTrigger value="weekend">Weekend vs Weekday</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payor">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Payor Mix Distribution"
                description="Census breakdown by payment source"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={payorMixData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ payor, percentage }) => `${payor}: ${percentage}%`}
                    >
                      {payorMixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} residents`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Payor Analysis</CardTitle>
                  <CardDescription>Revenue and rate analysis by payment source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payorMixData.map((payor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{payor.payor}</span>
                          <Badge variant="outline" className="text-xs">
                            {payor.count} residents
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">${payor.avgRate.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{payor.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="los">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="ADL Mix Impact on Census"
                description="Resident distribution by care assistance level"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adlMixData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="level" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Residents" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Census Influence Factors</CardTitle>
                  <CardDescription>Key drivers affecting daily census levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {censusInfluenceData.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{factor.factor}</span>
                          <Badge variant={factor.impact === 'High' ? 'default' : factor.impact === 'Medium' ? 'secondary' : 'outline'} className="text-xs">
                            {factor.impact}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{factor.correlation}</div>
                          <div className="text-xs text-muted-foreground">correlation</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="variance">
            <ChartContainer
              title="Census Variance Trend"
              description="Monthly variance from forecasted census levels"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={censusTrendData}>
                  <defs>
                    <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="variance"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#varianceGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="weekend">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Daily Census Variation"
                description="Day-of-week census patterns"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weekendVarianceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="census" fill="hsl(var(--chart-1))" name="Daily Census" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer
                title="Census Trend & Occupancy"
                description="6-month census trend with occupancy correlation"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={censusTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="census" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Census" />
                    <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Occupancy %" />
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