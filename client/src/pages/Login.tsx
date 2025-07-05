import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StarField from "@/components/StarField";
import CosmicButton from "@/components/CosmicButton";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, this would validate credentials
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />
      
      {/* Animated lunar crescent */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-20 animate-float">
        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full eclipse-shadow"></div>
      </div>

      <Card className="w-full max-w-md glassmorphism border-white/10 relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--eclipse-glow))] to-[hsl(var(--lunar-mist))] rounded-full flex items-center justify-center eclipse-shadow animate-pulse-slow">
              <span className="text-2xl">🌙</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">RE/MAX Eclipse Dashboard</CardTitle>
          <CardDescription className="text-[hsl(var(--soft-gray))] text-lg">
            Welcome back, Levan. Ready to manifest results?
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder:text-[hsl(var(--soft-gray))] focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[hsl(var(--lunar-glass))] border-white/20 text-white placeholder:text-[hsl(var(--soft-gray))] focus:ring-2 focus:ring-[hsl(var(--eclipse-glow))] focus:border-transparent"
                required
              />
            </div>

            <CosmicButton 
              variant="remax" 
              size="lg" 
              className="w-full"
              onClick={handleLogin}
            >
              Login
            </CosmicButton>

            <div className="text-center space-y-2">
              <Button 
                type="button" 
                variant="link" 
                className="text-[hsl(var(--eclipse-glow))] hover:text-white"
              >
                Use Magic Link
              </Button>
              
              <div className="text-sm text-[hsl(var(--soft-gray))]">
                Having trouble? 
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-[hsl(var(--eclipse-glow))] hover:text-white p-0 ml-1"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-[hsl(var(--soft-gray))] z-10">
        <p className="text-sm">Manifesting magic, one call at a time.</p>
      </div>
    </div>
  );
}
