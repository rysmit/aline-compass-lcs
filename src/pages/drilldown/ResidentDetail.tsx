import { useParams } from "react-router-dom";
import { DrillDownBreadcrumb } from "@/components/navigation/DrillDownBreadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecordStitchingBanner } from "@/components/data-lineage/RecordStitchingBanner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Heart, 
  AlertTriangle,
  TrendingDown,
  Clock,
  Phone,
  Mail
} from "lucide-react";

// Mock resident data
const residentData = {
  1: {
    name: "Robert Thompson",
    unit: "A-205",
    careLevel: "Independent Living",
    moveInDate: "2022-03-15",
    age: 78,
    riskScore: 85,
    monthlyRate: 4250,
    emergencyContact: {
      name: "Jennifer Thompson",
      relationship: "Daughter",
      phone: "(555) 123-4567",
      email: "jennifer.thompson@email.com"
    },
    riskFactors: [
      { factor: "Recent Health Decline", weight: 35, severity: "high" },
      { factor: "Social Isolation", weight: 25, severity: "medium" },
      { factor: "Financial Concerns", weight: 15, severity: "low" },
      { factor: "Family Dissatisfaction", weight: 10, severity: "medium" }
    ],
    recentActivity: [
      { date: "2024-01-15", type: "Health Incident", description: "Minor fall in unit, no injuries" },
      { date: "2024-01-10", type: "Family Visit", description: "Daughter visited, expressed concerns about care" },
      { date: "2024-01-05", type: "Payment", description: "Monthly payment received" },
      { date: "2023-12-28", type: "Care Plan Update", description: "Increased assistance with medication management" }
    ]
  }
};

export function ResidentDetail() {
  const { regionId, communityId, residentId } = useParams<{ 
    regionId: string; 
    communityId: string; 
    residentId: string; 
  }>();
  
  const systemRecords = [
    { systemName: 'CRM', id: 'CRM-2847', label: 'CRM ID' },
    { systemName: 'ECP', id: 'ECP-9384', label: 'ECP ID' },
    { systemName: 'Vitals', id: 'VTL-1923', label: 'Vitals ID' }
  ];
  
  const resident = residentData[parseInt(residentId || "1") as keyof typeof residentData];
  
  if (!resident) {
    return <div>Resident not found</div>;
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Northeast Region", href: `/region/${regionId}` },
    { label: "Sunrise Manor", href: `/region/${regionId}/community/${communityId}` },
    { label: resident.name }
  ];

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive";
      case "medium": return "text-yellow-600";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DrillDownBreadcrumb items={breadcrumbItems} />
      
      <div className="p-6 space-y-6">
        <RecordStitchingBanner records={systemRecords} />
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {resident.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Unit {resident.unit}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Move-in: {new Date(resident.moveInDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Age {resident.age}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="destructive" className="text-lg px-3 py-1">
              Risk Score: {resident.riskScore}%
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">High Risk</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Care Level</p>
                  <p className="font-medium">{resident.careLevel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Rate</p>
                  <p className="font-medium">${resident.monthlyRate.toLocaleString()}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Emergency Contact
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">{resident.emergencyContact.name}</p>
                    <p className="text-muted-foreground">{resident.emergencyContact.relationship}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {resident.emergencyContact.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {resident.emergencyContact.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resident.riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.factor}</span>
                    <Badge variant={getRiskBadgeVariant(factor.severity)}>
                      {factor.weight}%
                    </Badge>
                  </div>
                  <Progress value={factor.weight} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                Schedule Intervention
              </Button>
              <Button className="w-full" variant="outline">
                Contact Family
              </Button>
              <Button className="w-full" variant="outline">
                Update Care Plan
              </Button>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => window.open('#', '_blank')}
              >
                Open in EHR System →
              </Button>
              
              <Separator />
              
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Payment:</span>
                  <span>Jan 5, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next Review:</span>
                  <span>Feb 15, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resident.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg border border-border/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{activity.type}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(activity.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}