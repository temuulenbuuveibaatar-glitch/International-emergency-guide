import { Switch, Route, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/Layout";
import InstallAppPrompt from "./components/InstallAppPrompt";
import AccessibilityPanel from "./components/AccessibilityPanel";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import EmergencyProtocols from "./pages/EmergencyProtocols";
import ProtocolDetail from "./pages/ProtocolDetail";
import TreatmentGuidelines from "./pages/TreatmentGuidelines";
import Medications from "./pages/Medications";
import SymptomChecker from "./pages/SymptomChecker";
import Hospitals from "./pages/Hospitals";
import EmergencyContacts from "./pages/EmergencyContacts";
import FireSafetyEquipment from "./pages/FireSafetyEquipment";
import DamageAssessment from "./pages/DamageAssessment";
import MedicalImaging from "./pages/MedicalImaging";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";

const basePath = import.meta.env.VITE_APP_MODE === 'github-pages' ? '/international-emergency-guide' : '';

function AppRouter() {
  return (
    <Router base={basePath}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/emergency" component={EmergencyProtocols} />
          <Route path="/emergency/:id" component={ProtocolDetail} />
          <Route path="/treatment" component={TreatmentGuidelines} />
          <Route path="/medications" component={Medications} />
          <Route path="/symptoms" component={SymptomChecker} />
          <Route path="/hospitals" component={Hospitals} />
          <Route path="/contacts" component={EmergencyContacts} />
          <Route path="/fire-safety" component={FireSafetyEquipment} />
          <Route path="/damage-assessment" component={DamageAssessment} />
          <Route path="/medical-imaging" component={MedicalImaging} />
          <Route path="/maintenance" component={MaintenanceSchedule} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
            <InstallAppPrompt />
            <AccessibilityPanel />
          </TooltipProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
