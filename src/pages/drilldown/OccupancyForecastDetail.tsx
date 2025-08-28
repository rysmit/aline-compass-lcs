import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { KPICard } from "@/components/dashboard/KPICard";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  AlertTriangle, 
  Info,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';

const topMetrics = [
  {
    title: "Forecast vs. Actual",
    subtitle: "30-Day Accuracy",
    value: "94.2%",
    change: { value: "+2.1%", type: "positive" as const },
    target: "> 92%"
  },
  {
    title: "Confidence Range",
    value: "±3.5%",
    change: { value: "-0.8%", type: "positive" as const },
    target: "< ±5%"
  },
  {
    title: "Waitlist Pull Rate",
    value: "78%",
    change: { value: "+5.2%", type: "positive" as const },
    target: "> 75%"
  },
  {
    title: "Demand Indicator",
    subtitle: "Lead Growth",
    value: "127",
    change: { value: "+15", type: "positive" as const },
    target: "120+"
  }
];

const forecastData = [
  { date: '2024-01-15', actual: 87.2, forecast: 86.8, upperBound: 89.5, lowerBound: 84.1 },
  { date: '2024-01-16', actual: 86.9, forecast: 87.1, upperBound: 89.8, lowerBound: 84.4 },
  { date: '2024-01-17', actual: 88.1, forecast: 87.4, upperBound: 90.1, lowerBound: 84.7 },
  { date: '2024-01-18', actual: 87.8, forecast: 87.9, upperBound: 90.6, lowerBound: 85.2 },
  { date: '2024-01-19', actual: 89.2, forecast: 88.5, upperBound: 91.2, lowerBound: 85.8 },
  { date: '2024-01-20', actual: null, forecast: 89.1, upperBound: 91.8, lowerBound: 86.4 },
  { date: '2024-01-21', actual: null, forecast: 89.6, upperBound: 92.3, lowerBound: 86.9 }
];

const regionData = [
  { region: "Northeast", forecast: 91.2, actual: 89.8, variance: -1.4, confidence: 95.2, waitlist: 45 },
  { region: "Southeast", forecast: 88.7, actual: 90.1, variance: +1.4, confidence: 92.8, waitlist: 38 },
  { region: "Midwest", forecast: 85.3, actual: 84.9, variance: -0.4, confidence: 97.1, waitlist: 22 },
  { region: "West", forecast: 92.5, actual: 93.2, variance: +0.7, confidence: 89.4, waitlist: 52 },
  { region: "Southwest", forecast: 87.9, actual: 86.5, variance: -1.4, confidence: 94.6, waitlist: 29 }
];

const communityAccuracy = [
  { community: "Sunrise Manor", accuracy: 96.8, variance: 2.1, trend: "improving", leadTime: 28 },
  { community: "Golden Valley", accuracy: 91.4, variance: -4.2, trend: "declining", leadTime: 32 },
  { community: "Maple Ridge", accuracy: 98.2, variance: 1.8, trend: "stable", leadTime: 25 },
  { community: "Oak Haven", accuracy: 89.7, variance: -6.8, trend: "declining", leadTime: 35 },
  { community: "Pine Grove", accuracy: 94.5, variance: 3.2, trend: "improving", leadTime: 30 }
];

const performanceData = [
  { category: "Under-forecasted", communities: 12, avgVariance: -3.8, revenue: 285000, reason: "Higher than expected move-ins" },
  { category: "Over-forecasted", communities: 8, avgVariance: 4.2, revenue: -152000, reason: "Delayed discharges" },
  { category: "Within Range", communities: 25, avgVariance: 1.1, revenue: 45000, reason: "Normal operations" }
];

export default function OccupancyForecastDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("forecast-accuracy");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Forecast & Risk", href: "/#forecast-risk" },
    { label: "30-Day Occupancy Forecast" }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving": return "text-green-600";
      case "declining": return "text-red-600";
      case "stable": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div className="h-6 w-px bg-border" />
                <DrillDownBreadcrumb items={breadcrumbItems} />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">30-Day Occupancy Forecast</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Forecast Period: Next 30 Days
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">High Confidence</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Last updated: 2 hours ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="60d">60 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Forecast
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {topMetrics.map((metric, index) => (
              <KPICard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                subtitle={metric.subtitle || `Target: ${metric.target}`}
                calculation={`${metric.title} target: ${metric.target}`}
              />
            ))}
          </div>

          {/* Forecast Chart */}
          <div className="mb-8">
            <ChartContainer title="Occupancy Forecast vs Actual" description="30-day forecast with confidence intervals">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Area dataKey="upperBound" fill="#3b82f6" fillOpacity={0.1} stroke="none" />
                  <Area dataKey="lowerBound" fill="#ffffff" fillOpacity={1} stroke="none" />
                  <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} name="Forecast" />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Region Performance Table */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Regional Forecast Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Forecast %</TableHead>
                    <TableHead>Actual %</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Confidence %</TableHead>
                    <TableHead>Waitlist</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionData.map((region, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{region.region}</TableCell>
                      <TableCell>{region.forecast}%</TableCell>
                      <TableCell>{region.actual}%</TableCell>
                      <TableCell className={region.variance > 0 ? "text-green-600" : "text-red-600"}>
                        {region.variance > 0 ? '+' : ''}{region.variance}%
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={region.confidence < 90 ? "text-red-600" : ""}>{region.confidence}%</span>
                          <Progress value={region.confidence} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className={region.waitlist > 40 ? "text-green-600" : "text-yellow-600"}>
                        {region.waitlist}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detailed Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="forecast-accuracy">Forecast Accuracy</TabsTrigger>
              <TabsTrigger value="performance">Under/Over Performance</TabsTrigger>
              <TabsTrigger value="region-gaps">Region Gaps</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast-accuracy" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Community Forecast Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Community</TableHead>
                        <TableHead>Accuracy %</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Lead Time (days)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {communityAccuracy.map((community, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{community.community}</TableCell>
                          <TableCell className={community.accuracy < 90 ? "text-red-600" : "text-green-600"}>
                            {community.accuracy}%
                          </TableCell>
                          <TableCell className={community.variance < 0 ? "text-red-600" : "text-green-600"}>
                            {community.variance > 0 ? '+' : ''}{community.variance}%
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTrendColor(community.trend)}>
                              {community.trend}
                            </Badge>
                          </TableCell>
                          <TableCell className={community.leadTime > 32 ? "text-red-600" : ""}>
                            {community.leadTime}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Communities</TableHead>
                        <TableHead>Avg Variance</TableHead>
                        <TableHead>Revenue Impact</TableHead>
                        <TableHead>Primary Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.map((performance, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{performance.category}</TableCell>
                          <TableCell>{performance.communities}</TableCell>
                          <TableCell className={
                            performance.category === "Under-forecasted" ? "text-red-600" :
                            performance.category === "Over-forecasted" ? "text-orange-600" :
                            "text-green-600"
                          }>
                            {performance.avgVariance > 0 ? '+' : ''}{performance.avgVariance}%
                          </TableCell>
                          <TableCell className={performance.revenue < 0 ? "text-red-600" : "text-green-600"}>
                            ${Math.abs(performance.revenue).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{performance.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="region-gaps" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Regional Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Forecast Variance by Region</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={regionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="region" />
                          <YAxis />
                          <ChartTooltip />
                          <Bar dataKey="variance" fill="#3b82f6" name="Variance %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-4">Confidence Levels</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={regionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="region" />
                          <YAxis />
                          <ChartTooltip />
                          <Bar dataKey="confidence" fill="#10b981" name="Confidence %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Forecast Performance Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {regionData.map((region, index) => (
                      <div key={index} className="text-center">
                        <div className={`
                          h-20 w-full rounded-lg flex items-center justify-center text-white font-medium
                          ${region.confidence > 95 ? 'bg-green-500' : 
                            region.confidence > 90 ? 'bg-yellow-500' : 'bg-red-500'}
                        `}>
                          {region.confidence}%
                        </div>
                        <p className="text-sm mt-2 font-medium">{region.region}</p>
                        <p className="text-xs text-muted-foreground">
                          {region.variance > 0 ? '+' : ''}{region.variance}% variance
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>High Confidence (&gt;95%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span>Medium Confidence (90-95%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Low Confidence (&lt;90%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}