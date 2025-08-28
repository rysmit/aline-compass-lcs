import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SegmentTrendData } from "@/types/segments";

interface SegmentTrendsChartProps {
  data: SegmentTrendData[];
  className?: string;
}

export function SegmentTrendsChart({ data, className }: SegmentTrendsChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">6-Month Segment Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Census distribution trends across portfolio segments
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, '']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="rental" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Rental Communities"
            />
            <Line 
              type="monotone" 
              dataKey="lifePlan" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Life Plan Communities"
            />
            <Line 
              type="monotone" 
              dataKey="managed" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Managed Communities"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}