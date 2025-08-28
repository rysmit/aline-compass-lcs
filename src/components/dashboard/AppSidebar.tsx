import { useState } from "react";
import { Compass, UserCheck, DollarSign, Stethoscope, Users, Megaphone, MessageCircle, Clock, ExternalLink, RefreshCw, Plus, Building2, Home, List } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarTrigger, SidebarFooter, SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { IntegrationSetupModal } from "@/components/dashboard/IntegrationSetupModal";
import { SystemConnectionRequestModal } from "@/components/dashboard/SystemConnectionRequestModal";
import { useNavigate } from "react-router-dom";
type SystemStatus = "active" | "degraded" | "disconnected";
type SystemType = "aline" | "third-party";
interface SystemItem {
  id: string;
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  status: SystemStatus;
  type: SystemType;
  lastSync: string;
  nextSync?: string;
  url?: string;
}
const systems: SystemItem[] = [{
  id: "crm",
  title: "Aline CRM",
  icon: UserCheck,
  status: "active",
  type: "aline",
  lastSync: "2 minutes ago",
  url: "/crm"
}, {
  id: "yardi",
  title: "Yardi",
  icon: Home,
  status: "active",
  type: "third-party",
  lastSync: "5 minutes ago",
  nextSync: "Aug 6, 2025 @ 3:00 AM",
  url: "/yardi"
}, {
  id: "pointclickcare",
  title: "PointClickCare",
  icon: Stethoscope,
  status: "active",
  type: "third-party",
  lastSync: "3 minutes ago",
  url: "/pointclickcare"
}, {
  id: "lcs-inventory",
  title: "LCS Inventory Management",
  icon: List,
  status: "active",
  type: "third-party",
  lastSync: "1 minute ago",
  nextSync: "Aug 6, 2025 @ 2:00 AM",
  url: "/lcs-inventory"
}];
const alineApps = systems.filter(system => system.type === "aline");
const connectedSystems = systems.filter(system => system.type === "third-party");
const getStatusColor = (status: SystemStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "degraded":
      return "bg-yellow-500";
    case "disconnected":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};
const getStatusText = (status: SystemStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "degraded":
      return "Degraded";
    case "disconnected":
      return "Disconnected";
    default:
      return "Unknown";
  }
};
export function AppSidebar() {
  const {
    open
  } = useSidebar();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showConnectionRequestModal, setShowConnectionRequestModal] = useState(false);
  const handleManualSync = async () => {
    setIsSyncing(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast({
      title: "Sync Complete",
      description: "All systems have been synchronized successfully."
    });
  };
  const CompassHeader = () => <div className="flex items-center gap-3 p-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          >
            <Compass className="w-5 h-5 text-primary" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <span>Return to Compass Landing</span>
        </TooltipContent>
      </Tooltip>
      {open && <div className="flex flex-col">
          
          
        </div>}
    </div>;
  return <Sidebar className="border-r border-border bg-card" collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CompassHeader />
          {open && <SidebarTrigger className="h-8 w-8 p-0 hover:bg-muted" />}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Aline Apps Section */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs font-medium text-primary mb-2 flex items-center gap-2">
              <Building2 className="w-3 h-3" />
              Aline Apps
            </SidebarGroupLabel>}
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {alineApps.map(system => <SidebarMenuItem key={system.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild className="group relative h-10 rounded-md transition-all duration-200 hover:bg-primary/10">
                        <div className="flex items-start gap-3 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <system.icon className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
                            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor(system.status)} border border-background`} />
                          </div>
                          
                          {open && <>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                    {system.title}
                                  </span>
                                  <span className="text-[8px] px-1 py-0.5 rounded bg-primary/10 text-primary font-medium flex-shrink-0">
                                    Aline
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {system.lastSync}
                                </span>
                              </div>
                              
                              {system.url && <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => {
                          e.stopPropagation();
                          window.open(system.url, "_blank");
                        }}>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>}
                            </>}
                        </div>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium">{system.title}</div>
                        <div className="text-xs flex items-center gap-1">
                          Status: 
                          <span className={`
                            ${system.status === "active" ? "text-green-600" : system.status === "degraded" ? "text-yellow-600" : "text-red-600"}
                          `}>
                            {getStatusText(system.status)}
                          </span>
                        </div>
                        {system.url && <div className="text-xs text-primary">Click to open system</div>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider between sections */}
        <SidebarSeparator className="my-2" />

        {/* Connected Systems Section */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              Connected Systems
            </SidebarGroupLabel>}
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {connectedSystems.map(system => <SidebarMenuItem key={system.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild className="group relative h-10 rounded-md transition-all duration-200 hover:bg-muted/80">
                        <div className="flex items-start gap-3 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <system.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors stroke-2" />
                            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor(system.status)} border border-background`} />
                          </div>
                          
                          {open && <>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
                                    {system.title}
                                  </span>
                                  <span className="text-[8px] px-1 py-0.5 rounded bg-muted text-muted-foreground font-medium flex-shrink-0">
                                    3P
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {system.lastSync}
                                </span>
                              </div>
                              
                              {system.url && <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => {
                          e.stopPropagation();
                          window.open(system.url, "_blank");
                        }}>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>}
                            </>}
                        </div>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium">{system.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {system.id === "referrals" ? "Property Management System" : "Third-party integration"}
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          Status: 
                          <span className={`
                            ${system.status === "active" ? "text-green-600" : system.status === "degraded" ? "text-yellow-600" : "text-red-600"}
                          `}>
                            {getStatusText(system.status)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last sync: {system.lastSync}
                        </div>
                        {system.nextSync && (
                          <div className="text-xs text-muted-foreground">
                            Next sync: {system.nextSync}
                          </div>
                        )}
                        {system.url && <div className="text-xs text-muted-foreground">Click to open external system</div>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
               </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Action Buttons */}
      <div className="p-2 space-y-2 border-t border-border">
        {/* Link a New System button */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={() => setShowIntegrationModal(true)} 
                className="group h-10 rounded-md transition-all duration-200 hover:bg-muted/80 border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 cursor-pointer flex items-center gap-3 px-3"
              >
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                
                {open && <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors py-0">
                      Link a New System
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Add integration
                    </span>
                  </div>}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-1">
                <div className="font-medium">Link a New System</div>
                <div className="text-xs text-muted-foreground">
                  Set up a new system integration with step-by-step guidance
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Request Connection button */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={() => setShowConnectionRequestModal(true)} 
                className="group h-10 rounded-md transition-all duration-200 hover:bg-muted/80 border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 cursor-pointer flex items-center gap-3 px-3"
              >
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                
                {open && <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors py-0">
                      Request Connection
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Make a connection request
                    </span>
                  </div>}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-1">
                <div className="font-medium">Request Connection</div>
                <div className="text-xs text-muted-foreground">
                  Submit a request for new system connection to be configured by the Aline team
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <SidebarFooter className="border-t border-border">
        <div className="p-2">
          <Button onClick={handleManualSync} disabled={isSyncing} className="w-full" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {open ? isSyncing ? 'Syncing...' : 'Manual Sync' : ''}
          </Button>
        </div>
      </SidebarFooter>

      {!open && <div className="absolute top-4 left-2">
          <SidebarTrigger className="h-8 w-8 p-0 hover:bg-muted" />
        </div>}
      
      <IntegrationSetupModal open={showIntegrationModal} onOpenChange={setShowIntegrationModal} />
      <SystemConnectionRequestModal open={showConnectionRequestModal} onOpenChange={setShowConnectionRequestModal} />
    </Sidebar>;
}