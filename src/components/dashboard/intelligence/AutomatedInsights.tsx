import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrendingUp, TrendingDown, Info, ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
}

const mockInsights: Insight[] = [
  {
    id: '1',
    text: "Census increased 3.2% month-over-month driven by strong move-in volume in the Southeast region, with 89 new residents across 12 communities.",
    type: 'positive',
    confidence: 'high'
  },
  {
    id: '2', 
    text: "AR risk is elevated in the Northwest division due to aging balances over 90 days, affecting $847K in outstanding receivables.",
    type: 'negative',
    confidence: 'high'
  },
  {
    id: '3',
    text: "Revenue per unit showing consistent upward trend across IL communities, with average monthly increases of $127 per unit over 6 months.",
    type: 'positive',
    confidence: 'medium'
  },
  {
    id: '4',
    text: "Occupancy forecast models indicate potential seasonal decline of 2.3% in Q1, aligning with historical winter patterns.",
    type: 'neutral',
    confidence: 'medium'
  }
];

export function AutomatedInsights() {
  const [isExpanded, setIsExpanded] = useState(false);
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getConfidenceBadge = (confidence: Insight['confidence']) => {
    const variants = {
      high: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <Badge variant="outline" className={variants[confidence]}>
        {confidence} confidence
      </Badge>
    );
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
                <CardTitle className="text-lg font-semibold text-foreground">
                  What Changed
                </CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      Auto-generated insights
                      <Info className="h-3 w-3 ml-1" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Insights generated from recent data changes and trend analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </div>
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {mockInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.text}
                  </p>
                  <div className="mt-2">
                    {getConfidenceBadge(insight.confidence)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}