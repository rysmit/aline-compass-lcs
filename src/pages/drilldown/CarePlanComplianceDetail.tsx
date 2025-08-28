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
import { ArrowLeft, Calendar, Download, Filter, ClipboardList, TrendingDown, TrendingUp, AlertTriangle, Clock, Users, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const topMetrics = [
  {
    title: "Tasks Complete %",
    value: "87.3%",
    change: { value: "+2.1%", type: "positive" as const },
    target: "> 90%"
  },
  {
    title: "Reassessment Rate",
    value: "94.6%",
    change: { value: "+1.2%", type: "positive" as const },
    target: "> 95%"
  },
  {
    title: "Staff Compliance",
    value: "89.2%",
    change: { value: "-1.5%", type: "negative" as const },
    target: "> 85%"
  },
  {
    title: "Notes Score",
    value: "8.4/10",
    change: { value: "+0.3", type: "positive" as const },
    target: "> 8.0"
  }
];

const communityData = [
  { community: "Sunrise Manor", tasksComplete: 91.2, reassessmentRate: 96.1, staffCompliance: 92.5, notesScore: 8.7, status: "Excellent" },
  { community: "Golden Valley", tasksComplete: 84.8, reassessmentRate: 93.2, staffCompliance: 86.3, notesScore: 8.1, status: "Good" },
  { community: "Maple Ridge", tasksComplete: 93.5, reassessmentRate: 97.8, staffCompliance: 94.1, notesScore: 9.2, status: "Excellent" },
  { community: "Oak Haven", tasksComplete: 82.1, reassessmentRate: 91.5, staffCompliance: 83.7, notesScore: 7.8, status: "Attention" },
  { community: "Pine Grove", tasksComplete: 88.9, reassessmentRate: 95.3, staffCompliance: 90.2, notesScore: 8.5, status: "Good" }
];

const alertedPlansData = [
  { resident: "Smith, John", planType: "Physical Therapy", daysOverdue: 3, lastUpdate: "2024-01-12", assignedStaff: "T. Wilson", priority: "High" },
  { resident: "Davis, Mary", planType: "Medication Review", daysOverdue: 1, lastUpdate: "2024-01-14", assignedStaff: "Dr. Johnson", priority: "Medium" },
  { resident: "Wilson, Robert", planType: "Nutrition Assessment", daysOverdue: 5, lastUpdate: "2024-01-10", assignedStaff: "L. Brown", priority: "High" },
  { resident: "Brown, Patricia", planType: "Care Plan Review", daysOverdue: 2, lastUpdate: "2024-01-13", assignedStaff: "S. Davis", priority: "Medium" }
];

const complianceTimelineData = [
  { date: '2024-01-08', tasksComplete: 85.2, reassessments: 92.1, staffCompliance: 88.5 },
  { date: '2024-01-09', tasksComplete: 86.1, reassessments: 93.2, staffCompliance: 89.1 },
  { date: '2024-01-10', tasksComplete: 85.8, reassessments: 94.1, staffCompliance: 87.8 },
  { date: '2024-01-11', tasksComplete: 87.2, reassessments: 93.8, staffCompliance: 90.2 },
  { date: '2024-01-12', tasksComplete: 86.9, reassessments: 94.5, staffCompliance: 89.8 },
  { date: '2024-01-13', tasksComplete: 87.1, reassessments: 94.8, staffCompliance: 89.5 },
  { date: '2024-01-14', tasksComplete: 87.3, reassessments: 94.6, staffCompliance: 89.2 }
];

const missedInterventionsData = [
  { intervention: "Physical Therapy Session", frequency: 18, impact: "High", avgDelay: "2.3 days", primaryReason: "Staff shortage" },
  { intervention: "Medication Review", frequency: 12, impact: "High", avgDelay: "1.8 days", primaryReason: "Physician availability" },
  { intervention: "Nutrition Consultation", frequency: 15, impact: "Medium", avgDelay: "3.1 days", primaryReason: "Scheduling conflict" },
  { intervention: "Social Services", frequency: 8, impact: "Medium", avgDelay: "2.5 days", primaryReason: "Resource limitation" },
  { intervention: "Wound Care", frequency: 6, impact: "High", avgDelay: "0.8 days", primaryReason: "Supply shortage" }
];

const communityBreakdownData = [
  { community: "Sunrise Manor", totalPlans: 145, completeRate: 91.2, overduePlans: 8, avgCompletionTime: "2.1 days" },
  { community: "Golden Valley", totalPlans: 132, completeRate: 84.8, overduePlans: 15, avgCompletionTime: "2.8 days" },
  { community: "Maple Ridge", totalPlans: 167, completeRate: 93.5, overduePlans: 6, avgCompletionTime: "1.9 days" },
  { community: "Oak Haven", totalPlans: 128, completeRate: 82.1, overduePlans: 18, avgCompletionTime: "3.2 days" },
  { community: "Pine Grove", totalPlans: 156, completeRate: 88.9, overduePlans: 11, avgCompletionTime: "2.4 days" }
];

export default function CarePlanComplianceDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("alerted-plans");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Care & Compliance", href: "/#care-compliance" },
    { label: "Care Plan Compliance" }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
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
                <div className="p-2 rounded-lg bg-green-100">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Care Plan Compliance</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Portfolio Average: 87.3%
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Improving</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last updated: 5 minutes ago
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
                    <TableHead>Tasks Complete %</TableHead>
                    <TableHead>Reassessment Rate</TableHead>
                    <TableHead>Staff Compliance</TableHead>
                    <TableHead>Notes Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityData.map((community, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{community.community}</TableCell>
                      <TableCell className={community.tasksComplete < 85 ? "text-red-600" : ""}>{community.tasksComplete}%</TableCell>
                      <TableCell className={community.reassessmentRate < 95 ? "text-yellow-600" : ""}>{community.reassessmentRate}%</TableCell>
                      <TableCell className={community.staffCompliance < 85 ? "text-red-600" : ""}>{community.staffCompliance}%</TableCell>
                      <TableCell className={community.notesScore < 8 ? "text-red-600" : ""}>{community.notesScore}</TableCell>
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
            <TabsTrigger value="alerted-plans">Alerted Plans</TabsTrigger>
            <TabsTrigger value="compliance-timeline">Compliance Timeline</TabsTrigger>
            <TabsTrigger value="missed-interventions">Missed Interventions</TabsTrigger>
            <TabsTrigger value="community-breakdown">Community Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="alerted-plans" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Care Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident</TableHead>
                      <TableHead>Plan Type</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Assigned Staff</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertedPlansData.map((plan, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{plan.resident}</TableCell>
                        <TableCell>{plan.planType}</TableCell>
                        <TableCell className={plan.daysOverdue > 3 ? "text-red-600 font-medium" : "text-yellow-600"}>{plan.daysOverdue}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{plan.lastUpdate}</TableCell>
                        <TableCell>{plan.assignedStaff}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(plan.priority)}>
                            {plan.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance-timeline" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  7-Day Compliance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={complianceTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="tasksComplete" stroke="#3b82f6" name="Tasks Complete %" />
                    <Line type="monotone" dataKey="reassessments" stroke="#10b981" name="Reassessments %" />
                    <Line type="monotone" dataKey="staffCompliance" stroke="#f59e0b" name="Staff Compliance %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missed-interventions" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Missed Interventions Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intervention Type</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Impact Level</TableHead>
                      <TableHead>Avg Delay</TableHead>
                      <TableHead>Primary Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missedInterventionsData.map((intervention, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{intervention.intervention}</TableCell>
                        <TableCell className={intervention.frequency > 15 ? "text-red-600" : ""}>{intervention.frequency}</TableCell>
                        <TableCell className={getImpactColor(intervention.impact)}>{intervention.impact}</TableCell>
                        <TableCell>{intervention.avgDelay}</TableCell>
                        <TableCell className="text-sm">{intervention.primaryReason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community-breakdown" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Care Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Community</TableHead>
                      <TableHead>Total Plans</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Overdue Plans</TableHead>
                      <TableHead>Avg Completion Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communityBreakdownData.map((community, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{community.community}</TableCell>
                        <TableCell>{community.totalPlans}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={community.completeRate < 85 ? "text-red-600" : ""}>{community.completeRate}%</span>
                            <Progress value={community.completeRate} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className={community.overduePlans > 15 ? "text-red-600" : community.overduePlans > 10 ? "text-yellow-600" : ""}>{community.overduePlans}</TableCell>
                        <TableCell className={parseFloat(community.avgCompletionTime) > 3 ? "text-red-600" : ""}>{community.avgCompletionTime}</TableCell>
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