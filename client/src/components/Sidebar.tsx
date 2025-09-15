import { Link, useLocation } from "wouter";
import { BarChart3, PhoneCall, Users, Phone, Settings, LogOut, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/lib/auth";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/call-history", label: "Call History", icon: PhoneCall },
  { path: "/agents", label: "Agents", icon: Users },
  { path: "/single-call", label: "Make Single Call", icon: Phone },
  { path: "/outbound-calls", label: "Send Outbound Calls", icon: Phone },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onLogout: () => void;
  onStartTour?: () => void;
}

export default function Sidebar({ onLogout, onStartTour }: SidebarProps) {
  const [location] = useLocation();

  const onLogoutHandler = () => {
    AuthService.logout();
    // Optionally redirect to login page or clear user session
  };

  return (
    <div className="w-64 fixed left-0 top-0 h-full glassmorphism border-r border-white/10 z-20">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow">
            <span className="text-lg">🌙</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Eclipse</h1>
            <p className="text-xs text-[hsl(var(--soft-gray))]">AI Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <div key={item.path} className={`nav-item ${isActive ? 'active' : ''} hover-glow rounded-lg`}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-[hsl(var(--soft-gray))] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-4">
        <button
          onClick={onLogoutHandler}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="px-4 mb-4 space-y-2">
          {onStartTour && (
            <Button 
              variant="ghost" 
              onClick={onStartTour}
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            >
              <Sparkles className="mr-3 h-4 w-4" />
              Take a Tour
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
            <HelpCircle className="mr-3 h-4 w-4" />
            Help & Support
          </Button>
        </div>

        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] text-white text-center">
          <p className="text-xs font-medium">🌙 Eclipse AI</p>
          <p className="text-xs opacity-80">Version 2.1</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center lunar-shadow">
            <span className="text-white font-semibold">LW</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Levan Wood</p>
            <p className="text-xs text-[hsl(var(--soft-gray))]">Eclipse Rising</p>
          </div>
        </div>
      </div>
    </div>
  );
}