import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Plus,
  Zap,
  DollarSign,
  Building,
  TrendingUp,
  ArrowRight,
  Users,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'next' | 'locked';
  icon: React.ComponentType<any>;
  kpisUnlocked: number;
  benefits: string[];
  estimatedTime: string;
}

const ONBOARDING_STEPS: IntegrationStep[] = [
  {
    id: 'current',
    name: 'Aline CRM',
    description: 'Basic occupancy, census, and lead management',
    status: 'completed',
    icon: Users,
    kpisUnlocked: 12,
    benefits: ['Occupancy tracking', 'Lead management', 'Move-in tracking'],
    estimatedTime: 'Complete'
  },
  {
    id: 'clinical',
    name: 'Clinical System',
    description: 'Care plans, health records, and compliance',
    status: 'next',
    icon: Heart,
    kpisUnlocked: 8,
    benefits: ['Care compliance', 'Health outcomes', 'Incident tracking'],
    estimatedTime: '10 minutes'
  },
  {
    id: 'billing',
    name: 'Billing Integration',
    description: 'Unlock revenue, collections, and financial health',
    status: 'locked',
    icon: DollarSign,
    kpisUnlocked: 15,
    benefits: ['Revenue per unit', 'Collections rate', 'NOI tracking'],
    estimatedTime: '15 minutes'
  },
  {
    id: 'payroll',
    name: 'Payroll System',
    description: 'Add labor costs and operational efficiency',
    status: 'locked',
    icon: Building,
    kpisUnlocked: 10,
    benefits: ['Labor cost ratios', 'Staff efficiency', 'Operating margins'],
    estimatedTime: '10 minutes'
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics',
    description: 'AI-powered forecasting and risk modeling',
    status: 'locked',
    icon: Zap,
    kpisUnlocked: 12,
    benefits: ['Churn prediction', 'Occupancy forecasts', 'Risk scoring'],
    estimatedTime: '5 minutes'
  }
];

export function StarterModeOnboardingPanel() {
  const navigate = useNavigate();

  const completedSteps = ONBOARDING_STEPS.filter(step => step.status === 'completed').length;
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = (completedSteps / totalSteps) * 100;
  const totalKpisUnlocked = ONBOARDING_STEPS.filter(step => step.status === 'completed')
    .reduce((sum, step) => sum + step.kpisUnlocked, 0);
  const totalKpisPossible = ONBOARDING_STEPS.reduce((sum, step) => sum + step.kpisUnlocked, 0);

  const getStatusIcon = (status: IntegrationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'next':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'locked':
        return <Plus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: IntegrationStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>;
      case 'next':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Next Step</Badge>;
      case 'locked':
        return <Badge variant="outline" className="text-muted-foreground">Locked</Badge>;
    }
  };

  const handleAddIntegration = (stepId: string) => {
    // Navigate to admin settings with the specific integration tab
    navigate('/admin/settings?tab=connectors');
  };

  const nextStep = ONBOARDING_STEPS.find(step => step.status === 'next');

  return (
    <Card className="w-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Complete Your Data Setup
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add more data sources to unlock additional insights and capabilities
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {totalKpisUnlocked} of {totalKpisPossible} KPIs
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedSteps} of {totalSteps} integrations complete
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900">You're using Aline CRM data</h4>
              <p className="text-sm text-green-700 mt-1">
                Great start! You have access to {totalKpisUnlocked} core metrics including occupancy, census, and lead management.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-foreground">Recommended Next Steps</h4>
          
          {ONBOARDING_STEPS.filter(step => step.status !== 'completed').map((step, index) => {
            const Icon = step.icon;
            const isNext = step.status === 'next';
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  isNext ? "border-blue-200 bg-blue-50" : "border-border bg-card/50",
                  step.status === 'locked' && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2 mt-0.5">
                      {getStatusIcon(step.status)}
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-medium text-sm">{step.name}</h5>
                        {getStatusBadge(step.status)}
                        {isNext && <Badge variant="outline" className="text-xs text-blue-700">
                          {step.estimatedTime}
                        </Badge>}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Unlocks {step.kpisUnlocked} KPIs:</p>
                        <div className="flex flex-wrap gap-1">
                          {step.benefits.map((benefit, i) => (
                            <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {step.status === 'next' && (
                    <Button 
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => handleAddIntegration(step.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Integration
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action CTA */}
        {nextStep && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <div className="space-y-1">
                <p className="font-medium text-sm">Ready to unlock more insights?</p>
                <p className="text-xs text-muted-foreground">
                  Add {nextStep.name} to unlock {nextStep.kpisUnlocked} additional KPIs in just {nextStep.estimatedTime}
                </p>
              </div>
              <Button 
                onClick={() => handleAddIntegration(nextStep.id)}
                className="flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}