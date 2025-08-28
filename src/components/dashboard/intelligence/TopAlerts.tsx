import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, TrendingDown, TrendingUp, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'moderate' | 'low';
  trend: 'up' | 'down' | 'stable';
  value: string;
  threshold: string;
  action: string;
  route: string;
}

const mockAlerts: Alert[] = [
  {
    id: '2',
    title: "Revenue Below Forecast",
    description: "Three communities showing revenue 8% below monthly projections",
    severity: 'moderate', 
    trend: 'down',
    value: "-8%",
    threshold: "-5%",
    action: "Analyze pricing strategy",
    route: "/metric/monthly-revenue"
  },
  {
    id: '3',
    title: "Occupancy Decline - Texas",
    description: "Five Texas communities with occupancy drops exceeding 5% in 30 days",
    severity: 'moderate',
    trend: 'down',
    value: "-5.8%",
    threshold: "-5%",
    action: "Investigate market factors",
    route: "/region/texas"
  }
];

export function TopAlerts() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-red-100 text-red-800 border-red-200',
          border: 'border-red-200 bg-red-50/30'
        };
      case 'moderate':
        return {
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          border: 'border-yellow-200 bg-yellow-50/30'
        };
      default:
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          border: 'border-blue-200 bg-blue-50/30'
        };
    }
  };

  const getTrendIcon = (trend: Alert['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="animate-fade-in">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="w-full cursor-pointer">
            <CardHeader className="pb-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Top Alerts & Deviations
                  </CardTitle>
                </div>
              </div>
              </div>
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {mockAlerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);
              
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${styles.border}`}
                  onClick={() => navigate(alert.route)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground text-sm">
                          {alert.title}
                        </h4>
                        <Badge variant="outline" className={styles.badge}>
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getTrendIcon(alert.trend)}
                            <span className="font-medium">{alert.value}</span>
                          </div>
                          <span>Threshold: {alert.threshold}</span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(alert.route);
                          }}
                        >
                          {alert.action}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}