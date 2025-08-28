import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  Database, 
  Download, 
  Info, 
  Shield, 
  CheckCircle,
  Server,
  FileSpreadsheet,
  Cloud,
  Zap,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { CompassGoldDataVisualization } from "@/components/data-visualization/CompassGoldDataVisualization";

const dataModelPreview = [
  {
    tableName: "residents",
    description: "Complete resident profile and care level data",
    sampleFields: "resident_id, name, care_level, admission_date, room_number",
    sourceSystem: "CRM + Care Management",
    lastUpdated: "Real-time"
  },
  {
    tableName: "occupancy_metrics",
    description: "Daily occupancy rates and census tracking",
    sampleFields: "date, community_id, occupied_units, total_units, occupancy_rate",
    sourceSystem: "Property Management",
    lastUpdated: "Daily 6:00 AM"
  },
  {
    tableName: "revenue_summary",
    description: "Monthly revenue by community and care level",
    sampleFields: "month, community_id, care_level, gross_revenue, net_revenue",
    sourceSystem: "Billing + Accounting",
    lastUpdated: "Monthly"
  },
  {
    tableName: "care_plans",
    description: "Care plan compliance and assessment data",
    sampleFields: "resident_id, care_plan_id, compliance_score, last_assessment",
    sourceSystem: "Care Management",
    lastUpdated: "Real-time"
  },
  {
    tableName: "sales_pipeline",
    description: "Lead tracking and conversion metrics",
    sampleFields: "lead_id, source, stage, community_id, conversion_date",
    sourceSystem: "CRM",
    lastUpdated: "Real-time"
  },
  {
    tableName: "staffing_metrics",
    description: "Staff-to-resident ratios and scheduling data",
    sampleFields: "date, community_id, staff_count, resident_count, ratio",
    sourceSystem: "HR + Staffing",
    lastUpdated: "Daily"
  }
];

const consumptionMethods = [
  {
    id: "api",
    label: "API Access",
    description: "REST API with JSON responses",
    icon: Zap
  },
  {
    id: "direct-connector",
    label: "Direct connector for your preferred data tool",
    description: "Endpoint access for PowerBI, Tableau, Qlik etc",
    icon: Database
  },
  {
    id: "sql-endpoint",
    label: "SQL Endpoint",
    description: "Direct SQL query access via secure endpoint",
    icon: Server
  },
  {
    id: "snowflake",
    label: "Snowflake",
    description: "Direct cloud data warehouse connection",
    icon: Cloud
  },
  {
    id: "csv",
    label: "CSV Export",
    description: "Scheduled CSV file delivery",
    icon: FileSpreadsheet
  }
];

export function CompassGold() {
  const navigate = useNavigate();
  const [selectedConsumptionMethod, setSelectedConsumptionMethod] = useState("api");
  const [isDataModelOpen, setIsDataModelOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Data Explorer", href: "/data-explorer" },
    { label: "Compass Gold" }
  ];

  const scrollToDataModel = () => {
    const element = document.getElementById('data-model-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="border-b border-border bg-card shadow-card">
        <div className="aline-page-margin py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/data-explorer')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Data Explorer
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Compass Gold</h1>
                <p className="text-lg text-muted-foreground">
                  Unified Enterprise Data Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aline-page-margin py-8 space-y-8">

        {/* Section 2: Interactive Data Visualization */}
        <div id="data-model-section">
          <CompassGoldDataVisualization />
        </div>

        {/* Section 3: Traditional Data Model Table (Collapsible) */}
        <Collapsible open={isDataModelOpen} onOpenChange={setIsDataModelOpen}>
          <Card className="border-muted">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isDataModelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      Complete Data Model Reference
                    </CardTitle>
                    <CardDescription>
                      Detailed table-by-table breakdown of the Compass Gold schema
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Sample Fields</TableHead>
                      <TableHead>Source System</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataModelPreview.map((table, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {table.tableName}
                            </code>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="w-64 p-0 z-[100000]">
                                  <div className="p-3 space-y-2">
                                    <p className="text-xs font-medium">Table Details</p>
                                    <p className="text-xs">{table.description}</p>
                                    <p className="text-xs">
                                      <span className="font-medium">Source:</span> {table.sourceSystem}
                                    </p>
                                    <p className="text-xs">
                                      <span className="font-medium">Update Frequency:</span> {table.lastUpdated}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{table.description}</TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {table.sampleFields}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {table.sourceSystem}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {table.lastUpdated}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Section 4: Access Setup Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Get Started with Compass Gold
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Select your preferred data consumption method and request access from your Aline Customer Success team. Compass Gold supports secure access via API, direct connectors, SQL endpoints, or cloud data warehouses.
            </p>

            {/* Consumption Method Selector */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Data Access Method</Label>
              <RadioGroup 
                value={selectedConsumptionMethod} 
                onValueChange={setSelectedConsumptionMethod}
                className="grid grid-cols-2 gap-4"
              >
                {consumptionMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                      <div className="flex items-start gap-3 flex-1">
                        <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{method.label}</div>
                          <div className="text-xs text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button size="lg" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Request Setup
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Setup includes secure authentication, usage logging, and support from Aline's data team.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Data access is governed by enterprise terms of use and role-based permissions.{" "}
                <a href="#" className="text-primary hover:underline">
                  Learn more in our Data Governance Guide
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}