
import { useState } from "react";
import { Phone, User, Settings, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Agent {
  id: number;
  name: string;
  phone: string;
  voice: string;
  avatar: string;
}

export default function SingleCall() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [toNumber, setToNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [customVariables, setCustomVariables] = useState("");

  // Fetch agents
  const { data: agents = [], isLoading: isLoadingAgents } = useQuery<Agent[]>({
    queryKey: ['/api/agents/simple'],
    queryFn: () => apiClient.get('/api/agents/simple'),
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Create single call mutation
  const createSingleCallMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/api/outbound-calls/single', payload),
    onSuccess: (data) => {
      toast({
        title: "Call Initiated! 📞",
        description: `Call created successfully. Call ID: ${data.call_id}`,
      });
      
      // Invalidate calls cache to refresh call history
      queryClient.invalidateQueries({ queryKey: ['/api/calls'] });
      
      // Reset form
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate call",
        variant: "destructive",
      });
    }
  });

  const selectedAgentData = agents.find((agent: Agent) => agent.id.toString() === selectedAgent);

  const resetForm = () => {
    setFromNumber("");
    setToNumber("");
    setCustomerName("");
    setCallNotes("");
    setCustomVariables("");
  };

  const handleInitiateCall = async () => {
    if (!selectedAgent || !toNumber) {
      toast({
        title: "Missing Information",
        description: "Please select an agent and enter a phone number to call.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAgentData) {
      toast({
        title: "Agent Error",
        description: "Selected agent not found. Please choose a valid agent.",
        variant: "destructive",
      });
      return;
    }

    // Parse custom variables if provided
    let parsedVariables = {};
    if (customVariables.trim()) {
      try {
        parsedVariables = JSON.parse(customVariables);
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Custom variables must be valid JSON format.",
          variant: "destructive",
        });
        return;
      }
    }

    // Add customer name to variables if provided
    if (customerName) {
      parsedVariables = {
        ...parsedVariables,
        customer_name: customerName,
        first_name: customerName.split(' ')[0],
        full_name: customerName
      };
    }

    const payload = {
      from_number: fromNumber || selectedAgentData.phone,
      to_number: toNumber,
      override_agent_id: selectedAgent,
      metadata: {
        notes: callNotes,
        initiated_by: "single_call_page",
        timestamp: new Date().toISOString()
      },
      retell_llm_dynamic_variables: parsedVariables
    };

    createSingleCallMutation.mutate(payload);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as E.164 if it's a US number
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    return value;
  };

  const handlePhoneChange = (value: string, setter: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    setter(formatted);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg mb-8">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--manifest-blue))_0%,transparent_50%)]"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)] flex items-center">
              <span className="mr-4 text-[hsl(var(--remax-red))]">📞</span>
              Make Single Call
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Initiate an individual AI phone call to a specific contact</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Call Configuration */}
        <div className="lg:col-span-2">
          <GlassmorphicCard className="border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              Call Configuration
            </h3>
            
            <div className="space-y-6">
              {/* Agent Selection */}
              <div>
                <Label htmlFor="agent-select" className="text-white mb-2 block">Select Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent} disabled={isLoadingAgents}>
                  <SelectTrigger className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white">
                    <SelectValue placeholder={isLoadingAgents ? "Loading agents..." : "Choose an AI agent"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--lunar-glass))] border-white/20">
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()} className="text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">{agent.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-gray-300">{agent.phone}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-number" className="text-white mb-2 block">From Number (Optional)</Label>
                  <Input
                    id="from-number"
                    value={fromNumber}
                    onChange={(e) => handlePhoneChange(e.target.value, setFromNumber)}
                    placeholder={selectedAgentData ? selectedAgentData.phone : "+1(555)000-0000"}
                    className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400"
                  />
                  <p className="text-[hsl(var(--soft-gray))] text-xs mt-1">
                    Leave empty to use agent's default number
                  </p>
                </div>
                <div>
                  <Label htmlFor="to-number" className="text-white mb-2 block">To Number *</Label>
                  <Input
                    id="to-number"
                    value={toNumber}
                    onChange={(e) => handlePhoneChange(e.target.value, setToNumber)}
                    placeholder="+1(555)123-4567"
                    className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <Label htmlFor="customer-name" className="text-white mb-2 block">Customer Name (Optional)</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400"
                />
                <p className="text-[hsl(var(--soft-gray))] text-xs mt-1">
                  Agent will use this name during the conversation
                </p>
              </div>

              {/* Call Notes */}
              <div>
                <Label htmlFor="call-notes" className="text-white mb-2 block">Call Notes (Optional)</Label>
                <Textarea
                  id="call-notes"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Add any notes about this call..."
                  className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                />
              </div>

              {/* Advanced Variables */}
              <div>
                <Label htmlFor="custom-variables" className="text-white mb-2 block">Custom Variables (JSON)</Label>
                <Textarea
                  id="custom-variables"
                  value={customVariables}
                  onChange={(e) => setCustomVariables(e.target.value)}
                  placeholder='{"appointment_type": "consultation", "priority": "high"}'
                  className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400 font-mono text-sm min-h-[80px]"
                />
                <p className="text-[hsl(var(--soft-gray))] text-xs mt-1">
                  Optional JSON object for dynamic variables in agent prompts
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Call Preview & Actions */}
        <div className="space-y-6">
          {/* Call Preview */}
          <GlassmorphicCard className="border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-[hsl(var(--manifest-blue))]" />
              Call Preview
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--soft-gray))]">Agent:</span>
                <span className="text-white font-medium">
                  {selectedAgentData ? selectedAgentData.name : "Not selected"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--soft-gray))]">From:</span>
                <span className="text-white font-mono">
                  {fromNumber || selectedAgentData?.phone || "Agent default"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--soft-gray))]">To:</span>
                <span className="text-white font-mono">
                  {toNumber || "Enter number"}
                </span>
              </div>
              
              {customerName && (
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--soft-gray))]">Customer:</span>
                  <span className="text-white">{customerName}</span>
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Cost Information */}
          <GlassmorphicCard className="border border-[hsl(var(--manifest-blue))]/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[hsl(var(--manifest-blue))]" />
              Cost Estimate
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--soft-gray))]">Voice Engine:</span>
                <span className="text-white">$0.070/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--soft-gray))]">LLM (GPT-4):</span>
                <span className="text-white">$0.040/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--soft-gray))]">Telephony:</span>
                <span className="text-white">$0.015/min</span>
              </div>
              <div className="flex justify-between font-medium border-t border-white/10 pt-2">
                <span className="text-white">Est. per minute:</span>
                <span className="text-[hsl(var(--success-green))]">$0.125</span>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Actions */}
          <div className="space-y-3">
            <CosmicButton 
              variant="eclipse" 
              className="w-full"
              onClick={resetForm}
            >
              Reset Form
            </CosmicButton>
            
            <CosmicButton 
              variant="remax" 
              className="w-full"
              disabled={!selectedAgent || !toNumber || createSingleCallMutation.isPending}
              onClick={handleInitiateCall}
            >
              <Phone className="w-4 h-4 mr-2" />
              {createSingleCallMutation.isPending ? "Initiating Call..." : "Initiate Call"}
            </CosmicButton>
            
            <div className="mt-4 p-3 bg-[hsl(var(--eclipse-glow))]/10 rounded-lg border border-[hsl(var(--eclipse-glow))]/20">
              <p className="text-[hsl(var(--eclipse-glow))] text-xs leading-relaxed">
                💡 The call will be initiated immediately. Make sure the recipient is available to answer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
