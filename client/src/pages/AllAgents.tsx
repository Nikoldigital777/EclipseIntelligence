import { Download, Plus, Edit, Trash2, Copy } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const agents = [
  {
    id: 1,
    name: "Levan Wood Eclipse Recruiting",
    type: "Single Prompt",
    voice: "Levan RE/MAX",
    phone: "+1(248)283-4183",
    editedBy: "Levan Wood",
    editedAt: "07/03/2025, 19:43",
    avatar: "LW",
    description: "Cosmic Recruiter"
  },
  {
    id: 2,
    name: "Madison RE/MAX Office",
    type: "Single Prompt",
    voice: "Emily",
    phone: "+1(586)500-6801",
    editedBy: "Emily",
    editedAt: "07/01/2025, 02:37",
    avatar: "MR",
    description: "Office Manager"
  },
  {
    id: 3,
    name: "Levan Wood Listing Agent",
    type: "Single Prompt",
    voice: "Levan RE/MAX",
    phone: "+1(248)599-0019",
    editedBy: "Levan Wood",
    editedAt: "05/29/2025, 02:02",
    avatar: "LW",
    description: "Listing Specialist"
  }
];

export default function AllAgents() {
  return (
    <div className="min-h-screen p-8">
      {/* Header with enhanced aesthetics */}
      <div className="p-6 mb-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-sm rounded-lg">
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[hsl(var(--remax-red))] to-white bg-clip-text text-transparent mb-3 drop-shadow-2xl flex items-center">
              <span className="mr-4 text-[hsl(var(--eclipse-glow))]">🤖</span>
              All Agents
            </h1>
            <p className="text-gray-300 text-lg drop-shadow-md">Your AI phone agent team - Advanced conversation specialists</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton variant="primary" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Import</span>
            </CosmicButton>
            <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Plus className="w-4 h-4" />
              <span>Create an Agent</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <GlassmorphicCard className="overflow-hidden border border-white/10 hover:border-white/20 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[hsl(var(--lunar-mist))]/20">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-white">Agent Name</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Agent Type</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Voice</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Phone</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Edited By</th>
                <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {agents.map((agent, index) => (
                <tr key={agent.id} className="hover:bg-[hsl(var(--lunar-mist))]/10 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] lunar-shadow' :
                        index === 1 ? 'bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] manifest-shadow' :
                        'bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] lunar-shadow'
                      }`}>
                        <span className="text-white font-semibold text-sm">{agent.avatar}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{agent.name}</p>
                        <p className="text-[hsl(var(--soft-gray))] text-sm">{agent.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      variant="outline" 
                      className="bg-[hsl(var(--eclipse-glow))]/20 text-[hsl(var(--eclipse-glow))] border-[hsl(var(--eclipse-glow))]/30"
                    >
                      {agent.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[hsl(var(--manifest-blue))] font-medium">{agent.voice}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono bg-[hsl(var(--lunar-mist))]/20 px-3 py-1 rounded-full text-sm">
                        {agent.phone}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[hsl(var(--eclipse-glow))] hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-[hsl(var(--gold-manifest))] font-medium">{agent.editedBy}</p>
                      <p className="text-[hsl(var(--soft-gray))] text-sm">{agent.editedAt}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[hsl(var(--manifest-blue))] hover:text-[hsl(var(--eclipse-glow))] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[hsl(var(--remax-red))] hover:text-[hsl(var(--gold-manifest))] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
