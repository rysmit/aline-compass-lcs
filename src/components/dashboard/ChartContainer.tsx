import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function ChartContainer({ 
  title, 
  description, 
  children, 
  className, 
  actions 
}: ChartContainerProps) {
  return (
    <Card className={cn(
      "shadow-card border-border bg-card",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}