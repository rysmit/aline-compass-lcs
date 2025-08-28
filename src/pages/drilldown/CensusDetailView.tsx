import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertTriangle, TrendingDown, ExternalLink, Users, Calendar, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const regionsData = [
  {
    region: "Northeast",
    communities: [
      { name: "Sunny Meadows", adc30d: 187, capacity: 210, occupancy: 89.0, varianceVsTarget: 2.1, trend: "up", alert: false },
      { name: "Harbor View", adc30d: 142, capacity: 165, occupancy: 86.1, varianceVsTarget: -1.8, trend: "down", alert: false },
      { name: "Pine Ridge", adc30d: 98, capacity: 120, occupancy: 81.7, varianceVsTarget: -6.3, trend: "down", alert: true }
    ]
  },
  {
    region: "Southeast", 
    communities: [
      { name: "Ocean Breeze", adc30d: 156, capacity: 175, occupancy: 89.1, varianceVsTarget: 3.2, trend: "up", alert: false },
      { name: "Magnolia Gardens", adc30d: 203, capacity: 230, occupancy: 88.3, varianceVsTarget: 1.4, trend: "stable", alert: false },
      { name: "Riverside Manor", adc30d: 89, capacity: 110, occupancy: 80.9, varianceVsTarget: -4.1, trend: "down", alert: true }
    ]
  },
  {
    region: "Midwest",
    communities: [
      { name: "Prairie Hills", adc30d: 167, capacity: 185, occupancy: 90.3, varianceVsTarget: 4.1, trend: "up", alert: false },
      { name: "Lakeside Commons", adc30d: 134, capacity: 150, occupancy: 89.3, varianceVsTarget: 2.8, trend: "up", alert: false }
    ]
  }
];

const timeSeriesData = [
  { period: "Week 1", Northeast: 2840, Southeast: 2680, Midwest: 1820 },
  { period: "Week 2", Northeast: 2865, Southeast: 2710, Midwest: 1835 },
  { period: "Week 3", Northeast: 2891, Southeast: 2695, Midwest: 1798 },
  { period: "Week 4", Northeast: 2912, Southeast: 2735, Midwest: 1847 }
];

const varianceData = [
  { community: "Pine Ridge", variance: -6.3, region: "Northeast" },
  { community: "Riverside Manor", variance: -4.1, region: "Southeast" },
  { community: "Harbor View", variance: -1.8, region: "Northeast" },
  { community: "Magnolia Gardens", variance: 1.4, region: "Southeast" },
  { community: "Sunny Meadows", variance: 2.1, region: "Northeast" },
  { community: "Lakeside Commons", variance: 2.8, region: "Midwest" },
  { community: "Ocean Breeze", variance: 3.2, region: "Southeast" },
  { community: "Prairie Hills", variance: 4.1, region: "Midwest" }
];

const alerts = [
  { community: "Pine Ridge", region: "Northeast", issue: "3+ weeks decline", severity: "high" },
  { community: "Riverside Manor", region: "Southeast", issue: "Below threshold", severity: "medium" }
];

export function CensusDetailView() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [sortField, setSortField] = useState<string>("region");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const breadcrumbItems = [
    { label: "Executive Overview", href: "/" },
    { label: "Census Detail View" }
  ];

  const filteredRegions = selectedRegion === "all" 
    ? regionsData 
    : regionsData.filter(r => r.region.toLowerCase() === selectedRegion.toLowerCase());

  // Flatten communities for sorting
  const allCommunities = filteredRegions.flatMap(region => 
    region.communities.map(community => ({ ...community, region: region.region }))
  );

  const sortedCommunities = [...allCommunities].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getTrendIcon = (trend: string) => {
    const baseClasses = "h-4 w-4";
    switch (trend) {
      case "up": return <span className={cn(baseClasses, "text-success")}>↗</span>;
      case "down": return <span className={cn(baseClasses, "text-destructive")}>↘</span>;
      default: return <span className={cn(baseClasses, "text-muted-foreground")}>→</span>;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance >= 2) return "text-success";
    if (variance <= -3) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Average Daily Census Detail</h1>
            <p className="text-muted-foreground mt-1">Portfolio-wide census analysis and trends</p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="northeast">Northeast</SelectItem>
                <SelectItem value="southeast">Southeast</SelectItem>
                <SelectItem value="midwest">Midwest</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCareLevel} onValueChange={setSelectedCareLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Care Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="independent">Independent</SelectItem>
                <SelectItem value="assisted">Assisted Living</SelectItem>
                <SelectItem value="memory">Memory Care</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Census"
            value="9,847"
            change={{
              value: "+287",
              type: "positive",
              period: "vs last 30 days"
            }}
            subtitle="Across 127 communities"
            calculation="Sum of all occupied units across the portfolio for the selected time period."
          />
          
          <KPICard
            title="Portfolio Occupancy"
            value="88.2%"
            change={{
              value: "-1.3%",
              type: "negative", 
              period: "vs last month"
            }}
            subtitle="11,165 total units"
            calculation="Total occupied units divided by total available units across all communities."
          />
          
          <KPICard
            title="Avg RPOU"
            value="$5,842"
            change={{
              value: "+$127",
              type: "positive",
              period: "monthly average"
            }}
            subtitle="Weighted by care level"
            calculation="Total revenue divided by occupied units, weighted by care level mix and adjusted for rate variations."
          />
          
          <KPICard
            title="Churn Rate"
            value="12.3%"
            change={{
              value: "+1.8%",
              type: "negative",
              period: "vs last quarter"
            }}
            subtitle="30-day moving average"
            calculation="Number of move-outs divided by total occupied units over a rolling 30-day period."
          />
        </div>

        {/* Compact Alerts */}
        {alerts.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-sm">Census Alerts ({alerts.length})</span>
            </div>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === "high" ? "destructive" : "secondary"} className="text-xs px-2 py-0">
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{alert.community}</span>
                    <span className="text-muted-foreground">• {alert.region} • {alert.issue}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="ADC Trend by Region"
            description="Weekly average daily census across regions"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="Northeast" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="Southeast" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                <Line type="monotone" dataKey="Midwest" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Variance from Target"
            description="Community performance vs census targets"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={varianceData} 
                layout="horizontal" 
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <YAxis 
                  dataKey="community" 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [`${value}%`, 'Variance from Target']}
                />
                <Bar 
                  dataKey="variance" 
                  name="Variance"
                  fill="hsl(var(--chart-1))"
                >
                  {varianceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.variance >= 0 ? "hsl(var(--chart-5))" : "hsl(var(--chart-3))"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Sortable Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Community Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Community
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('adc30d')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      ADC (30d)
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('capacity')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Capacity
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('occupancy')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Occupancy %
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('varianceVsTarget')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Variance vs Target
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCommunities.map((community, index) => (
                  <TableRow key={`${community.region}-${community.name}`} className={community.alert ? "bg-destructive/5" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {community.alert && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        <div>
                          <div className="font-medium">{community.name}</div>
                          <div className="text-sm text-muted-foreground">{community.region} Region</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{community.adc30d}</TableCell>
                    <TableCell className="text-right">{community.capacity}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={community.occupancy >= 88 ? "default" : "secondary"}>
                        {community.occupancy.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className={cn("text-right font-medium", getVarianceColor(community.varianceVsTarget))}>
                      {community.varianceVsTarget > 0 ? "+" : ""}{community.varianceVsTarget}%
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(community.trend)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Roster
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          CRM
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Contextual Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="font-semibold">Review Declining Sites</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Investigate 2 communities with 3+ weeks of decline
                </p>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  <span className="font-semibold">Sales Performance</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Open CRM to analyze sales pipeline and lead conversion
                </p>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Move-In Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Review resident roster for move-in/move-out patterns
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}