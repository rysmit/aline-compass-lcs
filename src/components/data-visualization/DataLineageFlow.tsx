import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, ArrowRight, Users, DollarSign, Activity, Building, Calendar, FileText, Zap } from "lucide-react";
const sourceSystemsData = [{
  id: "crm",
  name: "CRM",
  icon: Users,
  color: "bg-blue-500",
  tables: ["contacts", "leads", "residents"]
}, {
  id: "billing",
  name: "Billing",
  icon: DollarSign,
  color: "bg-green-500",
  tables: ["invoices", "payments", "rates"]
}, {
  id: "care",
  name: "Care Mgmt",
  icon: Activity,
  color: "bg-red-500",
  tables: ["care_plans", "assessments", "medications"]
}, {
  id: "property",
  name: "Property",
  icon: Building,
  color: "bg-purple-500",
  tables: ["units", "occupancy", "maintenance"]
}, {
  id: "hr",
  name: "HR",
  icon: Calendar,
  color: "bg-orange-500",
  tables: ["employees", "schedules", "certifications"]
}, {
  id: "clinical",
  name: "Clinical",
  icon: FileText,
  color: "bg-teal-500",
  tables: ["medical_records", "incidents", "compliance"]
}];
const unifiedTables = [{
  name: "residents",
  description: "Complete resident profiles",
  sources: ["crm", "care", "billing"]
}, {
  name: "occupancy_metrics",
  description: "Daily occupancy tracking",
  sources: ["property", "crm"]
}, {
  name: "revenue_summary",
  description: "Financial performance",
  sources: ["billing", "property"]
}, {
  name: "care_plans",
  description: "Care compliance data",
  sources: ["care", "clinical"]
}, {
  name: "sales_pipeline",
  description: "Lead conversion tracking",
  sources: ["crm"]
}, {
  name: "staffing_metrics",
  description: "Staff-to-resident ratios",
  sources: ["hr", "property"]
}];
export function DataLineageFlow() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [highlightedSources, setHighlightedSources] = useState<string[]>([]);
  const getStaggerClass = (index: number) => {
    const staggerPattern = ['ml-0',
    // CRM - left aligned
    'ml-3',
    // Billing - slight right
    'ml-6',
    // Care - more right
    'ml-3',
    // Property - back to center
    'ml-1',
    // HR - slight left
    'ml-4' // Clinical - slight right
    ];
    return staggerPattern[index] || 'ml-0';
  };
  const handleTableHover = (tableName: string) => {
    const table = unifiedTables.find(t => t.name === tableName);
    if (table) {
      setHighlightedSources(table.sources);
    }
  };
  const handleTableLeave = () => {
    setHighlightedSources([]);
  };
  return <div className="relative space-y-2 max-w-4xl mx-[50px] rounded-lg p-3" style={{
    backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    opacity: 0.95
  }}>
      <div className="text-center space-y-0.5">
        <h3 className="text-sm font-semibold">Data Flow Visualization</h3>
        <p className="text-[10px] text-muted-foreground">
          Hover unified tables to see source dependencies
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Source Systems - Ultra Compact Left */}
        <div className="space-y-1">
          <div className="text-[10px] font-medium text-muted-foreground mb-1">Source Systems</div>
          <div className="space-y-1">
            {sourceSystemsData.map((system, index) => {
            const IconComponent = system.icon;
            const isHighlighted = highlightedSources.includes(system.id);
            return <Card key={system.id} className={`transition-all duration-300 ${getStaggerClass(index)} ${isHighlighted ? 'ring-1 ring-primary shadow-sm scale-[1.02]' : highlightedSources.length > 0 ? 'opacity-40' : 'hover:shadow-sm'}`}>
                  <CardContent className="p-1.5">
                    <div className="flex items-start gap-1.5">
                      <div className={`p-1 rounded ${system.color} text-white flex-shrink-0`}>
                        <IconComponent className="h-2.5 w-2.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[9px] truncate">{system.name}</div>
                        <div className="space-y-0.5 mt-0.5">
                          {system.tables.map((table, index) => <div key={index} className="text-[8px] text-muted-foreground bg-muted px-1 py-0.5 rounded-sm">
                              {table}
                            </div>)}
                        </div>
                      </div>
                      {isHighlighted && <Zap className="h-2.5 w-2.5 text-primary animate-pulse flex-shrink-0" />}
                    </div>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>

        {/* Flow Arrow - Minimal Center */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-0.5">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-[8px] text-muted-foreground">Transform</span>
          </div>
        </div>

        {/* Unified Tables - Ultra Compact Right */}
        <div className="space-y-1">
          <div className="text-[10px] font-medium text-muted-foreground mb-1">Unified Data Model</div>
          <div className="space-y-1">
            {unifiedTables.map(table => <Card key={table.name} className="cursor-pointer transition-all duration-300 hover:shadow-sm hover:scale-[1.02] border-primary/20" onMouseEnter={() => handleTableHover(table.name)} onMouseLeave={handleTableLeave} onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}>
                <CardContent className="p-1.5">
                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <div className="p-1 rounded bg-primary/10 flex-shrink-0">
                        <Database className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[9px] truncate">{table.name}</div>
                        <div className="text-[8px] text-muted-foreground truncate">{table.description}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-0.5">
                      {table.sources.map(sourceId => {
                    const source = sourceSystemsData.find(s => s.id === sourceId);
                    return source ? <Badge key={sourceId} variant="outline" className="text-[8px] px-1 py-0 h-3 leading-none">
                            {source.name}
                          </Badge> : null;
                  })}
                    </div>
                    
                    {selectedTable === table.name && <div className="mt-1 p-1 bg-muted/50 rounded animate-fade-in">
                        <div className="grid grid-cols-2 gap-0.5 text-[8px] text-muted-foreground">
                          <div>• Real-time</div>
                          <div>• Validated</div>
                          <div>• Audited</div>
                          <div>• API ready</div>
                        </div>
                      </div>}
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>

      {/* Ultra Compact Legend */}
      
    </div>;
}