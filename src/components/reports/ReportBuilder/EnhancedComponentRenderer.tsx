import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ReportComponent } from '@/contexts/ReportBuilderContext';
import { ChartContainer } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Trash2, 
  GripVertical, 
  TrendingUp, 
  MoreHorizontal,
  Move
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EnhancedComponentRendererProps {
  component: ReportComponent;
  isSelected: boolean;
  isBuilderMode: boolean;
  onSelect: (id: string) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(var(--destructive))',
];

export function EnhancedComponentRenderer({
  component,
  isSelected,
  isBuilderMode,
  onSelect,
  onResize,
  onDelete,
  isDragging,
}: EnhancedComponentRendererProps) {
  const [isResizing, setIsResizing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: component.id,
    disabled: !isBuilderMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Generate realistic mock data based on component type
  const mockData = useMemo(() => {
    const generateTimeSeriesData = () => {
      const data = [];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      for (let i = 0; i < 6; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          value: Math.floor(Math.random() * 100) + 50,
          value2: Math.floor(Math.random() * 80) + 30,
          target: 75,
        });
      }
      return data;
    };

    const generateCategoryData = () => [
      { name: 'Q1', value: 85, budget: 80 },
      { name: 'Q2', value: 92, budget: 85 },
      { name: 'Q3', value: 78, budget: 90 },
      { name: 'Q4', value: 88, budget: 85 },
    ];

    const generatePieData = () => [
      { name: 'Occupied', value: 78, fill: CHART_COLORS[0] },
      { name: 'Available', value: 15, fill: CHART_COLORS[1] },
      { name: 'Maintenance', value: 7, fill: CHART_COLORS[2] },
    ];

    switch (component.config.chartType) {
      case 'pie':
        return generatePieData();
      case 'area':
        return generateTimeSeriesData();
      default:
        return component.type === 'chart' ? generateTimeSeriesData() : generateCategoryData();
    }
  }, [component.config.chartType, component.type]);

  const renderChart = () => {
    if (component.type !== 'chart') return null;

    const chartConfig = {
      value: {
        label: "Value",
        color: CHART_COLORS[0],
      },
      value2: {
        label: "Secondary",
        color: CHART_COLORS[1],
      },
      target: {
        label: "Target",
        color: CHART_COLORS[2],
      },
    };

    switch (component.config.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartConfig.value.color} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke={chartConfig.target.color} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar dataKey="value" fill={chartConfig.value.color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget" fill={chartConfig.value2.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartConfig.value.color}
                fill={chartConfig.value.color}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'gauge':
        const gaugeValue = 75;
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={chartConfig.value.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - gaugeValue / 100)}`}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{gaugeValue}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Performance</p>
          </div>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={chartConfig.value.color} />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'kpi':
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {component.config.format === 'percentage' ? '84.2%' : '$2.4M'}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {component.config.title || 'KPI Metric'}
                </div>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% vs last month
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'chart':
        return (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {component.config.title || 'Chart'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-[calc(100%-60px)]">
              {renderChart()}
            </CardContent>
          </Card>
        );

      case 'table':
        const tableData = [
          { name: 'Community A', occupancy: '92%', revenue: '$125K', status: 'Good' },
          { name: 'Community B', occupancy: '87%', revenue: '$98K', status: 'Fair' },
          { name: 'Community C', occupancy: '95%', revenue: '$142K', status: 'Excellent' },
        ];

        return (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {component.config.title || 'Data Table'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Occupancy</th>
                      <th className="text-left p-2">Revenue</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{row.name}</td>
                        <td className="p-2">{row.occupancy}</td>
                        <td className="p-2">{row.revenue}</td>
                        <td className="p-2">
                          <Badge variant="outline">{row.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );

      case 'text':
        return (
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              {isBuilderMode && isSelected ? (
                <Input
                  value={component.config.content || 'Enter your text here'}
                  onChange={(e) => {
                    // This would trigger an update in a real implementation
                  }}
                  className="text-base border-none p-0 h-auto resize-none"
                />
              ) : (
                <div 
                  className="text-base"
                  style={{ 
                    fontSize: component.config.fontSize === 'large' ? '1.25rem' : 
                             component.config.fontSize === 'small' ? '0.875rem' : '1rem',
                    textAlign: component.config.alignment || 'left'
                  }}
                >
                  {component.config.content || 'Enter your text here'}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MoreHorizontal className="h-8 w-8 mx-auto mb-2" />
                <p>Unknown Component Type</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: component.position.x,
        top: component.position.y,
        width: component.position.width,
        height: component.position.height,
        zIndex: isSelected ? 10 : 1,
        ...style,
      }}
      className={cn(
        "group",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isDragging && "opacity-50",
        isSortableDragging && "z-50",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      {...attributes}
    >
      {/* Component content */}
      <div className="w-full h-full">
        {renderComponent()}
      </div>

      {/* Builder mode controls */}
      {isBuilderMode && (
        <>
          {/* Drag handle */}
          <div
            className={cn(
              "absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity",
              isSelected && "opacity-100"
            )}
            {...listeners}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing bg-background shadow-md"
            >
              <GripVertical className="h-3 w-3" />
            </Button>
          </div>

          {/* Delete button */}
          <div
            className={cn(
              "absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity",
              isSelected && "opacity-100"
            )}
          >
            <Button
              variant="destructive"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Resize handle */}
          <div
            className={cn(
              "absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize",
              isSelected && "opacity-100"
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsResizing(true);
              
              const startX = e.clientX;
              const startY = e.clientY;
              const startWidth = component.position.width;
              const startHeight = component.position.height;

              const handleMouseMove = (e: MouseEvent) => {
                const newWidth = Math.max(100, startWidth + (e.clientX - startX));
                const newHeight = Math.max(100, startHeight + (e.clientY - startY));
                onResize(component.id, { width: newWidth, height: newHeight });
              };

              const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 bg-background shadow-md"
            >
              <Move className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}