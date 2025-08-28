import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, Activity, AlertTriangle, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Census & Occupancy", href: "/dashboard" },
  { label: "Readmission Rate", href: "/metric/readmission-rate" }
];

const readmissionTrendData = [
  { month: 'Jul', rate: 12.4, target: 10.0, admissions: 267, readmissions: 33, industry: 11.8 },
  { month: 'Aug', rate: 13.1, target: 10.0, admissions: 289, readmissions: 38, industry: 11.8 },
  { month: 'Sep', rate: 11.7, target: 10.0, admissions: 234, readmissions: 27, industry: 11.8 },
  { month: 'Oct', rate: 14.2, target: 10.0, admissions: 298, readmissions: 42, industry: 11.8 },
  { month: 'Nov', rate: 15.6, target: 10.0, admissions: 312, readmissions: 49, industry: 11.8 },
  { month: 'Dec', rate: 13.8, target: 10.0, admissions: 276, readmissions: 38, industry: 11.8 },
];

const diagnosisBreakdown = [
  { diagnosis: 'Heart Failure', count: 89, percentage: 23.4, avgDays: 18.7, preventable: 67 },
  { diagnosis: 'Pneumonia', count: 67, percentage: 17.6, avgDays: 14.2, preventable: 45 },
  { diagnosis: 'UTI/Sepsis', count: 54, percentage: 14.2, avgDays: 12.1, preventable: 38 },
  { diagnosis: 'Falls/Fractures', count: 43, percentage: 11.3, avgDays: 21.4, preventable: 32 },
  { diagnosis: 'Medication Issues', count: 38, percentage: 10.0, avgDays: 8.9, preventable: 35 },
  { diagnosis: 'Dehydration', count: 32, percentage: 8.4, avgDays: 6.3, preventable: 28 },
  { diagnosis: 'Other', count: 57, percentage: 15.0, avgDays: 11.8, preventable: 22 },
];

const preventiveActions = [
  { month: 'Jul', readmissions: 33, preventive: 12, success: 8, successRate: 66.7 },
  { month: 'Aug', readmissions: 38, preventive: 18, success: 13, successRate: 72.2 },
  { month: 'Sep', readmissions: 27, preventive: 15, success: 12, successRate: 80.0 },
  { month: 'Oct', readmissions: 42, preventive: 23, success: 16, successRate: 69.6 },
  { month: 'Nov', readmissions: 49, preventive: 28, success: 21, successRate: 75.0 },
  { month: 'Dec', readmissions: 38, preventive: 24, success: 19, successRate: 79.2 },
];

const facilityTrendData = [
  { facility: 'Memorial Hospital', readmissions: 89, rate: 15.2, relationship: 'Primary', distance: 2.3 },
  { facility: 'Regional Medical', readmissions: 67, rate: 12.4, relationship: 'Preferred', distance: 4.1 },
  { facility: 'City General', readmissions: 54, rate: 18.7, relationship: 'Secondary', distance: 6.8 },
  { facility: 'University Health', readmissions: 43, rate: 11.9, relationship: 'Specialty', distance: 8.2 },
  { facility: 'Community Hospital', readmissions: 38, rate: 14.6, relationship: 'Secondary', distance: 5.4 },
];

const riskFactorData = [
  { factor: 'Multiple Comorbidities', impact: 'High', prevalence: 78, interventions: 23 },
  { factor: 'Medication Non-compliance', impact: 'High', prevalence: 65, interventions: 45 },
  { factor: 'Poor Social Support', impact: 'Medium', prevalence: 54, interventions: 18 },
  { factor: 'Previous Readmissions', impact: 'High', prevalence: 43, interventions: 32 },
  { factor: 'Cognitive Impairment', impact: 'Medium', prevalence: 38, interventions: 15 },
  { factor: 'Age 85+', impact: 'Medium', prevalence: 72, interventions: 8 },
];

const communityReadmissionData = [
  { region: 'Southeast', community: 'Sunrise Manor', admissions: 45, readmissions: 8, rate: 17.8, target: 10.0, trend: 'up', riskLevel: 'High' },
  { region: 'Texas', community: 'Heritage Hills', admissions: 67, readmissions: 7, rate: 10.4, target: 10.0, trend: 'stable', riskLevel: 'Low' },
  { region: 'Midwest', community: 'Prairie View', admissions: 38, readmissions: 3, rate: 7.9, target: 10.0, trend: 'down', riskLevel: 'Low' },
  { region: 'Southeast', community: 'Golden Years', admissions: 52, readmissions: 9, rate: 17.3, target: 10.0, trend: 'up', riskLevel: 'High' },
  { region: 'Texas', community: 'Oak Grove', admissions: 41, readmissions: 4, rate: 9.8, target: 10.0, trend: 'stable', riskLevel: 'Low' },
  { region: 'Midwest', community: 'Meadowbrook', admissions: 33, readmissions: 7, rate: 21.2, target: 10.0, trend: 'up', riskLevel: 'Critical' },
];

export function ReadmissionRateDetail() {
  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        <DrillDownBreadcrumb items={breadcrumbItems} />
        
        {/* Primary Metric Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  30-Day Readmission Rate
                  <Badge variant="destructive" className="text-sm font-normal">13.8%</Badge>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="text-destructive">+3.8% above target (10.0%)</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calculation: (30-day readmissions / total admissions) × 100<br/>
                      Source: Care Management & Hospital Systems<br/>
                      Updated daily with discharge notifications</p>
                    </TooltipContent>
                  </UITooltip>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter Period
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Top 4 Supporting Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="30-Day Readmits"
            value="38"
            change={{
              value: "+11 cases",
              type: "negative",
              period: "vs last month"
            }}
            subtitle="Total readmissions"
            calculation="Total number of residents readmitted to hospital within 30 days of previous discharge across all communities."
          />
          
          <KPICard
            title="By Diagnosis"
            value="23.4%"
            change={{
              value: "Heart failure",
              type: "neutral",
              period: "top diagnosis"
            }}
            subtitle="Leading cause"
            calculation="Distribution of readmissions by primary diagnosis. Heart failure represents highest volume of preventable readmissions."
          />
          
          <KPICard
            title="Hospital vs In-House"
            value="89%"
            change={{
              value: "External hospital",
              type: "neutral",
              period: "admission source"
            }}
            subtitle="Acute care origin"
            calculation="Percentage of readmissions originating from external hospitals vs in-house skilled nursing or rehabilitation services."
          />
          
          <KPICard
            title="Preventive Actions"
            value="24"
            change={{
              value: "79.2% success",
              type: "positive",
              period: "intervention rate"
            }}
            subtitle="Risk interventions"
            calculation="Number of preventive interventions attempted for high-risk residents and their success rate in avoiding readmission."
          />
        </div>

        {/* Detailed Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Community Readmission Analysis</CardTitle>
                <CardDescription>30-day readmission rates by community and risk factors</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Admissions</TableHead>
                  <TableHead>Readmissions</TableHead>
                  <TableHead>Rate %</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityReadmissionData.map((community, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{community.region}</TableCell>
                    <TableCell>{community.community}</TableCell>
                    <TableCell>{community.admissions}</TableCell>
                    <TableCell>{community.readmissions}</TableCell>
                    <TableCell className="font-medium">{community.rate}%</TableCell>
                    <TableCell>{community.target}%</TableCell>
                    <TableCell>
                      <span className={
                        community.trend === 'up' ? 'text-red-600' :
                        community.trend === 'down' ? 'text-green-600' :
                        'text-muted-foreground'
                      }>
                        {community.trend === 'up' ? '↗' : community.trend === 'down' ? '↘' : '→'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        community.riskLevel === 'Critical' ? 'destructive' :
                        community.riskLevel === 'High' ? 'destructive' :
                        'default'
                      }>
                        {community.riskLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabbed Secondary Metrics */}
        <Tabs defaultValue="flags" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flags">Readmission Flags</TabsTrigger>
            <TabsTrigger value="root-cause">Root Cause Analysis</TabsTrigger>
            <TabsTrigger value="compliance">Compliance View</TabsTrigger>
            <TabsTrigger value="facility">Facility Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flags">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Readmission Trend vs Target"
                description="Monthly readmission rates compared to target and industry"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={readmissionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Actual Rate" />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                    <Line type="monotone" dataKey="industry" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="3 3" name="Industry Avg" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>High-Risk Factors</CardTitle>
                  <CardDescription>Primary risk factors for readmission</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riskFactorData.slice(0, 4).map((factor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{factor.factor}</span>
                          <Badge variant={factor.impact === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                            {factor.impact}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{factor.prevalence}%</div>
                          <div className="text-xs text-muted-foreground">{factor.interventions} interventions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="root-cause">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Readmissions by Diagnosis"
                description="Primary diagnoses causing readmissions"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diagnosisBreakdown.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ diagnosis, percentage }) => `${diagnosis}: ${percentage}%`}
                    >
                      {diagnosisBreakdown.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} cases`, 'Readmissions']} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Diagnosis Analysis</CardTitle>
                  <CardDescription>Readmission patterns by primary diagnosis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Cases</TableHead>
                        <TableHead>Avg Days</TableHead>
                        <TableHead>Preventable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {diagnosisBreakdown.slice(0, 5).map((diagnosis, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{diagnosis.diagnosis}</TableCell>
                          <TableCell>{diagnosis.count}</TableCell>
                          <TableCell>{diagnosis.avgDays}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {Math.round((diagnosis.preventable / diagnosis.count) * 100)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <ChartContainer
              title="Preventive Action Success Rate"
              description="Monthly intervention attempts and success rates"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={preventiveActions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="preventive" fill="hsl(var(--chart-1))" name="Interventions Attempted" />
                  <Bar dataKey="success" fill="hsl(var(--chart-2))" name="Successful Interventions" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="facility">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Facility Analysis</CardTitle>
                <CardDescription>Readmission patterns by referring hospital</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital Facility</TableHead>
                      <TableHead>Readmissions</TableHead>
                      <TableHead>Rate %</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilityTrendData.map((facility, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{facility.facility}</TableCell>
                        <TableCell>{facility.readmissions}</TableCell>
                        <TableCell>{facility.rate}%</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {facility.relationship}
                          </Badge>
                        </TableCell>
                        <TableCell>{facility.distance} mi</TableCell>
                        <TableCell>
                          <Badge variant={facility.rate <= 12.0 ? 'default' : facility.rate <= 15.0 ? 'secondary' : 'destructive'}>
                            {facility.rate <= 12.0 ? 'Good' : facility.rate <= 15.0 ? 'Average' : 'Poor'}
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
    </TooltipProvider>
  );
}