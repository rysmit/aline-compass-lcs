import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, X, Calculator, Database, Sigma, Save, AlertCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomCalculationBuilderProps {
  metricId?: string;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DataField {
  id: string;
  name: string;
  type: 'number' | 'percentage' | 'currency' | 'text' | 'date';
  source: string;
  description?: string;
}

interface FormulaComponent {
  id: string;
  type: 'field' | 'operator' | 'function' | 'constant';
  value: string;
  display: string;
}

// Mock data fields - in real implementation, this would come from your data schema
const AVAILABLE_DATA_FIELDS: DataField[] = [
  { id: 'total_revenue', name: 'Total Revenue', type: 'currency', source: 'Financial System', description: 'Monthly recurring revenue from all units' },
  { id: 'occupied_units', name: 'Occupied Units', type: 'number', source: 'Property Management', description: 'Number of currently occupied units' },
  { id: 'total_units', name: 'Total Units', type: 'number', source: 'Property Management', description: 'Total number of units available' },
  { id: 'care_hours', name: 'Care Hours', type: 'number', source: 'Care Management', description: 'Total care hours provided' },
  { id: 'resident_count', name: 'Resident Count', type: 'number', source: 'Resident Management', description: 'Total number of residents' },
  { id: 'operating_expenses', name: 'Operating Expenses', type: 'currency', source: 'Financial System', description: 'Monthly operating expenses' },
  { id: 'new_inquiries', name: 'New Inquiries', type: 'number', source: 'Sales System', description: 'Number of new inquiries this period' },
  { id: 'conversions', name: 'Conversions', type: 'number', source: 'Sales System', description: 'Number of inquiries converted to residents' },
];

const OPERATORS = [
  { id: 'add', symbol: '+', name: 'Add' },
  { id: 'subtract', symbol: '-', name: 'Subtract' },
  { id: 'multiply', symbol: '×', name: 'Multiply' },
  { id: 'divide', symbol: '÷', name: 'Divide' },
  { id: 'parentheses_open', symbol: '(', name: 'Open Parentheses' },
  { id: 'parentheses_close', symbol: ')', name: 'Close Parentheses' },
];

const FUNCTIONS = [
  { id: 'sum', name: 'SUM', description: 'Sum of values' },
  { id: 'avg', name: 'AVERAGE', description: 'Average of values' },
  { id: 'max', name: 'MAX', description: 'Maximum value' },
  { id: 'min', name: 'MIN', description: 'Minimum value' },
  { id: 'count', name: 'COUNT', description: 'Count of values' },
];

export function CustomCalculationBuilder({ metricId, trigger, isOpen, onOpenChange }: CustomCalculationBuilderProps) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [methodDescription, setMethodDescription] = useState("");
  const [formula, setFormula] = useState<FormulaComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const actualOpen = isOpen !== undefined ? isOpen : open;
  const actualOnOpenChange = onOpenChange || setOpen;

  const filteredFields = AVAILABLE_DATA_FIELDS.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToFormula = (component: FormulaComponent) => {
    setFormula(prev => [...prev, component]);
  };

  const removeFromFormula = (index: number) => {
    setFormula(prev => prev.filter((_, i) => i !== index));
  };

  const addField = (field: DataField) => {
    addToFormula({
      id: `field_${field.id}`,
      type: 'field',
      value: field.id,
      display: field.name
    });
  };

  const addOperator = (operator: typeof OPERATORS[0]) => {
    addToFormula({
      id: `op_${operator.id}`,
      type: 'operator',
      value: operator.id,
      display: operator.symbol
    });
  };

  const addFunction = (func: typeof FUNCTIONS[0]) => {
    addToFormula({
      id: `func_${func.id}`,
      type: 'function',
      value: func.id,
      display: `${func.name}(`
    });
  };

  const addConstant = (value: string) => {
    if (value.trim()) {
      addToFormula({
        id: `const_${Date.now()}`,
        type: 'constant',
        value: value.trim(),
        display: value.trim()
      });
    }
  };

  const generateFormulaString = () => {
    return formula.map(component => {
      switch (component.type) {
        case 'field':
          return `{${component.value}}`;
        case 'function':
          return component.display;
        default:
          return component.display;
      }
    }).join(' ');
  };

  const clearFormula = () => {
    setFormula([]);
  };

  const resetAll = () => {
    setMethodName("");
    setMethodDescription("");
    setFormula([]);
  };

  const validateFormula = () => {
    if (!methodName.trim()) return "Method name is required";
    if (!methodDescription.trim()) return "Method description is required";
    if (formula.length === 0) return "Formula cannot be empty";
    return null;
  };

  const handleSave = () => {
    const error = validateFormula();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    // Here you would save the custom calculation method
    // For now, we'll just show a success message
    toast({
      title: "Custom Method Created",
      description: `${methodName} has been created successfully.`,
    });

    // Reset form
    setMethodName("");
    setMethodDescription("");
    setFormula([]);
    actualOnOpenChange(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" />
      Add Custom Method
    </Button>
  );

  return (
    <Dialog open={actualOpen} onOpenChange={actualOnOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Custom Calculation Builder
            {metricId && <Badge variant="outline">For {metricId}</Badge>}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">{/* Add padding for scrollbar */}
          {/* Left Panel - Data Fields */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Available Data Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
              
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                      onClick={() => addField(field)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{field.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {field.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{field.source}</p>
                        {field.description && (
                          <p className="text-xs text-muted-foreground">{field.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Middle Panel - Formula Builder */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sigma className="h-4 w-4" />
              Formula Builder
            </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Method Name</Label>
                      <Input
                        placeholder="e.g., Custom Occupancy Rate"
                        value={methodName}
                        onChange={(e) => setMethodName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe how this calculation works..."
                        value={methodDescription}
                        onChange={(e) => setMethodDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Current Formula Display */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Current Formula</Label>
                      {formula.length > 0 && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFormula}
                            className="text-xs h-7 px-2"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Clear
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetAll}
                            className="text-xs h-7 px-2"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reset All
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="min-h-[80px] p-3 border border-border rounded-lg bg-muted/50">
                      {formula.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Start building your formula by adding data fields, operators, and functions</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formula.map((component, index) => (
                            <div
                              key={`${component.id}_${index}`}
                              className="flex items-center gap-1 bg-background border border-border rounded px-2 py-1"
                            >
                              <span className="text-sm font-mono">{component.display}</span>
                              <button
                                onClick={() => removeFromFormula(index)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Formula String */}
                  {formula.length > 0 && (
                    <div className="space-y-2">
                      <Label>Generated Formula</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        <code className="text-sm font-mono break-all">{generateFormulaString()}</code>
                      </div>
                    </div>
                  )}

                  {/* Quick Operators */}
                  <div className="space-y-2">
                    <Label>Operators</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {OPERATORS.map((operator) => (
                        <Button
                          key={operator.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addOperator(operator)}
                          className="font-mono"
                        >
                          {operator.symbol}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Functions */}
                  <div className="space-y-2">
                    <Label>Functions</Label>
                    <div className="space-y-1">
                      {FUNCTIONS.map((func) => (
                        <Button
                          key={func.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addFunction(func)}
                          className="w-full justify-start text-left"
                        >
                          <span className="font-mono mr-2">{func.name}</span>
                          <span className="text-muted-foreground text-xs">{func.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Add Constant */}
                  <div className="space-y-2">
                    <Label>Add Number</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter number..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addConstant((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement?.querySelector('input');
                          if (input) {
                            addConstant(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right Panel - Preview & Save */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Save className="h-4 w-4" />
                Preview & Save
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {/* Preview */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Method Preview</Label>
                      <div className="p-4 border border-border rounded-lg space-y-3">
                        <div>
                          <h4 className="font-semibold">{methodName || "Custom Method"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {methodDescription || "No description provided"}
                          </p>
                        </div>
                        {formula.length > 0 && (
                          <div>
                            <Label className="text-xs">Formula</Label>
                            <code className="block mt-1 p-2 bg-muted rounded text-sm font-mono break-all">
                              {generateFormulaString()}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Validation Errors */}
                    {(() => {
                      const error = validateFormula();
                      return error ? (
                        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <p className="text-sm text-destructive">{error}</p>
                        </div>
                      ) : null;
                    })()}

                    {/* Sample Calculation */}
                    {formula.length > 0 && !validateFormula() && (
                      <div className="space-y-2">
                        <Label>Sample Calculation</Label>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            With sample data, this would calculate: <strong>75.2%</strong>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            (This is a preview - actual values will be calculated from your data)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button 
                      onClick={handleSave} 
                      className="w-full"
                      disabled={!!validateFormula()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Custom Method
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => actualOnOpenChange(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}