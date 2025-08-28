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
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  AlertTriangle, 
  Info 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const topMetrics = [
  {
    title: "Total Staff Hours Delivered",
    subtitle: "This Week",
    value: "2,847",
    change: { value: "+142", type: "positive" as const },
    target: "2,800+"
  },
  {
    title: "Avg. Hours per Resident",
    value: "3.2",
    change: { value: "+0.3", type: "positive" as const },
    target: "3.0-3.5"
  },
  {
    title: "Est. Labor Cost per Resident",
    value: "$89.50",
    change: { value: "+$4.20", type: "negative" as const },
    target: "< $85"
  },
  {
    title: "Change in Risk Score",
    subtitle: "Past 14 days",
    value: "-2.8%",
    change: { value: "-1.2%", type: "positive" as const },
    target: "Decreasing"
  }
];

const communityData = [
  { community: "Sunrise Manor", totalHours: 647, avgHoursPerResident: 3.1, laborCost: 86.50, riskChange: -3.2, efficiency: 95.2, status: "Good" },
  { community: "Golden Valley", totalHours: 589, avgHoursPerResident: 3.4, laborCost: 92.80, riskChange: -1.8, efficiency: 88.7, status: "Attention" },
  { community: "Maple Ridge", totalHours: 712, avgHoursPerResident: 2.9, laborCost: 82.10, riskChange: -4.1, efficiency: 98.1, status: "Excellent" },
  { community: "Oak Haven", totalHours: 534, avgHoursPerResident: 3.7, laborCost: 98.20, riskChange: -0.9, efficiency: 82.5, status: "Poor" },
  { community: "Pine Grove", totalHours: 365, avgHoursPerResident: 3.3, laborCost: 87.90, riskChange: -2.5, efficiency: 91.8, status: "Good" }
];

const hourlyDistributionData = [
  { hour: "06:00", direct: 45, indirect: 15, admin: 8 },
  { hour: "08:00", direct: 68, indirect: 22, admin: 12 },
  { hour: "10:00", direct: 72, indirect: 18, admin: 15 },
  { hour: "12:00", direct: 85, indirect: 25, admin: 18 },
  { hour: "14:00", direct: 78, indirect: 20, admin: 16 },
  { hour: "16:00", direct: 62, indirect: 18, admin: 14 },
  { hour: "18:00", direct: 58, indirect: 16, admin: 11 },
  { hour: "20:00", direct: 42, indirect: 14, admin: 9 },
  { hour: "22:00", direct: 35, indirect: 12, admin: 7 }
];

const staffProductivityData = [
  { staff: "Johnson, Lisa (RN)", hoursLogged: 38.5, directCareHours: 32.1, efficiency: 83.4, costPerHour: 32.50, residentLoad: 12, productivity: "High" },
  { staff: "Davis, Michael (LPN)", hoursLogged: 40.0, directCareHours: 34.8, efficiency: 87.0, costPerHour: 28.75, residentLoad: 14, productivity: "High" },
  { staff: "Wilson, Sarah (CNA)", hoursLogged: 36.2, directCareHours: 30.5, efficiency: 84.3, costPerHour: 22.00, residentLoad: 16, productivity: "Good" },
  { staff: "Brown, Jennifer (CNA)", hoursLogged: 35.8, directCareHours: 28.9, efficiency: 80.7, costPerHour: 22.00, residentLoad: 15, productivity: "Good" },
  { staff: "Taylor, Robert (LPN)", hoursLogged: 39.1, directCareHours: 31.2, efficiency: 79.8, costPerHour: 28.75, residentLoad: 13, productivity: "Average" }
];

const costAnalysisData = [
  { category: "Direct Care", budgeted: 1850.00, actual: 1920.50, variance: 70.50, percentage: 3.8 },
  { category: "Indirect Care", budgeted: 420.00, actual: 445.20, variance: 25.20, percentage: 6.0 },
  { category: "Administrative", budgeted: 280.00, actual: 295.80, variance: 15.80, percentage: 5.6 },
  { category: "Training", budgeted: 150.00, actual: 142.30, variance: -7.70, percentage: -5.1 },
  { category: "Overtime", budgeted: 200.00, actual: 278.90, variance: 78.90, percentage: 39.5 }
];

const riskImpactData = [
  { riskFactor: "Understaffing", impact: "High", hoursAffected: 156, costImpact: 4250.00, mitigation: "Agency staff", status: "Active" },
  { riskFactor: "High Acuity Residents", impact: "Medium", hoursAffected: 89, costImpact: 2340.00, mitigation: "Skill mix adjustment", status: "Monitoring" },
  { riskFactor: "Staff Turnover", impact: "High", hoursAffected: 134, costImpact: 3680.00, mitigation: "Retention program", status: "Addressing" },
  { riskFactor: "Training Gaps", impact: "Medium", hoursAffected: 67, costImpact: 1890.00, mitigation: "Education plan", status: "Planned" }
];

const trendData = [
  { date: '2024-01-08', totalHours: 2705, avgHours: 3.0, laborCost: 85.20, riskScore: 15.8 },
  { date: '2024-01-09', totalHours: 2732, avgHours: 3.1, laborCost: 86.10, riskScore: 15.2 },
  { date: '2024-01-10', totalHours: 2698, avgHours: 2.9, laborCost: 84.80, riskScore: 14.9 },
  { date: '2024-01-11', totalHours: 2781, avgHours: 3.2, laborCost: 87.50, riskScore: 14.1 },
  { date: '2024-01-12', totalHours: 2825, avgHours: 3.3, laborCost: 88.90, riskScore: 13.8 },
  { date: '2024-01-13', totalHours: 2842, avgHours: 3.2, laborCost: 89.20, riskScore: 13.2 },
  { date: '2024-01-14', totalHours: 2847, avgHours: 3.2, laborCost: 89.50, riskScore: 13.0 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function StaffTimePerResidentDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("resident-view");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Care & Compliance", href: "/#care-compliance" },
    { label: "Average Staff Time per Resident" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600"; 
      case "Attention": return "text-yellow-600";
      case "Poor": return "text-red-600";
      case "High": return "text-green-600";
      case "Average": return "text-yellow-600";
      case "Low": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-red-100 text-red-800";
      case "Addressing": return "bg-orange-100 text-orange-800";
      case "Monitoring": return "bg-yellow-100 text-yellow-800";
      case "Planned": return "bg-blue-100 text-blue-800";
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
                <div className="p-2 rounded-lg bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Average Staff Time per Resident</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Portfolio Average: 3.2 hours
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Optimizing</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last updated: 30 minutes ago
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
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
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

        {/* Filters */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select defaultValue="7d">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Care Level</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="il">Independent Living</SelectItem>
                    <SelectItem value="al">Assisted Living</SelectItem>
                    <SelectItem value="mc">Memory Care</SelectItem>
                    <SelectItem value="snf">Skilled Nursing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Region / Community</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    <SelectItem value="sunrise">Sunrise Manor</SelectItem>
                    <SelectItem value="golden">Golden Valley</SelectItem>
                    <SelectItem value="maple">Maple Ridge</SelectItem>
                    <SelectItem value="oak">Oak Haven</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Shift</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    <SelectItem value="day">Day Shift</SelectItem>
                    <SelectItem value="night">Night Shift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Detailed Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resident-view">Resident View</TabsTrigger>
                <TabsTrigger value="care-breakdown">Care Type Breakdown</TabsTrigger>
                <TabsTrigger value="trends">Trends Over Time</TabsTrigger>
                <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
              </TabsList>

              <TabsContent value="resident-view" className="mt-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Resident Care Time Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resident Name</TableHead>
                          <TableHead>Care Level</TableHead>
                          <TableHead>Weekly Staff Time (hrs)</TableHead>
                          <TableHead>Staff Count</TableHead>
                          <TableHead>Est. Labor Cost</TableHead>
                          <TableHead>Risk Score Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Anne Lee", level: "MC", hours: 28.4, staff: 6, cost: 952.00, riskChange: -2.1 },
                          { name: "Robert Chen", level: "AL", hours: 18.2, staff: 4, cost: 624.80, riskChange: 0.3 },
                          { name: "Mary Johnson", level: "SNF", hours: 42.1, staff: 8, cost: 1403.20, riskChange: -1.8 },
                          { name: "James Wilson", level: "AL", hours: 15.7, staff: 3, cost: 539.60, riskChange: 0.1 },
                          { name: "Patricia Davis", level: "MC", hours: 31.2, staff: 7, cost: 1044.80, riskChange: -3.2 }
                        ].map((resident, index) => (
                          <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{resident.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                resident.level === "SNF" ? "text-red-600" :
                                resident.level === "MC" ? "text-orange-600" :
                                "text-blue-600"
                              }>
                                {resident.level}
                              </Badge>
                            </TableCell>
                            <TableCell className={resident.hours > 30 ? "text-red-600" : ""}>{resident.hours}</TableCell>
                            <TableCell>{resident.staff}</TableCell>
                            <TableCell className={resident.cost > 1000 ? "text-red-600" : ""}>${resident.cost.toFixed(2)}</TableCell>
                            <TableCell className={resident.riskChange < -2 ? "text-green-600" : resident.riskChange > 0 ? "text-red-600" : "text-yellow-600"}>
                              {resident.riskChange > 0 ? '+' : ''}{resident.riskChange}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="care-breakdown" className="mt-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Care Type Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-4">Time Distribution by Care Type</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Medication Pass", value: 35, color: "#3b82f6" },
                                { name: "ADL Assistance", value: 28, color: "#10b981" },
                                { name: "Assessments", value: 18, color: "#f59e0b" },
                                { name: "Documentation", value: 12, color: "#ef4444" },
                                { name: "Other", value: 7, color: "#8b5cf6" }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: "Medication Pass", value: 35, color: "#3b82f6" },
                                { name: "ADL Assistance", value: 28, color: "#10b981" },
                                { name: "Assessments", value: 18, color: "#f59e0b" },
                                { name: "Documentation", value: 12, color: "#ef4444" },
                                { name: "Other", value: 7, color: "#8b5cf6" }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-4">Care Type by Time Period</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={[
                            { timeSlot: "6-10 AM", medPass: 8.2, adl: 6.4, assessment: 3.1, docs: 2.8 },
                            { timeSlot: "10-2 PM", medPass: 6.8, adl: 5.2, assessment: 4.6, docs: 3.2 },
                            { timeSlot: "2-6 PM", medPass: 7.4, adl: 4.8, assessment: 2.9, docs: 2.6 },
                            { timeSlot: "6-10 PM", medPass: 5.9, adl: 3.7, assessment: 1.8, docs: 2.1 },
                            { timeSlot: "10 PM-6 AM", medPass: 4.2, adl: 2.9, assessment: 1.2, docs: 1.8 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timeSlot" />
                            <YAxis />
                            <ChartTooltip />
                            <Bar dataKey="medPass" stackId="a" fill="#3b82f6" name="Medication Pass" />
                            <Bar dataKey="adl" stackId="a" fill="#10b981" name="ADL Assistance" />
                            <Bar dataKey="assessment" stackId="a" fill="#f59e0b" name="Assessments" />
                            <Bar dataKey="docs" stackId="a" fill="#ef4444" name="Documentation" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Care Time vs Risk Score Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">Select Residents</label>
                      <Select defaultValue="anne-lee">
                        <SelectTrigger className="w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anne-lee">Anne Lee</SelectItem>
                          <SelectItem value="robert-chen">Robert Chen</SelectItem>
                          <SelectItem value="mary-johnson">Mary Johnson</SelectItem>
                          <SelectItem value="all">All Residents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={[
                        { week: "Week 1", careTime: 24.2, riskScore: 18.5 },
                        { week: "Week 2", careTime: 26.8, riskScore: 17.2 },
                        { week: "Week 3", careTime: 28.1, riskScore: 16.8 },
                        { week: "Week 4", careTime: 28.4, riskScore: 16.4 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip />
                        <Line yAxisId="left" type="monotone" dataKey="careTime" stroke="#3b82f6" name="Care Time (hrs)" strokeWidth={3} />
                        <Line yAxisId="right" type="monotone" dataKey="riskScore" stroke="#ef4444" name="Risk Score" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benchmarking" className="mt-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Benchmarking Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>Community Average</TableHead>
                          <TableHead>Portfolio Average</TableHead>
                          <TableHead>Variance</TableHead>
                          <TableHead>Percentile</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { metric: "Avg Hours per Resident", community: 3.2, portfolio: 3.0, variance: "+6.7%", percentile: "75th" },
                          { metric: "Labor Cost per Resident", community: 89.50, portfolio: 85.20, variance: "+5.0%", percentile: "68th" },
                          { metric: "Staff Efficiency %", community: 91.8, portfolio: 88.4, variance: "+3.8%", percentile: "82nd" },
                          { metric: "Risk Score Improvement", community: -2.8, portfolio: -2.1, variance: "+33.3%", percentile: "91st" },
                          { metric: "Care Continuity Index", community: 0.87, portfolio: 0.82, variance: "+6.1%", percentile: "79th" }
                        ].map((benchmark, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{benchmark.metric}</TableCell>
                            <TableCell>{typeof benchmark.community === 'number' && benchmark.community > 1 ? benchmark.community.toFixed(2) : benchmark.community}</TableCell>
                            <TableCell>{typeof benchmark.portfolio === 'number' && benchmark.portfolio > 1 ? benchmark.portfolio.toFixed(2) : benchmark.portfolio}</TableCell>
                            <TableCell className={benchmark.variance.includes('+') ? "text-red-600" : "text-green-600"}>
                              {benchmark.variance}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                parseInt(benchmark.percentile) > 80 ? "text-green-600" :
                                parseInt(benchmark.percentile) > 60 ? "text-yellow-600" :
                                "text-red-600"
                              }>
                                {benchmark.percentile}
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

          {/* AI Insight Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">High Care Time Alert</p>
                      <p className="text-yellow-700 mt-1">
                        Resident Anne Lee received 6.8 hrs more staff time than peers — recommend acuity reassessment
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">Trend Analysis</p>
                      <p className="text-blue-700 mt-1">
                        Staff time increased 22% in MC units last week — no associated risk score change
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">Positive Outcome</p>
                      <p className="text-green-700 mt-1">
                        Medication adherence improved 15% with optimized staff scheduling
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800">Cost Variance</p>
                      <p className="text-red-700 mt-1">
                        Labor costs 39% over budget due to overtime — consider staffing adjustment
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Generate Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          <ChartContainer title="Staff Time Trends" description="7-day staffing hours and cost analysis">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                 <ChartTooltip />
                <Line type="monotone" dataKey="totalHours" stroke="#3b82f6" name="Total Hours" />
                <Line type="monotone" dataKey="avgHours" stroke="#10b981" name="Avg Hours per Resident" />
                <Line type="monotone" dataKey="laborCost" stroke="#f59e0b" name="Labor Cost per Resident" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Community Performance Table */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Community Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Community</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Avg Hours/Resident</TableHead>
                    <TableHead>Labor Cost</TableHead>
                    <TableHead>Risk Change</TableHead>
                    <TableHead>Efficiency %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityData.map((community, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{community.community}</TableCell>
                      <TableCell>{community.totalHours}</TableCell>
                      <TableCell className={community.avgHoursPerResident > 3.5 ? "text-red-600" : ""}>{community.avgHoursPerResident}</TableCell>
                      <TableCell className={community.laborCost > 90 ? "text-red-600" : ""}>${community.laborCost}</TableCell>
                      <TableCell className={community.riskChange < -3 ? "text-green-600" : community.riskChange > -1.5 ? "text-red-600" : "text-yellow-600"}>{community.riskChange}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={community.efficiency < 85 ? "text-red-600" : ""}>{community.efficiency}%</span>
                          <Progress value={community.efficiency} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(community.status)}>
                          {community.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
    </TooltipProvider>
  );
}