import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Info, Target, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Executive Overview", href: "/dashboard" },
  { label: "Forecast Accuracy", href: "/metric/forecast-accuracy" }
];

const accuracyTrendData = [
  { month: 'Jul', accuracy: 87.2, forecast: 9850, actual: 9847, confidence: 92.5, error: 0.03 },
  { month: 'Aug', accuracy: 89.1, forecast: 9780, actual: 9756, confidence: 94.2, error: 0.25 },
  { month: 'Sep', accuracy: 91.8, forecast: 9875, actual: 9892, confidence: 96.1, error: -0.17 },
  { month: 'Oct', accuracy: 88.3, forecast: 9890, actual: 9945, confidence: 93.7, error: -0.56 },
  { month: 'Nov', accuracy: 85.7, forecast: 10200, actual: 10103, confidence: 91.2, error: 0.95 },
  { month: 'Dec', accuracy: 92.4, forecast: 9820, actual: 9847, confidence: 97.1, error: -0.27 },
];

const regionalAccuracy = [
  { region: 'Southeast', forecast: 2847, actual: 2856, accuracy: 99.7, confidence: 98.2, variance: '+9', status: 'Excellent' },
  { region: 'Texas', forecast: 2456, actual: 2398, accuracy: 97.6, confidence: 96.1, variance: '-58', status: 'Good' },
  { region: 'Midwest', forecast: 1876, actual: 1923, confidence: 94.8, accuracy: 97.5, variance: '+47', status: 'Good' },
  { region: 'Northeast', forecast: 1534, actual: 1489, confidence: 92.3, accuracy: 97.1, variance: '-45', status: 'Good' },
  { region: 'West', forecast: 1107, actual: 1181, confidence: 89.4, accuracy: 93.7, variance: '+74', status: 'Watch' },
];

const confidenceRanges = [
  { period: '30-Day', lower: 9620, forecast: 9847, upper: 10074, actualRange: '±3.2%' },
  { period: '60-Day', lower: 9234, forecast: 9847, upper: 10460, actualRange: '±6.1%' },
  { period: '90-Day', lower: 8892, forecast: 9847, upper: 10802, actualRange: '±9.7%' },
  { period: '6-Month', lower: 8456, forecast: 9847, upper: 11238, actualRange: '±14.1%' },
];

const modelFeatures = [
  { feature: 'Historical Occupancy', weight: 28.5, importance: 'High', dataQuality: 'Good' },
  { feature: 'Seasonal Patterns', weight: 22.1, importance: 'High', dataQuality: 'Good' },
  { feature: 'Move-In Velocity', weight: 18.7, importance: 'Medium', dataQuality: 'Fair' },
  { feature: 'Regional Economics', weight: 12.3, importance: 'Medium', dataQuality: 'Good' },
  { feature: 'Competitive Activity', weight: 9.8, importance: 'Low', dataQuality: 'Poor' },
  { feature: 'Marketing Spend', weight: 8.6, importance: 'Low', dataQuality: 'Fair' },
];

const manualAdjustments = [
  { date: '2024-11-15', community: 'Heritage Hills', adjustment: '+45', reason: 'New competitor delayed opening', impact: 'Positive', accuracy: 94.2 },
  { date: '2024-11-08', community: 'Golden Years', adjustment: '-23', reason: 'Major renovation impact', impact: 'Negative', accuracy: 91.8 },
  { date: '2024-10-22', community: 'Sunrise Manor', adjustment: '+67', reason: 'Marketing campaign boost', impact: 'Positive', accuracy: 96.1 },
  { date: '2024-10-15', community: 'Prairie View', adjustment: '-31', reason: 'Staffing shortage impact', impact: 'Negative', accuracy: 89.7 },
];

export function ForecastAccuracyDetail() {
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
                Forecast Accuracy
                <Badge variant="default" className="text-sm font-normal">92.4%</Badge>
                <Target className="h-5 w-5 text-green-600" />
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                <span className="text-green-600">+4.1% improvement vs last month</span>
                <span className="text-muted-foreground">•</span>
                <span>Last updated: Dec 15, 2024 6:00 AM</span>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Calculation: Statistical accuracy of forecasting model<br/>
                    Source: Predictive Analytics Engine<br/>
                    Updated daily at 6:00 AM</p>
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
          title="Forecast vs. Actual"
          value="9,847"
          change={{
            value: "vs 9,820 forecast",
            type: "positive",
            period: "+27 units variance"
          }}
          subtitle="December actuals"
          calculation="Comparison of forecasted census vs actual census achievement. Positive variance indicates outperformance of predictions."
        />
        
        <KPICard
          title="Model Confidence"
          value="97.1%"
          change={{
            value: "+5.9%",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Prediction reliability"
          calculation="Statistical confidence level of the forecasting model based on historical accuracy, data quality, and prediction intervals."
        />
        
        <KPICard
          title="Data Gaps"
          value="3"
          change={{
            value: "-2 sources",
            type: "positive",
            period: "improved coverage"
          }}
          subtitle="Missing data sources"
          calculation="Number of key data inputs missing or delayed, affecting forecast reliability. Lower count indicates better data completeness."
        />
        
        <KPICard
          title="Manual Adjustments"
          value="8"
          change={{
            value: "+3 overrides",
            type: "neutral",
            period: "this month"
          }}
          subtitle="Expert interventions"
          calculation="Number of manual adjustments made to model predictions based on local market knowledge and special circumstances."
        />
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regional Forecast Performance</CardTitle>
              <CardDescription>Accuracy metrics by geographic region</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="60d">60 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
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
                <TableHead>Forecasted</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Accuracy %</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionalAccuracy.map((region, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{region.region}</TableCell>
                  <TableCell>{region.forecast.toLocaleString()}</TableCell>
                  <TableCell>{region.actual.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{region.accuracy}%</TableCell>
                  <TableCell>{region.confidence}%</TableCell>
                  <TableCell className={region.variance.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {region.variance}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      region.status === 'Excellent' ? 'default' :
                      region.status === 'Good' ? 'secondary' :
                      'destructive'
                    }>
                      {region.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabbed Secondary Metrics */}
      <Tabs defaultValue="region" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="region">Forecast by Region</TabsTrigger>
          <TabsTrigger value="confidence">Confidence Ranges</TabsTrigger>
          <TabsTrigger value="error">Historical Error Rate</TabsTrigger>
          <TabsTrigger value="override">Manual Override Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="region">
          <ChartContainer
            title="Forecast Accuracy Trend"
            description="Monthly accuracy performance with confidence intervals"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Accuracy %" />
                <Line type="monotone" dataKey="confidence" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Confidence %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="confidence">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Confidence Intervals</CardTitle>
              <CardDescription>Prediction ranges by forecast horizon</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Forecast Period</TableHead>
                    <TableHead>Lower Bound</TableHead>
                    <TableHead>Forecast</TableHead>
                    <TableHead>Upper Bound</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Reliability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confidenceRanges.map((range, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{range.period}</TableCell>
                      <TableCell>{range.lower.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{range.forecast.toLocaleString()}</TableCell>
                      <TableCell>{range.upper.toLocaleString()}</TableCell>
                      <TableCell>{range.actualRange}</TableCell>
                      <TableCell>
                        <Badge variant={
                          parseFloat(range.actualRange.replace('±%', '')) < 5 ? 'default' :
                          parseFloat(range.actualRange.replace('±%', '')) < 10 ? 'secondary' :
                          'destructive'
                        }>
                          {parseFloat(range.actualRange.replace('±%', '')) < 5 ? 'High' :
                           parseFloat(range.actualRange.replace('±%', '')) < 10 ? 'Medium' :
                           'Low'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Forecast vs Actual Comparison"
              description="Monthly forecast accuracy with error margins"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-1))" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Model Feature Weights</CardTitle>
                <CardDescription>Input importance and data quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modelFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{feature.feature}</span>
                        <Badge variant="outline" className="text-xs">
                          {feature.importance}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{feature.weight}%</div>
                        <div className="text-xs text-muted-foreground">{feature.dataQuality}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="override">
          <Card>
            <CardHeader>
              <CardTitle>Manual Adjustment History</CardTitle>
              <CardDescription>Expert overrides and their impact on accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Result Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualAdjustments.map((adjustment, index) => (
                    <TableRow key={index}>
                      <TableCell>{adjustment.date}</TableCell>
                      <TableCell className="font-medium">{adjustment.community}</TableCell>
                      <TableCell className={adjustment.adjustment.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {adjustment.adjustment}
                      </TableCell>
                      <TableCell>{adjustment.reason}</TableCell>
                      <TableCell>
                        <Badge variant={adjustment.impact === 'Positive' ? 'default' : 'destructive'}>
                          {adjustment.impact}
                        </Badge>
                      </TableCell>
                      <TableCell>{adjustment.accuracy}%</TableCell>
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