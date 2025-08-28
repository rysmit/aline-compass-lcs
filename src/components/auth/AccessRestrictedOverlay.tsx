import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Mail, Info } from "lucide-react";

interface AccessRestrictedOverlayProps {
  type: 'community' | 'metric' | 'category';
  resourceName?: string;
  onRequestAccess?: () => void;
  children?: React.ReactNode;
}

export function AccessRestrictedOverlay({ 
  type, 
  resourceName, 
  onRequestAccess,
  children 
}: AccessRestrictedOverlayProps) {
  const getMessage = () => {
    switch (type) {
      case 'community':
        return `Access not permitted — ${resourceName || 'This community'} is not included in your portfolio.`;
      case 'metric':
        return `This metric is not available for your access level.`;
      case 'category':
        return `Access to ${resourceName || 'this data category'} is restricted.`;
      default:
        return 'Access is restricted for this resource.';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'community':
        return 'Contact your administrator to request access to additional communities.';
      case 'metric':
        return 'This metric requires additional permissions to view.';
      case 'category':
        return 'Contact your administrator to expand your data category access.';
      default:
        return 'Contact your administrator to request access.';
    }
  };

  const handleRequestAccess = () => {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      // Default email request
      const subject = encodeURIComponent(`Access Request - ${type}: ${resourceName || 'Resource'}`);
      const body = encodeURIComponent(`Hello,\n\nI would like to request access to:\nType: ${type}\nResource: ${resourceName || 'N/A'}\n\nPlease contact me to discuss this access request.\n\nThank you`);
      window.open(`mailto:admin@alinecompass.com?subject=${subject}&body=${body}`);
    }
  };

  if (children) {
    // Render as overlay on top of children
    return (
      <div className="relative">
        <div className="opacity-25 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="border-destructive/20 bg-destructive/5 max-w-md">
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
              <div className="space-y-3">
                <Badge variant="destructive" className="mb-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Access Restricted
                </Badge>
                <h3 className="font-semibold text-destructive">{getMessage()}</h3>
                <p className="text-sm text-muted-foreground">{getDescription()}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRequestAccess}
                  className="border-destructive/20 text-destructive hover:bg-destructive/5"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Request Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render as standalone component
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
        <div className="space-y-3">
          <Badge variant="destructive" className="mb-2">
            <Shield className="w-3 h-3 mr-1" />
            Access Restricted
          </Badge>
          <h3 className="font-semibold text-destructive">{getMessage()}</h3>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRequestAccess}
            className="border-destructive/20 text-destructive hover:bg-destructive/5"
          >
            <Mail className="w-4 h-4 mr-1" />
            Request Access
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RestrictedMetricDisplay({ metricName }: { metricName: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Lock className="w-4 h-4" />
      <span className="text-sm">Restricted</span>
      <div className="group relative">
        <Info className="w-4 h-4 cursor-help" />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {metricName} not available for your access level
        </div>
      </div>
    </div>
  );
}