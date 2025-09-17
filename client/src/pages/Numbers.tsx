
import { Plus, Phone, Settings, Trash2 } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PhoneNumber {
  id: string;
  number: string;
  name: string;
  type: 'inbound' | 'outbound';
  assignedAgent: string;
  status: 'active' | 'inactive';
}

const phoneNumbers: PhoneNumber[] = [
  {
    id: "1",
    number: "+1 (248) 283-4183",
    name: "Recruiting",
    type: "outbound",
    assignedAgent: "Levan Outbound Recruiting Agent",
    status: "active"
  },
  {
    id: "2", 
    number: "+1(248)653-1643",
    name: "Recruiting Outbound",
    type: "outbound",
    assignedAgent: "Levan Outbound Recruiting Agent",
    status: "active"
  },
  {
    id: "3",
    number: "+1 (248) 780-0017",
    name: "Madison Backup",
    type: "inbound",
    assignedAgent: "Madison Receptionist Agent",
    status: "active"
  },
  {
    id: "4",
    number: "+1 (248) 599-0019",
    name: "Test Recruit",
    type: "outbound",
    assignedAgent: "Levan Outbound Recruiting Agent",
    status: "active"
  },
  {
    id: "5",
    number: "+1 (586) 500-6801",
    name: "Office",
    type: "inbound",
    assignedAgent: "Madison Receptionist Agent", 
    status: "active"
  }
];

export default function Numbers() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--manifest-blue))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--gold-manifest))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-numbers" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--manifest-blue))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--gold-manifest))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-numbers)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-numbers)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>
        
        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--lunar-mist))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--remax-red))] rounded-full blur-2xl opacity-10" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">Phone Numbers</h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Manage your AI phone agent communication channels</p>
          </div>
          <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <Plus className="w-4 h-4" />
            <span>Buy Number</span>
          </CosmicButton>
        </div>
      </div>

      {/* Phone Numbers Table */}
      <GlassmorphicCard className="mt-8 border border-white/10 hover:border-white/20 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[hsl(var(--lunar-mist))]/20">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-white">Number</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Assigned Agent</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phoneNumbers.map((phoneNumber, index) => (
                <tr key={phoneNumber.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-mono">{phoneNumber.number}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-medium">{phoneNumber.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      className={`${
                        phoneNumber.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                      }`}
                    >
                      {phoneNumber.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      className={`${
                        phoneNumber.type === 'inbound'
                          ? 'bg-[hsl(var(--manifest-blue))]/20 text-[hsl(var(--manifest-blue))] border-[hsl(var(--manifest-blue))]/30'
                          : 'bg-[hsl(var(--eclipse-glow))]/20 text-[hsl(var(--eclipse-glow))] border-[hsl(var(--eclipse-glow))]/30'
                      }`}
                    >
                      {phoneNumber.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[hsl(var(--soft-gray))]">{phoneNumber.assignedAgent}</span>
                  </td>
                  <td className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-white hover:bg-white/10" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[hsl(var(--lunar-glass))] border-white/20">
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-300 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Release Number
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <GlassmorphicCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{phoneNumbers.length}</h3>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Total Numbers</p>
            </div>
            <Phone className="w-8 h-8 text-[hsl(var(--manifest-blue))]" />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{phoneNumbers.filter(n => n.status === 'active').length}</h3>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Active Lines</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{phoneNumbers.filter(n => n.type === 'inbound').length}</h3>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Inbound Lines</p>
            </div>
            <div className="w-8 h-8 bg-[hsl(var(--manifest-blue))]/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[hsl(var(--manifest-blue))] rounded-full"></div>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{phoneNumbers.filter(n => n.type === 'outbound').length}</h3>
              <p className="text-[hsl(var(--soft-gray))] text-sm">Outbound Lines</p>
            </div>
            <div className="w-8 h-8 bg-[hsl(var(--eclipse-glow))]/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[hsl(var(--eclipse-glow))] rounded-full"></div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
