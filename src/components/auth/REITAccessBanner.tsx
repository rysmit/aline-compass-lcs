import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Shield, Mail } from "lucide-react";

export function REITAccessBanner() {
  const { user } = useAuth();
  const { getAccessSummary } = useAccessControl();

  if (!user || user.role !== 'reit-investor') {
    return null;
  }

  const summary = getAccessSummary();

  const handleRequestAccess = () => {
    // In a real app, this would open a request form or send an email
    const subject = encodeURIComponent('Access Request - Compass REIT Dashboard');
    const body = encodeURIComponent(`Hello,\n\nI would like to request additional access to communities or data categories in the Compass REIT Dashboard.\n\nCurrent Access:\n- Communities: ${summary.communitiesCount} of ${summary.totalCommunities}\n- Data Categories: ${summary.categoriesCount} of ${summary.totalCategories}\n\nPlease contact me to discuss expanding my access.\n\nThank you,\n${user.name}`);
    window.open(`mailto:admin@alinecompass.com?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                You are viewing metrics for {summary.communitiesCount} communities with access to {summary.categoriesCount} data categories.
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your portfolio view is customized based on your assigned access permissions.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              <Info className="w-3 h-3 mr-1" />
              Limited Access
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRequestAccess}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4 mr-1" />
              Request Access
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}