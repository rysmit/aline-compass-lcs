import React, { useState } from 'react';
import { useAuth, mockUsers, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass, User, Lock, HelpCircle, ExternalLink, Eye, EyeOff } from 'lucide-react';
export function SSOLoginPage() {
  const {
    login
  } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const roleDescriptions: Record<UserRole, string> = {
    'admin': 'Full system access and configuration',
    'c-level': 'Executive dashboard and strategic metrics',
    'regional-ops': 'Regional operations and management',
    'sales': 'Sales pipeline and lead management',
    'clinical': 'Care compliance and clinical metrics',
    'finance': 'Financial health and reporting',
    'reit-investor': 'REIT portfolio and investment metrics',
    'starter-demo': 'Limited demo access for evaluation'
  };
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, always log in as admin regardless of input
      const userData = mockUsers['admin'];
      if (userData) {
        login(userData);
      } else {
        setError('Admin user not found');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Compass className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Aline Compass</h1>
          </div>
          
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>}

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} className="pl-10" />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" />
                <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-2 h-7 w-7 p-0" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Demo Role</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleDescriptions).map(([role, description]) => <SelectItem key={role} value={role}>
                      <div>
                        <div className="font-medium capitalize">{role.replace('-', ' ')}</div>
                        <div className="text-xs text-muted-foreground">{description}</div>
                      </div>
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {/* Login Button */}
            <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>

        {/* Help Links */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground">
              <HelpCircle className="h-3 w-3 mr-1" />
              Need Help?
            </Button>
            <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground">
              <ExternalLink className="h-3 w-3 mr-1" />
              Support
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Contact your administrator for authentication setup
          </p>
          <p className="text-xs text-muted-foreground">
            Or <Button variant="link" size="sm" className="p-0 h-auto text-primary" onClick={() => window.location.href = '/'}>
              explore the app overview
            </Button>
          </p>
        </div>
      </div>
    </div>;
}