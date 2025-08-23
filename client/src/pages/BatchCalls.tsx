import { Plus, Download } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";

export default function BatchCalls() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with enhanced aesthetics */}
      <div className="p-6 mb-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-sm rounded-lg">
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[hsl(var(--eclipse-glow))] to-white bg-clip-text text-transparent mb-3 drop-shadow-2xl">Batch Calls</h1>
            <p className="text-gray-300 text-lg drop-shadow-md">Mass AI phone campaigns - Scale your outreach efficiently</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton variant="primary" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CosmicButton>
            <CosmicButton variant="eclipse" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Plus className="w-4 h-4" />
              <span>New Batch</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <GlassmorphicCard className="text-center py-16 border border-white/10 hover:border-white/20 transition-colors duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center mx-auto mb-4 eclipse-shadow">
          <span className="text-2xl">📞</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No batch calls found</h3>
        <p className="text-[hsl(var(--soft-gray))] mb-6">
          Ready to manifest multiple connections at once? Create your first batch call campaign.
        </p>
        <CosmicButton variant="remax" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Batch Campaign</span>
        </CosmicButton>
      </GlassmorphicCard>

      {/* Table Headers (for reference) */}
      <div className="mt-8 opacity-50">
        <GlassmorphicCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--lunar-mist))]/20">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-white">Batch Call Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Recipients</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Sent</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Picked Up</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Successful</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Last sent by</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-8 px-6 text-center text-[hsl(var(--soft-gray))]" colSpan={7}>
                    No batch calls yet. Time to manifest some cosmic connections!
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
