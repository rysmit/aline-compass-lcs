import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, GitBranch, Shield, CheckCircle, Clock, Users, TrendingUp, Zap, Search, Filter } from "lucide-react";
import { DataLineageFlow } from "./DataLineageFlow";
const dataQualityStats = {
  totalTables: 25,
  connectedSources: 8,
  qualityScore: 98.5,
  lastSync: "2 minutes ago"
};
const valuePropositions = [{
  icon: Shield,
  title: "Single Source of Truth",
  description: "Eliminate data silos with unified, validated schemas across all systems"
}, {
  icon: CheckCircle,
  title: "Quality Assured",
  description: "98.5% data quality score with automated validation and anomaly detection"
}, {
  icon: TrendingUp,
  title: "Business Intelligence Ready",
  description: "Pre-built dimensions and measures optimized for senior living analytics"
}];
export function CompassGoldDataVisualization() {
  return <div className="space-y-8">
      {/* Hero Section with Value Props */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/5 border border-primary/20">
        <div className="relative p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="gap-2 px-3 py-1">
                  <Database className="h-4 w-4" />
                  Unified Model for Enterprise Reporting
                </Badge>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Unlock the Power of the Gold Layer</h2>
                <p className="text-lg text-muted-foreground">Get direct access to your complete, validated senior living data model — unified across CRM, Billing, Staffing, and Care platforms. Harness the Gold Layer for enterprise BI, performance dashboards, and portfolio rollups.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {valuePropositions.map((prop, index) => {
                const IconComponent = prop.icon;
                return <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-sm">{prop.title}</div>
                            <div className="text-xs text-muted-foreground">{prop.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>;
              })}
              </div>
            </div>

            <div className="relative">
              <DataLineageFlow />
            </div>
          </div>
        </div>
      </div>

    </div>;
}