import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { IntegrationData } from "../IntegrationSetupModal";

interface FieldMappingStepProps {
  data: IntegrationData;
  onUpdate: (data: IntegrationData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Standard resident data structure
const CANONICAL_FIELDS = [
  { id: "residentId", name: "Resident ID", required: true, type: "string" },
  { id: "firstName", name: "First Name", required: true, type: "string" },
  { id: "lastName", name: "Last Name", required: true, type: "string" },
  { id: "dateOfBirth", name: "Date of Birth", required: false, type: "date" },
  { id: "moveInDate", name: "Move-In Date", required: true, type: "date" },
  { id: "moveOutDate", name: "Move-Out Date", required: false, type: "date" },
  { id: "careLevel", name: "Care Level", required: true, type: "string" },
  { id: "unit", name: "Unit/Room", required: true, type: "string" },
  { id: "monthlyRate", name: "Monthly Rate", required: false, type: "number" },
  { id: "emergencyContact", name: "Emergency Contact", required: false, type: "string" },
  { id: "phoneNumber", name: "Phone Number", required: false, type: "string" },
  { id: "email", name: "Email", required: false, type: "string" }
];

// Sample source fields (would come from API in real implementation)
const SAMPLE_SOURCE_FIELDS = [
  "resident_id", "customer_id", "tenant_id",
  "first_name", "fname", "given_name",
  "last_name", "lname", "surname", "family_name",
  "birth_date", "dob", "date_of_birth",
  "admission_date", "start_date", "lease_start",
  "discharge_date", "end_date", "lease_end",
  "level_of_care", "care_type", "service_level",
  "room_number", "unit_number", "apartment",
  "monthly_charge", "rent", "base_rate",
  "emergency_contact_name", "next_of_kin",
  "phone", "primary_phone", "mobile",
  "email_address", "primary_email"
];

// Predefined templates for common systems
const FIELD_TEMPLATES = {
  yardi: {
    name: "Yardi Voyager",
    mappings: {
      residentId: "tenant_id",
      firstName: "first_name",
      lastName: "last_name",
      dateOfBirth: "birth_date",
      moveInDate: "lease_start",
      moveOutDate: "lease_end",
      careLevel: "service_level",
      unit: "unit_number",
      monthlyRate: "rent",
      phoneNumber: "primary_phone",
      email: "email_address"
    }
  },
  pcc: {
    name: "PointClickCare",
    mappings: {
      residentId: "resident_id",
      firstName: "given_name",
      lastName: "family_name",
      dateOfBirth: "dob",
      moveInDate: "admission_date",
      moveOutDate: "discharge_date",
      careLevel: "level_of_care",
      unit: "room_number",
      emergencyContact: "next_of_kin",
      phoneNumber: "phone",
      email: "primary_email"
    }
  },
  matrixcare: {
    name: "MatrixCare",
    mappings: {
      residentId: "customer_id",
      firstName: "fname",
      lastName: "lname",
      dateOfBirth: "date_of_birth",
      moveInDate: "start_date",
      moveOutDate: "end_date",
      careLevel: "care_type",
      unit: "apartment",
      monthlyRate: "base_rate",
      emergencyContact: "emergency_contact_name",
      phoneNumber: "mobile"
    }
  }
};

export function FieldMappingStep({ data, onUpdate, onNext, onPrevious }: FieldMappingStepProps) {
  const [fieldMappings, setFieldMappings] = useState(data.fieldMappings);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleFieldMapping = (canonicalField: string, sourceField: string) => {
    setFieldMappings(prev => {
      if (sourceField === "no-mapping") {
        // Remove the mapping if "no-mapping" is selected
        const { [canonicalField]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [canonicalField]: sourceField
      };
    });
  };

  const applyTemplate = (templateKey: string) => {
    const template = FIELD_TEMPLATES[templateKey as keyof typeof FIELD_TEMPLATES];
    if (template) {
      setFieldMappings(template.mappings);
      setSelectedTemplate(templateKey);
    }
  };

  const handleNext = () => {
    onUpdate({
      ...data,
      fieldMappings
    });
    onNext();
  };

  const requiredFieldsMapped = CANONICAL_FIELDS
    .filter(field => field.required)
    .every(field => fieldMappings[field.id]);

  const mappedCount = Object.keys(fieldMappings).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Field Mapping</h3>
        <p className="text-muted-foreground mb-4">
          Map fields from your {data.systemName} to our standard resident data structure.
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Quick Templates</TabsTrigger>
          <TabsTrigger value="manual">Manual Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Choose a Template</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(FIELD_TEMPLATES).map(([key, template]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedTemplate === key ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => applyTemplate(key)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Pre-configured field mappings for {template.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Maps {Object.keys(template.mappings).length} fields automatically
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Manual Field Mapping</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Map each field individually for maximum control.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Field Mappings</CardTitle>
            <Badge variant="secondary">
              {mappedCount} of {CANONICAL_FIELDS.length} fields mapped
            </Badge>
          </div>
          <CardDescription>
            Required fields are marked with an asterisk (*)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {CANONICAL_FIELDS.map((field) => (
              <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {field.name}
                      {field.required && <span className="text-red-500">*</span>}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                </div>
                
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                
                <div className="flex-1">
                  <Select
                    value={fieldMappings[field.id] || "no-mapping"}
                    onValueChange={(value) => handleFieldMapping(field.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select source field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-mapping">No mapping</SelectItem>
                      {SAMPLE_SOURCE_FIELDS.map((sourceField) => (
                        <SelectItem key={sourceField} value={sourceField}>
                          {sourceField}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-6">
                  {fieldMappings[field.id] && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {field.required && !fieldMappings[field.id] && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!requiredFieldsMapped}
        >
          Continue to Testing
        </Button>
      </div>
    </div>
  );
}