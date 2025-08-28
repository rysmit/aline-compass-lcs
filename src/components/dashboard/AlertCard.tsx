import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
interface AlertCardProps {
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}
export function AlertCard({
  title,
  description,
  type,
  action,
  className
}: AlertCardProps) {
  const getAlertConfig = () => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertCircle,
          variant: 'destructive' as const,
          className: 'border-destructive/20 bg-destructive/5'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          variant: 'default' as const,
          className: 'border-warning/20 bg-warning/5 text-warning-foreground'
        };
      case 'success':
        return {
          icon: CheckCircle,
          variant: 'default' as const,
          className: 'border-success/20 bg-success/5 text-success-foreground'
        };
      default:
        return {
          icon: Info,
          variant: 'default' as const,
          className: 'border-primary/20 bg-primary/5'
        };
    }
  };
  const {
    icon: Icon,
    variant,
    className: alertClassName
  } = getAlertConfig();
  return <Card className={cn("p-4 shadow-card border-border/30", className)}>
      <Alert variant={variant} className={cn("border-0 bg-transparent p-0", alertClassName)}>
        <Icon className="h-5 w-5" />
        <div className="space-y-2 my-0 py-[15px]">
          <div className="font-semibold text-sm px-[30px]">
            {title}
          </div>
          <AlertDescription className="text-sm leading-relaxed mx-[30px]">
            {description}
          </AlertDescription>
          {action && <button onClick={action.onClick} className="text-sm font-medium underline underline-offset-4 hover:no-underline transition-fast mx-[30px]">
              {action.label}
            </button>}
        </div>
      </Alert>
    </Card>;
}