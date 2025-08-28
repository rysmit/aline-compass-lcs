import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { ColorPicker } from './ColorPicker';
import { 
  Palette, 
  Type, 
  BarChart3, 
  Settings,
  Layers,
  Move,
  Square
} from 'lucide-react';

export function ComponentToolbar() {
  const { 
    currentReport, 
    selectedComponentId, 
    updateComponent 
  } = useReportBuilder();

  const selectedComponent = currentReport?.layout.components.find(
    c => c.id === selectedComponentId
  );

  if (!selectedComponent) {
    return null;
  }

  const handleConfigUpdate = (updates: any) => {
    updateComponent(selectedComponentId!, {
      config: {
        ...selectedComponent.config,
        ...updates,
      },
    });
  };

  const handlePositionUpdate = (updates: any) => {
    updateComponent(selectedComponentId!, {
      position: {
        ...selectedComponent.position,
        ...updates,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Component Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Component Type Info */}
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium capitalize">
            {selectedComponent.type} Component
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="component-title" className="flex items-center gap-2">
            <Type className="h-3 w-3" />
            Title
          </Label>
          <Input
            id="component-title"
            value={selectedComponent.config.title || ''}
            onChange={(e) => handleConfigUpdate({ title: e.target.value })}
            placeholder="Component title"
          />
        </div>

        <Separator />

        {/* Chart-specific settings */}
        {selectedComponent.type === 'chart' && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3" />
                Chart Type
              </Label>
              <Select
                value={selectedComponent.config.chartType || 'line'}
                onValueChange={(value) => handleConfigUpdate({ chartType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="gauge">Gauge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Legend</Label>
                <Switch
                  checked={selectedComponent.config.showLegend !== false}
                  onCheckedChange={(checked) => handleConfigUpdate({ showLegend: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Grid</Label>
                <Switch
                  checked={selectedComponent.config.showGrid !== false}
                  onCheckedChange={(checked) => handleConfigUpdate({ showGrid: checked })}
                />
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* KPI-specific settings */}
        {selectedComponent.type === 'kpi' && (
          <>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={selectedComponent.config.format || 'number'}
                onValueChange={(value) => handleConfigUpdate({ format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Aggregation</Label>
              <Select
                value={selectedComponent.config.aggregation || 'avg'}
                onValueChange={(value) => handleConfigUpdate({ aggregation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                  <SelectItem value="max">Maximum</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />
          </>
        )}

        {/* Text-specific settings */}
        {selectedComponent.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={selectedComponent.config.fontSize || 'medium'}
                onValueChange={(value) => handleConfigUpdate({ fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alignment</Label>
              <Select
                value={selectedComponent.config.alignment || 'left'}
                onValueChange={(value) => handleConfigUpdate({ alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />
          </>
        )}

        {/* Position and Size */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Move className="h-3 w-3" />
            Position & Size
          </Label>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">X Position</Label>
              <Input
                type="number"
                value={selectedComponent.position.x}
                onChange={(e) => handlePositionUpdate({ x: parseInt(e.target.value) || 0 })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Y Position</Label>
              <Input
                type="number"
                value={selectedComponent.position.y}
                onChange={(e) => handlePositionUpdate({ y: parseInt(e.target.value) || 0 })}
                className="h-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={selectedComponent.position.width}
                onChange={(e) => handlePositionUpdate({ width: parseInt(e.target.value) || 100 })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={selectedComponent.position.height}
                onChange={(e) => handlePositionUpdate({ height: parseInt(e.target.value) || 100 })}
                className="h-8"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Style Settings */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Palette className="h-3 w-3" />
            Styling
          </Label>
          
          <ColorPicker
            label="Primary Color"
            value={selectedComponent.config.primaryColor || '#3b82f6'}
            onChange={(color) => handleConfigUpdate({ primaryColor: color })}
          />
          
          {selectedComponent.type === 'chart' && (
            <ColorPicker
              label="Secondary Color"
              value={selectedComponent.config.secondaryColor || '#10b981'}
              onChange={(color) => handleConfigUpdate({ secondaryColor: color })}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}