import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Plus } from "lucide-react";

export function RolesPermissions() {
  const roleSettings = [
    { role: 'C-Level Executive', users: 3, permissions: 'Summary Views Only', level: 'Executive' },
    { role: 'Regional VP', users: 8, permissions: 'Regional Access', level: 'Management' },
    { role: 'Community Manager', users: 127, permissions: 'Single Community', level: 'Operations' },
    { role: 'Clinical Lead', users: 89, permissions: 'Care & Compliance', level: 'Clinical' },
    { role: 'Finance', users: 12, permissions: 'Financial Data', level: 'Finance' }
  ];

  const permissions = [
    { module: 'Executive Dashboard', exec: true, mgmt: true, ops: false, clinical: false, finance: false },
    { module: 'Census & Occupancy', exec: true, mgmt: true, ops: true, clinical: false, finance: true },
    { module: 'Care Compliance', exec: false, mgmt: true, ops: true, clinical: true, finance: false },
    { module: 'Financial Reports', exec: true, mgmt: true, ops: false, clinical: false, finance: true },
    { module: 'Sales Pipeline', exec: true, mgmt: true, ops: true, clinical: false, finance: false },
    { module: 'Integration Settings', exec: false, mgmt: false, ops: false, clinical: false, finance: false }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {roleSettings.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-semibold">{role.role}</h4>
                    <p className="text-sm text-muted-foreground">{role.permissions}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{role.users} users</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-semibold">Add New User</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Email address" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community-manager">Community Manager</SelectItem>
                    <SelectItem value="clinical-lead">Clinical Lead</SelectItem>
                    <SelectItem value="regional-vp">Regional VP</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permission Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                <div>Module</div>
                <div className="text-center">Exec</div>
                <div className="text-center">Mgmt</div>
                <div className="text-center">Ops</div>
                <div className="text-center">Clinical</div>
                <div className="text-center">Finance</div>
              </div>
              
              {permissions.map((perm, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 text-xs items-center">
                  <div className="font-medium">{perm.module}</div>
                  <div className="text-center">
                    {perm.exec ? <Badge variant="default" className="h-4 w-4 p-0">✓</Badge> : <span className="text-muted-foreground">-</span>}
                  </div>
                  <div className="text-center">
                    {perm.mgmt ? <Badge variant="default" className="h-4 w-4 p-0">✓</Badge> : <span className="text-muted-foreground">-</span>}
                  </div>
                  <div className="text-center">
                    {perm.ops ? <Badge variant="default" className="h-4 w-4 p-0">✓</Badge> : <span className="text-muted-foreground">-</span>}
                  </div>
                  <div className="text-center">
                    {perm.clinical ? <Badge variant="default" className="h-4 w-4 p-0">✓</Badge> : <span className="text-muted-foreground">-</span>}
                  </div>
                  <div className="text-center">
                    {perm.finance ? <Badge variant="default" className="h-4 w-4 p-0">✓</Badge> : <span className="text-muted-foreground">-</span>}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" size="sm">
              Edit Permissions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}