import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Zap,
  Lock,
  Database,
  Users,
  DollarSign,
  Heart,
  TrendingUp,
  Building,
  UserCheck,
  Home,
  Stethoscope,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataIntegration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'partial' | 'not-connected';
  kpisUnlocked: number;
  totalKpis: number;
  icon: React.ComponentType<any>;
}

interface KPICategory {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'partial' | 'locked';
  availableKpis: number;
  totalKpis: number;
  icon: React.ComponentType<any>;
  requiredIntegrations: string[];
}

const DATA_INTEGRATIONS: DataIntegration[] = [
  {
    id: 'aline-crm',
    name: 'Aline CRM',
    description: 'Core resident and lead management system',
    status: 'connected',
    kpisUnlocked: 12,
    totalKpis: 12,
    icon: UserCheck
  },
  {
    id: 'yardi',
    name: 'Yardi',
    description: 'Property management and financial data',
    status: 'connected',
    kpisUnlocked: 15,
    totalKpis: 15,
    icon: Home
  },
  {
    id: 'pointclickcare',
    name: 'PointClickCare',
    description: 'Clinical records and care management',
    status: 'connected',
    kpisUnlocked: 8,
    totalKpis: 8,
    icon: Stethoscope
  },
  {
    id: 'lcs-inventory',
    name: 'LCS Inventory Management',
    description: 'Inventory tracking and supply management',
    status: 'connected',
    kpisUnlocked: 6,
    totalKpis: 6,
    icon: List
  },
  {
    id: 'sage-intacct',
    name: 'Sage Intacct',
    description: 'Advanced financial reporting and analytics',
    status: 'not-connected',
    kpisUnlocked: 0,
    totalKpis: 10,
    icon: DollarSign
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting and payroll integration',
    status: 'not-connected',
    kpisUnlocked: 0,
    totalKpis: 8,
    icon: Building
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing automation and CRM enhancement',
    status: 'partial',
    kpisUnlocked: 3,
    totalKpis: 7,
    icon: TrendingUp
  }
];

const KPI_CATEGORIES: KPICategory[] = [
  {
    id: 'census',
    name: 'Census & Occupancy',
    description: 'Resident count and occupancy metrics',
    status: 'ready',
    availableKpis: 8,
    totalKpis: 8,
    icon: Users,
    requiredIntegrations: ['aline-crm']
  },
  {
    id: 'care',
    name: 'Care & Clinical',
    description: 'Health outcomes and care quality',
    status: 'ready',
    availableKpis: 8,
    totalKpis: 8,
    icon: Heart,
    requiredIntegrations: ['pointclickcare']
  },
  {
    id: 'financial',
    name: 'Financial Health',
    description: 'Revenue, expenses, and profitability',
    status: 'ready',
    availableKpis: 15,
    totalKpis: 15,
    icon: DollarSign,
    requiredIntegrations: ['yardi']
  },
  {
    id: 'sales',
    name: 'Sales Pipeline',
    description: 'Lead conversion and sales performance',
    status: 'ready',
    availableKpis: 12,
    totalKpis: 12,
    icon: TrendingUp,
    requiredIntegrations: ['aline-crm']
  },
  {
    id: 'operations',
    name: 'Operations & Inventory',
    description: 'Supply chain and facility management',
    status: 'ready',
    availableKpis: 6,
    totalKpis: 6,
    icon: Building,
    requiredIntegrations: ['lcs-inventory']
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics',
    description: 'AI-driven forecasts and risk assessment',
    status: 'ready',
    availableKpis: 12,
    totalKpis: 12,
    icon: Zap,
    requiredIntegrations: ['aline-crm', 'yardi', 'pointclickcare']
  }
];

export function OnboardingProgressPanel() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['integrations']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleConnectIntegration = (integrationId: string) => {
    navigate('/admin/settings');
  };

  const handleViewSetupGuide = () => {
    navigate('/admin/settings');
  };

  const handleConnectRentRoll = () => {
    navigate('/admin/settings');
  };

  const handleEnablePredictive = () => {
    navigate('/admin/settings');
  };

  const getStatusIcon = (status: 'connected' | 'partial' | 'not-connected' | 'ready' | 'locked') => {
    switch (status) {
      case 'connected':
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'not-connected':
      case 'locked':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: 'connected' | 'partial' | 'not-connected' | 'ready' | 'locked') => {
    const statusMap = {
      'connected': { label: 'Connected', variant: 'default' as const },
      'ready': { label: 'Ready', variant: 'default' as const },
      'partial': { label: 'Partial', variant: 'secondary' as const },
      'not-connected': { label: 'Not Connected', variant: 'destructive' as const },
      'locked': { label: 'Locked', variant: 'destructive' as const }
    };
    
    const { label, variant } = statusMap[status];
    return <Badge variant={variant} className="text-xs">{label}</Badge>;
  };

  const connectedIntegrations = DATA_INTEGRATIONS.filter(i => i.status === 'connected').length;
  const totalKpisUnlocked = DATA_INTEGRATIONS.reduce((sum, integration) => sum + integration.kpisUnlocked, 0);
  const totalKpisAvailable = DATA_INTEGRATIONS.reduce((sum, integration) => sum + integration.totalKpis, 0);
  const overallProgress = (totalKpisUnlocked / totalKpisAvailable) * 100;

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Data Integration Progress</CardTitle>
            <Badge variant="outline" className="text-xs">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
          <div className="space-y-2">
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {totalKpisUnlocked} of {totalKpisAvailable} KPIs unlocked across {connectedIntegrations} data sources
            </p>
          </div>
        </CardHeader>

      <CardContent className="space-y-4">
        {/* Data Integrations Section */}
        <Collapsible 
          open={expandedSections.has('integrations')} 
          onOpenChange={() => toggleSection('integrations')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              {expandedSections.has('integrations') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
              <span className="font-medium">Data Source Connections</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {connectedIntegrations}/{DATA_INTEGRATIONS.length}
            </Badge>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-2 mt-2">
            {DATA_INTEGRATIONS.map((integration) => {
              const Icon = integration.icon;
              return (
                <div 
                  key={integration.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{integration.name}</span>
                        {getStatusIcon(integration.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {integration.kpisUnlocked}/{integration.totalKpis} KPIs
                    </span>
                    {integration.status === 'not-connected' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => handleConnectIntegration(integration.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    ) : (
                      getStatusBadge(integration.status)
                    )}
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* KPI Categories Section */}
        <Collapsible 
          open={expandedSections.has('categories')} 
          onOpenChange={() => toggleSection('categories')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              {expandedSections.has('categories') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
              <span className="font-medium">KPI Categories</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {KPI_CATEGORIES.filter(c => c.status === 'ready').length}/{KPI_CATEGORIES.length} Ready
            </Badge>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-2 mt-2">
            {KPI_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg transition-colors",
                    category.status === 'locked' && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "h-5 w-5",
                      category.status === 'locked' ? "text-muted-foreground" : "text-primary"
                    )} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{category.name}</span>
                        {getStatusIcon(category.status)}
                        {category.status === 'locked' && <Lock className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                      {category.status === 'locked' && (
                        <p className="text-xs text-warning mt-1">
                          Requires: {category.requiredIntegrations.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {category.availableKpis}/{category.totalKpis} KPIs
                    </span>
                    {getStatusBadge(category.status)}
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Quick Actions</p>
            <Button variant="outline" size="sm" onClick={handleViewSetupGuide}>
              View Full Setup Guide
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start h-auto p-3"
              onClick={handleConnectRentRoll}
            >
              <Plus className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="text-xs font-medium">Connect Sage Intacct</p>
                <p className="text-xs text-muted-foreground">Unlock 10 Advanced Financial KPIs</p>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start h-auto p-3"
              onClick={handleEnablePredictive}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="text-xs font-medium">Connect HubSpot</p>
                <p className="text-xs text-muted-foreground">Enhance marketing analytics</p>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
    </TooltipProvider>
  );
}