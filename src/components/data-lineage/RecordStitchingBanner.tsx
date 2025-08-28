import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link2 } from "lucide-react";

interface SystemRecord {
  systemName: string;
  id: string;
  label: string;
}

interface RecordStitchingBannerProps {
  records: SystemRecord[];
  className?: string;
}

export function RecordStitchingBanner({ records, className = "" }: RecordStitchingBannerProps) {
  return (
    <Card className={`bg-primary/5 border-primary/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">
              Linked across {records.length} systems
            </span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 flex-wrap">
                  {records.map((record, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-background/50 text-xs"
                    >
                      {record.label}: {record.id}
                    </Badge>
                  ))}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aline stores and matches these records across systems for consistent reporting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}