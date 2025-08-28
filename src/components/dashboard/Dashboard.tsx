import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { UserRoleSwitcher } from "@/components/auth/UserRoleSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { FilterBar } from "./FilterBar";
import { ExecutiveOverview } from "./tabs/ExecutiveOverview";
import { CensusOccupancy } from "./tabs/CensusOccupancy";
import { SalesPipeline } from "./tabs/SalesPipeline";
import { FinancialHealth } from "./tabs/FinancialHealth";
import { CareCompliance } from "./tabs/CareCompliance";
import { ForecastRisk } from "./tabs/ForecastRisk";
import { REITPortfolio } from "./tabs/REITPortfolio";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, Settings, Compass } from "lucide-react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { CompassCopilot } from "@/components/ai/CompassCopilot";
import { ResidentNavigationHub } from "@/components/navigation/ResidentNavigationHub";
export function Dashboard() {
  const {
    user,
    canViewResource
  } = useAuth();
  const navigate = useNavigate();

  // All hooks must be called before any conditional returns
  const [filters, setFilters] = useState({
    dateRange: "30d",
    division: "all",
    region: "all",
    community: "all",
    careLevel: "all",
    payerType: "all",
    alertLevel: "all",
    portfolioSegment: "all"
  });

  // Get first available tab based on user permissions
  const getFirstAvailableTab = () => {
    const tabPermissions = [{
      tab: 'overview',
      resource: 'executive-overview'
    }, {
      tab: 'census',
      resource: 'census-occupancy'
    }, {
      tab: 'sales',
      resource: 'sales-pipeline'
    }, {
      tab: 'financial',
      resource: 'financial-health'
    }, {
      tab: 'care',
      resource: 'care-compliance'
    }, {
      tab: 'forecast',
      resource: 'forecast-risk'
    }];
    const availableTab = tabPermissions.find(({
      resource
    }) => canViewResource(resource));
    return availableTab?.tab || 'overview';
  };
  const [activeTab, setActiveTab] = useState(getFirstAvailableTab());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update active tab when user role changes
  React.useEffect(() => {
    const firstAvailable = getFirstAvailableTab();
    setActiveTab(firstAvailable);
  }, [user?.role]);

  // Show REIT dashboard if user is REIT investor - AFTER all hooks
  if (user?.role === 'reit-investor') {
    return <REITDashboard />;
  }
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleReset = () => {
    setFilters({
      dateRange: "30d",
      division: "all",
      region: "all",
      community: "all",
      careLevel: "all",
      payerType: "all",
      alertLevel: "all",
      portfolioSegment: "all"
    });
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };
  return <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header - Lower z-index */}
          <div className="border-b border-border bg-card shadow-card sticky top-0 z-40">
            <div className="aline-page-margin py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-2xl">ALINE Compass</h1>
                </div>
                
                <div className="flex items-center aline-card-spacing">
                  <UserRoleSwitcher />
                  
                  <Button variant="outline" size="sm" onClick={() => navigate('/data-explorer')}>
                    <Compass className="h-4 w-4 mr-2" />
                    Data Explorer
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <NotificationCenter />
                  
                  <PermissionGate resource="admin" action="view">
                    <Button variant="outline" size="sm" onClick={() => {
                    window.location.href = '/admin/settings';
                  }}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 aline-page-margin py-4 page-enter">
            {/* Filter Bar - Above section navigation */}
            <div className="mb-4">
              <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-background to-background/95 border border-border/50 shadow-sm rounded-lg backdrop-blur-sm role-transition">
                <PermissionGate resource="executive-overview" action="view" fallback={<div className="hidden" />}>
                  <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Executive Overview
                  </TabsTrigger>
                </PermissionGate>
                <PermissionGate resource="census-occupancy" action="view" fallback={<div className="hidden" />}>
                  <TabsTrigger value="census" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Census & Occupancy
                  </TabsTrigger>
                </PermissionGate>
                <PermissionGate resource="sales-pipeline" action="view" fallback={<div className="hidden" />}>
                  <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Sales & Pipeline
                  </TabsTrigger>
                </PermissionGate>
                <PermissionGate resource="financial-health" action="view" fallback={<div className="hidden" />}>
                  <TabsTrigger value="financial" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Financial Health
                  </TabsTrigger>
                </PermissionGate>
                <PermissionGate resource="care-compliance" action="view" fallback={<div className="hidden" />}>
                  <TabsTrigger value="care" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Care & Compliance
                  </TabsTrigger>
                </PermissionGate>
                <PermissionGate resource="forecast-risk" action="view" fallback={<div className="hidden" />}>
                  <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Forecast & Risk
                  </TabsTrigger>
                </PermissionGate>
              </TabsList>

              <PermissionGate resource="executive-overview" action="view">
                <TabsContent value="overview" className="space-y-6">
                  <ExecutiveOverview filters={filters} />
                </TabsContent>
              </PermissionGate>

              <PermissionGate resource="census-occupancy" action="view">
                <TabsContent value="census" className="space-y-6">
                  <CensusOccupancy filters={filters} />
                </TabsContent>
              </PermissionGate>

              <PermissionGate resource="sales-pipeline" action="view">
                <TabsContent value="sales" className="space-y-6">
                  <SalesPipeline filters={filters} />
                </TabsContent>
              </PermissionGate>

              <PermissionGate resource="financial-health" action="view">
                <TabsContent value="financial" className="space-y-6">
                  <FinancialHealth filters={filters} />
                </TabsContent>
              </PermissionGate>

              <PermissionGate resource="care-compliance" action="view">
                <TabsContent value="care" className="space-y-6">
                  <CareCompliance filters={filters} />
                </TabsContent>
              </PermissionGate>

              <PermissionGate resource="forecast-risk" action="view">
                <TabsContent value="forecast" className="space-y-6">
                  <ForecastRisk filters={filters} />
                </TabsContent>
              </PermissionGate>
            </Tabs>
            
            {/* Resident Navigation Hub - Moved to bottom */}
            <div className="mt-6 pt-6 border-t border-border">
              <ResidentNavigationHub />
            </div>
          </div>
        </SidebarInset>
        
        {/* Compass Copilot - AI Assistant */}
        <CompassCopilot currentTab={activeTab} filters={filters} />
      </div>
    </SidebarProvider>;
}

// REIT Investor Dashboard Component
function REITDashboard() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    dateRange: "30d",
    division: "all",
    region: "all",
    operator: "all",
    riskLevel: "all"
  });
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleReset = () => {
    setFilters({
      dateRange: "30d",
      division: "all",
      region: "all",
      operator: "all",
      riskLevel: "all"
    });
  };
  return <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header - Lower z-index */}
          <div className="border-b border-border bg-card shadow-card sticky top-0 z-40">
            <div className="aline-page-margin py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-xl">
                    ALINE Compass
                  </h1>
                  <p className="text-sm text-muted-foreground">Real-time performance insights across your portfolio</p>
                </div>
                
                <div className="flex items-center aline-card-spacing">
                  <UserRoleSwitcher />
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <NotificationCenter />
                </div>
              </div>
            </div>
          </div>

          {/* REIT-specific filters - Even lower z-index */}
          <div className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-[73px] z-30 shadow-sm">
            <div className="aline-page-margin">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <Select value={filters.dateRange} onValueChange={value => handleFilterChange('dateRange', value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="12m">Last 12 Months</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.operator} onValueChange={value => handleFilterChange('operator', value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Operators" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Operators</SelectItem>
                      <SelectItem value="slp">Senior Living Partners</SelectItem>
                      <SelectItem value="heritage">Heritage Care Group</SelectItem>
                      <SelectItem value="sunrise">Sunrise Communities</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.region} onValueChange={value => handleFilterChange('region', value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="northeast">Northeast</SelectItem>
                      <SelectItem value="southeast">Southeast</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                      <SelectItem value="midwest">Midwest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* REIT Dashboard Content */}
          <div className="flex-1 aline-page-margin py-4 page-enter">
            <REITPortfolio filters={filters} />
          </div>
        </SidebarInset>
        
        {/* Compass Copilot */}
        <CompassCopilot currentTab="reit-portfolio" filters={filters} />
      </div>
    </SidebarProvider>;
}