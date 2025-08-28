import { ChartContainer } from "../ChartContainer";
import { KPICard } from "../KPICard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ForecastRiskProps {
  filters: any;
}

const occupancyForecastData = [
  { 
    period: 'Current', 
    occupancy: 91.4, 
    forecast: 91.4, 
    upper: 91.4, 
    lower: 91.4,
    confidence: 100 
  },
  { 
    period: '30 days', 
    occupancy: null, 
    forecast: 89.8, 
    upper: 92.1, 
    lower: 87.5,
    confidence: 85 
  },
  { 
    period: '60 days', 
    occupancy: null, 
    forecast: 88.3, 
    upper: 91.8, 
    lower: 84.8,
    confidence: 78 
  },
  { 
    period: '90 days', 
    occupancy: null, 
    forecast: 87.1, 
    upper: 91.2, 
    lower: 83.0,
    confidence: 72 
  },
];

const churnRiskPredictions = [
  { 
    id: 'R234', 
    name: 'Elizabeth Martinez', 
    community: 'Oak Ridge Manor',
    riskScore: 94.2,
    daysToLeave: 18,
    reason: 'Family concerns about care quality',
    revenue: 6200
  },
  { 
    id: 'R156', 
    name: 'James Thompson', 
    community: 'Sunset Village',
    riskScore: 89.7,
    daysToLeave: 32,
    reason: 'Financial constraints identified',
    revenue: 4800
  },
  { 
    id: 'R089', 
    name: 'Mary Anderson', 
    community: 'Garden Terrace',
    riskScore: 87.3,
    daysToLeave: 45,
    reason: 'Declining health, family considering MC',
    revenue: 5400
  },
  { 
    id: 'R267', 
    name: 'Robert Wilson', 
    community: 'Meadow Brook',
    riskScore: 83.1,
    daysToLeave: 28,
    reason: 'Repeated medication issues',
    revenue: 5100
  },
  { 
    id: 'R143', 
    name: 'Patricia Brown', 
    community: 'Heritage Hills',
    riskScore: 81.8,
    daysToLeave: 55,
    reason: 'Social isolation concerns',
    revenue: 4900
  },
];

const riskMetrics = [
  { metric: 'High Risk Residents', current: 23, projected: 29, change: 6 },
  { metric: 'Revenue at Risk', current: 146000, projected: 187000, change: 41000 },
  { metric: 'Avg Risk Score', current: 2.8, projected: 3.2, change: 0.4 },
  { metric: 'Churn Rate Forecast', current: 4.2, projected: 5.1, change: 0.9 },
];

export function ForecastRisk({ filters }: ForecastRiskProps) {
  const navigate = useNavigate();
  const totalRevenueAtRisk = churnRiskPredictions.reduce((sum, resident) => sum + resident.revenue, 0);

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div onClick={() => navigate('/metric/occupancy-forecast')} className="cursor-pointer">
          <KPICard
            title="30-Day Occupancy Forecast"
            value="89.8%"
            change={{
              value: "-1.6%",
              type: "negative",
              period: "vs current"
            }}
            subtitle="85% confidence interval"
            calculation="Machine learning model prediction based on historical trends, seasonality, and current pipeline data. 85% confidence band represents forecast uncertainty range."
            whyMatters="Accurate occupancy forecasting enables proactive decision-making for marketing spend, staffing adjustments, and revenue planning to prevent census decline."
          />
        </div>
        
        <div onClick={() => navigate('/metric/revenue-at-risk')} className="cursor-pointer">
          <KPICard
            title="Revenue at Risk"
            value="$146K"
            change={{
              value: "+28%",
              type: "negative",
              period: "vs last quarter"
            }}
            subtitle="Projected 90-day loss"
            calculation="Sum of monthly revenue from residents with >80% churn probability. Based on AI model analyzing care satisfaction, payment history, and family engagement."
            metricId="ar-risk"
            hasAlternateCalculations={true}
            whyMatters="Identifying revenue at risk allows for targeted retention efforts and proactive interventions to prevent significant income loss and maintain financial stability."
          />
        </div>
        
        <div onClick={() => navigate('/metric/high-risk-residents')} className="cursor-pointer">
          <KPICard
            title="High-Risk Residents"
            value="23"
            change={{
              value: "+6",
              type: "negative",
              period: "predicted increase"
            }}
            subtitle="Churn probability >80%"
            calculation="Number of residents with AI-calculated churn risk score above 80%. Model considers care incidents, payment delays, family complaints, and health trends."
            whyMatters="Early identification of at-risk residents enables targeted retention efforts and interventions to prevent revenue loss and maintain community stability."
          />
        </div>
        
        <div onClick={() => navigate('/metric/projected-occupancy')} className="cursor-pointer">
          <KPICard
            title="Forecast Accuracy"
            value="87.3%"
            change={{
              value: "+2.1%",
              type: "positive",
              period: "model improvement"
            }}
            subtitle="Historical validation"
            calculation="Percentage accuracy of 30-day occupancy forecasts compared to actual results over the last 12 months. Continuously improving with more data."
            whyMatters="Higher forecast accuracy enables better resource planning, marketing spend allocation, and operational decision-making with greater confidence."
          />
        </div>
      </div>

      {/* Forecast Chart */}
      <ChartContainer
        title="Occupancy Forecast with Confidence Bands"
        description="30/60/90-day projections with uncertainty ranges"
      >
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={occupancyForecastData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 95]} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value, name) => [
                `${value}%`,
                name === 'forecast' ? 'Forecast' :
                name === 'upper' ? 'Upper Bound' :
                name === 'lower' ? 'Lower Bound' :
                'Current'
              ]}
            />
            
            {/* Confidence band */}
            <Area
              type="monotone"
              dataKey="upper"
              stackId="1"
              stroke="none"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stackId="1"
              stroke="none"
              fill="url(#confidenceGradient)"
            />
            
            {/* Current data */}
            <Line
              type="monotone"
              dataKey="occupancy"
              stroke="hsl(var(--chart-5))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-5))', strokeWidth: 2, r: 5 }}
              connectNulls={false}
            />
            
            {/* Forecast line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <CardTitle>Risk Metrics Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <div className="font-medium">{metric.metric}</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {typeof metric.current === 'number' && metric.current > 1000 
                        ? `$${(metric.current / 1000).toFixed(0)}K`
                        : metric.current}{typeof metric.current === 'number' && metric.current <= 100 && metric.metric.includes('Rate') ? '%' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {typeof metric.projected === 'number' && metric.projected > 1000 
                        ? `$${(metric.projected / 1000).toFixed(0)}K`
                        : metric.projected}{typeof metric.projected === 'number' && metric.projected <= 100 && metric.metric.includes('Rate') ? '%' : ''}
                    </div>
                    <div className="text-sm text-destructive">
                      +{typeof metric.change === 'number' && metric.change > 1000 
                        ? `$${(metric.change / 1000).toFixed(0)}K`
                        : metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-warning" />
              <CardTitle>Revenue Impact Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-3xl font-bold text-destructive">
                  ${totalRevenueAtRisk.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total Monthly Revenue at Risk
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-xl font-bold">{churnRiskPredictions.length}</div>
                  <div className="text-sm text-muted-foreground">High-Risk Residents</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-xl font-bold">
                    {Math.round(churnRiskPredictions.reduce((sum, r) => sum + r.daysToLeave, 0) / churnRiskPredictions.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Days to Leave</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Churn Risk Predictions */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <CardTitle>Churn Risk Predictions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resident</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk Score</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Days to Leave</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue Impact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Primary Risk Factor</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {churnRiskPredictions.map((resident, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{resident.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {resident.id} • {resident.community}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge 
                        variant="secondary"
                        className={`${
                          resident.riskScore >= 90 ? "bg-destructive/20 text-destructive" :
                          resident.riskScore >= 85 ? "bg-warning/20 text-warning" :
                          "bg-primary/20 text-primary"
                        }`}
                      >
                        {resident.riskScore}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="font-medium">{resident.daysToLeave}</span>
                    </td>
                    <td className="text-right py-3 px-4 font-medium text-destructive">
                      ${resident.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-48">
                      {resident.reason}
                    </td>
                    <td className="text-center py-3 px-4">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm transition-fast">
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}