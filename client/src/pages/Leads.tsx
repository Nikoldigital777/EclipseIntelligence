import { Search, Phone, MessageSquare, StickyNote, Sparkles } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const leads = [
  {
    id: 1,
    name: "Amy Smith",
    type: "Hot Lead",
    description: "Wants to list a 3BR condo in Waikiki. Ready to move fast!",
    sentiment: "😊",
    avatar: "AS",
    borderColor: "red" as const
  },
  {
    id: 2,
    name: "John Doe",
    type: "New Lead",
    description: "Looking for investment properties in downtown area. First time buyer.",
    sentiment: "🤔",
    avatar: "JD",
    borderColor: "blue" as const
  },
  {
    id: 3,
    name: "Maria Johnson",
    type: "Appointment Set",
    description: "Scheduled for viewing tomorrow at 2 PM. High budget range.",
    sentiment: "✨",
    avatar: "MJ",
    borderColor: "gold" as const
  }
];

export default function Leads() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--manifest-blue))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--success-green))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-leads" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--manifest-blue))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--success-green))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-leads)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-leads)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>
        
        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--gold-manifest))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-2xl opacity-10" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">Leads Inbox</h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">High-priority prospects identified by AI analysis</p>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search leads..."
              className="bg-[hsl(var(--lunar-glass))] border-[hsl(var(--lunar-mist))]/30 rounded-full pl-10 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] w-80 hover:border-[hsl(var(--eclipse-glow))]/50 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--eclipse-glow))] w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center space-x-4 mb-8">
        <CosmicButton variant="eclipse" size="sm">All</CosmicButton>
        <CosmicButton variant="primary" size="sm">New</CosmicButton>
        <CosmicButton variant="remax" size="sm">Hot</CosmicButton>
        <CosmicButton variant="secondary" size="sm">Needs Follow-up</CosmicButton>
        <Badge variant="outline" className="px-6 py-2 text-[hsl(var(--soft-gray))] border-[hsl(var(--soft-gray))]/30">
          Closed
        </Badge>
      </div>

      {/* Leads Grid with enhanced interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {leads.map((lead, index) => (
          <GlassmorphicCard 
            key={lead.id} 
            borderColor={lead.borderColor} 
            className={`hover-glow relative overflow-hidden border border-white/20 hover:border-[hsl(var(--eclipse-glow))]/50 transition-all duration-500 ${
              index === 0 ? 'animate-text-reveal' : 
              index === 1 ? 'animate-text-reveal' : 
              'animate-text-reveal'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            tiltEffect={true}
            intense={lead.borderColor === 'red'}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center micro-interaction ${
                  lead.borderColor === 'red' ? 'bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] remax-shadow animate-pulse-slow' :
                  lead.borderColor === 'blue' ? 'bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] lunar-shadow' :
                  'bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] manifest-shadow animate-float'
                }`}>
                  <span className="text-white font-semibold">{lead.avatar}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold hover:text-[hsl(var(--eclipse-glow))] transition-colors duration-200 cursor-pointer">{lead.name}</h3>
                  <Badge 
                    variant="outline"
                    className={`micro-interaction ${
                      lead.borderColor === 'red' ? 'bg-[hsl(var(--remax-red))]/20 text-[hsl(var(--remax-red))] border-[hsl(var(--remax-red))]/30 hover:bg-[hsl(var(--remax-red))]/30' :
                      lead.borderColor === 'blue' ? 'bg-[hsl(var(--manifest-blue))]/20 text-[hsl(var(--manifest-blue))] border-[hsl(var(--manifest-blue))]/30 hover:bg-[hsl(var(--manifest-blue))]/30' :
                      'bg-[hsl(var(--gold-manifest))]/20 text-[hsl(var(--gold-manifest))] border-[hsl(var(--gold-manifest))]/30 hover:bg-[hsl(var(--gold-manifest))]/30'
                    }`}
                  >
                    {lead.type}
                  </Badge>
                </div>
              </div>
              <div className="text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer">{lead.sentiment}</div>
            </div>
            <p className="text-white text-sm mb-4 leading-relaxed">{lead.description}</p>
            <div className="flex items-center space-x-2">
              <CosmicButton variant="primary" size="sm" className="flex items-center space-x-1 micro-interaction">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </CosmicButton>
              <CosmicButton variant="eclipse" size="sm" className="flex items-center space-x-1 micro-interaction">
                <MessageSquare className="w-4 h-4" />
                <span>Text</span>
              </CosmicButton>
              <CosmicButton variant="secondary" size="sm" className="flex items-center space-x-1 micro-interaction">
                <StickyNote className="w-4 h-4" />
                <span>Note</span>
              </CosmicButton>
            </div>
          </GlassmorphicCard>
        ))}
      </div>

      {/* Enhanced AI Suggestion with interactive elements */}
      <GlassmorphicCard 
        className="border border-[hsl(var(--eclipse-glow))]/30 relative overflow-hidden animate-aurora"
        intense={true}
        tiltEffect={true}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/5 via-[hsl(var(--lunar-mist))]/10 to-[hsl(var(--eclipse-glow))]/5 animate-morphing-gradient" />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow hover:scale-105 transition-transform duration-200 cursor-pointer">
            <Sparkles className="w-6 h-6 text-white animate-twinkle" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold flex items-center space-x-2">
              <span>AI Recommendation</span>
              <div className="w-2 h-2 bg-[hsl(var(--eclipse-glow))] rounded-full animate-pulse-slow" />
            </h4>
            <p className="text-white leading-relaxed">
              Amy Smith shows strong interest - high priority for immediate follow-up call!
            </p>
          </div>
          <CosmicButton variant="eclipse" size="sm" className="micro-interaction">
            Call Now
          </CosmicButton>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
