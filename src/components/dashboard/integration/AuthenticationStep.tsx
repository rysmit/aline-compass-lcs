import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Key, Server, User } from "lucide-react";
import { IntegrationData } from "../IntegrationSetupModal";

interface AuthenticationStepProps {
  data: IntegrationData;
  onUpdate: (data: IntegrationData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AUTH_METHODS = {
  apiKey: {
    name: "API Key",
    description: "Connect using an API key or token",
    fields: ["apiKey", "serverUrl"]
  },
  credentials: {
    name: "Username & Password",
    description: "Connect using login credentials",
    fields: ["username", "password", "serverUrl"]
  },
  oauth: {
    name: "OAuth 2.0",
    description: "Secure OAuth authentication",
    fields: ["clientId", "clientSecret", "serverUrl"]
  }
};

export function AuthenticationStep({ data, onUpdate, onNext, onPrevious }: AuthenticationStepProps) {
  const [authMethod, setAuthMethod] = useState("apiKey");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState(data.credentials);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingConnection(false);
    // For demo purposes, assume success
  };

  const handleNext = () => {
    onUpdate({
      ...data,
      credentials
    });
    onNext();
  };

  const isFormValid = () => {
    const method = AUTH_METHODS[authMethod as keyof typeof AUTH_METHODS];
    return method.fields.every(field => {
      if (field === "serverUrl") return true; // Optional for some systems
      return credentials[field as keyof typeof credentials];
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Authentication Setup</h3>
        <p className="text-muted-foreground mb-4">
          Configure how to connect to your {data.systemName} system.
        </p>
      </div>

      <Tabs value={authMethod} onValueChange={setAuthMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apiKey" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Key
          </TabsTrigger>
          <TabsTrigger value="credentials" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Username/Password
          </TabsTrigger>
          <TabsTrigger value="oauth" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            OAuth 2.0
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apiKey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Key Authentication</CardTitle>
              <CardDescription>
                Enter your API key to connect to the system securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={credentials.apiKey || ""}
                  onChange={(e) => handleCredentialChange("apiKey", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serverUrl">Server URL (Optional)</Label>
                <Input
                  id="serverUrl"
                  placeholder="https://api.example.com"
                  value={credentials.serverUrl || ""}
                  onChange={(e) => handleCredentialChange("serverUrl", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Username & Password</CardTitle>
              <CardDescription>
                Use your login credentials to connect to the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={credentials.username || ""}
                  onChange={(e) => handleCredentialChange("username", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password || ""}
                    onChange={(e) => handleCredentialChange("password", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="serverUrl">Server URL (Optional)</Label>
                <Input
                  id="serverUrl"
                  placeholder="https://server.example.com"
                  value={credentials.serverUrl || ""}
                  onChange={(e) => handleCredentialChange("serverUrl", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">OAuth 2.0 Configuration</CardTitle>
              <CardDescription>
                Configure OAuth settings for secure authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientId">Client ID *</Label>
                <Input
                  id="clientId"
                  placeholder="Enter your OAuth Client ID"
                  value={credentials.clientId || ""}
                  onChange={(e) => handleCredentialChange("clientId", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientSecret">Client Secret *</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Enter your OAuth Client Secret"
                  value={credentials.clientSecret || ""}
                  onChange={(e) => handleCredentialChange("clientSecret", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serverUrl">Authorization Server URL</Label>
                <Input
                  id="serverUrl"
                  placeholder="https://auth.example.com"
                  value={credentials.serverUrl || ""}
                  onChange={(e) => handleCredentialChange("serverUrl", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isFormValid() && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <Button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="w-full"
              variant="outline"
            >
              {isTestingConnection ? "Testing Connection..." : "Test Connection"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}