import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Database, 
  Key, 
  Search,
  Link,
  Type,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";

const schemaData = {
  residents: {
    description: "Core resident data with care level and demographic information",
    fields: [
      { name: "resident_id", type: "VARCHAR(36)", isPrimaryKey: true, isRequired: true, description: "Unique resident identifier" },
      { name: "first_name", type: "VARCHAR(100)", isPrimaryKey: false, isRequired: true, description: "Resident first name" },
      { name: "last_name", type: "VARCHAR(100)", isPrimaryKey: false, isRequired: true, description: "Resident last name" },
      { name: "date_of_birth", type: "DATE", isPrimaryKey: false, isRequired: true, description: "Date of birth for age calculation" },
      { name: "care_level", type: "VARCHAR(50)", isPrimaryKey: false, isRequired: true, description: "Current care level (IL, AL, MC)" },
      { name: "admission_date", type: "DATE", isPrimaryKey: false, isRequired: true, description: "Move-in date" },
      { name: "room_number", type: "VARCHAR(10)", isPrimaryKey: false, isRequired: false, description: "Current room assignment" },
      { name: "community_id", type: "VARCHAR(36)", isPrimaryKey: false, isRequired: true, description: "Community reference" },
      { name: "emergency_contact", type: "JSON", isPrimaryKey: false, isRequired: false, description: "Emergency contact information" },
      { name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isRequired: true, description: "Record creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", isPrimaryKey: false, isRequired: true, description: "Last update timestamp" }
    ],
    relationships: [
      { table: "care_plans", field: "resident_id", type: "one-to-many" },
      { table: "revenue_summary", field: "resident_id", type: "one-to-many" },
      { table: "occupancy_metrics", field: "community_id", type: "many-to-one" }
    ]
  },
  occupancy_metrics: {
    description: "Daily occupancy tracking and census data by community",
    fields: [
      { name: "metric_id", type: "VARCHAR(36)", isPrimaryKey: true, isRequired: true, description: "Unique metric record identifier" },
      { name: "date", type: "DATE", isPrimaryKey: false, isRequired: true, description: "Reporting date" },
      { name: "community_id", type: "VARCHAR(36)", isPrimaryKey: false, isRequired: true, description: "Community reference" },
      { name: "occupied_units", type: "INTEGER", isPrimaryKey: false, isRequired: true, description: "Number of occupied units" },
      { name: "total_units", type: "INTEGER", isPrimaryKey: false, isRequired: true, description: "Total available units" },
      { name: "occupancy_rate", type: "DECIMAL(5,2)", isPrimaryKey: false, isRequired: true, description: "Calculated occupancy percentage" },
      { name: "move_ins", type: "INTEGER", isPrimaryKey: false, isRequired: false, description: "Move-ins for the day" },
      { name: "move_outs", type: "INTEGER", isPrimaryKey: false, isRequired: false, description: "Move-outs for the day" },
      { name: "waitlist_count", type: "INTEGER", isPrimaryKey: false, isRequired: false, description: "Current waitlist size" }
    ],
    relationships: [
      { table: "residents", field: "community_id", type: "one-to-many" }
    ]
  }
};

export function SchemaExplorerView() {
  const [selectedTable, setSelectedTable] = useState("residents");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSystemFields, setShowSystemFields] = useState(false);

  const currentSchema = schemaData[selectedTable as keyof typeof schemaData];
  
  const filteredFields = currentSchema.fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isSystemField = field.name.includes('_at') || field.name.includes('_id');
    return matchesSearch && (showSystemFields || !isSystemField || field.isPrimaryKey);
  });

  const getTypeIcon = (type: string) => {
    if (type.includes('VARCHAR') || type.includes('TEXT')) return Type;
    if (type.includes('INTEGER') || type.includes('DECIMAL')) return Database;
    if (type.includes('DATE') || type.includes('TIMESTAMP')) return Key;
    if (type.includes('JSON')) return Shield;
    return Database;
  };

  return (
    <div className="space-y-6">
      {/* Table Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(schemaData).map((tableName) => (
          <Button
            key={tableName}
            variant={selectedTable === tableName ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTable(tableName)}
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            {tableName}
          </Button>
        ))}
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSystemFields(!showSystemFields)}
          className="gap-2"
        >
          {showSystemFields ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSystemFields ? "Hide" : "Show"} System Fields
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schema Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                {selectedTable}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentSchema.description}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredFields.map((field, index) => {
                  const TypeIcon = getTypeIcon(field.type);
                  
                  return (
                    <div 
                      key={field.name}
                      className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
                        field.isPrimaryKey ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex items-center gap-2 mt-0.5">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            {field.isPrimaryKey && <Key className="h-3 w-3 text-primary" />}
                          </div>
                          
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium text-sm">{field.name}</span>
                              {field.isPrimaryKey && (
                                <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                  PK
                                </Badge>
                              )}
                              {field.isRequired && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  Required
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {field.description}
                            </div>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="text-xs font-mono">
                          {field.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relationships */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link className="h-4 w-4 text-primary" />
                Relationships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentSchema.relationships.map((rel, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{rel.table}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div>Field: <span className="font-mono">{rel.field}</span></div>
                      <div>Type: <span className="font-medium">{rel.type}</span></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {currentSchema.relationships.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No relationships defined
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Table Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Fields</div>
                  <div className="font-semibold">{currentSchema.fields.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Required</div>
                  <div className="font-semibold">
                    {currentSchema.fields.filter(f => f.isRequired).length}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Relationships</div>
                  <div className="font-semibold">{currentSchema.relationships.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Primary Keys</div>
                  <div className="font-semibold">
                    {currentSchema.fields.filter(f => f.isPrimaryKey).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}