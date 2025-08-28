import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Download, Calendar, TrendingDown, DollarSign, Target } from "lucide-react";
import { useState } from "react";

// Sample data for RevPAU analysis
const revpauTrendData = [
  { month: "Dec 2023", revpau: 3680, occupancy: 89.2, aru: 4125 },
  { month: "Mar 2024", revpau: 3745, occupancy: 90.8, aru: 4123 },
  { month: "Jun 2024", revpau: 3890, occupancy: 91.5, aru: 4252 },
  { month: "Sep 2024", revpau: 4025, occupancy: 92.1, aru: 4370 },
  { month: "Dec 2024", revpau: 4125, occupancy: 91.7, aru: 4498 },
];

const regionRevPAUData = [
  { region: "Southeast", revpau: 4285, growth: 15.2, communities: 48, marketRevPAU: 3890 },
  { region: "Northeast", revpau: 4175, growth: 11.8, communities: 35, marketRevPAU: 4020 },
  { region: "West", revpau: 4520, growth: 13.5, communities: 28, marketRevPAU: 4180 },
  { region: "Midwest", revpau: 3890, growth: 9.2, communities: 22, marketRevPAU: 3650 },
];

const careTypeRevPAU = [
  { careType: "Memory Care", revpau: 6850, growth: 18.5, units: 1240, marketPremium: 24.8 },
  { careType: "Assisted Living", revpau: 4680, growth: 12.1, units: 4280, marketPremium: 8.2 },
  { careType: "Independent Living", revpau: 3420, growth: 8.9, units: 5645, marketPremium: 5.1 },
];

export default function REITRevPAUDetail() {
  const [selectedPeriod, setSelectedPeriod] = useState("12m");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "REIT Portfolio", href: "/dashboard" },
    { label: "RevPAU YOY Growth" },
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
                  <DollarSign className="h-6 w-6 text-chart-3" />
                  Revenue per Available Unit (RevPAU) Analysis
                  <Badge variant="secondary" className="text-sm font-normal">$4,125</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-success" />
                    +12.8% year-over-year growth
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>Above market average of $3,985</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="12m">12 Months</SelectItem>
                    <SelectItem value="24m">24 Months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="YOY Growth Rate"
            value="12.8%"
            change={{ value: "+2.3%", type: "positive", period: "vs market avg" }}
            subtitle="Outpacing market"
            calculation="Year-over-year RevPAU growth rate compared to same period last year"
          />
          <KPICard
            title="Market Premium"
            value="+3.5%"
            change={{ value: "+0.8%", type: "positive", period: "above market" }}
            subtitle="Revenue advantage"
            calculation="Portfolio RevPAU premium compared to market average for similar properties"
          />
          <KPICard
            title="Rate Growth Impact"
            value="8.2%"
            change={{ value: "Rate increases", type: "positive", period: "contribution" }}
            subtitle="Pricing power"
            calculation="Portion of RevPAU growth attributable to rate increases vs occupancy"
          />
          <KPICard
            title="Best Performing Region"
            value="$4,520"
            change={{ value: "West Region", type: "positive", period: "leading RevPAU" }}
            subtitle="Top performance"
            calculation="Highest RevPAU achieved by any region in the portfolio"
          />
        </div>

        {/* RevPAU Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="RevPAU Growth Trend"
            description="Year-over-year RevPAU progression and components"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revpauTrendData}>
                <defs>
                  <linearGradient id="revpauGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`$${value}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="revpau"
                  stroke="hsl(var(--chart-3))"
                  fillOpacity={1}
                  fill="url(#revpauGradient)"
                  strokeWidth={3}
                  name="RevPAU"
                />
                <Line type="monotone" dataKey="aru" stroke="hsl(var(--chart-1))" strokeWidth={2} strokeDasharray="5 5" name="ARU" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="RevPAU by Care Type"
            description="Revenue performance across service levels"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={careTypeRevPAU}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="careType" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`$${value}`, 'RevPAU']}
                />
                <Line type="monotone" dataKey="revpau" stroke="hsl(var(--chart-1))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Regional Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>RevPAU Performance by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">RevPAU</TableHead>
                  <TableHead className="text-right">YOY Growth</TableHead>
                  <TableHead className="text-right">Communities</TableHead>
                  <TableHead className="text-right">vs Market</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionRevPAUData.map((region, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{region.region}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${region.revpau.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">+{region.growth}%</span>
                    </TableCell>
                    <TableCell className="text-right">{region.communities}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        +${(region.revpau - region.marketRevPAU).toLocaleString()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Care Type Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>RevPAU Analysis by Care Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Care Type</TableHead>
                  <TableHead className="text-right">RevPAU</TableHead>
                  <TableHead className="text-right">YOY Growth</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Market Premium</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careTypeRevPAU.map((care, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{care.careType}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${care.revpau.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">+{care.growth}%</span>
                    </TableCell>
                    <TableCell className="text-right">{care.units.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={care.marketPremium > 15 ? "outline" : "secondary"}>
                        +{care.marketPremium}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Strategic Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Strategic Insights & Revenue Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Revenue Growth Drivers</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Memory Care showing exceptional 18.5% RevPAU growth, driven by premium pricing and high demand. 
                  West region leading with $4,520 RevPAU, 13.5% above market rates.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Market Positioning</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Portfolio commanding 3.5% premium to market, indicating strong brand positioning and service quality. 
                  Rate increases contributing 8.2% to growth demonstrates pricing power.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}