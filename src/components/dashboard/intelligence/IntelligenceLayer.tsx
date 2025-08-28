import { AutomatedInsights } from "./AutomatedInsights";
import { TopAlerts } from "./TopAlerts";
import { KeyOpportunities } from "./KeyOpportunities";
import { RegionalSnapshots } from "./RegionalSnapshots";
import { SmartSummaryCard, OnboardingProgressPanel } from "@/components/trust-layer";

interface IntelligenceLayerProps {
  filters: any;
}

export function IntelligenceLayer({ filters }: IntelligenceLayerProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Smart Summary and Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <SmartSummaryCard role="executive" timeframe="weekly" lastUpdated="2 hours ago" />
        </div>
        <div className="lg:col-span-1">
          <OnboardingProgressPanel />
        </div>
      </div>
      
      {/* Top Row - Insights and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutomatedInsights />
        <TopAlerts />
      </div>
      
      {/* Second Row - Opportunities and Regional Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeyOpportunities />
        <RegionalSnapshots />
      </div>
    </div>
  );
}