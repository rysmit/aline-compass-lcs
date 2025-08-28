import React, { useState, useRef, useCallback } from 'react';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { ReportHeader } from './ReportHeader';
import { EnhancedComponentPalette } from './EnhancedComponentPalette';
import { DataSelector } from './DataSelector';
import { EnhancedComponentRenderer } from './EnhancedComponentRenderer';
import { ComponentToolbar } from './ComponentToolbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Grid, Layers, Settings } from 'lucide-react';
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

const GRID_SIZE = 20;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

interface GridPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function EnhancedReportCanvas() {
  const { 
    currentReport, 
    isBuilderMode, 
    selectedComponentId, 
    setSelectedComponentId,
    updateComponent,
    removeComponent,
    createReport 
  } = useReportBuilder();

  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
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
      
      // Ensure component stays within canvas bounds
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

  return (
    <div className="h-full flex flex-col">
      <ReportHeader />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {isBuilderMode && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full p-4 space-y-4 overflow-y-auto border-r bg-muted/30">
                  <EnhancedComponentPalette />
                  <div className="flex gap-2">
                    <Button
                      variant={showGrid ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowGrid(!showGrid)}
                      className="flex-1"
                    >
                      <Grid className="h-3 w-3 mr-1" />
                      Grid
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={isBuilderMode ? 60 : 80}>
            <div className="h-full relative bg-background">
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
                            Drag components from the palette to create your custom report
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
            </div>
          </ResizablePanel>
          
          {isBuilderMode && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full p-4 space-y-4 overflow-y-auto border-l bg-muted/30">
                  {selectedComponentId && <ComponentToolbar />}
                  <DataSelector />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}