
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Sparkles, BarChart3, Phone, Users, Settings, Calendar } from 'lucide-react';
import GlassmorphicCard from './GlassmorphicCard';
import CosmicButton from './CosmicButton';
import { Button } from '@/components/ui/button';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  page?: string;
  icon: React.ReactNode;
  actionText?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to RE/MAX Eclipse Dashboard',
    description: 'Your AI-powered phone agent management system. Let us show you around and discover what you can accomplish.',
    position: 'center',
    page: 'login',
    icon: <Sparkles className="w-6 h-6" />,
    actionText: 'Start Tour'
  },
  {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'Your command center showing real-time call metrics, active agents, and performance insights. Monitor your AI agents at a glance.',
    target: '.dashboard-stats',
    position: 'bottom',
    page: 'dashboard',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'ai-avatar',
    title: 'AI Agent Status',
    description: 'This shows your AI agent status. When active, your agents are ready to handle incoming calls professionally.',
    target: '.ai-avatar',
    position: 'bottom',
    page: 'dashboard',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'Access frequently used features like creating new agents, scheduling calls, or viewing recent activity.',
    target: '.quick-actions',
    position: 'left',
    page: 'dashboard',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'agents-page',
    title: 'Manage Your AI Agents',
    description: 'Create, configure, and monitor your AI phone agents. Set up personalities, scripts, and behaviors for different call types.',
    position: 'center',
    page: 'agents',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'call-history',
    title: 'Call History & Analytics',
    description: 'Review all your call records, listen to recordings, and analyze conversation performance to improve your agents.',
    position: 'center',
    page: 'call-history',
    icon: <Phone className="w-6 h-6" />
  },
  {
    id: 'outbound-calls',
    title: 'Outbound Call Campaigns',
    description: 'Launch targeted calling campaigns, upload contact lists, and schedule automated outreach with your AI agents.',
    position: 'center',
    page: 'outbound-calls',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    description: 'Deep dive into your call metrics, conversion rates, and agent performance with detailed charts and insights.',
    position: 'center',
    page: 'analytics',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'settings',
    title: 'System Settings',
    description: 'Configure your API integrations, notification preferences, and system-wide settings for optimal performance.',
    position: 'center',
    page: 'settings',
    icon: <Settings className="w-6 h-6" />
  },
  {
    id: 'complete',
    title: 'Tour Complete!',
    description: 'You\'re all set! Start by creating your first AI agent or explore the dashboard to see your system in action.',
    position: 'center',
    icon: <Sparkles className="w-6 h-6" />
  }
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (path: string) => void;
}

export default function GuidedTour({ isOpen, onClose, currentPage, onNavigate }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Find the appropriate step for the current page
      const pageStep = tourSteps.findIndex(step => 
        step.page === currentPage || (currentPage === 'login' && step.id === 'welcome')
      );
      if (pageStep !== -1) {
        setCurrentStep(pageStep);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, currentPage]);

  const currentTourStep = tourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepData = tourSteps[currentStep + 1];
      
      // Navigate to the next page if needed
      if (nextStepData.page && nextStepData.page !== currentPage) {
        const pageMap: Record<string, string> = {
          'dashboard': '/',
          'agents': '/agents',
          'call-history': '/call-history',
          'outbound-calls': '/outbound-calls',
          'analytics': '/analytics',
          'settings': '/settings'
        };
        
        if (pageMap[nextStepData.page]) {
          onNavigate(pageMap[nextStepData.page]);
          // Wait a moment for navigation to complete
          setTimeout(() => {
            setCurrentStep(currentStep + 1);
          }, 500);
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepData = tourSteps[currentStep - 1];
      
      // Navigate to the previous page if needed
      if (prevStepData.page && prevStepData.page !== currentPage) {
        const pageMap: Record<string, string> = {
          'dashboard': '/',
          'agents': '/agents',
          'call-history': '/call-history',
          'outbound-calls': '/outbound-calls',
          'analytics': '/analytics',
          'settings': '/settings'
        };
        
        if (pageMap[prevStepData.page]) {
          onNavigate(pageMap[prevStepData.page]);
          // Wait a moment for navigation to complete
          setTimeout(() => {
            setCurrentStep(currentStep - 1);
          }, 500);
          return;
        }
      }
      
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!currentTourStep.target) return {};
    
    const element = document.querySelector(currentTourStep.target);
    if (!element) return {};
    
    const rect = element.getBoundingClientRect();
    const position = currentTourStep.position;
    
    switch (position) {
      case 'top':
        return {
          top: rect.top - 20,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: rect.bottom + 20,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 20,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 20,
          transform: 'translate(0, -50%)'
        };
      default:
        return {};
    }
  };

  if (!isVisible || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Highlight target element */}
      {currentTourStep.target && (
        <div 
          className="absolute border-4 border-[#00D9FF] rounded-lg shadow-lg shadow-[#00D9FF]/30 pointer-events-none animate-pulse"
          style={{
            ...(() => {
              const element = document.querySelector(currentTourStep.target!);
              if (!element) return {};
              const rect = element.getBoundingClientRect();
              return {
                top: rect.top - 4,
                left: rect.left - 4,
                width: rect.width + 8,
                height: rect.height + 8
              };
            })()
          }}
        />
      )}
      
      {/* Tour Card */}
      <div 
        className="absolute pointer-events-auto"
        style={
          currentTourStep.position === 'center' 
            ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
            : getTooltipPosition()
        }
      >
        <GlassmorphicCard className="w-96 max-w-[90vw] relative" intense={true}>
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Step content */}
          <div className="p-6 pt-8">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#6C63FF] rounded-full flex items-center justify-center">
                  {currentTourStep.icon}
                </div>
                <div className="text-sm text-white/70">
                  Step {currentStep + 1} of {tourSteps.length}
                </div>
              </div>
              <div className="flex space-x-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentStep ? 'bg-[#00D9FF]' : 
                      index < currentStep ? 'bg-[#6C63FF]' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Title and description */}
            <h3 className="text-xl font-bold text-white mb-3">
              {currentTourStep.title}
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              {currentTourStep.description}
            </p>
            
            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <CosmicButton
                variant="accent"
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <span>Finish Tour</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>{currentTourStep.actionText || 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </CosmicButton>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
