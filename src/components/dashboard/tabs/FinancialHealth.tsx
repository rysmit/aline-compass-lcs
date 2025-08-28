import { ChartContainer } from "../ChartContainer";
import { KPICard } from "../KPICard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface FinancialHealthProps {
  filters: any;
}

const rpouTrendData = [
  { month: 'Jul', rpou: 5420, budget: 5500 },
  { month: 'Aug', rpou: 5485, budget: 5500 },
  { month: 'Sep', rpou: 5540, budget: 5500 },
  { month: 'Oct', rpou: 5590, budget: 5500 },
  { month: 'Nov', rpou: 5610, budget: 5500 },
  { month: 'Dec', rpou: 5625, budget: 5500 },
];

const payerMixData = [
  { name: 'Private Pay', value: 58.3, amount: 3250000, color: 'hsl(var(--chart-1))' },
  { name: 'Medicaid', value: 28.7, amount: 1600000, color: 'hsl(var(--chart-2))' },
  { name: 'LTC Insurance', value: 8.9, amount: 495000, color: 'hsl(var(--chart-3))' },
  { name: 'VA Benefits', value: 4.1, amount: 228000, color: 'hsl(var(--chart-4))' },
];

const arAgingData = [
  { period: '0-30 days', amount: 185000, percentage: 68.2 },
  { period: '31-60 days', amount: 52000, percentage: 19.1 },
  { period: '61-90 days', amount: 23000, percentage: 8.5 },
  { period: '90+ days', amount: 12000, percentage: 4.4 },
];

const budgetVarianceData = [
  { metric: 'Revenue', actual: 5625000, budget: 5500000, variance: 2.3 },
  { metric: 'Operating Expenses', actual: 3890000, budget: 4100000, variance: -5.1 },
  { metric: 'EBITDA', actual: 1735000, budget: 1400000, variance: 23.9 },
  { metric: 'Net Income', actual: 1245000, budget: 950000, variance: 31.1 },
];

export function FinancialHealth({ filters }: FinancialHealthProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Revenue"
          value="$5.63M"
          change={{
            value: "+2.3%",
            type: "positive",
            period: "vs budget"
          }}
          subtitle="Portfolio total"
          clickable={true}
          onClick={() => navigate('/metric/monthly-revenue')}
          calculation="Sum of all resident revenue including rent, care fees, and ancillary services across all communities for the current month."
          whyMatters="Monthly revenue is the primary indicator of financial health and business growth. Tracking against budget helps identify performance gaps and opportunities."
        />
        
        <KPICard
          title="Collection Rate"
          value="96.2%"
          change={{
            value: "-0.3%",
            type: "negative",
            period: "vs last month"
          }}
          subtitle="Accounts receivable"
          clickable={true}
          onClick={() => navigate('/metric/collection-rate')}
          calculation="Percentage of billed amounts collected within 30 days. Calculated as collected amount divided by total billed amount."
          whyMatters="Collection rate indicates the effectiveness of billing processes and resident payment patterns. Poor collection rates signal cash flow risks and potential billing issues."
        />
        
        <KPICard
          title="NOI per Unit"
          value="$1,847"
          change={{
            value: "+3.2%",
            type: "positive",
            period: "vs last quarter"
          }}
          subtitle="Net operating income efficiency"
          clickable={true}
          onClick={() => navigate('/metric/noi-per-unit')}
          calculation="Net Operating Income divided by total available units. NOI = Total Revenue - Operating Expenses (excluding debt service and capital expenditures)."
        />
        
        <KPICard
          title="AR Risk Index"
          value="12.4%"
          change={{
            value: "+1.8%",
            type: "negative",
            period: "vs last month"
          }}
          subtitle="High-risk receivables"
          clickable={true}
          onClick={() => navigate('/metric/ar-risk')}
          calculation="Percentage of accounts receivable over 60 days past due. Weighted by amount and adjusted for historical collection probability."
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Revenue per Occupied Unit Trend"
          description="6-month RPOU performance vs budget"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={rpouTrendData}>
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
                formatter={(value) => [`$${value}`, '']}
              />
              <Line
                type="monotone"
                dataKey="rpou"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--chart-1))', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Payer Mix Distribution"
          description="Revenue breakdown by payer type"
        >
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={payerMixData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {payerMixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value, name) => [
                  `${value}% ($${(payerMixData.find(d => d.name === name)?.amount || 0).toLocaleString()})`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {payerMixData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
                <span className="font-medium ml-auto">{entry.value}%</span>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* AR Aging */}
      <ChartContainer
        title="Accounts Receivable Aging"
        description="Outstanding balances by age category"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={arAgingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Amount']}
            />
            <Bar 
              dataKey="amount" 
              radius={[4, 4, 0, 0]}
              fill="hsl(var(--chart-1))"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Budget Variance */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Budget Variance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgetVarianceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.metric}</span>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      ${item.actual.toLocaleString()} / ${item.budget.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${
                      item.variance >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {item.variance >= 0 ? '+' : ''}{item.variance}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.abs(item.variance) * 2} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}