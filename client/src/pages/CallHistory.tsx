import { Download, Filter } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { type Call } from "@shared/schema";
import { useState, useEffect } from "react";
import { Phone, Clock, User, TrendingUp, Play } from "lucide-react";

export default function CallHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);

    // Fetch calls with detailed data
    const fetchCalls = async () => {
      try {
        const callsData = await apiClient.post('/api/calls/list', {
          filter_criteria: {},
          sort_order: 'descending',
          limit: 50
        });
        setCalls(Array.isArray(callsData) ? callsData : []);
      } catch (error) {
        console.error('Failed to fetch calls:', error);
        // Fallback to basic calls
        try {
          const fallbackCalls = await apiClient.get('/api/calls');
          setCalls(fallbackCalls);
        } catch (fallbackError) {
          console.error('Failed to fetch fallback calls:', fallbackError);
        }
      }
    };

    fetchCalls();
  }, []);

  const formatDuration = (durationMs) => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'completed': 'bg-green-500',
      'failed': 'bg-red-500',
      'in_progress': 'bg-yellow-500',
      'registered': 'bg-blue-500'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-500';
  };

  const getSentimentEmoji = (sentiment) => {
    if (!sentiment) return '😐';
    const sentimentEmojis = {
      'positive': '😊',
      'negative': '😞',
      'neutral': '😐',
      'frustrated': '😤',
      'satisfied': '😌'
    };
    return sentimentEmojis[sentiment.toLowerCase()] || '😐';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'text-green-400';
      case 'Negative': return 'text-red-400';
      case 'Neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
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
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl opacity-20 animate-pulse" />
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
            <CosmicButton variant="eclipse" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </CosmicButton>
            <CosmicButton variant="remax" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CosmicButton>
          </div>
        </div>
      </div>

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
                        {call.cost || 'N/A'}
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
                        {call.fromNumber}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--soft-gray))]" data-testid={`call-to-${call.id}`}>
                        {call.toNumber}
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
              <GlassmorphicCard key={call.call_id || call.id || index} className="hover:scale-[1.01] transition-all duration-300 border border-white/10 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {call.direction === 'inbound' ? call.from_number : call.to_number || `+1 (555) ${100 + index}-${1000 + index}`}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {call.direction || 'Unknown'} Call • Agent: {call.agent_id || 'AI Agent'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {call.start_timestamp ? new Date(call.start_timestamp).toLocaleTimeString() : 'Time N/A'} • 
                        {formatDuration(call.duration_ms)} duration
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 mb-1">
                        <TrendingUp className={`w-4 h-4 ${getSentimentColor(call.call_analysis?.user_sentiment)}`} />
                        <span className={`text-sm font-medium ${getSentimentColor(call.call_analysis?.user_sentiment)}`}>
                          {call.call_analysis?.user_sentiment || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Sentiment</p>
                    </div>

                    <div className="text-center">
                      <p className={`text-lg font-bold ${call.call_analysis?.call_successful ? 'text-green-400' : 'text-red-400'}`}>
                        {call.call_analysis?.call_successful ? '✓' : '✗'}
                      </p>
                      <p className="text-xs text-gray-400">Success</p>
                    </div>

                    {call.recording_url && (
                      <CosmicButton 
                        variant="lunar" 
                        size="sm"
                        onClick={() => window.open(call.recording_url, '_blank')}
                      >
                        <Play className="w-4 h-4" />
                      </CosmicButton>
                    )}

                    <CosmicButton 
                      variant="eclipse" 
                      size="sm"
                      onClick={() => setSelectedCall(call)}
                    >
                      View Details
                    </CosmicButton>
                  </div>
                </div>

                {call.call_analysis?.call_summary && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">Summary: </span>
                      {call.call_analysis.call_summary}
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
    </div>
  );
}