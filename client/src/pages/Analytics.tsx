
import { Phone, Users, TrendingUp, BarChart3, Download, CheckCircle } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
              Analytics Dashboard
            </h1>
            <p className="text-gray-200 text-lg drop-shadow-lg">
              Real-time performance metrics and call analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-[hsl(var(--lunar-glass))] text-white px-4 py-2 rounded-lg border border-white/20 focus:border-[hsl(var(--remax-red))] outline-none">
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
            <CosmicButton variant="remax" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Calls */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 border border-[hsl(var(--remax-red))]/30 hover:border-[hsl(var(--remax-red))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--remax-red))]/15 to-[hsl(var(--accent-gold))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--remax-red))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--accent-gold))] rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">147</p>
                  <p className="text-gray-200 text-sm">Total Calls</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Success Rate */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-150 border border-[hsl(var(--success-green))]/30 hover:border-[hsl(var(--success-green))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--success-green))]/15 to-[hsl(var(--eclipse-glow))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--success-green))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">87%</p>
                  <p className="text-gray-200 text-sm">Success Rate</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] h-2 rounded-full w-[87%]"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Average Duration */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-300 border border-[hsl(var(--soft-gray))]/30 hover:border-[hsl(var(--soft-gray))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--soft-gray))]/15 to-[hsl(var(--lunar-mist))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--soft-gray))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--soft-gray))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">4:12</p>
                  <p className="text-gray-200 text-sm">Avg Duration</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Active Agents */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-500 border border-[hsl(var(--primary-blue))]/30 hover:border-[hsl(var(--primary-blue))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-blue))]/15 to-[hsl(var(--eclipse-glow))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--primary-blue))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">3</p>
                  <p className="text-gray-200 text-sm">Active Agents</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Performance Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Call Volume Metrics */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6">Call Volume Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                <span className="text-gray-200">Today</span>
                <span className="text-2xl font-bold text-white">23 calls</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                <span className="text-gray-200">This Week</span>
                <span className="text-2xl font-bold text-white">147 calls</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[hsl(var(--success-green))]/20 to-[hsl(var(--eclipse-glow))]/20 rounded-lg border border-[hsl(var(--success-green))]/30">
                <span className="text-gray-200">Conversion Rate</span>
                <span className="text-2xl font-bold text-[hsl(var(--success-green))]">12%</span>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Agent Performance */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6">Agent Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[hsl(var(--success-green))] rounded-full"></div>
                  <span className="text-white">Receptionist</span>
                </div>
                <span className="text-lg font-semibold text-white">42 calls</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[hsl(var(--success-green))] rounded-full"></div>
                  <span className="text-white">Sales Agent 1</span>
                </div>
                <span className="text-lg font-semibold text-white">58 calls</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[hsl(var(--soft-gray))] rounded-full"></div>
                  <span className="text-white">Sales Agent 2</span>
                </div>
                <span className="text-lg font-semibold text-white">47 calls</span>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}
