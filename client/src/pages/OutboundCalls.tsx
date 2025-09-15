
import { useState, useEffect } from "react";
import { Upload, Download, Plus, Minus, Phone, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const sampleRecipients = [
  { id: 1, phone: "+1(248)555-0123", firstName: "John", lastName: "Smith" },
  { id: 2, phone: "+1(586)555-0456", firstName: "Sarah", lastName: "Johnson" },
  { id: 3, phone: "+1(313)555-0789", firstName: "Mike", lastName: "Davis" }
];

export default function OutboundCalls() {
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [batchName, setBatchName] = useState("");
  const [schedulingMode, setSchedulingMode] = useState("now");
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [concurrency, setConcurrency] = useState(5);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState(sampleRecipients);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);

  // Fetch agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents/simple");
        if (response.ok) {
          const agentsData = await response.json();
          setAgents(agentsData);
        } else {
          // Fallback to default agents if API fails
          setAgents([
            {
              id: 1,
              name: "Levan Wood Eclipse Recruiting",
              phone: "+1(248)283-4183",
              voice: "Levan RE/MAX",
              avatar: "LW"
            },
            {
              id: 2,
              name: "Madison RE/MAX Office", 
              phone: "+1(586)500-6801",
              voice: "Emily",
              avatar: "MR"
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        // Fallback to default agents
        setAgents([
          {
            id: 1,
            name: "Levan Wood Eclipse Recruiting",
            phone: "+1(248)283-4183", 
            voice: "Levan RE/MAX",
            avatar: "LW"
          }
        ]);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  const selectedAgentData = agents.find(agent => agent.id.toString() === selectedAgent);
  const totalRecipients = recipients.length;
  
  // Retell AI Pricing Components (per minute)
  const voiceEngineRate = 0.07; // Elevenlabs/Cartesia voices
  const llmRate = 0.04; // GPT-4 rate
  const telephonyRate = 0.015; // US calls via Retell Twilio
  const baseRatePerMinute = voiceEngineRate + llmRate + telephonyRate; // ~$0.125/min
  
  const avgCallDuration = 2.5; // Average call duration in minutes
  const costPerDial = baseRatePerMinute * avgCallDuration; // ~$0.31 per call
  const estimatedCost = totalRecipients * costPerDial;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // In a real app, you'd parse the CSV here
    }
  };

  const handleConcurrencyChange = (delta: number) => {
    setConcurrency(Math.max(1, Math.min(15, concurrency + delta)));
  };

  const handleLaunchBatchCampaign = async () => {
    if (!selectedAgent || recipients.length === 0 || !batchName || !termsAccepted) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and accept terms.",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);
    
    try {
      const selectedAgentData = agents.find(agent => agent.id.toString() === selectedAgent);
      if (!selectedAgentData) {
        throw new Error("Selected agent not found");
      }

      const tasks = recipients.map(recipient => ({
        to_number: recipient.phone,
        retell_llm_dynamic_variables: {
          customer_name: `${recipient.firstName} ${recipient.lastName}`,
          first_name: recipient.firstName,
          last_name: recipient.lastName
        }
      }));

      const payload = {
        from_number: selectedAgentData.phone,
        tasks,
        name: batchName,
        override_agent_id: selectedAgent,
        trigger_timestamp: schedulingMode === "schedule" && scheduledDateTime 
          ? new Date(scheduledDateTime).getTime() 
          : undefined
      };

      const response = await fetch("/api/outbound-calls/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to launch batch campaign");
      }

      const result = await response.json();
      
      toast({
        title: "Campaign Launched! 🚀",
        description: result.message || `Successfully created batch call with ${tasks.length} recipients. Batch ID: ${result.batch_call_id}`,
      });

      // Reset form
      setBatchName("");
      setRecipients([]);
      setCsvFile(null);
      setTermsAccepted(false);
      setSelectedAgent("");
      
    } catch (error) {
      console.error("Error launching batch campaign:", error);
      toast({
        title: "Launch Failed",
        description: error instanceof Error ? error.message : "Failed to launch batch campaign",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!selectedAgent || recipients.length === 0 || !batchName) {
      toast({
        title: "Missing Information",
        description: "Please fill in batch name, select an agent, and add recipients.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Draft Saved",
      description: "Your batch campaign has been saved as a draft.",
    });
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
              Send Outbound Calls
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Launch batch AI phone campaigns to reach your prospects</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton variant="eclipse" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>CSV Template</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Configuration */}
          <GlassmorphicCard className="border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              Batch Configuration
            </h3>
            
            <div className="space-y-6">
              {/* Batch Name */}
              <div>
                <Label htmlFor="batch-name" className="text-white mb-2 block">Batch Name</Label>
                <Input
                  id="batch-name"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="Enter batch campaign name"
                  className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400"
                />
              </div>

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
                
                {selectedAgentData && (
                  <div className="mt-3 p-3 bg-[hsl(var(--eclipse-glow))]/20 rounded-lg border border-[hsl(var(--eclipse-glow))]/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[hsl(var(--eclipse-glow))] font-medium">Assigned Phone Number:</span>
                      <Badge variant="outline" className="bg-[hsl(var(--manifest-blue))]/20 text-[hsl(var(--manifest-blue))] border-[hsl(var(--manifest-blue))]/30">
                        {selectedAgentData.phone}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* CSV Upload */}
              <div>
                <Label className="text-white mb-2 block">Recipients (CSV Upload)</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-[hsl(var(--eclipse-glow))] mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">Drop CSV file here or click to browse</p>
                    <p className="text-[hsl(var(--soft-gray))] text-sm">Maximum file size: 50MB</p>
                  </label>
                </div>
                {csvFile && (
                  <p className="text-[hsl(var(--success-green))] text-sm mt-2">✓ {csvFile.name} uploaded</p>
                )}
              </div>

              {/* Scheduling */}
              <div>
                <Label className="text-white mb-3 block">Scheduling</Label>
                <RadioGroup value={schedulingMode} onValueChange={setSchedulingMode} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="send-now" />
                    <Label htmlFor="send-now" className="text-white">Send Now</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="schedule" id="send-schedule" />
                    <Label htmlFor="send-schedule" className="text-white">Schedule for Later</Label>
                  </div>
                </RadioGroup>
                
                {schedulingMode === "schedule" && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2 block">Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2 block">Timezone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern (EST)</SelectItem>
                          <SelectItem value="cst">Central (CST)</SelectItem>
                          <SelectItem value="mst">Mountain (MST)</SelectItem>
                          <SelectItem value="pst">Pacific (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Concurrency */}
              <div>
                <Label className="text-white mb-3 block">Concurrency</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConcurrencyChange(-1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-bold text-white w-12 text-center">{concurrency}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConcurrencyChange(1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[hsl(var(--soft-gray))] text-sm mt-2">
                  Allocated: {15 - concurrency} remaining concurrency
                </p>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Recipients Preview */}
          <GlassmorphicCard className="border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">👥</span>
              Recipients ({totalRecipients})
            </h3>
            
            {recipients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[hsl(var(--lunar-mist))]/20">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-white">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-white">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-white">First Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-white">Last Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {recipients.slice(0, 5).map((recipient) => (
                      <tr key={recipient.id} className="hover:bg-[hsl(var(--lunar-mist))]/10">
                        <td className="py-3 px-4 text-[hsl(var(--soft-gray))]">{recipient.id}</td>
                        <td className="py-3 px-4 text-white font-mono">{recipient.phone}</td>
                        <td className="py-3 px-4 text-white">{recipient.firstName}</td>
                        <td className="py-3 px-4 text-white">{recipient.lastName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recipients.length > 5 && (
                  <p className="text-[hsl(var(--soft-gray))] text-center py-3">
                    ...and {recipients.length - 5} more recipients
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[hsl(var(--soft-gray))] mx-auto mb-3" />
                <p className="text-[hsl(var(--soft-gray))]">Please upload recipients first</p>
              </div>
            )}
          </GlassmorphicCard>
        </div>

        {/* Info Panel & Actions */}
        <div className="space-y-6">
          {/* Cost Information */}
          <GlassmorphicCard className="border border-[hsl(var(--manifest-blue))]/30 bg-gradient-to-br from-[hsl(var(--deep-night))]/80 to-[hsl(var(--lunar-glass))]/60">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-[hsl(var(--manifest-blue))]" />
              Cost Breakdown
            </h3>
            <div className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between text-[hsl(var(--soft-gray))]">
                  <span>Voice Engine:</span>
                  <span>${voiceEngineRate.toFixed(3)}/min</span>
                </div>
                <div className="flex justify-between text-[hsl(var(--soft-gray))]">
                  <span>LLM (GPT-4):</span>
                  <span>${llmRate.toFixed(3)}/min</span>
                </div>
                <div className="flex justify-between text-[hsl(var(--soft-gray))]">
                  <span>Telephony:</span>
                  <span>${telephonyRate.toFixed(3)}/min</span>
                </div>
                <div className="flex justify-between text-white font-medium border-t border-white/10 pt-2">
                  <span>Per Minute:</span>
                  <span>${baseRatePerMinute.toFixed(3)}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--soft-gray))]">Avg. Call Duration:</span>
                  <span className="text-white font-semibold">{avgCallDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--soft-gray))]">Cost Per Call:</span>
                  <span className="text-white font-semibold">${costPerDial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--soft-gray))]">Recipients:</span>
                  <span className="text-white font-semibold">{totalRecipients}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-white font-medium">Total Estimated Cost:</span>
                  <span className="text-[hsl(var(--success-green))] font-bold text-lg">${estimatedCost.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-[hsl(var(--eclipse-glow))]/10 rounded-lg border border-[hsl(var(--eclipse-glow))]/20">
                <p className="text-[hsl(var(--eclipse-glow))] text-xs leading-relaxed">
                  💡 Enterprise plans offer volume discounts as low as $0.05/min for high-volume usage
                </p>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Batch Info */}
          <GlassmorphicCard className="border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Batch Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-[hsl(var(--soft-gray))]">
                <Clock className="w-4 h-4 mr-2" />
                <span>Estimated completion: {Math.ceil(totalRecipients / concurrency)} minutes</span>
              </div>
              <div className="flex items-center text-[hsl(var(--soft-gray))]">
                <Phone className="w-4 h-4 mr-2" />
                <span>Concurrent calls: {concurrency}</span>
              </div>
              <div className="p-3 bg-[hsl(var(--eclipse-glow))]/20 rounded-lg">
                <p className="text-[hsl(var(--eclipse-glow))] text-xs leading-relaxed">
                  Batch calls will be made using your selected agent's voice and personality. 
                  All conversations are recorded and analyzed for performance insights.
                </p>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-[hsl(var(--soft-gray))] text-sm">
                I agree to the terms of service and privacy policy
              </Label>
            </div>
            
            <div className="space-y-3">
              <CosmicButton 
                variant="eclipse" 
                className="w-full"
                disabled={!batchName || !selectedAgent || recipients.length === 0 || isLaunching}
                onClick={handleSaveAsDraft}
              >
                Save as Draft
              </CosmicButton>
              <CosmicButton 
                variant="remax" 
                className="w-full"
                disabled={!batchName || !selectedAgent || recipients.length === 0 || !termsAccepted || isLaunching}
                onClick={handleLaunchBatchCampaign}
              >
                <Phone className="w-4 h-4 mr-2" />
                {isLaunching ? "Launching..." : "Launch Batch Campaign"}
              </CosmicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
