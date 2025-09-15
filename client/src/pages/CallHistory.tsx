import { Download, Filter } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";

export default function CallHistory() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--lunar-mist))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--manifest-blue))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-history" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--lunar-mist))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--manifest-blue))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-history)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-history)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>
        
        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--gold-manifest))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--remax-red))] rounded-full blur-2xl opacity-10" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)] flex items-center">
              <span className="mr-4">📞</span>
              Call History
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Historical AI phone agent performance and call records</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton variant="eclipse" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </CosmicButton>
            <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Call History Table */}
      <div className="mt-6">
        <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
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
                {[
                  {
                    time: "2024-01-15 14:32",
                    duration: "3m 45s",
                    channelType: "Phone Call",
                    cost: "$0.12",
                    status: "Completed",
                    sentiment: "Positive",
                    from: "+1 (555) 123-4567",
                    to: "+1 (555) 987-6543"
                  },
                  {
                    time: "2024-01-15 13:18",
                    duration: "7m 22s",
                    channelType: "Phone Call",
                    cost: "$0.24",
                    status: "Completed",
                    sentiment: "Neutral",
                    from: "+1 (555) 123-4567",
                    to: "+1 (555) 456-7890"
                  },
                  {
                    time: "2024-01-15 12:05",
                    duration: "2m 15s",
                    channelType: "Phone Call",
                    cost: "$0.08",
                    status: "Completed",
                    sentiment: "Positive",
                    from: "+1 (555) 123-4567",
                    to: "+1 (555) 234-5678"
                  },
                  {
                    time: "2024-01-15 11:42",
                    duration: "5m 33s",
                    channelType: "Phone Call",
                    cost: "$0.18",
                    status: "Completed",
                    sentiment: "Negative",
                    from: "+1 (555) 123-4567",
                    to: "+1 (555) 345-6789"
                  },
                  {
                    time: "2024-01-15 10:28",
                    duration: "1m 48s",
                    channelType: "Phone Call",
                    cost: "$0.06",
                    status: "No Answer",
                    sentiment: "N/A",
                    from: "+1 (555) 123-4567",
                    to: "+1 (555) 567-8901"
                  },
                  {
                    time: "2024-01-15 09:15",
                    duration: "4m 12s",
                    channelType: "Phone Call",
                    cost: "$0.14",
                    status: "Completed",
                    sentiment: "Positive",
                    from: "+1 (555) 123-4567",
                    to: "+1 (555) 678-9012"
                  }
                ].map((call, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-[hsl(var(--lunar-mist))]/10 transition-all duration-200">
                    <td className="py-4 px-6 text-white">{call.time}</td>
                    <td className="py-4 px-6 text-white">{call.duration}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--primary-blue))]/20 text-[hsl(var(--primary-blue))] border border-[hsl(var(--primary-blue))]/30">
                        {call.channelType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-medium">{call.cost}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        call.status === "Completed" 
                          ? "bg-[hsl(var(--success-green))]/20 text-[hsl(var(--success-green))] border border-[hsl(var(--success-green))]/30"
                          : "bg-[hsl(var(--remax-red))]/20 text-[hsl(var(--remax-red))] border border-[hsl(var(--remax-red))]/30"
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        call.sentiment === "Positive" 
                          ? "bg-[hsl(var(--success-green))]/20 text-[hsl(var(--success-green))] border border-[hsl(var(--success-green))]/30"
                          : call.sentiment === "Negative"
                          ? "bg-[hsl(var(--remax-red))]/20 text-[hsl(var(--remax-red))] border border-[hsl(var(--remax-red))]/30"
                          : call.sentiment === "Neutral"
                          ? "bg-[hsl(var(--eclipse-glow))]/20 text-[hsl(var(--eclipse-glow))] border border-[hsl(var(--eclipse-glow))]/30"
                          : "bg-[hsl(var(--soft-gray))]/20 text-[hsl(var(--soft-gray))] border border-[hsl(var(--soft-gray))]/30"
                      }`}>
                        {call.sentiment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[hsl(var(--soft-gray))] font-mono text-sm">{call.from}</td>
                    <td className="py-4 px-6 text-[hsl(var(--soft-gray))] font-mono text-sm">{call.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
