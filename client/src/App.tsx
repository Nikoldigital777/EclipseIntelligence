import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import StarField from "./components/StarField";
import Sidebar from "./components/Sidebar";
import CustomCursor from "./components/CustomCursor";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import AllAgents from "./pages/AllAgents";
import BatchCalls from "./pages/BatchCalls";
import CallHistory from "./pages/CallHistory";
import Analytics from "./pages/Analytics";
import Numbers from "./pages/Numbers";
import Settings from "./pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen relative">
      <StarField />
      <CustomCursor />
      <Sidebar />
      <div className="flex-1 ml-64 relative z-10">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/leads" component={Leads} />
          <Route path="/agents" component={AllAgents} />
          <Route path="/batch-calls" component={BatchCalls} />
          <Route path="/call-history" component={CallHistory} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/numbers" component={Numbers} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
