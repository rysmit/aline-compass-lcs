import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, Play, RotateCcw } from "lucide-react";
import { IntegrationData } from "../IntegrationSetupModal";
import { useToast } from "@/hooks/use-toast";

interface SyncTestStepProps {
  data: IntegrationData;
  onUpdate: (data: IntegrationData) => void;
  onComplete: () => void;
  onPrevious: () => void;
}

interface TestResult {
  step: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  details?: string;
}

export function SyncTestStep({ data, onUpdate, onComplete, onPrevious }: SyncTestStepProps) {
  const { toast } = useToast();
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { step: "Connection Test", status: "pending", message: "Waiting to start..." },
    { step: "Authentication", status: "pending", message: "Waiting to start..." },
    { step: "Field Validation", status: "pending", message: "Waiting to start..." },
    { step: "Data Sync Test", status: "pending", message: "Waiting to start..." },
    { step: "Final Verification", status: "pending", message: "Waiting to start..." }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [finalResults, setFinalResults] = useState<{
    success: boolean;
    recordCount?: number;
    errors?: string[];
  }>({
    success: false
  });

  const runSyncTest = async () => {
    setIsRunningTest(true);
    setTestCompleted(false);
    setCurrentStep(0);

    const steps = [
      {
        name: "Connection Test",
        duration: 1500,
        successMessage: "Successfully connected to the system",
        successRate: 0.95
      },
      {
        name: "Authentication",
        duration: 1000,
        successMessage: "Authentication successful",
        successRate: 0.9
      },
      {
        name: "Field Validation",
        duration: 2000,
        successMessage: "All field mappings validated",
        successRate: 0.85
      },
      {
        name: "Data Sync Test",
        duration: 3000,
        successMessage: "Sample data synchronized successfully",
        successRate: 0.8
      },
      {
        name: "Final Verification",
        duration: 1500,
        successMessage: "Integration setup completed",
        successRate: 0.95
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(i);
      
      // Set step to running
      setTestResults(prev => prev.map((result, index) => 
        index === i 
          ? { ...result, status: "running", message: `Running ${step.name}...` }
          : result
      ));

      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, step.duration));

      // Determine if step succeeds (simulate some realistic failure rates)
      const success = Math.random() < step.successRate;

      setTestResults(prev => prev.map((result, index) => 
        index === i 
          ? { 
              ...result, 
              status: success ? "success" : "error",
              message: success 
                ? step.successMessage
                : `${step.name} failed - check configuration`,
              details: success 
                ? undefined 
                : "Please verify your credentials and field mappings"
            }
          : result
      ));

      // If step fails, stop the test
      if (!success) {
        setIsRunningTest(false);
        setFinalResults({
          success: false,
          errors: [`${step.name} failed`]
        });
        return;
      }
    }

    // All steps successful
    const mockRecordCount = Math.floor(Math.random() * 500) + 100;
    setFinalResults({
      success: true,
      recordCount: mockRecordCount
    });

    onUpdate({
      ...data,
      testResults: {
        success: true,
        recordCount: mockRecordCount
      }
    });

    setIsRunningTest(false);
    setTestCompleted(true);
  };

  const handleComplete = () => {
    toast({
      title: "Integration Setup Complete",
      description: `${data.systemName} has been successfully integrated with your dashboard.`,
    });
    onComplete();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "running":
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-700">Running</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const overallProgress = testResults.filter(r => r.status === "success").length / testResults.length * 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sync Test & Confirmation</h3>
        <p className="text-muted-foreground mb-4">
          Test the integration and verify that data can be synchronized successfully.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">System Type:</span>
              <span className="ml-2 font-medium">{data.systemType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">System Name:</span>
              <span className="ml-2 font-medium">{data.systemName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Fields Mapped:</span>
              <span className="ml-2 font-medium">{Object.keys(data.fieldMappings).length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Auth Method:</span>
              <span className="ml-2 font-medium">
                {data.credentials.apiKey ? "API Key" : "Username/Password"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Sync Test Progress</CardTitle>
            {!isRunningTest && !testCompleted && (
              <Button onClick={runSyncTest} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Test
              </Button>
            )}
            {testCompleted && (
              <Button onClick={runSyncTest} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Run Again
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isRunningTest || testCompleted) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="w-full" />
            </div>
          )}

          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{result.step}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-red-600 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {testCompleted && finalResults.success && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Integration Test Successful!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Successfully synchronized {finalResults.recordCount} records from {data.systemName}.
                </p>
              </CardContent>
            </Card>
          )}

          {testCompleted && !finalResults.success && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Integration Test Failed</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Please review the configuration and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isRunningTest}>
          Previous
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!testCompleted || !finalResults.success}
        >
          Complete Integration
        </Button>
      </div>
    </div>
  );
}