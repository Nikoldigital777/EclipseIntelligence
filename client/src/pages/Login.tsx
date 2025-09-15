import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StarField from "@/components/StarField";
import CosmicButton from "@/components/CosmicButton";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CustomCursor from "@/components/CustomCursor";
import { AuthService } from "@/lib/auth";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    setIsVisible(true);
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthService.login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--deep-night))] via-[hsl(var(--lunar-glass))] to-[hsl(var(--deep-night))]"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,hsl(var(--eclipse-glow))_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,hsl(var(--remax-red))_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,hsl(var(--lunar-mist))_0%,transparent_50%)]"></div>
      </div>
      
      <StarField />
      
      {/* Floating cosmic elements */}
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-24 opacity-30 transition-all duration-1000 ${isVisible ? 'animate-float' : 'opacity-0 scale-0'}`}>
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full blur-sm"></div>
      </div>
      
      <div className={`absolute top-1/4 right-1/4 w-12 h-12 opacity-20 transition-all duration-1500 delay-300 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-10'}`}>
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] rounded-full blur-lg"></div>
      </div>
      
      <div className={`absolute bottom-1/4 left-1/4 w-16 h-16 opacity-25 transition-all duration-2000 delay-500 ${isVisible ? 'animate-float' : 'opacity-0 -translate-y-10'}`}>
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--lunar-mist))] to-[hsl(var(--eclipse-glow))] rounded-full blur-xl"></div>
      </div>

      <GlassmorphicCard 
        className={`w-full max-w-md relative z-10 transition-all duration-600 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-98'}`}
        intense={true}
        tiltEffect={true}
      >
        <div className="text-center mb-6">
          <div className={`flex items-center justify-center mb-6 transition-all duration-700 ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-98'}`}>
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-3xl animate-float">🌙</span>
              </div>
              {/* Floating sparkles around logo */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-[hsl(var(--eclipse-glow))] rounded-full animate-twinkle"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[hsl(var(--gold-manifest))] rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-[hsl(var(--lunar-mist))] rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
          <h1 className={`text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-[hsl(var(--eclipse-glow))] to-white bg-clip-text transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            RE/MAX Eclipse Dashboard
          </h1>
          <p className={`text-white text-lg transition-all duration-700 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            Welcome back, Levan. Ready to manage your AI phone agents?
          </p>
        </div>
        
        <form onSubmit={handleLogin} className={`space-y-6 transition-all duration-700 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder:text-[hsl(var(--soft-gray))] focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] focus:border-transparent focus:scale-102 transition-all duration-200 h-12"
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
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder:text-[hsl(var(--soft-gray))] focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] focus:border-transparent focus:scale-102 transition-all duration-200 h-12"
                placeholder="Enter your secure password"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-semibold hover:scale-102 transition-transform duration-200 bg-gradient-to-br from-[hsl(var(--remax-red))] to-[hsl(var(--gold-manifest))] text-white rounded-lg remax-shadow border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <span className="text-xl">🚀</span>
                </>
              )}
            </span>
          </button>

          <div className="text-center space-y-3">
            <Button 
              type="button" 
              variant="link" 
              className="text-[hsl(var(--eclipse-glow))] hover:text-white hover:scale-102 transition-all duration-200"
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
                className="text-[hsl(var(--eclipse-glow))] hover:text-white p-0 ml-1 hover:scale-102 transition-all duration-200"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </form>
      </GlassmorphicCard>

      {/* Enhanced footer with animated tagline */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10 transition-all duration-700 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
        <p className="text-white text-sm flex items-center space-x-2 hover:text-[hsl(var(--eclipse-glow))] transition-colors duration-200 cursor-default">
          <span>🤖</span>
          <span>AI-powered conversations, exceptional results</span>
          <span>🤖</span>
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
