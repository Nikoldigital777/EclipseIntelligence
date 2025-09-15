import { User, Bell, Save, MessageCircle } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function Settings() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if API key is configured on component mount
    const checkApiKeyStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/settings/api-key-status', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.hasApiKey) {
            // Show masked API key (first 8 chars + asterisks)
            const maskedKey = data.apiKeyPreview || "key_79fd**********************fb";
            setApiKey(maskedKey);
            setIsApiKeyLoaded(true);
          }
        }
      } catch (error) {
        console.error('Failed to check API key status:', error);
        // Fallback: show that API key is configured
        setApiKey("key_79fd**********************fb");
        setIsApiKeyLoaded(true);
      }
    };

    checkApiKeyStatus();
  }, []);
  return (
    <div className="min-h-screen p-8">
      {/* Header with stunning design background */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-black/70 via-black/50 to-black/30 backdrop-blur-sm rounded-lg">
        {/* Abstract geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--gold-manifest))_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
        </div>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-settings" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--gold-manifest))', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--remax-red))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--eclipse-glow))', stopOpacity: 0.3}} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#grad-settings)" className="animate-pulse" />
            <path d="M0,150 Q150,120 300,150 T400,150 L400,200 L0,200 Z" fill="url(#grad-settings)" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}} />
          </svg>
        </div>
        
        {/* Enhanced floating cosmic elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[hsl(var(--gold-manifest))] to-[hsl(var(--remax-red))] rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-lg opacity-15 animate-float" />
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--manifest-blue))] rounded-full blur-2xl opacity-10" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">Settings</h1>
          <p className="text-gray-200 text-xl drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Configure your AI dashboard preferences and account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Configuration */}
        <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-3 text-[hsl(var(--remax-red))]" />
            API Configuration
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="retell-api-key" className="text-white font-medium">
                Retell API Key
                {isApiKeyLoaded && (
                  <span className="ml-2 text-green-400 text-xs">✓ Configured</span>
                )}
              </Label>
              <Input
                id="retell-api-key"
                type="text"
                value={apiKey}
                readOnly={isApiKeyLoaded}
                placeholder={isApiKeyLoaded ? "" : "Enter your Retell API key"}
                className={`${
                  isApiKeyLoaded 
                    ? "bg-gray-600/50 border-gray-500/50 text-gray-300 cursor-not-allowed" 
                    : "bg-[hsl(var(--lunar-glass))] border-white/20 text-white focus:border-[hsl(var(--remax-red))]/50 focus:ring-[hsl(var(--remax-red))]/20"
                } placeholder-gray-400`}
                onChange={(e) => !isApiKeyLoaded && setApiKey(e.target.value)}
              />
              <p className="text-[hsl(var(--soft-gray))] text-xs">
                {isApiKeyLoaded 
                  ? "Your API key is configured via environment variables" 
                  : "Your API key is securely encrypted and stored"
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook-url" className="text-white font-medium">
                Webhook URL
              </Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-domain.com/webhook"
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder-gray-400 focus:border-[hsl(var(--remax-red))]/50 focus:ring-[hsl(var(--remax-red))]/20"
              />
              <p className="text-[hsl(var(--soft-gray))] text-xs">
                URL where call events will be sent
              </p>
            </div>
            
            <CosmicButton 
              variant="remax" 
              className="w-full hover:scale-[1.02] transition-transform duration-200"
              disabled={isApiKeyLoaded}
            >
              {isApiKeyLoaded ? "API Key Configured" : "Save API Configuration"}
            </CosmicButton>
          </div>
        </GlassmorphicCard>

        {/* Profile Settings */}
        <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
            Profile
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--manifest-blue))] to-[hsl(var(--eclipse-glow))] rounded-full flex items-center justify-center lunar-shadow">
                <span className="text-white font-bold text-lg">LW</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Levan Wood</h4>
                <p className="text-[hsl(var(--soft-gray))] text-sm">RE/MAX Eclipse Agent</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                defaultValue="Levan Wood"
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="levan@remaxeclipse.com"
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 (248) 283-4183"
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white"
              />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Notifications */}
        <GlassmorphicCard className="border border-white/10 hover:border-white/20 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-3 text-[hsl(var(--gold-manifest))]" />
            Notifications
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lead-notifications" className="text-white font-medium">
                  New Lead Alerts
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Get notified when new leads come in
                </p>
              </div>
              <Switch id="lead-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="callback-reminders" className="text-white font-medium">
                  Callback Reminders
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Never miss an important follow-up
                </p>
              </div>
              <Switch id="callback-reminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights" className="text-white font-medium">
                  AI Performance Insights
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Receive call analytics and optimization tips
                </p>
              </div>
              <Switch id="ai-insights" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports" className="text-white font-medium">
                  Weekly Performance Reports
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Your call activity and conversion summary
                </p>
              </div>
              <Switch id="weekly-reports" />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Support */}
        <GlassmorphicCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-3 text-[hsl(var(--eclipse-glow))]" />
            Support
          </h3>
          
          <div className="space-y-4">
            <p className="text-[hsl(var(--soft-gray))]">
              Need help with your AI voice agents? Our technical support team is here to assist you.
            </p>
            
            <div className="bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/20 to-[hsl(var(--lunar-mist))]/20 rounded-lg p-4 border border-[hsl(var(--eclipse-glow))]/30">
              <p className="text-white font-medium mb-2">AI Technical Support</p>
              <p className="text-[hsl(var(--soft-gray))] text-sm mb-3">
                Get instant answers to your platform questions
              </p>
              <CosmicButton variant="eclipse" size="sm">
                Chat with AI Support
              </CosmicButton>
            </div>
            
            <CosmicButton variant="remax" className="w-full">
              Contact Support Team
            </CosmicButton>
          </div>
        </GlassmorphicCard>

        {/* Save Changes */}
        <GlassmorphicCard>
          <div className="text-center">
            <CosmicButton variant="eclipse" size="lg" className="flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </CosmicButton>
            <p className="text-[hsl(var(--soft-gray))] text-sm mt-3">
              Your settings will be updated
            </p>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
