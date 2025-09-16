
import { Phone, Users, TrendingUp, BarChart3, Download, CheckCircle, Clock, DollarSign, Zap } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";

export default function Analytics() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');

  interface StatsData {
    totalCalls: number;
    callSuccessRate: number;
    averageCallDuration: number;
    totalCost: number;
    sentimentBreakdown: Record<string, number>;
    topPerformingAgents: Array<{
      agent_id: string;
      total_calls: number;
      success_rate: number;
      avg_duration: number;
      sentiment_rate: number;
    }>;
  }

  interface DetailedAnalyticsData {
    call_volume: {
      by_direction: {
        inbound: number;
        outbound: number;
      };
    };
    summary: {
      total_duration_hours: number;
    };
    performance: {
      latency_stats: {
        avg_latency: number;
      };
      cost_analysis: {
        cost_per_call: number;
        cost_per_minute: number;
      };
    };
    quality_metrics: {
      resolution_rate: number;
    };
  }

  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ['/api/analytics/stats'],
    queryFn: () => apiClient.get<StatsData>('/api/analytics/stats'),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: detailedAnalytics, isLoading: detailedLoading } = useQuery<DetailedAnalyticsData>({
    queryKey: ['/api/analytics/detailed', timeframe],
    queryFn: () => apiClient.get<DetailedAnalyticsData>(`/api/analytics/detailed?timeframe=${timeframe}`),
    refetchInterval: 60000 // Refresh every minute
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatCurrency = (amount: number | null | undefined): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
              Advanced Analytics
            </h1>
            <p className="text-gray-200 text-lg drop-shadow-lg">
              Real-time performance metrics and AI call intelligence
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-[hsl(var(--lunar-glass))] text-white px-4 py-2 rounded-lg border border-white/20 focus:border-[hsl(var(--remax-red))] outline-none"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
            <CosmicButton variant="remax" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Main Analytics Dashboard */}
      <div className="p-8">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Calls */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 border border-[hsl(var(--primary-blue))]/30 hover:border-[hsl(var(--primary-blue))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-blue))]/15 to-[hsl(var(--eclipse-glow))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--primary-blue))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? '...' : (stats?.totalCalls || 0)}
                  </p>
                  <p className="text-gray-200 text-sm">Total Calls</p>
                </div>
              </div>
              {detailedAnalytics?.call_volume && (
                <div className="text-xs text-gray-300">
                  Inbound: {detailedAnalytics.call_volume.by_direction.inbound} | 
                  Outbound: {detailedAnalytics.call_volume.by_direction.outbound}
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Success Rate */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-150 border border-[hsl(var(--success-green))]/30 hover:border-[hsl(var(--success-green))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--success-green))]/15 to-[hsl(var(--eclipse-glow))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--success-green))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? '...' : `${Math.round(stats?.callSuccessRate || 0)}%`}
                  </p>
                  <p className="text-gray-200 text-sm">Success Rate</p>
                </div>
              </div>
              <div className="w-full bg-[hsl(var(--deep-night))]/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[hsl(var(--success-green))] to-[hsl(var(--eclipse-glow))] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round(stats?.callSuccessRate || 0)}%` }}
                ></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Average Duration */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-300 border border-[hsl(var(--accent-gold))]/30 hover:border-[hsl(var(--accent-gold))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-gold))]/15 to-[hsl(var(--lunar-mist))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent-gold))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-gold))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? '...' : formatDuration(stats?.averageCallDuration || 0)}
                  </p>
                  <p className="text-gray-200 text-sm">Avg Duration</p>
                </div>
              </div>
              {detailedAnalytics?.summary && (
                <div className="text-xs text-gray-300">
                  Total: {formatDuration(detailedAnalytics.summary.total_duration_hours * 3600)}
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Total Cost */}
          <GlassmorphicCard className={`hover-glow relative overflow-hidden transition-all duration-700 delay-500 border border-[hsl(var(--remax-red))]/30 hover:border-[hsl(var(--remax-red))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--remax-red))]/15 to-[hsl(var(--accent-gold))]/8" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--remax-red))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--accent-gold))] rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? '...' : formatCurrency(stats?.totalCost || 0)}
                  </p>
                  <p className="text-gray-200 text-sm">Total Cost</p>
                </div>
              </div>
              {detailedAnalytics?.performance?.cost_analysis && (
                <div className="text-xs text-gray-300">
                  {formatCurrency(detailedAnalytics.performance.cost_analysis.cost_per_call)}/call
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Detailed Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Breakdown */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              {detailedAnalytics?.performance ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                    <span className="text-gray-200">Average Latency</span>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(detailedAnalytics.performance.latency_stats.avg_latency)}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--lunar-glass))]/30 rounded-lg border border-white/10">
                    <span className="text-gray-200">Cost per Minute</span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(detailedAnalytics.performance.cost_analysis.cost_per_minute)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[hsl(var(--success-green))]/20 to-[hsl(var(--eclipse-glow))]/20 rounded-lg border border-[hsl(var(--success-green))]/30">
                    <span className="text-gray-200">Resolution Rate</span>
                    <span className="text-2xl font-bold text-[hsl(var(--success-green))]">
                      {Math.round(detailedAnalytics.quality_metrics?.resolution_rate || 0)}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  {detailedLoading ? 'Loading detailed metrics...' : 'No detailed data available'}
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Sentiment Analysis */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-3 text-[hsl(var(--accent-gold))]" />
              Sentiment Analysis
            </h3>
            <div className="space-y-4">
              {stats?.sentimentBreakdown ? (
                Object.entries(stats.sentimentBreakdown).map(([sentiment, count]) => (
                  <div key={sentiment} className="flex items-center justify-between p-3 bg-[hsl(var(--lunar-glass))]/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        sentiment === 'positive' || sentiment === 'satisfied' ? 'bg-[hsl(var(--success-green))]' :
                        sentiment === 'negative' || sentiment === 'frustrated' ? 'bg-[hsl(var(--remax-red))]' :
                        'bg-[hsl(var(--soft-gray))]'
                      }`}></div>
                      <span className="text-white capitalize">{sentiment}</span>
                    </div>
                    <span className="text-lg font-semibold text-white">{count}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  {statsLoading ? 'Loading sentiment data...' : 'No sentiment data available'}
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Agent Performance */}
        {stats?.topPerformingAgents && stats.topPerformingAgents.length > 0 && (
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-3 text-[hsl(var(--primary-blue))]" />
              Top Performing Agents
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white">Agent ID</th>
                    <th className="text-left py-3 px-4 text-white">Calls</th>
                    <th className="text-left py-3 px-4 text-white">Success Rate</th>
                    <th className="text-left py-3 px-4 text-white">Avg Duration</th>
                    <th className="text-left py-3 px-4 text-white">Sentiment Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topPerformingAgents.map((agent, index) => (
                    <tr key={agent.agent_id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-gray-200">{agent.agent_id}</td>
                      <td className="py-3 px-4 text-white">{agent.total_calls}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${agent.success_rate >= 80 ? 'text-green-400' : agent.success_rate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {agent.success_rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-200">{formatDuration(agent.avg_duration)}</td>
                      <td className="py-3 px-4 text-gray-200">{agent.sentiment_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassmorphicCard>
        )}
      </div>
    </div>
  );
}
