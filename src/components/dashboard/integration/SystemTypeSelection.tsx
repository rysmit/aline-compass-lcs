import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, DollarSign, Stethoscope, Megaphone, Settings, Database } from "lucide-react";
import { IntegrationData } from "../IntegrationSetupModal";

interface SystemTypeSelectionProps {
  data: IntegrationData;
  onUpdate: (data: IntegrationData) => void;
  onNext: () => void;
}

const SYSTEM_TYPES = [
  {
    id: "crm",
    name: "CRM System",
    description: "Customer/Resident Relationship Management",
    icon: UserCheck,
    templates: ["Salesforce", "HubSpot", "Aline CRM", "Custom CRM"]
  },
  {
    id: "billing",
    name: "Billing System",
    description: "Financial and billing management",
    icon: DollarSign,
    templates: ["Yardi Voyager", "RealPage", "Aline Billing", "QuickBooks"]
  },
  {
    id: "emr",
    name: "EMR/Clinical",
    description: "Electronic Medical Records",
    icon: Stethoscope,
    templates: ["MatrixCare", "PCC", "PointClickCare", "Cerner"]
  },
  {
    id: "marketing",
    name: "Marketing Platform",
    description: "Marketing automation and campaigns",
    icon: Megaphone,
    templates: ["Mailchimp", "Constant Contact", "HubSpot Marketing", "Custom"]
  },
  {
    id: "operations",
    name: "Operations System",
    description: "Facility and operational management",
    icon: Settings,
    templates: ["ServiceNow", "Maintenance Connection", "Custom"]
  },
  {
    id: "other",
    name: "Other System",
    description: "Custom or specialized system",
    icon: Database,
    templates: ["Custom API", "Database", "Spreadsheet Import"]
  }
];

export function SystemTypeSelection({ data, onUpdate, onNext }: SystemTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState(data.systemType);
  const [systemName, setSystemName] = useState(data.systemName);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleNext = () => {
    if (selectedType && systemName.trim()) {
      onUpdate({
        ...data,
        systemType: selectedType,
        systemName: systemName.trim()
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select System Type</h3>
        <p className="text-muted-foreground mb-4">
          Choose the type of system you want to integrate with your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SYSTEM_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.id ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-sm">{type.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Popular platforms:</span>
                  <div className="mt-1">
                    {type.templates.slice(0, 2).join(", ")}
                    {type.templates.length > 2 && "..."}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedType && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <Label htmlFor="systemName">System Name</Label>
            <Input
              id="systemName"
              placeholder="Enter a name for this integration (e.g., 'Main CRM', 'Billing System')"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedType || !systemName.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}