import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StarField from "@/components/StarField";
import CosmicButton from "@/components/CosmicButton";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CustomCursor from "@/components/CustomCursor";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [formAnimation, setFormAnimation] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState(false);

  useEffect(() => {
    // Staggered entrance animations
    setTimeout(() => setIsVisible(true), 200);
    setTimeout(() => setLogoAnimation(true), 600);
    setTimeout(() => setFormAnimation(true), 1000);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, this would validate credentials
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />
      <CustomCursor />
      
      {/* Enhanced floating cosmic elements */}
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-20 transition-all duration-1000 ${isVisible ? 'animate-float' : 'opacity-0 scale-0'}`}>
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full eclipse-shadow animate-morphing-gradient"></div>
      </div>
      
      {/* Additional floating particles */}
      <div className={`absolute top-1/4 right-1/4 w-16 h-16 opacity-10 transition-all duration-1500 delay-300 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-10'}`}>
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full blur-xl animate-pulse-slow"></div>
      </div>
      
      <div className={`absolute bottom-1/4 left-1/4 w-20 h-20 opacity-15 transition-all duration-2000 delay-500 ${isVisible ? 'animate-float' : 'opacity-0 -translate-y-10'}`}>
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full blur-2xl animate-aurora"></div>
      </div>

      <GlassmorphicCard 
        className={`w-full max-w-md relative z-10 transition-all duration-1000 ${isVisible ? 'animate-text-reveal' : 'opacity-0 scale-95 translate-y-8'}`}
        intense={true}
        tiltEffect={true}
      >
        <div className="text-center mb-6">
          <div className={`flex items-center justify-center mb-6 transition-all duration-1000 delay-200 ${logoAnimation ? 'animate-text-reveal' : 'opacity-0 scale-0'}`}>
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow hover:scale-110 transition-transform duration-300 cursor-pointer micro-interaction">
                <span className="text-3xl animate-float">🌙</span>
              </div>
              {/* Floating sparkles around logo */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-[hsl(var(--eclipse-glow))] rounded-full animate-twinkle"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[hsl(var(--gold-manifest))] rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-[hsl(var(--lunar-mist))] rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
          <h1 className={`text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-[hsl(var(--eclipse-glow))] to-white bg-clip-text transition-all duration-1000 delay-400 ${logoAnimation ? 'animate-text-reveal' : 'opacity-0'}`}>
            RE/MAX Eclipse Dashboard
          </h1>
          <p className={`text-[hsl(var(--soft-gray))] text-lg transition-all duration-1000 delay-600 ${logoAnimation ? 'animate-text-reveal' : 'opacity-0'}`}>
            Welcome back, Levan. Ready to manifest results?
          </p>
        </div>
        
        <form onSubmit={handleLogin} className={`space-y-6 transition-all duration-1000 delay-800 ${formAnimation ? 'animate-text-reveal' : 'opacity-0'}`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder:text-[hsl(var(--soft-gray))] focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] focus:border-transparent focus:scale-105 transition-all duration-300 micro-interaction h-12"
                placeholder="levan@remaxeclipse.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder:text-[hsl(var(--soft-gray))] focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] focus:border-transparent focus:scale-105 transition-all duration-300 micro-interaction h-12"
                placeholder="Enter your cosmic key"
                required
              />
            </div>
          </div>

          <CosmicButton 
            variant="remax" 
            size="lg" 
            className="w-full h-14 text-lg font-semibold micro-interaction hover:scale-105"
            onClick={handleLogin}
          >
            <span className="flex items-center space-x-2">
              <span>Manifest Login</span>
              <span className="text-xl">✨</span>
            </span>
          </CosmicButton>

          <div className="text-center space-y-3">
            <Button 
              type="button" 
              variant="link" 
              className="text-[hsl(var(--eclipse-glow))] hover:text-white hover:scale-105 transition-all duration-300 micro-interaction"
            >
              <span className="flex items-center space-x-2">
                <span>Use Magic Link</span>
                <span>🪄</span>
              </span>
            </Button>
            
            <div className="text-sm text-[hsl(var(--soft-gray))]">
              Having trouble? 
              <Button 
                type="button" 
                variant="link" 
                className="text-[hsl(var(--eclipse-glow))] hover:text-white p-0 ml-1 micro-interaction"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </form>
      </GlassmorphicCard>

      {/* Enhanced footer with animated tagline */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-[hsl(var(--soft-gray))] z-10 transition-all duration-1000 delay-1200 ${formAnimation ? 'animate-text-reveal' : 'opacity-0'}`}>
        <p className="text-sm flex items-center space-x-2 hover:text-[hsl(var(--eclipse-glow))] transition-colors duration-300 cursor-default">
          <span>✨</span>
          <span>Manifesting magic, one call at a time</span>
          <span>✨</span>
        </p>
        
        {/* Subtle floating dots */}
        <div className="flex justify-center space-x-2 mt-3">
          <div className="w-1 h-1 bg-[hsl(var(--eclipse-glow))] rounded-full animate-twinkle"></div>
          <div className="w-1 h-1 bg-[hsl(var(--lunar-mist))] rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
          <div className="w-1 h-1 bg-[hsl(var(--gold-manifest))] rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </div>
  );
}
