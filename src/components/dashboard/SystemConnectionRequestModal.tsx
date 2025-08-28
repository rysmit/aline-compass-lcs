import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowLeft, Settings, Plus } from "lucide-react";

// Import logos
import matrixcareLogo from "@/assets/logos/matrixcare-logo.png";
import pointclickcareLogo from "@/assets/logos/pointclickcare-logo.svg";
import ecpLogo from "@/assets/logos/ecp-logo-new.png";
import hubspotLogo from "@/assets/logos/hubspot-logo.svg";
import sageIntacctLogo from "@/assets/logos/sage-intacct-logo.svg";
import salesforceLogo from "@/assets/logos/salesforce-logo.svg";
import quickbooksLogo from "@/assets/logos/quickbooks-logo.png";
import yardiLogo from "@/assets/logos/yardi-logo.svg";
import alisLogo from "@/assets/logos/alis-logo.png";

interface SystemConnectionRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONNECTOR_LIBRARY = [
  {
    id: "matrixcare",
    name: "MatrixCare",
    category: "EHR",
    description: "Electronic Health Records & Care Management",
    logo: matrixcareLogo
  },
  {
    id: "pointclickcare",
    name: "PointClickCare",
    category: "EHR", 
    description: "Healthcare Technology Platform",
    logo: pointclickcareLogo
  },
  {
    id: "ecp",
    name: "ECP",
    category: "PMS",
    description: "Senior Living Property Management System",
    logo: ecpLogo
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Customer Relationship Management",
    logo: hubspotLogo
  },
  {
    id: "sage",
    name: "Sage Intacct",
    category: "Finance",
    description: "Cloud Financial Management",
    logo: sageIntacctLogo
  },
  {
    id: "alis",
    name: "ALIS",
    category: "Senior Living",
    description: "Assisted Living Integrated Solution",
    logo: alisLogo
  }
];

const CUSTOM_CONNECTORS = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Customer Relationship Management",
    logo: salesforceLogo
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Finance",
    description: "Accounting & Financial Management",
    logo: quickbooksLogo
  },
  {
    id: "yardi",
    name: "Yardi",
    category: "PMS", 
    description: "Real Estate Management Software",
    logo: yardiLogo
  },
  {
    id: "other",
    name: "Other System",
    category: "Custom",
    description: "Request integration with a system not listed above",
    logo: null
  }
];

const ALL_SYSTEMS = [...CONNECTOR_LIBRARY, ...CUSTOM_CONNECTORS];

export function SystemConnectionRequestModal({ open, onOpenChange }: SystemConnectionRequestModalProps) {
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [customSystemName, setCustomSystemName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedSystem || (selectedSystem === "other" && !customSystemName.trim())) return;
    
    setIsSubmitted(true);
    
    setTimeout(() => {
      toast({
        title: "Request Submitted",
        description: "Your system connection request has been submitted. The Aline team will review and configure the integration.",
      });
      
      // Reset form and close modal
      setSelectedSystem("");
      setCustomSystemName("");
      setNotes("");
      setIsSubmitted(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleClose = () => {
    setSelectedSystem("");
    setCustomSystemName("");
    setNotes("");
    setIsSubmitted(false);
    onOpenChange(false);
  };

  const selectedSystemData = ALL_SYSTEMS.find(s => s.id === selectedSystem);

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-chart-1 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground text-sm">
              The Aline team will review your request and configure the integration within 1-2 business days.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">Request a System Connection</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select a system to request integration with your Compass dashboard
          </p>
        </DialogHeader>

        <div className="space-y-5">
          {!selectedSystem ? (
            <div className="space-y-5">
              {/* Connector Library Section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Connector Library</Label>
                  <p className="text-xs text-muted-foreground">Pre-built connectors ready for quick setup</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CONNECTOR_LIBRARY.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => setSelectedSystem(system.id)}
                      className="p-3 rounded-lg border border-border hover:border-chart-1 hover:bg-accent/50 transition-colors text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-16 rounded-lg bg-chart-1/10 flex items-center justify-center group-hover:bg-chart-1/20 transition-colors overflow-hidden flex-shrink-0">
                          {system.logo ? (
                            <img 
                              src={system.logo} 
                              alt={`${system.name} logo`}
                              className="h-14 w-14 object-contain"
                            />
                          ) : (
                            <Settings className="h-8 w-8 text-chart-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{system.name}</h4>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {system.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {system.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Connectors Section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Custom Connectors</Label>
                  <p className="text-xs text-muted-foreground">Systems requiring custom development or configuration</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CUSTOM_CONNECTORS.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => setSelectedSystem(system.id)}
                      className="p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/50 transition-colors text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-16 w-16 rounded-lg flex items-center justify-center transition-colors overflow-hidden flex-shrink-0 ${
                          system.id === 'other' 
                            ? 'bg-muted/50 group-hover:bg-muted/70' 
                            : 'bg-accent/10 group-hover:bg-accent/20'
                        }`}>
                          {system.logo ? (
                            <img 
                              src={system.logo} 
                              alt={`${system.name} logo`}
                              className="h-14 w-14 object-contain"
                            />
                          ) : (
                            <Plus className={`h-8 w-8 ${system.id === 'other' ? 'text-muted-foreground' : 'text-accent'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{system.name}</h4>
                            <Badge variant={system.id === 'other' ? 'outline' : 'secondary'} className="text-xs flex-shrink-0">
                              {system.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {system.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSystem("")}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-semibold">Request {selectedSystemData?.name} Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide additional details for your integration request
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-4">
                  <div className={`h-20 w-20 rounded-lg flex items-center justify-center overflow-hidden ${
                    selectedSystemData?.id === 'other' ? 'bg-muted/50' : 'bg-accent/10'
                  }`}>
                    {selectedSystemData?.logo ? (
                      <img
                        src={selectedSystemData.logo} 
                        alt={`${selectedSystemData.name} logo`}
                        className="h-18 w-18 object-contain"
                      />
                    ) : (
                      <Plus className={`h-10 w-10 ${selectedSystemData?.id === 'other' ? 'text-muted-foreground' : 'text-accent'}`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{selectedSystemData?.name}</h4>
                      <Badge variant={CUSTOM_CONNECTORS.find(s => s.id === selectedSystem) ? "secondary" : "outline"} className="text-xs">
                        {selectedSystemData?.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedSystemData?.description}
                    </p>
                  </div>
                </div>
              </div>

              {selectedSystem === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="customSystemName">System Name *</Label>
                  <Input
                    id="customSystemName"
                    value={customSystemName}
                    onChange={(e) => setCustomSystemName(e.target.value)}
                    placeholder="Enter the name of the system you want to integrate..."
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any specific requirements, timelines, or additional context for this integration..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your request will be reviewed by the Aline technical team</li>
                  <li>• We'll configure the integration securely on our end</li>
                  <li>• You'll receive setup instructions within 1-2 business days</li>
                  <li>• No immediate access credentials required</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={!selectedSystem || (selectedSystem === "other" && !customSystemName.trim())}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}