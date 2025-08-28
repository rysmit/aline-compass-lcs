import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, AlertTriangle, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Executive Overview", href: "/dashboard" },
  { label: "Churn Risk Score", href: "/metric/churn-risk-score" }
];

const riskTrendData = [
  { month: 'Jul', avgRisk: 3.2, highRisk: 45, criticalRisk: 12 },
  { month: 'Aug', avgRisk: 3.4, highRisk: 52, criticalRisk: 15 },
  { month: 'Sep', avgRisk: 3.1, highRisk: 41, criticalRisk: 9 },
  { month: 'Oct', avgRisk: 3.6, highRisk: 58, criticalRisk: 18 },
  { month: 'Nov', avgRisk: 3.8, highRisk: 67, criticalRisk: 23 },
  { month: 'Dec', avgRisk: 3.5, highRisk: 61, criticalRisk: 19 },
];

const residentRiskData = [
  { 
    resident: 'Margaret Johnson', 
    unit: 'A-304', 
    riskScore: 8.7, 
    lastInteraction: '3 days ago',
    adlChange: '+2 levels',
    paymentStatus: 'Current',
    primaryFlag: 'Family complaints',
    community: 'Sunrise Manor'
  },
  { 
    resident: 'Robert Chen', 
    unit: 'B-156', 
    riskScore: 8.2, 
    lastInteraction: '1 week ago',
    adlChange: '+1 level',
    paymentStatus: '15 days late',
    primaryFlag: 'Care dissatisfaction',
    community: 'Heritage Hills'
  },
  { 
    resident: 'Dorothy Williams', 
    unit: 'C-221', 
    riskScore: 7.9, 
    lastInteraction: '5 days ago',
    adlChange: 'No change',
    paymentStatus: 'Current',
    primaryFlag: 'Social isolation',
    community: 'Golden Years'
  },
  { 
    resident: 'James Davis', 
    unit: 'A-102', 
    riskScore: 7.6, 
    lastInteraction: '2 days ago',
    adlChange: '+3 levels',
    paymentStatus: 'Current',
    primaryFlag: 'Multiple transfers',
    community: 'Prairie View'
  },
];

const riskFactorDistribution = [
  { factor: 'Family Complaints', count: 23, percentage: 34.3, severity: 'High' },
  { factor: 'Care Dissatisfaction', count: 18, percentage: 26.9, severity: 'High' },
  { factor: 'Payment Issues', count: 12, percentage: 17.9, severity: 'Medium' },
  { factor: 'Social Isolation', count: 8, percentage: 11.9, severity: 'Medium' },
  { factor: 'Health Decline', count: 6, percentage: 9.0, severity: 'Low' },
];

const interventionHistory = [
  { month: 'Jul', attempted: 45, successful: 32, retention: 71.1 },
  { month: 'Aug', attempted: 52, successful: 38, retention: 73.1 },
  { month: 'Sep', attempted: 41, successful: 34, retention: 82.9 },
  { month: 'Oct', attempted: 58, successful: 41, retention: 70.7 },
  { month: 'Nov', attempted: 67, successful: 48, retention: 71.6 },
  { month: 'Dec', attempted: 61, successful: 45, retention: 73.8 },
];

const scoreTimelineData = [
  { week: 'Week 1', resident1: 6.2, resident2: 7.1, resident3: 5.8, resident4: 8.1 },
  { week: 'Week 2', resident1: 6.8, resident2: 7.4, resident3: 6.2, resident4: 8.3 },
  { week: 'Week 3', resident1: 7.2, resident2: 7.8, resident3: 6.8, resident4: 8.5 },
  { week: 'Week 4', resident1: 7.8, resident2: 8.2, resident3: 7.4, resident4: 8.7 },
];

export function ChurnRiskScoreDetail() {
  return (
    <div className="space-y-6 p-6">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      {/* Primary Metric Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Churn Risk Score
                <Badge variant="destructive" className="text-sm font-normal">3.5/10</Badge>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                <span className="text-destructive">61 residents at high risk</span>
                <span className="text-muted-foreground">•</span>
                <span>Last updated: Dec 15, 2024 6:00 AM</span>
                <Info className="h-4 w-4 text-muted-foreground" />
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
          title="Risk Flags by Resident"
          value="61"
          change={{
            value: "+6 residents",
            type: "negative",
            period: "vs last month"
          }}
          subtitle="High-risk population"
          calculation="Number of residents with risk scores above 7.0, indicating elevated probability of churn within 90 days based on predictive model."
        />
        
        <KPICard
          title="Last Interaction"
          value="4.2 days"
          change={{
            value: "+1.1 days",
            type: "negative",
            period: "average gap"
          }}
          subtitle="Since last contact"
          calculation="Average days since last meaningful interaction (call, visit, service) with high-risk residents. Longer gaps correlate with higher churn risk."
        />
        
        <KPICard
          title="Change in ADLs"
          value="23"
          change={{
            value: "+8 residents",
            type: "negative",
            period: "care level increase"
          }}
          subtitle="Recent care escalation"
          calculation="Number of residents with recent increases in Activities of Daily Living (ADL) support needs, often triggering family concerns about cost and care adequacy."
        />
        
        <KPICard
          title="Payment Patterns"
          value="12"
          change={{
            value: "+3 accounts",
            type: "negative",
            period: "payment issues"
          }}
          subtitle="Financial stress indicators"
          calculation="Residents showing payment delays, rate shopping inquiries, or family financial discussions indicating potential move-out due to cost concerns."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>High-Risk Resident Analysis</CardTitle>
              <CardDescription>Individual risk assessment and intervention opportunities</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Residents</SelectItem>
                  <SelectItem value="critical">Critical (8+)</SelectItem>
                  <SelectItem value="high">High (6-8)</SelectItem>
                  <SelectItem value="medium">Medium (4-6)</SelectItem>
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
                <TableHead>Resident</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>ADL Change</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Primary Flag</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residentRiskData.map((resident, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{resident.resident}</TableCell>
                  <TableCell>{resident.unit}</TableCell>
                  <TableCell>
                    <Badge variant={
                      resident.riskScore >= 8 ? 'destructive' :
                      resident.riskScore >= 6 ? 'destructive' :
                      'secondary'
                    }>
                      {resident.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>{resident.lastInteraction}</TableCell>
                  <TableCell className={resident.adlChange.includes('+') ? 'text-red-600' : 'text-muted-foreground'}>
                    {resident.adlChange}
                  </TableCell>
                  <TableCell className={resident.paymentStatus !== 'Current' ? 'text-red-600' : 'text-green-600'}>
                    {resident.paymentStatus}
                  </TableCell>
                  <TableCell>{resident.primaryFlag}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Resident Score Timeline</TabsTrigger>
          <TabsTrigger value="history">Risk History</TabsTrigger>
          <TabsTrigger value="contact">Family Contact Records</TabsTrigger>
          <TabsTrigger value="adjustments">Service Adjustments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          <ChartContainer
            title="Risk Score Timeline"
            description="Individual resident risk score progression over 4 weeks"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[5, 9]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="resident1" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Margaret J." />
                <Line type="monotone" dataKey="resident2" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Robert C." />
                <Line type="monotone" dataKey="resident3" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Dorothy W." />
                <Line type="monotone" dataKey="resident4" stroke="hsl(var(--chart-4))" strokeWidth={2} name="James D." />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Risk Factor Distribution"
              description="Primary risk factors across high-risk residents"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskFactorDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="factor" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer
              title="Intervention Success Rate"
              description="Monthly retention efforts and outcomes"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={interventionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="retention" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Retention %" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Family Contact Summary</CardTitle>
              <CardDescription>Recent family interactions and concerns for high-risk residents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {residentRiskData.slice(0, 3).map((resident, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{resident.resident}</div>
                        <div className="text-sm text-muted-foreground">{resident.community} - {resident.unit}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Risk: {resident.riskScore}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <div className="mb-1"><strong>Last Contact:</strong> {resident.lastInteraction}</div>
                      <div className="mb-1"><strong>Primary Concern:</strong> {resident.primaryFlag}</div>
                      <div><strong>Follow-up Required:</strong> Family meeting scheduled within 48 hours</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments">
          <ChartContainer
            title="Risk Trend Analysis"
            description="Portfolio risk levels and intervention volume over time"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="avgRisk" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Avg Risk Score" />
                <Line yAxisId="right" type="monotone" dataKey="highRisk" stroke="hsl(var(--chart-2))" strokeWidth={2} name="High Risk Count" />
                <Line yAxisId="right" type="monotone" dataKey="criticalRisk" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Critical Risk Count" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}