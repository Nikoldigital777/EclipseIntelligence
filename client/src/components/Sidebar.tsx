import { Link, useLocation } from "wouter";
import { BarChart3, PhoneCall, Users, Phone, Settings } from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/call-history", label: "Call History", icon: PhoneCall },
  { path: "/agents", label: "Agents", icon: Users },
  { path: "/outbound-calls", label: "Send Outbound Calls", icon: Phone },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

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