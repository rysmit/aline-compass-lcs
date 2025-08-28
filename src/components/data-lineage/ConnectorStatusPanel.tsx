import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertCircle, XCircle, Plus, Clock } from "lucide-react";

interface Connector {
  id: string;
  systemName: string;
  dataDomains: string[];
  status: 'active' | 'needs-setup' | 'not-connected';
  lastSync?: string;
  syncInterval?: '24h' | 'manual' | 'real-time';
  nextSync?: string;
}

const mockConnectors: Connector[] = [
  {
    id: '1',
    systemName: 'ECP (Electronic Care Plan)',
    dataDomains: ['Care Data', 'Health Records'],
    status: 'active',
    lastSync: '2025-01-05T14:30:00Z',
    syncInterval: 'real-time'
  },
  {
    id: '2',
    systemName: 'Yardi',
    dataDomains: ['Billing Events', 'Occupancy Data'],
    status: 'active',
    lastSync: '2025-01-05T02:00:00Z',
    syncInterval: '24h',
    nextSync: '2025-01-06T02:00:00Z'
  },
  {
    id: '3',
    systemName: 'HubSpot',
    dataDomains: ['Marketing Leads', 'CRM Data'],
    status: 'needs-setup',
    lastSync: undefined,
    syncInterval: 'manual'
  },
  {
    id: '4',
    systemName: 'Epic',
    dataDomains: ['Medical Records', 'Vitals'],
    status: 'not-connected',
    lastSync: undefined,
    syncInterval: 'manual'
  }
];

const connectorLibrary = [
  'MatrixCare',
  'PointClickCare', 
  'ECP',
  'HubSpot',
  'Sage Intacct'
];

const customConnectors = [
  'Salesforce',
  'QuickBooks',
  'Yardi',
  'Other System'
];

function getStatusIcon(status: Connector['status']) {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'needs-setup':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case 'not-connected':
      return <XCircle className="h-4 w-4 text-destructive" />;
  }
}

function getStatusText(status: Connector['status']) {
  switch (status) {
    case 'active':
      return 'Active';
    case 'needs-setup':
      return 'Needs Setup';
    case 'not-connected':
      return 'Not Connected';
  }
}

function getStatusVariant(status: Connector['status']) {
  switch (status) {
    case 'active':
      return 'default';
    case 'needs-setup':
      return 'secondary';
    case 'not-connected':
      return 'outline';
  }
}

function formatSyncTimestamp(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' @ ' + date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

export function ConnectorStatusPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Connectors</h1>
          <p className="text-muted-foreground">Manage data integrations and sync status</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Request Connector
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Connector Library</div>
              {connectorLibrary.map((connector) => (
                <DropdownMenuItem key={connector} className="text-sm">
                  {connector}
                </DropdownMenuItem>
              ))}
            </div>
            <div className="border-t p-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Custom Connectors</div>
              {customConnectors.map((connector) => (
                <DropdownMenuItem key={connector} className="text-sm">
                  {connector}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockConnectors.map((connector) => (
          <Card key={connector.id} className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{connector.systemName}</CardTitle>
                <div className="flex items-center gap-1">
                  {getStatusIcon(connector.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {connector.dataDomains.map((domain, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={getStatusVariant(connector.status)}>
                    {getStatusText(connector.status)}
                  </Badge>
                </div>
                
                {connector.lastSync && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last synced: {formatSyncTimestamp(connector.lastSync)}</span>
                  </div>
                )}
                
                {connector.nextSync && connector.syncInterval === '24h' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                          <Clock className="h-3 w-3" />
                          <span>Next sync: {formatSyncTimestamp(connector.nextSync)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This system syncs every 24 hours. Next update is scheduled.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              {connector.status !== 'active' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  {connector.status === 'needs-setup' ? 'Complete Setup' : 'Configure'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}