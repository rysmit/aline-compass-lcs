import { useAccessControl } from "@/hooks/useAccessControl";
import { useAuth } from "@/contexts/AuthContext";
import { AccessRestrictedOverlay } from "./AccessRestrictedOverlay";
import { ReactNode } from "react";

interface RouteAccessControlProps {
  requiredCommunity?: string;
  requiredMetric?: string;
  requiredCategory?: string;
  children: ReactNode;
}

export function RouteAccessControl({ 
  requiredCommunity, 
  requiredMetric, 
  requiredCategory, 
  children 
}: RouteAccessControlProps) {
  const { user } = useAuth();
  const { hasAccessToCommunity, hasAccessToMetric, hasAccessToDataCategory } = useAccessControl();

  // Non-REIT users have full access
  if (!user || user.role !== 'reit-investor') {
    return <>{children}</>;
  }

  // Check community access
  if (requiredCommunity && !hasAccessToCommunity(requiredCommunity)) {
    return <AccessRestrictedOverlay type="community" resourceName={requiredCommunity} />;
  }

  // Check metric access
  if (requiredMetric && !hasAccessToMetric(requiredMetric)) {
    return <AccessRestrictedOverlay type="metric" resourceName={requiredMetric} />;
  }

  // Check category access
  if (requiredCategory && !hasAccessToDataCategory(requiredCategory)) {
    return <AccessRestrictedOverlay type="category" resourceName={requiredCategory} />;
  }

  return <>{children}</>;
}