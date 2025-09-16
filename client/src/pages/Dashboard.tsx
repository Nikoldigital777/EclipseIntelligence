import { Plus, Star, Phone, TrendingUp, Sparkles, History, Lightbulb, Crown, Target } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/auth";
import { useQuery } from '@tanstack/react-query';

interface StatsData {
    totalLeads: number;
    hotLeads: number;
    callbacksDue: number;
    totalCalls: number;
    successfulCalls: number;
    activeAgents: number;
    conversionRate: number;
    averageCallDuration?: number;
    totalCost?: number;
    callSuccessRate?: number;
    sentimentBreakdown?: {
      positive: number;
      neutral: number;
      negative: number;
      frustrated: number;
      satisfied: number;
    };
    weeklyTrends?: { date: string; value: number }[];
    topPerformingAgents?: { id: string; name: string; avatar: string; callsToday: number; successRate: number; lastActivity: string }[];
  }

interface CallData {
  id: string;
  name: string;
  phone: string;
  duration: string;
  status: string;
  sentiment: string;
  time: string;
}

interface AgentData {
  id: string;
  name: string;
  avatar: string;
  status: string;
  callsToday: number;
  successRate: number;
  lastActivity: string;
}

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    totalLeads: 0,
    hotLeads: 0,
    callbacksDue: 0,
    totalCalls: 0,
    successfulCalls: 0,
    activeAgents: 0,
    conversionRate: 0,
    todaysCalls: 0,
    averageCallDuration: 0,
    positivesentimentCalls: 0,
    sentimentBreakdown: {
      positive: 0,
      neutral: 0,
      negative: 0,
      frustrated: 0,
      satisfied: 0
    },
    weeklyTrends: [],
    topPerformingAgents: []
  });
  const [recentCalls, setRecentCalls] = useState<CallData[]>([]);
  const [activeAgents, setActiveAgents] = useState<AgentData[]>([]);
  const [greeting, setGreeting] = useState("Welcome");
  const [currentTime, setCurrentTime] = useState("");

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };


  // Function to get greeting based on time
  const getGreeting = (): string => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const hour = easternTime.getHours();

    // Determine if it's EDT or EST
    const isEDT = now.getTimezoneOffset() !== easternTime.getTimezoneOffset();
    const timezone = isEDT ? "EDT" : "EST";

    // Format time
    const timeString = easternTime.toLocaleTimeString("en-US", {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    setCurrentTime(`${timeString} ${timezone}`);

    if (hour < 12) {
      return "Good morning, Levan";
    } else if (hour < 17) {
      return "Good afternoon, Levan";
    } else {
      return "Good evening, Levan";
    }
  };

  useEffect(() => {
    // Set initial greeting
    setGreeting(getGreeting());

    // Update greeting every minute
    const greetingInterval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(greetingInterval);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Import AuthService dynamically to avoid circular imports
        const { AuthService } = await import('@/lib/auth');

        // Fetch analytics stats
        const statsResponse = await AuthService.makeAuthenticatedRequest('/api/analytics/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch recent calls
        const callsResponse = await AuthService.makeAuthenticatedRequest('/api/calls/list', {
          method: 'POST',
          body: JSON.stringify({
            filter_criteria: {},
            sort_order: 'descending',
            limit: 5
          })
        });
        if (callsResponse.ok) {
          const callsData: { calls: any[] } = await callsResponse.json();
          if (callsData.calls) {
            const formattedCalls: CallData[] = callsData.calls.map(call => ({
              id: call.call_id,
              name: call.metadata?.customer_name || "Unknown Caller",
              phone: call.to_number || call.from_number,
              duration: call.duration_ms ? `${Math.floor(call.duration_ms / 60000)}:${String(Math.floor((call.duration_ms % 60000) / 1000)).padStart(2, '0')}` : "0:00",
              status: call.call_status === 'completed' ? 'Completed' : 'Missed',
              sentiment: call.call_analysis?.user_sentiment || 'Unknown',
              time: new Date(call.start_timestamp).toLocaleTimeString()
            }));
            setRecentCalls(formattedCalls);
          }
        }

        // Fetch agents
        const agentsResponse = await AuthService.makeAuthenticatedRequest('/api/agents/simple');
        if (agentsResponse.ok) {
          const agentsData: AgentData[] = await agentsResponse.json();
          const formattedAgents: AgentData[] = agentsData.slice(0, 3).map((agent, index) => ({
            id: agent.id,
            name: agent.name,
            avatar: agent.avatar,
            status: index === 0 ? "Active" : "Idle",
            callsToday: Math.floor(Math.random() * 20) + 5,
            successRate: Math.floor(Math.random() * 20) + 75,
            lastActivity: index === 0 ? "2 min ago" : `${Math.floor(Math.random() * 60) + 5} min ago`
          }));
          setActiveAgents(formattedAgents);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // If authentication fails, user will be redirected to login
      }
    };

    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen">
      {/* Header with sophisticated design */}
      <div className="p-8 border-b border-[#E8E9F3]/10 relative overflow-hidden">
        {/* Subtle sophisticated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1B26]/70 via-[#1c1d28]/80 to-[#1A1B26]/70 backdrop-blur-sm"></div>

        {/* Very subtle accent hints */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#00D9FF_0%,transparent_60%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,#2E3A59_0%,transparent_60%)]"></div>
        </div>

        {/* Minimal grid pattern */}
        <div className="absolute inset-0 opacity-1" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(232,233,243,0.05) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>

        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-[#E8E9F3] via-[#00D9FF] to-[#B8BCC8] bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              {greeting}
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-[#B8BCC8] text-xl drop-shadow-lg font-medium tracking-wide">Welcome to your sophisticated command center</p>
              <div className="flex items-center space-x-2 bg-[#1A1B26]/40 backdrop-blur-sm rounded-lg px-3 py-1 border border-[#E8E9F3]/10">
                <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse"></div>
                <span className="text-[#E8E9F3] text-sm font-medium">{currentTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="group relative ai-avatar">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00D9FF] to-[#6C63FF] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#E8E9F3]/20 group-hover:scale-105">
                  <span className="text-2xl filter drop-shadow-sm">🤖</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00D9FF] rounded-full shadow-sm border border-[#E8E9F3]/20" />
              </div>
            </div>
            <CosmicButton variant="accent" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </CosmicButton>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 dashboard-stats">
          {/* Today's Leads */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 border border-[#2E3A59]/30 hover:border-[#00D9FF]/40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#2E3A59]/8 to-[#00D9FF]/4 group-hover:from-[#2E3A59]/12 group-hover:to-[#00D9FF]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2E3A59] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2E3A59] to-[#00D9FF] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Star className="w-6 h-6 text-[#E8E9F3]" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#E8E9F3]">{stats.totalLeads}</p>
                  <p className="text-[#B8BCC8] text-sm">Total Leads</p>
                </div>
              </div>
              <div className="w-full bg-[#1A1B26]/40 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[#2E3A59] to-[#00D9FF] h-2 rounded-full w-3/4 shadow-sm transition-all duration-500 group-hover:w-4/5"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Callbacks Due */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-75 border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-[#f4d03f]/4 group-hover:from-[#D4AF37]/12 group-hover:to-[#f4d03f]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Phone className="w-6 h-6 text-[#1A1B26]" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#E8E9F3]">{stats.callbacksDue}</p>
                  <p className="text-[#B8BCC8] text-sm">Callbacks Due</p>
                </div>
              </div>
              <div className="w-full bg-[#1A1B26]/40 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#f4d03f] h-2 rounded-full w-2/3 shadow-sm transition-all duration-500 group-hover:w-3/4"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Conversion Rate */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-150 border border-[hsl(var(--success-green))]/30 hover:border-[hsl(var(--success-green))]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--success-green))]/8 to-[#4ade80]/4 group-hover:from-[hsl(var(--success-green))]/12 group-hover:to-[#4ade80]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--success-green))] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--success-green))] to-[#4ade80] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="w-6 h-6 text-[#1A1B26]" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#E8E9F3] bg-gradient-to-r from-[hsl(var(--success-green))] to-[#4ade80] bg-clip-text text-transparent">{formatPercentage(stats.conversionRate)}</p>
                  <p className="text-[#B8BCC8] text-sm">Conversion Rate</p>
                </div>
              </div>
              <div className="w-full bg-[#1A1B26]/40 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--success-green))] to-[#4ade80] h-2 rounded-full w-4/5 shadow-sm transition-all duration-500 group-hover:w-5/6"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-225 border border-[#00D9FF]/30 hover:border-[#00D9FF]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/8 to-[#2E3A59]/4 group-hover:from-[#00D9FF]/12 group-hover:to-[#2E3A59]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#2E3A59] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-6 h-6 text-[#E8E9F3]" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#E8E9F3] bg-gradient-to-r from-[#00D9FF] to-[#2E3A59] bg-clip-text text-transparent">
                    {stats.successfulCalls > 0 ? formatPercentage(stats.successfulCalls / stats.totalCalls * 100) : 0}
                  </p>
                  <p className="text-[#B8BCC8] text-sm">Success Rate</p>
                </div>
              </div>
              <div className="w-full bg-[#1A1B26]/40 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[#00D9FF] to-[#2E3A59] h-2 rounded-full w-full shadow-sm"></div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Recent Activity & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <GlassmorphicCard className="border border-[#E8E9F3]/10 hover:border-[#E8E9F3]/20 transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-xl font-semibold text-[#E8E9F3] mb-6 flex items-center">
              <History className="w-5 h-5 mr-3 text-[#00D9FF]" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentCalls.map(call => (
                <div key={call.id} className="flex items-center space-x-4 p-4 hover:bg-[#00D9FF]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer border border-[#E8E9F3]/5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${call.status === 'Completed' ? 'bg-gradient-to-br from-[hsl(var(--success-green))] to-[#4ade80]' : 'bg-gradient-to-br from-[#D4AF37] to-[#f4d03f]'}`}>
                    <span className="text-[#1A1B26] text-sm font-semibold">
                      {call.status === 'Completed' ? '✓' : <Phone className="w-5 h-5" />}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#E8E9F3] font-medium">{call.name}</p>
                    <p className="text-[#B8BCC8] text-sm">{call.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphicCard>

          {/* AI Performance Insights */}
          <GlassmorphicCard className="border border-[#E8E9F3]/10 hover:border-[#E8E9F3]/20 transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-xl font-semibold text-[#E8E9F3] mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-[#D4AF37]" />
              AI Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#00D9FF]/10 to-[#2E3A59]/10 rounded-lg p-4 border border-[#00D9FF]/20 hover:border-[#00D9FF]/30 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00D9FF] to-[#2E3A59] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Lightbulb className="w-4 h-4 text-[#E8E9F3]" />
                  </div>
                  <div>
                    <p className="text-[#E8E9F3] font-medium mb-1">AI Agent Tip</p>
                    <p className="text-[#B8BCC8] text-sm">
                      Call new leads within 15 minutes for optimal results. Your conversion rate increases by 47% with immediate follow-up.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#f4d03f]/10 rounded-lg p-4 border border-[#D4AF37]/20 hover:border-[#D4AF37]/30 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#f4d03f] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Crown className="w-4 h-4 text-[#1A1B26]" />
                  </div>
                  <div>
                    <p className="text-[#E8E9F3] font-medium mb-1">Priority Alert</p>
                    <p className="text-[#B8BCC8] text-sm">
                      3 high-value leads are ready for immediate contact. AI analysis shows optimal conversion timing!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}