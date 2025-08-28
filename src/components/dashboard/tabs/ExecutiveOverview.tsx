import { useStarterMode } from "@/contexts/StarterModeContext";
import { KPICard } from "../KPICard";
import { AlertCard } from "../AlertCard";
import { ChartContainer } from "../ChartContainer";
import { IntelligenceLayer } from "../intelligence/IntelligenceLayer";
import { StarterModeOnboardingPanel } from "@/components/trust-layer/StarterModeOnboardingPanel";
import { SegmentBreakdownChart } from "../SegmentBreakdownChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface ExecutiveOverviewProps {
  filters: any;
}

const occupancyTrendData = [
  { month: 'Jul', occupancy: 89.2, revenue: 672000 },
  { month: 'Aug', occupancy: 90.1, revenue: 685000 },
  { month: 'Sep', occupancy: 91.8, revenue: 698000 },
  { month: 'Oct', occupancy: 90.3, revenue: 701000 },
  { month: 'Nov', occupancy: 91.4, revenue: 715000 },
  { month: 'Dec', occupancy: 91.4, revenue: 728000 },
];

export function ExecutiveOverview({ filters }: ExecutiveOverviewProps) {
  const navigate = useNavigate();
  const { isStarterMode } = useStarterMode();
  
  // Individual segment view state for each KPI card
  const [cardSegmentViews, setCardSegmentViews] = useState({
    census: false,
    occupancy: false,
    revenue: false,
    forecast: false
  });

  // Mock segment data for comparison
  const segmentData = {
    occupancy: { 'life-plan': '89.2%', 'rental': '91.8%', 'managed': '85.3%' },
    revenue: { 'life-plan': '$6,247', 'rental': '$5,542', 'managed': '$5,891' },
    census: { 'life-plan': '3,451', 'rental': '5,419', 'managed': '977' },
    forecast: { 'life-plan': '3,380', 'rental': '5,205', 'managed': '935' }
  };

  const toggleCardSegmentView = (cardId: keyof typeof cardSegmentViews) => {
    setCardSegmentViews(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleRegionDrillDown = (region: string) => {
    navigate(`/region/${region}`);
  };

  const handleCensusDrillDown = () => {
    navigate('/metric/average-daily-census');
  };

  const handleChurnRiskDrillDown = () => {
    navigate('/metric/churn-risk-score');
  };

  const handleRevenueDrillDown = () => {
    navigate('/metric/revenue-per-unit');
  };

  const handleForecastDrillDown = () => {
    navigate('/metric/forecast-accuracy');
  };

  const handleOccupancyDrillDown = () => {
    navigate('/metric/portfolio-occupancy-rate');
  };

  return (
    <div className="aline-section-spacing flex flex-col">
      {/* KPI Cards - Aline BI Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 aline-card-spacing">
        <KPICard
          title="Average Daily Census"
          value={cardSegmentViews.census ? segmentData.census : "9,847"}
          change={{
            value: "+287 units",
            type: "positive",
            period: "vs last 30 days"
          }}
          subtitle="Across 127 communities"
          clickable={true}
          onClick={handleCensusDrillDown}
          calculation="Sum of occupied units across all communities divided by number of days in period. Includes all care levels and unit types."
          whyMatters="ADC is the fundamental measure of business volume, directly correlating to revenue generation and operational efficiency. Tracking trends helps predict cash flow and capacity planning needs."
          compareView={cardSegmentViews.census}
          onToggleSegmentView={() => toggleCardSegmentView('census')}
        />
        
        <KPICard
          title="Portfolio Occupancy Rate"
          value={cardSegmentViews.occupancy ? segmentData.occupancy : "88.2%"}
          change={{
            value: "-1.3%",
            type: "negative",
            period: "vs last month"
          }}
          subtitle="11,165 total units"
          clickable={true}
          onClick={handleOccupancyDrillDown}
          calculation="Percentage of total available units that are occupied. Calculated as (occupied units / total units) × 100 across all communities."
          metricId="occupancy-rate"
          hasAlternateCalculations={true}
          whyMatters="Occupancy rate directly impacts revenue and profitability. It's the primary driver of financial performance and indicates market demand and operational effectiveness."
          compareView={cardSegmentViews.occupancy}
          onToggleSegmentView={() => toggleCardSegmentView('occupancy')}
        />
        
        <KPICard
          title="Revenue per Occupied Unit"
          value={cardSegmentViews.revenue ? segmentData.revenue : "$5,842"}
          change={{
            value: "+$127",
            type: "positive",
            period: "monthly average"
          }}
          subtitle="Weighted by care level"
          clickable={true}
          onClick={handleRevenueDrillDown}
          calculation="Total monthly revenue divided by number of occupied units. Weighted average based on care level acuity and service packages."
          metricId="revenue-per-unit"
          whyMatters="RPOU measures pricing effectiveness and revenue optimization. Higher RPOU indicates successful care level progression and premium service delivery, directly impacting profitability."
          compareView={cardSegmentViews.revenue}
          onToggleSegmentView={() => toggleCardSegmentView('revenue')}
        />
        
        <KPICard
          title="30-Day Forecast"
          value={cardSegmentViews.forecast ? segmentData.forecast : "9,620"}
          change={{
            value: "-227 units",
            type: "negative",
            period: "projected change"
          }}
          subtitle="86.2% predicted occupancy"
          clickable={true}
          onClick={handleForecastDrillDown}
          calculation="Predictive model using historical occupancy trends, move-ins, move-outs, and seasonal patterns to forecast census 30 days forward."
          metricId="occupancy-forecast"
          whyMatters="Accurate forecasting enables proactive decision-making for marketing, staffing, and operational planning. Early warning of census changes helps prevent revenue loss."
          compareView={cardSegmentViews.forecast}
          onToggleSegmentView={() => toggleCardSegmentView('forecast')}
        />
      </div>

      {/* Segment Breakdown Chart */}
      {!isStarterMode && (
        <div className="aline-section-spacing">
          <SegmentBreakdownChart filters={filters} />
        </div>
      )}

      {/* Intelligence Layer - Hidden in Starter Mode */}
      {!isStarterMode && <IntelligenceLayer filters={filters} />}

      {/* Starter Mode Onboarding Panel */}
      {isStarterMode && (
        <div className="aline-section-spacing">
          <StarterModeOnboardingPanel />
        </div>
      )}


      {/* Charts - Hidden in Starter Mode */}
      {!isStarterMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 aline-section-spacing">
          <ChartContainer
            title="Occupancy Trend"
            description="6-month occupancy rate across portfolio"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={occupancyTrendData}>
                <defs>
                  <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#occupancyGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Revenue Performance"
            description="Monthly revenue trend across portfolio"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--chart-2))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}