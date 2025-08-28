import { useMemo } from 'react';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Grid } from 'lucide-react';
import { ComponentPalette } from './ComponentPalette';
import { DataSelector } from './DataSelector';
import { ReportHeader } from './ReportHeader';

export function ReportCanvas() {
  const {
    currentReport,
    selectedComponentId,
    setSelectedComponentId,
    canvasSize,
    isBuilderMode,
    createReport,
    removeComponent
  } = useReportBuilder();

  const handleCreateNewReport = () => {
    const name = `Report ${Date.now()}`;
    createReport(name, 'New custom report');
  };

  if (!currentReport) {
    return (
      <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
        <div className="text-center space-y-4">
          <Grid className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">No report loaded</p>
            <p className="text-sm text-muted-foreground">
              Create a new report or load an existing one to start building
            </p>
            <Button onClick={handleCreateNewReport} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create New Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponentId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Report Header */}
      <ReportHeader />

      <div className="grid grid-cols-12 gap-4">
        {/* Component Palette */}
        {isBuilderMode && (
          <div className="col-span-3">
            <ComponentPalette />
          </div>
        )}

        {/* Main Canvas */}
        <div className={cn(
          "bg-white border border-border rounded-lg relative overflow-hidden",
          isBuilderMode ? "col-span-6" : "col-span-9"
        )}>
          <div
            className="relative min-h-[600px] p-4"
            style={{ width: canvasSize.width, height: canvasSize.height }}
            onClick={handleCanvasClick}
          >
            {/* Grid Background (only in builder mode) */}
            {isBuilderMode && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
            )}

            {/* Report Components */}
            {currentReport.layout.components.map((component) => (
              <div
                key={component.id}
                className={cn(
                  "absolute border-2 border-transparent rounded group",
                  selectedComponentId === component.id && "border-primary",
                  isBuilderMode && "cursor-pointer hover:border-primary/50"
                )}
                style={{
                  left: component.position.x,
                  top: component.position.y,
                  width: component.position.width,
                  height: component.position.height
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isBuilderMode) {
                    setSelectedComponentId(component.id);
                  }
                }}
              >
                {/* Delete button for selected component */}
                {isBuilderMode && selectedComponentId === component.id && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(component.id);
                    }}
                  >
                    ×
                  </Button>
                )}
                <ReportComponentRenderer component={component} />
              </div>
            ))}

            {/* Empty state */}
            {currentReport.layout.components.length === 0 && (
              <div className="absolute inset-4 flex items-center justify-center z-10">
                <div className="text-center space-y-6 max-w-md mx-auto">
                  <Plus className="h-16 w-16 mx-auto text-muted-foreground/60" />
                  <div className="space-y-3">
                    <p className="text-xl font-semibold text-foreground">Empty Canvas</p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {isBuilderMode
                        ? "Drag components from the palette to start building your report"
                        : "Switch to edit mode to add components to this report"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Configuration Panel */}
        {isBuilderMode && (
          <div className="col-span-3">
            <DataSelector />
          </div>
        )}
      </div>
    </div>
  );
}

// Component renderer with stable mock data
function ReportComponentRenderer({ component }: { component: any }) {
  const { config, dataSource } = component;
  
  // Generate stable mock data using component ID as seed
  const stableData = useMemo(() => {
    const seed = component.id || 'default';
    const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const getKPIData = () => ({
      value: `${85 + (seedNum % 15)}.${seedNum % 10}%`,
      change: `+${(seedNum % 8) + 1}.${seedNum % 10}%`,
      label: dataSource?.metricId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Sample Metric'
    });

    const getChartData = () => Array.from({ length: 7 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: 50 + ((seedNum + i * 7) % 50)
    }));

    return { kpi: getKPIData(), chart: getChartData() };
  }, [component.id, dataSource?.metricId]);

  switch (component.type) {
    case 'kpi':
      return (
        <Card className="h-full">
          <CardContent className="p-4 flex flex-col justify-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stableData.kpi.value}
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              {config.title || stableData.kpi.label}
            </div>
            <div className="text-xs text-green-600">
              {stableData.kpi.change} vs last period
            </div>
          </CardContent>
        </Card>
      );

    case 'chart':
      return (
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {config.title || `${stableData.chart[0]?.name || 'Sample'} Chart`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-full min-h-[120px] bg-gradient-to-br from-primary/10 to-primary/5 rounded flex items-center justify-center relative overflow-hidden">
              {/* Simple chart visualization */}
              <div className="absolute inset-4 flex items-end gap-1">
                {stableData.chart.slice(0, 5).map((item, i: number) => (
                  <div
                    key={i}
                    className="bg-primary/60 rounded-t flex-1"
                    style={{ height: `${(item.value / 150) * 100}%` }}
                    title={`${item.name}: ${item.value}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground z-10">
                {config.chartType || "bar"} chart preview
              </span>
            </div>
          </CardContent>
        </Card>
      );

    case 'table':
      return (
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {config.title || "Data Table"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-full min-h-[120px] overflow-hidden">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold border-b pb-1">
                  <div>Item</div>
                  <div>Value</div>
                  <div>Change</div>
                </div>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                    <div>Row {i + 1}</div>
                    <div>{Math.floor(Math.random() * 100)}</div>
                    <div className="text-green-600">+{Math.floor(Math.random() * 10)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'text':
      return (
        <Card className="h-full">
          <CardContent className="p-4 flex items-center justify-center">
            <p className="text-sm text-center">
              {config.content || "Enter your custom text content here. You can use this component to add notes, explanations, or insights to your report."}
            </p>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card className="h-full">
          <CardContent className="p-4 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Unknown component type: {component.type}
            </span>
          </CardContent>
        </Card>
      );
  }
}