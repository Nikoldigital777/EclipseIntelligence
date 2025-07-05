import { Plus, Star, Phone, TrendingUp, Sparkles, History, Lightbulb, Crown } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Good Morning, Levan!</h1>
            <p className="text-[hsl(var(--soft-gray))] text-lg">
              Your moon is in REMAX rising. Here's what's manifesting today:
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow">
              🌙
            </div>
            <CosmicButton variant="remax" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Cosmic Stats */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Leads */}
          <GlassmorphicCard className="hover-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center eclipse-shadow">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-[hsl(var(--soft-gray))] text-sm">Today's Leads</p>
              </div>
            </div>
            <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-2">
              <div className="bg-gradient-to-r from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] h-2 rounded-full w-3/4 eclipse-shadow"></div>
            </div>
          </GlassmorphicCard>

          {/* Callbacks Due */}
          <GlassmorphicCard className="hover-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full flex items-center justify-center remax-shadow animate-pulse">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-[hsl(var(--soft-gray))] text-sm">Callbacks Due</p>
              </div>
            </div>
            <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-2">
              <div className="bg-gradient-to-r from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] h-2 rounded-full w-2/3 remax-shadow"></div>
            </div>
          </GlassmorphicCard>

          {/* Conversion Rate */}
          <GlassmorphicCard className="manifest-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] rounded-full flex items-center justify-center manifest-shadow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">78%</p>
                <p className="text-[hsl(var(--soft-gray))] text-sm">Conversion Rate</p>
              </div>
            </div>
            <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-2">
              <div className="bg-gradient-to-r from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] h-2 rounded-full w-4/5 manifest-shadow"></div>
            </div>
          </GlassmorphicCard>

          {/* Manifestation Energy */}
          <GlassmorphicCard className="hover-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center lunar-shadow animate-float">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">92%</p>
                <p className="text-[hsl(var(--soft-gray))] text-sm">Cosmic Alignment</p>
              </div>
            </div>
            <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-2">
              <div className="bg-gradient-to-r from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] h-2 rounded-full w-full lunar-shadow animate-glow"></div>
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
