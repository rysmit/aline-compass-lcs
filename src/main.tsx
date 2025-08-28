import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { StarterModeProvider } from "@/contexts/StarterModeContext";
import { CalculationMethodProvider } from "@/contexts/CalculationMethodContext";
import { ReportBuilderProvider } from "@/contexts/ReportBuilderContext";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <StarterModeProvider>
              <CalculationMethodProvider>
                <ReportBuilderProvider>
                  <App />
                  <Toaster />
                  <Sonner />
                </ReportBuilderProvider>
              </CalculationMethodProvider>
            </StarterModeProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
