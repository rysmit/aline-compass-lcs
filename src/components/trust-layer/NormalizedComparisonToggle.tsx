import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowUpDown, Info, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityMetric {
  id: string;
  name: string;
  occupancy: number;
  census: number;
  capacity: number;
  revenue: number;
  avgDailyRate: number;
  avgLengthOfStay: number;
  retentionRate: number;
  residentDays: number;
}

interface NormalizedComparisonToggleProps {
  data: CommunityMetric[];
  title?: string;
}

const SAMPLE_DATA: CommunityMetric[] = [
  {
    id: '1',
    name: 'Westside Community',
    occupancy: 92,
    census: 184,
    capacity: 200,
    revenue: 890000,
    avgDailyRate: 185,
    avgLengthOfStay: 18,
    retentionRate: 87,
    residentDays: 5520
  },
  {
    id: '2',
    name: 'Downtown Manor',
    occupancy: 85,
    census: 127,
    capacity: 150,
    revenue: 650000,
    avgDailyRate: 195,
    avgLengthOfStay: 22,
    retentionRate: 91,
    residentDays: 3810
  },
  {
    id: '3',
    name: 'Garden Heights',
    occupancy: 88,
    census: 88,
    capacity: 100,
    revenue: 480000,
    avgDailyRate: 175,
    avgLengthOfStay: 16,
    retentionRate: 82,
    residentDays: 2640
  },
  {
    id: '4',
    name: 'Riverside Place',
    occupancy: 94,
    census: 235,
    capacity: 250,
    revenue: 1150000,
    avgDailyRate: 180,
    avgLengthOfStay: 20,
    retentionRate: 89,
    residentDays: 7050
  }
];

export function NormalizedComparisonToggle({ 
  data = SAMPLE_DATA, 
  title = "Community Performance Comparison" 
}: NormalizedComparisonToggleProps) {
  const [viewMode, setViewMode] = useState<'raw' | 'normalized'>('raw');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  const formatNumber = (value: number, decimals = 0) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getNormalizedValue = (metric: CommunityMetric, field: string) => {
    const perResidentDay = metric.residentDays;
    
    switch (field) {
      case 'revenue':
        return metric.revenue / perResidentDay;
      case 'occupancy':
        return metric.occupancy; // Already a percentage
      case 'avgDailyRate':
        return metric.avgDailyRate; // Already per-resident
      case 'avgLengthOfStay':
        return metric.avgLengthOfStay; // Already normalized
      case 'retentionRate':
        return metric.retentionRate; // Already a percentage
      case 'census':
        return (metric.census / metric.capacity) * 100; // As percentage of capacity
      default:
        return 0;
    }
  };

  const getRawValue = (metric: CommunityMetric, field: string) => {
    switch (field) {
      case 'revenue':
        return metric.revenue;
      case 'occupancy':
        return metric.occupancy;
      case 'avgDailyRate':
        return metric.avgDailyRate;
      case 'avgLengthOfStay':
        return metric.avgLengthOfStay;
      case 'retentionRate':
        return metric.retentionRate;
      case 'census':
        return metric.census;
      default:
        return 0;
    }
  };

  const getValue = (metric: CommunityMetric, field: string) => {
    return viewMode === 'normalized' ? getNormalizedValue(metric, field) : getRawValue(metric, field);
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    const aValue = getValue(a, sortField);
    const bValue = getValue(b, sortField);
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const columns = [
    { 
      id: 'name', 
      label: 'Community', 
      sortable: true,
      format: (value: any) => value
    },
    { 
      id: 'occupancy', 
      label: 'Occupancy', 
      sortable: true,
      tooltip: viewMode === 'normalized' ? 'Occupancy rate as percentage' : 'Current occupancy percentage',
      format: (value: number) => formatPercent(value)
    },
    { 
      id: 'census', 
      label: 'Census', 
      sortable: true,
      tooltip: viewMode === 'normalized' ? 'Census as % of capacity' : 'Current resident count',
      format: (value: number) => viewMode === 'normalized' ? formatPercent(value) : formatNumber(value)
    },
    { 
      id: 'revenue', 
      label: 'Revenue', 
      sortable: true,
      tooltip: viewMode === 'normalized' ? 'Revenue per resident day (PRD)' : 'Total monthly revenue',
      format: (value: number) => formatCurrency(value)
    },
    { 
      id: 'avgDailyRate', 
      label: 'ADR', 
      sortable: true,
      tooltip: 'Average Daily Rate per resident',
      format: (value: number) => formatCurrency(value)
    },
    { 
      id: 'avgLengthOfStay', 
      label: 'Avg LOS', 
      sortable: true,
      tooltip: 'Average Length of Stay in months',
      format: (value: number) => `${formatNumber(value)} mo`
    },
    { 
      id: 'retentionRate', 
      label: 'Retention', 
      sortable: true,
      tooltip: 'Resident retention rate',
      format: (value: number) => formatPercent(value)
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {viewMode === 'normalized' 
                      ? "Normalized values allow fair comparison across communities of different sizes. Revenue shown per resident day, census as % of capacity."
                      : "Raw values show actual numbers without normalization adjustments."
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'raw' | 'normalized')}
              className="border rounded-lg p-1"
            >
              <ToggleGroupItem value="raw" className="text-xs">
                Raw Values
              </ToggleGroupItem>
              <ToggleGroupItem value="normalized" className="text-xs">
                <Calculator className="h-3 w-3 mr-1" />
                Normalized
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        {viewMode === 'normalized' && (
          <Badge variant="secondary" className="w-fit">
            Normalized by capacity and resident days for fair comparison
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id}
                    className={cn(
                      column.sortable && "cursor-pointer hover:bg-muted/50 select-none"
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{column.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {column.sortable && (
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      )}
                      {sortField === column.id && (
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          sortDirection === 'asc' ? 'bg-primary' : 'bg-primary'
                        )} />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((metric, index) => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      {metric.name}
                    </div>
                  </TableCell>
                  {columns.slice(1).map((column) => (
                    <TableCell key={column.id}>
                      {column.format(getValue(metric, column.id))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}