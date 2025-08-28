import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Save, Bell } from "lucide-react";

export function AlertThresholds() {
  const alertCategories = [
    {
      category: "Census & Occupancy",
      alerts: [
        { name: "Low Occupancy Warning", threshold: "85%", enabled: true },
        { name: "High Churn Risk", threshold: "75%", enabled: true },
        { name: "Census Drop Alert", threshold: "5% decline", enabled: true }
      ]
    },
    {
      category: "Financial Performance", 
      alerts: [
        { name: "Revenue Variance", threshold: "±10%", enabled: true },
        { name: "Cost Overrun", threshold: "15%", enabled: false },
        { name: "Collection Issues", threshold: "30 days", enabled: true }
      ]
    },
    {
      category: "Care & Compliance",
      alerts: [
        { name: "Compliance Score", threshold: "85%", enabled: true },
        { name: "Incident Rate", threshold: "3 per week", enabled: true },
        { name: "Staffing Shortage", threshold: "80% capacity", enabled: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Configuration - Optimized grid layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {alertCategories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-lg border-b border-border/30 pb-2">{category.category}</h4>
                <div className="space-y-3">
                  {category.alerts.map((alert, alertIndex) => (
                    <div key={alertIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={alert.enabled} className="scale-75" />
                          <h5 className="font-medium text-sm">{alert.name}</h5>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Edit
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">Threshold: {alert.threshold}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom section - Optimized 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Global Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label htmlFor="churn-risk" className="text-sm">Churn Risk (%)</Label>
                <Input id="churn-risk" type="number" defaultValue="75" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="occupancy-target" className="text-sm">Occupancy Target (%)</Label>
                <Input id="occupancy-target" type="number" defaultValue="90" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="variance-limit" className="text-sm">Variance Limit (%)</Label>
                <Input id="variance-limit" type="number" defaultValue="5" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="compliance-min" className="text-sm">Min Compliance (%)</Label>
                <Input id="compliance-min" type="number" defaultValue="85" className="h-8" />
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Save className="h-3 w-3 mr-2" />
              Update Thresholds
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-alerts" className="text-sm">Email Alerts</Label>
                <Switch id="email-alerts" defaultChecked className="scale-75" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-alerts" className="text-sm">SMS Alerts</Label>
                <Switch id="sms-alerts" className="scale-75" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dashboard-alerts" className="text-sm">Dashboard Notifications</Label>
                <Switch id="dashboard-alerts" defaultChecked className="scale-75" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="digest-emails" className="text-sm">Daily Digest</Label>
                <Switch id="digest-emails" defaultChecked className="scale-75" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert Frequency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="critical-frequency" className="text-sm">Critical Alerts</Label>
                <Input id="critical-frequency" defaultValue="Immediate" readOnly className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="warning-frequency" className="text-sm">Warning Alerts</Label>
                <Input id="warning-frequency" defaultValue="Every 4 hours" readOnly className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="info-frequency" className="text-sm">Info Alerts</Label>
                <Input id="info-frequency" defaultValue="Daily digest" readOnly className="h-8 text-sm" />
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              Configure Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}