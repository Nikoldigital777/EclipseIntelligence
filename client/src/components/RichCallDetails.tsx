import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Phone, 
  User, 
  Bot, 
  Copy, 
  Download, 
  DollarSign, 
  Zap,
  Activity,
  MessageCircle,
  Volume2,
  Settings,
  Database,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Map,
  Globe,
  PhoneCall
} from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { type Call } from "@shared/schema";

interface RichCallDetailsProps {
  call: Call | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RichCallDetails({ call, isOpen, onClose }: RichCallDetailsProps) {
  const [copied, setCopied] = useState(false);

  const formatDuration = (durationMs: number | null | undefined): string => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatTimestamp = (timestamp: number | null | undefined): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatCurrency = (amount: string | null | undefined): string => {
    if (!amount) return 'N/A';
    const numAmount = parseFloat(amount);
    return isNaN(numAmount) ? 'N/A' : `$${numAmount.toFixed(4)}`;
  };

  const getStatusIcon = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'ended':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'in_progress':
      case 'ongoing':
        return <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'registered':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string | null | undefined): string => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'negative': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'neutral': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSentimentEmoji = (sentiment: string | null | undefined): string => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '❓';
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(`Failed to copy ${label}:`, err);
    }
  };

  const parseJsonSafely = (jsonString: string | null | undefined) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return jsonString;
    }
  };

  if (!call) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 border-white/20 text-white overflow-hidden" data-testid="rich-call-details-modal">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold text-white mb-2 flex items-center">
                <Phone className="w-8 h-8 mr-3 text-[hsl(var(--eclipse-glow))]" />
                Call Details
              </DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(call.callStatus || call.status)}
                  <span className="font-medium">{call.callStatus || call.status || 'Unknown'}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/20" />
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimestamp(call.startTimestamp)}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/20" />
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>{formatDuration(call.durationMs || call.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="grid w-full grid-cols-6 bg-white/5 border-white/10" data-testid="call-details-tabs">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[hsl(var(--eclipse-glow))]/30">
                <PhoneCall className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="participants" className="text-white data-[state=active]:bg-[hsl(var(--eclipse-glow))]/30">
                <User className="w-4 h-4 mr-2" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-white data-[state=active]:bg-[hsl(var(--eclipse-glow))]/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-white data-[state=active]:bg-[hsl(var(--eclipse-glow))]/30">
                <Zap className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="content" className="text-white data-[state=active]:bg-[hsl(var(--eclipse-glow))]/30">
                <MessageCircle className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-white data-[state=active]:bg-[hsl(var(--eclipse-glow))]/30">
                <Settings className="w-4 h-4 mr-2" />
                Technical
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100%-3rem)] mt-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6" data-testid="tab-overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Call Status */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-[hsl(var(--eclipse-glow))]" />
                      Call Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Status:</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(call.callStatus || call.status)}
                          <Badge className="bg-white/10 text-white border-white/20">
                            {call.callStatus || call.status || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Direction:</span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {call.direction === 'inbound' ? '📥 Inbound' : call.direction === 'outbound' ? '📤 Outbound' : 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Call Type:</span>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {call.callType === 'web_call' ? '🌐 Web Call' : call.callType === 'phone_call' ? '📞 Phone Call' : 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Successful:</span>
                        <Badge className={call.callSuccessful ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}>
                          {call.callSuccessful ? '✅ Yes' : '❌ No'}
                        </Badge>
                      </div>
                      {call.disconnectionReason && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Disconnect Reason:</span>
                          <span className="text-yellow-300">{call.disconnectionReason}</span>
                        </div>
                      )}
                      {call.inVoicemail !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">In Voicemail:</span>
                          <Badge className={call.inVoicemail ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}>
                            {call.inVoicemail ? '📧 Yes' : 'No'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </GlassmorphicCard>

                  {/* Call Timing */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-[hsl(var(--manifest-blue))]" />
                      Timing
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300">Start Time:</span>
                          <CosmicButton 
                            variant="eclipse" 
                            size="sm" 
                            onClick={() => copyToClipboard(formatTimestamp(call.startTimestamp), 'start time')}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </CosmicButton>
                        </div>
                        <span className="text-white text-sm">{formatTimestamp(call.startTimestamp)}</span>
                      </div>
                      {call.endTimestamp && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300">End Time:</span>
                            <CosmicButton 
                              variant="eclipse" 
                              size="sm" 
                              onClick={() => copyToClipboard(formatTimestamp(call.endTimestamp), 'end time')}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </CosmicButton>
                          </div>
                          <span className="text-white text-sm">{formatTimestamp(call.endTimestamp)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Duration:</span>
                        <span className="text-white font-medium">{formatDuration(call.durationMs || call.duration)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Created:</span>
                        <span className="text-gray-400 text-sm">{new Date(call.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </div>

                {/* Call IDs */}
                <GlassmorphicCard className="border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-[hsl(var(--gold-manifest))]" />
                    Call Identifiers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300">Session ID:</span>
                        <CosmicButton 
                          variant="eclipse" 
                          size="sm" 
                          onClick={() => copyToClipboard(call.sessionId, 'session ID')}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </CosmicButton>
                      </div>
                      <code className="text-sm text-[hsl(var(--eclipse-glow))] bg-black/30 px-2 py-1 rounded">{call.sessionId}</code>
                    </div>
                    {call.retellCallId && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300">Retell Call ID:</span>
                          <CosmicButton 
                            variant="eclipse" 
                            size="sm" 
                            onClick={() => copyToClipboard(call.retellCallId!, 'retell call ID')}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </CosmicButton>
                        </div>
                        <code className="text-sm text-[hsl(var(--eclipse-glow))] bg-black/30 px-2 py-1 rounded">{call.retellCallId}</code>
                      </div>
                    )}
                  </div>
                </GlassmorphicCard>
              </TabsContent>

              {/* Participants Tab */}
              <TabsContent value="participants" className="space-y-6" data-testid="tab-participants">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Caller Information */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-[hsl(var(--primary-blue))]" />
                      Caller Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">From Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono">{call.fromNumber || 'N/A'}</span>
                          {call.fromNumber && (
                            <CosmicButton 
                              variant="eclipse" 
                              size="sm" 
                              onClick={() => copyToClipboard(call.fromNumber!, 'from number')}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3" />
                            </CosmicButton>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">To Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono">{call.toNumber || 'N/A'}</span>
                          {call.toNumber && (
                            <CosmicButton 
                              variant="eclipse" 
                              size="sm" 
                              onClick={() => copyToClipboard(call.toNumber!, 'to number')}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3" />
                            </CosmicButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>

                  {/* Agent Information */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-[hsl(var(--lunar-mist))]" />
                      Agent Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Agent ID:</span>
                        <span className="text-white">{call.agentId || 'N/A'}</span>
                      </div>
                      {call.retellAgentId && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300">Retell Agent ID:</span>
                            <CosmicButton 
                              variant="eclipse" 
                              size="sm" 
                              onClick={() => copyToClipboard(call.retellAgentId!, 'retell agent ID')}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </CosmicButton>
                          </div>
                          <code className="text-sm text-[hsl(var(--lunar-mist))] bg-black/30 px-2 py-1 rounded">{call.retellAgentId}</code>
                        </div>
                      )}
                      {call.agentVersion && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Agent Version:</span>
                          <Badge className="bg-[hsl(var(--lunar-mist))]/20 text-[hsl(var(--lunar-mist))] border-[hsl(var(--lunar-mist))]/30">
                            v{call.agentVersion}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </GlassmorphicCard>
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="space-y-6" data-testid="tab-analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sentiment Analysis */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-[hsl(var(--remax-red))]" />
                      Sentiment Analysis
                    </h3>
                    <div className="space-y-4">
                      {call.userSentiment && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">{getSentimentEmoji(call.userSentiment)}</div>
                          <Badge className={`${getSentimentColor(call.userSentiment)} text-lg px-3 py-1`}>
                            {call.userSentiment}
                          </Badge>
                          <p className="text-gray-400 text-sm mt-2">User Sentiment</p>
                        </div>
                      )}
                      {call.sentiment && call.sentiment !== call.userSentiment && (
                        <div className="text-center">
                          <Badge className={`${getSentimentColor(call.sentiment)} px-3 py-1`}>
                            {call.sentiment}
                          </Badge>
                          <p className="text-gray-400 text-sm mt-1">Legacy Sentiment</p>
                        </div>
                      )}
                    </div>
                  </GlassmorphicCard>

                  {/* Call Outcome */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      Call Outcome
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Success:</span>
                        <Badge className={call.callSuccessful ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}>
                          {call.callSuccessful ? '✅ Successful' : '❌ Failed'}
                        </Badge>
                      </div>
                      {call.outcome && (
                        <div>
                          <span className="text-gray-300 block mb-2">Outcome Description:</span>
                          <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                            <p className="text-white text-sm">{call.outcome}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassmorphicCard>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6" data-testid="tab-performance">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cost */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                      Cost
                    </h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {formatCurrency(call.cost)}
                      </div>
                      <p className="text-gray-400 text-sm">Total Call Cost</p>
                    </div>
                  </GlassmorphicCard>

                  {/* Latency */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      Latency
                    </h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        {call.latency ? `${call.latency}ms` : 'N/A'}
                      </div>
                      <p className="text-gray-400 text-sm">Response Time</p>
                    </div>
                  </GlassmorphicCard>

                  {/* Duration */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-400" />
                      Duration
                    </h3>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {formatDuration(call.durationMs || call.duration)}
                      </div>
                      <p className="text-gray-400 text-sm">Call Length</p>
                    </div>
                  </GlassmorphicCard>
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6" data-testid="tab-content">
                {/* Recordings */}
                <GlassmorphicCard className="border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Volume2 className="w-5 h-5 mr-2 text-[hsl(var(--eclipse-glow))]" />
                    Recordings & Content
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {call.recordingUrl && (
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
                          <div>
                            <p className="text-white font-medium">Main Recording</p>
                            <p className="text-gray-400 text-xs">Single channel audio</p>
                          </div>
                          <CosmicButton variant="eclipse" size="sm" onClick={() => window.open(call.recordingUrl!, '_blank')}>
                            <Volume2 className="w-4 h-4 mr-1" />
                            Play
                          </CosmicButton>
                        </div>
                      )}
                      {call.recordingMultiChannelUrl && (
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
                          <div>
                            <p className="text-white font-medium">Multi-Channel</p>
                            <p className="text-gray-400 text-xs">Separate agent/user tracks</p>
                          </div>
                          <CosmicButton variant="eclipse" size="sm" onClick={() => window.open(call.recordingMultiChannelUrl!, '_blank')}>
                            <Volume2 className="w-4 h-4 mr-1" />
                            Play
                          </CosmicButton>
                        </div>
                      )}
                    </div>

                    {/* Scrubbed Recordings */}
                    {(call.scrubbedRecordingUrl || call.scrubbedRecordingMultiChannelUrl) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Scrubbed Recordings (PII Removed)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {call.scrubbedRecordingUrl && (
                            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
                              <div>
                                <p className="text-white font-medium">Scrubbed Recording</p>
                                <p className="text-gray-400 text-xs">PII removed</p>
                              </div>
                              <CosmicButton variant="eclipse" size="sm" onClick={() => window.open(call.scrubbedRecordingUrl!, '_blank')}>
                                <Volume2 className="w-4 h-4 mr-1" />
                                Play
                              </CosmicButton>
                            </div>
                          )}
                          {call.scrubbedRecordingMultiChannelUrl && (
                            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
                              <div>
                                <p className="text-white font-medium">Scrubbed Multi-Channel</p>
                                <p className="text-gray-400 text-xs">PII removed, separate tracks</p>
                              </div>
                              <CosmicButton variant="eclipse" size="sm" onClick={() => window.open(call.scrubbedRecordingMultiChannelUrl!, '_blank')}>
                                <Volume2 className="w-4 h-4 mr-1" />
                                Play
                              </CosmicButton>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {call.publicLogUrl && (
                        <CosmicButton variant="remax" size="sm" onClick={() => window.open(call.publicLogUrl!, '_blank')} className="flex items-center justify-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Public Logs
                        </CosmicButton>
                      )}
                      {call.knowledgeBaseRetrievedContentsUrl && (
                        <CosmicButton variant="remax" size="sm" onClick={() => window.open(call.knowledgeBaseRetrievedContentsUrl!, '_blank')} className="flex items-center justify-center">
                          <Database className="w-4 h-4 mr-2" />
                          Knowledge Base
                        </CosmicButton>
                      )}
                      {call.transcript && (
                        <CosmicButton 
                          variant="remax" 
                          size="sm" 
                          onClick={() => copyToClipboard(call.transcript!, 'transcript')} 
                          className="flex items-center justify-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Copy Transcript
                        </CosmicButton>
                      )}
                    </div>
                  </div>
                </GlassmorphicCard>
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent value="technical" className="space-y-6" data-testid="tab-technical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Settings */}
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-[hsl(var(--manifest-blue))]" />
                      Call Settings
                    </h3>
                    <div className="space-y-3">
                      {call.dataStorageSetting && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Data Storage:</span>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {call.dataStorageSetting.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Signed URL:</span>
                        <Badge className={call.optInSignedUrl ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}>
                          {call.optInSignedUrl ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      {call.accessToken && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300">Access Token:</span>
                            <CosmicButton 
                              variant="eclipse" 
                              size="sm" 
                              onClick={() => copyToClipboard(call.accessToken!, 'access token')}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </CosmicButton>
                          </div>
                          <code className="text-xs text-[hsl(var(--eclipse-glow))] bg-black/30 px-2 py-1 rounded block truncate">
                            {call.accessToken.substring(0, 30)}...
                          </code>
                        </div>
                      )}
                    </div>
                  </GlassmorphicCard>

                  {/* Dynamic Variables */}
                  {(call.retellLlmDynamicVariables || call.collectedDynamicVariables) && (
                    <GlassmorphicCard className="border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Map className="w-5 h-5 mr-2 text-[hsl(var(--gold-manifest))]" />
                        Dynamic Variables
                      </h3>
                      <div className="space-y-4">
                        {call.retellLlmDynamicVariables && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">LLM Variables</h4>
                            <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                              <pre className="text-xs text-gray-300 overflow-x-auto">
                                {JSON.stringify(parseJsonSafely(call.retellLlmDynamicVariables), null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        {call.collectedDynamicVariables && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Collected Variables</h4>
                            <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                              <pre className="text-xs text-gray-300 overflow-x-auto">
                                {JSON.stringify(parseJsonSafely(call.collectedDynamicVariables), null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </GlassmorphicCard>
                  )}
                </div>

                {/* Metadata */}
                {call.metadata && (
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2 text-[hsl(var(--eclipse-glow))]" />
                      Metadata
                    </h3>
                    <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        {JSON.stringify(parseJsonSafely(call.metadata), null, 2)}
                      </pre>
                      <CosmicButton 
                        variant="eclipse" 
                        size="sm" 
                        onClick={() => copyToClipboard(call.metadata!, 'metadata')}
                        className="mt-3"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Metadata
                      </CosmicButton>
                    </div>
                  </GlassmorphicCard>
                )}

                {/* SIP Headers */}
                {call.customSipHeaders && (
                  <GlassmorphicCard className="border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-[hsl(var(--manifest-blue))]" />
                      Custom SIP Headers
                    </h3>
                    <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        {JSON.stringify(parseJsonSafely(call.customSipHeaders), null, 2)}
                      </pre>
                    </div>
                  </GlassmorphicCard>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Copy notification */}
        {copied && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            ✅ Copied to clipboard!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}