import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Lightbulb, TrendingUp, Star, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  value: string;
  action: string;
  route: string;
  metric: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: "Move-In Velocity Surge - IL Care",
    description: "Independent Living move-ins increased 18% this month across 8 communities. Strong market response to new amenity packages.",
    impact: 'high',
    value: "+18%",
    action: "Expand program",
    route: "/metric/move-in-velocity",
    metric: "Move-In Rate"
  },
  {
    id: '2',
    title: "Northeast Sales Excellence", 
    description: "Sales conversion rate in Northeast region reaches 34%, significantly above portfolio average of 28%.",
    impact: 'high',
    value: "34%",
    action: "Review best practices",
    route: "/region/northeast",
    metric: "Conversion Rate"
  },
  {
    id: '3',
    title: "Revenue Optimization Potential",
    description: "Memory Care communities showing 12% revenue growth opportunity based on market analysis and acuity trends.",
    impact: 'medium',
    value: "+$284K",
    action: "Analyze pricing",
    route: "/metric/revenue-per-unit",
    metric: "Revenue/Unit"
  }
];

export function KeyOpportunities() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getImpactStyles = (impact: Opportunity['impact']) => {
    switch (impact) {
      case 'high':
        return {
          badge: 'bg-green-100 text-green-800 border-green-200',
          border: 'border-green-200 bg-green-50/30'
        };
      case 'medium':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200', 
          border: 'border-blue-200 bg-blue-50/30'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          border: 'border-gray-200 bg-gray-50/30'
        };
    }
  };

  return (
    <Card className="animate-fade-in">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Key Opportunities
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {mockOpportunities.map((opportunity) => {
              const styles = getImpactStyles(opportunity.impact);
              
              return (
                <div
                  key={opportunity.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${styles.border}`}
                  onClick={() => navigate(opportunity.route)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground text-sm flex items-center gap-1">
                          <Star className="h-4 w-4 text-green-600" />
                          {opportunity.title}
                        </h4>
                        <Badge variant="outline" className={styles.badge}>
                          {opportunity.impact} impact
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {opportunity.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-700">{opportunity.value}</span>
                          </div>
                          <span>{opportunity.metric}</span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(opportunity.route);
                          }}
                        >
                          {opportunity.action}
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