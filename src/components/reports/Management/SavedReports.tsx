import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { 
  Search, 
  Plus, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  Share, 
  Copy,
  Calendar,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SavedReports() {
  const { 
    savedReports, 
    templates, 
    loadReport, 
    deleteReport, 
    createReport,
    setIsViewMode,
    setIsBuilderMode
  } = useReportBuilder();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports');

  const currentItems = activeTab === 'reports' ? savedReports : templates;
  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateReport = () => {
    const name = `Report ${savedReports.length + 1}`;
    createReport(name, 'New custom report');
    navigate('/data-explorer');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Reports</h2>
          <p className="text-muted-foreground">
            Create, manage, and share your custom reports
          </p>
        </div>
        <Button onClick={handleCreateReport}>
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'reports' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reports')}
          >
            My Reports ({savedReports.length})
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'default' : 'outline'}
            onClick={() => setActiveTab('templates')}
          >
            Templates ({templates.length})
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base line-clamp-1">
                    {item.name}
                  </CardTitle>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {item.isTemplate && (
                    <Badge variant="secondary" className="text-xs">
                      Template
                    </Badge>
                  )}
                  {item.permissions.isPublic && (
                    <Badge variant="outline" className="text-xs">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.createdBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(item.lastModified, { addSuffix: true })}
                  </div>
                </div>

                {/* Component Count */}
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="h-3 w-3" />
                  <span>{item.layout.components.length} components</span>
                </div>

                {/* Mini Preview */}
                {item.layout.components.length > 0 && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                    <div className="grid grid-cols-3 gap-1">
                      {item.layout.components.slice(0, 6).map((comp) => (
                        <div 
                          key={comp.id}
                          className="h-4 rounded bg-primary/20 flex items-center justify-center"
                          title={comp.config.title || comp.type}
                        >
                          <span className="text-[8px] font-medium text-primary/70">
                            {comp.type === 'chart' ? 'CH' : 
                             comp.type === 'kpi' ? 'KPI' : 
                             comp.type === 'table' ? 'TBL' : 'TXT'}
                          </span>
                        </div>
                      ))}
                      {item.layout.components.length > 6 && (
                        <div className="h-4 rounded bg-muted flex items-center justify-center">
                          <span className="text-[8px] text-muted-foreground">+{item.layout.components.length - 6}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        loadReport(item.id);
                        setIsViewMode(true);
                        setIsBuilderMode(false);
                        navigate('/data-explorer?tab=reports&mode=view');
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {!item.isTemplate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          loadReport(item.id);
                          navigate('/data-explorer?tab=reports&mode=edit');
                        }}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost">
                      <Share className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-3 w-3" />
                    </Button>
                    {!item.isTemplate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReport(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'No reports found' : `No ${activeTab} yet`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : activeTab === 'reports' 
                  ? 'Create your first custom report to get started'
                  : 'No templates available at this time'
              }
            </p>
            {!searchTerm && activeTab === 'reports' && (
              <Button onClick={handleCreateReport}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Report
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}