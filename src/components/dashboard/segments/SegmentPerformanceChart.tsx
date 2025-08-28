import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SegmentPerformanceChartProps {
  segmentId: string;
  segmentName: string;
  className?: string;
}

// Mock performance data for different chart types
const getPerformanceData = (segmentId: string) => {
  const baseData = [
    { month: 'Jan', occupancy: 0, revenue: 0, inquiries: 0, conversions: 0 },
    { month: 'Feb', occupancy: 0, revenue: 0, inquiries: 0, conversions: 0 },
    { month: 'Mar', occupancy: 0, revenue: 0, inquiries: 0, conversions: 0 },
    { month: 'Apr', occupancy: 0, revenue: 0, inquiries: 0, conversions: 0 },
    { month: 'May', occupancy: 0, revenue: 0, inquiries: 0, conversions: 0 },
    { month: 'Jun', occupancy: 0, revenue: 0, inquiries: 0, conversions: 0 }
  ];

  const segmentData = {
    rental: [
      { month: 'Jan', occupancy: 85.2, revenue: 3150000, inquiries: 245, conversions: 68 },
      { month: 'Feb', occupancy: 86.1, revenue: 3280000, inquiries: 268, conversions: 75 },
      { month: 'Mar', occupancy: 86.8, revenue: 3350000, inquiries: 289, conversions: 82 },
      { month: 'Apr', occupancy: 87.2, revenue: 3420000, inquiries: 301, conversions: 89 },
      { month: 'May', occupancy: 87.8, revenue: 3480000, inquiries: 318, conversions: 91 },
      { month: 'Jun', occupancy: 87.5, revenue: 3500000, inquiries: 325, conversions: 94 }
    ],
    'life-plan': [
      { month: 'Jan', occupancy: 89.5, revenue: 2650000, inquiries: 180, conversions: 68 },
      { month: 'Feb', occupancy: 90.2, revenue: 2710000, inquiries: 195, conversions: 72 },
      { month: 'Mar', occupancy: 90.8, revenue: 2750000, inquiries: 208, conversions: 75 },
      { month: 'Apr', occupancy: 91.4, revenue: 2780000, inquiries: 215, conversions: 78 },
      { month: 'May', occupancy: 91.9, revenue: 2820000, inquiries: 222, conversions: 81 },
      { month: 'Jun', occupancy: 92.1, revenue: 2850000, inquiries: 229, conversions: 84 }
    ],
    managed: [
      { month: 'Jan', occupancy: 82.1, revenue: 1050000, inquiries: 165, conversions: 32 },
      { month: 'Feb', occupancy: 81.5, revenue: 1020000, inquiries: 158, conversions: 29 },
      { month: 'Mar', occupancy: 80.8, revenue: 995000, inquiries: 142, conversions: 26 },
      { month: 'Apr', occupancy: 79.9, revenue: 970000, inquiries: 138, conversions: 28 },
      { month: 'May', occupancy: 78.8, revenue: 965000, inquiries: 145, conversions: 31 },
      { month: 'Jun', occupancy: 78.3, revenue: 985000, inquiries: 152, conversions: 34 }
    ]
  };

  return segmentData[segmentId as keyof typeof segmentData] || baseData;
};

export function SegmentPerformanceChart({ segmentId, segmentName, className }: SegmentPerformanceChartProps) {
  const performanceData = getPerformanceData(segmentId);

  const formatRevenue = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const formatOccupancy = (value: number) => {
    return `${value}%`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{segmentName} Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="occupancy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>

          <TabsContent value="occupancy" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
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
                    tickFormatter={formatOccupancy}
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
                    formatter={(value) => [`${value}%`, 'Occupancy Rate']}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancy"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
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
                    tickFormatter={formatRevenue}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [formatRevenue(value as number), 'Monthly Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value}`, 'Inquiries']}
                  />
                  <Bar
                    dataKey="inquiries"
                    fill="hsl(var(--chart-3))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value}`, 'Conversions']}
                  />
                  <Bar
                    dataKey="conversions"
                    fill="hsl(var(--chart-4))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}