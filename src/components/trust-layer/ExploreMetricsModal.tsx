import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Plus, BarChart3, Users, DollarSign, TrendingUp, Heart, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricDefinition {
  id: string;
  name: string;
  definition: string;
  category: string;
  visualization: string;
  linkedDashboards: string[];
  isFavorite?: boolean;
  isAvailable?: boolean;
  requiredSystems?: string[];
}

const METRIC_CATEGORIES = [
  { id: 'all', label: 'All Metrics', icon: BarChart3 },
  { id: 'occupancy', label: 'Occupancy', icon: Building },
  { id: 'census', label: 'Census', icon: Users },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'sales', label: 'Sales', icon: TrendingUp },
  { id: 'care', label: 'Care & Clinical', icon: Heart }
];

const SAMPLE_METRICS: MetricDefinition[] = [
  {
    id: 'occupancy-rate',
    name: 'Occupancy Rate',
    definition: 'Percentage of occupied units compared to total available units',
    category: 'occupancy',
    visualization: 'Line Chart with Trend',
    linkedDashboards: ['Executive Overview', 'REIT Portfolio'],
    isFavorite: true,
    isAvailable: true
  },
  {
    id: 'average-daily-census',
    name: 'Average Daily Census',
    definition: 'Average number of residents per day over a given period',
    category: 'census',
    visualization: 'Bar Chart with Historical Comparison',
    linkedDashboards: ['Census & Occupancy', 'Community Dashboard'],
    isFavorite: false,
    isAvailable: true
  },
  {
    id: 'revenue-per-unit',
    name: 'Revenue Per Unit',
    definition: 'Monthly revenue divided by total number of units',
    category: 'financial',
    visualization: 'KPI Card with Trend Indicator',
    linkedDashboards: ['Financial Health', 'Executive Overview'],
    isFavorite: false,
    isAvailable: true
  },
  {
    id: 'lead-conversion-rate',
    name: 'Lead Conversion Rate',
    definition: 'Percentage of leads that convert to move-ins',
    category: 'sales',
    visualization: 'Funnel Chart',
    linkedDashboards: ['Sales Pipeline'],
    isFavorite: true,
    isAvailable: false,
    requiredSystems: ['CRM Integration']
  },
  {
    id: 'medication-adherence',
    name: 'Medication Adherence Rate',
    definition: 'Percentage of prescribed medications taken on schedule',
    category: 'care',
    visualization: 'Progress Ring with Details',
    linkedDashboards: ['Care & Compliance'],
    isFavorite: false,
    isAvailable: false,
    requiredSystems: ['eMar System']
  }
];

interface ExploreMetricsModalProps {
  children: React.ReactNode;
}

export function ExploreMetricsModal({ children }: ExploreMetricsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['occupancy-rate', 'lead-conversion-rate']));

  const filteredMetrics = SAMPLE_METRICS.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         metric.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (metricId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(metricId)) {
      newFavorites.delete(metricId);
    } else {
      newFavorites.add(metricId);
    }
    setFavorites(newFavorites);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = METRIC_CATEGORIES.find(cat => cat.id === categoryId);
    const Icon = category?.icon || BarChart3;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Explore Metrics Library</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search metrics by name or definition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              {METRIC_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {METRIC_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMetrics.map((metric) => (
                    <Card 
                      key={metric.id} 
                      className={cn(
                        "transition-all hover:shadow-md",
                        !metric.isAvailable && "opacity-60 border-dashed"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(metric.category)}
                            <CardTitle className="text-sm">{metric.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(metric.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Star 
                                className={cn(
                                  "h-3 w-3",
                                  favorites.has(metric.id) ? "fill-primary text-primary" : "text-muted-foreground"
                                )} 
                              />
                            </Button>
                            {metric.isAvailable ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-xs">
                          {metric.definition}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Visualization</p>
                          <p className="text-xs">{metric.visualization}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Used In</p>
                          <div className="flex flex-wrap gap-1">
                            {metric.linkedDashboards.map((dashboard) => (
                              <Badge key={dashboard} variant="outline" className="text-xs">
                                {dashboard}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {!metric.isAvailable && metric.requiredSystems && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Requires</p>
                            <div className="flex flex-wrap gap-1">
                              {metric.requiredSystems.map((system) => (
                                <Badge key={system} variant="destructive" className="text-xs">
                                  {system}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}