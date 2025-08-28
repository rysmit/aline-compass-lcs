import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Database, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from "lucide-react";

const catalogData = [
  {
    tableName: "residents",
    description: "Complete resident profile and care level data",
    rowCount: "12,847",
    columns: 24,
    qualityScore: 98.5,
    lastUpdated: "2 min ago",
    category: "Core",
    tags: ["PII", "Critical"],
    icon: Users,
    color: "bg-blue-500"
  },
  {
    tableName: "occupancy_metrics",
    description: "Daily occupancy rates and census tracking",
    rowCount: "45,231",
    columns: 12,
    qualityScore: 99.2,
    lastUpdated: "5 min ago",
    category: "Operations",
    tags: ["Daily", "KPI"],
    icon: TrendingUp,
    color: "bg-green-500"
  },
  {
    tableName: "revenue_summary",
    description: "Monthly revenue by community and care level",
    rowCount: "8,943",
    columns: 18,
    qualityScore: 97.8,
    lastUpdated: "1 hour ago",
    category: "Financial",
    tags: ["Monthly", "Revenue"],
    icon: DollarSign,
    color: "bg-purple-500"
  },
  {
    tableName: "care_plans",
    description: "Care plan compliance and assessment data",
    rowCount: "15,672",
    columns: 31,
    qualityScore: 96.4,
    lastUpdated: "3 min ago",
    category: "Clinical",
    tags: ["Compliance", "Care"],
    icon: Database,
    color: "bg-red-500"
  },
  {
    tableName: "sales_pipeline",
    description: "Lead tracking and conversion metrics",
    rowCount: "23,156",
    columns: 19,
    qualityScore: 98.1,
    lastUpdated: "1 min ago",
    category: "Sales",
    tags: ["Leads", "CRM"],
    icon: TrendingUp,
    color: "bg-orange-500"
  },
  {
    tableName: "staffing_metrics",
    description: "Staff-to-resident ratios and scheduling data",
    rowCount: "67,834",
    columns: 15,
    qualityScore: 94.7,
    lastUpdated: "10 min ago",
    category: "HR",
    tags: ["Staffing", "Daily"],
    icon: Calendar,
    color: "bg-teal-500"
  }
];

const categories = ["All", "Core", "Operations", "Financial", "Clinical", "Sales", "HR"];

export function DataCatalogGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const filteredData = catalogData.filter(table => {
    const matchesSearch = table.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || table.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getQualityBadge = (score: number) => {
    if (score >= 98) return { variant: "default" as const, icon: CheckCircle, color: "text-green-600" };
    if (score >= 95) return { variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-600" };
    return { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables, descriptions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredData.map((table) => {
          const IconComponent = table.icon;
          const qualityBadge = getQualityBadge(table.qualityScore);
          const QualityIcon = qualityBadge.icon;
          
          return (
            <Card 
              key={table.tableName}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-border"
              onClick={() => setSelectedTable(selectedTable === table.tableName ? null : table.tableName)}
            >
              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${table.color} text-white`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">{table.tableName}</div>
                        <Badge variant="outline" className="text-xs">
                          {table.category}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-1 rounded ${qualityBadge.color}`}>
                      <QualityIcon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-sm text-muted-foreground">
                    {table.description}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Rows</div>
                      <div className="font-semibold">{table.rowCount}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Columns</div>
                      <div className="font-semibold">{table.columns}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Quality</div>
                      <div className="font-semibold">{table.qualityScore}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Updated</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {table.lastUpdated}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {table.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded Details */}
                  {selectedTable === table.tableName && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg animate-fade-in">
                      <div className="space-y-2 text-xs">
                        <div className="font-medium">Table Details:</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>• Primary Key: ID field</div>
                          <div>• Foreign Keys: 3 relations</div>
                          <div>• Indexes: 5 optimized</div>
                          <div>• Partitioning: Date-based</div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="font-medium mb-1">Access Methods:</div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">API</Badge>
                            <Badge variant="outline" className="text-xs">SQL</Badge>
                            <Badge variant="outline" className="text-xs">Export</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredData.length} of {catalogData.length} tables
        {searchTerm && ` matching "${searchTerm}"`}
        {selectedCategory !== "All" && ` in ${selectedCategory} category`}
      </div>
    </div>
  );
}