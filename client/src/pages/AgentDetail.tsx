
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
  agent_id?: string;
  retellAgentId?: string;
  agent_name?: string;
  name: string;
  type: string;
  voice: string;
  voice_id?: string;
  phone: string;
  description: string;
  editedBy: string;
  editedAt: string;
  avatar: string;
  prompt?: string;
  general_prompt?: string;
  response_engine?: {
    type: string;
    llm_id?: string;
    version?: number;
  };
  llm_details?: {
    general_prompt?: string;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    first_message?: string;
    system_message?: string;
    tools?: any[];
  };
  voice_config?: {
    voice_id?: string;
    voice_model?: string;
    voice_temperature?: number;
    voice_speed?: number;
    fallback_voice_ids?: string[];
    volume?: number;
    normalize_for_speech?: boolean;
    pronunciation_dictionary?: any[];
  };
  conversation_config?: {
    language?: string;
    responsiveness?: number;
    interruption_sensitivity?: number;
    enable_backchannel?: boolean;
    backchannel_frequency?: number;
    backchannel_words?: string[];
    reminder_trigger_ms?: number;
    reminder_max_count?: number;
    end_call_after_silence_ms?: number;
    max_call_duration_ms?: number;
  };
  call_config?: {
    webhook_url?: string;
    webhook_timeout_ms?: number;
    begin_message_delay_ms?: number;
    ring_duration_ms?: number;
    voicemail_option?: any;
    ambient_sound?: string;
    ambient_sound_volume?: number;
  };
  speech_config?: {
    stt_mode?: string;
    vocab_specialization?: string;
    boosted_keywords?: string[];
    allow_user_dtmf?: boolean;
    user_dtmf_options?: any;
    denoising_mode?: string;
  };
  analytics_config?: {
    data_storage_setting?: string;
    opt_in_signed_url?: boolean;
    post_call_analysis_data?: any[];
    post_call_analysis_model?: string;
    pii_config?: any;
  };
  last_modification_timestamp?: number;
  language?: string;
  version?: number;
  is_published?: boolean;
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
      
      // Map comprehensive agent data to our interface
      const mappedAgent: Agent = {
        id: agentData.id || parseInt(agentId),
        agent_id: agentData.agent_id,
        retellAgentId: agentData.agent_id || agentData.retellAgentId,
        name: agentData.agent_name || agentData.name || "Unnamed Agent",
        type: agentData.response_engine?.type || "Single Prompt",
        voice: agentData.voice_config?.voice_id || agentData.voice_id || "Default Voice",
        voice_id: agentData.voice_config?.voice_id || agentData.voice_id,
        phone: agentData.phone || "+1(555)000-0000",
        description: agentData.description || "AI Agent",
        editedBy: "System",
        editedAt: agentData.last_modification_timestamp ? 
          new Date(agentData.last_modification_timestamp).toLocaleDateString() : "Unknown",
        avatar: (agentData.agent_name || agentData.name || "AG").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        prompt: agentData.llm_details?.general_prompt || agentData.general_prompt || agentData.prompt || "",
        general_prompt: agentData.llm_details?.general_prompt || agentData.general_prompt,
        response_engine: agentData.response_engine,
        llm_details: agentData.llm_details,
        voice_config: agentData.voice_config,
        conversation_config: agentData.conversation_config,
        call_config: agentData.call_config,
        speech_config: agentData.speech_config,
        analytics_config: agentData.analytics_config,
        last_modification_timestamp: agentData.last_modification_timestamp,
        language: agentData.conversation_config?.language || agentData.language,
        version: agentData.version,
        is_published: agentData.is_published
      };

      setAgent(mappedAgent);
      setPrompt(mappedAgent.prompt || "");
    } catch (error) {
      console.error('Error fetching agent:', error);
      // Fallback to mock data
      const mockAgent: Agent = {
        id: parseInt(agentId),
        retellAgentId: agentId.startsWith('agent_') ? agentId : "agent_madison_receptionist_001",
        name: "Madison Receptionist Agent",
        type: "Inbound Receptionist",
        voice: "Madison Professional",
        phone: "+1(248)283-4180",
        description: "Professional inbound receptionist",
        editedBy: "System",
        editedAt: "07/03/2025, 19:43",
        avatar: "MR",
        prompt: `### You are Madison, a professional receptionist at RE/MAX Eclipse...

Your role is to:
- Answer incoming calls professionally and courteously
- Schedule appointments and manage calendars
- Route calls to appropriate agents
- Take detailed messages when agents are unavailable
- Provide basic information about services
- Maintain a warm, welcoming tone at all times

Remember to always be helpful, patient, and represent the company professionally.`
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
      const agentId = agent.retellAgentId || params?.id;
      
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
                  <Label className="text-gray-300 text-sm">Agent ID</Label>
                  <p className="text-white font-mono bg-[hsl(var(--lunar-mist))]/20 px-3 py-2 rounded-md text-sm">
                    {agent.agent_id || agent.retellAgentId || agent.id}
                  </p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Response Engine</Label>
                  <p className="text-[hsl(var(--eclipse-glow))] font-medium">
                    {agent.response_engine?.type || "Unknown"} 
                    {agent.response_engine?.llm_id && ` (${agent.response_engine.llm_id})`}
                  </p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Language</Label>
                  <p className="text-white">{agent.language || "en-US"}</p>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Version</Label>
                  <p className="text-white">{agent.version || 0} {agent.is_published ? "(Published)" : "(Draft)"}</p>
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

          {/* Voice Configuration */}
          {agent.voice_config && (
            <GlassmorphicCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3 text-[hsl(var(--manifest-blue))]">🎙️</span>
                  Voice Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Voice ID</Label>
                    <p className="text-[hsl(var(--manifest-blue))] font-medium">{agent.voice_config.voice_id}</p>
                  </div>
                  
                  {agent.voice_config.voice_model && (
                    <div>
                      <Label className="text-gray-300 text-sm">Voice Model</Label>
                      <p className="text-white">{agent.voice_config.voice_model}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Temperature</Label>
                      <p className="text-white">{agent.voice_config.voice_temperature || 1}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Speed</Label>
                      <p className="text-white">{agent.voice_config.voice_speed || 1}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm">Volume</Label>
                    <p className="text-white">{agent.voice_config.volume || 1}</p>
                  </div>
                  
                  {agent.voice_config.fallback_voice_ids && agent.voice_config.fallback_voice_ids.length > 0 && (
                    <div>
                      <Label className="text-gray-300 text-sm">Fallback Voices</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {agent.voice_config.fallback_voice_ids.map((voiceId, index) => (
                          <span key={index} className="bg-[hsl(var(--lunar-mist))]/20 px-2 py-1 rounded text-xs text-gray-300">
                            {voiceId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassmorphicCard>
          )}

          {/* LLM Details */}
          {agent.llm_details && (
            <GlassmorphicCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3 text-[hsl(var(--eclipse-glow))]">🧠</span>
                  LLM Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Model</Label>
                    <p className="text-[hsl(var(--eclipse-glow))] font-medium">{agent.llm_details.model}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Temperature</Label>
                      <p className="text-white">{agent.llm_details.temperature || 0.7}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Max Tokens</Label>
                      <p className="text-white">{agent.llm_details.max_tokens || 'Auto'}</p>
                    </div>
                  </div>
                  
                  {agent.llm_details.first_message && (
                    <div>
                      <Label className="text-gray-300 text-sm">First Message</Label>
                      <p className="text-white bg-[hsl(var(--lunar-mist))]/20 px-3 py-2 rounded-md text-sm">
                        {agent.llm_details.first_message}
                      </p>
                    </div>
                  )}
                  
                  {agent.llm_details.tools && agent.llm_details.tools.length > 0 && (
                    <div>
                      <Label className="text-gray-300 text-sm">Tools Available</Label>
                      <p className="text-[hsl(var(--gold-manifest))]">{agent.llm_details.tools.length} tools configured</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassmorphicCard>
          )}

          {/* Conversation Settings */}
          {agent.conversation_config && (
            <GlassmorphicCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3 text-[hsl(var(--gold-manifest))]">💬</span>
                  Conversation Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Responsiveness</Label>
                      <p className="text-white">{agent.conversation_config.responsiveness || 1}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Interruption Sensitivity</Label>
                      <p className="text-white">{agent.conversation_config.interruption_sensitivity || 1}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm">Backchannel</Label>
                    <p className="text-white">
                      {agent.conversation_config.enable_backchannel ? "Enabled" : "Disabled"}
                      {agent.conversation_config.enable_backchannel && agent.conversation_config.backchannel_frequency && 
                        ` (${agent.conversation_config.backchannel_frequency} frequency)`
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Reminder Trigger</Label>
                      <p className="text-white">{(agent.conversation_config.reminder_trigger_ms || 10000) / 1000}s</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Max Reminders</Label>
                      <p className="text-white">{agent.conversation_config.reminder_max_count || 1}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          )}

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
