import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrendingUp, TrendingDown, Minus, Info, Settings2, MoreHorizontal, Check, Shield, ShieldCheck, ShieldAlert, Lock, Database, HelpCircle, Sigma, Split } from "lucide-react";
import { DataLineageIndicator } from "@/components/data-lineage/DataLineageIndicator";
import { cn } from "@/lib/utils";
import { useCalculationMethod, CalculationMethod, METRIC_CONFIGS } from "@/contexts/CalculationMethodContext";
import { getMetricDataSources } from "@/utils/metricDataSources";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
interface KPICardProps {
  title: string;
  value: string | { [key: string]: string }; // Support for comparison view
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
    period?: string;
  };
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
  calculation?: string;
  metricId?: string; // For calculation method selection
  hasAlternateCalculations?: boolean; // Show calculation method selector
  sourceSystems?: string[];
  lastSynced?: string;
  definition?: string; // Plain-language explanation
  whyMatters?: string; // Why this metric matters explanation
  trustIndicator?: 'high' | 'medium' | 'low'; // Trust level
  category?: string; // KPI category for grouping
  isLocked?: boolean; // For starter mode
  lockReason?: string; // Why the KPI is locked
  compareView?: boolean; // Enable comparison view
  onToggleSegmentView?: () => void; // Toggle segment view for this card
  
}
export function KPICard({
  title,
  value,
  change,
  subtitle,
  className,
  onClick,
  clickable = false,
  calculation,
  metricId,
  hasAlternateCalculations = false,
  sourceSystems,
  lastSynced = '2025-01-05T14:30:00Z',
  definition,
  whyMatters,
  trustIndicator = 'high',
  category,
  isLocked = false,
  lockReason,
  compareView = false,
  onToggleSegmentView
}: KPICardProps) {
  const {
    setCalculationMethod,
    getSelectedMethod,
    getMetricValue
  } = useCalculationMethod();
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);

  // Smart data source detection if not provided
  const smartDataSource = getMetricDataSources(title, subtitle);
  const finalSourceSystems = sourceSystems || smartDataSource.sources;
  const isInferred = smartDataSource.isInferred;

  // Get available calculation methods for this metric
  const availableMethods = metricId ? METRIC_CONFIGS[metricId] || [] : [];
  const selectedMethod = metricId ? getSelectedMethod(metricId, availableMethods) : undefined;

  // Get calculated value based on selected method
  const displayValue = metricId && selectedMethod ? getMetricValue(metricId, selectedMethod.id, typeof value === 'string' ? value : Object.values(value)[0]) : value;
  const isComparisonMode = compareView && typeof value === 'object';
  const getTrendIcon = () => {
    if (!change) return null;
    switch (change.type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };
  const getChangeColor = () => {
    if (!change) return '';
    switch (change.type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };
  const getTrustIcon = () => {
    switch (trustIndicator) {
      case 'high':
        return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'medium':
        return <ShieldAlert className="h-4 w-4 text-warning" />;
      case 'low':
        return <Shield className="h-4 w-4 text-destructive" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };
  const formatLastSynced = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, h:mm a");
    } catch {
      return "Unknown";
    }
  };

  // If locked, show locked state
  if (isLocked) {
    return <Card className={cn("p-6 shadow-kpi border-border/50 bg-muted/50 relative overflow-hidden", "opacity-60", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted/40" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {title}
              </h3>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-medium text-muted-foreground">
                {lockReason || "Requires additional data integration"}
              </p>
            </div>
          </div>
        </div>
      </Card>;
  }
  return <Card className={cn("p-6 shadow-kpi transition-smooth hover:shadow-floating border-border/50", "bg-gradient-to-br from-card to-card/80 card-hover-effect", "flex flex-col h-full", clickable && "cursor-pointer hover:scale-[1.02] active:scale-[0.98] kpi-glow", className)} onClick={clickable ? onClick : undefined}>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {change && <div className="flex items-center gap-1">
                {getTrendIcon()}
              </div>}
          </div>
        </div>
        
        <div className="space-y-1 flex-1">
          {isComparisonMode ? (
            <div className="space-y-2">
              {Object.entries(value as { [key: string]: string }).map(([segment, segmentValue]) => (
                <div key={segment} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium text-muted-foreground capitalize">
                    {segment.replace('-', ' ')}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {segmentValue}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-3xl font-bold text-foreground tracking-tight">
              {typeof displayValue === 'string' ? displayValue : String(displayValue)}
            </div>
          )}
          
          {change && <div className="flex items-center gap-2 text-sm">
              <span className={cn("font-medium", getChangeColor())}>
                {change.value}
              </span>
              {change.period && <span className="text-muted-foreground">
                  {change.period}
                </span>}
            </div>}
          
          {subtitle && <p className="text-muted-foreground text-xs">
              {subtitle}
            </p>}
        </div>
      </div>
      
      {/* Bottom - Icons and Toggle */}
      <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          {/* Trust Layer Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center gap-1 p-1 rounded-md hover:bg-muted/50 transition-colors">
                  <Database className="h-3 w-3 text-muted-foreground" />
                </button>
              </TooltipTrigger>
               <TooltipContent side="top" className="w-72 p-0 z-[99999]">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      About the Data
                    </h4>
                  </div>
                  
                   {definition && <div className="space-y-1">
                       <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Definition</p>
                       <p className="text-xs">{definition}</p>
                     </div>}
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source Systems</p>
                    <div className="flex flex-wrap gap-1">
                      {finalSourceSystems.map(system => <span key={system} className="text-xs bg-muted px-2 py-1 rounded-md">
                          {system}
                        </span>)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Updated</p>
                    <p className="text-xs">{formatLastSynced(lastSynced)}</p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Data Quality:</span>
                      <div className="flex items-center gap-1">
                        {getTrustIcon()}
                        <span className="capitalize text-muted-foreground">{trustIndicator} Trust</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Calculation Method Icon */}
          {(hasAlternateCalculations || calculation || definition) && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-muted/50 transition-colors" onClick={e => e.stopPropagation()}>
                    <Settings2 className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                 <TooltipContent side="top" className="w-72 p-0 z-[99999]">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      <h4 className="font-medium">About this Metric</h4>
                    </div>
                    
                    {definition && <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Definition</p>
                        <p className="text-xs">{definition}</p>
                      </div>}
                    
                    
                    {/* Current Calculation Method */}
                    {selectedMethod ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Calculation Method</p>
                        <div className="p-3 rounded-lg border border-primary/30 bg-accent/20">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{selectedMethod.label}</span>
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">{selectedMethod.description}</p>
                            {selectedMethod.formula && <p className="text-xs font-mono bg-muted p-2 rounded mt-2">{selectedMethod.formula}</p>}
                          </div>
                        </div>
                      </div>
                    ) : calculation && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Calculation</p>
                        <p className="text-xs">{calculation}</p>
                      </div>
                    )}
                    
                    {/* Alternate Methods Selection */}
                    {hasAlternateCalculations && availableMethods.length > 1 && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available Calculation Methods</p>
                          <p className="text-xs text-muted-foreground">Select a different calculation method</p>
                        </div>
                        
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {availableMethods.filter(method => method.id !== selectedMethod?.id).map(method => (
                            <button 
                              key={method.id} 
                              className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/20 transition-colors"
                              onClick={e => {
                                e.stopPropagation();
                                if (metricId) {
                                  setCalculationMethod(metricId, method.id);
                                }
                              }}
                            >
                              <div className="space-y-1">
                                <span className="font-medium text-sm">{method.label}</span>
                                <p className="text-xs text-muted-foreground">{method.description}</p>
                                {method.formula && <p className="text-xs text-muted-foreground font-mono">{method.formula}</p>}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t flex flex-col gap-2">
                      <a 
                        href="/admin/settings?tab=calculations" 
                        className="text-xs text-primary hover:text-primary/80 underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Adjust this calculation in Settings
                      </a>
                      {metricId && (
                        <button
                          className="text-xs text-primary hover:text-primary/80 underline transition-colors text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            // This would open the custom calculation builder
                            // For now, redirect to settings
                            window.location.href = "/admin/settings?tab=calculations";
                          }}
                        >
                          Create custom calculation method
                        </button>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>}

          {/* Why This Matters Icon */}
          {whyMatters && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-muted/50 transition-colors">
                    <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-72 p-0 z-[99999]">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <h4 className="font-medium">Why this matters</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {whyMatters}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>}
        </div>

        {/* Segment View Toggle - Bottom Right */}
        {onToggleSegmentView && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-muted/30 hover:bg-muted/60 border border-border/50 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSegmentView();
                  }}
                >
                  {isComparisonMode ? (
                    <Sigma className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Split className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="z-[99999]">
                <p className="text-xs">
                  {isComparisonMode ? "Show aggregated view" : "Show segment comparison"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </Card>;
}