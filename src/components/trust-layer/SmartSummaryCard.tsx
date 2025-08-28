import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryInsight {
  id: string;
  type: 'metric_change' | 'alert' | 'opportunity' | 'achievement';
  title: string;
  description: string;
  value?: string;
  change?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  action?: {
    label: string;
    url?: string;
  };
  severity?: 'high' | 'medium' | 'low';
}

interface SmartSummaryCardProps {
  role: 'executive' | 'community_manager' | 'sales' | 'care';
  timeframe: 'daily' | 'weekly' | 'monthly';
  lastUpdated?: string;
}

// Sample data based on role
const ROLE_INSIGHTS: Record<string, SummaryInsight[]> = {
  executive: [
    {
      id: '1',
      type: 'metric_change',
      title: 'Portfolio Occupancy Declined',
      description: 'Overall occupancy dropped across 3 communities',
      value: '87.2%',
      change: { value: '3%', direction: 'down' },
      action: { label: 'View Portfolio Dashboard', url: '/reit-portfolio' },
      severity: 'high'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Revenue Optimization Available',
      description: 'Market rates are 8% above current pricing in Westside Community',
      action: { label: 'Review Pricing', url: '/pricing-analysis' },
      severity: 'medium'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Cost Control Target Met',
      description: 'Operating expenses reduced by 12% vs. last quarter',
      value: '$2.3M',
      change: { value: '12%', direction: 'down' },
      severity: 'low'
    }
  ],
  community_manager: [
    {
      id: '1',
      type: 'alert',
      title: 'Staffing Level Below Threshold',
      description: 'Current staffing at 78% of required levels',
      value: '78%',
      action: { label: 'Adjust Schedule', url: '/staffing' },
      severity: 'high'
    },
    {
      id: '2',
      type: 'metric_change',
      title: 'Census Increased This Week',
      description: '3 new move-ins, 1 discharge',
      value: '94',
      change: { value: '2', direction: 'up' },
      severity: 'low'
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Tour-to-Move-in Rate Improving',
      description: 'Conversion rate up 15% this month',
      value: '68%',
      change: { value: '15%', direction: 'up' },
      action: { label: 'View Sales Pipeline' },
      severity: 'low'
    }
  ],
  sales: [
    {
      id: '1',
      type: 'metric_change',
      title: 'Lead Response Time Improved',
      description: 'Average response time decreased significantly',
      value: '2.3 hrs',
      change: { value: '45%', direction: 'down' },
      severity: 'low'
    },
    {
      id: '2',
      type: 'alert',
      title: 'Pipeline Value Below Target',
      description: 'Current pipeline 22% below monthly goal',
      value: '$78K',
      action: { label: 'Review Lead Quality', url: '/sales-pipeline' },
      severity: 'medium'
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'High-Value Prospects Identified',
      description: '5 prospects with >$5K monthly revenue potential',
      action: { label: 'Prioritize Follow-up' },
      severity: 'medium'
    }
  ],
  care: [
    {
      id: '1',
      type: 'achievement',
      title: 'Medication Adherence Target Met',
      description: 'All residents maintaining >95% adherence',
      value: '97.8%',
      severity: 'low'
    },
    {
      id: '2',
      type: 'alert',
      title: 'Care Plan Reviews Overdue',
      description: '8 residents have care plans due for review',
      action: { label: 'Schedule Reviews', url: '/care-compliance' },
      severity: 'medium'
    },
    {
      id: '3',
      type: 'metric_change',
      title: 'Incident Rate Decreased',
      description: 'Fewer incidents reported this week',
      value: '2',
      change: { value: '50%', direction: 'down' },
      severity: 'low'
    }
  ]
};

export function SmartSummaryCard({ role, timeframe, lastUpdated }: SmartSummaryCardProps) {
  const insights = ROLE_INSIGHTS[role] || [];

  const getInsightIcon = (type: SummaryInsight['type'], severity?: string) => {
    switch (type) {
      case 'metric_change':
        return severity === 'high' ? 
          <TrendingDown className="h-4 w-4 text-destructive" /> : 
          <TrendingUp className="h-4 w-4 text-success" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'border-l-destructive';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-muted';
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'daily': return "Today's Summary";
      case 'weekly': return "This Week's Summary";
      case 'monthly': return "This Month's Summary";
      default: return "Summary";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{getTimeframeLabel()}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {insights.length} insights
          </Badge>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={cn(
              "flex items-start gap-3 p-3 border-l-2 bg-muted/30 rounded-r-lg",
              getSeverityColor(insight.severity)
            )}
          >
            <div className="mt-0.5">
              {getInsightIcon(insight.type, insight.severity)}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
                
                {insight.value && (
                  <div className="text-right">
                    <p className="font-semibold text-sm">{insight.value}</p>
                    {insight.change && (
                      <div className="flex items-center gap-1">
                        {insight.change.direction === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : insight.change.direction === 'down' ? (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        ) : null}
                        <span className={cn(
                          "text-xs",
                          insight.change.direction === 'up' ? 'text-success' : 
                          insight.change.direction === 'down' ? 'text-destructive' : 
                          'text-muted-foreground'
                        )}>
                          {insight.change.value}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {insight.action && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-1 text-xs hover:bg-background/50"
                >
                  {insight.action.label}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">All systems running smoothly</p>
            <p className="text-xs">No critical insights to report</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}