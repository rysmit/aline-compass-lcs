import { useParams } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer as BaseChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  AlertTriangle, 
  Clock, 
  User,
  Calendar,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";

const chartConfig = {
  overdue: {
    label: "Overdue",
    color: "hsl(var(--chart-3))",
  },
  dueToday: {
    label: "Due Today",
    color: "hsl(var(--chart-2))",
  },
  dueSoon: {
    label: "Due Soon",
    color: "hsl(var(--chart-1))",
  },
};

// Mock care compliance data
const complianceByCategory = [
  { category: "Medication", overdue: 12, dueToday: 8, dueSoon: 15 },
  { category: "Assessment", overdue: 7, dueToday: 4, dueSoon: 12 },
  { category: "Care Plan", overdue: 5, dueToday: 3, dueSoon: 8 },
  { category: "Documentation", overdue: 9, dueToday: 6, dueSoon: 14 },
  { category: "Safety Check", overdue: 4, dueToday: 2, dueSoon: 7 },
];

const nonCompliantResidents = [
  {
    id: 1,
    name: "Margaret Wilson",
    unit: "A-304",
    careLevel: "Assisted Living",
    overdueTasks: 3,
    criticalTasks: 1,
    lastUpdate: "2024-01-10",
    tasks: [
      { type: "Medication Review", dueDate: "2024-01-08", status: "overdue", critical: true },
      { type: "Care Plan Update", dueDate: "2024-01-12", status: "overdue", critical: false },
      { type: "Safety Assessment", dueDate: "2024-01-14", status: "overdue", critical: false }
    ]
  },
  {
    id: 2,
    name: "Robert Thompson",
    unit: "B-108",
    careLevel: "Memory Care",
    overdueTasks: 2,
    criticalTasks: 2,
    lastUpdate: "2024-01-09",
    tasks: [
      { type: "Behavioral Assessment", dueDate: "2024-01-07", status: "overdue", critical: true },
      { type: "Family Conference", dueDate: "2024-01-11", status: "overdue", critical: true }
    ]
  },
  {
    id: 3,
    name: "Dorothy Chen",
    unit: "C-205",
    careLevel: "Independent",
    overdueTasks: 2,
    criticalTasks: 0,
    lastUpdate: "2024-01-11",
    tasks: [
      { type: "Annual Physical", dueDate: "2024-01-09", status: "overdue", critical: false },
      { type: "Emergency Contact Update", dueDate: "2024-01-13", status: "overdue", critical: false }
    ]
  }
];

export function CareComplianceDetail() {
  const { alertType } = useParams<{ alertType: string }>();
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Care Compliance Alert" }
  ];

  const getTaskStatusBadge = (status: string, critical: boolean) => {
    if (status === "overdue") {
      return critical ? "destructive" : "secondary";
    }
    return "default";
  };

  const getTaskStatusColor = (status: string) => {
    if (status === "overdue") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Care Compliance Alert
              </h1>
              <p className="text-muted-foreground">
                Multiple residents with overdue care compliance tasks requiring immediate attention
              </p>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Critical
            </Badge>
          </div>
          
          {/* Alert Summary */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">Care Compliance Issues Detected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    37 overdue care tasks across 18 residents, including 8 critical medication and assessment reviews 
                    that require immediate attention to maintain compliance standards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Overdue Tasks"
            value="37"
            subtitle="across all categories"
            change={{ value: "+12", type: "negative", period: "vs last week" }}
            calculation="Total count of care tasks that have passed their due date across all care categories and residents."
          />
          <KPICard
            title="Critical Overdue"
            value="8"
            subtitle="medication & assessments"
            change={{ value: "+3", type: "negative", period: "vs last week" }}
            calculation="Number of high-priority care tasks that are overdue, including medication reviews and critical health assessments requiring immediate attention."
          />
          <KPICard
            title="Affected Residents"
            value="18"
            subtitle="requiring intervention"
            change={{ value: "+5", type: "negative", period: "vs last week" }}
            calculation="Number of individual residents who have one or more overdue care compliance tasks."
          />
          <KPICard
            title="Compliance Rate"
            value="84.3%"
            subtitle="community average"
            change={{ value: "-4.2%", type: "negative", period: "vs last month" }}
            calculation="Percentage of care tasks completed on time, calculated as completed tasks divided by total due tasks over the selected period."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance by Category */}
          <ChartContainer
            title="Tasks by Category"
            description="Breakdown of overdue and upcoming care tasks"
          >
            <BaseChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="overdue" stackId="a" fill="var(--color-overdue)" />
                  <Bar dataKey="dueToday" stackId="a" fill="var(--color-dueToday)" />
                  <Bar dataKey="dueSoon" stackId="a" fill="var(--color-dueSoon)" />
                </BarChart>
              </ResponsiveContainer>
            </BaseChartContainer>
          </ChartContainer>

          {/* Compliance Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Compliance</span>
                    <span className="text-sm font-semibold">84.3%</span>
                  </div>
                  <Progress value={84.3} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Critical Tasks</span>
                    <span className="text-sm font-semibold">76.2%</span>
                  </div>
                  <Progress value={76.2} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Documentation</span>
                    <span className="text-sm font-semibold">89.1%</span>
                  </div>
                  <Progress value={89.1} className="h-3" />
                </div>
              </div>

              <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="destructive" size="sm" className="w-full">
                      Address Critical Tasks (8)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Schedule Assessments
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => window.open('#', '_blank')}
                    >
                      Open Care Management System →
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Generate Compliance Report
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Non-Compliant Residents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-destructive" />
                  Residents Requiring Immediate Attention
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Residents with overdue care compliance tasks
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All ({nonCompliantResidents.length + 15})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nonCompliantResidents.map((resident) => (
                <Card key={resident.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{resident.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Unit {resident.unit}</span>
                            <span>•</span>
                            <span>{resident.careLevel}</span>
                            <span>•</span>
                            <span>Last update: {new Date(resident.lastUpdate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="destructive">
                          {resident.overdueTasks} Overdue
                        </Badge>
                        {resident.criticalTasks > 0 && (
                          <Badge variant="destructive" className="block">
                            {resident.criticalTasks} Critical
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Overdue Tasks:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {resident.tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              {task.critical ? (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{task.type}</span>
                            </div>
                            <div className="text-right">
                              <Badge variant={getTaskStatusBadge(task.status, task.critical)} className="text-xs">
                                Due {new Date(task.dueDate).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open('#', '_blank')}
                      >
                        Update in EHR →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}