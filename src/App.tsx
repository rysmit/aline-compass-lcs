import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { StarterModeProvider } from "./contexts/StarterModeContext";
import { CalculationMethodProvider } from "./contexts/CalculationMethodContext";
import { AccessControlProvider } from "./hooks/useAccessControl";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import { SchemaExplorer } from "./pages/SchemaExplorer";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AboutCompass } from "./pages/AboutCompass";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { RegionDashboard } from "./pages/drilldown/RegionDashboard";
import { CommunityDashboard } from "./pages/drilldown/CommunityDashboard";
import { ResidentDetail } from "./pages/drilldown/ResidentDetail";
import { CensusDetailView } from "./pages/drilldown/CensusDetailView";
import { ForecastVarianceDetail } from "./pages/alerts/ForecastVarianceDetail";
import { CareComplianceDetail } from "./pages/alerts/CareComplianceDetail";
import { RevenueAtRiskDetail as AlertRevenueAtRiskDetail } from "./pages/alerts/RevenueAtRiskDetail";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { MetricDetail } from "./pages/drilldown/MetricDetail";
import DataExplorer from "./pages/DataExplorer";
import { CompassGold } from "./pages/CompassGold";
import { AverageDailyCensusDetail } from "./pages/drilldown/AverageDailyCensusDetail";
import { ChurnRateDetail } from "./pages/drilldown/ChurnRateDetail";
import { RevenuePerUnitDetail } from "./pages/drilldown/RevenuePerUnitDetail";
import { MoveInVelocityDetail } from "./pages/drilldown/MoveInVelocityDetail";
import { ChurnRiskScoreDetail } from "./pages/drilldown/ChurnRiskScoreDetail";
import { ForecastAccuracyDetail } from "./pages/drilldown/ForecastAccuracyDetail";
import { PortfolioOccupancyRateDetail } from "./pages/drilldown/PortfolioOccupancyRateDetail";
import { AverageLengthOfStayDetail } from "./pages/drilldown/AverageLengthOfStayDetail";
import { ReadmissionRateDetail } from "./pages/drilldown/ReadmissionRateDetail";
import { CensusAverageDailyCensusDetail } from "./pages/drilldown/CensusAverageDailyCensusDetail";
import { CensusOccupancyRateDetail } from "./pages/drilldown/CensusOccupancyRateDetail";
import ConversionRateDetail from "./pages/drilldown/ConversionRateDetail";
import PipelineValueDetail from "./pages/drilldown/PipelineValueDetail";
import MonthlyInquiriesDetail from "./pages/drilldown/MonthlyInquiriesDetail";
import LeadResponseTimeDetail from "./pages/drilldown/LeadResponseTimeDetail";
import MonthlyRevenueDetail from "./pages/drilldown/MonthlyRevenueDetail";
import CollectionRateDetail from "./pages/drilldown/CollectionRateDetail";
import NOIPerUnitDetail from "./pages/drilldown/NOIPerUnitDetail";
import ARRiskDetail from "./pages/drilldown/ARRiskDetail";
import MedicationAdherenceDetail from "./pages/drilldown/MedicationAdherenceDetail";
import CarePlanComplianceDetail from "./pages/drilldown/CarePlanComplianceDetail";
import IncidentReportRateDetail from "./pages/drilldown/IncidentReportRateDetail";
import StaffTimePerResidentDetail from "./pages/drilldown/StaffTimePerResidentDetail";
import OccupancyForecastDetail from "./pages/drilldown/OccupancyForecastDetail";
import HighRiskResidentsDetail from "./pages/drilldown/HighRiskResidentsDetail";
import ProjectedOccupancyDetail from "./pages/drilldown/ProjectedOccupancyDetail";
import RevenueAtRiskDetail from "./pages/drilldown/RevenueAtRiskDetail";
import SegmentDetail from "./pages/drilldown/SegmentDetail";
import REITNOIDetail from "./pages/drilldown/REITNOIDetail";
import REITOccupancyDetail from "./pages/drilldown/REITOccupancyDetail";
import REITRevPAUDetail from "./pages/drilldown/REITRevPAUDetail";
import REITRiskAssetsDetail from "./pages/drilldown/REITRiskAssetsDetail";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StarterModeProvider>
          <CalculationMethodProvider>
            <AccessControlProvider>
              <TooltipProvider>
                <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <Index />
            </PrivateRoute>
          } />
          <Route path="/about" element={
            <PrivateRoute>
              <AboutCompass />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/data-explorer" element={
            <PrivateRoute>
              <DataExplorer />
            </PrivateRoute>
          } />
          <Route path="/compass-gold" element={
            <PrivateRoute>
              <CompassGold />
            </PrivateRoute>
          } />
          <Route path="/schema-explorer" element={
            <PrivateRoute>
              <SchemaExplorer />
            </PrivateRoute>
          } />
          <Route path="/region/:regionId" element={
            <PrivateRoute>
              <RegionDashboard />
            </PrivateRoute>
          } />
          <Route path="/region/:regionId/community/:communityId" element={
            <PrivateRoute>
              <CommunityDashboard />
            </PrivateRoute>
          } />
          <Route path="/region/:regionId/community/:communityId/resident/:residentId" element={
            <PrivateRoute>
              <ResidentDetail />
            </PrivateRoute>
          } />
          <Route path="/census-detail" element={
            <PrivateRoute>
              <CensusDetailView />
            </PrivateRoute>
          } />
          <Route path="/alert/forecast-variance" element={
            <PrivateRoute>
              <ForecastVarianceDetail />
            </PrivateRoute>
          } />
          <Route path="/alert/care-compliance" element={
            <PrivateRoute>
              <CareComplianceDetail />
            </PrivateRoute>
          } />
          <Route path="/alert/revenue-at-risk" element={
            <PrivateRoute>
              <AlertRevenueAtRiskDetail />
            </PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute>
              <AdminSettings />
            </PrivateRoute>
          } />
          <Route path="/dashboard/segment/:segmentId" element={
            <PrivateRoute>
              <SegmentDetail />
            </PrivateRoute>
          } />
          <Route path="/drilldown/community/:communityId" element={
            <PrivateRoute>
              <CommunityDashboard />
            </PrivateRoute>
          } />
          <Route path="/metric/:metric" element={
            <PrivateRoute>
              <MetricDetail />
            </PrivateRoute>
          } />
        {/* Executive Overview Drilldown Routes */}
        <Route path="/metric/average-daily-census" element={
          <PrivateRoute>
            <AverageDailyCensusDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/churn-rate" element={
          <PrivateRoute>
            <ChurnRateDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/revenue-per-unit" element={
          <PrivateRoute>
            <RevenuePerUnitDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/move-in-velocity" element={
          <PrivateRoute>
            <MoveInVelocityDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/churn-risk-score" element={
          <PrivateRoute>
            <ChurnRiskScoreDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/forecast-accuracy" element={
          <PrivateRoute>
            <ForecastAccuracyDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/portfolio-occupancy-rate" element={
          <PrivateRoute>
            <PortfolioOccupancyRateDetail />
          </PrivateRoute>
        } />
        {/* Census & Occupancy Drilldown Routes */}
        <Route path="/metric/census-daily-census" element={
          <PrivateRoute>
            <CensusAverageDailyCensusDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/average-length-of-stay" element={
          <PrivateRoute>
            <AverageLengthOfStayDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/census-occupancy-rate" element={
          <PrivateRoute>
            <CensusOccupancyRateDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/readmission-rate" element={
          <PrivateRoute>
            <ReadmissionRateDetail />
          </PrivateRoute>
        } />
        {/* Sales & Pipeline Drilldown Routes */}
        <Route path="/metric/conversion-rate" element={
          <PrivateRoute>
            <ConversionRateDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/pipeline-value" element={
          <PrivateRoute>
            <PipelineValueDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/monthly-inquiries" element={
          <PrivateRoute>
            <MonthlyInquiriesDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/lead-response-time" element={
          <PrivateRoute>
            <LeadResponseTimeDetail />
          </PrivateRoute>
        } />
        {/* Financial Health Drilldown Routes */}
        <Route path="/metric/monthly-revenue" element={
          <PrivateRoute>
            <MonthlyRevenueDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/collection-rate" element={
          <PrivateRoute>
            <CollectionRateDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/noi-per-unit" element={
          <PrivateRoute>
            <NOIPerUnitDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/ar-risk" element={
          <PrivateRoute>
            <ARRiskDetail />
          </PrivateRoute>
        } />
        {/* Care & Compliance Drilldown Routes */}
        <Route path="/metric/medication-adherence" element={
          <PrivateRoute>
            <MedicationAdherenceDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/care-plan-compliance" element={
          <PrivateRoute>
            <CarePlanComplianceDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/incident-report-rate" element={
          <PrivateRoute>
            <IncidentReportRateDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/staff-time-per-resident" element={
          <PrivateRoute>
            <StaffTimePerResidentDetail />
          </PrivateRoute>
        } />
        {/* Forecast & Risk Drilldown Routes */}
        <Route path="/metric/occupancy-forecast" element={
          <PrivateRoute>
            <OccupancyForecastDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/revenue-at-risk" element={
          <PrivateRoute>
            <RevenueAtRiskDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/high-risk-residents" element={
          <PrivateRoute>
            <HighRiskResidentsDetail />
          </PrivateRoute>
        } />
        <Route path="/metric/projected-occupancy" element={
          <PrivateRoute>
            <ProjectedOccupancyDetail />
          </PrivateRoute>
        } />
         {/* REIT Drilldown Routes */}
         <Route path="/drilldown/reit-noi" element={
           <PrivateRoute>
             <REITNOIDetail />
           </PrivateRoute>
         } />
         <Route path="/drilldown/reit-noi-margin" element={
           <PrivateRoute>
             <REITOccupancyDetail />
           </PrivateRoute>
         } />
         <Route path="/drilldown/reit-occupancy" element={
           <PrivateRoute>
             <REITOccupancyDetail />
           </PrivateRoute>
         } />
         <Route path="/drilldown/reit-revpau" element={
           <PrivateRoute>
             <REITRevPAUDetail />
           </PrivateRoute>
         } />
         <Route path="/drilldown/reit-risk-assets" element={
           <PrivateRoute>
             <REITRiskAssetsDetail />
           </PrivateRoute>
         } />
         {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AccessControlProvider>
          </CalculationMethodProvider>
        </StarterModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
