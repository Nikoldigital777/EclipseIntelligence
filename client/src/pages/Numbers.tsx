import { Plus, Phone } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";

export default function Numbers() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with enhanced aesthetics */}
      <div className="p-6 mb-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-sm rounded-lg">
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[hsl(var(--manifest-blue))] to-white bg-clip-text text-transparent mb-3 drop-shadow-2xl">Phone Numbers</h1>
            <p className="text-gray-300 text-lg drop-shadow-md">Manage your AI phone agent communication channels</p>
          </div>
          <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <Plus className="w-4 h-4" />
            <span>Buy Number</span>
          </CosmicButton>
        </div>
      </div>

      {/* Empty State */}
      <GlassmorphicCard className="text-center py-16 border border-white/10 hover:border-white/20 transition-colors duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center mx-auto mb-4 lunar-shadow">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No numbers purchased yet</h3>
        <p className="text-[hsl(var(--soft-gray))] mb-6">
          Manifest your cosmic connection channels. Purchase your first lunar line to begin the journey.
        </p>
        <CosmicButton variant="remax" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Buy Your First Number</span>
        </CosmicButton>
      </GlassmorphicCard>

      {/* Table Headers (for reference) */}
      <div className="mt-8 opacity-50">
        <GlassmorphicCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--lunar-mist))]/20">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-white">Number</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Assigned To</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-8 px-6 text-center text-[hsl(var(--soft-gray))]" colSpan={5}>
                    No lunar lines established yet
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
