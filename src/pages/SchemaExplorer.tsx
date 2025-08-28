import { useState } from "react";
import { Search, Database, Clock, Building2, User, DollarSign, Stethoscope, ArrowRight, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataLineageIndicator } from "@/components/data-lineage/DataLineageIndicator";

interface SchemaField {
  id: string;
  name: string;
  displayName: string;
  definition: string;
  dataType: 'Text' | 'Date' | 'Number' | 'Boolean' | 'Enum';
  sourceSystems: string[];
  calculationMethod?: string;
  primaryOwner: string;
  updateFrequency: 'Real-time' | 'Hourly' | 'Daily' | 'Weekly';
  isRequired: boolean;
  isCalculated: boolean;
  derivedFrom?: string[];
  lastSynced: string;
}

const schemaData: Record<string, SchemaField[]> = {
  resident: [
    {
      id: 'resident_id',
      name: 'resident_id',
      displayName: 'Resident ID',
      definition: 'Unique identifier for each resident across all systems',
      dataType: 'Text',
      sourceSystems: ['CRM', 'Billing', 'eMar'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:30:00Z'
    },
    {
      id: 'move_in_date',
      name: 'move_in_date',
      displayName: 'Move-in Date',
      definition: 'Date when the resident officially moved into the community',
      dataType: 'Date',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:25:00Z'
    },
    {
      id: 'care_level',
      name: 'care_level',
      displayName: 'Care Level',
      definition: 'Current level of care required (Independent, Assisted, Memory Care, Skilled)',
      dataType: 'Enum',
      sourceSystems: ['eMar', 'CRM'],
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T13:15:00Z'
    },
    {
      id: 'length_of_stay',
      name: 'length_of_stay',
      displayName: 'Length of Stay',
      definition: 'Number of days from move-in date to current date (or move-out date)',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      calculationMethod: 'Current Date - Move-in Date',
      primaryOwner: 'CRM',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['move_in_date'],
      lastSynced: '2025-01-05T14:20:00Z'
    },
    {
      id: 'resident_status',
      name: 'resident_status',
      displayName: 'Status',
      definition: 'Current status of the resident (Active, Moved Out, Deceased, On Leave)',
      dataType: 'Enum',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:18:00Z'
    }
  ],
  sales: [
    {
      id: 'inquiry_id',
      name: 'inquiry_id',
      displayName: 'Inquiry ID',
      definition: 'Unique identifier for each sales inquiry or lead',
      dataType: 'Text',
      sourceSystems: ['CRM'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:12:00Z'
    },
    {
      id: 'first_inquiry_date',
      name: 'first_inquiry_date',
      displayName: 'First Inquiry Date',
      definition: 'Date of the earliest contact or inquiry from this prospect',
      dataType: 'Date',
      sourceSystems: ['CRM', 'Marketing Platform'],
      calculationMethod: 'MIN(contact_date) from all prospect interactions',
      primaryOwner: 'CRM',
      updateFrequency: 'Hourly',
      isRequired: true,
      isCalculated: true,
      derivedFrom: ['contact_interactions'],
      lastSynced: '2025-01-05T14:10:00Z'
    },
    {
      id: 'lead_source',
      name: 'lead_source',
      displayName: 'Lead Source',
      definition: 'Original channel or method through which the prospect was acquired',
      dataType: 'Enum',
      sourceSystems: ['CRM', 'Marketing Platform'],
      primaryOwner: 'CRM',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:08:00Z'
    },
    {
      id: 'sales_velocity',
      name: 'sales_velocity',
      displayName: 'Sales Velocity',
      definition: 'Rate of converting inquiries to move-ins over time',
      dataType: 'Number',
      sourceSystems: ['CRM'],
      calculationMethod: 'Move-ins / Average Inquiry Days',
      primaryOwner: 'CRM',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['move_ins', 'inquiry_days'],
      lastSynced: '2025-01-05T14:05:00Z'
    }
  ],
  billing: [
    {
      id: 'monthly_revenue',
      name: 'monthly_revenue',
      displayName: 'Monthly Revenue',
      definition: 'Total revenue collected from all residents for a given month',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:02:00Z'
    },
    {
      id: 'accounts_receivable',
      name: 'accounts_receivable',
      displayName: 'Accounts Receivable',
      definition: 'Outstanding amount owed by residents and insurance companies',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T14:00:00Z'
    },
    {
      id: 'collection_rate',
      name: 'collection_rate',
      displayName: 'Collection Rate',
      definition: 'Percentage of billed amount successfully collected',
      dataType: 'Number',
      sourceSystems: ['Billing'],
      calculationMethod: 'Collected Amount / Billed Amount * 100',
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['collected_amount', 'billed_amount'],
      lastSynced: '2025-01-05T13:58:00Z'
    },
    {
      id: 'revenue_per_unit',
      name: 'revenue_per_unit',
      displayName: 'Revenue Per Unit',
      definition: 'Average monthly revenue per occupied unit',
      dataType: 'Number',
      sourceSystems: ['Billing', 'CRM'],
      calculationMethod: 'Monthly Revenue / Occupied Units',
      primaryOwner: 'Billing',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['monthly_revenue', 'occupied_units'],
      lastSynced: '2025-01-05T13:55:00Z'
    }
  ],
  care: [
    {
      id: 'care_plan_id',
      name: 'care_plan_id',
      displayName: 'Care Plan ID',
      definition: 'Unique identifier for each resident care plan',
      dataType: 'Text',
      sourceSystems: ['eMar'],
      primaryOwner: 'eMar',
      updateFrequency: 'Real-time',
      isRequired: true,
      isCalculated: false,
      lastSynced: '2025-01-05T13:52:00Z'
    },
    {
      id: 'medication_adherence',
      name: 'medication_adherence',
      displayName: 'Medication Adherence',
      definition: 'Percentage of prescribed medications taken as scheduled',
      dataType: 'Number',
      sourceSystems: ['eMar'],
      calculationMethod: 'Doses Taken / Doses Prescribed * 100',
      primaryOwner: 'eMar',
      updateFrequency: 'Hourly',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['doses_taken', 'doses_prescribed'],
      lastSynced: '2025-01-05T13:50:00Z'
    },
    {
      id: 'care_plan_compliance',
      name: 'care_plan_compliance',
      displayName: 'Care Plan Compliance',
      definition: 'Percentage of care plan activities completed as scheduled',
      dataType: 'Number',
      sourceSystems: ['eMar', 'Vitals'],
      calculationMethod: 'Completed Activities / Scheduled Activities * 100',
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['completed_activities', 'scheduled_activities'],
      lastSynced: '2025-01-05T13:48:00Z'
    },
    {
      id: 'incident_rate',
      name: 'incident_rate',
      displayName: 'Incident Report Rate',
      definition: 'Number of incident reports per 1000 resident days',
      dataType: 'Number',
      sourceSystems: ['eMar'],
      calculationMethod: 'Incident Reports / Resident Days * 1000',
      primaryOwner: 'eMar',
      updateFrequency: 'Daily',
      isRequired: false,
      isCalculated: true,
      derivedFrom: ['incident_reports', 'resident_days'],
      lastSynced: '2025-01-05T13:45:00Z'
    }
  ]
};

const domainIcons = {
  resident: User,
  sales: Building2,
  billing: DollarSign,
  care: Stethoscope
};

const domainColors = {
  resident: 'bg-blue-500',
  sales: 'bg-green-500',
  billing: 'bg-purple-500',
  care: 'bg-orange-500'
};

function FieldDetailPanel({ field, isOpen, onOpenChange }: { 
  field: SchemaField | null; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!field) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {field.displayName}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 mt-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Field Name</label>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{field.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data Type</label>
                  <Badge variant="outline" className="mt-1">{field.dataType}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Definition</label>
                <p className="text-sm mt-1">{field.definition}</p>
              </div>
            </div>

            {/* Data Lineage */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Lineage</h3>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Source Systems</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {field.sourceSystems.map((system) => (
                    <Badge key={system} variant="secondary">{system}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Primary Owner</label>
                  <Badge className={`mt-1 ${domainColors.billing} text-white`}>
                    Owned by {field.primaryOwner}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Update Frequency</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{field.updateFrequency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Method */}
            {field.isCalculated && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Calculation Details</h3>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Calculation Method</label>
                  <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{field.calculationMethod}</p>
                </div>
                
                {field.derivedFrom && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Derived From</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {field.derivedFrom.map((source) => (
                        <div key={source} className="flex items-center gap-1 text-sm bg-accent/50 px-2 py-1 rounded">
                          <span>{source}</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sync Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sync Information</h3>
              
              <DataLineageIndicator 
                sourceSystems={field.sourceSystems}
                lastSynced={field.lastSynced}
                isInferred={field.isCalculated}
              />
            </div>

            {/* Additional Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Properties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Required:</span>
                  <Badge variant={field.isRequired ? "default" : "secondary"}>
                    {field.isRequired ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Calculated:</span>
                  <Badge variant={field.isCalculated ? "default" : "secondary"}>
                    {field.isCalculated ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function SchemaExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<SchemaField | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleFieldClick = (field: SchemaField) => {
    setSelectedField(field);
    setIsDetailOpen(true);
  };

  const filterFields = (fields: SchemaField[]) => {
    if (!searchTerm) return fields;
    return fields.filter(field => 
      field.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card shadow-card">
        <div className="aline-page-margin py-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Schema Explorer</h1>
              <p className="text-muted-foreground">
                Explore the canonical data model used in Compass and OpenHub
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fields by name or definition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aline-page-margin py-6">
        <Tabs defaultValue="resident" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resident" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Resident
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="care" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Care
            </TabsTrigger>
          </TabsList>

          {Object.entries(schemaData).map(([domain, fields]) => {
            const Icon = domainIcons[domain as keyof typeof domainIcons];
            const filteredFields = filterFields(fields);
            
            return (
              <TabsContent key={domain} value={domain} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="h-5 w-5" />
                  <h2 className="text-xl font-semibold capitalize">{domain} Schema</h2>
                  <Badge variant="secondary">{filteredFields.length} fields</Badge>
                </div>
                
                <div className="grid gap-3">
                  {filteredFields.map((field) => (
                    <Card 
                      key={field.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleFieldClick(field)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{field.displayName}</h3>
                              <Badge variant="outline" className="text-xs">
                                {field.dataType}
                              </Badge>
                              {field.isCalculated && (
                                <Badge variant="secondary" className="text-xs">
                                  Calculated
                                </Badge>
                              )}
                              <Badge className={`text-xs text-white ${domainColors[field.primaryOwner.toLowerCase() as keyof typeof domainColors] || 'bg-gray-500'}`}>
                                {field.primaryOwner}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {field.definition}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Sources: {field.sourceSystems.join(', ')}</span>
                              <span>•</span>
                              <span>{field.updateFrequency}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredFields.length === 0 && searchTerm && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No fields found</h3>
                        <p className="text-muted-foreground">
                          No fields match your search criteria in the {domain} domain.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <FieldDetailPanel 
        field={selectedField}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}