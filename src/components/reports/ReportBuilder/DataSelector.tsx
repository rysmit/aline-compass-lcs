import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, X, Filter, Calendar, Database } from 'lucide-react';

// Mock data - would come from actual data schema
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

export function DataSelector() {
  const {
    selectedMetrics,
    setSelectedMetrics,
    selectedFields,
    setSelectedFields,
    selectedComponentId,
    updateComponent,
    currentReport
  } = useReportBuilder();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');

  const debouncedTitle = useDebounce(tempTitle, 300);
  const debouncedContent = useDebounce(tempContent, 300);

  const selectedComponent = currentReport?.layout.components.find(
    c => c.id === selectedComponentId
  );

  // Update temp values when component selection changes
  useState(() => {
    if (selectedComponent) {
      setTempTitle(selectedComponent.config.title || '');
      setTempContent(selectedComponent.config.content || '');
    }
  });

  // Update component when debounced values change
  useState(() => {
    if (selectedComponentId && selectedComponent && 
        (debouncedTitle !== selectedComponent.config.title || 
         debouncedContent !== selectedComponent.config.content)) {
      
      const updates: any = {};
      if (debouncedTitle !== selectedComponent.config.title) {
        updates.config = { ...selectedComponent.config, title: debouncedTitle };
      }
      if (debouncedContent !== selectedComponent.config.content) {
        updates.config = { ...updates.config || selectedComponent.config, content: debouncedContent };
      }
      
      if (Object.keys(updates).length > 0) {
        updateComponent(selectedComponentId, updates);
      }
    }
  });

  const filteredMetrics = availableMetrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || metric.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMetricToggle = (metricId: string) => {
    if (selectedComponentId && selectedComponent) {
      // Update the selected component's data source
      updateComponent(selectedComponentId, {
        dataSource: {
          ...selectedComponent.dataSource,
          metricId: metricId
        }
      });
    } else {
      // Update global selection
      setSelectedMetrics(
        selectedMetrics.includes(metricId)
          ? selectedMetrics.filter(id => id !== metricId)
          : [...selectedMetrics, metricId]
      );
    }
  };

  const handleFieldToggle = (fieldId: string) => {
    if (selectedComponentId && selectedComponent) {
      const currentFields = selectedComponent.dataSource.fields || [];
      updateComponent(selectedComponentId, {
        dataSource: {
          ...selectedComponent.dataSource,
          fields: currentFields.includes(fieldId)
            ? currentFields.filter(id => id !== fieldId)
            : [...currentFields, fieldId]
        }
      });
    } else {
      setSelectedFields(
        selectedFields.includes(fieldId)
          ? selectedFields.filter(id => id !== fieldId)
          : [...selectedFields, fieldId]
      );
    }
  };

  const currentMetrics = selectedComponentId && selectedComponent?.dataSource.metricId
    ? [selectedComponent.dataSource.metricId]
    : selectedMetrics;

  const currentFields = selectedComponentId && selectedComponent?.dataSource.fields
    ? selectedComponent.dataSource.fields
    : selectedFields;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="h-4 w-4" />
          Data Configuration
        </CardTitle>
        {selectedComponentId && (
          <p className="text-xs text-muted-foreground">
            Configuring: {selectedComponent?.config.title || 'Selected Component'}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-3">
            {/* Search and Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search metrics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="occupancy">Occupancy</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="census">Census</SelectItem>
                  <SelectItem value="care">Care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selected Metrics */}
            {currentMetrics.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs">Selected Metrics</Label>
                <div className="flex flex-wrap gap-1">
                  {currentMetrics.map(metricId => {
                    const metric = availableMetrics.find(m => m.id === metricId);
                    return (
                      <Badge
                        key={metricId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {metric?.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleMetricToggle(metricId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Metrics */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredMetrics.map(metric => (
                <Button
                  key={metric.id}
                  variant={currentMetrics.includes(metric.id) ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleMetricToggle(metric.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{metric.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.category}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fields" className="space-y-3">
            {/* Selected Fields */}
            {currentFields.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs">Selected Fields</Label>
                <div className="flex flex-wrap gap-1">
                  {currentFields.map(fieldId => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return (
                      <Badge
                        key={fieldId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {field?.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleFieldToggle(fieldId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Fields */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {availableFields.map(field => (
                <Button
                  key={field.id}
                  variant={currentFields.includes(field.id) ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleFieldToggle(field.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{field.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Component-specific configuration */}
        {selectedComponentId && selectedComponent && (
          <div className="border-t pt-3 space-y-3">
            <Label className="text-xs">Component Settings</Label>
             
            <div className="space-y-2">
              <Label className="text-xs">Title</Label>
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-xs"
                placeholder="Component title"
              />
            </div>

            {selectedComponent.type === 'chart' && (
              <div className="space-y-2">
                <Label className="text-xs">Chart Type</Label>
                <Select
                  value={selectedComponent.config.chartType || 'line'}
                  onValueChange={(value) => updateComponent(selectedComponentId, {
                    config: {
                      ...selectedComponent.config,
                      chartType: value as 'line' | 'bar' | 'pie' | 'area' | 'gauge' | 'scatter'
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="gauge">Gauge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedComponent.type === 'text' && (
              <div className="space-y-2">
                <Label className="text-xs">Content</Label>
                <Input
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  className="text-xs"
                  placeholder="Enter text content"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}