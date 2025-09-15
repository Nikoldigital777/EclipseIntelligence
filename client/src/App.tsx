import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import StarField from "./components/StarField";
import Sidebar from "./components/Sidebar";
import CustomCursor from "./components/CustomCursor";
import GuidedTour from "./components/GuidedTour";
import Login from "./pages/Login";
import AllAgents from "./pages/AllAgents";
import AgentDetail from "./pages/AgentDetail";
import CallHistory from "./pages/CallHistory";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import OutboundCalls from "./pages/OutboundCalls";
import NotFound from "@/pages/not-found";
import { AuthService } from "./lib/auth";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        setIsAuthenticated(true);
        AuthService.initializeAuth();
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    AuthService.logout(); // Assuming AuthService has a logout method that clears token
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--deep-night))] via-[hsl(var(--lunar-glass))] to-[hsl(var(--deep-night))]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const getCurrentPageKey = () => {
    if (location === '/' || location === '/dashboard') return 'dashboard';
    if (location === '/agents') return 'agents';
    if (location === '/call-history') return 'call-history';
    if (location === '/outbound-calls') return 'outbound-calls';
    if (location === '/analytics') return 'analytics';
    if (location === '/settings') return 'settings';
    return 'dashboard';
  };

  return (
    <div className="flex min-h-screen relative">
      <StarField />
      <Sidebar onLogout={handleLogout} onStartTour={() => setShowTour(true)} />
      <div className="flex-1 ml-64 relative z-10">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/call-history" component={CallHistory} />
          <Route path="/agents" component={AllAgents} />
          <Route path="/agents/:id" component={AgentDetail} />
          <Route path="/outbound-calls" component={OutboundCalls} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      {/* Guided Tour */}
      <GuidedTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        currentPage={getCurrentPageKey()}
        onNavigate={navigate}
      />
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