import { Download, Filter, Settings } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";

export default function CallHistory() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <span className="mr-4">🌙</span>
            Call History
          </h1>
          <p className="text-[hsl(var(--soft-gray))]">Past Cycles - Historical data with moon phases</p>
        </div>
        <div className="flex items-center space-x-4">
          <CosmicButton variant="eclipse" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </CosmicButton>
          <CosmicButton variant="secondary" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Customize Fields</span>
          </CosmicButton>
          <CosmicButton variant="remax" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </CosmicButton>
        </div>
      </div>

      {/* Empty State */}
      <GlassmorphicCard className="text-center py-16">
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
