import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./lib/protected-route";
import Layout from "./components/Layout";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import EmergencyProtocols from "./pages/EmergencyProtocols";
import ProtocolDetail from "./pages/ProtocolDetail";
import TreatmentGuidelines from "./pages/TreatmentGuidelines";
import Medications from "./pages/Medications";
import SymptomChecker from "./pages/SymptomChecker";
import Hospitals from "./pages/Hospitals";
import EmergencyContacts from "./pages/EmergencyContacts";
import AboutUs from "./pages/AboutUs";
import AuthPage from "./pages/AuthPage";
import StaffPortal from "./pages/StaffPortal";

function Router() {
  return (
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
        <Route path="/about-us">
          {() => <AboutUs />}
        </Route>
        <Route path="/auth">
          {() => <AuthPage />}
        </Route>
        <Route path="/staff-portal">
          {() => <StaffPortal />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
