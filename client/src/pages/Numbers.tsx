import { Plus, Phone } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";

export default function Numbers() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Numbers</h1>
          <p className="text-[hsl(var(--soft-gray))]">Lunar Lines - Your cosmic communication channels</p>
        </div>
        <CosmicButton variant="remax" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Buy Number</span>
        </CosmicButton>
      </div>

      {/* Empty State */}
      <GlassmorphicCard className="text-center py-16">
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
