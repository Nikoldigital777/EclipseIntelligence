
import React, { useState, useEffect } from "react";
import { Phone, User, Clock, MessageSquare, Settings } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  voice: string;
  phone: string;
}

export default function SingleCall() {
  const [formData, setFormData] = useState({
    fromNumber: "",
    toNumber: "",
    selectedAgent: "",
    customMessage: "",
    scheduleCall: false,
    scheduleTime: "",
    metadata: {
      customer_name: "",
      campaign_type: "sales_outreach",
      priority: "normal"
    }
  });
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/agents/simple', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const agentsData = await response.json();
        setAgents(agentsData);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('metadata.')) {
      const metadataField = field.replace('metadata.', '');
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.fromNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "From number is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.toNumber.trim()) {
      toast({
        title: "Validation Error", 
        description: "To number is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.selectedAgent) {
      toast({
        title: "Validation Error",
        description: "Please select an agent",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const initiateCall = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setCallInProgress(true);
    setCallStatus("Initiating call...");

    try {
      const token = localStorage.getItem('auth_token');
      
      const callData = {
        from_number: formData.fromNumber,
        to_number: formData.toNumber,
        override_agent_id: formData.selectedAgent,
        metadata: {
          ...formData.metadata,
          custom_message: formData.customMessage || undefined,
          initiated_from: "single_call_interface",
          initiated_at: new Date().toISOString()
        },
        retell_llm_dynamic_variables: formData.customMessage ? {
          custom_intro: formData.customMessage
        } : {}
      };

      const response = await fetch('/api/outbound-calls/single', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      });

      if (response.ok) {
        const result = await response.json();
        
        setCallStatus(`Call initiated successfully! Call ID: ${result.call_id}`);
        
        toast({
          title: "Call Initiated",
          description: `Successfully started call to ${formData.toNumber}`,
        });

        // Simulate call progress updates
        setTimeout(() => setCallStatus("Ringing..."), 2000);
        setTimeout(() => setCallStatus("Call in progress..."), 5000);
        setTimeout(() => {
          setCallStatus("Call completed");
          setCallInProgress(false);
        }, 15000);

      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initiate call');
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallStatus("Call failed");
      setCallInProgress(false);
      
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Failed to initiate call",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAgentData = agents.find(agent => agent.id === formData.selectedAgent);

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--gold-manifest))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl flex items-center">
            <Phone className="w-12 h-12 mr-4 text-[hsl(var(--remax-red))]" />
            Single Call
          </h1>
          <p className="text-gray-200 text-xl drop-shadow-lg">
            Initiate individual AI-powered voice calls
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Call Configuration */}
        <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
            Call Configuration
          </h3>
          
          <div className="space-y-6">
            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-number" className="text-white font-medium">
                  From Number
                </Label>
                <Input
                  id="from-number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.fromNumber}
                  onChange={(e) => handleInputChange('fromNumber', e.target.value)}
                  className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--remax-red))]/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to-number" className="text-white font-medium">
                  To Number *
                </Label>
                <Input
                  id="to-number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.toNumber}
                  onChange={(e) => handleInputChange('toNumber', e.target.value)}
                  className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--remax-red))]/50"
                />
              </div>
            </div>

            {/* Agent Selection */}
            <div className="space-y-2">
              <Label htmlFor="agent-select" className="text-white font-medium">
                Select Agent *
              </Label>
              <Select value={formData.selectedAgent} onValueChange={(value) => handleInputChange('selectedAgent', value)}>
                <SelectTrigger className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white focus:border-[hsl(var(--remax-red))]/50">
                  <SelectValue placeholder="Choose an AI agent" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--deep-night))] border-white/20">
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id} className="text-white hover:bg-white/10">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{agent.avatar}</span>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-400">{agent.voice}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="text-white font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                Customer Information
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="customer-name" className="text-white">
                  Customer Name
                </Label>
                <Input
                  id="customer-name"
                  placeholder="John Smith"
                  value={formData.metadata.customer_name}
                  onChange={(e) => handleInputChange('metadata.customer_name', e.target.value)}
                  className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-type" className="text-white">
                    Campaign Type
                  </Label>
                  <Select 
                    value={formData.metadata.campaign_type} 
                    onValueChange={(value) => handleInputChange('metadata.campaign_type', value)}
                  >
                    <SelectTrigger className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--deep-night))] border-white/20">
                      <SelectItem value="sales_outreach" className="text-white">Sales Outreach</SelectItem>
                      <SelectItem value="lead_qualification" className="text-white">Lead Qualification</SelectItem>
                      <SelectItem value="appointment_setting" className="text-white">Appointment Setting</SelectItem>
                      <SelectItem value="follow_up" className="text-white">Follow Up</SelectItem>
                      <SelectItem value="survey" className="text-white">Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-white">
                    Priority
                  </Label>
                  <Select 
                    value={formData.metadata.priority} 
                    onValueChange={(value) => handleInputChange('metadata.priority', value)}
                  >
                    <SelectTrigger className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--deep-night))] border-white/20">
                      <SelectItem value="low" className="text-white">Low</SelectItem>
                      <SelectItem value="normal" className="text-white">Normal</SelectItem>
                      <SelectItem value="high" className="text-white">High</SelectItem>
                      <SelectItem value="urgent" className="text-white">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="custom-message" className="text-white font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Custom Introduction Message
              </Label>
              <Textarea
                id="custom-message"
                placeholder="Optional custom message for the AI to use as introduction..."
                value={formData.customMessage}
                onChange={(e) => handleInputChange('customMessage', e.target.value)}
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder-gray-400 min-h-[100px] resize-none focus:border-[hsl(var(--eclipse-glow))]/50"
              />
              <p className="text-[hsl(var(--soft-gray))] text-xs">
                This message will be incorporated into the AI agent's opening script
              </p>
            </div>

            {/* Schedule Option */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/10 to-[hsl(var(--lunar-mist))]/10 rounded-lg border border-[hsl(var(--eclipse-glow))]/20">
              <div>
                <Label htmlFor="schedule-call" className="text-white font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Call
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Schedule this call for later
                </p>
              </div>
              <Switch
                id="schedule-call"
                checked={formData.scheduleCall}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, scheduleCall: checked }))}
              />
            </div>

            {formData.scheduleCall && (
              <div className="space-y-2">
                <Label htmlFor="schedule-time" className="text-white">
                  Schedule Time
                </Label>
                <Input
                  id="schedule-time"
                  type="datetime-local"
                  value={formData.scheduleTime}
                  onChange={(e) => handleInputChange('scheduleTime', e.target.value)}
                  className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white"
                />
              </div>
            )}
          </div>
        </GlassmorphicCard>

        {/* Call Status & Preview */}
        <div className="space-y-8">
          {/* Selected Agent Preview */}
          {selectedAgentData && (
            <GlassmorphicCard className="border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Selected Agent
              </h3>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center text-2xl">
                  {selectedAgentData.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{selectedAgentData.name}</h4>
                  <p className="text-[hsl(var(--soft-gray))] text-sm">{selectedAgentData.voice}</p>
                  <p className="text-[hsl(var(--soft-gray))] text-xs">{selectedAgentData.phone}</p>
                </div>
              </div>
            </GlassmorphicCard>
          )}

          {/* Call Status */}
          <GlassmorphicCard className="border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Call Status
            </h3>
            
            <div className="space-y-4">
              {callStatus && (
                <div className={`p-4 rounded-lg border ${
                  callInProgress 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' 
                    : 'bg-green-500/10 border-green-500/30 text-green-300'
                }`}>
                  <p className="font-medium">{callStatus}</p>
                </div>
              )}
              
              {callInProgress && (
                <div className="flex items-center space-x-3 text-[hsl(var(--soft-gray))]">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Call in progress...</span>
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Action Button */}
          <GlassmorphicCard className="border border-white/10">
            <CosmicButton
              variant="remax"
              size="lg"
              onClick={initiateCall}
              disabled={isLoading || callInProgress}
              className="w-full flex items-center justify-center space-x-3"
            >
              <Phone className="w-5 h-5" />
              <span>
                {isLoading 
                  ? "Initiating Call..." 
                  : callInProgress 
                    ? "Call in Progress" 
                    : formData.scheduleCall 
                      ? "Schedule Call" 
                      : "Start Call Now"
                }
              </span>
            </CosmicButton>
            
            {!callInProgress && (
              <p className="text-[hsl(var(--soft-gray))] text-center text-sm mt-3">
                Click to initiate an AI-powered voice call
              </p>
            )}
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}
