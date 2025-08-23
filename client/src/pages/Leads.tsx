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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leads Inbox</h1>
          <p className="text-[hsl(var(--soft-gray))]">These opportunities are aligning for you...</p>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search leads..."
            className="bg-[hsl(var(--lunar-glass))] border-[hsl(var(--lunar-mist))]/30 rounded-full pl-10 pr-4 py-3 text-white placeholder:text-[hsl(var(--soft-gray))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] w-80"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--eclipse-glow))] w-4 h-4" />
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
            className={`hover-glow micro-interaction transition-all duration-500 ${
              index === 0 ? 'animate-text-reveal' : 
              index === 1 ? 'animate-text-reveal' : 
              'animate-text-reveal'
            }`}
            style={{ animationDelay: `${index * 200}ms` }}
            tiltEffect={true}
            intense={lead.borderColor === 'red'}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center micro-interaction ${
                  lead.borderColor === 'red' ? 'bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] remax-shadow animate-pulse' :
                  lead.borderColor === 'blue' ? 'bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] lunar-shadow' :
                  'bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--success-green))] manifest-shadow animate-float'
                }`}>
                  <span className="text-white font-semibold">{lead.avatar}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold hover:text-[hsl(var(--eclipse-glow))] transition-colors duration-300 cursor-pointer">{lead.name}</h3>
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
              <div className="text-2xl hover:scale-125 transition-transform duration-300 cursor-pointer">{lead.sentiment}</div>
            </div>
            <p className="text-[hsl(var(--soft-gray))] text-sm mb-4 leading-relaxed">{lead.description}</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Sparkles className="w-6 h-6 text-white animate-twinkle" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold flex items-center space-x-2">
              <span>Cosmic Suggestion</span>
              <div className="w-2 h-2 bg-[hsl(var(--eclipse-glow))] rounded-full animate-pulse" />
            </h4>
            <p className="text-[hsl(var(--soft-gray))] leading-relaxed">
              Amy Smith is in high alignment - call now for maximum manifestation energy!
            </p>
          </div>
          <CosmicButton variant="eclipse" size="sm" className="micro-interaction">
            Act Now
          </CosmicButton>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
