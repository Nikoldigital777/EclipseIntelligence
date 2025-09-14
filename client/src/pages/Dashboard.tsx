import { Plus, Star, Phone, TrendingUp, Sparkles, History, Lightbulb, Crown, Zap, Target } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--manifest-blue))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--lunar-mist))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--remax-red))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad1)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad1)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>
        
        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full blur-2xl opacity-10" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">
              Good Morning, Levan!
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">
              Your AI phone agents are performing exceptionally. Here's today's activity:
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow hover:scale-110 transition-all duration-300 cursor-pointer border border-white/20">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--remax-red))] rounded-full animate-pulse micro-interaction" />
            </div>
            <CosmicButton variant="remax" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Cosmic Stats with enhanced animations */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Leads - Enhanced aesthetics */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 border border-[hsl(var(--manifest-blue))]/30 hover:border-[hsl(var(--manifest-blue))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--manifest-blue))]/15 to-[hsl(var(--eclipse-glow))]/8 animate-aurora" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--manifest-blue))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center eclipse-shadow hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white animate-pulse-slow">12</p>
                  <p className="text-gray-200 text-sm">Today's Leads</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] h-3 rounded-full w-3/4 eclipse-shadow animate-morphing-gradient"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/4 h-full animate-pulse rounded-full" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Callbacks Due - Enhanced urgency aesthetics */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-150 border border-[hsl(var(--remax-red))]/30 hover:border-[hsl(var(--remax-red))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--remax-red))]/15 to-[hsl(var(--gold-manifest))]/8 animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--remax-red))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full flex items-center justify-center remax-shadow animate-pulse hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white animate-pulse">5</p>
                  <p className="text-gray-200 text-sm">Callbacks Due</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] h-3 rounded-full w-2/3 remax-shadow animate-pulse"></div>
                <div className="absolute right-0 top-0 w-2 h-3 bg-[hsl(var(--remax-red))] rounded-full animate-pulse" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Conversion Rate - Success celebration */}
          <GlassmorphicCard className={`manifest-glow relative overflow-hidden transition-all duration-700 delay-300 border border-[hsl(var(--gold-manifest))]/30 hover:border-[hsl(var(--gold-manifest))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold-manifest))]/15 to-[hsl(var(--success-green))]/8 animate-morphing-gradient" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--gold-manifest))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] rounded-full flex items-center justify-center manifest-shadow hover:scale-110 transition-transform duration-300 animate-float">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] bg-clip-text">78%</p>
                  <p className="text-gray-200 text-sm">Conversion Rate</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-3 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] h-3 rounded-full w-4/5 manifest-shadow animate-morphing-gradient"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 h-full animate-pulse rounded-full" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance - System efficiency */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-500 border border-[hsl(var(--eclipse-glow))]/30 hover:border-[hsl(var(--eclipse-glow))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lunar-mist))]/15 to-[hsl(var(--eclipse-glow))]/8 animate-aurora" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--eclipse-glow))] to-transparent opacity-60" />
            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-sm animate-pulse opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center lunar-shadow animate-float hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white animate-twinkle" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white animate-glow bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] bg-clip-text">92%</p>
                  <p className="text-gray-200 text-sm">AI Performance</p>
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
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
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
                  <p className="text-white font-medium">Scheduled appointment with Amy Smith</p>
                  <p className="text-gray-300 text-sm">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-[hsl(var(--lunar-mist))]/10 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Call completed with John Doe</p>
                  <p className="text-gray-300 text-sm">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-[hsl(var(--lunar-mist))]/10 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">New lead from AI phone campaign</p>
                  <p className="text-gray-300 text-sm">1 hour ago</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance Insights */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-[hsl(var(--gold-manifest))]" />
              AI Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/20 to-[hsl(var(--lunar-mist))]/20 rounded-lg p-4 border border-[hsl(var(--eclipse-glow))]/30">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">AI Agent Tip</p>
                    <p className="text-white text-sm">
                      Call new leads within 15 minutes for optimal results. Your conversion rate increases by 47% with immediate follow-up.
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
                    <p className="text-white font-medium mb-1">Priority Alert</p>
                    <p className="text-white text-sm">
                      3 high-value leads are ready for immediate contact. AI analysis shows optimal conversion timing!
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
