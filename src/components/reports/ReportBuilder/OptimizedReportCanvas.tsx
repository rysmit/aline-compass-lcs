import React, { useState, useRef, useCallback } from 'react';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { ReportHeader } from './ReportHeader';
import { EnhancedComponentRenderer } from './EnhancedComponentRenderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { 
  Plus, 
  Grid, 
  Layers, 
  Settings,
  Database,
  HelpCircle,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Type,
  Hash,
  Sparkles,
  Eye,
  Edit3
} from 'lucide-react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

// Compact component templates
const componentTemplates = [
  { id: 'kpi', name: 'KPI', icon: Hash, category: 'metrics', description: 'Key metric display' },
  { id: 'line-chart', name: 'Line', icon: LineChart, category: 'charts', description: 'Trend visualization' },
  { id: 'bar-chart', name: 'Bar', icon: BarChart3, category: 'charts', description: 'Comparison chart' },
  { id: 'pie-chart', name: 'Pie', icon: PieChart, category: 'charts', description: 'Part-to-whole chart' },
  { id: 'table', name: 'Table', icon: Table, category: 'data', description: 'Tabular data' },
  { id: 'text', name: 'Text', icon: Type, category: 'content', description: 'Text content' },
];

const categories = ['all', 'metrics', 'charts', 'data', 'content'];

// Mock data
const availableMetrics = [
  { id: 'occupancy-rate', name: 'Occupancy Rate', category: 'occupancy' },
  { id: 'revenue-per-unit', name: 'Revenue Per Unit', category: 'financial' },
  { id: 'churn-rate', name: 'Churn Rate', category: 'census' },
  { id: 'care-plan-compliance', name: 'Care Plan Compliance', category: 'care' }
];

const availableFields = [
  { id: 'community_id', name: 'Community', type: 'dimension' },
  { id: 'care_level', name: 'Care Level', type: 'dimension' },
  { id: 'region', name: 'Region', type: 'dimension' },
  { id: 'date', name: 'Date', type: 'dimension' }
];

export function OptimizedReportCanvas() {
  const { 
    currentReport, 
    isBuilderMode, 
    isViewMode,
    selectedComponentId, 
    setSelectedComponentId,
    updateComponent,
    removeComponent,
    createReport,
    addComponent,
    selectedMetrics,
    setSelectedMetrics,
    selectedFields,
    setSelectedFields,
    setIsBuilderMode,
    setIsViewMode
  } = useReportBuilder();

  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTab, setActiveTab] = useState('components');
  const [componentFilter, setComponentFilter] = useState('all');
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const snapToGrid = useCallback((x: number, y: number): { x: number; y: number } => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedComponent(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (delta.x === 0 && delta.y === 0) {
      setDraggedComponent(null);
      return;
    }

    const componentId = active.id as string;
    const component = currentReport?.layout.components.find(c => c.id === componentId);
    
    if (component) {
      const newPosition = snapToGrid(
        component.position.x + delta.x,
        component.position.y + delta.y
      );
      
      const boundedPosition = {
        x: Math.max(0, Math.min(CANVAS_WIDTH - component.position.width, newPosition.x)),
        y: Math.max(0, Math.min(CANVAS_HEIGHT - component.position.height, newPosition.y)),
      };

      updateComponent(componentId, {
        position: {
          ...component.position,
          ...boundedPosition,
        },
      });
    }
    
    setDraggedComponent(null);
  }, [currentReport, updateComponent, snapToGrid]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponentId(null);
    }
  }, [setSelectedComponentId]);

  const handleComponentSelect = useCallback((componentId: string) => {
    setSelectedComponentId(componentId);
    setActiveTab('properties');
  }, [setSelectedComponentId]);

  const handleComponentResize = useCallback((componentId: string, newSize: { width: number; height: number }) => {
    const component = currentReport?.layout.components.find(c => c.id === componentId);
    if (component) {
      const snappedSize = {
        width: Math.round(newSize.width / GRID_SIZE) * GRID_SIZE,
        height: Math.round(newSize.height / GRID_SIZE) * GRID_SIZE,
      };
      
      updateComponent(componentId, {
        position: {
          ...component.position,
          ...snappedSize,
        },
      });
    }
  }, [currentReport, updateComponent]);

  const handleAddComponent = (template: any) => {
    const existingComponents = currentReport?.layout.components || [];
    const position = {
      x: Math.max(0, existingComponents.length * 40),
      y: Math.max(0, existingComponents.length * 40),
      width: 300,
      height: 200,
    };

    const componentType = template.id === 'line-chart' || template.id === 'bar-chart' || template.id === 'pie-chart' ? 'chart' : template.id;
    const chartType = template.id.includes('chart') ? template.id.replace('-chart', '') as 'line' | 'bar' | 'pie' | 'area' | 'gauge' | 'scatter' : undefined;
    
    addComponent({
      type: componentType,
      position,
      config: {
        title: template.name,
        chartType,
      },
      dataSource: { metricId: '', fields: [] },
    });
  };

  const selectedComponent = currentReport?.layout.components.find(c => c.id === selectedComponentId);

  if (!currentReport) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-4">No Report Selected</h3>
          <p className="text-muted-foreground mb-6">Create a new report to get started</p>
          <Button onClick={() => createReport('New Report')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </Card>
      </div>
    );
  }

  const filteredComponents = componentTemplates.filter(
    template => componentFilter === 'all' || template.category === componentFilter
  );

  return (
    <div className="h-full flex flex-col">
      <ReportHeader />
      
      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar - Components Library */}
        {isBuilderMode && (
          <div className="w-[300px] border-r flex flex-col min-w-[300px]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-4 m-2">
                <TabsTrigger value="components" className="text-xs">
                  <Layers className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="properties" className="text-xs">
                  <Settings className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs">
                  <Database className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="help" className="text-xs">
                  <HelpCircle className="h-3 w-3" />
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="components" className="h-full p-2 m-0 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Components</div>
                    
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-1">
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={componentFilter === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setComponentFilter(category)}
                          className="text-xs h-6 px-2"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>

                    {/* Component Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {filteredComponents.map((template) => (
                        <TooltipProvider key={template.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddComponent(template)}
                                className="h-16 p-2 flex flex-col items-center gap-1 hover:bg-accent"
                              >
                                <template.icon className="h-4 w-4" />
                                <span className="text-xs font-medium">{template.name}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              {template.description}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>

                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                      💡 Tip: Click any component to configure its properties
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="properties" className="h-full p-2 m-0 overflow-y-auto">
                  {selectedComponent ? (
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Properties</div>
                      
                      {/* Component info */}
                      <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                        <Layers className="h-3 w-3" />
                        {selectedComponent.type} Component
                      </div>

                      {/* Quick settings in compact form */}
                      <div className="space-y-2">
                        {/* Title */}
                        <div>
                          <label className="text-xs font-medium">Title</label>
                          <input
                            type="text"
                            value={selectedComponent.config.title || ''}
                            onChange={(e) => updateComponent(selectedComponentId!, {
                              config: { ...selectedComponent.config, title: e.target.value }
                            })}
                            className="w-full mt-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* Position & Size in compact grid */}
                        <div>
                          <label className="text-xs font-medium">Position & Size</label>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <input
                              type="number"
                              placeholder="X"
                              value={selectedComponent.position.x}
                              onChange={(e) => updateComponent(selectedComponentId!, {
                                position: { ...selectedComponent.position, x: parseInt(e.target.value) || 0 }
                              })}
                              className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <input
                              type="number"
                              placeholder="Y"
                              value={selectedComponent.position.y}
                              onChange={(e) => updateComponent(selectedComponentId!, {
                                position: { ...selectedComponent.position, y: parseInt(e.target.value) || 0 }
                              })}
                              className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <input
                              type="number"
                              placeholder="Width"
                              value={selectedComponent.position.width}
                              onChange={(e) => updateComponent(selectedComponentId!, {
                                position: { ...selectedComponent.position, width: parseInt(e.target.value) || 100 }
                              })}
                              className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <input
                              type="number"
                              placeholder="Height"
                              value={selectedComponent.position.height}
                              onChange={(e) => updateComponent(selectedComponentId!, {
                                position: { ...selectedComponent.position, height: parseInt(e.target.value) || 100 }
                              })}
                              className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        {/* Chart type for charts */}
                        {selectedComponent.type === 'chart' && (
                          <div>
                            <label className="text-xs font-medium">Chart Type</label>
                            <select
                              value={selectedComponent.config.chartType || 'line'}
                              onChange={(e) => updateComponent(selectedComponentId!, {
                                config: { ...selectedComponent.config, chartType: e.target.value as 'line' | 'bar' | 'pie' | 'area' | 'gauge' | 'scatter' }
                              })}
                              className="w-full mt-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="line">Line Chart</option>
                              <option value="bar">Bar Chart</option>
                              <option value="area">Area Chart</option>
                              <option value="pie">Pie Chart</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground text-xs p-4">
                      Select a component to view its properties
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="data" className="h-full p-2 m-0 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Data Sources</div>
                    
                    {/* Compact metrics list */}
                    <div>
                      <label className="text-xs font-medium">Metrics</label>
                      <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                        {availableMetrics.map(metric => (
                          <button
                            key={metric.id}
                            onClick={() => {
                              if (selectedComponentId && selectedComponent) {
                                updateComponent(selectedComponentId, {
                                  dataSource: { ...selectedComponent.dataSource, metricId: metric.id }
                                });
                              }
                            }}
                            className="w-full text-left px-2 py-1 text-xs border rounded hover:bg-accent flex items-center justify-between"
                          >
                            <span>{metric.name}</span>
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              {metric.category}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Compact fields list */}
                    <div>
                      <label className="text-xs font-medium">Fields</label>
                      <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                        {availableFields.map(field => (
                          <button
                            key={field.id}
                            className="w-full text-left px-2 py-1 text-xs border rounded hover:bg-accent flex items-center justify-between"
                          >
                            <span>{field.name}</span>
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              {field.type}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="h-full p-2 m-0 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Quick Help</div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-muted rounded">
                        <div className="font-medium mb-1">🏗️ Building Reports</div>
                        <p>Add components from the Components tab, then configure them in Properties.</p>
                      </div>
                      
                      <div className="p-2 bg-muted rounded">
                        <div className="font-medium mb-1">🎨 Customizing</div>
                        <p>Select any component to modify its title, position, size, and styling options.</p>
                      </div>
                      
                      <div className="p-2 bg-muted rounded">
                        <div className="font-medium mb-1">📊 Data Binding</div>
                        <p>Use the Data tab to connect metrics and fields to your components.</p>
                      </div>
                      
                      <div className="p-2 bg-muted rounded">
                        <div className="font-medium mb-1">⌨️ Shortcuts</div>
                        <p>• Drag to move components<br/>• Click + drag edges to resize<br/>• Click background to deselect</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {/* Main Canvas - Right Side */}
        <div className="flex-1 relative bg-background">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div
              ref={canvasRef}
              className={cn(
                "relative w-full h-full overflow-auto",
                showGrid && isBuilderMode && "bg-grid-pattern",
              )}
              onClick={handleCanvasClick}
              style={{
                backgroundImage: showGrid && isBuilderMode 
                  ? `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`
                  : undefined,
                backgroundSize: showGrid && isBuilderMode ? `${GRID_SIZE}px ${GRID_SIZE}px` : undefined,
              }}
            >
              <div 
                className="relative"
                style={{ 
                  width: CANVAS_WIDTH, 
                  height: CANVAS_HEIGHT,
                  minWidth: '100%',
                  minHeight: '100%'
                }}
              >
                {currentReport.layout.components.map((component) => (
                  <EnhancedComponentRenderer
                    key={component.id}
                    component={component}
                    isSelected={selectedComponentId === component.id}
                    isBuilderMode={isBuilderMode}
                    onSelect={handleComponentSelect}
                    onResize={handleComponentResize}
                    onDelete={removeComponent}
                    isDragging={draggedComponent === component.id}
                  />
                ))}
                
                {currentReport.layout.components.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Start Building Your Report</h3>
                      <p className="text-muted-foreground mb-4">
                        Use the component library on the left to add elements
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DragOverlay>
              {draggedComponent && (
                <div className="opacity-75 transform rotate-3 scale-105">
                  <Card className="p-4 shadow-lg border-primary/50">
                    <div className="text-sm font-medium">Moving Component...</div>
                  </Card>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* View/Edit Mode Toggle */}
            {(isViewMode || isBuilderMode) && (
              <Button
                variant={isViewMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  console.log('Toggle clicked. Current state:', { isViewMode, isBuilderMode });
                  if (isViewMode) {
                    setIsViewMode(false);
                    setIsBuilderMode(true);
                  } else {
                    setIsViewMode(true);
                    setIsBuilderMode(false);
                  }
                }}
              >
                {isViewMode ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Viewing
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit Mode
                  </>
                )}
              </Button>
            )}
            
            {/* Grid Toggle - only in builder mode */}
            {isBuilderMode && (
              <Button
                variant={showGrid ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="h-3 w-3 mr-1" />
                Grid
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}