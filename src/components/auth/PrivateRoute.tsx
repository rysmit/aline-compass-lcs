import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SSOLoginPage } from './SSOLoginPage';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <SSOLoginPage />;
  }

  return <>{children}</>;
}