import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { Download, Calendar, AlertTriangle, Building2, Target } from "lucide-react";
import { useState } from "react";

// Sample data for high-risk assets
const riskAssetsData = [
  { community: "Sunset Manor", operator: "Heritage Care", riskScore: 8.2, occupancy: 78.5, noiDecline: -12.8, issues: ["Occupancy", "Staffing"] },
  { community: "Oak Ridge", operator: "Regional SL", riskScore: 7.9, occupancy: 81.2, noiDecline: -8.5, issues: ["Compliance", "Maintenance"] },
  { community: "Pine Valley", operator: "Heritage Care", riskScore: 7.6, occupancy: 83.1, noiDecline: -6.2, issues: ["Occupancy", "Food Service"] },
  { community: "Maple Gardens", operator: "Senior Living Partners", riskScore: 7.3, occupancy: 85.4, noiDecline: -4.1, issues: ["Labor Costs"] },
  { community: "Cedar Heights", operator: "Regional SL", riskScore: 7.1, occupancy: 87.2, noiDecline: -3.8, issues: ["Utilities", "Maintenance"] },
];

const riskTrendData = [
  { month: "Jul", highRisk: 8, mediumRisk: 12, lowRisk: 107 },
  { month: "Aug", highRisk: 11, mediumRisk: 15, lowRisk: 101 },
  { month: "Sep", highRisk: 13, mediumRisk: 18, lowRisk: 96 },
  { month: "Oct", highRisk: 14, mediumRisk: 20, lowRisk: 93 },
  { month: "Nov", highRisk: 16, mediumRisk: 22, lowRisk: 89 },
  { month: "Dec", highRisk: 14, mediumRisk: 19, lowRisk: 94 },
];

const riskFactors = [
  { factor: "Occupancy Decline >5%", communities: 8, avgImpact: 2.3, severity: "High" },
  { factor: "Labor Cost Increase >15%", communities: 6, avgImpact: 1.8, severity: "Medium" },
  { factor: "Compliance Violations", communities: 4, avgImpact: 3.1, severity: "High" },
  { factor: "Maintenance Backlog", communities: 5, avgImpact: 1.2, severity: "Medium" },
  { factor: "Food Service Issues", communities: 3, avgImpact: 0.9, severity: "Low" },
];

export default function REITRiskAssetsDetail() {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "REIT Portfolio", href: "/dashboard" },
    { label: "High-Risk Assets" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        {/* Primary Metric Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  High-Risk Assets Analysis
                  <Badge variant="destructive" className="text-sm font-normal">14 Communities</Badge>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    +3 communities flagged this month
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>Requiring immediate attention</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Last updated: Dec 15, 2024 6:00 AM</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                  <SelectTrigger className="w-36">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Risk Escalation"
            value="+3"
            change={{ value: "New flags", type: "negative", period: "this month" }}
            subtitle="Communities flagged"
            calculation="Number of communities newly flagged as high-risk based on AI analysis"
          />
          <KPICard
            title="Average Risk Score"
            value="7.6"
            change={{ value: "+0.4", type: "negative", period: "vs last month" }}
            subtitle="Out of 10 scale"
            calculation="Average risk score across all flagged communities using AI composite scoring"
          />
          <KPICard
            title="Total Revenue at Risk"
            value="$18.2M"
            change={{ value: "+$2.1M", type: "negative", period: "monthly exposure" }}
            subtitle="Potential NOI impact"
            calculation="Estimated monthly revenue exposure from communities flagged as high-risk"
          />
          <KPICard
            title="Action Items"
            value="23"
            change={{ value: "Priority actions", type: "neutral", period: "pending" }}
            subtitle="Immediate interventions"
            calculation="Number of urgent action items identified across all high-risk properties"
          />
        </div>

        {/* Risk Trend and Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Risk Level Trend"
            description="Monthly progression of risk categories"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="highRisk" stackId="a" fill="hsl(var(--destructive))" name="High Risk" />
                <Bar dataKey="mediumRisk" stackId="a" fill="hsl(var(--chart-2))" name="Medium Risk" />
                <Bar dataKey="lowRisk" stackId="a" fill="hsl(var(--chart-1))" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Risk vs Performance Correlation"
            description="Risk score plotted against occupancy performance"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={riskAssetsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="occupancy" stroke="hsl(var(--muted-foreground))" fontSize={12} name="Occupancy %" />
                <YAxis dataKey="riskScore" stroke="hsl(var(--muted-foreground))" fontSize={12} name="Risk Score" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value, name) => [value, name === 'riskScore' ? 'Risk Score' : 'Occupancy %']}
                />
                <Scatter dataKey="riskScore" fill="hsl(var(--destructive))" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* High-Risk Communities Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>High-Risk Communities Detail</CardTitle>
              <Button variant="outline" size="sm">
                <Building2 className="h-4 w-4 mr-2" />
                View Action Plans
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Community</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead className="text-right">Risk Score</TableHead>
                  <TableHead className="text-right">Occupancy</TableHead>
                  <TableHead className="text-right">NOI Decline</TableHead>
                  <TableHead>Primary Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskAssetsData.map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{asset.community}</TableCell>
                    <TableCell>{asset.operator}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">
                        {asset.riskScore}/10
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600 font-medium">{asset.occupancy}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600 font-medium">{asset.noiDecline}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {asset.issues.map((issue, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Risk Factor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk Factor</TableHead>
                  <TableHead className="text-right">Affected Communities</TableHead>
                  <TableHead className="text-right">Avg Impact Score</TableHead>
                  <TableHead className="text-right">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskFactors.map((factor, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{factor.factor}</TableCell>
                    <TableCell className="text-right">{factor.communities}</TableCell>
                    <TableCell className="text-right">{factor.avgImpact}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          factor.severity === "High" ? "destructive" : 
                          factor.severity === "Medium" ? "secondary" : 
                          "outline"
                        }
                      >
                        {factor.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Plan Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Risk Mitigation Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Immediate Actions (0-30 days)</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Emergency staffing support for 3 communities</li>
                  <li>• Compliance remediation for Oak Ridge</li>
                  <li>• Marketing boost for Sunset Manor</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Short-term (30-90 days)</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Operational efficiency reviews</li>
                  <li>• Management team assessments</li>
                  <li>• Capital improvement planning</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Long-term (90+ days)</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Strategic repositioning analysis</li>
                  <li>• Potential operator transitions</li>
                  <li>• Asset disposition evaluation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}