import { Plus, Download } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";

export default function BatchCalls() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--lunar-mist))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-batch" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--lunar-mist))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--remax-red))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-batch)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-batch)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
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
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">Batch Calls</h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Mass AI phone campaigns - Scale your outreach efficiently</p>
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
