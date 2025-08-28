import { ChartContainer } from "../ChartContainer";
import { KPICard } from "../KPICard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CareComplianceProps {
  filters: any;
}

const acuityTrendData = [
  { month: 'Jul', acuity: 2.1, incidents: 3.2 },
  { month: 'Aug', acuity: 2.2, incidents: 2.8 },
  { month: 'Sep', acuity: 2.3, incidents: 3.1 },
  { month: 'Oct', acuity: 2.4, incidents: 2.9 },
  { month: 'Nov', acuity: 2.3, incidents: 2.6 },
  { month: 'Dec', acuity: 2.3, incidents: 2.4 },
];

const complianceData = [
  { task: 'Medication Administration', completion: 98.5, target: 99.0 },
  { task: 'Care Plan Updates', completion: 94.2, target: 95.0 },
  { task: 'Safety Rounds', completion: 96.8, target: 98.0 },
  { task: 'Documentation', completion: 92.1, target: 95.0 },
  { task: 'Family Communication', completion: 89.3, target: 90.0 },
];

const incidentData = [
  { type: 'Falls', count: 12, rate: 4.2, target: 4.0 },
  { type: 'Hospitalizations', count: 8, rate: 2.8, target: 3.0 },
  { type: 'Medication Errors', count: 3, rate: 1.1, target: 1.0 },
  { type: 'Pressure Ulcers', count: 2, rate: 0.7, target: 0.5 },
  { type: 'Infections', count: 5, rate: 1.8, target: 2.0 },
];

const residentAlerts = [
  { id: 'R001', name: 'Margaret Johnson', acuity: 4.2, compliance: 78, risk: 'High', community: 'Oak Ridge' },
  { id: 'R045', name: 'Robert Chen', acuity: 3.8, compliance: 82, risk: 'High', community: 'Sunset Village' },
  { id: 'R123', name: 'Dorothy Williams', acuity: 3.9, compliance: 79, risk: 'High', community: 'Garden Terrace' },
  { id: 'R087', name: 'Frank Miller', acuity: 3.6, compliance: 85, risk: 'Medium', community: 'Meadow Brook' },
  { id: 'R201', name: 'Helen Davis', acuity: 3.7, compliance: 81, risk: 'Medium', community: 'Heritage Hills' },
];

export function CareCompliance({ filters }: CareComplianceProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Medication Adherence"
          value="96.8%"
          change={{
            value: "+1.2%",
            type: "positive",
            period: "vs last month"
          }}
          subtitle="On-time administration"
          clickable={true}
          onClick={() => navigate("/metric/medication-adherence")}
          calculation="Percentage of medications administered within prescribed timeframes. Includes scheduled and PRN medications."
          whyMatters="Medication adherence is critical for resident safety and regulatory compliance. Poor adherence leads to adverse health outcomes and potential liability issues."
        />
        
        <KPICard
          title="Care Plan Compliance"
          value="94.2%"
          change={{
            value: "+1.1%",
            type: "positive",
            period: "vs last quarter"
          }}
          subtitle="Tasks completed on time"
          clickable={true}
          onClick={() => navigate("/metric/care-plan-compliance")}
          calculation="Percentage of care tasks completed within required timeframes. Includes care plan updates, assessments, and interventions."
          whyMatters="Care plan compliance ensures residents receive consistent, quality care according to their individual needs. Non-compliance increases care risks and regulatory violations."
        />
        
        <KPICard
          title="Incident Report Rate"
          value="2.4"
          change={{
            value: "-0.8",
            type: "positive",
            period: "per 100 residents"
          }}
          subtitle="Monthly incidents"
          clickable={true}
          onClick={() => navigate("/metric/incident-report-rate")}
          calculation="Number of reportable care incidents per 100 residents per month. Includes falls, medication errors, and safety events."
          whyMatters="Lower incident rates indicate better safety protocols and quality of care. This metric directly impacts insurance costs, regulatory compliance, and family confidence."
        />
        
        <KPICard
          title="Staff Time per Resident"
          value="4.2 hrs"
          change={{
            value: "+0.3",
            type: "neutral",
            period: "daily average"
          }}
          subtitle="Direct care hours"
          clickable={true}
          onClick={() => navigate("/metric/staff-time-per-resident")}
          calculation="Average direct care hours per resident per day. Includes nursing, therapy, and personal care activities."
          whyMatters="Adequate staffing levels ensure quality care delivery and resident safety. This metric helps optimize labor costs while maintaining care standards."
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Acuity & Incident Trends"
          description="6-month care complexity and safety metrics"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={acuityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="acuity"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                name="Acuity Index"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="incidents"
                stroke="hsl(var(--chart-3))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                name="Incident Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Care Task Compliance"
          description="Completion rates vs targets"
        >
          <div className="space-y-4">
            {complianceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.task}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.completion}% / {item.target}%
                    </span>
                    <Badge 
                      variant={item.completion >= item.target ? "default" : "secondary"}
                      className={item.completion >= item.target ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}
                    >
                      {item.completion >= item.target ? 'On Target' : 'Below Target'}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={item.completion} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Incident Analysis */}
      <ChartContainer
        title="Incident Rate Analysis"
        description="Safety incidents per 100 residents by type"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incidentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value, name) => [
                name === 'rate' ? `${value} per 100 residents` : `${value} incidents`,
                name === 'rate' ? 'Rate' : 'Count'
              ]}
            />
            <Bar 
              dataKey="rate" 
              radius={[4, 4, 0, 0]}
              fill="hsl(var(--chart-1))"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* High-Risk Residents */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle>High-Risk Resident Alerts</CardTitle>
            </div>
            <button 
              onClick={() => navigate("/alert/care-compliance")}
              className="text-primary hover:text-primary/80 font-medium text-sm transition-fast"
            >
              View All Details
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resident</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Acuity</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Compliance</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk Level</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Community</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {residentAlerts.map((resident, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-fast">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{resident.name}</div>
                        <div className="text-sm text-muted-foreground">{resident.id}</div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Activity className="h-4 w-4 text-warning" />
                        {resident.acuity}
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`font-medium ${
                        resident.compliance >= 85 ? 'text-success' :
                        resident.compliance >= 80 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {resident.compliance}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge 
                        variant="secondary"
                        className={`${
                          resident.risk === 'High' ? "bg-destructive/20 text-destructive" :
                          resident.risk === 'Medium' ? "bg-warning/20 text-warning" :
                          "bg-success/20 text-success"
                        }`}
                      >
                        {resident.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{resident.community}</td>
                    <td className="text-center py-3 px-4">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm transition-fast">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}