import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Compass, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  Database, 
  Settings, 
  BarChart3, 
  Heart, 
  DollarSign, 
  Shield, 
  Brain, 
  HelpCircle, 
  ArrowRight,
  Home,
  Building2,
  Activity,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CompassCopilot } from "@/components/ai/CompassCopilot";

interface SetupItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  action?: string;
  route?: string;
}

interface ReportTile {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  route?: string;
}

const setupItems: SetupItem[] = [
  {
    id: "user-roles",
    title: "User roles and access configured",
    description: "Set up team member permissions and access levels",
    status: "completed",
    action: "Manage Users",
    route: "/admin/settings"
  },
  {
    id: "integrations",
    title: "Integrations connected",
    description: "Connect your CRM, PMS, and care systems",
    status: "in-progress", 
    action: "Go to Connectors",
    route: "/admin/settings"
  },
  {
    id: "source-mapping",
    title: "Source mapping complete",
    description: "Map care levels and billing data sources",
    status: "pending",
    action: "Configure Mapping"
  },
  {
    id: "schema-review",
    title: "Schema Explorer reviewed",
    description: "Review data model and field definitions",
    status: "pending",
    action: "Open Schema Explorer",
    route: "/schema-explorer"
  }
];

const reportTiles: ReportTile[] = [
  {
    id: "resident-lifecycle",
    title: "Resident Lifecycle Overview",
    description: "Track resident journey from inquiry to move-out",
    icon: Users,
    category: "Operations",
    route: "/dashboard"
  },
  {
    id: "census-occupancy",
    title: "Census & Occupancy Trends",
    description: "Monitor occupancy rates and census changes",
    icon: Building2,
    category: "Operations",
    route: "/dashboard"
  },
  {
    id: "staffing-time",
    title: "Staffing & Time Allocation",
    description: "Analyze staff productivity and time management",
    icon: Clock,
    category: "Operations"
  },
  {
    id: "financial-health",
    title: "Financial Health Snapshot",
    description: "Revenue, expenses, and financial KPIs at a glance",
    icon: DollarSign,
    category: "Financial",
    route: "/dashboard"
  },
  {
    id: "risk-compliance",
    title: "Risk & Compliance Alerts",
    description: "Monitor compliance issues and operational risks",
    icon: Shield,
    category: "Compliance",
    route: "/dashboard"
  }
];

const insightExamples = [
  "Which communities are underperforming vs peer average?",
  "Show residents receiving increased care hours with no change in billing.",
  "Identify communities with highest churn risk this quarter.",
  "What are the top factors driving occupancy variance?"
];

const faqs = [
  {
    question: "How do I connect external systems?",
    answer: "Use the Connectors panel in Admin Settings to set up integrations with your CRM, PMS, and care systems. Each connector includes step-by-step setup instructions and authentication."
  },
  {
    question: "What data does Compass pull in?",
    answer: "Compass integrates resident data, care records, financial information, census data, sales pipeline, and operational metrics from your connected systems to provide a unified view."
  },
  {
    question: "How do I create or schedule a custom report?",
    answer: "Navigate to any dashboard section and use the 'Schedule Report' feature in Quick Actions. You can customize filters, set delivery frequency, and choose recipients."
  },
  {
    question: "Can I customize the dashboard for different roles?",
    answer: "Yes, Compass includes role-based permissions that show relevant data and features based on your assigned role (Executive, Community Manager, Care Director, etc.)."
  },
  {
    question: "What is Compass Gold and who is it for?",
    answer: "Compass Gold is an enterprise-grade feature that provides direct access to the validated data model used by Compass. It's ideal for operators who want to connect Compass data to their own BI tools or reporting environments."
  }
];

export function AboutCompass() {
  const navigate = useNavigate();
  const [completedSetup, setCompletedSetup] = useState(1);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const setupProgress = (completedSetup / setupItems.length) * 100;

  const getStatusIcon = (status: SetupItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleSetupAction = (item: SetupItem) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-card sticky top-0 z-50">
        <div className="aline-page-margin py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">About Compass</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aline-page-margin py-8 space-y-8 max-w-6xl mx-auto">
        {/* Section 1: What is Compass? */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              What is Compass?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              Compass is your centralized dashboard for executive and operational insights across the full resident lifecycle — combining data from Aline applications and connected third-party systems.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Unified Data View</h4>
                  <p className="text-sm text-muted-foreground">
                    Resident, care, financial, and sales data in one place
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg mt-1">
                  <Settings className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Built-in Integrations</h4>
                  <p className="text-sm text-muted-foreground">
                    CRM, Financial, Care, PMS, and more systems connected
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg mt-1">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Role-Based Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    Configurable dashboards tailored to your role
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Configure Your Environment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Settings className="h-6 w-6 text-accent" />
              </div>
              Configure Your Environment
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Setup Progress</span>
                <span className="font-medium">{completedSetup} of {setupItems.length} completed</span>
              </div>
              <Progress value={setupProgress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.action && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetupAction(item)}
                      disabled={item.status === "completed"}
                    >
                      {item.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Button variant="outline" onClick={() => navigate('/admin/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Go to Connectors
              </Button>
              <Button variant="outline" onClick={() => navigate('/schema-explorer')}>
                <Database className="h-4 w-4 mr-2" />
                Open Schema Explorer
              </Button>
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                View Integration Health
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Explore Key Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              Explore Key Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTiles.map((report) => (
                <Card key={report.id} className="hover:shadow-card-hover transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-muted/20 rounded-lg">
                        <report.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => report.route ? navigate(report.route) : undefined}
                      disabled={!report.route}
                    >
                      View Report
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Compass Copilot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              Compass Copilot
              <Badge variant="secondary" className="ml-2">AI-Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Compass uses domain-aware AI to surface risks, trends, and recommendations based on your operational data.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-medium">Example insight prompts:</h4>
              {insightExamples.map((example, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm italic">"{example}"</p>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="mt-4">
                <Brain className="h-4 w-4 mr-2" />
                Try Compass Copilot
              </Button>
              <p className="text-sm text-muted-foreground">
                Click the AI assistant button in the bottom-right corner
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Compass Gold */}
        <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-yellow-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg">
                <Database className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span>Compass Gold</span>
                <span className="text-sm font-normal text-muted-foreground">Enterprise-Grade Data Access</span>
              </div>
              <Badge variant="outline" className="ml-2 border-amber-300 text-amber-700 bg-amber-50">Enterprise</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              For enterprise operators and advanced users, Compass Gold unlocks direct access to the full, validated data model powering Compass. This export-ready schema joins data from CRM, Billing, Staffing, and Care platforms—giving you the freedom to analyze, automate, and integrate across your business systems.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-medium">Key Features:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Access to all normalized tables behind Compass dashboards</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Built for Power BI, Snowflake, API exports, or CSV</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Includes documentation, governance support, and secure setup</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
              onClick={() => navigate('/compass-gold')}
            >
              🔓 Explore Compass Gold
            </Button>
          </CardContent>
        </Card>

        {/* Section 6: Need Help? */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* FAQs */}
            <div>
              <h4 className="font-semibold mb-4">Frequently Asked Questions</h4>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.question === "What is Compass Gold and who is it for?" ? (
                        <span>
                          {faq.answer}{" "}
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary underline"
                            onClick={() => navigate('/compass-gold')}
                          >
                            Learn more →
                          </Button>
                        </span>
                      ) : (
                        faq.answer
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-4">Get Additional Support</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Visit Help Center</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span>Contact Support</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Submit Integration Request</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Compass Copilot Component */}
      <CompassCopilot currentTab="about" filters={{}} />
    </div>
  );
}