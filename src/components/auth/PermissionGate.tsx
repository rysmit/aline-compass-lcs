import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface PermissionGateProps {
  resource: string;
  action: string;
  scope?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ 
  resource, 
  action, 
  scope, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(resource, action, scope)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}