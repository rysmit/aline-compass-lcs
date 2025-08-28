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
import { RecordStitchingBanner } from "@/components/data-lineage/RecordStitchingBanner";
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
  AlertTriangle, 
  Users, 
  Heart, 
  MessageSquare, 
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const topMetrics = [
  {
    title: "Avg Risk Score",
    subtitle: "Portfolio Wide",
    value: "6.8",
    change: { value: "-0.4", type: "positive" as const },
    target: "< 7.0"
  },
  {
    title: "Alert Count",
    value: "47",
    change: { value: "+8", type: "negative" as const },
    target: "< 40"
  },
  {
    title: "Escalation Status",
    value: "12",
    change: { value: "+3", type: "negative" as const },
    target: "< 10"
  },
  {
    title: "Staff Follow-Up Rate",
    subtitle: "Completed",
    value: "89%",
    change: { value: "+5%", type: "positive" as const },
    target: "> 85%"
  }
];

const riskResidents = [
  { name: "Margaret Thompson", riskScore: 9.2, alerts: 8, lastEscalation: "2024-01-12", followUp: "Completed", community: "Sunrise Manor", careLevel: "MC" },
  { name: "Robert Wilson", riskScore: 8.9, alerts: 6, lastEscalation: "2024-01-14", followUp: "Pending", community: "Golden Valley", careLevel: "SNF" },
  { name: "Elizabeth Brown", riskScore: 8.7, alerts: 5, lastEscalation: "2024-01-10", followUp: "Completed", community: "Maple Ridge", careLevel: "AL" },
  { name: "James Patterson", riskScore: 8.5, alerts: 7, lastEscalation: "2024-01-13", followUp: "In Progress", community: "Oak Haven", careLevel: "MC" },
  { name: "Dorothy Martinez", riskScore: 8.3, alerts: 4, lastEscalation: "2024-01-11", followUp: "Completed", community: "Pine Grove", careLevel: "AL" }
];

const riskHistory = [
  { date: '2024-01-08', avgRisk: 7.2, escalations: 8, followUps: 85 },
  { date: '2024-01-09', avgRisk: 7.0, escalations: 9, followUps: 87 },
  { date: '2024-01-10', avgRisk: 6.9, escalations: 11, followUps: 88 },
  { date: '2024-01-11', avgRisk: 6.8, escalations: 10, followUps: 89 },
  { date: '2024-01-12', avgRisk: 6.7, escalations: 12, followUps: 91 },
  { date: '2024-01-13', avgRisk: 6.8, escalations: 12, followUps: 89 },
  { date: '2024-01-14', avgRisk: 6.8, escalations: 12, followUps: 89 }
];

const alertTriggers = [
  { trigger: "Medication Non-Compliance", count: 18, severity: "High", trend: "increasing" },
  { trigger: "Fall Risk Assessment", count: 14, severity: "Medium", trend: "stable" },
  { trigger: "Behavioral Changes", count: 12, severity: "High", trend: "decreasing" },
  { trigger: "Weight Loss > 5%", count: 8, severity: "Medium", trend: "stable" },
  { trigger: "Emergency Room Visit", count: 6, severity: "High", trend: "increasing" }
];

const communicationLog = [
  { date: "2024-01-14", resident: "Margaret Thompson", type: "Family Call", staff: "Sarah Johnson, RN", outcome: "Care plan updated", urgency: "High" },
  { date: "2024-01-14", resident: "Robert Wilson", type: "Physician Consult", staff: "Dr. Emily Chen", outcome: "Medication adjusted", urgency: "Medium" },
  { date: "2024-01-13", resident: "James Patterson", type: "Family Meeting", staff: "Maria Rodriguez, SW", outcome: "Family concerns addressed", urgency: "High" },
  { date: "2024-01-13", resident: "Elizabeth Brown", type: "Care Conference", staff: "Lisa Davis, LPN", outcome: "Goals reassessed", urgency: "Low" },
  { date: "2024-01-12", resident: "Dorothy Martinez", type: "Emergency Contact", staff: "John Smith, RN", outcome: "Hospitalization avoided", urgency: "High" }
];

const engagementData = [
  { resident: "Margaret Thompson", socialScore: 6.2, familyContact: 8.9, activityLevel: 4.1, overallEngagement: 6.4 },
  { resident: "Robert Wilson", socialScore: 4.8, familyContact: 6.2, activityLevel: 3.9, overallEngagement: 5.0 },
  { resident: "Elizabeth Brown", socialScore: 7.1, familyContact: 9.2, activityLevel: 6.8, overallEngagement: 7.7 },
  { resident: "James Patterson", socialScore: 5.5, familyContact: 7.8, activityLevel: 5.2, overallEngagement: 6.2 },
  { resident: "Dorothy Martinez", socialScore: 8.2, familyContact: 8.5, activityLevel: 7.9, overallEngagement: 8.2 }
];

export default function HighRiskResidentsDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("risk-history");

  // Sample resident record stitching data
  const residentRecords = [
    { systemName: 'CRM', id: 'CRM-5432', label: 'CRM ID' },
    { systemName: 'ECP', id: 'ECP-7890', label: 'ECP ID' },
    { systemName: 'Vitals', id: 'VTL-2468', label: 'Vitals ID' }
  ];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Forecast & Risk", href: "/#forecast-risk" },
    { label: "High-Risk Residents" }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 8.5) return "text-red-600";
    if (score >= 7.5) return "text-orange-600";
    if (score >= 6.5) return "text-yellow-600";
    return "text-green-600";
  };

  const getFollowUpColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  
  const handleResidentClick = (residentName: string) => {
    // Convert resident name to a mock ID for navigation
    const residentId = residentName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/region/northeast/community/sunrise-manor/resident/1`); // Using mock values for demo
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
                  <div className="p-2 rounded-lg bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">High-Risk Residents</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Active High-Risk: 47 residents
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">Requires Monitoring</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Last updated: 15 minutes ago
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
                  Risk Filters
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <RecordStitchingBanner 
            records={residentRecords} 
            className="mb-6"
          />
          
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

          {/* Risk Trend Chart */}
          <div className="mb-8">
            <ChartContainer title="Risk Trends Over Time" description="Risk score and escalation trends">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={riskHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="avgRisk" stroke="#ef4444" strokeWidth={3} name="Average Risk Score" />
                  <Line type="monotone" dataKey="escalations" stroke="#f59e0b" strokeWidth={2} name="Escalations" />
                  <Line type="monotone" dataKey="followUps" stroke="#10b981" strokeWidth={2} name="Follow-Up Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* High-Risk Residents Table */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Current High-Risk Residents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident Name</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Active Alerts</TableHead>
                    <TableHead>Last Escalation</TableHead>
                    <TableHead>Follow-Up Status</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Care Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskResidents.map((resident, index) => (
                    <TableRow 
                      key={index} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleResidentClick(resident.name)}
                    >
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell className={getRiskColor(resident.riskScore)}>
                        {resident.riskScore}
                      </TableCell>
                      <TableCell className={resident.alerts > 6 ? "text-red-600" : "text-yellow-600"}>
                        {resident.alerts}
                      </TableCell>
                      <TableCell>{resident.lastEscalation}</TableCell>
                      <TableCell>
                        <Badge className={getFollowUpColor(resident.followUp)}>
                          {resident.followUp}
                        </Badge>
                      </TableCell>
                      <TableCell>{resident.community}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          resident.careLevel === "SNF" ? "text-red-600" :
                          resident.careLevel === "MC" ? "text-orange-600" :
                          "text-blue-600"
                        }>
                          {resident.careLevel}
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
              <TabsTrigger value="risk-history">Resident Risk History</TabsTrigger>
              <TabsTrigger value="alert-triggers">Alert Triggers</TabsTrigger>
              <TabsTrigger value="communication">Communication Log</TabsTrigger>
              <TabsTrigger value="engagement">Engagement Score</TabsTrigger>
            </TabsList>

            <TabsContent value="risk-history" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Individual Risk History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Risk Score Distribution</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={riskResidents}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="alerts" name="Active Alerts" />
                          <YAxis dataKey="riskScore" name="Risk Score" />
                          <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Scatter dataKey="riskScore" fill="#ef4444" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Recent Risk Changes</h4>
                      {riskResidents.map((resident, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{resident.name}</span>
                            <span className={`font-bold ${getRiskColor(resident.riskScore)}`}>
                              {resident.riskScore}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{resident.alerts} active alerts</span>
                            <span>{resident.community}</span>
                          </div>
                          <Progress value={(resident.riskScore / 10) * 100} className="mt-2 h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alert-triggers" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Alert Trigger Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trigger Type</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Action Required</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertTriggers.map((trigger, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{trigger.trigger}</TableCell>
                          <TableCell className={trigger.count > 15 ? "text-red-600" : "text-yellow-600"}>
                            {trigger.count}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getSeverityColor(trigger.severity)}>
                              {trigger.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className={
                            trigger.trend === "increasing" ? "text-red-600" :
                            trigger.trend === "decreasing" ? "text-green-600" : "text-yellow-600"
                          }>
                            {trigger.trend}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant={trigger.severity === "High" ? "destructive" : "outline"}>
                              {trigger.severity === "High" ? "Immediate" : "Monitor"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Communications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Resident</TableHead>
                        <TableHead>Communication Type</TableHead>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Urgency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {communicationLog.map((comm, index) => (
                        <TableRow key={index}>
                          <TableCell>{comm.date}</TableCell>
                          <TableCell className="font-medium">{comm.resident}</TableCell>
                          <TableCell>{comm.type}</TableCell>
                          <TableCell className="text-sm">{comm.staff}</TableCell>
                          <TableCell className="text-sm">{comm.outcome}</TableCell>
                          <TableCell>
                            <Badge className={getUrgencyColor(comm.urgency)}>
                              {comm.urgency}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Resident Engagement Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resident</TableHead>
                        <TableHead>Social Score</TableHead>
                        <TableHead>Family Contact</TableHead>
                        <TableHead>Activity Level</TableHead>
                        <TableHead>Overall Engagement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {engagementData.map((engagement, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{engagement.resident}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={engagement.socialScore < 6 ? "text-red-600" : "text-green-600"}>
                                {engagement.socialScore}
                              </span>
                              <Progress value={engagement.socialScore * 10} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={engagement.familyContact < 7 ? "text-red-600" : "text-green-600"}>
                                {engagement.familyContact}
                              </span>
                              <Progress value={engagement.familyContact * 10} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={engagement.activityLevel < 5 ? "text-red-600" : "text-green-600"}>
                                {engagement.activityLevel}
                              </span>
                              <Progress value={engagement.activityLevel * 10} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={engagement.overallEngagement < 6 ? "text-red-600" : "text-green-600"}>
                                {engagement.overallEngagement}
                              </span>
                              <Progress value={engagement.overallEngagement * 10} className="w-16 h-2" />
                            </div>
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
      </div>
    </TooltipProvider>
  );
}