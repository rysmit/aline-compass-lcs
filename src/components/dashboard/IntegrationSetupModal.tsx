import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SystemTypeSelection } from "./integration/SystemTypeSelection";
import { AuthenticationStep } from "./integration/AuthenticationStep";
import { FieldMappingStep } from "./integration/FieldMappingStep";
import { SyncTestStep } from "./integration/SyncTestStep";

interface IntegrationSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface IntegrationData {
  systemType: string;
  systemName: string;
  credentials: {
    apiKey?: string;
    username?: string;
    password?: string;
    serverUrl?: string;
    clientId?: string;
    clientSecret?: string;
  };
  fieldMappings: Record<string, string>;
  testResults?: {
    success: boolean;
    recordCount?: number;
    errors?: string[];
  };
}

const STEPS = [
  { id: 1, title: "System Type", description: "Choose your system type" },
  { id: 2, title: "Authentication", description: "Enter connection details" },
  { id: 3, title: "Field Mapping", description: "Map your data fields" },
  { id: 4, title: "Test & Confirm", description: "Verify the integration" }
];

export function IntegrationSetupModal({ open, onOpenChange }: IntegrationSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [integrationData, setIntegrationData] = useState<IntegrationData>({
    systemType: "",
    systemName: "",
    credentials: {},
    fieldMappings: {}
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setIntegrationData({
      systemType: "",
      systemName: "",
      credentials: {},
      fieldMappings: {}
    });
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SystemTypeSelection
            data={integrationData}
            onUpdate={setIntegrationData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <AuthenticationStep
            data={integrationData}
            onUpdate={setIntegrationData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <FieldMappingStep
            data={integrationData}
            onUpdate={setIntegrationData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <SyncTestStep
            data={integrationData}
            onUpdate={setIntegrationData}
            onComplete={handleClose}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Link a New System</DialogTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogHeader>

        <div className="min-h-[400px]">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}