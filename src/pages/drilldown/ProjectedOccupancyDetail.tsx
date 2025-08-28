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
  Home, 
  Users, 
  Clock, 
  CheckCircle, 
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

const topMetrics = [
  {
    title: "Unit Readiness",
    subtitle: "Available Units",
    value: "94%",
    change: { value: "+3%", type: "positive" as const },
    target: "> 90%"
  },
  {
    title: "Discharge Pipeline",
    value: "23",
    change: { value: "+5", type: "neutral" as const },
    target: "Monitor"
  },
  {
    title: "Move-in Plan Gaps",
    value: "8",
    change: { value: "-2", type: "positive" as const },
    target: "< 10"
  },
  {
    title: "Room Prep Status",
    subtitle: "On Schedule",
    value: "87%",
    change: { value: "+4%", type: "positive" as const },
    target: "> 85%"
  }
];

const occupancyForecast = [
  { date: '2024-01-15', projected: 89.2, moveIns: 12, discharges: 8, readiness: 94 },
  { date: '2024-01-16', projected: 89.8, moveIns: 14, discharges: 9, readiness: 95 },
  { date: '2024-01-17', projected: 90.2, moveIns: 11, discharges: 7, readiness: 93 },
  { date: '2024-01-18', projected: 90.8, moveIns: 13, discharges: 8, readiness: 96 },
  { date: '2024-01-19', projected: 91.1, moveIns: 10, discharges: 7, readiness: 94 },
  { date: '2024-01-20', projected: 91.5, moveIns: 12, discharges: 8, readiness: 95 },
  { date: '2024-01-21', projected: 91.8, moveIns: 9, discharges: 6, readiness: 97 }
];

const moveInPlan = [
  { resident: "Sarah Williams", moveInDate: "2024-01-16", careLevel: "AL", roomReady: "Yes", orientation: "Scheduled", status: "On Track" },
  { resident: "Michael Johnson", moveInDate: "2024-01-17", careLevel: "MC", roomReady: "Yes", orientation: "Completed", status: "Ready" },
  { resident: "Patricia Davis", moveInDate: "2024-01-18", careLevel: "AL", roomReady: "Pending", orientation: "Not Scheduled", status: "Delayed" },
  { resident: "Robert Brown", moveInDate: "2024-01-19", careLevel: "SNF", roomReady: "Yes", orientation: "Scheduled", status: "On Track" },
  { resident: "Linda Wilson", moveInDate: "2024-01-20", careLevel: "IL", roomReady: "Yes", orientation: "Completed", status: "Ready" }
];

const readinessTimeline = [
  { community: "Sunrise Manor", unitsReady: 18, inProgress: 3, needsWork: 1, avgPrepTime: 2.5 },
  { community: "Golden Valley", unitsReady: 15, inProgress: 2, needsWork: 2, avgPrepTime: 3.1 },
  { community: "Maple Ridge", unitsReady: 22, inProgress: 1, needsWork: 0, avgPrepTime: 2.2 },
  { community: "Oak Haven", unitsReady: 12, inProgress: 4, needsWork: 3, avgPrepTime: 3.8 },
  { community: "Pine Grove", unitsReady: 16, inProgress: 2, needsWork: 1, avgPrepTime: 2.8 }
];

const accuracyData = [
  { metric: "Move-in Timing", forecast: 89, actual: 92, variance: 3, accuracy: 96.7 },
  { metric: "Discharge Timing", forecast: 87, actual: 84, variance: -3, accuracy: 96.5 },
  { metric: "Unit Preparation", forecast: 94, actual: 91, variance: -3, accuracy: 96.8 },
  { metric: "Overall Occupancy", forecast: 90.5, actual: 91.2, variance: 0.7, accuracy: 99.2 }
];

const occupancyRollup = [
  { period: "Week 1", projected: 89.2, actual: 88.9, variance: -0.3, confidence: 94 },
  { period: "Week 2", projected: 90.5, actual: 90.8, variance: 0.3, confidence: 92 },
  { period: "Week 3", projected: 91.2, actual: null, variance: null, confidence: 89 },
  { period: "Week 4", projected: 91.8, actual: null, variance: null, confidence: 87 }
];

export default function ProjectedOccupancyDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("forecast-accuracy");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Forecast & Risk", href: "/#forecast-risk" },
    { label: "Projected Occupancy" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "text-green-600";
      case "On Track": return "text-blue-600";
      case "Delayed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getReadinessColor = (ready: string) => {
    switch (ready) {
      case "Yes": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "No": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
                  <div className="p-2 rounded-lg bg-green-100">
                    <Home className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Projected Occupancy</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Current Projection: 91.8%
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">Improving</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Last updated: 4 hours ago
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
                  Occupancy Filters
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Projection
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

          {/* Occupancy Projection Chart */}
          <div className="mb-8">
            <ChartContainer title="Occupancy Projection with Move-ins/Discharges" description="7-day projection with unit readiness">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={occupancyForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip />
                  <Bar yAxisId="right" dataKey="moveIns" fill="#10b981" name="Move-ins" />
                  <Bar yAxisId="right" dataKey="discharges" fill="#ef4444" name="Discharges" />
                  <Line yAxisId="left" type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={3} name="Projected Occupancy %" />
                  <Line yAxisId="left" type="monotone" dataKey="readiness" stroke="#f59e0b" strokeWidth={2} name="Unit Readiness %" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Move-in Plan Table */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Move-in Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident Name</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Care Level</TableHead>
                    <TableHead>Room Ready</TableHead>
                    <TableHead>Orientation</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moveInPlan.map((moveIn, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{moveIn.resident}</TableCell>
                      <TableCell>{moveIn.moveInDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          moveIn.careLevel === "SNF" ? "text-red-600" :
                          moveIn.careLevel === "MC" ? "text-orange-600" :
                          moveIn.careLevel === "AL" ? "text-blue-600" :
                          "text-green-600"
                        }>
                          {moveIn.careLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getReadinessColor(moveIn.roomReady)}>
                          {moveIn.roomReady}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{moveIn.orientation}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(moveIn.status)}>
                          {moveIn.status}
                        </Badge>
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
              <TabsTrigger value="move-in-sync">Move-In Plan Sync</TabsTrigger>
              <TabsTrigger value="readiness-timeline">Readiness Timeline</TabsTrigger>
              <TabsTrigger value="occupancy-rollup">Occupancy Rollup</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast-accuracy" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Projection Accuracy Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Forecast</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Accuracy %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accuracyData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{data.metric}</TableCell>
                          <TableCell>{data.forecast}%</TableCell>
                          <TableCell>{data.actual}%</TableCell>
                          <TableCell className={data.variance > 0 ? "text-green-600" : data.variance < 0 ? "text-red-600" : "text-yellow-600"}>
                            {data.variance > 0 ? '+' : ''}{data.variance}%
                          </TableCell>
                          <TableCell className={data.accuracy > 96 ? "text-green-600" : "text-yellow-600"}>
                            {data.accuracy}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="move-in-sync" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Move-In Synchronization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Move-in Timeline</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={occupancyForecast}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip />
                          <Bar dataKey="moveIns" fill="#10b981" name="Scheduled Move-ins" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Synchronization Status</h4>
                      {moveInPlan.map((moveIn, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{moveIn.resident}</span>
                            <Badge className={getReadinessColor(moveIn.roomReady)}>
                              {moveIn.roomReady}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground mb-2">
                            <span>Move-in: {moveIn.moveInDate}</span>
                            <span>{moveIn.careLevel}</span>
                          </div>
                          <div className="text-sm">
                            Orientation: {moveIn.orientation}
                          </div>
                          <Progress 
                            value={moveIn.status === "Ready" ? 100 : moveIn.status === "On Track" ? 75 : 25} 
                            className="mt-2 h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="readiness-timeline" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Unit Readiness by Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Community</TableHead>
                        <TableHead>Units Ready</TableHead>
                        <TableHead>In Progress</TableHead>
                        <TableHead>Needs Work</TableHead>
                        <TableHead>Avg Prep Time (days)</TableHead>
                        <TableHead>Readiness %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {readinessTimeline.map((timeline, index) => {
                        const total = timeline.unitsReady + timeline.inProgress + timeline.needsWork;
                        const readiness = ((timeline.unitsReady / total) * 100).toFixed(1);
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{timeline.community}</TableCell>
                            <TableCell className="text-green-600">{timeline.unitsReady}</TableCell>
                            <TableCell className="text-yellow-600">{timeline.inProgress}</TableCell>
                            <TableCell className="text-red-600">{timeline.needsWork}</TableCell>
                            <TableCell className={timeline.avgPrepTime > 3 ? "text-red-600" : "text-green-600"}>
                              {timeline.avgPrepTime}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={parseFloat(readiness) < 80 ? "text-red-600" : "text-green-600"}>
                                  {readiness}%
                                </span>
                                <Progress value={parseFloat(readiness)} className="w-16 h-2" />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="occupancy-rollup" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Weekly Occupancy Rollup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Projected vs Actual</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={occupancyRollup}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <ChartTooltip />
                          <Line type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={3} name="Projected %" />
                          <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual %" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead>Projected</TableHead>
                            <TableHead>Actual</TableHead>
                            <TableHead>Confidence</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {occupancyRollup.map((rollup, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{rollup.period}</TableCell>
                              <TableCell>{rollup.projected}%</TableCell>
                              <TableCell>
                                {rollup.actual ? `${rollup.actual}%` : 'Pending'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className={rollup.confidence < 90 ? "text-red-600" : "text-green-600"}>
                                    {rollup.confidence}%
                                  </span>
                                  <Progress value={rollup.confidence} className="w-16 h-2" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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