import { useState } from "react";
import { Bell, X, ExternalLink, AlertTriangle, TrendingDown, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export interface Alert {
  id: string;
  category: 'occupancy' | 'revenue' | 'churn' | 'care' | 'integration';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  isRead: boolean;
  drillDownUrl?: string;
  communityName?: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    category: 'occupancy',
    title: 'Low Occupancy Alert',
    description: 'Meadowbrook Commons has dropped to 78% occupancy (below 85% threshold)',
    priority: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    drillDownUrl: '/region/west/community/meadowbrook',
    communityName: 'Meadowbrook Commons'
  },
  {
    id: '2',
    category: 'revenue',
    title: 'Revenue at Risk',
    description: '$247K in revenue at risk due to pending move-outs in Q1',
    priority: 'high',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    drillDownUrl: '/alert/revenue-at-risk'
  },
  {
    id: '3',
    category: 'care',
    title: 'Care Plan Compliance',
    description: '3 residents have overdue care plan reviews at Sunset Gardens',
    priority: 'medium',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
    drillDownUrl: '/alert/care-compliance',
    communityName: 'Sunset Gardens'
  },
  {
    id: '4',
    category: 'churn',
    title: 'Churn Risk Alert',
    description: '5 residents flagged as high churn risk this week',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    drillDownUrl: '/alert/forecast-variance'
  },
  {
    id: '5',
    category: 'integration',
    title: 'CRM Sync Failed',
    description: 'Salesforce integration failed - lead data may be outdated',
    priority: 'low',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: false,
    drillDownUrl: '/admin/settings'
  }
];

const categoryIcons = {
  occupancy: Users,
  revenue: TrendingDown,
  churn: AlertTriangle,
  care: Shield,
  integration: Zap
};

const categoryColors = {
  occupancy: 'text-blue-600',
  revenue: 'text-red-600',
  churn: 'text-orange-600',
  care: 'text-green-600',
  integration: 'text-purple-600'
};

const priorityColors = {
  high: 'border-red-500 bg-red-50 text-red-900',
  medium: 'border-orange-500 bg-orange-50 text-orange-900',
  low: 'border-blue-500 bg-blue-50 text-blue-900'
};

function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return 'Just now';
  }
}

export function NotificationCenter() {
  const { hasPermission } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isOpen, setIsOpen] = useState(false);

  // Filter alerts based on user permissions
  const filteredAlerts = alerts.filter(alert => {
    switch (alert.category) {
      case 'occupancy':
        return hasPermission('census-occupancy', 'view');
      case 'revenue':
        return hasPermission('financial-health', 'view');
      case 'churn':
        return hasPermission('forecast-risk', 'view');
      case 'care':
        return hasPermission('care-compliance', 'view');
      case 'integration':
        return hasPermission('admin', 'view');
      default:
        return false;
    }
  });

  const unreadCount = filteredAlerts.filter(alert => !alert.isRead).length;
  const highPriorityCount = filteredAlerts.filter(alert => alert.priority === 'high' && !alert.isRead).length;

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const handleAlertClick = (alert: Alert) => {
    markAsRead(alert.id);
    if (alert.drillDownUrl) {
      window.location.href = alert.drillDownUrl;
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant={highPriorityCount > 0 ? "destructive" : "secondary"} 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-96 sm:w-[500px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alerts & Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No alerts at this time</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert, index) => {
                const IconComponent = categoryIcons[alert.category];
                return (
                  <div key={alert.id}>
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-l-4",
                        priorityColors[alert.priority],
                        !alert.isRead && "ring-2 ring-primary/20"
                      )}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className={cn("h-4 w-4", categoryColors[alert.category])} />
                            <CardTitle className="text-sm font-medium">
                              {alert.title}
                            </CardTitle>
                            {!alert.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {alert.priority.toUpperCase()}
                            </Badge>
                            {alert.drillDownUrl && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatTimeAgo(alert.timestamp)}</span>
                          {alert.communityName && (
                            <span className="font-medium">{alert.communityName}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {index < filteredAlerts.length - 1 && <Separator />}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}