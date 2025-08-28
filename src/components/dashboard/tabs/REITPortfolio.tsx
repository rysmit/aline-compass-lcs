import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer } from "../ChartContainer";
import { AlertCard } from "../AlertCard";
import { KPICard } from "../KPICard";
import { REITAccessBanner } from "@/components/auth/REITAccessBanner";
import { AccessRestrictedOverlay, RestrictedMetricDisplay } from "@/components/auth/AccessRestrictedOverlay";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Users, 
  AlertTriangle,
  Building2,
  BarChart3,
  Clock,
  Info,
  Eye,
  Target,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";

interface REITPortfolioProps {
  filters: Record<string, string>;
}

// Mock data for REIT dashboard
const topMetrics = [
  {
    title: "Net Operating Income",
    value: "$248.5M",
    change: "+8.2%",
    trend: "up",
    period: "T12M",
    sources: ["CRM", "PMS", "Financial"],
    lastSync: "2 min ago",
    alert: false
  },
  {
    title: "NOI Margin",
    value: "68.4%",
    change: "+2.1%", 
    trend: "up",
    period: "Current",
    sources: ["Financial"],
    lastSync: "5 min ago",
    alert: false
  },
  {
    title: "Portfolio Occupancy",
    value: "91.7%",
    change: "-1.3%",
    trend: "down",
    period: "vs Market 89.2%",
    sources: ["PMS", "CRM"],
    lastSync: "1 min ago",
    alert: true
  },
  {
    title: "RevPAU YOY",
    value: "$4,125",
    change: "+12.8%",
    trend: "up", 
    period: "per unit",
    sources: ["Financial", "PMS"],
    lastSync: "3 min ago",
    alert: false
  },
  {
    title: "High-Risk Assets",
    value: "14",
    change: "+3",
    trend: "down",
    period: "Communities",
    sources: ["AI Analytics"],
    lastSync: "15 min ago",
    alert: true
  }
];

const portfolioData = [
  {
    operator: "Senior Living Partners",
    communities: 42,
    noi: "$89.2M",
    occupancy: "93.1%",
    careMix: "IL: 60%, AL: 35%, MC: 5%",
    laborCost: "32.1%",
    riskScore: "Low",
    region: "Southeast"
  },
  {
    operator: "Heritage Care Group", 
    communities: 28,
    noi: "$67.8M",
    occupancy: "88.7%",
    careMix: "IL: 45%, AL: 40%, MC: 15%",
    laborCost: "38.2%",
    riskScore: "Medium",
    region: "Northeast"
  },
  {
    operator: "Sunrise Communities",
    communities: 35,
    noi: "$91.5M", 
    occupancy: "92.8%",
    careMix: "IL: 55%, AL: 35%, MC: 10%",
    laborCost: "34.7%",
    riskScore: "Low",
    region: "West"
  }
];

const trendData = [
  { month: "Jan", portfolioOcc: 92.1, marketAvg: 89.8, operatorAvg: 91.2 },
  { month: "Feb", portfolioOcc: 91.8, marketAvg: 89.5, operatorAvg: 90.9 },
  { month: "Mar", portfolioOcc: 92.3, marketAvg: 90.1, operatorAvg: 91.5 },
  { month: "Apr", portfolioOcc: 91.9, marketAvg: 89.7, operatorAvg: 91.1 },
  { month: "May", portfolioOcc: 92.7, marketAvg: 90.3, operatorAvg: 91.8 },
  { month: "Jun", portfolioOcc: 91.7, marketAvg: 89.2, operatorAvg: 90.8 }
];

const operatorComparison = [
  { metric: "NOI Margin", slp: "71.2%", heritage: "65.8%", sunrise: "69.4%", benchmark: "68.0%" },
  { metric: "Move-in Velocity", slp: "2.3 days", heritage: "3.8 days", sunrise: "2.7 days", benchmark: "3.2 days" },
  { metric: "Census Stability", slp: "96.2%", heritage: "92.1%", sunrise: "94.8%", benchmark: "94.5%" },
  { metric: "Compliance Events", slp: "2", heritage: "7", sunrise: "4", benchmark: "≤5" }
];

const aiInsights = [
  {
    title: "Occupancy Risk Alert",
    description: "5 communities with >10% occupancy decline in 60 days",
    priority: "high",
    communities: ["Sunset Manor", "Oak Ridge", "Pine Valley", "Maple Gardens", "Cedar Heights"]
  },
  {
    title: "NOI Erosion Pattern",
    description: "2 operators showing NOI erosion with rising care costs",
    priority: "medium", 
    operators: ["Heritage Care Group", "Regional Senior Living"]
  },
  {
    title: "Labor Cost Benchmark Exceeded",
    description: "Operator X exceeding labor benchmark in 4 regions",
    priority: "high",
    operator: "Heritage Care Group",
    regions: ["Northeast", "Mid-Atlantic", "Southeast", "Midwest"]
  }
];

export function REITPortfolio({ filters }: REITPortfolioProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccessToMetric, isAccessRestricted, getAccessibleCommunities } = useAccessControl();
  const [activeInsight, setActiveInsight] = useState<number | null>(null);

  // Filter data based on access control
  const accessibleCommunities = getAccessibleCommunities();
  const isREITUser = user?.role === 'reit-investor';

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'outline';
      case 'medium': return 'secondary'; 
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleRestrictedClick = () => {
    // Handle clicks on restricted content
  };

  return (
    <div className="space-y-6">
      {/* Access Control Banner for REIT Users */}
      {isREITUser && <REITAccessBanner />}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {hasAccessToMetric('noi') ? (
          <KPICard
            title="Net Operating Income"
            value="$248.5M"
            change={{
              value: "+8.2%",
              type: "positive",
              period: "T12M"
            }}
            subtitle="Trailing 12 months"
            calculation="Total rental income minus operating expenses excluding capital expenditures and debt service"
            sourceSystems={["CRM", "PMS", "Financial"]}
            lastSynced="2025-01-05T14:35:00Z"
            clickable={true}
            onClick={() => navigate("/drilldown/reit-noi")}
            whyMatters="NOI is the primary measure of property performance and cash flow generation. It directly impacts property valuations and investor returns."
          />
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <RestrictedMetricDisplay metricName="Net Operating Income" />
          </Card>
        )}
        
        {hasAccessToMetric('operating_margin') ? (
          <KPICard
            title="NOI Margin"
            value="68.4%"
            change={{
              value: "+2.1%",
              type: "positive",
              period: "vs last quarter"
            }}
            subtitle="Operating efficiency"
            calculation="Net Operating Income divided by Total Revenue × 100"
            sourceSystems={["Financial"]}
            lastSynced="2025-01-05T14:32:00Z"
            clickable={true}
            onClick={() => navigate("/drilldown/reit-noi-margin")}
            whyMatters="NOI margin indicates operational efficiency and cost control. Higher margins demonstrate effective expense management and pricing power."
          />
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <RestrictedMetricDisplay metricName="NOI Margin" />
          </Card>
        )}
        
        {hasAccessToMetric('occupancy_rate') ? (
          <KPICard
            title="Portfolio Occupancy"
            value="91.7%"
            change={{
              value: "-1.3%",
              type: "negative",
              period: "vs Market 89.2%"
            }}
            subtitle="Above market average"
            calculation="Total occupied units divided by total available units across portfolio"
            sourceSystems={["PMS", "CRM"]}
            lastSynced="2025-01-05T14:36:00Z"
            clickable={true}
            onClick={() => navigate("/drilldown/reit-occupancy")}
            whyMatters="Portfolio occupancy is the primary driver of rental income and asset valuation. Outperforming market averages demonstrates operational excellence and competitive positioning."
          />
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <RestrictedMetricDisplay metricName="Portfolio Occupancy" />
          </Card>
        )}
        
        {hasAccessToMetric('revpau') ? (
          <KPICard
            title="RevPAU YOY"
            value="$4,125"
            change={{
              value: "+12.8%",
              type: "positive",
              period: "year over year"
            }}
            subtitle="Revenue per available unit"
            calculation="Total revenue divided by total available units on year-over-year basis"
            sourceSystems={["Financial", "PMS"]}
            lastSynced="2025-01-05T14:34:00Z"
            clickable={true}
            onClick={() => navigate("/drilldown/reit-revpau")}
            whyMatters="RevPAU measures pricing power and revenue optimization effectiveness. Growth indicates successful rate management and value-add services expansion."
          />
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <RestrictedMetricDisplay metricName="RevPAU YOY" />
          </Card>
        )}
        
        {hasAccessToMetric('risk_assessment') ? (
          <KPICard
            title="High-Risk Assets"
            value="14"
            change={{
              value: "+3",
              type: "negative",
              period: "communities flagged"
            }}
            subtitle="Require attention"
            calculation="Communities with declining occupancy, rising costs, or compliance issues flagged by AI analysis"
            sourceSystems={["AI Analytics"]}
            lastSynced="2025-01-05T14:22:00Z"
            clickable={true}
            onClick={() => navigate("/drilldown/reit-risk-assets")}
            whyMatters="Early identification of underperforming assets enables timely interventions to protect NOI and preserve asset values. Risk monitoring prevents small issues from becoming major problems."
          />
        ) : (
          <Card className="p-6 flex items-center justify-center">
            <RestrictedMetricDisplay metricName="High-Risk Assets" />
          </Card>
        )}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends & Benchmarks</TabsTrigger>
          <TabsTrigger value="operators">Operator Comparison</TabsTrigger>
          <TabsTrigger value="alerts">Asset-Level Alerts</TabsTrigger>
        </TabsList>

        {/* Portfolio Performance Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Portfolio Performance by Operator
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Filter by Region
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operator</TableHead>
                    <TableHead>Communities</TableHead>
                    <TableHead>NOI</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Care Level Mix</TableHead>
                    <TableHead>Labor Cost %</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.map((operator, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{operator.operator}</TableCell>
                      <TableCell>{operator.communities}</TableCell>
                      <TableCell className="font-semibold text-green-600">{operator.noi}</TableCell>
                      <TableCell>{operator.occupancy}</TableCell>
                      <TableCell className="text-sm">{operator.careMix}</TableCell>
                      <TableCell>{operator.laborCost}</TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(operator.riskScore)}>
                          {operator.riskScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends & Benchmarks Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer 
              title="Occupancy Trends vs Benchmarks"
              description="Portfolio performance compared to market and operator averages"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[85, 95]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="portfolioOcc" stroke="#8884d8" strokeWidth={2} name="Portfolio" />
                  <Line type="monotone" dataKey="marketAvg" stroke="#82ca9d" strokeWidth={2} name="Market Avg" />
                  <Line type="monotone" dataKey="operatorAvg" stroke="#ffc658" strokeWidth={2} name="Operator Avg" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Average Length of Stay</span>
                  <div className="text-right">
                    <div className="font-semibold">18.2 months</div>
                    <div className="text-xs text-green-600">+2.1 vs target</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Average Acuity Score</span>
                  <div className="text-right">
                    <div className="font-semibold">3.4</div>
                    <div className="text-xs text-yellow-600">+0.3 vs baseline</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Move-in Velocity</span>
                  <div className="text-right">
                    <div className="font-semibold">2.8 days</div>
                    <div className="text-xs text-green-600">-0.4 vs target</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operator Comparison Tab */}
        <TabsContent value="operators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Operator Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Senior Living Partners</TableHead>
                    <TableHead>Heritage Care Group</TableHead>
                    <TableHead>Sunrise Communities</TableHead>
                    <TableHead>Industry Benchmark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operatorComparison.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.metric}</TableCell>
                      <TableCell className="text-green-600 font-semibold">{row.slp}</TableCell>
                      <TableCell className="text-red-600">{row.heritage}</TableCell>
                      <TableCell className="text-blue-600">{row.sunrise}</TableCell>
                      <TableCell className="text-muted-foreground">{row.benchmark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asset-Level Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <AlertCard
                key={index}
                title={insight.title}
                description={insight.description}
                type={insight.priority === "high" ? "critical" : insight.priority === "medium" ? "warning" : "info"}
                action={{
                  label: "View Details",
                  onClick: () => setActiveInsight(activeInsight === index ? null : index)
                }}
              />
            ))}
          </div>
          
          {activeInsight !== null && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Alert Details: {aiInsights[activeInsight].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground">{aiInsights[activeInsight].description}</p>
                  
                  {aiInsights[activeInsight].communities && (
                    <div>
                      <h4 className="font-medium mb-2">Affected Communities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights[activeInsight].communities?.map((community, idx) => (
                          <Badge key={idx} variant="outline">{community}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {aiInsights[activeInsight].regions && (
                    <div>
                      <h4 className="font-medium mb-2">Affected Regions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights[activeInsight].regions?.map((region, idx) => (
                          <Badge key={idx} variant="secondary">{region}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-3">
                    <Button size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Acknowledge</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Smart Insights Panel */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-background rounded border">
              <div className="font-medium text-sm">Portfolio Optimization</div>
              <div className="text-xs text-muted-foreground mt-1">
                Consider rebalancing care mix in 3 communities to improve NOI margins by ~$2.1M annually
              </div>
            </div>
            <div className="p-3 bg-background rounded border">
              <div className="font-medium text-sm">Risk Mitigation</div>
              <div className="text-xs text-muted-foreground mt-1">
                Early intervention recommended for 2 operators showing declining census stability
              </div>
            </div>
            <div className="p-3 bg-background rounded border">
              <div className="font-medium text-sm">Market Opportunity</div>
              <div className="text-xs text-muted-foreground mt-1">
                Southeast region showing 15% higher RevPAU growth vs national average
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}