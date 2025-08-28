import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, CreditCard, Heart, Activity, Users, Database, ExternalLink, CheckCircle, Lock, AlertTriangle, Clock, Star, FileText, Calendar, HelpCircle, Compass, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
interface AppTile {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: "aline" | "external";
  status: "connected" | "not-connected" | "needs-config";
  lastSync?: string;
  url?: string;
}
const appTiles: AppTile[] = [{
  id: "aline-crm",
  name: "Aline CRM",
  description: "Customer relationship management",
  icon: Users,
  category: "aline",
  status: "connected",
  lastSync: "5 minutes ago"
}, {
  id: "pointclickcare",
  name: "PointClickCare",
  description: "Healthcare management platform",
  icon: Heart,
  category: "external",
  status: "connected",
  lastSync: "15 minutes ago"
}, {
  id: "lcs-inventory",
  name: "LCS Inventory Management",
  description: "Inventory management",
  icon: Building2,
  category: "external",
  status: "connected",
  lastSync: "1 hour ago"
}, {
  id: "yardi",
  name: "Yardi",
  description: "Property management system",
  icon: Building2,
  category: "external",
  status: "connected",
  lastSync: "3 minutes ago"
}];
const recentlyViewed = [{
  name: "Monthly Revenue Report",
  type: "report",
  lastViewed: "2 hours ago"
}, {
  name: "Occupancy Forecast",
  type: "report",
  lastViewed: "Yesterday"
}, {
  name: "Care Compliance Dashboard",
  type: "dashboard",
  lastViewed: "2 days ago"
}];
const pinnedReports = [{
  name: "Executive Summary",
  type: "report"
}, {
  name: "Weekly KPIs",
  type: "report"
}, {
  name: "Risk Analysis",
  type: "report"
}];
export function CompassLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApps, setFilteredApps] = useState(appTiles);
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    const filtered = appTiles.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.description.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredApps(filtered);
  }, [searchQuery]);
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);
  const handleAppClick = (app: AppTile) => {
    if (app.status === "not-connected") {
      // Handle request access
      console.log(`Requesting access to ${app.name}`);
      return;
    }
    if (app.status === "needs-config") {
      // Handle configuration
      console.log(`Configuring ${app.name}`);
      return;
    }
    if (app.url) {
      navigate(app.url);
    } else {
      // Open external link in new tab
      window.open(`https://${app.id}.example.com`, '_blank');
    }
  };
  const getStatusIcon = (status: AppTile["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "not-connected":
        return <Lock className="h-4 w-4 text-muted-foreground" />;
      case "needs-config":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };
  const getStatusText = (app: AppTile) => {
    switch (app.status) {
      case "connected":
        return `Connected via OpenHub | Last synced: ${app.lastSync}`;
      case "not-connected":
        return "Not yet connected - Click to request access";
      case "needs-config":
        return "Connected but needs configuration";
    }
  };
  return <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Back to Login Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              logout();
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </div>

        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent"></div>
          
          {/* Content */}
          <div className="relative border-b border-border/50 backdrop-blur-sm">
            <div className="aline-page-margin py-12">
              <div className="text-center space-y-6 max-w-4xl mx-auto">
                {/* Logo and branding */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
                    <div className="text-2xl font-bold text-primary">ALINE</div>
                    <div className="w-px h-8 bg-border"></div>
                    <Compass className="h-8 w-8 text-accent animate-pulse" />
                  </div>
                </div>
                
                {/* Main title */}
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
                    Welcome to Compass
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Turn data into direction.</p>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button size="lg" onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                    <Activity className="h-5 w-5 mr-2" />
                    Launch Dashboard
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/about')} className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    About Compass
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="aline-page-margin py-8 space-y-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="search-input" placeholder="Search apps, reports, or resident records..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>

          {/* Compass Dashboard Callout */}
          <div className="mb-8">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Compass Dashboard</h2>
                      <p className="text-muted-foreground">Executive insights and analytics for your senior living operations</p>
                    </div>
                  </div>
                  <Button size="lg" onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90">
                    Launch Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* App Tiles Section */}
          <div className="space-y-6">
            {/* Aline Applications */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Aline Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredApps.filter(app => app.category === "aline").map(app => <Tooltip key={app.id}>
                      <TooltipTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1" onClick={() => handleAppClick(app)}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <app.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{app.name}</h3>
                                </div>
                              </div>
                              {getStatusIcon(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getStatusText(app)}</p>
                      </TooltipContent>
                    </Tooltip>)}
              </div>
            </div>

            {/* External Applications */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                External Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredApps.filter(app => app.category === "external").map(app => <Tooltip key={app.id}>
                      <TooltipTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1" onClick={() => handleAppClick(app)}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-lg">
                                  <app.icon className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{app.name}</h3>
                                </div>
                              </div>
                              {getStatusIcon(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getStatusText(app)}</p>
                      </TooltipContent>
                    </Tooltip>)}
              </div>
            </div>

            {/* Additional Tools */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-muted-foreground rounded-full"></div>
                Additional Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1" onClick={() => navigate('/data-explorer')}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted/20 rounded-lg">
                              <Database className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Data Explorer</h3>
                            </div>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">Data model and field definitions</p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connected | Real-time data</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1" onClick={() => navigate('/compass-gold')}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                              <Compass className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Compass Gold</h3>
                            </div>
                          </div>
                          <Lock className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Unified export-ready model for enterprise reporting</p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enterprise data access for BI and reporting</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Optional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recently Viewed */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recently Viewed
                </h3>
                <div className="space-y-3">
                  {recentlyViewed.map((item, index) => <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.lastViewed}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Pinned Reports */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Pinned Reports
                </h3>
                <div className="space-y-3">
                  {pinnedReports.map((report, index) => <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Data Export
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Request Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>;
}