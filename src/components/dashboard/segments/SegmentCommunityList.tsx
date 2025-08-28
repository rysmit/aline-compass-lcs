import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, Building, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Community {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  averageRent: number;
  performance: 'excellent' | 'good' | 'warning' | 'critical';
  trend: number;
}

interface SegmentCommunityListProps {
  segmentId: string;
  segmentName: string;
  className?: string;
}

// Mock community data for different segments
const getCommunityData = (segmentId: string): Community[] => {
  const communities = {
    rental: [
      {
        id: 'rc-001',
        name: 'Sunset Gardens',
        location: 'Phoenix, AZ',
        totalUnits: 180,
        occupiedUnits: 162,
        occupancyRate: 90.0,
        monthlyRevenue: 518400,
        averageRent: 3200,
        performance: 'excellent' as const,
        trend: 3.2
      },
      {
        id: 'rc-002', 
        name: 'Riverside Commons',
        location: 'Austin, TX',
        totalUnits: 220,
        occupiedUnits: 189,
        occupancyRate: 85.9,
        monthlyRevenue: 604800,
        averageRent: 3200,
        performance: 'good' as const,
        trend: 1.8
      },
      {
        id: 'rc-003',
        name: 'Mountain View Estates',
        location: 'Denver, CO', 
        totalUnits: 160,
        occupiedUnits: 132,
        occupancyRate: 82.5,
        monthlyRevenue: 422400,
        averageRent: 3200,
        performance: 'warning' as const,
        trend: -2.1
      },
      {
        id: 'rc-004',
        name: 'Coastal Breeze',
        location: 'San Diego, CA',
        totalUnits: 195,
        occupiedUnits: 176,
        occupancyRate: 90.3,
        monthlyRevenue: 563200,
        averageRent: 3200,
        performance: 'excellent' as const,
        trend: 4.5
      },
      {
        id: 'rc-005',
        name: 'Heritage Manor',
        location: 'Charlotte, NC',
        totalUnits: 145,
        occupiedUnits: 121,
        occupancyRate: 83.4,
        monthlyRevenue: 387200,
        averageRent: 3200,
        performance: 'good' as const,
        trend: 0.8
      }
    ],
    'life-plan': [
      {
        id: 'lp-001',
        name: 'Golden Years Resort',
        location: 'Naples, FL',
        totalUnits: 285,
        occupiedUnits: 267,
        occupancyRate: 93.7,
        monthlyRevenue: 1201500,
        averageRent: 4500,
        performance: 'excellent' as const,
        trend: 5.2
      },
      {
        id: 'lp-002',
        name: 'Serenity Springs',
        location: 'Scottsdale, AZ', 
        totalUnits: 200,
        occupiedUnits: 184,
        occupancyRate: 92.0,
        monthlyRevenue: 828000,
        averageRent: 4500,
        performance: 'excellent' as const,
        trend: 3.8
      },
      {
        id: 'lp-003',
        name: 'Harmony Hills',
        location: 'Asheville, NC',
        totalUnits: 165,
        occupiedUnits: 148,
        occupancyRate: 89.7,
        monthlyRevenue: 666000,
        averageRent: 4500,
        performance: 'good' as const,
        trend: 2.1
      },
      {
        id: 'lp-004',
        name: 'Tranquil Oaks',
        location: 'Sarasota, FL',
        totalUnits: 150,
        occupiedUnits: 138,
        occupancyRate: 92.0,
        monthlyRevenue: 621000,
        averageRent: 4500,
        performance: 'excellent' as const,
        trend: 4.7
      }
    ],
    managed: [
      {
        id: 'mg-001',
        name: 'Parkside Manor',
        location: 'Indianapolis, IN',
        totalUnits: 120,
        occupiedUnits: 95,
        occupancyRate: 79.2,
        monthlyRevenue: 266000,
        averageRent: 2800,
        performance: 'warning' as const,
        trend: -1.8
      },
      {
        id: 'mg-002',
        name: 'Meadowbrook',
        location: 'Kansas City, MO',
        totalUnits: 180,
        occupiedUnits: 140,
        occupancyRate: 77.8,
        monthlyRevenue: 392000,
        averageRent: 2800,
        performance: 'warning' as const,
        trend: -2.5
      },
      {
        id: 'mg-003',
        name: 'Willows at Oak Creek',
        location: 'Birmingham, AL',
        totalUnits: 150,
        occupiedUnits: 117,
        occupancyRate: 78.0,
        monthlyRevenue: 327600,
        averageRent: 2800,
        performance: 'warning' as const,
        trend: -0.9
      }
    ]
  };

  return communities[segmentId as keyof typeof communities] || [];
};

export function SegmentCommunityList({ segmentId, segmentName, className }: SegmentCommunityListProps) {
  const navigate = useNavigate();
  const communities = getCommunityData(segmentId);

  const getPerformanceBadgeStyle = (performance: string) => {
    const styles = {
      excellent: "bg-green-100 text-green-800 border-green-200",
      good: "bg-blue-100 text-blue-800 border-blue-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      critical: "bg-red-100 text-red-800 border-red-200"
    };
    return styles[performance as keyof typeof styles] || styles.good;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleCommunityClick = (community: Community) => {
    navigate(`/community/${community.id}`, {
      state: { community, segment: { id: segmentId, name: segmentName } }
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {segmentName} Communities
          <Badge variant="secondary" className="ml-auto">
            {communities.length} Communities
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communities.map((community) => (
            <Card 
              key={community.id} 
              className="cursor-pointer hover:shadow-md transition-all duration-200 group"
              onClick={() => handleCommunityClick(community)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {community.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {community.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getPerformanceBadgeStyle(community.performance))}
                      >
                        {community.performance}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCommunityClick(community);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Occupancy</span>
                      </div>
                      <div className="font-medium">
                        {community.occupancyRate.toFixed(1)}%
                      </div>
                      <Progress 
                        value={community.occupancyRate} 
                        className="h-1.5" 
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground">Units</div>
                      <div className="font-medium">
                        {community.occupiedUnits} / {community.totalUnits}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground">Monthly Revenue</div>
                      <div className="font-medium">
                        {formatCurrency(community.monthlyRevenue)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground">Trend</div>
                      <div className="flex items-center gap-1">
                        {community.trend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={cn(
                          "font-medium text-sm",
                          community.trend > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {Math.abs(community.trend)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}