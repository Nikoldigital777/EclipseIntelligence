import { Plus, Star, Phone, TrendingUp, Sparkles, History, Lightbulb, Crown, Zap, Target } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with elegant design */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--eclipse-glow))_0%,transparent_60%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--remax-red))_0%,transparent_60%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--primary-blue))_0%,transparent_60%)]"></div>
        </div>

        {/* Clean mesh background */}
        <div className="absolute inset-0 opacity-3">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.2}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--lunar-mist))', stopOpacity: 0.1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--remax-red))', stopOpacity: 0.2}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad1)" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad1)" opacity="0.3" />
          </svg>
        </div>

        {/* Subtle floating elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-xl opacity-10 animate-float" />
        <div className="absolute bottom-4 left-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] rounded-full blur-2xl opacity-8" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl">
              Good Morning, Levan!
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg">
              Your AI phone agents are performing exceptionally. Here's today's activity:
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/10 group-hover:scale-105">
                <span className="text-2xl filter drop-shadow-sm">🤖</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--remax-red))] rounded-full shadow-sm" />
            </div>
            <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Leads */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 border border-[hsl(var(--primary-blue))]/20 hover:border-[hsl(var(--primary-blue))]/40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-blue))]/8 to-[hsl(var(--eclipse-glow))]/4 group-hover:from-[hsl(var(--primary-blue))]/12 group-hover:to-[hsl(var(--eclipse-glow))]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--primary-blue))] to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">12</p>
                  <p className="text-gray-300 text-sm">Today's Leads</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/30 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] h-2 rounded-full w-3/4 shadow-sm transition-all duration-500 group-hover:w-4/5"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Callbacks Due */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-75 border border-[hsl(var(--remax-red))]/20 hover:border-[hsl(var(--remax-red))]/40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--remax-red))]/8 to-[hsl(var(--accent-gold))]/4 group-hover:from-[hsl(var(--remax-red))]/12 group-hover:to-[hsl(var(--accent-gold))]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--remax-red))] to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--accent-gold))] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">5</p>
                  <p className="text-gray-300 text-sm">Callbacks Due</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/30 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--remax-red))] to-[hsl(var(--accent-gold))] h-2 rounded-full w-2/3 shadow-sm transition-all duration-500 group-hover:w-3/4"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Conversion Rate */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-150 border border-[hsl(var(--accent-gold))]/20 hover:border-[hsl(var(--accent-gold))]/40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-gold))]/8 to-[hsl(var(--success-green))]/4 group-hover:from-[hsl(var(--accent-gold))]/12 group-hover:to-[hsl(var(--success-green))]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent-gold))] to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-gold))] to-[hsl(var(--success-green))] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-[hsl(var(--accent-gold))] to-[hsl(var(--success-green))] bg-clip-text text-transparent">78%</p>
                  <p className="text-gray-300 text-sm">Conversion Rate</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/30 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--accent-gold))] to-[hsl(var(--success-green))] h-2 rounded-full w-4/5 shadow-sm transition-all duration-500 group-hover:w-5/6"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-225 border border-[hsl(var(--eclipse-glow))]/20 hover:border-[hsl(var(--eclipse-glow))]/40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lunar-mist))]/8 to-[hsl(var(--eclipse-glow))]/4 group-hover:from-[hsl(var(--lunar-mist))]/12 group-hover:to-[hsl(var(--eclipse-glow))]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--eclipse-glow))] to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] bg-clip-text text-transparent">92%</p>
                  <p className="text-gray-300 text-sm">AI Performance</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/30 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] h-2 rounded-full w-full shadow-sm"></div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Recent Activity & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <History className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-4 hover:bg-[hsl(var(--lunar-mist))]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Scheduled appointment with Amy Smith</p>
                  <p className="text-gray-400 text-sm">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 hover:bg-[hsl(var(--lunar-mist))]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Call completed with John Doe</p>
                  <p className="text-gray-400 text-sm">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 hover:bg-[hsl(var(--lunar-mist))]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--accent-gold))] to-[hsl(var(--remax-red))] rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">New lead from AI phone campaign</p>
                  <p className="text-gray-400 text-sm">1 hour ago</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance Insights */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-[hsl(var(--accent-gold))]" />
              AI Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/10 to-[hsl(var(--lunar-mist))]/10 rounded-lg p-4 border border-[hsl(var(--eclipse-glow))]/20 hover:border-[hsl(var(--eclipse-glow))]/30 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">AI Agent Tip</p>
                    <p className="text-gray-300 text-sm">
                      Call new leads within 15 minutes for optimal results. Your conversion rate increases by 47% with immediate follow-up.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[hsl(var(--accent-gold))]/10 to-[hsl(var(--remax-red))]/10 rounded-lg p-4 border border-[hsl(var(--accent-gold))]/20 hover:border-[hsl(var(--accent-gold))]/30 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--accent-gold))] to-[hsl(var(--remax-red))] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Priority Alert</p>
                    <p className="text-gray-300 text-sm">
                      3 high-value leads are ready for immediate contact. AI analysis shows optimal conversion timing!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Settings Tab */}
        <div className="p-8 mt-8">
          <GlassmorphicCard className="p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-white mb-6">4. Settings Tab</h2>
            <div className="space-y-6">
              {/* API Configuration Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-3 text-[hsl(var(--remax-red))]" />
                  API Configuration
                </h3>
                <div className="space-y-4">
                  {/* Retell API Key Field */}
                  <div className="space-y-2">
                    <label htmlFor="retellApiKey" className="block text-sm font-medium text-gray-300">
                      Retell API Key
                    </label>
                    <input
                      type="password"
                      id="retellApiKey"
                      className="block w-full px-4 py-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[hsl(var(--remax-red))] focus:border-transparent transition-all duration-300 placeholder-gray-500 bg-[hsl(var(--deep-night))]/50 border border-[hsl(var(--primary-blue))]/30 text-white"
                      placeholder="Enter your Retell API Key"
                    />
                    <p className="text-xs text-[hsl(var(--remax-red))]/80">
                      Securely enter your API key for full functionality.
                    </p>
                  </div>

                  {/* Webhook URL Field */}
                  <div className="space-y-2">
                    <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-300">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      id="webhookUrl"
                      className="block w-full px-4 py-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[hsl(var(--remax-red))] focus:border-transparent transition-all duration-300 placeholder-gray-500 bg-[hsl(var(--deep-night))]/50 border border-[hsl(var(--primary-blue))]/30 text-white"
                      placeholder="https://your-webhook.com/api/retell"
                    />
                    <p className="text-xs text-[hsl(var(--remax-red))]/80">
                      Ensure this URL is publicly accessible for receiving callbacks.
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <CosmicButton variant="remax" className="px-8 py-3 hover:scale-105 transition-transform duration-200">
                      Save Configuration
                    </CosmicButton>
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