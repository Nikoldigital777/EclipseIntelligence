import { User, Bell, Save, MessageCircle } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Settings() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[hsl(var(--soft-gray))]">Alignment - Configure your cosmic preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <GlassmorphicCard>
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
                <p className="text-[hsl(var(--soft-gray))] text-sm">Eclipse Rising Agent</p>
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
        <GlassmorphicCard>
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
                  Get notified when cosmic opportunities align
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
                  Never miss a manifestation moment
                </p>
              </div>
              <Switch id="callback-reminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights" className="text-white font-medium">
                  AI Cosmic Insights
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Receive lunar guidance and tips
                </p>
              </div>
              <Switch id="ai-insights" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports" className="text-white font-medium">
                  Weekly Moon Reports
                </Label>
                <p className="text-[hsl(var(--soft-gray))] text-sm">
                  Your cosmic performance summary
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
              Need help navigating your cosmic journey? Our manifestation support team is here to guide you.
            </p>
            
            <div className="bg-gradient-to-r from-[hsl(var(--eclipse-glow))]/20 to-[hsl(var(--lunar-mist))]/20 rounded-lg p-4 border border-[hsl(var(--eclipse-glow))]/30">
              <p className="text-white font-medium mb-2">Manifestation AI Support</p>
              <p className="text-[hsl(var(--soft-gray))] text-sm mb-3">
                Get instant answers to your cosmic questions
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
              Your cosmic alignment will be updated
            </p>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
