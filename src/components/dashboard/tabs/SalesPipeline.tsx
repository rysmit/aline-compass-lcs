import { ChartContainer } from "../ChartContainer";
import { KPICard } from "../KPICard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, FunnelChart, Funnel, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface SalesPipelineProps {
  filters: any;
}

const funnelData = [
  { name: 'Inquiries', value: 485, fill: 'hsl(var(--chart-1))' },
  { name: 'Tours Scheduled', value: 342, fill: 'hsl(var(--chart-2))' },
  { name: 'Tours Completed', value: 287, fill: 'hsl(var(--chart-3))' },
  { name: 'Applications', value: 156, fill: 'hsl(var(--chart-4))' },
  { name: 'Move-ins', value: 89, fill: 'hsl(var(--chart-5))' },
];

const leadSourceData = [
  { source: 'Google Ads', leads: 142, conversions: 28, rate: 19.7 },
  { source: 'Caring.com', leads: 98, conversions: 22, rate: 22.4 },
  { source: 'Facebook', leads: 76, conversions: 12, rate: 15.8 },
  { source: 'Referrals', leads: 89, conversions: 31, rate: 34.8 },
  { source: 'Website Direct', leads: 54, conversions: 8, rate: 14.8 },
  { source: 'Print Ads', leads: 26, conversions: 3, rate: 11.5 },
];

const pipelineForecastData = [
  { month: 'Jan', weighted: 92, committed: 78 },
  { month: 'Feb', weighted: 87, committed: 82 },
  { month: 'Mar', weighted: 95, committed: 89 },
  { month: 'Apr', weighted: 103, committed: 94 },
  { month: 'May', weighted: 98, committed: 91 },
  { month: 'Jun', weighted: 109, committed: 97 },
];

export function SalesPipeline({ filters }: SalesPipelineProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Inquiries"
          value="485"
          change={{
            value: "+12.3%",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="Total new prospects"
          clickable={true}
          onClick={() => navigate('/metric/monthly-inquiries')}
          calculation="Total number of new inquiries received across all channels and communities in the current month."
          whyMatters="Inquiry volume is the foundation of future occupancy growth. Tracking trends helps ensure adequate lead generation and identifies marketing effectiveness."
        />
        
        <KPICard
          title="Conversion Rate"
          value="18.4%"
          change={{
            value: "-1.2%",
            type: "negative",
            period: "inquiry to move-in"
          }}
          subtitle="Overall pipeline efficiency"
          clickable={true}
          onClick={() => navigate('/metric/conversion-rate')}
          calculation="Number of completed move-ins divided by total inquiries. Tracks the entire sales funnel from initial contact to occupancy."
          whyMatters="Conversion rate measures sales effectiveness and pipeline efficiency. Higher rates indicate better qualification, follow-up, and closing processes."
        />
        
        <KPICard
          title="Lead Response Time"
          value="3.4h"
          change={{
            value: "-0.8h",
            type: "positive",
            period: "avg response"
          }}
          subtitle="First contact speed"
          clickable={true}
          onClick={() => navigate('/metric/lead-response-time')}
          calculation="Average time from inquiry submission to first meaningful contact attempt across all channels."
          whyMatters="Fast response times significantly improve conversion rates. Research shows prospects contacted within 1 hour are 7x more likely to convert than those contacted later."
        />
        
        <KPICard
          title="Pipeline Value"
          value="$1.42M"
          change={{
            value: "+8.5%",
            type: "positive",
            period: "weighted forecast"
          }}
          subtitle="Next 90 days"
          clickable={true}
          onClick={() => navigate('/metric/pipeline-value')}
          calculation="Sum of potential monthly revenue from all prospects in pipeline, weighted by probability of conversion based on stage."
          whyMatters="Pipeline value provides visibility into future revenue potential and helps plan capacity, staffing, and marketing investments for sustainable growth."
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Sales Funnel"
          description="Conversion rates through sales process"
        >
          <div className="space-y-4">
            {funnelData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground text-right">
                  {item.name}
                </div>
                <div className="flex-1 bg-muted/20 rounded-lg overflow-hidden">
                  <div 
                    className="h-8 rounded-lg flex items-center justify-end px-3 text-sm font-medium text-foreground transition-all duration-500"
                    style={{ 
                      width: `${(item.value / funnelData[0].value) * 100}%`,
                      backgroundColor: item.fill 
                    }}
                  >
                    {item.value}
                  </div>
                </div>
                <div className="w-16 text-sm text-muted-foreground">
                  {index > 0 ? `${((item.value / funnelData[index - 1].value) * 100).toFixed(1)}%` : '100%'}
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer
          title="Lead Source Performance"
          description="Conversion rates by marketing channel"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={leadSourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="source" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value, name) => [
                  name === 'leads' ? `${value} leads` : 
                  name === 'conversions' ? `${value} conversions` : 
                  `${value}% rate`,
                  name === 'leads' ? 'Total Leads' : 
                  name === 'conversions' ? 'Conversions' : 
                  'Conversion Rate'
                ]}
              />
              <Bar dataKey="leads" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Pipeline Forecast */}
      <ChartContainer
        title="Weighted Pipeline Forecast"
        description="Projected move-ins based on current pipeline"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pipelineForecastData}>
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
            <Line
              type="monotone"
              dataKey="weighted"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="committed"
              stroke="hsl(var(--chart-5))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-5))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Lead Source Details */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Lead Source Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Source</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Leads</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Rate</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cost per Lead</th>
                </tr>
              </thead>
              <tbody>
                {leadSourceData.map((source, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                    <td className="py-3 px-4 font-medium">{source.source}</td>
                    <td className="text-right py-3 px-4">{source.leads}</td>
                    <td className="text-right py-3 px-4 text-success">{source.conversions}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`font-medium ${
                        source.rate >= 25 ? 'text-success' :
                        source.rate >= 20 ? 'text-warning' :
                        'text-muted-foreground'
                      }`}>
                        {source.rate}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-muted-foreground">
                      ${Math.floor(Math.random() * 50 + 25)}
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