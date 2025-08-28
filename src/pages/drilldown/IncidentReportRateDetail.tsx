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
import { ArrowLeft, Calendar, Download, Filter, AlertTriangle, TrendingDown, TrendingUp, Clock, Users, Activity, FileText, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const topMetrics = [
  {
    title: "Incidents per Census",
    value: "0.42",
    change: { value: "-0.08", type: "positive" as const },
    target: "< 0.35"
  },
  {
    title: "Severity Mix",
    value: "12% High",
    change: { value: "-3%", type: "positive" as const },
    target: "< 10%"
  },
  {
    title: "Resolution Speed",
    value: "2.3 days",
    change: { value: "-0.5d", type: "positive" as const },
    target: "< 2.0d"
  },
  {
    title: "Repeat Frequency",
    value: "8.7%",
    change: { value: "+1.2%", type: "negative" as const },
    target: "< 5%"
  }
];

const communityData = [
  { community: "Sunrise Manor", incidentsPerCensus: 0.35, severityHigh: 8, resolutionDays: 1.8, repeatFreq: 5.2, totalIncidents: 18, status: "Good" },
  { community: "Golden Valley", incidentsPerCensus: 0.48, severityHigh: 15, resolutionDays: 2.8, repeatFreq: 12.1, totalIncidents: 32, status: "Attention" },
  { community: "Maple Ridge", incidentsPerCensus: 0.29, severityHigh: 6, resolutionDays: 1.5, repeatFreq: 3.8, totalIncidents: 15, status: "Excellent" },
  { community: "Oak Haven", incidentsPerCensus: 0.52, severityHigh: 18, resolutionDays: 3.1, repeatFreq: 14.5, totalIncidents: 28, status: "Poor" },
  { community: "Pine Grove", incidentsPerCensus: 0.41, severityHigh: 11, resolutionDays: 2.2, repeatFreq: 8.9, totalIncidents: 24, status: "Good" }
];

const escalationTrackerData = [
  { incident: "INC-2024-0156", type: "Fall", resident: "Smith, John", dateReported: "2024-01-14", currentStage: "Investigation", daysOpen: 2, assignedTo: "J. Davis", severity: "High" },
  { incident: "INC-2024-0155", type: "Medication Error", resident: "Brown, Patricia", dateReported: "2024-01-13", currentStage: "Family Notification", daysOpen: 3, assignedTo: "M. Wilson", severity: "Medium" },
  { incident: "INC-2024-0154", type: "Skin Breakdown", resident: "Davis, Mary", dateReported: "2024-01-12", currentStage: "Corrective Action", daysOpen: 4, assignedTo: "L. Johnson", severity: "Medium" },
  { incident: "INC-2024-0153", type: "Behavioral", resident: "Wilson, Robert", dateReported: "2024-01-11", currentStage: "Documentation", daysOpen: 5, assignedTo: "S. Brown", severity: "Low" }
];

const staffFollowUpData = [
  { staff: "Johnson, Lisa (RN)", activeIncidents: 8, avgResolutionTime: 2.1, completionRate: 94.2, pendingActions: 3, status: "Good" },
  { staff: "Davis, Jennifer (DON)", activeIncidents: 12, avgResolutionTime: 1.8, completionRate: 97.8, pendingActions: 2, status: "Excellent" },
  { staff: "Wilson, Michael (LPN)", activeIncidents: 6, avgResolutionTime: 3.2, completionRate: 87.5, pendingActions: 5, status: "Attention" },
  { staff: "Brown, Sarah (CNA)", activeIncidents: 4, avgResolutionTime: 2.8, completionRate: 91.7, pendingActions: 2, status: "Good" }
];

const familyNoticeData = [
  { incident: "INC-2024-0156", resident: "Smith, John", incidentType: "Fall", severity: "High", notificationRequired: "Yes", notificationSent: "Yes", timeToNotify: "45 min", familyResponse: "Acknowledged" },
  { incident: "INC-2024-0155", resident: "Brown, Patricia", incidentType: "Medication Error", severity: "Medium", notificationRequired: "Yes", notificationSent: "Yes", timeToNotify: "2.3 hours", familyResponse: "Pending" },
  { incident: "INC-2024-0154", resident: "Davis, Mary", incidentType: "Skin Breakdown", severity: "Medium", notificationRequired: "No", notificationSent: "N/A", timeToNotify: "N/A", familyResponse: "N/A" },
  { incident: "INC-2024-0153", resident: "Wilson, Robert", incidentType: "Behavioral", severity: "Low", notificationRequired: "No", notificationSent: "N/A", timeToNotify: "N/A", familyResponse: "N/A" }
];

const incidentCausesData = [
  { cause: "Environmental Hazard", frequency: 28, percentage: 23.5, trend: "+5", topLocation: "Bathroom" },
  { cause: "Medication Error", frequency: 22, percentage: 18.5, trend: "-3", topLocation: "Med Room" },
  { cause: "Staff Communication", frequency: 18, percentage: 15.1, trend: "+2", topLocation: "Nursing Station" },
  { cause: "Resident Behavior", frequency: 16, percentage: 13.4, trend: "+1", topLocation: "Common Area" },
  { cause: "Equipment Failure", frequency: 12, percentage: 10.1, trend: "-1", topLocation: "Therapy Room" },
  { cause: "Documentation Error", frequency: 8, percentage: 6.7, trend: "+3", topLocation: "Office" }
];

const trendData = [
  { date: '2024-01-08', incidentsPerCensus: 0.48, resolutionTime: 2.8, repeatFreq: 9.2 },
  { date: '2024-01-09', incidentsPerCensus: 0.45, resolutionTime: 2.6, repeatFreq: 8.9 },
  { date: '2024-01-10', incidentsPerCensus: 0.44, resolutionTime: 2.5, repeatFreq: 8.5 },
  { date: '2024-01-11', incidentsPerCensus: 0.43, resolutionTime: 2.4, repeatFreq: 8.8 },
  { date: '2024-01-12', incidentsPerCensus: 0.41, resolutionTime: 2.3, repeatFreq: 8.6 },
  { date: '2024-01-13', incidentsPerCensus: 0.42, resolutionTime: 2.3, repeatFreq: 8.7 },
  { date: '2024-01-14', incidentsPerCensus: 0.42, resolutionTime: 2.3, repeatFreq: 8.7 }
];

export default function IncidentReportRateDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("escalation-tracker");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Care & Compliance", href: "/#care-compliance" },
    { label: "Incident Report Rate" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600"; 
      case "Attention": return "text-yellow-600";
      case "Poor": return "text-red-600";
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Investigation": return "bg-blue-100 text-blue-800";
      case "Family Notification": return "bg-orange-100 text-orange-800";
      case "Corrective Action": return "bg-purple-100 text-purple-800";
      case "Documentation": return "bg-gray-100 text-gray-800";
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
                <div className="p-2 rounded-lg bg-orange-100">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Incident Report Rate</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Portfolio Average: 0.42 per census
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingDown className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Decreasing</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last updated: 1 hour ago
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
          <ChartContainer title="Incident Trends" description="7-day incident reporting and resolution trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="incidentsPerCensus" stroke="#ef4444" name="Incidents per Census" />
                <Line type="monotone" dataKey="resolutionTime" stroke="#f59e0b" name="Resolution Time (days)" />
                <Line type="monotone" dataKey="repeatFreq" stroke="#3b82f6" name="Repeat Frequency %" />
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
                    <TableHead>Incidents/Census</TableHead>
                    <TableHead>High Severity %</TableHead>
                    <TableHead>Resolution Days</TableHead>
                    <TableHead>Repeat Freq %</TableHead>
                    <TableHead>Total Incidents</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityData.map((community, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{community.community}</TableCell>
                      <TableCell className={community.incidentsPerCensus > 0.45 ? "text-red-600" : ""}>{community.incidentsPerCensus}</TableCell>
                      <TableCell className={community.severityHigh > 15 ? "text-red-600" : ""}>{community.severityHigh}%</TableCell>
                      <TableCell className={community.resolutionDays > 2.5 ? "text-red-600" : ""}>{community.resolutionDays}</TableCell>
                      <TableCell className={community.repeatFreq > 10 ? "text-red-600" : ""}>{community.repeatFreq}%</TableCell>
                      <TableCell>{community.totalIncidents}</TableCell>
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
            <TabsTrigger value="escalation-tracker">Escalation Tracker</TabsTrigger>
            <TabsTrigger value="staff-followup">Staff Follow-up</TabsTrigger>
            <TabsTrigger value="family-notice">Family Notice Compliance</TabsTrigger>
            <TabsTrigger value="incident-causes">Incident Causes</TabsTrigger>
          </TabsList>

          <TabsContent value="escalation-tracker" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Incident Escalations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Days Open</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {escalationTrackerData.map((incident, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{incident.incident}</TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell className="font-medium">{incident.resident}</TableCell>
                        <TableCell className="text-sm">{incident.dateReported}</TableCell>
                        <TableCell>
                          <Badge className={getStageColor(incident.currentStage)}>
                            {incident.currentStage}
                          </Badge>
                        </TableCell>
                        <TableCell className={incident.daysOpen > 3 ? "text-red-600" : ""}>{incident.daysOpen}</TableCell>
                        <TableCell>{incident.assignedTo}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff-followup" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Follow-up Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Active Incidents</TableHead>
                      <TableHead>Avg Resolution Time</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Pending Actions</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffFollowUpData.map((staff, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{staff.staff}</TableCell>
                        <TableCell>{staff.activeIncidents}</TableCell>
                        <TableCell>{staff.avgResolutionTime} days</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{staff.completionRate}%</span>
                            <Progress value={staff.completionRate} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className={staff.pendingActions > 3 ? "text-red-600" : ""}>{staff.pendingActions}</TableCell>
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

          <TabsContent value="family-notice" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Family Notification Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident ID</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Notice Required</TableHead>
                      <TableHead>Notice Sent</TableHead>
                      <TableHead>Time to Notify</TableHead>
                      <TableHead>Family Response</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {familyNoticeData.map((notice, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{notice.incident}</TableCell>
                        <TableCell className="font-medium">{notice.resident}</TableCell>
                        <TableCell>{notice.incidentType}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(notice.severity)}>
                            {notice.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{notice.notificationRequired}</TableCell>
                        <TableCell className={notice.notificationSent === "Yes" ? "text-green-600" : ""}>{notice.notificationSent}</TableCell>
                        <TableCell className={notice.timeToNotify && parseFloat(notice.timeToNotify) > 2 ? "text-red-600" : ""}>{notice.timeToNotify}</TableCell>
                        <TableCell>{notice.familyResponse}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incident-causes" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Root Cause Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cause Category</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Top Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidentCausesData.map((cause, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cause.cause}</TableCell>
                        <TableCell>{cause.frequency}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{cause.percentage}%</span>
                            <Progress value={cause.percentage} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className={cause.trend.startsWith('+') ? "text-red-600" : "text-green-600"}>{cause.trend}</TableCell>
                        <TableCell className="text-sm">{cause.topLocation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </TooltipProvider>
  );
}