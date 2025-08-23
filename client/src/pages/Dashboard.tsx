import { Plus, Star, Phone, TrendingUp, Sparkles, History, Lightbulb, Crown, Zap, Target } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsAnimation, setStatsAnimation] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setStatsAnimation(true), 600);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with scroll-triggered animations */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden">
        {/* Floating cosmic elements */}
        <div className="absolute top-4 right-4 w-32 h-32 animate-morphing-gradient rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full blur-2xl opacity-30 animate-pulse-slow" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-text-reveal' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-[hsl(var(--eclipse-glow))] to-white bg-clip-text">
              Good Morning, Levan!
            </h1>
            <p className="text-[hsl(var(--soft-gray))] text-lg">
              Your moon is in REMAX rising. Here's what's manifesting today:
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow hover:scale-110 transition-transform duration-300 cursor-pointer">
                🌙
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--remax-red))] rounded-full animate-pulse micro-interaction" />
            </div>
            <CosmicButton variant="remax" className="flex items-center space-x-2 micro-interaction">
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Cosmic Stats with enhanced animations */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Leads - Enhanced with micro-interactions */}
          <GlassmorphicCard className={`hover-glow micro-interaction relative overflow-hidden transition-all duration-700 ${statsAnimation ? 'animate-text-reveal' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--manifest-blue))]/10 to-[hsl(var(--eclipse-glow))]/5 animate-aurora" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center eclipse-shadow hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white animate-pulse-slow">12</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">Today's Leads</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] h-3 rounded-full w-3/4 eclipse-shadow animate-morphing-gradient"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/4 h-full animate-pulse rounded-full" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Callbacks Due - Enhanced urgency animations */}
          <GlassmorphicCard className={`hover-glow micro-interaction relative overflow-hidden transition-all duration-700 delay-150 ${statsAnimation ? 'animate-text-reveal' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--remax-red))]/10 to-[hsl(var(--gold-manifest))]/5 animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full flex items-center justify-center remax-shadow animate-pulse hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white animate-pulse">5</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">Callbacks Due</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] h-3 rounded-full w-2/3 remax-shadow animate-pulse"></div>
                <div className="absolute right-0 top-0 w-2 h-3 bg-[hsl(var(--remax-red))] rounded-full animate-pulse" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Conversion Rate - Success celebration */}
          <GlassmorphicCard className={`manifest-glow micro-interaction relative overflow-hidden transition-all duration-700 delay-300 ${statsAnimation ? 'animate-text-reveal' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold-manifest))]/10 to-[hsl(var(--success-green))]/5 animate-morphing-gradient" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] rounded-full flex items-center justify-center manifest-shadow hover:scale-110 transition-transform duration-300 animate-float">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] bg-clip-text">78%</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">Conversion Rate</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] h-3 rounded-full w-4/5 manifest-shadow animate-morphing-gradient"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 h-full animate-pulse rounded-full" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Manifestation Energy - Peak cosmic power */}
          <GlassmorphicCard className={`hover-glow micro-interaction relative overflow-hidden transition-all duration-700 delay-500 ${statsAnimation ? 'animate-text-reveal' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lunar-mist))]/10 to-[hsl(var(--eclipse-glow))]/5 animate-aurora" />
            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-sm animate-pulse opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center lunar-shadow animate-float hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white animate-twinkle" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white animate-glow bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] bg-clip-text">92%</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">Cosmic Alignment</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] h-3 rounded-full w-full lunar-shadow animate-glow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 h-full animate-morphing-gradient rounded-full" />
                <div className="absolute right-1 top-1 w-1 h-1 bg-white rounded-full animate-twinkle" />
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Recent Activity & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <GlassmorphicCard>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <History className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 hover:bg-[hsl(var(--lunar-mist))]/10 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Manifested appointment with Amy Smith</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-[hsl(var(--lunar-mist))]/10 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Call completed with John Doe</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-[hsl(var(--lunar-mist))]/10 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">New lead aligned from Zillow</p>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">1 hour ago</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Cosmic Insights */}
          <GlassmorphicCard>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-[hsl(var(--gold-manifest))]" />
              Cosmic AI Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/20 to-[hsl(var(--lunar-mist))]/20 rounded-lg p-4 border border-[hsl(var(--eclipse-glow))]/30">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Manifestation Tip</p>
                    <p className="text-[hsl(var(--soft-gray))] text-sm">
                      Call new leads within 15 minutes for cosmic alignment. Your conversion rate increases by 47% during lunar hours.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[hsl(var(--gold-manifest))]/20 to-[hsl(var(--remax-red))]/20 rounded-lg p-4 border border-[hsl(var(--gold-manifest))]/30">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Abundance Alert</p>
                    <p className="text-[hsl(var(--soft-gray))] text-sm">
                      3 high-value leads are in perfect alignment right now. The universe is ready to deliver!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}
