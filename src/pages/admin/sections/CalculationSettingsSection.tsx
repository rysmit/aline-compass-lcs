import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCalculationMethod, METRIC_CONFIGS } from "@/contexts/CalculationMethodContext";
import { Calculator, Settings2, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { CustomCalculationBuilder } from "@/components/admin/CustomCalculationBuilder";

export function CalculationSettingsSection() {
  const { getSelectedMethod, setCalculationMethod } = useCalculationMethod();
  const [selectedMetric, setSelectedMetric] = useState<string>("");

  const metrics = Object.keys(METRIC_CONFIGS).map(metricId => ({
    id: metricId,
    name: metricId.split('-').map(word => 
      word === 'ar' ? 'AR' : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    config: METRIC_CONFIGS[metricId]
  }));

  const selectedMetricConfig = selectedMetric ? METRIC_CONFIGS[selectedMetric] : undefined;
  const currentMethod = selectedMetric && selectedMetricConfig ? 
    getSelectedMethod(selectedMetric, selectedMetricConfig) : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Select Metric
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Metric to Configure</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a metric..." />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map((metric) => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name}
                    </SelectItem>
                  ))}
                  <CustomCalculationBuilder 
                    trigger={
                      <div className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Create a Custom Metric</span>
                      </div>
                    }
                  />
                </SelectContent>
              </Select>
            </div>

            {selectedMetric && (
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Available Methods
                  </Label>
                  <div className="space-y-1">
                    {selectedMetricConfig?.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-2 rounded border border-border/50">
                        <span className="text-sm font-medium">{method.label}</span>
                        {currentMethod?.id === method.id && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calculation Method Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              {selectedMetric ? `Configure ${metrics.find(m => m.id === selectedMetric)?.name}` : 'Method Configuration'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedMetric ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <div className="text-center space-y-2">
                  <Calculator className="h-8 w-8 mx-auto opacity-50" />
                  <p>Select a metric to configure its calculation methods</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Method */}
                {currentMethod && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current Calculation Method</Label>
                      <div className="p-4 rounded-lg border border-primary/30 bg-accent/20">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{currentMethod.label}</h4>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{currentMethod.description}</p>
                          {currentMethod.formula && (
                            <div className="mt-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formula</Label>
                              <code className="block mt-1 p-2 bg-muted rounded text-sm font-mono">{currentMethod.formula}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Methods */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Available Calculation Methods</Label>
                    <CustomCalculationBuilder 
                      metricId={selectedMetric}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Method
                        </Button>
                      }
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {selectedMetricConfig?.map((method) => (
                      <div key={method.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-semibold flex items-center gap-2">
                                {method.label}
                                {currentMethod?.id === method.id && (
                                  <Badge variant="default" className="text-xs">Current</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {currentMethod?.id !== method.id && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setCalculationMethod(selectedMetric, method.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <Settings2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {method.formula && (
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formula</Label>
                              <code className="block p-2 bg-muted rounded text-sm font-mono">{method.formula}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Calculation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Default Precision</Label>
              <Select defaultValue="2">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No decimals</SelectItem>
                  <SelectItem value="1">1 decimal place</SelectItem>
                  <SelectItem value="2">2 decimal places</SelectItem>
                  <SelectItem value="3">3 decimal places</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rounding Method</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Rounding</SelectItem>
                  <SelectItem value="floor">Round Down</SelectItem>
                  <SelectItem value="ceil">Round Up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number Format</Label>
              <Select defaultValue="us">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">US Format (1,234.56)</SelectItem>
                  <SelectItem value="eu">EU Format (1.234,56)</SelectItem>
                  <SelectItem value="minimal">Minimal (1234.56)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}