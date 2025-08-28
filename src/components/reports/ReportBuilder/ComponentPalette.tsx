import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Table, 
  Type, 
  Activity,
  Gauge
} from 'lucide-react';

interface ComponentTemplate {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'kpi' | 'text';
  icon: any;
  description: string;
  defaultConfig: any;
}

const componentTemplates: ComponentTemplate[] = [
  {
    id: 'kpi-card',
    name: 'KPI Card',
    type: 'kpi',
    icon: TrendingUp,
    description: 'Single metric display',
    defaultConfig: {
      title: 'New KPI',
      aggregation: 'avg',
      format: 'percentage'
    }
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    type: 'chart',
    icon: LineChart,
    description: 'Trend analysis over time',
    defaultConfig: {
      title: 'Trend Chart',
      chartType: 'line',
      showLegend: true,
      showGrid: true
    }
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    type: 'chart',
    icon: BarChart3,
    description: 'Compare categories',
    defaultConfig: {
      title: 'Bar Chart',
      chartType: 'bar',
      showLegend: true,
      showGrid: true
    }
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    type: 'chart',
    icon: PieChart,
    description: 'Show proportions',
    defaultConfig: {
      title: 'Distribution',
      chartType: 'pie',
      showLegend: true
    }
  },
  {
    id: 'gauge-chart',
    name: 'Gauge',
    type: 'chart',
    icon: Gauge,
    description: 'Progress indicator',
    defaultConfig: {
      title: 'Performance Gauge',
      chartType: 'gauge',
      min: 0,
      max: 100
    }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    type: 'table',
    icon: Table,
    description: 'Detailed data view',
    defaultConfig: {
      title: 'Data Table',
      showPagination: true,
      pageSize: 10
    }
  },
  {
    id: 'text-box',
    name: 'Text Box',
    type: 'text',
    icon: Type,
    description: 'Custom text content',
    defaultConfig: {
      content: 'Enter your text here',
      fontSize: 'medium',
      alignment: 'left'
    }
  }
];

export function ComponentPalette() {
  const { addComponent, currentReport } = useReportBuilder();

  const handleAddComponent = (template: ComponentTemplate) => {
    // Calculate a position that doesn't overlap existing components
    const existingComponents = currentReport?.layout.components || [];
    const baseX = 50;
    const baseY = 50;
    const offsetX = (existingComponents.length % 3) * 320; // 300 width + 20 margin
    const offsetY = Math.floor(existingComponents.length / 3) * 220; // 200 height + 20 margin
    
    addComponent({
      type: template.type,
      position: { 
        x: baseX + offsetX, 
        y: baseY + offsetY, 
        width: template.type === 'kpi' ? 250 : 300, 
        height: template.type === 'text' ? 150 : 200 
      },
      config: template.defaultConfig,
      dataSource: {
        filters: [],
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          to: new Date()
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Components</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {componentTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Button
              key={template.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={() => handleAddComponent(template)}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}