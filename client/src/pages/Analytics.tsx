import { BarChart3, TrendingUp, Phone, Clock } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";

export default function Analytics() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-4 text-[hsl(var(--eclipse-glow))]" />
            Analytics
          </h1>
          <p className="text-[hsl(var(--soft-gray))]">Moon Phases of Results - Celestial performance insights</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassmorphicCard className="hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center eclipse-shadow">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">247</p>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Call Counts</p>
            </div>
          </div>
          <div className="text-[hsl(var(--eclipse-glow))] text-sm">+12% from last cycle</div>
        </GlassmorphicCard>

        <GlassmorphicCard className="hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center lunar-shadow">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">4.2m</p>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Call Duration</p>
            </div>
          </div>
          <div className="text-[hsl(var(--eclipse-glow))] text-sm">Average 1.7m per call</div>
        </GlassmorphicCard>

        <GlassmorphicCard className="hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">68%</p>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Success Rate</p>
            </div>
          </div>
          <div className="text-[hsl(var(--success-green))] text-sm">Cosmic alignment strong</div>
        </GlassmorphicCard>

        <GlassmorphicCard className="hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] rounded-full flex items-center justify-center manifest-shadow">
              <span className="text-white text-lg">😊</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">85%</p>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Positive Sentiment</p>
            </div>
          </div>
          <div className="text-[hsl(var(--gold-manifest))] text-sm">High manifestation energy</div>
        </GlassmorphicCard>
      </div>

      {/* Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GlassmorphicCard>
          <h3 className="text-lg font-semibold text-white mb-4">Call Performance Cycles</h3>
          <div className="h-64 flex items-center justify-center border border-[hsl(var(--lunar-mist))]/20 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center mx-auto mb-4 eclipse-shadow">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <p className="text-[hsl(var(--soft-gray))]">Chart visualization coming soon</p>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard>
          <h3 className="text-lg font-semibold text-white mb-4">Sentiment Analysis</h3>
          <div className="h-64 flex items-center justify-center border border-[hsl(var(--lunar-mist))]/20 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] rounded-full flex items-center justify-center mx-auto mb-4 manifest-shadow">
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-[hsl(var(--soft-gray))]">Cosmic mood tracking active</p>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Quick Insights */}
      <GlassmorphicCard>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Cosmic Insights</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[hsl(var(--eclipse-glow))]/10 rounded-lg">
            <span className="text-white">Most active agent this cycle:</span>
            <span className="text-[hsl(var(--gold-manifest))] font-medium">Madison RE/MAX Office</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[hsl(var(--success-green))]/10 rounded-lg">
            <span className="text-white">Peak manifestation hours:</span>
            <span className="text-[hsl(var(--success-green))] font-medium">2-4 PM (Lunar Power Time)</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[hsl(var(--remax-red))]/10 rounded-lg">
            <span className="text-white">Highest conversion day:</span>
            <span className="text-[hsl(var(--remax-red))] font-medium">Tuesday (Mars Energy)</span>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
