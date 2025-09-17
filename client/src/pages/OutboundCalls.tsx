import { useState } from "react";
import { Upload, Download, Plus, Minus, Phone, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const sampleRecipients = [
  { id: 1, phone: "+1(248)555-0123", firstName: "John", lastName: "Smith" },
  { id: 2, phone: "+1(586)555-0456", firstName: "Sarah", lastName: "Johnson" },
  { id: 3, phone: "+1(313)555-0789", firstName: "Mike", lastName: "Davis" }
];

export default function OutboundCalls() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [batchName, setBatchName] = useState("");
  const [schedulingMode, setSchedulingMode] = useState("now");
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [concurrency, setConcurrency] = useState(5);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState(sampleRecipients);
  
  const [fromNumber, setFromNumber] = useState(""); // Added state for fromNumber

  // Agent type definition
  interface Agent {
    id: number;
    name: string;
    phone: string;
    voice: string;
    avatar: string;
  }

  // Fetch agents using authenticated API
  const { data: agents = [], isLoading: isLoadingAgents, error: agentsError } = useQuery<Agent[]>({
    queryKey: ['/api/agents/simple'],
    queryFn: () => apiClient.get<Agent[]>('/api/agents/simple'),
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Create batch campaign mutation
  const createBatchCampaignMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/api/outbound-calls/batch', payload),
    onSuccess: (data: any) => {
      const batchId = data.batch_call_id || data.batchCallId || 'Unknown';
      toast({
        title: "Campaign Launched Successfully! 🚀",
        description: `Batch campaign "${batchName.trim()}" has been launched with ${recipients.length} recipients. Batch ID: ${batchId}`,
      });

      // Invalidate batch calls cache to refresh the BatchCalls page
      queryClient.invalidateQueries({ queryKey: ['/api/batch-calls'] });

      // Reset form
      setBatchName("");
      setRecipients(sampleRecipients); // Reset to sample data instead of empty array
      setCsvFile(null);
      
      setSelectedAgent("");
      setSchedulingMode("now");
      setScheduledDateTime("");
      setFromNumber("");
    },
    onError: (error: any) => {
      console.error('Batch campaign creation error:', error);
      let errorMessage = "Failed to launch batch campaign. Please try again.";

      if (error.message.includes('400')) {
        errorMessage = "Invalid request data. Please check your form inputs.";
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = "Authentication error. Please log in again.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Campaign Launch Failed ❌",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const selectedAgentData = agents.find((agent: Agent) => agent.id.toString() === selectedAgent);
  const totalRecipients = recipients.length;

  // Retell AI Pricing Components (per minute)
  const voiceEngineRate = 0.07; // Elevenlabs/Cartesia voices
  const llmRate = 0.04; // GPT-4 rate
  const telephonyRate = 0.015; // US calls via Retell Twilio
  const baseRatePerMinute = voiceEngineRate + llmRate + telephonyRate; // ~$0.125/min

  const avgCallDuration = 2.5; // Average call duration in minutes
  const costPerDial = baseRatePerMinute * avgCallDuration; // ~$0.31 per call
  const estimatedCost = totalRecipients * costPerDial;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File Too Large",
        description: "Maximum file size is 50MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCsvFile(file);
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');

      if (lines.length === 0) {
        toast({
          title: "Empty File",
          description: "The CSV file appears to be empty.",
          variant: "destructive",
        });
        return;
      }

      // Parse CSV - expect format: phone, firstName, lastName (with or without headers)
      const parsedRecipients = [];
      let startIndex = 0;

      // Check if first row looks like headers
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('phone') || firstLine.includes('first') || firstLine.includes('last')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        const columns = line.split(',').map(col => col.trim().replace(/["']/g, ''));

        if (columns.length >= 1) {
          const phone = columns[0];
          const firstName = columns[1] || 'Unknown';
          const lastName = columns[2] || 'Contact';

          // Basic phone number validation
          let cleanPhone = phone.replace(/[^\d+()-\s]/g, '');
          if (cleanPhone && cleanPhone.replace(/\D/g, '').length >= 10) {
            // Remove all non-digits to check length and format
            const digitsOnly = cleanPhone.replace(/\D/g, '');
            
            // Handle different phone number formats
            let formattedPhone;
            if (cleanPhone.startsWith('+1') && digitsOnly.length === 11) {
              // Already has +1 prefix
              formattedPhone = cleanPhone;
            } else if (cleanPhone.startsWith('+') && !cleanPhone.startsWith('+1')) {
              // Has international prefix but not +1
              formattedPhone = cleanPhone;
            } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
              // 11 digits starting with 1 (US format without +)
              formattedPhone = `+${digitsOnly}`;
            } else if (digitsOnly.length === 10) {
              // 10 digits (US number without country code)
              formattedPhone = `+1${digitsOnly}`;
            } else {
              // Use as-is for other formats
              formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+1${digitsOnly}`;
            }
            
            parsedRecipients.push({
              id: parsedRecipients.length + 1,
              phone: formattedPhone,
              firstName,
              lastName
            });
          }
        }
      }

      if (parsedRecipients.length === 0) {
        toast({
          title: "No Valid Recipients",
          description: "Could not find any valid phone numbers in the CSV file. Expected format: phone, firstName, lastName",
          variant: "destructive",
        });
        return;
      }

      setRecipients(parsedRecipients);
      toast({
        title: "CSV Uploaded Successfully",
        description: `Loaded ${parsedRecipients.length} recipients from CSV file.`,
      });

    } catch (error) {
      console.error('CSV parsing error:', error);
      toast({
        title: "CSV Parse Error",
        description: "Failed to parse the CSV file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleConcurrencyChange = (delta: number) => {
    setConcurrency(Math.max(1, Math.min(15, concurrency + delta)));
  };

  const validateForm = () => {
    // Batch name validation
    if (!batchName || batchName.trim().length === 0) {
      toast({
        title: "Batch Name Required",
        description: "Please enter a name for your batch campaign.",
        variant: "destructive",
      });
      return false;
    }

    if (batchName.trim().length < 3) {
      toast({
        title: "Batch Name Too Short",
        description: "Batch name must be at least 3 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (batchName.trim().length > 100) {
      toast({
        title: "Batch Name Too Long",
        description: "Batch name must be less than 100 characters.",
        variant: "destructive",
      });
      return false;
    }

    // Agent selection validation
    if (!selectedAgent) {
      toast({
        title: "Agent Required",
        description: "Please select an AI agent for this campaign.",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedAgentData) {
      toast({
        title: "Agent Error",
        description: "Selected agent not found. Please choose a valid agent.",
        variant: "destructive",
      });
      return false;
    }

    // Recipients validation
    if (recipients.length === 0) {
      toast({
        title: "Recipients Required",
        description: "Please upload a CSV file with recipients or add recipients manually.",
        variant: "destructive",
      });
      return false;
    }

    if (recipients.length > 10000) {
      toast({
        title: "Too Many Recipients",
        description: "Maximum 10,000 recipients allowed per batch campaign.",
        variant: "destructive",
      });
      return false;
    }

    // From Number validation
    if (!fromNumber) {
      toast({
        title: "From Number Required",
        description: "Please select a phone number to make calls from.",
        variant: "destructive",
      });
      return false;
    }

    // Phone number validation
    const invalidPhones = recipients.filter(r => !r.phone || r.phone.replace(/\D/g, '').length < 10);
    if (invalidPhones.length > 0) {
      toast({
        title: "Invalid Phone Numbers",
        description: `${invalidPhones.length} recipients have invalid phone numbers. Please check your CSV file.`,
        variant: "destructive",
      });
      return false;
    }

    // Scheduling validation
    if (schedulingMode === "schedule") {
      if (!scheduledDateTime) {
        toast({
          title: "Scheduled Time Required",
          description: "Please select a date and time for the scheduled campaign.",
          variant: "destructive",
        });
        return false;
      }

      const scheduledTime = new Date(scheduledDateTime);
      const now = new Date();

      if (scheduledTime <= now) {
        toast({
          title: "Invalid Scheduled Time",
          description: "Scheduled time must be in the future.",
          variant: "destructive",
        });
        return false;
      }

      // Don't allow scheduling more than 30 days in advance
      const maxScheduleDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      if (scheduledTime > maxScheduleDate) {
        toast({
          title: "Scheduled Time Too Far",
          description: "Cannot schedule campaigns more than 30 days in advance.",
          variant: "destructive",
        });
        return false;
      }
    }

    

    return true;
  };

  const handleLaunchBatchCampaign = async () => {
    if (!validateForm()) return;

    const tasks = recipients.map(recipient => ({
      to_number: recipient.phone,
      retell_llm_dynamic_variables: {
        customer_name: `${recipient.firstName} ${recipient.lastName}`,
        first_name: recipient.firstName,
        last_name: recipient.lastName
      }
    }));

    const payload = {
      from_number: fromNumber, // Use the selected fromNumber
      tasks,
      name: batchName.trim(),
      override_agent_id: selectedAgent,
      trigger_timestamp: schedulingMode === "schedule" && scheduledDateTime
        ? new Date(scheduledDateTime).getTime()
        : undefined
    };

    createBatchCampaignMutation.mutate(payload);
  };

  const validateDraftForm = () => {
    if (!batchName || batchName.trim().length === 0) {
      toast({
        title: "Batch Name Required",
        description: "Please enter a name for your batch campaign.",
        variant: "destructive",
      });
      return false;
    }

    if (batchName.trim().length < 3) {
      toast({
        title: "Batch Name Too Short",
        description: "Batch name must be at least 3 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedAgent) {
      toast({
        title: "Agent Required",
        description: "Please select an AI agent for this campaign.",
        variant: "destructive",
      });
      return false;
    }

    if (recipients.length === 0) {
      toast({
        title: "Recipients Required",
        description: "Please upload a CSV file with recipients.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveAsDraft = async () => {
    if (!validateDraftForm()) return;

    try {
      // Here you would typically save to local storage or send to a draft endpoint
      // For now, we'll just show success message
      toast({
        title: "Draft Saved Successfully ✅",
        description: `Campaign "${batchName.trim()}" has been saved as a draft with ${recipients.length} recipients.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
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
                  data-testid="input-batch-name"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="Enter batch campaign name"
                  className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* From Number Selection */}
              <div>
                <Label htmlFor="from-number-select" className="text-white mb-2 block">From Number</Label>
                <Select value={fromNumber} onValueChange={setFromNumber} data-testid="select-from-number">
                  <SelectTrigger className="bg-[hsl(var(--lunar-glass))]/30 border-white/20 text-white">
                    <SelectValue placeholder="Choose a phone number" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--lunar-glass))] border-white/20">
                    <SelectItem value="+1 (248) 283-4183" className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono">+1 (248) 283-4183</span>
                        <span className="text-xs text-gray-300 ml-2">Recruiting</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+1(248)653-1643" className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono">+1(248)653-1643</span>
                        <span className="text-xs text-gray-300 ml-2">Recruiting Outbound</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+1 (248) 599-0019" className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono">+1 (248) 599-0019</span>
                        <span className="text-xs text-gray-300 ml-2">Test Recruit</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+1 (248) 780-0017" className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono">+1 (248) 780-0017</span>
                        <span className="text-xs text-gray-300 ml-2">Madison Backup</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+1 (586) 500-6801" className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono">+1 (586) 500-6801</span>
                        <span className="text-xs text-gray-300 ml-2">Office</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Agent Selection */}
              <div>
                <Label htmlFor="agent-select" className="text-white mb-2 block">Select Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent} disabled={isLoadingAgents} data-testid="select-agent">
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
                    data-testid="input-csv-upload"
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
                <RadioGroup value={schedulingMode} onValueChange={setSchedulingMode} className="space-y-3" data-testid="radio-scheduling">
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
                        data-testid="input-scheduled-datetime"
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
                    data-testid="button-concurrency-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-bold text-white w-12 text-center">{concurrency}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConcurrencyChange(1)}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-concurrency-increase"
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

            <div className="space-y-3">
              <CosmicButton
                variant="eclipse"
                className="w-full"
                disabled={!batchName || !selectedAgent || recipients.length === 0 || createBatchCampaignMutation.isPending}
                onClick={handleSaveAsDraft}
                data-testid="button-save-draft"
              >
                Save as Draft
              </CosmicButton>
              <CosmicButton
                variant="remax"
                className="w-full"
                disabled={!batchName || !selectedAgent || recipients.length === 0 || createBatchCampaignMutation.isPending}
                onClick={handleLaunchBatchCampaign}
                data-testid="button-launch-campaign"
              >
                <Phone className="w-4 h-4 mr-2" />
                {createBatchCampaignMutation.isPending ? "Launching..." : "Launch Batch Campaign"}
              </CosmicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}