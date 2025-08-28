import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbItems = [
  { label: "Dashboard", href: "/" },
  { label: "Executive Overview", href: "/" },
  { label: "Move-In Velocity", href: "/metric/move-in-velocity" }
];

const velocityTrendData = [
  { month: 'Jul', velocity: 28.5, target: 25.0, inquiries: 245, tours: 89, moveIns: 42 },
  { month: 'Aug', velocity: 31.2, target: 25.0, inquiries: 267, tours: 98, moveIns: 45 },
  { month: 'Sep', velocity: 24.8, target: 25.0, inquiries: 289, tours: 112, moveIns: 56 },
  { month: 'Oct', velocity: 26.3, target: 25.0, inquiries: 234, tours: 87, moveIns: 38 },
  { month: 'Nov', velocity: 29.7, target: 25.0, inquiries: 256, tours: 94, moveIns: 41 },
  { month: 'Dec', velocity: 27.4, target: 25.0, inquiries: 278, tours: 102, moveIns: 47 },
];

const salesRepData = [
  { rep: 'Sarah Johnson', inquiries: 45, tours: 32, moveIns: 12, conversion: '26.7%', velocity: 23.5, status: 'Excellent' },
  { rep: 'Mike Chen', inquiries: 38, tours: 28, moveIns: 8, conversion: '21.1%', velocity: 29.8, status: 'Good' },
  { rep: 'Lisa Rodriguez', inquiries: 52, tours: 41, moveIns: 15, conversion: '28.8%', velocity: 25.2, status: 'Excellent' },
  { rep: 'David Wilson', inquiries: 41, tours: 25, moveIns: 6, conversion: '14.6%', velocity: 35.7, status: 'Needs Improvement' },
];

const tourGapData = [
  { timeSlot: '9-10 AM', scheduled: 12, completed: 11, gaps: 1, efficiency: 91.7 },
  { timeSlot: '10-11 AM', scheduled: 15, completed: 13, gaps: 2, efficiency: 86.7 },
  { timeSlot: '11-12 PM', scheduled: 18, completed: 17, gaps: 1, efficiency: 94.4 },
  { timeSlot: '1-2 PM', scheduled: 14, completed: 12, gaps: 2, efficiency: 85.7 },
  { timeSlot: '2-3 PM', scheduled: 16, completed: 15, gaps: 1, efficiency: 93.8 },
  { timeSlot: '3-4 PM', scheduled: 13, completed: 11, gaps: 2, efficiency: 84.6 },
];

const bottleneckData = [
  { stage: 'Inquiry Response', avgDays: 1.2, target: 1.0, impact: 'High' },
  { stage: 'Tour Scheduling', avgDays: 3.8, target: 2.5, impact: 'Critical' },
  { stage: 'Tour to Decision', avgDays: 7.4, target: 5.0, impact: 'High' },
  { stage: 'Decision to Move-In', avgDays: 14.7, target: 12.0, impact: 'Medium' },
  { stage: 'Move-In Coordination', avgDays: 2.3, target: 2.0, impact: 'Low' },
];

const inquiryHeatmapData = [
  { hour: '8 AM', monday: 3, tuesday: 4, wednesday: 2, thursday: 5, friday: 4, saturday: 8, sunday: 6 },
  { hour: '10 AM', monday: 5, tuesday: 6, wednesday: 7, thursday: 8, friday: 6, saturday: 12, sunday: 9 },
  { hour: '12 PM', monday: 4, tuesday: 5, wednesday: 6, thursday: 6, friday: 5, saturday: 10, sunday: 8 },
  { hour: '2 PM', monday: 6, tuesday: 7, wednesday: 5, thursday: 4, friday: 7, saturday: 14, sunday: 11 },
  { hour: '4 PM', monday: 8, tuesday: 9, wednesday: 8, thursday: 7, friday: 9, saturday: 15, sunday: 12 },
  { hour: '6 PM', monday: 3, tuesday: 4, wednesday: 3, thursday: 2, friday: 4, saturday: 8, sunday: 6 },
];

export function MoveInVelocityDetail() {
  return (
    <div className="space-y-6 p-6">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      {/* Primary Metric Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Move-In Velocity
                <Badge variant="default" className="text-sm font-normal">27.4 days</Badge>
                <Clock className="h-5 w-5 text-blue-600" />
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                <span className="text-orange-600">+2.4 days above target</span>
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
          title="Inquiry to Move-In Days"
          value="27.4"
          change={{
            value: "+2.4 days",
            type: "negative",
            period: "vs target"
          }}
          subtitle="Average sales cycle"
          calculation="Average time from initial inquiry to completed move-in, including all touchpoints, tours, decision-making, and move-in coordination."
        />
        
        <KPICard
          title="Tour to Move-In %"
          value="24.3%"
          change={{
            value: "+1.8%",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Conversion efficiency"
          calculation="Percentage of prospects who complete a tour and subsequently move in. Key indicator of tour quality and sales effectiveness."
        />
        
        <KPICard
          title="Avg Touchpoints"
          value="8.7"
          change={{
            value: "+1.2 contacts",
            type: "negative",
            period: "vs last month"
          }}
          subtitle="Per successful move-in"
          calculation="Average number of contacts (calls, emails, tours) required to convert an inquiry into a move-in. Indicates sales efficiency."
        />
        
        <KPICard
          title="Pending Inquiries"
          value="47"
          change={{
            value: "+12 prospects",
            type: "positive",
            period: "in pipeline"
          }}
          subtitle="Active opportunities"
          calculation="Current count of active inquiries in the sales pipeline, from initial contact through pending move-in decisions."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Process Bottleneck Analysis</CardTitle>
              <CardDescription>Detailed analysis of sales cycle stages and delays</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="inquiry">Inquiry Response</SelectItem>
                  <SelectItem value="tour">Tour Scheduling</SelectItem>
                  <SelectItem value="decision">Decision Making</SelectItem>
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
                <TableHead>Sales Stage</TableHead>
                <TableHead>Avg Days</TableHead>
                <TableHead>Target Days</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Impact Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bottleneckData.map((stage, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stage.stage}</TableCell>
                  <TableCell>{stage.avgDays}</TableCell>
                  <TableCell>{stage.target}</TableCell>
                  <TableCell className={stage.avgDays > stage.target ? 'text-red-600' : 'text-green-600'}>
                    {stage.avgDays > stage.target ? '+' : ''}{(stage.avgDays - stage.target).toFixed(1)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      stage.impact === 'Critical' ? 'destructive' :
                      stage.impact === 'High' ? 'destructive' :
                      stage.impact === 'Medium' ? 'secondary' :
                      'default'
                    }>
                      {stage.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={stage.avgDays > stage.target ? 'destructive' : 'default'}>
                      {stage.avgDays > stage.target ? 'Behind Target' : 'On Target'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Sales Rep Performance</TabsTrigger>
          <TabsTrigger value="gaps">Tour Gaps</TabsTrigger>
          <TabsTrigger value="bottlenecks">Scheduling Bottlenecks</TabsTrigger>
          <TabsTrigger value="heatmap">Inquiry Heatmap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Sales Representative Performance</CardTitle>
              <CardDescription>Individual sales metrics and velocity analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sales Rep</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Tours</TableHead>
                    <TableHead>Move-Ins</TableHead>
                    <TableHead>Conversion %</TableHead>
                    <TableHead>Avg Velocity</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesRepData.map((rep, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rep.rep}</TableCell>
                      <TableCell>{rep.inquiries}</TableCell>
                      <TableCell>{rep.tours}</TableCell>
                      <TableCell>{rep.moveIns}</TableCell>
                      <TableCell>{rep.conversion}</TableCell>
                      <TableCell>{rep.velocity} days</TableCell>
                      <TableCell>
                        <Badge variant={
                          rep.status === 'Excellent' ? 'default' :
                          rep.status === 'Good' ? 'secondary' :
                          'destructive'
                        }>
                          {rep.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps">
          <ChartContainer
            title="Tour Scheduling Efficiency"
            description="Tour completion rates by time slot"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tourGapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="timeSlot" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="scheduled" fill="hsl(var(--chart-1))" name="Scheduled" />
                <Bar dataKey="completed" fill="hsl(var(--chart-2))" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="bottlenecks">
          <ChartContainer
            title="Move-In Velocity Trend"
            description="Monthly velocity performance vs targets"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={velocityTrendData}>
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
                <Line type="monotone" dataKey="velocity" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Actual Velocity" />
                <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Volume Heatmap</CardTitle>
              <CardDescription>Peak inquiry times by day and hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Darker colors indicate higher inquiry volumes. Use this data to optimize staffing and response times.
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Mon</TableHead>
                    <TableHead>Tue</TableHead>
                    <TableHead>Wed</TableHead>
                    <TableHead>Thu</TableHead>
                    <TableHead>Fri</TableHead>
                    <TableHead>Sat</TableHead>
                    <TableHead>Sun</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiryHeatmapData.map((hour, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{hour.hour}</TableCell>
                      <TableCell>{hour.monday}</TableCell>
                      <TableCell>{hour.tuesday}</TableCell>
                      <TableCell>{hour.wednesday}</TableCell>
                      <TableCell>{hour.thursday}</TableCell>
                      <TableCell>{hour.friday}</TableCell>
                      <TableCell className="font-medium">{hour.saturday}</TableCell>
                      <TableCell className="font-medium">{hour.sunday}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}