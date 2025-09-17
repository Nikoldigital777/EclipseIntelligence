import { Download, Filter, MessageCircle, Volume2, X, FileText, Eye, DollarSign, Clock, CheckCircle, AlertCircle, PlayCircle, Mic, FileAudio, Activity, TrendingUp, Headphones, BarChart3, Zap, Phone, User, Play } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import TranscriptViewer from "@/components/TranscriptViewer";
import AudioPlayer from "@/components/AudioPlayer";
import RichCallDetails from "@/components/RichCallDetails";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { type Call } from "@shared/schema";
import { useState, useEffect } from "react";

export default function CallHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showRichDetails, setShowRichDetails] = useState(false);
  const [transcriptCall, setTranscriptCall] = useState<Call | null>(null);
  const [audioCall, setAudioCall] = useState<Call | null>(null);
  const [richDetailsCall, setRichDetailsCall] = useState<Call | null>(null);
  
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
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatCost = (cost: number | string | null | undefined): string => {
    if (!cost) return 'N/A';
    const numCost = typeof cost === 'string' ? parseFloat(cost) : cost;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 4
    }).format(numCost);
  };

  const hasRecordings = (call: Call): boolean => {
    return !!(call.recordingUrl || call.recordingMultiChannelUrl || call.scrubbedRecordingUrl);
  };

  const hasTranscript = (call: Call): boolean => {
    return !!(call.transcript && call.transcript.trim().length > 0);
  };

  const getCallQualityIndicator = (call: Call): string => {
    if (call.callSuccessful) return 'High';
    if (call.userSentiment === 'Positive' || call.sentiment === 'positive') return 'Good';
    if (call.userSentiment === 'Neutral' || call.sentiment === 'neutral') return 'Fair';
    return 'Poor';
  };

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'High': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCallTypeDisplay = (call: Call): string => {
    if (call.callType === 'web_call') return '🌐 Web Call';
    if (call.callType === 'phone_call') return '📞 Phone Call';
    return '📞 Phone Call'; // default
  };

  const getDirectionIcon = (direction: string | null | undefined): string => {
    if (direction === 'inbound') return '📥';
    if (direction === 'outbound') return '📤';
    return '↔️';
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
    const normalizedSentiment = sentiment?.toLowerCase();
    switch (normalizedSentiment) {
      case 'positive': 
      case 'satisfied': 
        return 'text-green-400';
      case 'negative': 
      case 'frustrated': 
        return 'text-red-400';
      case 'neutral': 
        return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentDisplay = (call: Call): { emoji: string; text: string; color: string } => {
    const sentiment = call.userSentiment || call.sentiment;
    const normalizedSentiment = sentiment?.toLowerCase();
    
    switch (normalizedSentiment) {
      case 'positive':
        return { emoji: '😊', text: 'Positive', color: 'text-green-400' };
      case 'negative':
        return { emoji: '😞', text: 'Negative', color: 'text-red-400' };
      case 'neutral':
        return { emoji: '😐', text: 'Neutral', color: 'text-yellow-400' };
      case 'frustrated':
        return { emoji: '😤', text: 'Frustrated', color: 'text-red-400' };
      case 'satisfied':
        return { emoji: '😌', text: 'Satisfied', color: 'text-green-400' };
      default:
        return { emoji: '❓', text: 'Unknown', color: 'text-gray-400' };
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

  const openRichDetails = (call: Call) => {
    setRichDetailsCall(call);
    setShowRichDetails(true);
  };

  const closeTranscript = () => {
    setShowTranscript(false);
    setTranscriptCall(null);
  };

  const closeAudioPlayer = () => {
    setShowAudioPlayer(false);
    setAudioCall(null);
  };

  const closeRichDetails = () => {
    setShowRichDetails(false);
    setRichDetailsCall(null);
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
      // Retell API requires user_sentiment to be an array with capitalized values
      const capitalizedSentiment = filters.sentiment.charAt(0).toUpperCase() + filters.sentiment.slice(1).toLowerCase();
      criteria.user_sentiment = [capitalizedSentiment];
    }
    if (filters.callType !== 'all') {
      // Retell API requires call_type to be an array
      criteria.call_type = [filters.callType];
    }
    if (filters.successStatus !== 'all') {
      // Retell API requires call_successful to be an array
      criteria.call_successful = [filters.successStatus === 'successful'];
    }
    if (filters.direction !== 'all') {
      // Retell API requires direction to be an array
      criteria.direction = [filters.direction];
    }
    if (filters.callStatus !== 'all') {
      // Retell API requires call_status to be an array
      criteria.call_status = [filters.callStatus];
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
                  <th className="text-left py-4 px-6 font-semibold text-white">Time & Direction</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Type & Quality</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Cost</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Sentiment</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Contact Info</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Media</th>
                  <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[hsl(var(--soft-gray))]" data-testid="loading-message">
                      <div className="flex flex-col items-center">
                        <Activity className="w-8 h-8 animate-pulse mb-2" />
                        <span>Loading enhanced call history...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-red-400" data-testid="error-message">
                      Failed to load call history: {error instanceof Error ? error.message : 'Unknown error'}
                    </td>
                  </tr>
                ) : !calls || calls.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[hsl(var(--soft-gray))]" data-testid="no-calls-message">
                      <div className="flex flex-col items-center">
                        <Phone className="w-12 h-12 mb-4 opacity-50" />
                        <span>No calls found. Start making some cosmic connections! 🌙</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  calls.map((call) => {
                    const sentimentInfo = getSentimentDisplay(call);
                    const quality = getCallQualityIndicator(call);
                    const hasRec = hasRecordings(call);
                    const hasTrans = hasTranscript(call);
                    
                    return (
                      <tr key={call.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`call-row-${call.id}`}>
                        {/* Time & Direction */}
                        <td className="py-4 px-6" data-testid={`call-time-${call.id}`}>
                          <div className="text-white text-sm font-medium">
                            {formatDateTime(call.createdAt)}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <span className="mr-1">{getDirectionIcon(call.direction)}</span>
                            <span>{call.direction || 'Unknown'}</span>
                          </div>
                        </td>
                        
                        {/* Duration */}
                        <td className="py-4 px-6" data-testid={`call-duration-${call.id}`}>
                          <div className="flex items-center text-[hsl(var(--soft-gray))]">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatDuration(call.durationMs || call.duration)}</span>
                          </div>
                        </td>
                        
                        {/* Type & Quality */}
                        <td className="py-4 px-6">
                          <div className="text-[hsl(var(--soft-gray))] text-sm">
                            {getCallTypeDisplay(call)}
                          </div>
                          <div className={`text-xs mt-1 flex items-center ${getQualityColor(quality)}`}>
                            <BarChart3 className="w-3 h-3 mr-1" />
                            <span>{quality} Quality</span>
                          </div>
                        </td>
                        
                        {/* Cost */}
                        <td className="py-4 px-6" data-testid={`call-cost-${call.id}`}>
                          <div className="flex items-center text-[hsl(var(--soft-gray))]">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{formatCost(call.cost)}</span>
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="py-4 px-6" data-testid={`call-status-${call.id}`}>
                          <Badge className={`${getStatusBadge(call.callStatus || call.status)} text-white border-0`}>
                            {call.callSuccessful ? (
                              <span className="flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Success
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {call.callStatus || call.status || 'Failed'}
                              </span>
                            )}
                          </Badge>
                        </td>
                        
                        {/* Sentiment */}
                        <td className="py-4 px-6" data-testid={`call-sentiment-${call.id}`}>
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{sentimentInfo.emoji}</span>
                            <div>
                              <div className={`text-sm font-medium ${sentimentInfo.color}`}>
                                {sentimentInfo.text}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Contact Info */}
                        <td className="py-4 px-6" data-testid={`call-contact-${call.id}`}>
                          <div className="text-[hsl(var(--soft-gray))] text-sm">
                            <div className="flex items-center mb-1">
                              <span className="text-xs text-gray-500 mr-1">From:</span>
                              <span>{call.fromNumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-1">To:</span>
                              <span>{call.toNumber || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Media */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {hasRec && (
                              <div className="flex items-center text-green-400" title="Recording Available">
                                <Headphones className="w-4 h-4" />
                              </div>
                            )}
                            {hasTrans && (
                              <div className="flex items-center text-blue-400" title="Transcript Available">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                            {!hasRec && !hasTrans && (
                              <span className="text-gray-500 text-xs">No Media</span>
                            )}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex space-x-1">
                            <CosmicButton 
                              variant="eclipse" 
                              size="sm"
                              onClick={() => openRichDetails(call)}
                              className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200"
                              data-testid={`view-details-button-${call.id}`}
                            >
                              <Eye className="w-3 h-3" />
                            </CosmicButton>
                            
                            {hasTrans && (
                              <CosmicButton 
                                variant="secondary" 
                                size="sm"
                                onClick={() => openTranscript(call)}
                                className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200"
                                data-testid={`transcript-button-${call.id}`}
                              >
                                <MessageCircle className="w-3 h-3" />
                              </CosmicButton>
                            )}
                            
                            {hasRec && (
                              <CosmicButton 
                                variant="remax" 
                                size="sm"
                                onClick={() => openAudioPlayer(call)}
                                className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200"
                                data-testid={`audio-button-${call.id}`}
                              >
                                <Volume2 className="w-3 h-3" />
                              </CosmicButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </GlassmorphicCard>

        {/* Enhanced Call Cards */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          {calls.length > 0 ? (
            calls.map((call, index) => {
              const sentimentInfo = getSentimentDisplay(call);
              const quality = getCallQualityIndicator(call);
              const hasRec = hasRecordings(call);
              const hasTrans = hasTranscript(call);
              
              return (
                <GlassmorphicCard key={call.sessionId || call.id || index} className="hover:scale-[1.01] transition-all duration-300 border border-white/10 hover:border-white/20">
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          call.callType === 'web_call' 
                            ? 'bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))]'
                            : 'bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))]'
                        }`}>
                          {call.callType === 'web_call' ? (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          ) : (
                            <Phone className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center">
                            <span className="mr-2">{getDirectionIcon(call.direction)}</span>
                            {call.fromNumber || call.toNumber || `+1 (555) ${100 + index}-${1000 + index}`}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {getCallTypeDisplay(call)} • Agent: {call.agentId || call.retellAgentId || 'AI Agent'}
                          </p>
                          <div className="flex items-center space-x-4 text-gray-400 text-xs mt-1">
                            <span>{call.createdAt ? new Date(call.createdAt.toString()).toLocaleTimeString() : 'Time N/A'}</span>
                            <span>{formatDuration(call.durationMs || call.duration)}</span>
                            <span>{formatCost(call.cost)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* Quality Indicator */}
                        <div className="text-center">
                          <div className={`flex items-center space-x-1 mb-1 ${getQualityColor(quality)}`}>
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-sm font-medium">{quality}</span>
                          </div>
                          <p className="text-xs text-gray-400">Quality</p>
                        </div>

                        {/* Sentiment */}
                        <div className="text-center">
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-lg">{sentimentInfo.emoji}</span>
                            <span className={`text-sm font-medium ${sentimentInfo.color}`}>
                              {sentimentInfo.text}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">Sentiment</p>
                        </div>

                        {/* Success Status */}
                        <div className="text-center">
                          <div className="flex items-center space-x-1 mb-1">
                            {call.callSuccessful ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">Status</p>
                        </div>

                        {/* Media Indicators */}
                        <div className="text-center">
                          <div className="flex items-center space-x-2 mb-1">
                            {hasRec && (
                              <Headphones className="w-4 h-4 text-green-400" />
                            )}
                            {hasTrans && (
                              <FileText className="w-4 h-4 text-blue-400" />
                            )}
                            {!hasRec && !hasTrans && (
                              <div className="w-4 h-4 opacity-20">
                                <X className="w-4 h-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">Media</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <CosmicButton 
                          variant="secondary" 
                          size="sm"
                          onClick={() => openRichDetails(call)}
                          className="flex items-center space-x-1"
                          data-testid={`view-details-card-button-${call.id}`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>Full Details</span>
                        </CosmicButton>

                        {hasTrans && (
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
                        )}

                        {hasRec && (
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
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {call.latency && (
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{call.latency}ms</span>
                          </div>
                        )}
                        {call.disconnectionReason && (
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span className="truncate max-w-24">{call.disconnectionReason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call Summary/Outcome */}
                    {call.outcome && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Call Summary:</p>
                            <p className="text-sm text-gray-300">{call.outcome}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Analysis Data */}
                    {(call.inVoicemail || call.endReason) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {call.inVoicemail && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Mic className="w-3 h-3 mr-1" />
                            Voicemail
                          </Badge>
                        )}
                        {call.endReason && (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            {call.endReason}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </GlassmorphicCard>
              );
            })
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

      {/* Rich Call Details Modal */}
      <RichCallDetails
        call={richDetailsCall}
        isOpen={showRichDetails}
        onClose={closeRichDetails}
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
            <div className="space-y-4">
              {/* Recording Selection */}
              {audioCall && (
                <div className="grid grid-cols-1 gap-3">
                  {audioCall.recordingUrl && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Standard Recording</span>
                        <FileAudio className="w-4 h-4 text-blue-400" />
                      </div>
                      <AudioPlayer 
                        audioUrl={audioCall.recordingUrl}
                        title="Standard Recording"
                        onError={(error) => console.error('Audio player error:', error)}
                      />
                    </div>
                  )}
                  
                  {audioCall.recordingMultiChannelUrl && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Multi-Channel Recording</span>
                        <Headphones className="w-4 h-4 text-green-400" />
                      </div>
                      <AudioPlayer 
                        audioUrl={audioCall.recordingMultiChannelUrl}
                        title="Multi-Channel Recording"
                        onError={(error) => console.error('Audio player error:', error)}
                      />
                    </div>
                  )}
                  
                  {audioCall.scrubbedRecordingUrl && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Privacy-Protected Recording</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-purple-400">PII Removed</span>
                        </div>
                      </div>
                      <AudioPlayer 
                        audioUrl={audioCall.scrubbedRecordingUrl}
                        title="Privacy-Protected Recording"
                        onError={(error) => console.error('Audio player error:', error)}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {!audioCall?.recordingUrl && !audioCall?.recordingMultiChannelUrl && !audioCall?.scrubbedRecordingUrl && (
                <div className="text-center py-8 text-gray-400">
                  <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recordings available for this call</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}