import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, MapPin, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Community {
  id: string;
  name: string;
  occupancy: number;
  revenue: number;
  riskScore: number;
}

interface Region {
  id: string;
  name: string;
  censusPercent: number;
  netMoveIns: number;
  revenueTrend: number;
  riskScore: number;
  communities: Community[];
  totalCommunities: number;
}

const mockRegions: Region[] = [
  {
    id: 'northeast',
    name: 'Northeast',
    censusPercent: 91.2,
    netMoveIns: 23,
    revenueTrend: 4.2,
    riskScore: 2.1,
    totalCommunities: 18,
    communities: [
      { id: '1', name: 'Sunrise Manor', occupancy: 94.5, revenue: 1.2, riskScore: 1.8 },
      { id: '2', name: 'Maple Gardens', occupancy: 89.2, revenue: 2.1, riskScore: 2.4 },
      { id: '3', name: 'Heritage Place', occupancy: 92.8, revenue: 1.8, riskScore: 1.9 }
    ]
  },
  {
    id: 'midwest',
    name: 'Midwest', 
    censusPercent: 89.5,
    netMoveIns: 18,
    revenueTrend: 1.9,
    riskScore: 2.8,
    totalCommunities: 15,
    communities: [
      { id: '7', name: 'Prairie Winds', occupancy: 91.2, revenue: 1.1, riskScore: 2.3 },
      { id: '8', name: 'Oakwood Commons', occupancy: 87.8, revenue: 2.4, riskScore: 3.2 },
      { id: '9', name: 'River Valley', occupancy: 89.9, revenue: 1.7, riskScore: 2.9 }
    ]
  },
  {
    id: 'west',
    name: 'West',
    censusPercent: 85.9,
    netMoveIns: 12,
    revenueTrend: -1.2,
    riskScore: 4.1,
    totalCommunities: 21,
    communities: [
      { id: '10', name: 'Mountain View', occupancy: 83.4, revenue: -0.8, riskScore: 4.3 },
      { id: '11', name: 'Desert Springs', occupancy: 87.1, revenue: -1.9, riskScore: 4.8 },
      { id: '12', name: 'Pacific Heights', occupancy: 87.2, revenue: -0.9, riskScore: 3.6 }
    ]
  }
];

export function RegionalSnapshots() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const getRiskBadge = (score: number) => {
    if (score >= 4) return { text: 'High Risk', className: 'bg-red-100 text-red-800 border-red-200' };
    if (score >= 3) return { text: 'Moderate', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'Low Risk', className: 'bg-green-100 text-green-800 border-green-200' };
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return null;
  };

  const formatTrend = (trend: number) => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <Card className="animate-fade-in h-fit">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Regional Snapshots
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4 p-6 pt-0">
        {mockRegions.map((region) => {
          const isExpanded = expandedRegions.includes(region.id);
          const riskBadge = getRiskBadge(region.riskScore);
          
          return (
            <Card key={region.id} className="border border-border shadow-sm">
              <Collapsible open={isExpanded} onOpenChange={() => toggleRegion(region.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mt-1 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 
                            className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors text-base"
                            onClick={() => navigate(`/region/${region.id}`)}
                          >
                            {region.name}
                          </h4>
                          <Badge variant="outline" className={riskBadge.className}>
                            {riskBadge.text}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {region.totalCommunities} communities
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Census</div>
                            <div className="font-semibold text-sm">{region.censusPercent}%</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Net Move-Ins</div>
                            <div className="font-semibold text-sm text-green-700">+{region.netMoveIns}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Revenue Trend</div>
                            <div className="font-semibold text-sm flex items-center gap-1">
                              {getTrendIcon(region.revenueTrend)}
                              <span className={region.revenueTrend > 0 ? 'text-green-700' : 'text-red-700'}>
                                {formatTrend(region.revenueTrend)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                            <div className="font-semibold text-sm">{region.riskScore.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs flex-shrink-0"
                      onClick={() => navigate(`/region/${region.id}`)}
                    >
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  
                  <CollapsibleContent className="mt-4">
                    <div className="border-t pt-4 space-y-3">
                      <h5 className="font-medium text-sm text-muted-foreground">
                        Top Communities
                      </h5>
                      <div className="space-y-2">
                        {region.communities.map((community) => (
                          <Card 
                            key={community.id}
                            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors border-muted"
                            onClick={() => navigate(`/community/${community.id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{community.name}</span>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-muted-foreground">
                                  Occ: <span className="font-medium text-foreground">{community.occupancy}%</span>
                                </span>
                                <span className="text-muted-foreground">
                                  Rev: <span className={`font-medium ${community.revenue > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatTrend(community.revenue)}
                                  </span>
                                </span>
                                <span className="text-muted-foreground">
                                  Risk: <span className="font-medium text-foreground">{community.riskScore.toFixed(1)}</span>
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          );
          })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}