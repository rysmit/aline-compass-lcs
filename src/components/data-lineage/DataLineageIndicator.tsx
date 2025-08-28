import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, Clock } from "lucide-react";

interface DataLineageIndicatorProps {
  sourceSystems: string[];
  lastSynced: string;
  className?: string;
  isInferred?: boolean;
}

export function DataLineageIndicator({ 
  sourceSystems, 
  lastSynced, 
  className = "",
  isInferred = false 
}: DataLineageIndicatorProps) {
  const formatTooltipText = () => {
    if (isInferred) {
      return `Derived from multiple sources: ${sourceSystems.join(' + ')}`;
    }
    
    if (sourceSystems.length === 1) {
      return `Data sourced from ${sourceSystems[0]} only`;
    }
    
    return `Data sourced from ${sourceSystems.join(', ')}`;
  };

  const formatLastSynced = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' @ ' + date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Data Source Icon with Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-help">
              <Database className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formatTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Timestamp with Clock Icon - Tooltip on Hover */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-help">
            <Clock className="h-3 w-3" style={{ color: '#999999' }} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last synced: {formatLastSynced(lastSynced)}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}