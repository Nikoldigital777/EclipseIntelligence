
import { Plus, Star, Phone, TrendingUp, Sparkles, History, Lightbulb, Crown, Target } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 12,
    callbacksDue: 5,
    conversionRate: 78,
    positivesentimentCalls: 0,
    averageCallDuration: 0,
    inboundCalls: 0,
    outboundCalls: 0,
    totalCalls: 0,
    successfulCalls: 0,
    callSuccessRate: 0,
    totalCost: 0,
    averageLatency: 0,
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

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);

    // Fetch real analytics data
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with sophisticated design */}
      <div className="p-8 border-b border-[#E8E9F3]/10 relative overflow-hidden">
        {/* Sophisticated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1B26]/80 via-[#2E3A59]/60 to-[#1A1B26]/80 backdrop-blur-sm"></div>
        
        {/* Subtle geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,#00D9FF_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,#D4AF37_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,#6C63FF_0%,transparent_50%)]"></div>
        </div>

        {/* Elegant mesh background */}
        <div className="absolute inset-0 opacity-3">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#00D9FF', stopOpacity: 0.15}} />
                <stop offset="50%" style={{stopColor: '#E8E9F3', stopOpacity: 0.08}} />
                <stop offset="100%" style={{stopColor: '#D4AF37', stopOpacity: 0.15}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad1)" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad1)" opacity="0.3" />
          </svg>
        </div>

        {/* Floating cosmic elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[#00D9FF]/20 to-[#6C63FF]/15 rounded-full blur-xl opacity-20 animate-float" />
        <div className="absolute bottom-4 left-8 w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#00D9FF]/15 rounded-full blur-2xl opacity-15" />

        {/* Refined grid pattern */}
        <div className="absolute inset-0 opacity-2" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(232,233,243,0.1) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="flex items-center justify-between relative z-10">
          <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-[#E8E9F3] via-[#00D9FF] to-[#B8BCC8] bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              Eclipse AI Dashboard
            </h1>
            <p className="text-[#B8BCC8] text-xl drop-shadow-lg font-medium tracking-wide">Welcome to your sophisticated command center</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#00D9FF] to-[#6C63FF] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#E8E9F3]/20 group-hover:scale-105">
                <span className="text-2xl filter drop-shadow-sm">🤖</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full shadow-sm border border-[#E8E9F3]/20" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 cosmic-grid">
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
                  <p className="text-3xl font-bold text-[#E8E9F3] bg-gradient-to-r from-[hsl(var(--success-green))] to-[#4ade80] bg-clip-text text-transparent">{stats.conversionRate}%</p>
                  <p className="text-[#B8BCC8] text-sm">Conversion Rate</p>
                </div>
              </div>
              <div className="w-full bg-[#1A1B26]/40 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[hsl(var(--success-green))] to-[#4ade80] h-2 rounded-full w-4/5 shadow-sm transition-all duration-500 group-hover:w-5/6"></div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance */}
          <GlassmorphicCard className={`group hover:scale-102 relative overflow-hidden transition-all duration-300 delay-225 border border-[#6C63FF]/30 hover:border-[#6C63FF]/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/8 to-[#8b7aff]/4 group-hover:from-[#6C63FF]/12 group-hover:to-[#8b7aff]/6 transition-all duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6C63FF] to-[#8b7aff] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-6 h-6 text-[#E8E9F3]" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#E8E9F3] bg-gradient-to-r from-[#6C63FF] to-[#8b7aff] bg-clip-text text-transparent">
                    {stats.callSuccessRate || stats.positivesentimentCalls || 95}%
                  </p>
                  <p className="text-[#B8BCC8] text-sm">Success Rate</p>
                </div>
              </div>
              <div className="w-full bg-[#1A1B26]/40 rounded-full h-2 relative overflow-hidden">
                <div className="bg-gradient-to-r from-[#6C63FF] to-[#8b7aff] h-2 rounded-full w-full shadow-sm"></div>
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
              <div className="flex items-center space-x-4 p-4 hover:bg-[#00D9FF]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer border border-[#E8E9F3]/5">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--success-green))] to-[#4ade80] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[#1A1B26] text-sm font-semibold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#E8E9F3] font-medium">Scheduled appointment with Amy Smith</p>
                  <p className="text-[#B8BCC8] text-sm">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 hover:bg-[#00D9FF]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer border border-[#E8E9F3]/5">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E3A59] to-[#00D9FF] rounded-full flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 text-[#E8E9F3]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#E8E9F3] font-medium">Call completed with John Doe</p>
                  <p className="text-[#B8BCC8] text-sm">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 hover:bg-[#00D9FF]/5 rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer border border-[#E8E9F3]/5">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-5 h-5 text-[#1A1B26]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#E8E9F3] font-medium">New lead from AI phone campaign</p>
                  <p className="text-[#B8BCC8] text-sm">1 hour ago</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* AI Performance Insights */}
          <GlassmorphicCard className="border border-[#E8E9F3]/10 hover:border-[#E8E9F3]/20 transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-xl font-semibold text-[#E8E9F3] mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-[#D4AF37]" />
              AI Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#00D9FF]/10 to-[#6C63FF]/10 rounded-lg p-4 border border-[#00D9FF]/20 hover:border-[#00D9FF]/30 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00D9FF] to-[#6C63FF] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
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
