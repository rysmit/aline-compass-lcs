import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Save } from "lucide-react";

export function SystemConfiguration() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync">Auto Sync</Label>
                <Switch id="auto-sync" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Email Notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Switch id="maintenance" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="audit-logging">Audit Logging</Label>
                <Switch id="audit-logging" defaultChecked />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Data Retention</h4>
              <Select defaultValue="12">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Dashboard Refresh Interval (seconds)</Label>
                <Input id="refresh-interval" type="number" defaultValue="300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                <Input id="session-timeout" type="number" defaultValue="8" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Max Upload Size (MB)</Label>
                <Input id="max-file-size" type="number" defaultValue="50" />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Cache Settings</h4>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue placeholder="Cache duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}