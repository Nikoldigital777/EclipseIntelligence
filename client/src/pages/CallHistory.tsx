import { Download, Filter, Settings } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";

export default function CallHistory() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with enhanced aesthetics */}
      <div className="p-6 mb-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-sm rounded-lg">
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[hsl(var(--lunar-mist))] to-white bg-clip-text text-transparent mb-3 drop-shadow-2xl flex items-center">
              <span className="mr-4">📞</span>
              Call History
            </h1>
            <p className="text-gray-300 text-lg drop-shadow-md">Historical AI phone agent performance and call records</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton variant="eclipse" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </CosmicButton>
            <CosmicButton variant="secondary" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Settings className="w-4 h-4" />
              <span>Customize Fields</span>
            </CosmicButton>
            <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <GlassmorphicCard className="text-center py-16 border border-white/10 hover:border-white/20 transition-colors duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center mx-auto mb-4 lunar-shadow">
          <span className="text-2xl">📱</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No call history in this cycle</h3>
        <p className="text-[hsl(var(--soft-gray))] mb-6">
          Your cosmic call journey will appear here. Start making calls to see the manifestation unfold.
        </p>
        <CosmicButton variant="primary">View All Cycles</CosmicButton>
      </GlassmorphicCard>

      {/* Table Headers (for reference) */}
      <div className="mt-8 opacity-50">
        <GlassmorphicCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--lunar-mist))]/20">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-white">Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Channel Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Cost</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Session Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">User Sentiment</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">From</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">To</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-8 px-6 text-center text-[hsl(var(--soft-gray))]" colSpan={8}>
                    No call history in selected date range
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
