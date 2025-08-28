import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { ChartContainer } from "./ChartContainer";
import { KPICard } from "./KPICard";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface MetricDrilldownProps {
  metric: string;
  title: string;
  data: any[];
  breadcrumbItems: Array<{ label: string; href?: string }>;
}

const sampleTrendData = [
  { month: 'Jul', value: 1847, target: 1850, variance: -0.16 },
  { month: 'Aug', value: 1862, target: 1850, variance: 0.65 },
  { month: 'Sep', value: 1889, target: 1850, variance: 2.11 },
  { month: 'Oct', value: 1923, target: 1850, variance: 3.95 },
  { month: 'Nov', value: 1895, target: 1850, variance: 2.43 },
  { month: 'Dec', value: 1847, target: 1850, variance: -0.16 },
];

const communityBreakdown = [
  { community: 'Oak Ridge Manor', value: 1923, occupancy: 94.2, rank: 1 },
  { community: 'Heritage Hills', value: 1895, occupancy: 92.5, rank: 2 },
  { community: 'Garden Terrace', value: 1864, occupancy: 91.8, rank: 3 },
  { community: 'Sunset Village', value: 1842, occupancy: 88.1, rank: 4 },
  { community: 'Meadow Brook', value: 1798, occupancy: 85.3, rank: 5 },
];

export function MetricDrilldown({ metric, title, data, breadcrumbItems }: MetricDrilldownProps) {
  const navigate = useNavigate();

  const handleCommunityClick = (community: string) => {
    navigate(`/drilldown/community/${community.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title} Analysis</h1>
            <p className="text-muted-foreground">Detailed breakdown and trends</p>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Current Value"
            value="$1,847"
            change={{
              value: "+3.2%",
              type: "positive",
              period: "vs last quarter"
            }}
            subtitle="Portfolio average"
          />
          
          <KPICard
            title="Target Achievement"
            value="99.8%"
            change={{
              value: "+2.1%",
              type: "positive",
              period: "vs target"
            }}
            subtitle="Performance vs goal"
          />
          
          <KPICard
            title="Best Performer"
            value="Oak Ridge"
            subtitle="$1,923 per unit"
          />
          
          <KPICard
            title="Improvement Opportunity"
            value="Meadow Brook"
            subtitle="$149 below target"
          />
        </div>

        {/* Trend Analysis */}
        <ChartContainer
          title="6-Month Trend Analysis"
          description="Performance vs target over time"
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value, name) => [
                  name === 'value' ? `$${value}` : `$${value}`,
                  name === 'value' ? 'Actual' : 'Target'
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(195 100% 42%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(195 100% 42%)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: 'hsl(195 100% 42%)', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(49 96% 68%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(49 96% 68%)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Community Performance */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Community Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Community</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">{metric}</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Occupancy</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communityBreakdown.map((community, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-border/30 hover:bg-muted/20 transition-fast cursor-pointer"
                      onClick={() => handleCommunityClick(community.community)}
                    >
                      <td className="py-3 px-4">
                        <Badge 
                          variant={community.rank <= 2 ? "default" : "secondary"}
                          className={community.rank <= 2 ? "bg-success text-success-foreground" : ""}
                        >
                          #{community.rank}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium hover:text-primary transition-fast">
                        {community.community}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${community.value.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4">
                        <Badge 
                          variant={community.occupancy >= 90 ? "default" : "secondary"}
                          className={community.occupancy >= 90 ? "bg-success text-success-foreground" : ""}
                        >
                          {community.occupancy}%
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-primary text-sm hover:underline">
                          View Details →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div>
                  <h4 className="font-medium">Focus on Meadow Brook</h4>
                  <p className="text-sm text-muted-foreground">
                    Community is underperforming by $149 per unit. Consider operational efficiency review.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h4 className="font-medium">Replicate Oak Ridge Success</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze best practices from top performer to apply across portfolio.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}