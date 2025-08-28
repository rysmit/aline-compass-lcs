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
  DollarSign, 
  AlertTriangle, 
  Info,
  CreditCard
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const topMetrics = [
  {
    title: "High-Risk Revenue",
    subtitle: "At Risk Amount",
    value: "$2.4M",
    change: { value: "-$180K", type: "positive" as const },
    target: "< $2.0M"
  },
  {
    title: "Region Risk Score",
    value: "Medium",
    change: { value: "Stable", type: "neutral" as const },
    target: "Low"
  },
  {
    title: "Billing Flags",
    value: "23",
    change: { value: "-5", type: "positive" as const },
    target: "< 20"
  },
  {
    title: "Payor Issues",
    subtitle: "Active Cases",
    value: "12",
    change: { value: "+3", type: "negative" as const },
    target: "< 10"
  }
];

const historicalLossData = [
  { month: 'Jan', totalRisk: 2800000, actualLoss: 285000, recoveredAmount: 95000 },
  { month: 'Feb', totalRisk: 2650000, actualLoss: 312000, recoveredAmount: 78000 },
  { month: 'Mar', totalRisk: 2750000, actualLoss: 298000, recoveredAmount: 125000 },
  { month: 'Apr', totalRisk: 2900000, actualLoss: 325000, recoveredAmount: 89000 },
  { month: 'May', totalRisk: 2400000, actualLoss: 275000, recoveredAmount: 145000 }
];

const billingRiskData = [
  { week: 'Week 1', denialsRate: 8.2, claimsAtRisk: 145, avgDays: 32 },
  { week: 'Week 2', denialsRate: 9.1, claimsAtRisk: 162, avgDays: 35 },
  { week: 'Week 3', denialsRate: 7.8, claimsAtRisk: 138, avgDays: 28 },
  { week: 'Week 4', denialsRate: 8.9, claimsAtRisk: 156, avgDays: 31 }
];

const regionVulnerability = [
  { region: "Northeast", riskLevel: "High", atRiskRevenue: 785000, primaryRisk: "Medicaid audits", mitigation: "In progress" },
  { region: "Southeast", riskLevel: "Medium", atRiskRevenue: 542000, primaryRisk: "Private pay delays", mitigation: "Monitoring" },
  { region: "Midwest", riskLevel: "Low", atRiskRevenue: 298000, primaryRisk: "Documentation gaps", mitigation: "Addressed" },
  { region: "West", riskLevel: "High", atRiskRevenue: 892000, primaryRisk: "Rate negotiations", mitigation: "Active" },
  { region: "Southwest", riskLevel: "Medium", atRiskRevenue: 467000, primaryRisk: "Compliance review", mitigation: "Scheduled" }
];

const exposureForecast = [
  { period: "Q1 2024", exposure: 2400000, probability: 15, expectedLoss: 360000 },
  { period: "Q2 2024", exposure: 2200000, probability: 12, expectedLoss: 264000 },
  { period: "Q3 2024", exposure: 2500000, probability: 18, expectedLoss: 450000 },
  { period: "Q4 2024", exposure: 2100000, probability: 10, expectedLoss: 210000 }
];

export default function RevenueAtRiskDetail() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("historical-losses");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Forecast & Risk", href: "/#forecast-risk" },
    { label: "Revenue at Risk" }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getMitigationColor = (status: string) => {
    switch (status) {
      case "Addressed": return "bg-green-100 text-green-800";
      case "In progress": return "bg-blue-100 text-blue-800";
      case "Active": return "bg-orange-100 text-orange-800";
      case "Monitoring": return "bg-yellow-100 text-yellow-800";
      case "Scheduled": return "bg-purple-100 text-purple-800";
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
                  <div className="p-2 rounded-lg bg-red-100">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Revenue at Risk</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Total Exposure: $2.4M
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">Requires Attention</span>
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
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="60d">60 Days</SelectItem>
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
            <ChartContainer title="Revenue Risk Trends" description="Monthly risk exposure and actual losses">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={historicalLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Area dataKey="totalRisk" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Total Risk" />
                  <Area dataKey="actualLoss" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Actual Loss" />
                  <Area dataKey="recoveredAmount" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Recovered" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Regional Risk Table */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Regional Risk Vulnerability</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>At-Risk Revenue</TableHead>
                    <TableHead>Primary Risk</TableHead>
                    <TableHead>Mitigation Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionVulnerability.map((region, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{region.region}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRiskColor(region.riskLevel)}>
                          {region.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className={region.atRiskRevenue > 700000 ? "text-red-600" : ""}>
                        ${region.atRiskRevenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{region.primaryRisk}</TableCell>
                      <TableCell>
                        <Badge className={getMitigationColor(region.mitigation)}>
                          {region.mitigation}
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
              <TabsTrigger value="historical-losses">Historical Losses</TabsTrigger>
              <TabsTrigger value="billing-risk">Billing Risk Trend</TabsTrigger>
              <TabsTrigger value="region-vulnerability">Region Vulnerability</TabsTrigger>
              <TabsTrigger value="exposure-forecast">Exposure Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="historical-losses" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Historical Loss Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Total Risk</TableHead>
                        <TableHead>Actual Loss</TableHead>
                        <TableHead>Recovered Amount</TableHead>
                        <TableHead>Loss Rate %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historicalLossData.map((data, index) => {
                        const lossRate = ((data.actualLoss / data.totalRisk) * 100).toFixed(1);
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{data.month}</TableCell>
                            <TableCell>${data.totalRisk.toLocaleString()}</TableCell>
                            <TableCell className="text-red-600">${data.actualLoss.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">${data.recoveredAmount.toLocaleString()}</TableCell>
                            <TableCell className={parseFloat(lossRate) > 10 ? "text-red-600" : "text-green-600"}>
                              {lossRate}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing-risk" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Risk Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Denials Rate Trend</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={billingRiskData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <ChartTooltip />
                          <Line type="monotone" dataKey="denialsRate" stroke="#ef4444" strokeWidth={3} name="Denials Rate %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-4">Claims at Risk</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={billingRiskData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <ChartTooltip />
                          <Bar dataKey="claimsAtRisk" fill="#f59e0b" name="Claims at Risk" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="region-vulnerability" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Regional Vulnerability Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Risk by Region</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={regionVulnerability}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="region" />
                          <YAxis />
                          <ChartTooltip />
                          <Bar dataKey="atRiskRevenue" fill="#ef4444" name="At-Risk Revenue" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Risk Mitigation Status</h4>
                      {regionVulnerability.map((region, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{region.region}</span>
                            <Badge className={getMitigationColor(region.mitigation)}>
                              {region.mitigation}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{region.primaryRisk}</p>
                          <p className="text-sm font-medium mt-1">
                            Risk: ${region.atRiskRevenue.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exposure-forecast" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Future Exposure Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Total Exposure</TableHead>
                        <TableHead>Loss Probability %</TableHead>
                        <TableHead>Expected Loss</TableHead>
                        <TableHead>Risk Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exposureForecast.map((forecast, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{forecast.period}</TableCell>
                          <TableCell>${forecast.exposure.toLocaleString()}</TableCell>
                          <TableCell className={forecast.probability > 15 ? "text-red-600" : "text-green-600"}>
                            {forecast.probability}%
                          </TableCell>
                          <TableCell className="text-red-600">${forecast.expectedLoss.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              forecast.probability > 15 ? "text-red-600" :
                              forecast.probability > 10 ? "text-yellow-600" : "text-green-600"
                            }>
                              {forecast.probability > 15 ? "High" : forecast.probability > 10 ? "Medium" : "Low"}
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
      </div>
    </TooltipProvider>
  );
}