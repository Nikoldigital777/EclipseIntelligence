import { useState, useEffect } from "react";
import { Download, Edit, Trash2, Copy } from "lucide-react";
import { useLocation } from "wouter";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Agent {
  id?: number;
  agent_id?: string;
  retellAgentId?: string;
  agent_name?: string;
  name?: string;
  voice_id?: string;
  voice?: string;
  phone?: string;
  type?: string;
  editedBy?: string;
  editedAt?: string;
  last_modification_timestamp?: number;
  avatar?: string;
  description?: string;
}

export default function AllAgents() {
  const [, navigate] = useLocation();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      setAgents(data);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents');
      // Fallback to mock data
      setAgents([
        {
          id: 1,
          retellAgentId: "agent_madison_receptionist_001",
          name: "Madison Receptionist Agent",
          type: "Inbound Receptionist",
          voice: "Madison Professional",
          phone: "+1(248)283-4180",
          editedBy: "System",
          editedAt: "07/03/2025, 19:43",
          avatar: "MR",
          description: "Professional inbound receptionist"
        },
        {
          id: 2,
          retellAgentId: "agent_levan_recruiting_001",
          name: "Levan Outbound Recruiting Agent",
          type: "Outbound Recruiting",
          voice: "Levan RE/MAX",
          phone: "+1(248)283-4181",
          editedBy: "System",
          editedAt: "07/03/2025, 19:43",
          avatar: "LR",
          description: "Outbound recruiting specialist"
        },
        {
          id: 3,
          retellAgentId: "agent_levan_listing_001",
          name: "Levan Outbound Listing Agent",
          type: "Outbound Listing",
          voice: "Levan RE/MAX",
          phone: "+1(248)283-4182",
          editedBy: "System",
          editedAt: "07/03/2025, 19:43",
          avatar: "LL",
          description: "Outbound listing specialist"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getAgentDisplayData = (agent: Agent, index: number) => {
    const displayName = agent.agent_name || agent.name || "Unnamed Agent";
    const agentId = agent.agent_id || agent.retellAgentId || (agent.id ? agent.id.toString() : index.toString());
    
    return {
      id: agentId,
      name: displayName,
      type: agent.type || "Single Prompt",
      voice: agent.voice_id || agent.voice || "Default Voice",
      phone: agent.phone || "+1(555)000-0000",
      editedBy: agent.editedBy || "System",
      editedAt: agent.editedAt || (agent.last_modification_timestamp ? 
        new Date(agent.last_modification_timestamp).toLocaleDateString() : "Unknown"),
      avatar: agent.avatar || displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "AG",
      description: agent.description || "AI Agent",
      retellAgentId: agent.agent_id || agent.retellAgentId || agentId
    };
  };

  const handleAgentClick = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--gold-manifest))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-agents" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--remax-red))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--gold-manifest))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-agents)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-agents)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>
        
        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--manifest-blue))] rounded-full blur-2xl opacity-10" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)] flex items-center">
              <span className="mr-4 text-[hsl(var(--eclipse-glow))]">🤖</span>
              All Agents
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Your AI phone agent team - Advanced conversation specialists</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton variant="primary" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Import</span>
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
              {agents.map((agent, index) => {
                const displayData = getAgentDisplayData(agent, index);
                return (
                  <tr 
                    key={displayData.id} 
                    className="hover:bg-[hsl(var(--lunar-mist))]/10 transition-colors group cursor-pointer" 
                    onClick={() => handleAgentClick(displayData.id)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] lunar-shadow' :
                          index === 1 ? 'bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] manifest-shadow' :
                          'bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] lunar-shadow'
                        }`}>
                          <span className="text-white font-semibold text-sm">{displayData.avatar}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{displayData.name}</p>
                          <p className="text-[hsl(var(--soft-gray))] text-sm">{displayData.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant="outline" 
                        className="bg-[hsl(var(--eclipse-glow))]/20 text-[hsl(var(--eclipse-glow))] border-[hsl(var(--eclipse-glow))]/30"
                      >
                        {displayData.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[hsl(var(--manifest-blue))] font-medium">{displayData.voice}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-mono bg-[hsl(var(--lunar-mist))]/20 px-3 py-1 rounded-full text-sm">
                          {displayData.phone}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(var(--eclipse-glow))] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(displayData.phone);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-[hsl(var(--gold-manifest))] font-medium">{displayData.editedBy}</p>
                        <p className="text-[hsl(var(--soft-gray))] text-sm">{displayData.editedAt}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(var(--manifest-blue))] hover:text-[hsl(var(--eclipse-glow))] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAgentClick(displayData.id);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(var(--remax-red))] hover:text-[hsl(var(--gold-manifest))] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add delete functionality here
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
