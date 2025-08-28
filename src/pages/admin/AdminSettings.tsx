import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { SystemConfiguration } from "./sections/SystemConfiguration";
import { RolesPermissions } from "./sections/RolesPermissions";
import { AccessManagement } from "./sections/AccessManagement";
import { AlertThresholds } from "./sections/AlertThresholds";

import { ConnectorsSettings } from "./sections/ConnectorsSettings";
import { CalculationSettingsSection } from "./sections/CalculationSettingsSection";
import { Shield, ChevronDown } from "lucide-react";

const ADMIN_TABS = [
  { id: "system", label: "System Configuration" },
  { id: "connectors", label: "Connectors" },
  { id: "calculations", label: "Calculation Settings" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "access", label: "Access Management" },
  { id: "alerts", label: "Alert Thresholds" }
];

export function AdminSettings() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Check for tab parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(() => {
    // Use URL tab parameter or fallback to localStorage
    if (tabFromUrl && ADMIN_TABS.some(tab => tab.id === tabFromUrl)) {
      return tabFromUrl;
    }
    return localStorage.getItem("admin-active-tab") || "system";
  });

  // Update localStorage when tab changes
  useEffect(() => {
    localStorage.setItem("admin-active-tab", activeTab);
  }, [activeTab]);

  const getCurrentTabLabel = () => {
    return ADMIN_TABS.find(tab => tab.id === activeTab)?.label || "System Configuration";
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin/settings" },
    { label: getCurrentTabLabel() }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Settings
            </h1>
            <p className="text-muted-foreground">
              Manage system configuration, user roles, and integration settings
            </p>
          </div>

          {/* Responsive Tab Navigation */}
          <div className="border-b border-border">
            {isMobile ? (
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full mb-4">
                  <div className="flex items-center gap-2">
                    <span>{getCurrentTabLabel()}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-card border border-border">
                  {ADMIN_TABS.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto">
                  {ADMIN_TABS.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="text-sm font-medium px-4 py-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "system" && <SystemConfiguration />}
            {activeTab === "connectors" && <ConnectorsSettings />}
            {activeTab === "calculations" && <CalculationSettingsSection />}
            {activeTab === "roles" && <RolesPermissions />}
            {activeTab === "access" && <AccessManagement />}
            {activeTab === "alerts" && <AlertThresholds />}
          </div>
        </div>
      </div>
    );
}