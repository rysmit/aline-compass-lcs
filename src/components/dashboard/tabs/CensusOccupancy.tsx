import { ChartContainer } from "../ChartContainer";
import { KPICard } from "../KPICard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingDown, Info, ArrowUpDown, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CensusOccupancyProps {
  filters: any;
}

// Strategic data for executive insights
const adcOccupancyTrend = [
  { week: 'W1', adc: 714, occupancy: 89.2, target: 92 },
  { week: 'W2', adc: 718, occupancy: 89.8, target: 92 },
  { week: 'W3', adc: 722, occupancy: 90.3, target: 92 },
  { week: 'W4', adc: 719, occupancy: 89.9, target: 92 },
  { week: 'W5', adc: 724, occupancy: 90.5, target: 92 },
  { week: 'W6', adc: 728, occupancy: 91.0, target: 92 },
  { week: 'W7', adc: 732, occupancy: 91.5, target: 92 },
  { week: 'W8', adc: 718, occupancy: 89.8, target: 92 },
];

const netMoveInsData = [
  { region: 'Northeast', netMoveIns: 24, moveIns: 42, moveOuts: 18 },
  { region: 'Southeast', netMoveIns: 18, moveIns: 35, moveOuts: 17 },
  { region: 'Midwest', netMoveIns: -3, moveIns: 19, moveOuts: 22 },
  { region: 'Southwest', netMoveIns: 15, moveIns: 28, moveOuts: 13 },
  { region: 'West Coast', netMoveIns: 8, moveIns: 24, moveOuts: 16 },
];

const occupancyVarianceData = [
  { region: 'Northeast', actual: 93.2, target: 92.0, variance: 1.2 },
  { region: 'Southeast', actual: 91.8, target: 92.0, variance: -0.2 },
  { region: 'Midwest', actual: 86.4, target: 92.0, variance: -5.6 },
  { region: 'Southwest', actual: 89.7, target: 92.0, variance: -2.3 },
  { region: 'West Coast', actual: 94.1, target: 92.0, variance: 2.1 },
];

const communityMetrics = [
  { 
    region: 'Northeast',
    community: 'Oak Ridge Manor', 
    census: 142, 
    occupancy: 94.2, 
    target: 92.0,
    netMoveIns: 8,
    los: 28.4, 
    rpou: 5840, 
    readmissionRate: 6.2,
    breakEven: 85,
    flagged: false 
  },
  { 
    region: 'Southeast',
    community: 'Sunset Village', 
    census: 89, 
    occupancy: 88.1,
    target: 92.0, 
    netMoveIns: 3,
    los: 22.1, 
    rpou: 5420, 
    readmissionRate: 12.8,
    breakEven: 85,
    flagged: false
  },
  { 
    region: 'Midwest',
    community: 'Garden Terrace', 
    census: 126, 
    occupancy: 83.2,
    target: 92.0,
    netMoveIns: -6,
    los: 18.2, 
    rpou: 4950, 
    readmissionRate: 18.4,
    breakEven: 85,
    flagged: true
  },
  { 
    region: 'Southwest',
    community: 'Meadow Brook', 
    census: 97, 
    occupancy: 85.3,
    target: 92.0,
    netMoveIns: 2,
    los: 19.8, 
    rpou: 5180, 
    readmissionRate: 14.2,
    breakEven: 85,
    flagged: false
  },
  { 
    region: 'West Coast',
    community: 'Heritage Hills', 
    census: 134, 
    occupancy: 92.5,
    target: 92.0,
    netMoveIns: 5,
    los: 35.6, 
    rpou: 6240, 
    readmissionRate: 4.8,
    breakEven: 85,
    flagged: false
  },
  { 
    region: 'Midwest',
    community: 'Willowbrook', 
    census: 78, 
    occupancy: 81.2,
    target: 92.0,
    netMoveIns: -8,
    los: 16.4, 
    rpou: 4720, 
    readmissionRate: 21.6,
    breakEven: 85,
    flagged: true
  },
];

export function CensusOccupancy({ filters }: CensusOccupancyProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof typeof communityMetrics[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const flaggedCommunities = communityMetrics.filter(c => c.flagged || c.occupancy < c.breakEven || c.netMoveIns < -5 || c.los < 20 || c.readmissionRate > 15);
  const portfolioRPOU = communityMetrics.reduce((sum, c) => sum + c.rpou, 0) / communityMetrics.length;
  const totalNetMoveIns = netMoveInsData.reduce((sum, r) => sum + r.netMoveIns, 0);

  // Navigation handlers for drilldown pages
  const handleCensusDrillDown = () => {
    navigate('/metric/census-daily-census');
  };

  const handleOccupancyDrillDown = () => {
    navigate('/metric/census-occupancy-rate');
  };

  const handleLOSDrillDown = () => {
    navigate('/metric/average-length-of-stay');
  };

  const handleReadmissionDrillDown = () => {
    navigate('/metric/readmission-rate');
  };

  const handleTotalCensusDrillDown = () => {
    navigate('/metric/census-daily-census');
  };

  const handleNetMoveInsDrillDown = () => {
    navigate('/metric/move-in-velocity');
  };

  const handleRPOUDrillDown = () => {
    navigate('/metric/revenue-per-unit');
  };

  const handleSort = (field: keyof typeof communityMetrics[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCommunities = [...communityMetrics].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Strategic KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Portfolio Occupancy"
          value="90.1%"
          change={{
            value: "+1.8%",
            type: "positive",
            period: "12-week trend"
          }}
          subtitle="vs 92% target"
          clickable={true}
          onClick={handleOccupancyDrillDown}
          calculation="Total occupied units divided by total available units across all communities. Available units exclude those temporarily out of service."
          metricId="occupancy-rate"
          hasAlternateCalculations={true}
          whyMatters="Occupancy is the primary driver of revenue performance and operational efficiency. Maintaining target occupancy levels ensures financial sustainability and optimal resource utilization."
        />

        <KPICard
          title="Average Daily Census"
          value="724"
          change={{
            value: "+2.1%",
            type: "positive",
            period: "30-day avg"
          }}
          subtitle="Rolling 30-day average"
          clickable={true}
          onClick={handleCensusDrillDown}
          calculation="Sum of daily census counts over the last 30 days divided by 30. Provides a smoothed view of occupancy trends."
          whyMatters="ADC smooths daily fluctuations to reveal underlying trends in business volume. It's essential for capacity planning, staffing decisions, and revenue forecasting."
        />
        
        <KPICard
          title="Average Length of Stay"
          value="24.1 months"
          change={{
            value: "-1.8",
            type: "negative",
            period: "vs last quarter"
          }}
          subtitle="Portfolio average"
          clickable={true}
          onClick={handleLOSDrillDown}
          calculation="Average duration residents stay in communities from move-in to move-out. Calculated across all completed stays in the last 12 months."
          metricId="avg-length-stay"
          hasAlternateCalculations={true}
          whyMatters="Longer length of stay indicates resident satisfaction and care quality. It reduces marketing costs and improves community stability and revenue predictability."
        />
        
        <KPICard
          title="30-Day Readmission Rate"
          value="12.8%"
          change={{
            value: "-0.9%",
            type: "positive",
            period: "vs last quarter"
          }}
          subtitle="Portfolio average"
          clickable={true}
          onClick={handleReadmissionDrillDown}
          calculation="Percentage of residents who return within 30 days of moving out. Includes readmissions to any community in the portfolio."
          whyMatters="Low readmission rates indicate successful transitions and appropriate care levels. High rates suggest care gaps or premature discharges affecting quality scores."
        />
      </div>

      {/* Critical Community Alerts - Expanded for Clarity */}
      {flaggedCommunities.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts: {flaggedCommunities.length} Communities Require Immediate Attention
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Communities below break-even occupancy, experiencing significant move-out trends, or showing concerning readmission patterns
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {flaggedCommunities.map((community, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50 hover:border-warning/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-foreground">{community.community}</div>
                      <Badge variant="outline" className="text-xs">{community.region}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Census</div>
                        <div className="font-medium">{community.census}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Occupancy</div>
                        <div className={`font-medium ${community.occupancy < community.breakEven ? 'text-destructive' : 'text-foreground'}`}>
                          {community.occupancy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Net Move-Ins</div>
                        <div className={`font-medium ${community.netMoveIns < 0 ? 'text-destructive' : 'text-foreground'}`}>
                          {community.netMoveIns > 0 ? '+' : ''}{community.netMoveIns}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Readmission Rate</div>
                        <div className={`font-medium ${community.readmissionRate > 15 ? 'text-destructive' : 'text-foreground'}`}>
                          {community.readmissionRate}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      {community.occupancy < community.breakEven && (
                        <Badge variant="destructive" className="text-xs">
                          Below Break-Even ({community.breakEven}%)
                        </Badge>
                      )}
                      {community.netMoveIns < -5 && (
                        <Badge variant="secondary" className="text-xs">
                          High Move-Out Trend
                        </Badge>
                      )}
                      {community.readmissionRate > 15 && (
                        <Badge variant="secondary" className="text-xs">
                          High Readmission Risk
                        </Badge>
                      )}
                      {community.los < 20 && (
                        <Badge variant="outline" className="text-xs">
                          Short Length of Stay
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => navigate(`/drilldown/community/${community.community.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Action Required:</strong> Communities flagged require immediate operational review. 
                Focus on occupancy optimization, retention strategies, and care quality improvements.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartContainer
          title="ADC & Occupancy Trend"
          description="8-week rolling trend with target comparison"
        >
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={adcOccupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar yAxisId="left" dataKey="adc" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Occupancy vs Target by Region"
          description="Variance analysis highlighting underperformers"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={occupancyVarianceData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" fontSize={9} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Net Move-Ins by Region"
          description="Move-ins minus move-outs highlighting market trends"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={netMoveInsData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" fontSize={9} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value, name) => [
                  name === 'netMoveIns' ? `${Number(value) > 0 ? '+' : ''}${value}` : value,
                  name === 'netMoveIns' ? 'Net Move-Ins' : name === 'moveIns' ? 'Move-Ins' : 'Move-Outs'
                ]}
              />
              <Bar dataKey="netMoveIns" radius={[4, 4, 0, 0]}>
                {netMoveInsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.netMoveIns >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Executive Community Performance Table */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Community Performance Dashboard</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/drilldown/census-detail')}>
            View Details
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('community')}
                >
                  <div className="flex items-center gap-1">
                    Community
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('region')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Region
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('census')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Census
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('occupancy')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Occupancy
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('netMoveIns')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Move-Ins
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('los')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    LOS
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('rpou')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    RPOU
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCommunities.map((community, index) => (
                <TableRow 
                  key={index} 
                  className={`cursor-pointer ${community.flagged ? 'bg-warning/5' : ''}`}
                  onClick={() => navigate(`/drilldown/community/${community.community.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {community.flagged && <AlertTriangle className="h-4 w-4 text-warning" />}
                      <span className="truncate">{community.community}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">{community.region}</TableCell>
                  <TableCell className="text-right">{community.census}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Badge 
                        variant={community.occupancy >= community.target ? "default" : "secondary"}
                        className={`text-xs ${community.occupancy >= community.target ? "bg-success text-success-foreground" : ""}`}
                      >
                        {community.occupancy}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">vs {community.target}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${community.netMoveIns >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}
                    >
                      {community.netMoveIns > 0 ? '+' : ''}{community.netMoveIns}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={community.los < 20 ? "text-warning" : ""}>{community.los} mo</span>
                  </TableCell>
                  <TableCell className="text-right">${community.rpou.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    {community.occupancy < community.breakEven ? (
                      <Badge variant="destructive" className="text-xs">Below Break-Even</Badge>
                    ) : community.flagged ? (
                      <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">Attention</Badge>
                    ) : (
                      <Badge variant="default" className="text-xs bg-success/20 text-success">Healthy</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Click any community for detailed occupancy drivers and move-in/out activity logs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}