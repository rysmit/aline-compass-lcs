import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Table, 
  Type, 
  Activity,
  Gauge,
  AreaChart,
  Sparkles,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentTemplate {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'kpi' | 'text';
  icon: any;
  description: string;
  category: 'visualization' | 'data' | 'content' | 'layout';
  defaultConfig: any;
  isPremium?: boolean;
}

const componentTemplates: ComponentTemplate[] = [
  // KPI Components
  {
    id: 'kpi-card',
    name: 'KPI Card',
    type: 'kpi',
    icon: TrendingUp,
    description: 'Single metric display with trend',
    category: 'visualization',
    defaultConfig: {
      title: 'Key Performance Indicator',
      aggregation: 'avg',
      format: 'percentage'
    }
  },
  {
    id: 'metric-gauge',
    name: 'Performance Gauge',
    type: 'chart',
    icon: Gauge,
    description: 'Circular progress indicator',
    category: 'visualization',
    defaultConfig: {
      title: 'Performance Gauge',
      chartType: 'gauge',
      min: 0,
      max: 100,
      showLegend: false
    }
  },
  
  // Chart Components
  {
    id: 'line-chart',
    name: 'Line Chart',
    type: 'chart',
    icon: LineChart,
    description: 'Perfect for trends over time',
    category: 'visualization',
    defaultConfig: {
      title: 'Trend Analysis',
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
    description: 'Compare categories effectively',
    category: 'visualization',
    defaultConfig: {
      title: 'Category Comparison',
      chartType: 'bar',
      showLegend: true,
      showGrid: true
    }
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    type: 'chart',
    icon: AreaChart,
    description: 'Filled area for cumulative data',
    category: 'visualization',
    defaultConfig: {
      title: 'Cumulative Analysis',
      chartType: 'area',
      showLegend: true,
      showGrid: true
    }
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    type: 'chart',
    icon: PieChart,
    description: 'Show proportions and parts',
    category: 'visualization',
    defaultConfig: {
      title: 'Distribution Analysis',
      chartType: 'pie',
      showLegend: true
    }
  },
  
  // Data Components
  {
    id: 'data-table',
    name: 'Data Table',
    type: 'table',
    icon: Table,
    description: 'Detailed tabular data view',
    category: 'data',
    defaultConfig: {
      title: 'Data Table',
      showPagination: true,
      pageSize: 10
    }
  },
  
  // Content Components
  {
    id: 'text-box',
    name: 'Text Block',
    type: 'text',
    icon: Type,
    description: 'Rich text content and notes',
    category: 'content',
    defaultConfig: {
      content: 'Add your insights and commentary here...',
      fontSize: 'medium',
      alignment: 'left'
    }
  },
  
  // Premium Components
  {
    id: 'advanced-chart',
    name: 'Multi-Series Chart',
    type: 'chart',
    icon: Activity,
    description: 'Complex multi-axis visualizations',
    category: 'visualization',
    isPremium: true,
    defaultConfig: {
      title: 'Advanced Analytics',
      chartType: 'line',
      showLegend: true,
      showGrid: true,
      multiSeries: true
    }
  }
];

const categories = [
  { id: 'all', name: 'All', icon: Layout },
  { id: 'visualization', name: 'Charts', icon: BarChart3 },
  { id: 'data', name: 'Data', icon: Table },
  { id: 'content', name: 'Content', icon: Type },
];

export function EnhancedComponentPalette() {
  const { addComponent, currentReport } = useReportBuilder();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? componentTemplates 
    : componentTemplates.filter(t => t.category === selectedCategory);

  const handleAddComponent = (template: ComponentTemplate) => {
    const existingComponents = currentReport?.layout.components || [];
    const gridSize = 20;
    const baseX = 40;
    const baseY = 40;
    
    // Smart positioning - find the next available position
    let position = { x: baseX, y: baseY };
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const overlapping = existingComponents.some(component => {
        const comp = component.position;
        return !(position.x + 300 <= comp.x || 
                position.x >= comp.x + comp.width ||
                position.y + 200 <= comp.y || 
                position.y >= comp.y + comp.height);
      });
      
      if (!overlapping) break;
      
      // Try next position
      position.x += 320;
      if (position.x > 800) {
        position.x = baseX;
        position.y += 220;
      }
      attempts++;
    }
    
    addComponent({
      type: template.type,
      position: { 
        x: position.x, 
        y: position.y, 
        width: template.type === 'kpi' ? 280 : 320, 
        height: template.type === 'text' ? 160 : 220 
      },
      config: template.defaultConfig,
      dataSource: {
        filters: [],
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          to: new Date()
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Layout className="h-4 w-4" />
          Component Library
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Component Templates */}
        <div className="space-y-2">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Button
                key={template.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left hover:bg-muted/50"
                onClick={() => handleAddComponent(template)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{template.name}</span>
                      {template.isPremium && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          <Sparkles className="h-2 w-2 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {template.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Quick Tips */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <h4 className="text-xs font-medium mb-2">💡 Quick Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag components to reposition them</li>
            <li>• Use resize handles to adjust size</li>
            <li>• Click to select and configure</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}