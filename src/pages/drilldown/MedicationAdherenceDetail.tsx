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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Calendar, Download, Filter, Pill, TrendingDown, TrendingUp, AlertTriangle, Clock, Users, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const topMetrics = [
  {
    title: "Missed Doses %",
    value: "4.2%",
    change: { value: "-0.8%", type: "positive" as const },
    target: "< 3%"
  },
  {
    title: "Late Meds",
    value: "23",
    change: { value: "+5", type: "negative" as const },
    target: "< 15"
  },
  {
    title: "PRN Usage",
    value: "142",
    change: { value: "+12", type: "neutral" as const },
    target: "Monitor"
  },
  {
    title: "Alerts",
    value: "8",
    change: { value: "-3", type: "positive" as const },
    target: "< 5"
  }
];

const communityData = [
  { community: "Sunrise Manor", missedDoses: 3.1, lateMeds: 15, prnUsage: 89, alerts: 2, adherenceRate: 96.9, status: "Good" },
  { community: "Golden Valley", missedDoses: 5.2, lateMeds: 28, prnUsage: 156, alerts: 12, adherenceRate: 94.8, status: "Attention" },
  { community: "Maple Ridge", missedDoses: 2.8, lateMeds: 18, prnUsage: 134, alerts: 4, adherenceRate: 97.2, status: "Excellent" },
  { community: "Oak Haven", missedDoses: 6.1, lateMeds: 31, prnUsage: 178, alerts: 15, adherenceRate: 93.9, status: "Poor" },
  { community: "Pine Grove", missedDoses: 4.5, lateMeds: 22, prnUsage: 145, alerts: 7, adherenceRate: 95.5, status: "Good" }
];

const staffAdherenceData = [
  { staff: "Sarah Johnson, RN", shift: "Day", adherenceRate: 98.5, missedDoses: 2, lateMeds: 1, status: "Excellent" },
  { staff: "Michael Chen, LPN", shift: "Evening", adherenceRate: 94.2, missedDoses: 8, lateMeds: 5, status: "Good" },
  { staff: "Lisa Rodriguez, RN", shift: "Night", adherenceRate: 91.8, missedDoses: 12, lateMeds: 8, status: "Attention" },
  { staff: "David Wilson, LPN", shift: "Day", adherenceRate: 96.7, missedDoses: 4, lateMeds: 3, status: "Good" }
];

const errorLogData = [
  { timestamp: "2024-01-15 14:30", resident: "Smith, John", medication: "Metformin 500mg", error: "Missed Dose", staff: "M. Chen", severity: "Medium" },
  { timestamp: "2024-01-15 08:15", resident: "Davis, Mary", medication: "Lisinopril 10mg", error: "Late Admin", staff: "S. Johnson", severity: "Low" },
  { timestamp: "2024-01-14 22:45", resident: "Wilson, Robert", medication: "Warfarin 5mg", error: "Wrong Dose", staff: "L. Rodriguez", severity: "High" },
  { timestamp: "2024-01-14 16:20", resident: "Brown, Patricia", medication: "Insulin", error: "Missed Dose", staff: "D. Wilson", severity: "High" }
];

const residentRiskData = [
  { resident: "Brown, Patricia", medications: 8, riskScore: 95, missedDoses: 6, condition: "Diabetes", lastMissed: "2 hours ago" },
  { resident: "Wilson, Robert", medications: 12, riskScore: 92, missedDoses: 4, condition: "A-Fib", lastMissed: "1 day ago" },
  { resident: "Johnson, Elizabeth", medications: 6, riskScore: 88, missedDoses: 3, condition: "Hypertension", lastMissed: "6 hours ago" },
  { resident: "Thompson, William", medications: 9, riskScore: 85, missedDoses: 5, condition: "COPD", lastMissed: "12 hours ago" }
];

const pharmacyActivityData = [
  { activity: "Prescription Fills", count: 156, trend: "+8", status: "Normal" },
  { activity: "Emergency Orders", count: 23, trend: "+5", status: "High" },
  { activity: "Refill Requests", count: 89, trend: "-2", status: "Normal" },
  { activity: "Medication Reviews", count: 45, trend: "+12", status: "Good" }
];

const trendData = [
  { date: '2024-01-08', missedDoses: 5.1, lateMeds: 28, alerts: 12 },
  { date: '2024-01-09', missedDoses: 4.8, lateMeds: 25, alerts: 10 },
  { date: '2024-01-10', missedDoses: 4.5, lateMeds: 22, alerts: 9 },
  { date: '2024-01-11', missedDoses: 4.3, lateMeds: 26, alerts: 11 },
  { date: '2024-01-12', missedDoses: 4.0, lateMeds: 24, alerts: 8 },
  { date: '2024-01-13', missedDoses: 4.2, lateMeds: 23, alerts: 8 },
  { date: '2024-01-14', missedDoses: 4.2, lateMeds: 23, alerts: 8 }
];

export default function MedicationAdherenceDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("staff-adherence");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Care & Compliance", href: "/#care-compliance" },
    { label: "Medication Adherence" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600"; 
      case "Attention": return "text-yellow-600";
      case "Poor": return "text-red-600";
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
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
                <div className="p-2 rounded-lg bg-blue-100">
                  <Pill className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Medication Adherence</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Portfolio Average: 95.4%
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingDown className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Improving</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last updated: 2 minutes ago
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
              subtitle={`Target: ${metric.target}`}
              calculation={`${metric.title} target: ${metric.target}`}
            />
          ))}
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          <ChartContainer title="Medication Adherence Trends" description="7-day medication adherence performance">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="missedDoses" stroke="#ef4444" name="Missed Doses %" />
                <Line type="monotone" dataKey="lateMeds" stroke="#f59e0b" name="Late Meds" />
                <Line type="monotone" dataKey="alerts" stroke="#3b82f6" name="Alerts" />
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
                    <TableHead>Missed Doses %</TableHead>
                    <TableHead>Late Meds</TableHead>
                    <TableHead>PRN Usage</TableHead>
                    <TableHead>Alerts</TableHead>
                    <TableHead>Adherence Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityData.map((community, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{community.community}</TableCell>
                      <TableCell className={community.missedDoses > 5 ? "text-red-600" : ""}>{community.missedDoses}%</TableCell>
                      <TableCell className={community.lateMeds > 25 ? "text-red-600" : ""}>{community.lateMeds}</TableCell>
                      <TableCell>{community.prnUsage}</TableCell>
                      <TableCell className={community.alerts > 10 ? "text-red-600" : ""}>{community.alerts}</TableCell>
                      <TableCell>{community.adherenceRate}%</TableCell>
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

        {/* Detailed Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="staff-adherence">Staff Adherence</TabsTrigger>
            <TabsTrigger value="error-log">Error Log</TabsTrigger>
            <TabsTrigger value="resident-risk">Resident Risk</TabsTrigger>
            <TabsTrigger value="pharmacy-activity">Pharmacy Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="staff-adherence" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Adherence Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Adherence Rate</TableHead>
                      <TableHead>Missed Doses</TableHead>
                      <TableHead>Late Meds</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffAdherenceData.map((staff, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{staff.staff}</TableCell>
                        <TableCell>{staff.shift}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{staff.adherenceRate}%</span>
                            <Progress value={staff.adherenceRate} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className={staff.missedDoses > 8 ? "text-red-600" : ""}>{staff.missedDoses}</TableCell>
                        <TableCell className={staff.lateMeds > 5 ? "text-red-600" : ""}>{staff.lateMeds}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(staff.status)}>
                            {staff.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="error-log" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Medication Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Error Type</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errorLogData.map((error, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{error.timestamp}</TableCell>
                        <TableCell>{error.resident}</TableCell>
                        <TableCell>{error.medication}</TableCell>
                        <TableCell>{error.error}</TableCell>
                        <TableCell>{error.staff}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resident-risk" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  High-Risk Residents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Missed Doses</TableHead>
                      <TableHead>Primary Condition</TableHead>
                      <TableHead>Last Missed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {residentRiskData.map((resident, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{resident.resident}</TableCell>
                        <TableCell>{resident.medications}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={resident.riskScore > 90 ? "text-red-600 font-medium" : ""}>{resident.riskScore}</span>
                            <Progress value={resident.riskScore} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-red-600">{resident.missedDoses}</TableCell>
                        <TableCell>{resident.condition}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{resident.lastMissed}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacy-activity" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Pharmacy Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pharmacyActivityData.map((activity, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{activity.activity}</h4>
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{activity.count}</span>
                        <span className={`text-sm ${activity.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {activity.trend}
                        </span>
                      </div>
                    </div>
                  ))}
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