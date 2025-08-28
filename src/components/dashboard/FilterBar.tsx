import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, ChevronDown, X, MoreHorizontal, CalendarIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterBarProps {
  filters: {
    dateRange: string;
    division: string;
    region: string;
    community: string;
    careLevel: string;
    payerType: string;
    alertLevel: string;
    portfolioSegment: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  className?: string;
}

const filterLabels = {
  dateRange: {
    "30d": "Last 30 Days",
    "90d": "Last 90 Days", 
    "ytd": "Year to Date",
    "1y": "Last Year"
  },
  division: {
    "all": "All Divisions",
    "east": "Eastern Division",
    "central": "Central Division", 
    "west": "Western Division"
  },
  region: {
    "all": "All Regions",
    "northeast": "Northeast",
    "southeast": "Southeast",
    "midwest": "Midwest",
    "southwest": "Southwest",
    "west": "West Coast",
    "northwest": "Northwest",
    "florida": "Florida",
    "texas": "Texas",
    "california": "California"
  },
  community: {
    "all": "All Communities",
    "group_high": "High Performing",
    "group_med": "Medium Performing",
    "group_low": "Needs Attention",
    "oakridge": "Oak Ridge Manor",
    "sunset": "Sunset Village",
    "gardens": "Garden Terrace",
    "meadows": "Meadow Brook",
    "heritage": "Heritage Hills",
    "willow": "Willow Creek"
  },
  careLevel: {
    "all": "All Levels",
    "il": "Independent Living",
    "al": "Assisted Living", 
    "mc": "Memory Care",
    "snf": "Skilled Nursing"
  },
  payerType: {
    "all": "All Payers",
    "private": "Private Pay",
    "medicaid": "Medicaid",
    "insurance": "LTC Insurance",
    "va": "VA Benefits"
  },
  alertLevel: {
    "all": "All Alerts",
    "churn": "Churn Risk",
    "forecast": "Forecast Variance",
    "compliance": "Compliance",
    "ar": "AR Risk"
  },
  portfolioSegment: {
    "all": "All Segments",
    "life-plan": "Life Plan Communities",
    "rental": "Rental Communities", 
    "managed": "Managed Communities"
  }
};

const filterDisplayNames = {
  dateRange: "Date Range",
  division: "Division", 
  region: "Region",
  community: "Community",
  careLevel: "Care Level",
  payerType: "Payer Type",
  alertLevel: "Alert Type",
  portfolioSegment: "Portfolio Segment"
};

export function FilterBar({ filters, onFilterChange, onReset, className }: FilterBarProps) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isFilterActive = (key: string) => {
    return filters[key as keyof typeof filters] !== "all" && filters[key as keyof typeof filters] !== "30d";
  };

  const getActiveFilters = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "dateRange") return value !== "30d";
      return value !== "all";
    });
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  // Core filters always visible
  const coreFilters = ['dateRange', 'region', 'community', 'careLevel', 'alertLevel'];
  // Additional filters in More dropdown
  const moreFilters = ['division', 'payerType', 'portfolioSegment'];

  const formatFilterSummary = () => {
    if (!hasActiveFilters) return "No filters applied";
    
    return activeFilters.map(([key, value]) => {
      const displayName = filterDisplayNames[key as keyof typeof filterDisplayNames];
      const valueLabel = filterLabels[key as keyof typeof filterLabels][value as keyof typeof filterLabels[keyof typeof filterLabels]] || value;
      return `${displayName}: ${valueLabel}`;
    }).join(" | ");
  };

  return (
    <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)} className={className}>
      {/* Collapsible Header */}
      <div className="flex items-center justify-between px-1 py-1 bg-muted/30 border border-border/50 rounded-t-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {isCollapsed ? `Filters (${activeFilters.length} active)` : formatFilterSummary()}
          </span>
          
          {/* Active Filter Pills - Show when collapsed */}
          {isCollapsed && hasActiveFilters && (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {activeFilters.slice(0, 3).map(([key, value]) => {
                const displayName = filterDisplayNames[key as keyof typeof filterDisplayNames];
                const valueLabel = filterLabels[key as keyof typeof filterLabels][value as keyof typeof filterLabels[keyof typeof filterLabels]] || value;
                
                return (
                  <Badge 
                    key={key}
                    variant="secondary" 
                    className="h-5 px-2 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-1 flex-shrink-0"
                  >
                    <span>{displayName}: {valueLabel}</span>
                    <button
                      onClick={() => onFilterChange(key, key === "dateRange" ? "30d" : "all")}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </Badge>
                );
              })}
              {activeFilters.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{activeFilters.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="h-6 px-2 text-xs border-0 bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
          
          {/* Collapse Toggle */}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-200", 
                isCollapsed && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      {/* Collapsible Content */}
      <CollapsibleContent className="border-x border-b border-border/50 rounded-b-lg overflow-hidden">
        <div className="bg-background">
          {/* Main Filter Bar - Compact Horizontal Layout */}
          <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
            {/* Date Range Filter - Always First */}
            <Select value={filters.dateRange} onValueChange={(value) => onFilterChange('dateRange', value)}>
              <SelectTrigger className={cn(
                "h-8 min-w-[120px] border-0 bg-muted/50 hover:bg-muted transition-colors text-xs",
                isFilterActive('dateRange') && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}>
                <CalendarIcon className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Core Filters */}
            {coreFilters.slice(1).map((filterKey) => {
              const isActive = isFilterActive(filterKey);
              const filterData = filters[filterKey as keyof typeof filters];
              const displayName = filterDisplayNames[filterKey as keyof typeof filterDisplayNames];
              
              return (
                <Select 
                  key={filterKey} 
                  value={filterData} 
                  onValueChange={(value) => onFilterChange(filterKey, value)}
                >
                  <SelectTrigger className={cn(
                    "h-8 min-w-[100px] border-0 bg-muted/50 hover:bg-muted transition-colors text-xs",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}>
                    <SelectValue placeholder={displayName} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.entries(filterLabels[filterKey as keyof typeof filterLabels]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })}

            {/* More Filters Dropdown */}
            <Popover open={showMoreFilters} onOpenChange={setShowMoreFilters}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-3 text-xs border-0 bg-muted/50 hover:bg-muted",
                    moreFilters.some(f => isFilterActive(f)) && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <MoreHorizontal className="h-3 w-3 mr-1" />
                  More Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Additional Filters</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {moreFilters.map((filterKey) => {
                      const filterData = filters[filterKey as keyof typeof filters];
                      const displayName = filterDisplayNames[filterKey as keyof typeof filterDisplayNames];
                      
                      return (
                        <Select 
                          key={filterKey} 
                          value={filterData} 
                          onValueChange={(value) => onFilterChange(filterKey, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder={displayName} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(filterLabels[filterKey as keyof typeof filterLabels]).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}