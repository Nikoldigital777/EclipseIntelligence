
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { ArrowLeft, Play, Save, TestTube } from "lucide-react";
import { Link } from "wouter";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Agent {
  id: number;
  name: string;
  type: string;
  voice: string;
  phone: string;
  description: string;
  editedBy: string;
  editedAt: string;
  avatar: string;
  prompt?: string;
}

export default function AgentDetail() {
  const [match, params] = useRoute("/agents/:id");
  const [agent, setAgent] = useState<Agent | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchAgentData(params.id);
    }
  }, [params?.id]);

  const fetchAgentData = async (agentId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/agents/${agentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agent');
      }

      const agentData = await response.json();
      
      // Map Retell agent data to our interface
      const mappedAgent: Agent = {
        id: agentData.id || parseInt(agentId),
        name: agentData.agent_name || agentData.name || "Unnamed Agent",
        type: "Single Prompt", // Default type
        voice: agentData.voice_id || "Default Voice",
        phone: agentData.phone || "+1(555)000-0000",
        description: agentData.description || "AI Agent",
        editedBy: "System",
        editedAt: agentData.last_modification_timestamp ? 
          new Date(agentData.last_modification_timestamp).toLocaleDateString() : "Unknown",
        avatar: agentData.agent_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "AG",
        prompt: agentData.general_prompt || agentData.prompt || ""
      };

      setAgent(mappedAgent);
      setPrompt(mappedAgent.prompt || "");
    } catch (error) {
      console.error('Error fetching agent:', error);
      // Fallback to mock data
      const mockAgent: Agent = {
        id: parseInt(agentId),
        name: "Levan Wood Eclipse Recruiting",
        type: "Single Prompt",
        voice: "Levan RE/MAX",
        phone: "+1(248)283-4183",
        description: "Cosmic Recruiter",
        editedBy: "Levan Wood",
        editedAt: "07/03/2025, 19:43",
        avatar: "LW",
        prompt: `### You are Levan Wood, Broker-Owner at REMAX Eclipse...`
      };
      setAgent(mockAgent);
      setPrompt(mockAgent.prompt || "");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleTestAudio = async () => {
    if (!agent) return;
    
    setIsTestingAudio(true);
    try {
      const token = localStorage.getItem('auth_token');
      const agentId = agent.id?.toString() || params?.id;
      
      const response = await fetch('/api/web-calls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create test call');
      }

      const webCallData = await response.json();
      console.log('Web call created:', webCallData);
      
      // In a real implementation, you would use the access_token 
      // to initialize the Retell web call widget here
      alert(`Test call initiated! Web Call ID: ${webCallData.web_call_id}`);
      
    } catch (error) {
      console.error('Error creating test call:', error);
      alert('Failed to start test call. Please try again.');
    } finally {
      // Keep testing state for a bit longer for visual feedback
      setTimeout(() => setIsTestingAudio(false), 2000);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading agent...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg mb-8">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--manifest-blue))_0%,transparent_60%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--eclipse-glow))_0%,transparent_60%)]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/agents">
              <Button variant="ghost" className="text-white hover:text-[hsl(var(--eclipse-glow))] flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Agents</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <CosmicButton 
                variant="secondary" 
                onClick={handleTestAudio}
                disabled={isTestingAudio}
                className="flex items-center space-x-2"
              >
                {isTestingAudio ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    <span>Test Audio</span>
                  </>
                )}
              </CosmicButton>
              <CosmicButton 
                variant="primary" 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </CosmicButton>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center lunar-shadow">
              <span className="text-white font-bold text-xl">{agent.avatar}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{agent.name}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <span className="bg-[hsl(var(--eclipse-glow))]/20 px-3 py-1 rounded-full text-sm border border-[hsl(var(--eclipse-glow))]/30">
                  {agent.type}
                </span>
                <span>Voice: {agent.voice}</span>
                <span>Phone: {agent.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prompt Editor */}
        <div className="lg:col-span-2">
          <GlassmorphicCard className="h-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-3 text-[hsl(var(--eclipse-glow))]">📝</span>
                Agent Prompt
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                Configure how your AI agent communicates. This prompt defines the agent's personality, 
                objectives, and conversation style.
              </p>
              
              <div className="space-y-4">
                <Label htmlFor="prompt" className="text-white">Conversation Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your agent's conversation prompt..."
                  className="min-h-[500px] bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder:text-gray-400 resize-none font-mono text-sm leading-relaxed"
                />
                <p className="text-gray-400 text-xs">
                  Tip: Be specific about the agent's role, tone, and objectives for best results.
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Agent Info & Test Panel */}
        <div className="space-y-6">
          {/* Agent Information */}
          <GlassmorphicCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-3 text-[hsl(var(--gold-manifest))]">ℹ️</span>
                Agent Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm">Agent Name</Label>
                  <p className="text-white font-medium">{agent.name}</p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Description</Label>
                  <p className="text-white">{agent.description}</p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Voice Model</Label>
                  <p className="text-[hsl(var(--manifest-blue))] font-medium">{agent.voice}</p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Phone Number</Label>
                  <p className="text-white font-mono bg-[hsl(var(--lunar-mist))]/20 px-3 py-2 rounded-md text-sm">
                    {agent.phone}
                  </p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Last Modified</Label>
                  <p className="text-gray-400 text-sm">
                    By {agent.editedBy} on {agent.editedAt}
                  </p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Test Audio Panel */}
          <GlassmorphicCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-3 text-[hsl(var(--remax-red))]">🎧</span>
                Test Audio
              </h3>
              
              <p className="text-gray-300 text-sm mb-6">
                Test your agent's voice and conversation flow with a simulated web call.
              </p>
              
              <div className="space-y-4">
                <CosmicButton 
                  variant="remax" 
                  onClick={handleTestAudio}
                  disabled={isTestingAudio}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {isTestingAudio ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Starting Test Call...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Test Call</span>
                    </>
                  )}
                </CosmicButton>
                
                {isTestingAudio && (
                  <div className="bg-[hsl(var(--remax-red))]/10 border border-[hsl(var(--remax-red))]/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-[hsl(var(--remax-red))] rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">Test call in progress...</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-2">
                      You can speak with your AI agent to test the conversation flow.
                    </p>
                  </div>
                )}
                
                <div className="text-gray-400 text-xs">
                  <p>• Test calls are simulated and don't count toward usage</p>
                  <p>• Changes to the prompt require saving before testing</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}
