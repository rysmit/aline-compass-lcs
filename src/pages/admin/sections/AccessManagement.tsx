import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { mockUsers } from "@/contexts/AuthContext";
import { AccessControlConfig, ACCESS_TEMPLATES, DATA_CATEGORIES, MOCK_COMMUNITIES } from "@/types/accessControl";
import { Users, Edit, Shield, Search, Filter, Save, FileText as Template } from "lucide-react";

interface AccessEditModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AccessControlConfig) => void;
}

function AccessEditModal({ user, isOpen, onClose, onSave }: AccessEditModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [searchCommunities, setSearchCommunities] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedOperator, setSelectedOperator] = useState<string>("all");
  
  // Access configuration state
  const [communityAccess, setCommunityAccess] = useState<string[]>([]);
  const [dataCategories, setDataCategories] = useState({
    occupancyMoveIns: false,
    financials: false,
    salesFunnel: false,
    staffing: false,
    careOutcomes: false,
    alertsCompliance: false
  });
  const [metricAccess, setMetricAccess] = useState<Record<string, boolean>>({});

  // Filter communities based on search and filters
  const filteredCommunities = MOCK_COMMUNITIES.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchCommunities.toLowerCase());
    const matchesRegion = selectedRegion === "all" || community.region === selectedRegion;
    const matchesOperator = selectedOperator === "all" || community.operator === selectedOperator;
    return matchesSearch && matchesRegion && matchesOperator;
  });

  const regions = [...new Set(MOCK_COMMUNITIES.map(c => c.region))];
  const operators = [...new Set(MOCK_COMMUNITIES.map(c => c.operator))];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = ACCESS_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCommunityAccess(template.config.communityAccess);
      setDataCategories(template.config.dataCategories);
      setMetricAccess(template.config.metricAccess);
    }
  };

  const handleCommunityToggle = (communityId: string) => {
    setCommunityAccess(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  const handleCategoryToggle = (category: string, enabled: boolean) => {
    setDataCategories(prev => ({ ...prev, [category]: enabled }));
    
  // Auto-toggle all metrics in category
    const categoryData = DATA_CATEGORIES[category as keyof typeof DATA_CATEGORIES];
    if (categoryData) {
      const newMetricAccess = { ...metricAccess };
      categoryData.metrics.forEach(metric => {
        newMetricAccess[metric.id] = enabled;
      });
      setMetricAccess(newMetricAccess);
    }
  };

  const handleMetricToggle = (metricId: string, enabled: boolean) => {
    setMetricAccess(prev => ({ ...prev, [metricId]: enabled }));
  };

  const handleSave = () => {
    const config: AccessControlConfig = {
      communityAccess,
      dataCategories,
      metricAccess
    };
    onSave(config);
    onClose();
  };

  const selectAllCommunities = () => {
    setCommunityAccess(filteredCommunities.map(c => c.id));
  };

  const clearAllCommunities = () => {
    setCommunityAccess([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Access for {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Template className="w-5 h-5" />
                Access Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_TEMPLATES.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Community Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" />
                Community Access (Row-Level)
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{communityAccess.length} of {MOCK_COMMUNITIES.length} communities selected</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search">Search Communities</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name..."
                      value={searchCommunities}
                      onChange={(e) => setSearchCommunities(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Operator</Label>
                  <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Operators</SelectItem>
                      {operators.map(operator => (
                        <SelectItem key={operator} value={operator}>{operator}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllCommunities}>
                  Select All Filtered
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllCommunities}>
                  Clear All
                </Button>
              </div>

              {/* Communities List */}
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                <div className="space-y-2">
                  {filteredCommunities.map(community => (
                    <div key={community.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                      <Checkbox
                        checked={communityAccess.includes(community.id)}
                        onCheckedChange={() => handleCommunityToggle(community.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{community.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {community.operator} • {community.region} • {community.state}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Category Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Data Category Access (Column-Level)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(DATA_CATEGORIES).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={dataCategories[categoryKey as keyof typeof dataCategories]}
                        onCheckedChange={(checked) => handleCategoryToggle(categoryKey, !!checked)}
                      />
                      <Label className="text-base font-medium">{category.label}</Label>
                    </div>
                    
                    {/* Metric-Level Access */}
                    {dataCategories[categoryKey as keyof typeof dataCategories] && (
                      <div className="ml-6 space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Individual Metrics:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {category.metrics.map(metric => (
                            <div key={metric.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={metricAccess[metric.id] || false}
                                onCheckedChange={(checked) => handleMetricToggle(metric.id, !!checked)}
                              />
                              <Label className="text-sm">{metric.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Access Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AccessManagement() {
  const [editingUser, setEditingUser] = useState<any>(null);

  // Get REIT/Investor users
  const reitUsers = Object.values(mockUsers).filter(user => user.role === 'reit-investor');

  const handleSaveAccess = (config: AccessControlConfig) => {
    console.log('Saving access config for user:', editingUser.id, config);
    // In a real app, this would save to backend
  };

  const getAccessSummary = (userId: string) => {
    // Mock access summary based on user
    if (userId === '7') {
      return {
        communities: "10 of 28",
        categories: "2 of 6",
        template: "Custom"
      };
    }
    return {
      communities: "0 of 28",
      categories: "0 of 6", 
      template: "None"
    };
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Access Management</h2>
        <p className="text-muted-foreground">
          Configure community and data access for REIT/Investor users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            REIT/Investor Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Portfolio Name</TableHead>
                <TableHead>Assigned Communities</TableHead>
                <TableHead>Data Access Summary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reitUsers.map((user) => {
                const summary = getAccessSummary(user.id);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Investor</Badge>
                    </TableCell>
                    <TableCell>Premium REIT Portfolio</TableCell>
                    <TableCell>
                      <Badge variant="outline">{summary.communities} communities</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {summary.categories} categories
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Template: {summary.template}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Access
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Access Templates Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Template className="w-5 h-5" />
            Available Access Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACCESS_TEMPLATES.map(template => (
              <Card key={template.id} className="border-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Categories: </span>
                      {Object.entries(template.config.dataCategories)
                        .filter(([_, enabled]) => enabled)
                        .length} enabled
                    </div>
                    <div>
                      <span className="font-medium">Metrics: </span>
                      {Object.values(template.config.metricAccess).filter(Boolean).length} enabled
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Access Modal */}
      {editingUser && (
        <AccessEditModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveAccess}
        />
      )}
    </div>
  );
}