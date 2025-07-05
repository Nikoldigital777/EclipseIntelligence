import { Plus, Download } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";

export default function BatchCalls() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Batch Calls</h1>
          <p className="text-[hsl(var(--soft-gray))]">Lunar Broadcast - Mass calling with cosmic energy</p>
        </div>
        <div className="flex items-center space-x-4">
          <CosmicButton variant="primary" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </CosmicButton>
          <CosmicButton variant="eclipse" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Batch</span>
          </CosmicButton>
        </div>
      </div>

      {/* Empty State */}
      <GlassmorphicCard className="text-center py-16">
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
