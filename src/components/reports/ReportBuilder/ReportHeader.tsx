import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReportBuilder } from '@/contexts/ReportBuilderContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Save, Eye, Settings, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ReportHeader() {
  const {
    currentReport,
    saveReport,
    isBuilderMode,
    setIsBuilderMode,
    updateReportDetails
  } = useReportBuilder();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentReport?.name || '');
  const [tempDescription, setTempDescription] = useState(currentReport?.description || '');
  const { toast } = useToast();

  const debouncedName = useDebounce(tempName, 500);
  const debouncedDescription = useDebounce(tempDescription, 500);

  // Update report details when debounced values change
  useState(() => {
    if (currentReport && (debouncedName !== currentReport.name || debouncedDescription !== currentReport.description)) {
      updateReportDetails(debouncedName, debouncedDescription);
    }
  });

  const handleSaveReport = () => {
    saveReport();
    toast({
      title: "Report Saved",
      description: "Your report has been saved successfully.",
    });
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      updateReportDetails(tempName, tempDescription);
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
      setTempName(currentReport?.name || '');
    }
  };

  const handleCancelEdit = () => {
    setTempName(currentReport?.name || '');
    setIsEditingName(false);
  };

  if (!currentReport) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex-1 min-w-0">
        {isEditingName ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-lg font-semibold"
                placeholder="Report name"
                autoFocus
              />
              <Button size="sm" onClick={handleNameEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              placeholder="Report description (optional)"
              className="text-sm"
            />
          </div>
        ) : (
          <div className="group cursor-pointer" onClick={handleNameEdit}>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold truncate">
                {currentReport.name}
              </h3>
              <Edit2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {currentReport.description && (
              <p className="text-sm text-muted-foreground truncate">
                {currentReport.description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsBuilderMode(!isBuilderMode)}
        >
          {isBuilderMode ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
        <Button onClick={handleSaveReport} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Report
        </Button>
      </div>
    </div>
  );
}