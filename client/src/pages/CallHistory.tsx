import { Download, Filter, MessageCircle, Volume2, X } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import TranscriptViewer from "@/components/TranscriptViewer";
import AudioPlayer from "@/components/AudioPlayer";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { type Call } from "@shared/schema";
import { useState, useEffect } from "react";
import { Phone, Clock, User, TrendingUp, Play } from "lucide-react";

export default function CallHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [transcriptCall, setTranscriptCall] = useState<Call | null>(null);
  const [audioCall, setAudioCall] = useState<Call | null>(null);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sentiment: 'all',
    callType: 'all',
    successStatus: 'all',
    direction: 'all',
    callStatus: 'all'
  });

  const { data: calls = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/calls', filters],
    queryFn: async () => {
      try {
        // First try to get detailed call data with filters
        const filterCriteria = buildFilterCriteria();
        const callsData = await apiClient.post('/api/calls/list', {
          filter_criteria: filterCriteria,
          sort_order: 'descending',
          limit: 50
        });
        return Array.isArray(callsData) ? callsData : [];
      } catch (error) {
        console.error('Failed to fetch detailed calls, trying fallback:', error);
        // Fallback to basic calls endpoint and filter client-side
        try {
          const fallbackCalls = await apiClient.get('/api/calls');
          if (Array.isArray(fallbackCalls)) {
            // Apply client-side filtering for fallback data
            return fallbackCalls.filter((call: any) => {
              if (filters.sentiment !== 'all' && call.sentiment !== filters.sentiment && call.userSentiment !== filters.sentiment) {
                return false;
              }
              if (filters.callType !== 'all' && call.callType !== filters.callType) {
                return false;
              }
              if (filters.successStatus !== 'all') {
                const isSuccessful = call.callSuccessful || call.status === 'completed';
                if (filters.successStatus === 'successful' && !isSuccessful) return false;
                if (filters.successStatus === 'failed' && isSuccessful) return false;
              }
              if (filters.direction !== 'all' && call.direction !== filters.direction) {
                return false;
              }
              if (filters.callStatus !== 'all' && call.status !== filters.callStatus && call.callStatus !== filters.callStatus) {
                return false;
              }
              return true;
            });
          }
          return [];
        } catch (fallbackError) {
          console.error('Failed to fetch fallback calls:', fallbackError);
          return [];
        }
      }
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (durationMs: number | null | undefined): string => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString.toString()).toLocaleString();
  };

  const getStatusBadge = (status: string): string => {
    const statusColors: Record<string, string> = {
      'completed': 'bg-green-500',
      'failed': 'bg-red-500',
      'in_progress': 'bg-yellow-500',
      'registered': 'bg-blue-500'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-500';
  };

  const getSentimentEmoji = (sentiment: string | null | undefined): string => {
    if (!sentiment) return '😐';
    const sentimentEmojis: Record<string, string> = {
      'positive': '😊',
      'negative': '😞',
      'neutral': '😐',
      'frustrated': '😤',
      'satisfied': '😌'
    };
    return sentimentEmojis[sentiment.toLowerCase()] || '😐';
  };

  const getSentimentColor = (sentiment: string | null | undefined): string => {
    switch (sentiment) {
      case 'Positive': return 'text-green-400';
      case 'Negative': return 'text-red-400';
      case 'Neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const openTranscript = (call: Call) => {
    setTranscriptCall(call);
    setShowTranscript(true);
  };

  const openAudioPlayer = (call: Call) => {
    setAudioCall(call);
    setShowAudioPlayer(true);
  };

  const closeTranscript = () => {
    setShowTranscript(false);
    setTranscriptCall(null);
  };

  const closeAudioPlayer = () => {
    setShowAudioPlayer(false);
    setAudioCall(null);
  };

  // Filter functions
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      sentiment: 'all',
      callType: 'all',
      successStatus: 'all',
      direction: 'all',
      callStatus: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  // Build filter criteria for API
  const buildFilterCriteria = () => {
    const criteria: any = {};
    
    if (filters.sentiment !== 'all') {
      criteria.user_sentiment = filters.sentiment;
    }
    if (filters.callType !== 'all') {
      criteria.call_type = filters.callType;
    }
    if (filters.successStatus !== 'all') {
      criteria.call_successful = filters.successStatus === 'successful';
    }
    if (filters.direction !== 'all') {
      criteria.direction = filters.direction;
    }
    if (filters.callStatus !== 'all') {
      criteria.call_status = filters.callStatus;
    }
    
    return criteria;
  };

  return (
    <div className="min-h-screen p-8" data-testid="page-call-history">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--lunar-mist))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--manifest-blue))_0%,transparent_50%)]"></div>
        </div>

        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-history" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--lunar-mist))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--manifest-blue))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-history)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-history)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>

        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-8 w-20 h-20 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--gold-manifest))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--remax-red))] rounded-full blur-2xl opacity-10" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)] flex items-center">
              <span className="mr-4">📞</span>
              Call History
            </h1>
            <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Historical AI phone agent performance and call records</p>
          </div>
          <div className="flex items-center space-x-4">
            <CosmicButton 
              variant="eclipse" 
              className={`flex items-center space-x-2 hover:scale-105 transition-transform duration-200 ${
                showFilters ? 'bg-[hsl(var(--eclipse-glow))]/30' : ''
              }`}
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <Badge className="ml-2 bg-[hsl(var(--remax-red))] text-white text-xs px-1.5 py-0.5">
                  {Object.values(filters).filter(v => v !== 'all').length}
                </Badge>
              )}
            </CosmicButton>
            <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mt-6">
          <GlassmorphicCard className="border border-white/10 bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-[hsl(var(--eclipse-glow))]" />
                  Advanced Filters
                </h3>
                <div className="flex items-center space-x-3">
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-white border-white/20 hover:bg-white/10"
                      data-testid="button-clear-filters"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                    data-testid="button-close-filters"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Sentiment Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Sentiment</label>
                  <Select 
                    value={filters.sentiment} 
                    onValueChange={(value) => handleFilterChange('sentiment', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white" data-testid="select-sentiment">
                      <SelectValue placeholder="All Sentiments" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="all">All Sentiments</SelectItem>
                      <SelectItem value="Positive">😊 Positive</SelectItem>
                      <SelectItem value="Negative">😞 Negative</SelectItem>
                      <SelectItem value="Neutral">😐 Neutral</SelectItem>
                      <SelectItem value="Unknown">❓ Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Call Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Call Type</label>
                  <Select 
                    value={filters.callType} 
                    onValueChange={(value) => handleFilterChange('callType', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white" data-testid="select-call-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="phone_call">📞 Phone Call</SelectItem>
                      <SelectItem value="web_call">🌐 Web Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Success Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Success Status</label>
                  <Select 
                    value={filters.successStatus} 
                    onValueChange={(value) => handleFilterChange('successStatus', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white" data-testid="select-success-status">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="successful">✅ Successful</SelectItem>
                      <SelectItem value="failed">❌ Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Direction</label>
                  <Select 
                    value={filters.direction} 
                    onValueChange={(value) => handleFilterChange('direction', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white" data-testid="select-direction">
                      <SelectValue placeholder="All Directions" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="all">All Directions</SelectItem>
                      <SelectItem value="inbound">📥 Inbound</SelectItem>
                      <SelectItem value="outbound">📤 Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Call Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Call Status</label>
                  <Select 
                    value={filters.callStatus} 
                    onValueChange={(value) => handleFilterChange('callStatus', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white" data-testid="select-call-status">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">✅ Completed</SelectItem>
                      <SelectItem value="failed">❌ Failed</SelectItem>
                      <SelectItem value="in_progress">🔄 In Progress</SelectItem>
                      <SelectItem value="registered">📋 Registered</SelectItem>
                      <SelectItem value="ended">🔚 Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    Active filters: 
                    {Object.entries(filters)
                      .filter(([_, value]) => value !== 'all')
                      .map(([key, value]) => (
                        <Badge key={key} className="ml-2 bg-[hsl(var(--eclipse-glow))]/30 text-white border-0">
                          {key}: {value}
                        </Badge>
                      ))
                    }
                  </p>
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </div>
      )}

      {/* Call History Table */}
      <div className="mt-6">
        <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--lunar-mist))]/20">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-white">Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Channel Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Cost</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Session Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">User Sentiment</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">From</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">To</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[hsl(var(--soft-gray))]" data-testid="loading-message">
                      Loading call history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-red-400" data-testid="error-message">
                      Failed to load call history: {error instanceof Error ? error.message : 'Unknown error'}
                    </td>
                  </tr>
                ) : !calls || calls.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[hsl(var(--soft-gray))]" data-testid="no-calls-message">
                      No calls found. Start making some cosmic connections! 🌙
                    </td>
                  </tr>
                ) : (
                  calls.map((call) => (
                    <tr key={call.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`call-row-${call.id}`}>
                      <td className="py-4 px-6 text-white" data-testid={`call-time-${call.id}`}>
                        {formatDateTime(call.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--soft-gray))]" data-testid={`call-duration-${call.id}`}>
                        {formatDuration(call.duration)}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--soft-gray))]">
                        Phone Call
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--soft-gray))]" data-testid={`call-cost-${call.id}`}>
                        {call.cost ? `$${call.cost}` : 'N/A'}
                      </td>
                      <td className="py-4 px-6" data-testid={`call-status-${call.id}`}>
                        <Badge className={`${getStatusBadge(call.status)} text-white border-0`}>
                          {call.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-2xl" data-testid={`call-sentiment-${call.id}`}>
                        {getSentimentEmoji(call.sentiment)}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--soft-gray))]" data-testid={`call-from-${call.id}`}>
                        {call.fromNumber || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--soft-gray))]" data-testid={`call-to-${call.id}`}>
                        {call.toNumber || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassmorphicCard>

        {/* Enhanced Call Cards */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          {calls.length > 0 ? (
            calls.map((call, index) => (
              <GlassmorphicCard key={call.sessionId || call.id || index} className="hover:scale-[1.01] transition-all duration-300 border border-white/10 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {call.fromNumber || call.toNumber || `+1 (555) ${100 + index}-${1000 + index}`}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Phone Call • Agent: {call.agentId || call.retellAgentId || 'AI Agent'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {call.createdAt ? new Date(call.createdAt.toString()).toLocaleTimeString() : 'Time N/A'} • 
                        {formatDuration(call.duration)} duration
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 mb-1">
                        <TrendingUp className={`w-4 h-4 ${getSentimentColor(call.sentiment)}`} />
                        <span className={`text-sm font-medium ${getSentimentColor(call.sentiment)}`}>
                          {call.sentiment || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Sentiment</p>
                    </div>

                    <div className="text-center">
                      <p className={`text-lg font-bold ${call.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
                        {call.status === 'completed' ? '✓' : '✗'}
                      </p>
                      <p className="text-xs text-gray-400">Success</p>
                    </div>

                    <div className="flex space-x-2">
                      <CosmicButton 
                        variant="eclipse" 
                        size="sm"
                        onClick={() => openTranscript(call)}
                        className="flex items-center space-x-1"
                        data-testid={`transcript-button-${call.id}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Transcript</span>
                      </CosmicButton>

                      <CosmicButton 
                        variant="remax" 
                        size="sm"
                        onClick={() => openAudioPlayer(call)}
                        className="flex items-center space-x-1"
                        data-testid={`audio-button-${call.id}`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Audio</span>
                      </CosmicButton>
                    </div>
                  </div>
                </div>

                {call.outcome && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">Outcome: </span>
                      {call.outcome}
                    </p>
                  </div>
                )}
              </GlassmorphicCard>
            ))
          ) : (
            <GlassmorphicCard className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No calls found</h3>
              <p className="text-gray-400">Call history will appear here once you start making calls.</p>
            </GlassmorphicCard>
          )}
        </div>
      </div>

      {/* Transcript Viewer Modal */}
      <TranscriptViewer
        call={transcriptCall}
        isOpen={showTranscript}
        onClose={closeTranscript}
      />

      {/* Audio Player Modal */}
      <Dialog open={showAudioPlayer} onOpenChange={closeAudioPlayer}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 border-white/20 text-white">
          <DialogHeader className="pb-4 border-b border-white/10">
            <DialogTitle className="text-2xl font-bold text-white">
              Call Recording
            </DialogTitle>
            <p className="text-gray-300 text-sm mt-2">
              {audioCall?.fromNumber || audioCall?.toNumber || 'Unknown'} • {formatDuration(audioCall?.durationMs || audioCall?.duration)}
            </p>
          </DialogHeader>
          <div className="py-4">
            <AudioPlayer 
              audioUrl={audioCall?.recordingUrl || audioCall?.recordingMultiChannelUrl}
              title={`Call Recording - ${audioCall?.fromNumber || audioCall?.toNumber || 'Unknown'}`}
              onError={(error) => console.error('Audio player error:', error)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}