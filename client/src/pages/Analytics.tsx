
import { Phone, Users, TrendingUp, BarChart3, Download, CheckCircle, Clock, DollarSign, Zap, Activity, PieChart, Target, ArrowUpDown } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/auth";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from 'recharts';

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
      by_day?: Record<string, number>;
      by_hour?: Record<string, number>;
    };
    summary: {
      total_calls: number;
      total_duration_hours: number;
      total_cost: number;
      success_rate: number;
    };
    performance: {
      sentiment_distribution: Record<string, number>;
      latency_stats: {
        avg_latency: number;
        p95_latency?: number;
        p99_latency?: number;
      };
      cost_analysis: {
        cost_per_call: number;
        cost_per_minute: number;
        daily_costs?: Record<string, number>;
      };
      call_types?: {
        web_call: number;
        phone_call: number;
      };
      duration_distribution?: Record<string, number>;
    };
    quality_metrics: {
      resolution_rate: number;
    };
    trends?: {
      daily_success_rates?: Array<{ date: string; rate: number; calls: number }>;
      weekly_performance?: Array<{ week: string; success_rate: number; total_calls: number; avg_duration: number; total_cost: number }>;
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

  // Data processing functions for charts
  const processSentimentData = useMemo(() => {
    if (!stats?.sentimentBreakdown && !detailedAnalytics?.performance?.sentiment_distribution) {
      return [];
    }
    
    const sentimentData = stats?.sentimentBreakdown || detailedAnalytics?.performance?.sentiment_distribution || {};
    const colors = {
      positive: 'hsl(149, 87%, 47%)', // success-green
      negative: 'hsl(350, 84%, 56%)', // remax-red
      neutral: 'hsl(41, 100%, 50%)', // accent-gold
      unknown: 'hsl(226, 25%, 73%)', // soft-gray
      satisfied: 'hsl(149, 87%, 47%)',
      frustrated: 'hsl(350, 84%, 56%)'
    };
    
    return Object.entries(sentimentData).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(value),
      fill: colors[name as keyof typeof colors] || 'hsl(226, 25%, 73%)'
    })).filter(item => item.value > 0);
  }, [stats, detailedAnalytics]);

  const processCallDirectionData = useMemo(() => {
    if (!detailedAnalytics?.call_volume?.by_direction) return [];
    const { inbound, outbound } = detailedAnalytics.call_volume.by_direction;
    return [
      { name: 'Inbound', value: inbound, fill: 'hsl(185, 100%, 62%)' }, // eclipse-glow
      { name: 'Outbound', value: outbound, fill: 'hsl(245, 100%, 70%)' } // lunar-mist
    ].filter(item => item.value > 0);
  }, [detailedAnalytics]);

  const processCallTypeData = useMemo(() => {
    if (!detailedAnalytics?.performance?.call_types) {
      // Generate mock data based on total calls for demonstration
      const totalCalls = detailedAnalytics?.summary?.total_calls || stats?.totalCalls || 0;
      const phonePercentage = 0.7; // Assume 70% phone calls
      return [
        { name: 'Phone Calls', calls: Math.floor(totalCalls * phonePercentage), percentage: phonePercentage * 100 },
        { name: 'Web Calls', calls: Math.floor(totalCalls * (1 - phonePercentage)), percentage: (1 - phonePercentage) * 100 }
      ];
    }
    const { web_call, phone_call } = detailedAnalytics.performance.call_types;
    const total = web_call + phone_call;
    return [
      { 
        name: 'Phone Calls', 
        calls: phone_call, 
        percentage: total > 0 ? (phone_call / total) * 100 : 0 
      },
      { 
        name: 'Web Calls', 
        calls: web_call, 
        percentage: total > 0 ? (web_call / total) * 100 : 0 
      }
    ];
  }, [detailedAnalytics, stats]);

  const processDurationData = useMemo(() => {
    if (detailedAnalytics?.performance?.duration_distribution) {
      return Object.entries(detailedAnalytics.performance.duration_distribution)
        .map(([duration, count]) => ({ duration, count: Number(count) }))
        .sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    }
    // Generate mock duration distribution for demonstration
    return [
      { duration: '0-2 min', count: Math.floor(Math.random() * 20) + 5 },
      { duration: '2-5 min', count: Math.floor(Math.random() * 30) + 15 },
      { duration: '5-10 min', count: Math.floor(Math.random() * 25) + 10 },
      { duration: '10-15 min', count: Math.floor(Math.random() * 15) + 5 },
      { duration: '15+ min', count: Math.floor(Math.random() * 10) + 2 }
    ];
  }, [detailedAnalytics]);

  const processTrendData = useMemo(() => {
    if (detailedAnalytics?.trends?.daily_success_rates) {
      return detailedAnalytics.trends.daily_success_rates.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        'Success Rate': item.rate,
        'Total Calls': item.calls
      }));
    }
    // Generate mock trend data for demonstration
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString(),
        'Success Rate': Math.floor(Math.random() * 30) + 70, // 70-100%
        'Total Calls': Math.floor(Math.random() * 50) + 20
      };
    });
    return days;
  }, [detailedAnalytics]);

  const processCostTrendData = useMemo(() => {
    if (detailedAnalytics?.performance?.cost_analysis?.daily_costs) {
      return Object.entries(detailedAnalytics.performance.cost_analysis.daily_costs)
        .map(([date, cost]) => ({ 
          date: new Date(date).toLocaleDateString(), 
          cost: Number(cost) 
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    // Generate mock cost trend data
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString(),
        cost: Number((Math.random() * 10 + 5).toFixed(2))
      };
    });
    return days;
  }, [detailedAnalytics]);

  // Custom tooltip component with cosmic theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[hsl(var(--lunar-glass))]/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-200" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.dataKey === 'cost' ? formatCurrency(entry.value) : 
                entry.dataKey.includes('Rate') ? `${entry.value}%` : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
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

        {/* Success Rate Trends */}
        <div className="mb-8">
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-success-trends">
              <TrendingUp className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
              Success Rate Trends
            </h3>
            <div className="h-80" data-testid="chart-success-trends">
              {detailedLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-gray))/20" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: 'white' }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="Success Rate"
                      stroke="hsl(var(--success-green))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success-green))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--success-green))', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="Total Calls"
                      stroke="hsl(var(--eclipse-glow))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--eclipse-glow))', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sentiment Analysis Pie Chart */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-sentiment-analysis">
              <PieChart className="w-5 h-5 mr-3 text-[hsl(var(--accent-gold))]" />
              Sentiment Analysis
            </h3>
            <div className="h-80" data-testid="chart-sentiment-pie">
              {statsLoading || detailedLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : processSentimentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={processSentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {processSentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[hsl(var(--lunar-glass))]/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
                              <p className="text-white font-semibold">{payload[0].name}</p>
                              <p className="text-gray-200">{payload[0].value} calls</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: 'white' }}
                      iconType="circle"
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No sentiment data available
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Call Direction Analysis */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-call-direction">
              <ArrowUpDown className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
              Call Direction Analysis
            </h3>
            <div className="h-80" data-testid="chart-call-direction">
              {detailedLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : processCallDirectionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={processCallDirectionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {processCallDirectionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[hsl(var(--lunar-glass))]/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
                              <p className="text-white font-semibold">{payload[0].name}</p>
                              <p className="text-gray-200">{payload[0].value} calls</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: 'white' }}
                      iconType="circle"
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No direction data available
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Call Type Breakdown */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-call-types">
              <Phone className="w-5 h-5 mr-3 text-[hsl(var(--lunar-mist))]" />
              Call Type Breakdown
            </h3>
            <div className="h-80" data-testid="chart-call-types">
              {detailedLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processCallTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-gray))/20" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="calls" 
                      fill="hsl(var(--lunar-mist))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassmorphicCard>

          {/* Duration Distribution */}
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-duration-distribution">
              <Clock className="w-5 h-5 mr-3 text-[hsl(var(--accent-gold))]" />
              Duration Distribution
            </h3>
            <div className="h-80" data-testid="chart-duration-distribution">
              {detailedLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processDurationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-gray))/20" />
                    <XAxis 
                      dataKey="duration" 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--accent-gold))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Cost Analysis */}
        <div className="mb-8">
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-cost-trends">
              <DollarSign className="w-5 h-5 mr-3 text-[hsl(var(--remax-red))]" />
              Cost Analysis Over Time
            </h3>
            <div className="h-80" data-testid="chart-cost-trends">
              {detailedLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processCostTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-gray))/20" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--soft-gray))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="hsl(var(--remax-red))"
                      fill="hsl(var(--remax-red))/30"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Performance Metrics Enhanced */}
        <div className="mb-8">
          <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center" data-testid="title-performance-metrics">
              <Activity className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {detailedAnalytics?.performance ? (
                <>
                  <div className="p-6 bg-gradient-to-br from-[hsl(var(--eclipse-glow))]/15 to-[hsl(var(--lunar-mist))]/8 rounded-lg border border-[hsl(var(--eclipse-glow))]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 text-sm">Average Latency</span>
                      <Zap className="w-4 h-4 text-[hsl(var(--eclipse-glow))]" />
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {Math.round(detailedAnalytics.performance.latency_stats.avg_latency)}ms
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Response time</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-[hsl(var(--remax-red))]/15 to-[hsl(var(--accent-gold))]/8 rounded-lg border border-[hsl(var(--remax-red))]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 text-sm">Cost per Minute</span>
                      <DollarSign className="w-4 h-4 text-[hsl(var(--remax-red))]" />
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {formatCurrency(detailedAnalytics.performance.cost_analysis.cost_per_minute)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Per minute rate</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-[hsl(var(--success-green))]/15 to-[hsl(var(--eclipse-glow))]/8 rounded-lg border border-[hsl(var(--success-green))]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 text-sm">Resolution Rate</span>
                      <Target className="w-4 h-4 text-[hsl(var(--success-green))]" />
                    </div>
                    <p className="text-3xl font-bold text-[hsl(var(--success-green))]">
                      {Math.round(detailedAnalytics.quality_metrics?.resolution_rate || 0)}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Success rate</p>
                  </div>
                </>
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  {detailedLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                      Loading performance metrics...
                    </div>
                  ) : (
                    'No performance data available'
                  )}
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
