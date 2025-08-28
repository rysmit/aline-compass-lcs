import { useState, useEffect } from "react";
import { useAuth, mockUsers, UserRole } from "@/contexts/AuthContext";
import { useStarterMode } from "@/contexts/StarterModeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Shield, Settings } from "lucide-react";
export function UserRoleSwitcher() {
  const {
    user,
    login
  } = useAuth();
  const { isStarterMode, toggleStarterMode } = useStarterMode();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'c-level');
  
  // Auto-toggle starter mode when starter-demo role is selected
  useEffect(() => {
    const shouldBeInStarterMode = user?.role === 'starter-demo';
    if (shouldBeInStarterMode !== isStarterMode) {
      console.log('Toggling starter mode:', shouldBeInStarterMode);
      toggleStarterMode();
    }
  }, [user?.role, isStarterMode, toggleStarterMode]);

  const handleRoleChange = (role: UserRole) => {
    console.log('Role changed to:', role);
    setSelectedRole(role);
    const userData = mockUsers[role];
    if (userData) {
      login(userData);
    }
  };
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'c-level':
        return 'default';
      case 'regional-ops':
        return 'secondary';
      case 'sales':
        return 'outline';
      case 'clinical':
        return 'outline';
      case 'finance':
        return 'outline';
      case 'reit-investor':
        return 'secondary';
      case 'starter-demo':
        return 'default';
      default:
        return 'outline';
    }
  };
  return <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border/30 bg-card/50">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        
        <Badge variant={getRoleBadgeVariant(user?.role || 'c-level')} className="text-xs">
          {user?.role?.replace('-', ' ').toUpperCase()}
        </Badge>
      </div>
      
      <Select value={selectedRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[200px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="c-level">C-Level Executive</SelectItem>
          <SelectItem value="regional-ops">Regional Operations</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="clinical">Clinical</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="reit-investor">REIT/Investor</SelectItem>
          <SelectItem value="starter-demo">🚀 Starter Mode (Limited Data Onboarding)</SelectItem>
        </SelectContent>
      </Select>
    </div>;
}